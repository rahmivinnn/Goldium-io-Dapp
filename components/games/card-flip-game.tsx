"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  CreditCard, Clock, Trophy, Wallet, Sparkles, Star, Brain, Gamepad2,
  Zap, Gift, Flame, Heart, Shield, Rocket, Eye, Timer, Search,
  Sparkle, Fireworks, PartyPopper, Medal, Lightbulb, Compass
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import confetti from "canvas-confetti"

// Helper function for particle effects
const createWinEffect = (type: string) => {
  switch(type) {
    case 'confetti':
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      break;
    case 'stars':
      confetti({
        particleCount: 60,
        spread: 100,
        shapes: ['star'],
        colors: ['#FFD700', '#FFC107', '#FFEB3B'],
        origin: { y: 0.6 }
      });
      break;
    case 'cards':
      confetti({
        particleCount: 80,
        angle: 90,
        spread: 360,
        shapes: ['square'],
        colors: ['#4CAF50', '#2196F3', '#9C27B0', '#F44336'],
        origin: { y: 0.5, x: 0.5 }
      });
      break;
    case 'jackpot':
      // Multiple bursts for jackpot
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 150,
          angle: 60,
          spread: 80,
          origin: { x: 0, y: 0.6 }
        });
      }, 200);
      setTimeout(() => {
        confetti({
          particleCount: 150,
          angle: 120,
          spread: 80,
          origin: { x: 1, y: 0.6 }
        });
      }, 400);
      break;
  }
};

// Memory Master characters with special abilities
const MEMORY_MASTERS = [
  {
    id: "novice",
    name: "Novice Nelly",
    image: "/images/solana-logo.png",
    description: "Reveals one random card at the start of the game",
    ability: "REVEAL_ONE",
    rarity: "common",
    animation: "pulse",
    unlockLevel: 1
  },
  {
    id: "timekeeper",
    name: "Timekeeper Tim",
    image: "/gold-logo.png",
    description: "Adds 10 seconds to the timer",
    ability: "EXTRA_TIME",
    rarity: "uncommon",
    animation: "spin",
    unlockLevel: 3
  },
  {
    id: "matcher",
    name: "Matcher Mia",
    image: "/gold_icon-removebg-preview.png",
    description: "10% chance to auto-match a pair when flipping a card",
    ability: "AUTO_MATCH",
    rarity: "rare",
    animation: "bounce",
    unlockLevel: 5
  },
  {
    id: "multiplier",
    name: "Multiplier Max",
    image: "/images/mana-logo.png",
    description: "Increases reward multiplier by 0.5x",
    ability: "BOOST_MULTIPLIER",
    rarity: "epic",
    animation: "glitter",
    unlockLevel: 10
  },
  {
    id: "perfectionist",
    name: "Perfectionist Penny",
    image: "/gold-logo.png",
    description: "Perfect game (no mistakes) gives 2x reward",
    ability: "PERFECT_BONUS",
    rarity: "legendary",
    animation: "rainbow",
    unlockLevel: 15
  }
]

// Enhanced card themes with special effects
const CARD_THEMES = [
  {
    id: "fantasy",
    name: "Fantasy",
    symbols: ["🧙‍♂️", "🧝‍♀️", "🧚", "🦄", "🐉", "🏰", "⚔️", "🛡️", "🔮", "👑", "🧪", "🧿"],
    bgColor: "from-purple-900 to-indigo-900",
    cardColor: "bg-indigo-600",
    matchEffect: "magic",
    description: "Magical creatures and mystical items",
    rarity: "uncommon",
    unlockLevel: 2
  },
  {
    id: "space",
    name: "Space",
    symbols: ["🚀", "👨‍🚀", "🛸", "🪐", "🌌", "☄️", "🌠", "🌍", "👽", "🤖", "🛰️", "🔭"],
    bgColor: "from-blue-900 to-purple-900",
    cardColor: "bg-blue-600",
    matchEffect: "stardust",
    description: "Cosmic wonders and space exploration",
    rarity: "rare",
    unlockLevel: 4
  },
  {
    id: "animals",
    name: "Animals",
    symbols: ["🐶", "🐱", "🦊", "🦁", "🐯", "🐻", "🐼", "🐨", "🐮", "🐷", "🐸", "🦉"],
    bgColor: "from-green-900 to-teal-900",
    cardColor: "bg-green-600",
    matchEffect: "paws",
    description: "Adorable creatures from the animal kingdom",
    rarity: "common",
    unlockLevel: 1
  },
  {
    id: "food",
    name: "Food",
    symbols: ["🍕", "🍔", "🍦", "🍩", "🍰", "🍓", "🍎", "🍌", "🥑", "🍣", "🍜", "🍪"],
    bgColor: "from-red-900 to-orange-900",
    cardColor: "bg-red-600",
    matchEffect: "yummy",
    description: "Delicious treats and tasty delights",
    rarity: "uncommon",
    unlockLevel: 3
  },
  {
    id: "goldium",
    name: "Goldium",
    symbols: ["💰", "🪙", "👑", "💎", "🏆", "✨", "⭐", "🔥", "⚡", "🌟", "💫", "🌈"],
    bgColor: "from-yellow-800 to-amber-900",
    cardColor: "bg-gold",
    matchEffect: "treasure",
    description: "Precious treasures and golden wonders",
    rarity: "epic",
    unlockLevel: 7
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    symbols: ["🤖", "🔌", "💻", "🎮", "🕹️", "📱", "🔋", "📡", "🎧", "👾", "🎭", "🔍"],
    bgColor: "from-pink-900 to-purple-900",
    cardColor: "bg-pink-600",
    matchEffect: "glitch",
    description: "Futuristic tech and digital wonders",
    rarity: "legendary",
    unlockLevel: 12
  }
]

export default function CardFlipGame() {
  const { toast } = useToast()
  const { connected, goldBalance, sendTransaction, connection, publicKey, refreshBalance } = useSolanaWallet()
  const cardGridRef = useRef<HTMLDivElement>(null)
  const cardAnimationControls = useAnimation()

  // Game state
  const [betAmount, setBetAmount] = useState(25)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [cards, setCards] = useState<Array<{
    id: number;
    symbol: string;
    flipped: boolean;
    matched: boolean;
    revealed?: boolean;
    autoMatched?: boolean;
  }>>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const [gameHistory, setGameHistory] = useState<
    Array<{
      bet: number;
      pairs: number;
      moves: number;
      time: number;
      won: boolean;
      reward: number;
      perfect?: boolean;
      specialEvent?: string;
    }>
  >([])
  const [balance, setBalance] = useState(1850)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")
  const [gameMode, setGameMode] = useState<"demo" | "paid">("demo")
  const [selectedTheme, setSelectedTheme] = useState(CARD_THEMES[2]) // Default to Animals theme
  const [showThemeSelect, setShowThemeSelect] = useState(false)
  const [transactionPending, setTransactionPending] = useState(false)
  const [transactionHash, setTransactionHash] = useState("")

  // Progression system
  const [playerLevel, setPlayerLevel] = useState(1)
  const [playerXP, setPlayerXP] = useState(0)
  const [xpToNextLevel, setXpToNextLevel] = useState(100)
  const [totalWinnings, setTotalWinnings] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(["animals"])
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [selectedMaster, setSelectedMaster] = useState(MEMORY_MASTERS[0]) // Default to Novice Nelly
  const [unlockedMasters, setUnlockedMasters] = useState<string[]>(["novice"])
  const [showMasterSelect, setShowMasterSelect] = useState(false)

  // Special effects and abilities
  const [specialAbilityActive, setSpecialAbilityActive] = useState(false)
  const [specialAbilityMessage, setSpecialAbilityMessage] = useState("")
  const [revealedCard, setRevealedCard] = useState<number | null>(null)
  const [perfectGame, setPerfectGame] = useState(true) // Track if no mistakes were made
  const [bonusTime, setBonusTime] = useState(0) // Extra time from abilities
  const [comboMultiplier, setComboMultiplier] = useState(1) // Multiplier for fast matches
  const [lastMatchTime, setLastMatchTime] = useState(0) // Time of last match for combo tracking
  const [showComboMessage, setShowComboMessage] = useState(false)
  const [jackpotChance, setJackpotChance] = useState(0.001) // 0.1% base chance
  const [jackpotAmount, setJackpotAmount] = useState(5000)
  const [showJackpot, setShowJackpot] = useState(false)
  const [matchEffect, setMatchEffect] = useState("default")
  const [hintUsed, setHintUsed] = useState(false)
  const [hintsAvailable, setHintsAvailable] = useState(1) // Number of hints available

  // Visual effects
  const [cardFlipSpeed, setCardFlipSpeed] = useState(1)
  const [particleEffect, setParticleEffect] = useState("confetti")
  const [showSpecialAnimation, setShowSpecialAnimation] = useState(false)
  const [specialAnimationType, setSpecialAnimationType] = useState("")
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    gamesWon: 0,
    totalPairsMatched: 0,
    fastestWin: 999,
    fewestMoves: 999
  })

  // Game settings
  const maxBet = 200
  const minBet = 5
  const baseXpPerMatch = 5
  const baseXpPerWin = 30
  const perfectBonusXp = 20
  const comboTimeWindow = 3000 // 3 seconds for combo
  const maxComboMultiplier = 3

  // Calculate XP needed for each level
  const calculateXpForLevel = (level: number) => Math.floor(100 * Math.pow(1.5, level - 1))

  // Update balance from wallet when connected
  useEffect(() => {
    if (connected && gameMode === "paid") {
      setBalance(goldBalance)
    } else if (gameMode === "demo") {
      setBalance(1850) // Reset to default demo balance
    }
  }, [connected, goldBalance, gameMode])

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('cardFlipProgress')
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress)
        setPlayerLevel(progress.level || 1)
        setPlayerXP(progress.xp || 0)
        setXpToNextLevel(calculateXpForLevel(progress.level || 1))
        setTotalWinnings(progress.totalWinnings || 0)
        setAchievements(progress.achievements || [])
        setUnlockedThemes(progress.unlockedThemes || ["animals"])
        setUnlockedMasters(progress.unlockedMasters || ["novice"])
        setGameStats(progress.gameStats || {
          gamesPlayed: 0,
          gamesWon: 0,
          totalPairsMatched: 0,
          fastestWin: 999,
          fewestMoves: 999
        })

        // Set default selections based on unlocked items
        if (progress.unlockedThemes && progress.unlockedThemes.length > 0) {
          const themeId = progress.unlockedThemes[0]
          const theme = CARD_THEMES.find(t => t.id === themeId)
          if (theme) setSelectedTheme(theme)
        }

        if (progress.unlockedMasters && progress.unlockedMasters.length > 0) {
          const masterId = progress.unlockedMasters[0]
          const master = MEMORY_MASTERS.find(m => m.id === masterId)
          if (master) setSelectedMaster(master)
        }
      } catch (e) {
        console.error("Error loading saved progress:", e)
      }
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    const progress = {
      level: playerLevel,
      xp: playerXP,
      totalWinnings,
      achievements,
      unlockedThemes,
      unlockedMasters,
      gameStats
    }
    localStorage.setItem('cardFlipProgress', JSON.stringify(progress))
  }, [playerLevel, playerXP, totalWinnings, achievements, unlockedThemes, unlockedMasters, gameStats])

  // Check for level up
  useEffect(() => {
    if (playerXP >= xpToNextLevel) {
      // Level up!
      const newLevel = playerLevel + 1
      setPlayerLevel(newLevel)
      setPlayerXP(playerXP - xpToNextLevel)
      setXpToNextLevel(calculateXpForLevel(newLevel))
      setShowLevelUp(true)

      // Check for theme unlocks
      const newThemeUnlocks = CARD_THEMES.filter(theme =>
        theme.unlockLevel === newLevel && !unlockedThemes.includes(theme.id)
      )

      if (newThemeUnlocks.length > 0) {
        const newUnlockedIds = newThemeUnlocks.map(theme => theme.id)
        setUnlockedThemes([...unlockedThemes, ...newUnlockedIds])

        toast({
          title: "New Card Theme Unlocked!",
          description: `You've unlocked ${newThemeUnlocks.map(t => t.name).join(', ')}!`,
          variant: "default",
        })
      }

      // Check for master unlocks
      const newMasterUnlocks = MEMORY_MASTERS.filter(master =>
        master.unlockLevel === newLevel && !unlockedMasters.includes(master.id)
      )

      if (newMasterUnlocks.length > 0) {
        const newUnlockedIds = newMasterUnlocks.map(master => master.id)
        setUnlockedMasters([...unlockedMasters, ...newUnlockedIds])

        toast({
          title: "New Memory Master Unlocked!",
          description: `You've unlocked ${newMasterUnlocks.map(m => m.name).join(', ')}!`,
          variant: "default",
        })
      }

      // Show level up toast
      toast({
        title: "Level Up!",
        description: `Congratulations! You are now level ${newLevel}!`,
        variant: "default",
      })

      // Hide level up message after 3 seconds
      setTimeout(() => {
        setShowLevelUp(false)
      }, 3000)

      // Add hint if level is multiple of 5
      if (newLevel % 5 === 0) {
        setHintsAvailable(prev => prev + 1)
        toast({
          title: "Hint Awarded!",
          description: "You've earned an extra hint to use in your games!",
          variant: "default",
        })
      }
    }
  }, [playerXP, xpToNextLevel, playerLevel, unlockedThemes, unlockedMasters])

  // Check for combo multiplier
  useEffect(() => {
    if (isPlaying && matchedPairs > 0) {
      const now = Date.now()
      if (lastMatchTime > 0 && now - lastMatchTime < comboTimeWindow) {
        // Combo achieved!
        const newMultiplier = Math.min(comboMultiplier + 0.5, maxComboMultiplier)
        setComboMultiplier(newMultiplier)
        setShowComboMessage(true)

        // Hide combo message after 2 seconds
        setTimeout(() => {
          setShowComboMessage(false)
        }, 2000)
      } else {
        // Combo broken or first match
        setComboMultiplier(1)
      }
    }
  }, [matchedPairs, isPlaying, lastMatchTime])

  // Game configurations based on difficulty
  const difficultySettings = {
    easy: { pairs: 6, timeLimit: 60, multiplier: 1.5 },
    medium: { pairs: 8, timeLimit: 90, multiplier: 2 },
    hard: { pairs: 12, timeLimit: 120, multiplier: 3 },
  }

  const handleBetAmountChange = (value: number[]) => {
    setBetAmount(value[0])
  }

  const handleMaxBet = () => {
    setBetAmount(Math.min(balance, maxBet))
  }

  // Process special character abilities
  const processCharacterAbility = () => {
    setSpecialAbilityActive(false)
    setSpecialAbilityMessage("")

    // Check for special abilities based on character
    switch(selectedMaster.ability) {
      case "REVEAL_ONE":
        // Novice Nelly: Reveals one random card at the start of the game
        if (cards.length > 0) {
          // Find a card that's not already revealed
          const availableCards = cards.filter(card => !card.revealed && !card.matched)
          if (availableCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableCards.length)
            const cardToReveal = availableCards[randomIndex]

            // Update the card to be revealed
            setCards(prevCards =>
              prevCards.map(card =>
                card.id === cardToReveal.id
                  ? { ...card, revealed: true, flipped: true }
                  : card
              )
            )

            setRevealedCard(cardToReveal.id)
            setSpecialAbilityActive(true)
            setSpecialAbilityMessage("Novice Nelly revealed a card for you!")

            // Hide the revealed card after 2 seconds
            setTimeout(() => {
              setCards(prevCards =>
                prevCards.map(card =>
                  card.id === cardToReveal.id && !card.matched
                    ? { ...card, flipped: false }
                    : card
                )
              )
              setRevealedCard(null)
            }, 2000)

            return { abilityUsed: true, specialEvent: "REVEAL_ONE" }
          }
        }
        break;

      case "EXTRA_TIME":
        // Timekeeper Tim: Adds 10 seconds to the timer
        const extraTime = 10
        setBonusTime(extraTime)
        setSpecialAbilityActive(true)
        setSpecialAbilityMessage(`Timekeeper Tim added ${extraTime} seconds!`)

        setTimeout(() => {
          setSpecialAbilityActive(false)
          setSpecialAbilityMessage("")
        }, 2000)

        return { abilityUsed: true, specialEvent: "EXTRA_TIME" }

      case "BOOST_MULTIPLIER":
        // Multiplier Max: Increases reward multiplier by 0.5x
        setSpecialAbilityActive(true)
        setSpecialAbilityMessage("Multiplier Max boosted your rewards by 0.5x!")

        setTimeout(() => {
          setSpecialAbilityActive(false)
          setSpecialAbilityMessage("")
        }, 2000)

        return { abilityUsed: true, specialEvent: "BOOST_MULTIPLIER" }

      case "PERFECT_BONUS":
        // Perfectionist Penny: Perfect game (no mistakes) gives 2x reward
        // This is checked at the end of the game
        setSpecialAbilityActive(true)
        setSpecialAbilityMessage("Perfectionist Penny is watching your moves!")

        setTimeout(() => {
          setSpecialAbilityActive(false)
          setSpecialAbilityMessage("")
        }, 2000)

        return { abilityUsed: true, specialEvent: "PERFECT_BONUS" }
    }

    return { abilityUsed: false, specialEvent: undefined }
  }

  // Use a hint to reveal a pair briefly
  const useHint = () => {
    if (hintsAvailable <= 0 || !isPlaying || hintUsed) {
      return
    }

    // Find unmatched cards
    const unmatchedCards = cards.filter(card => !card.matched)
    if (unmatchedCards.length <= 0) return

    // Find a pair
    const symbols = [...new Set(unmatchedCards.map(card => card.symbol))]
    if (symbols.length <= 0) return

    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)]
    const pairCards = unmatchedCards.filter(card => card.symbol === randomSymbol)

    if (pairCards.length === 2) {
      // Reveal the pair briefly
      setCards(prevCards =>
        prevCards.map(card =>
          pairCards.some(c => c.id === card.id)
            ? { ...card, flipped: true, revealed: true }
            : card
        )
      )

      setHintUsed(true)
      setHintsAvailable(prev => prev - 1)

      toast({
        title: "Hint Used",
        description: "A pair has been revealed briefly!",
      })

      // Hide the revealed cards after 1.5 seconds
      setTimeout(() => {
        setCards(prevCards =>
          prevCards.map(card =>
            pairCards.some(c => c.id === card.id) && !card.matched
              ? { ...card, flipped: false, revealed: false }
              : card
          )
        )

        // Reset hint used after a delay to allow using another hint later
        setTimeout(() => {
          setHintUsed(false)
        }, 5000)
      }, 1500)
    }
  }

  // Check for achievements
  const checkAchievements = (won: boolean, pairs: number, moves: number, time: number, perfect: boolean) => {
    const newAchievements = [...achievements]
    let achievementUnlocked = false

    // Pairs matched achievements
    if (pairs >= 6 && !achievements.includes("MATCH_6")) {
      newAchievements.push("MATCH_6")
      achievementUnlocked = true
    }
    if (pairs >= 12 && !achievements.includes("MATCH_12")) {
      newAchievements.push("MATCH_12")
      achievementUnlocked = true
    }
    if (pairs >= 24 && !achievements.includes("MATCH_24")) {
      newAchievements.push("MATCH_24")
      achievementUnlocked = true
    }

    // Perfect game achievements
    if (perfect && won && !achievements.includes("PERFECT_GAME")) {
      newAchievements.push("PERFECT_GAME")
      achievementUnlocked = true
    }

    // Speed achievements
    if (won && time <= 30 && !achievements.includes("SPEED_30")) {
      newAchievements.push("SPEED_30")
      achievementUnlocked = true
    }
    if (won && time <= 15 && !achievements.includes("SPEED_15")) {
      newAchievements.push("SPEED_15")
      achievementUnlocked = true
    }

    // Efficiency achievements
    if (won && moves <= pairs * 2 && !achievements.includes("EFFICIENCY")) {
      newAchievements.push("EFFICIENCY")
      achievementUnlocked = true
    }

    if (achievementUnlocked) {
      setAchievements(newAchievements)

      // Award XP for achievement
      setPlayerXP(prev => prev + 50)

      toast({
        title: "Achievement Unlocked!",
        description: "Check your profile to see your new achievements!",
        variant: "default",
      })
    }
  }

  // Check for jackpot
  const checkJackpot = (won: boolean) => {
    if (won && Math.random() < jackpotChance) {
      // Jackpot!
      setBalance(prev => prev + jackpotAmount)
      setTotalWinnings(prev => prev + jackpotAmount)
      setShowJackpot(true)
      setParticleEffect("jackpot")

      // Add achievement if first jackpot
      if (!achievements.includes("FIRST_JACKPOT")) {
        setAchievements(prev => [...prev, "FIRST_JACKPOT"])
      }

      toast({
        title: "JACKPOT!!!",
        description: `Incredible! You won the jackpot of ${jackpotAmount} GOLD!`,
        variant: "default",
      })

      // Hide jackpot message after 5 seconds
      setTimeout(() => {
        setShowJackpot(false)
      }, 5000)

      return { jackpotWon: true, amount: jackpotAmount }
    }

    return { jackpotWon: false, amount: 0 }
  }

  // Handle paid game transaction
  const handlePaidGame = async () => {
    if (!connected || !publicKey || !connection) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to play in paid mode.",
        variant: "destructive",
      })
      return false
    }

    if (betAmount <= 0 || betAmount > goldBalance) {
      toast({
        title: "Invalid Bet",
        description: `Please enter a bet between 1 and ${goldBalance} GOLD.`,
        variant: "destructive",
      })
      return false
    }

    try {
      setTransactionPending(true)

      // Create a transaction to stake GOLD tokens
      const transaction = new Transaction()

      // In a real implementation, this would be a transaction to a smart contract
      // For demo purposes, we'll just transfer to a placeholder address
      const gameAddress = new PublicKey("11111111111111111111111111111111")

      // Add transfer instruction (this is simplified - in a real game you'd use a proper staking contract)
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: gameAddress,
          lamports: betAmount * LAMPORTS_PER_SOL / 100, // Convert GOLD to lamports (simplified)
        })
      )

      // Send transaction
      const signature = await sendTransaction(transaction)
      setTransactionHash(signature)

      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed")

      // Refresh balance
      await refreshBalance()

      setTransactionPending(false)
      return true
    } catch (error: any) {
      console.error("Transaction error:", error)

      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to process your bet.",
        variant: "destructive",
      })

      setTransactionPending(false)
      return false
    }
  }

  // Handle winning payout for paid mode
  const handlePaidWinning = async (winAmount: number) => {
    // In a real implementation, this would be handled by a smart contract
    // For demo purposes, we'll just show a success message

    toast({
      title: "Winnings Credited!",
      description: `${winAmount} GOLD has been credited to your wallet.`,
    })

    // Simulate balance update - in a real implementation this would be handled by the contract
    await refreshBalance()
  }

  // Initialize game
  const startGame = async () => {
    if (betAmount <= 0 || betAmount > balance) {
      toast({
        title: "Invalid Bet",
        description: `Please enter a bet between 1 and ${balance} GOLD.`,
        variant: "destructive",
      })
      return
    }

    // For paid mode, process the transaction first
    if (gameMode === "paid") {
      const success = await handlePaidGame()
      if (!success) return
    } else {
      // Deduct bet amount for demo mode
      setBalance((prev) => prev - betAmount)
    }

    // Reset game state
    setIsPlaying(true)
    setGameOver(false)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setGameTime(0)
    setPerfectGame(true)
    setHintUsed(false)
    setComboMultiplier(1)
    setLastMatchTime(0)
    setShowComboMessage(false)
    setSpecialAbilityActive(false)
    setSpecialAbilityMessage("")
    setRevealedCard(null)
    setBonusTime(0)
    setParticleEffect("confetti")
    setMatchEffect(selectedTheme.matchEffect || "default")

    // Create cards
    const pairs = difficultySettings[difficulty].pairs
    const symbols = [...selectedTheme.symbols].slice(0, pairs)
    const cardDeck = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        flipped: false,
        matched: false,
        revealed: false,
        autoMatched: false
      }))

    setCards(cardDeck)

    // Update game stats
    setGameStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1
    }))

    // Start timer with bonus time from abilities
    if (timer) clearInterval(timer)

    // Apply Timekeeper Tim's ability if selected
    let extraTime = 0
    if (selectedMaster.ability === "EXTRA_TIME") {
      extraTime = 10
      setBonusTime(extraTime)
    }

    const totalTimeLimit = difficultySettings[difficulty].timeLimit + extraTime

    const newTimer = setInterval(() => {
      setGameTime((prev) => {
        if (prev >= totalTimeLimit - 1) {
          clearInterval(newTimer)
          endGame(false)
          return totalTimeLimit
        }
        return prev + 1
      })
    }, 1000)
    setTimer(newTimer)

    // Process character ability
    const { abilityUsed, specialEvent } = processCharacterAbility()

    toast({
      title: "Game Started",
      description: `Find all ${pairs} pairs before time runs out!`,
    })

    // Add some visual flair
    if (cardGridRef.current) {
      cardAnimationControls.start({
        scale: [0.9, 1],
        opacity: [0, 1],
        transition: { duration: 0.5 }
      })
    }
  }

  // Handle card flip
  const flipCard = (id: number) => {
    // Prevent flipping if already two cards are flipped or card is already flipped/matched
    if (flippedCards.length >= 2) return
    if (cards.find((card) => card.id === id)?.flipped) return
    if (cards.find((card) => card.id === id)?.matched) return

    // Flip the card with animation
    setCards((prev) => prev.map((card) => (card.id === id ? { ...card, flipped: true } : card)))

    // Add to flipped cards
    setFlippedCards((prev) => [...prev, id])

    // If two cards are flipped, check for match
    if (flippedCards.length === 1) {
      setMoves((prev) => prev + 1)

      const firstCardId = flippedCards[0]
      const secondCardId = id
      const firstCard = cards.find((card) => card.id === firstCardId)
      const secondCard = cards.find((card) => card.id === secondCardId)

      if (firstCard?.symbol === secondCard?.symbol) {
        // Match found!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstCardId || card.id === secondCardId ? { ...card, matched: true } : card,
            ),
          )

          setMatchedPairs((prev) => {
            const newMatchedPairs = prev + 1

            // Update last match time for combo tracking
            setLastMatchTime(Date.now())

            // Award XP for match
            setPlayerXP(prev => prev + baseXpPerMatch)

            // Play match effect based on theme
            switch(selectedTheme.matchEffect) {
              case "magic":
                createWinEffect("stars")
                break;
              case "stardust":
                createWinEffect("stars")
                break;
              case "paws":
                createWinEffect("confetti")
                break;
              case "yummy":
                createWinEffect("confetti")
                break;
              case "treasure":
                createWinEffect("coins")
                break;
              case "glitch":
                createWinEffect("cards")
                break;
              default:
                // No special effect
            }

            // Check for Matcher Mia's auto-match ability
            if (selectedMaster.ability === "AUTO_MATCH" && Math.random() < 0.1) {
              // Find another unmatched pair
              const unmatchedCards = cards.filter(card => !card.matched && !card.flipped)
              if (unmatchedCards.length >= 2) {
                // Group by symbol
                const symbolGroups: Record<string, number[]> = {}
                unmatchedCards.forEach(card => {
                  if (!symbolGroups[card.symbol]) {
                    symbolGroups[card.symbol] = []
                  }
                  symbolGroups[card.symbol].push(card.id)
                })

                // Find a pair
                const pairSymbols = Object.keys(symbolGroups).filter(symbol => symbolGroups[symbol].length === 2)
                if (pairSymbols.length > 0) {
                  const randomPairSymbol = pairSymbols[Math.floor(Math.random() * pairSymbols.length)]
                  const pairIds = symbolGroups[randomPairSymbol]

                  // Auto-match this pair
                  setTimeout(() => {
                    setSpecialAbilityActive(true)
                    setSpecialAbilityMessage("Matcher Mia found a pair for you!")

                    // Flip the cards
                    setCards(prevCards =>
                      prevCards.map(card =>
                        pairIds.includes(card.id)
                          ? { ...card, flipped: true, autoMatched: true }
                          : card
                      )
                    )

                    // After a short delay, mark them as matched
                    setTimeout(() => {
                      setCards(prevCards =>
                        prevCards.map(card =>
                          pairIds.includes(card.id)
                            ? { ...card, matched: true, autoMatched: true }
                            : card
                        )
                      )
                      setMatchedPairs(prev => prev + 1)

                      // Check if all pairs are matched with this auto-match
                      if (newMatchedPairs + 1 === difficultySettings[difficulty].pairs) {
                        endGame(true)
                      }

                      setSpecialAbilityActive(false)
                      setSpecialAbilityMessage("")
                    }, 1000)
                  }, 500)
                }
              }
            }

            // Check if all pairs are matched
            if (newMatchedPairs === difficultySettings[difficulty].pairs) {
              endGame(true)
            }

            return newMatchedPairs
          })

          setFlippedCards([])
        }, 500)
      } else {
        // No match, flip back after a delay
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstCardId || card.id === secondCardId ? { ...card, flipped: false } : card,
            ),
          )
          setFlippedCards([])

          // Mark as not perfect game since a mistake was made
          setPerfectGame(false)
        }, 1000)
      }
    }
  }

  // End game
  const endGame = async (won: boolean) => {
    setIsPlaying(false)
    setGameOver(true)
    if (timer) clearInterval(timer)
    setTimer(null)

    // Calculate base reward
    let baseReward = won
      ? Math.round(
          betAmount *
            difficultySettings[difficulty].multiplier *
            (1 - moves / (difficultySettings[difficulty].pairs * 3)),
        )
      : 0

    // Apply combo multiplier if active
    if (comboMultiplier > 1) {
      baseReward = Math.round(baseReward * comboMultiplier)
    }

    // Apply Multiplier Max's ability if selected
    let finalReward = baseReward
    let specialEvent = undefined

    if (won) {
      if (selectedMaster.ability === "BOOST_MULTIPLIER") {
        // Multiplier Max: Increases reward multiplier by 0.5x
        const bonusAmount = Math.round(baseReward * 0.5)
        finalReward += bonusAmount
        specialEvent = "BOOST_MULTIPLIER"

        setSpecialAbilityActive(true)
        setSpecialAbilityMessage(`Multiplier Max boosted your reward by ${bonusAmount} GOLD!`)

        setTimeout(() => {
          setSpecialAbilityActive(false)
          setSpecialAbilityMessage("")
        }, 3000)
      }

      // Apply Perfectionist Penny's ability if selected and game was perfect
      if (selectedMaster.ability === "PERFECT_BONUS" && perfectGame) {
        // Perfectionist Penny: Perfect game (no mistakes) gives 2x reward
        const bonusAmount = finalReward
        finalReward *= 2
        specialEvent = "PERFECT_BONUS"

        setSpecialAbilityActive(true)
        setSpecialAbilityMessage(`Perfect game! Penny doubled your reward to ${finalReward} GOLD!`)

        setTimeout(() => {
          setSpecialAbilityActive(false)
          setSpecialAbilityMessage("")
        }, 3000)

        // Extra visual effect for perfect game
        createWinEffect("jackpot")
      }
    }

    // Check for jackpot
    const { jackpotWon, amount: jackpotAmount } = checkJackpot(won)
    if (jackpotWon) {
      finalReward += jackpotAmount
      specialEvent = "JACKPOT"
    }

    // Update balance if won
    if (won) {
      if (gameMode === "demo") {
        setBalance((prev) => prev + finalReward)
      } else if (gameMode === "paid") {
        await handlePaidWinning(finalReward)
      }

      // Update total winnings
      setTotalWinnings(prev => prev + finalReward)

      // Update game stats
      setGameStats(prev => {
        const newStats = {
          ...prev,
          gamesWon: prev.gamesWon + 1,
          totalPairsMatched: prev.totalPairsMatched + matchedPairs,
          fastestWin: Math.min(prev.fastestWin, gameTime),
          fewestMoves: Math.min(prev.fewestMoves, moves)
        }
        return newStats
      })

      // Award XP for winning
      let winXp = baseXpPerWin

      // Bonus XP for perfect game
      if (perfectGame) {
        winXp += perfectBonusXp
      }

      setPlayerXP(prev => prev + winXp)

      // Show appropriate win effect
      if (jackpotWon) {
        createWinEffect("jackpot")
      } else if (perfectGame) {
        createWinEffect("stars")
      } else {
        createWinEffect("confetti")
      }

      // Check for achievements
      checkAchievements(true, matchedPairs, moves, gameTime, perfectGame)
    }

    // Add to history
    setGameHistory((prev) => [
      {
        bet: betAmount,
        pairs: matchedPairs,
        moves,
        time: gameTime,
        won,
        reward: finalReward,
        perfect: perfectGame,
        specialEvent
      },
      ...prev.slice(0, 9), // Keep last 10 games
    ])

    // Show toast with XP info
    toast({
      title: won ? "You Won!" : "Game Over",
      description: won
        ? `Congratulations! You found all pairs and won ${finalReward} GOLD. ${perfectGame ? '+' + (baseXpPerWin + perfectBonusXp) : '+' + baseXpPerWin} XP`
        : `Better luck next time. You lost ${betAmount} GOLD.`,
      variant: won ? "default" : "destructive",
    })
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [timer])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="flex flex-col items-center">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Memory Card Game</h2>
            <p className="text-gray-400">Match pairs of cards before time runs out</p>
          </div>

          {!isPlaying && !gameOver && (
            <div className="w-full max-w-md mb-6">
              {/* Game Mode Selection */}
              <div className="mb-6">
                <Card className="border-gold/30 bg-black/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-gold">Game Mode</CardTitle>
                    <CardDescription>Choose how you want to play</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant={gameMode === "demo" ? "default" : "outline"}
                        className={gameMode === "demo" ? "bg-gold text-black" : "border-gold/50 text-white hover:bg-gold/10"}
                        onClick={() => setGameMode("demo")}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Demo Mode
                      </Button>
                      <Button
                        variant={gameMode === "paid" ? "default" : "outline"}
                        className={gameMode === "paid" ? "bg-gold text-black" : "border-gold/50 text-white hover:bg-gold/10"}
                        onClick={() => setGameMode("paid")}
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        Paid Mode
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {gameMode === "demo"
                        ? "Play with virtual coins for fun!"
                        : "Play with real GOLD tokens for actual rewards!"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Card Theme Selection */}
              <div className="mb-6">
                <Card className="border-gold/30 bg-black/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-gold">Card Theme</CardTitle>
                    <CardDescription>Choose your favorite card theme</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {CARD_THEMES.map((theme) => (
                        <Button
                          key={theme.id}
                          variant="ghost"
                          className={`p-1 ${selectedTheme.id === theme.id ? 'bg-gold/20 ring-2 ring-gold' : ''}`}
                          onClick={() => setSelectedTheme(theme)}
                        >
                          <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-lg overflow-hidden ${theme.cardColor} flex items-center justify-center`}>
                              <span className="text-2xl">{theme.symbols[0]}</span>
                            </div>
                            <span className="text-xs mt-1">{theme.name}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {selectedTheme.symbols.slice(0, 6).map((symbol, index) => (
                        <span key={index} className="text-xl">{symbol}</span>
                      ))}
                      <span className="text-xl">...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Difficulty Selection */}
              <div className="mb-6">
                <Card className="border-gold/30 bg-black/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-gold">Difficulty</CardTitle>
                    <CardDescription>Choose your challenge level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        variant={difficulty === "easy" ? "default" : "outline"}
                        className={
                          difficulty === "easy" ? "bg-gold text-black" : "border-gold/50 text-white hover:bg-gold/10"
                        }
                        onClick={() => setDifficulty("easy")}
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        Easy
                      </Button>
                      <Button
                        variant={difficulty === "medium" ? "default" : "outline"}
                        className={
                          difficulty === "medium" ? "bg-gold text-black" : "border-gold/50 text-white hover:bg-gold/10"
                        }
                        onClick={() => setDifficulty("medium")}
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        Medium
                      </Button>
                      <Button
                        variant={difficulty === "hard" ? "default" : "outline"}
                        className={
                          difficulty === "hard" ? "bg-gold text-black" : "border-gold/50 text-white hover:bg-gold/10"
                        }
                        onClick={() => setDifficulty("hard")}
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        Hard
                      </Button>
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-black/40 p-2 rounded-md">
                          <div className="font-bold">Easy</div>
                          <div>6 pairs</div>
                          <div>60 seconds</div>
                          <div>1.5x multiplier</div>
                        </div>
                        <div className="bg-black/40 p-2 rounded-md">
                          <div className="font-bold">Medium</div>
                          <div>8 pairs</div>
                          <div>90 seconds</div>
                          <div>2x multiplier</div>
                        </div>
                        <div className="bg-black/40 p-2 rounded-md">
                          <div className="font-bold">Hard</div>
                          <div>12 pairs</div>
                          <div>120 seconds</div>
                          <div>3x multiplier</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bet Amount */}
              <div className="mb-6">
                <Card className="border-gold/30 bg-black/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-gold">Bet Amount</CardTitle>
                    <CardDescription>
                      Balance: {balance} GOLD
                      {gameMode === "paid" && connected && (
                        <span className="ml-1 text-xs text-gold">(Real Tokens)</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-2xl font-bold text-gold">{betAmount} GOLD</div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gold/50 text-gold hover:bg-gold/10"
                          onClick={() => setBetAmount(5)}
                        >
                          MIN
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gold/50 text-gold hover:bg-gold/10"
                          onClick={handleMaxBet}
                        >
                          MAX
                        </Button>
                      </div>
                    </div>
                    <Slider
                      defaultValue={[25]}
                      max={maxBet}
                      step={5}
                      value={[betAmount]}
                      onValueChange={handleBetAmountChange}
                    />
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                      <span>Min: 5</span>
                      <span>Max: {maxBet}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {gameMode === "paid" && !connected && (
                <div className="mb-6">
                  <Card className="border-red-500/30 bg-red-950/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 text-red-400">
                        <Wallet className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Wallet Not Connected</p>
                          <p className="text-sm">Connect your wallet to play in paid mode</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {transactionPending && (
                <div className="mb-6">
                  <Card className="border-yellow-500/30 bg-yellow-950/20">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 text-yellow-400">
                        <div className="animate-spin h-5 w-5 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
                        <div>
                          <p className="font-medium">Transaction Pending</p>
                          <p className="text-sm">Please wait while your transaction is being processed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <Button
                className="gold-button w-full"
                disabled={
                  betAmount <= 0 ||
                  betAmount > balance ||
                  (gameMode === "paid" && !connected) ||
                  transactionPending
                }
                onClick={startGame}
              >
                <div className="flex items-center">
                  <Gamepad2 className="h-5 w-5 mr-2" />
                  Start Game
                </div>
              </Button>

              {gameMode === "paid" && (
                <p className="text-xs text-center mt-2 text-gray-400">
                  {connected
                    ? "Playing with real GOLD tokens. Winnings will be credited to your wallet."
                    : "Connect your wallet to play with real GOLD tokens."}
                </p>
              )}
            </div>
          )}

          {(isPlaying || gameOver) && (
            <div className="w-full max-w-xl mb-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gold mr-2" />
                  <span className="font-bold">{formatTime(difficultySettings[difficulty].timeLimit + bonusTime - gameTime)}</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gold mr-2" />
                  <span className="font-bold">
                    {matchedPairs}/{difficultySettings[difficulty].pairs} Pairs
                  </span>
                </div>
                <div className="flex items-center">
                  <Trophy className="h-5 w-5 text-gold mr-2" />
                  <span className="font-bold">{moves} Moves</span>
                </div>
              </div>

              {/* Special ability message */}
              {specialAbilityActive && (
                <div className="mb-4 p-2 bg-gold/20 border border-gold/50 rounded-lg text-center animate-pulse">
                  <p className="text-gold font-medium">{specialAbilityMessage}</p>
                </div>
              )}

              {/* Combo multiplier message */}
              {showComboMessage && comboMultiplier > 1 && (
                <div className="mb-4 p-2 bg-orange-500/20 border border-orange-500/50 rounded-lg text-center">
                  <p className="text-orange-400 font-medium">{comboMultiplier}x Combo Multiplier!</p>
                </div>
              )}

              {/* Jackpot message */}
              {showJackpot && (
                <div className="mb-4 p-3 bg-gradient-to-r from-purple-600/20 via-gold/20 to-orange-500/20 border border-gold/50 rounded-lg text-center">
                  <p className="text-xl font-bold bg-gradient-to-r from-purple-600 via-gold to-orange-500 text-transparent bg-clip-text animate-pulse">
                    JACKPOT! +{jackpotAmount} GOLD!
                  </p>
                </div>
              )}

              {/* Hint button */}
              {isPlaying && hintsAvailable > 0 && !hintUsed && (
                <div className="mb-4 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gold/50 text-gold hover:bg-gold/10"
                    onClick={useHint}
                  >
                    <div className="flex items-center">
                      <Search className="h-4 w-4 mr-1" />
                      Use Hint ({hintsAvailable})
                    </div>
                  </Button>
                </div>
              )}

              <motion.div
                ref={cardGridRef}
                animate={cardAnimationControls}
                className={`grid grid-cols-${difficulty === "hard" ? "6" : "4"} gap-2 mb-4`}
              >
                <AnimatePresence>
                  {cards.map((card) => (
                    <motion.div
                      key={card.id}
                      initial={{ rotateY: 0, scale: 0.9, opacity: 0 }}
                      animate={{
                        rotateY: card.flipped || card.matched ? 180 : 0,
                        scale: 1,
                        opacity: 1,
                        boxShadow: card.matched
                          ? "0 0 15px rgba(34, 197, 94, 0.5)"
                          : card.revealed
                            ? "0 0 15px rgba(234, 179, 8, 0.5)"
                            : "none"
                      }}
                      transition={{
                        duration: card.autoMatched ? 0.5 : 0.3,
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                      className={`aspect-square cursor-pointer ${
                        isPlaying && !card.matched && !card.flipped
                          ? "hover:border-gold hover:shadow-lg hover:shadow-gold/20 hover:scale-105 transition-transform"
                          : ""
                      } ${
                        card.matched
                          ? "border-green-500 shadow-lg shadow-green-500/20"
                          : card.revealed
                            ? "border-yellow-500 shadow-lg shadow-yellow-500/20"
                            : "border-gold/30"
                      } border-2 rounded-lg overflow-hidden perspective-500`}
                      onClick={() => isPlaying && flipCard(card.id)}
                    >
                      <div className="relative w-full h-full transform-style-3d">
                        {/* Card Back */}
                        <div
                          className={`absolute w-full h-full flex items-center justify-center bg-gradient-to-br ${selectedTheme.bgColor} backface-hidden ${
                            card.flipped || card.matched ? "rotate-y-180" : ""
                          }`}
                        >
                          <div className="absolute inset-0 bg-black/40"></div>
                          <div className="relative z-10 flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full ${
                              selectedTheme.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-600 via-gold to-orange-500 p-0.5' :
                              selectedTheme.rarity === 'epic' ? 'bg-gradient-to-r from-purple-600 to-pink-500 p-0.5' :
                              selectedTheme.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 p-0.5' :
                              selectedTheme.rarity === 'uncommon' ? 'bg-gradient-to-r from-green-500 to-emerald-400 p-0.5' :
                              'bg-black/60 p-0.5'
                            } flex items-center justify-center mb-1`}>
                              <div className="w-full h-full rounded-full bg-black/60 flex items-center justify-center">
                                <span className="text-2xl">{selectedTheme.symbols[0]}</span>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-white">{selectedTheme.name}</span>
                          </div>
                        </div>

                        {/* Card Front */}
                        <div
                          className={`absolute w-full h-full flex items-center justify-center ${selectedTheme.cardColor} text-white text-4xl backface-hidden rotate-y-180 ${
                            card.flipped || card.matched ? "rotate-y-0" : ""
                          }`}
                        >
                          <div className="absolute inset-0 bg-black/20"></div>
                          <div className={`relative z-10 ${
                            card.matched && selectedTheme.matchEffect === 'glitch' ? 'animate-pulse' :
                            card.matched && selectedTheme.matchEffect === 'magic' ? 'animate-bounce' :
                            card.matched && selectedTheme.matchEffect === 'stardust' ? 'animate-spin-slow' : ''
                          }`}>
                            {card.symbol}
                          </div>

                          {/* Match indicator */}
                          {card.matched && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                              className="absolute top-1 right-1 bg-green-500 rounded-full p-1"
                            >
                              <Star className="h-3 w-3 text-white" />
                            </motion.div>
                          )}

                          {/* Auto-match indicator */}
                          {card.autoMatched && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center"
                            >
                              <div className="bg-yellow-500/80 rounded-full p-2">
                                <Sparkles className="h-6 w-6 text-white" />
                              </div>
                            </motion.div>
                          )}

                          {/* Revealed indicator */}
                          {card.revealed && !card.matched && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 border-2 border-yellow-500 rounded-lg"
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {gameOver && (
                <div className="text-center mb-4">
                  <div className={`p-6 rounded-lg border-2 ${matchedPairs === difficultySettings[difficulty].pairs ? "border-green-500 bg-green-950/20" : "border-red-500 bg-red-950/20"} mb-4`}>
                    <h3 className={`text-2xl font-bold mb-2 ${matchedPairs === difficultySettings[difficulty].pairs ? "text-green-400" : "text-red-400"}`}>
                      {matchedPairs === difficultySettings[difficulty].pairs ? "You Won!" : "Game Over"}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      {matchedPairs === difficultySettings[difficulty].pairs
                        ? `You found all pairs in ${moves} moves and ${formatTime(gameTime)}!`
                        : `You found ${matchedPairs} out of ${difficultySettings[difficulty].pairs} pairs.`}
                    </p>

                    {matchedPairs === difficultySettings[difficulty].pairs && (
                      <div className="mb-4 p-3 bg-black/40 rounded-lg">
                        <p className="text-gold font-bold">Reward Calculation:</p>
                        <div className="text-sm text-gray-300">
                          <p>Base Bet: {betAmount} GOLD</p>
                          <p>Difficulty Multiplier: {difficultySettings[difficulty].multiplier}x</p>
                          <p>Efficiency Bonus: {Math.round((1 - moves / (difficultySettings[difficulty].pairs * 3)) * 100)}%</p>
                          <p className="text-lg font-bold text-green-400 mt-2">
                            Total Reward: {Math.round(betAmount * difficultySettings[difficulty].multiplier * (1 - moves / (difficultySettings[difficulty].pairs * 3)))} GOLD
                          </p>
                        </div>
                      </div>
                    )}

                    <Button
                      className={matchedPairs === difficultySettings[difficulty].pairs ? "bg-green-500 hover:bg-green-600 text-white" : "gold-button"}
                      onClick={() => {
                        setGameOver(false)
                        setCards([])
                      }}
                    >
                      <div className="flex items-center">
                        <Gamepad2 className="h-5 w-5 mr-2" />
                        Play Again
                      </div>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        {/* Player Level and XP */}
        <Card className="border-gold/30 bg-gradient-to-b from-black/80 to-purple-950/30 backdrop-blur-sm overflow-hidden relative mb-6">
          {showLevelUp && (
            <div className="absolute inset-0 bg-gold/20 animate-pulse z-0"></div>
          )}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-purple-600 via-gold to-orange-500"></div>
          <CardHeader className="pb-2 relative z-10">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg text-gold flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-gold" />
                Player Level {playerLevel}
              </CardTitle>
              <Badge variant="outline" className="bg-black/60 text-gold border-gold/50">
                {achievements.length} Achievements
              </Badge>
            </div>
            <CardDescription>
              {playerXP} / {xpToNextLevel} XP to next level
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 relative z-10">
            <Progress
              value={(playerXP / xpToNextLevel) * 100}
              className="h-2 bg-gray-800"
              indicatorClassName="bg-gradient-to-r from-gold via-yellow-500 to-gold"
            />

            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center">
                <Brain className="h-4 w-4 mr-1 text-gold" />
                <span className="text-sm font-medium">{gameStats.gamesPlayed} Games</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-gold" />
                <span className="text-sm font-medium">{totalWinnings} GOLD Won</span>
              </div>
              <div className="flex items-center">
                <Trophy className="h-4 w-4 mr-1 text-gold" />
                <span className="text-sm font-medium">{gameStats.gamesWon} Wins</span>
              </div>
            </div>

            {showLevelUp && (
              <div className="mt-3 bg-gold/20 p-2 rounded-md text-center animate-pulse">
                <span className="text-gold font-bold">LEVEL UP!</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Memory Master Selection */}
        <Card className="border-gold/30 bg-black/60 backdrop-blur-sm mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gold flex justify-between items-center">
              <span>Memory Master</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs text-gold hover:bg-gold/10"
                onClick={() => setShowMasterSelect(!showMasterSelect)}
              >
                {showMasterSelect ? "Hide Details" : "Show All"}
              </Button>
            </CardTitle>
            <CardDescription>Choose your memory master for special abilities</CardDescription>
          </CardHeader>
          <CardContent>
            {showMasterSelect ? (
              <div className="space-y-3">
                {MEMORY_MASTERS.map((master) => {
                  const isUnlocked = unlockedMasters.includes(master.id);
                  const isSelected = selectedMaster.id === master.id;

                  return (
                    <div
                      key={master.id}
                      className={`p-3 rounded-lg border ${
                        isSelected
                          ? 'border-gold bg-gold/20'
                          : isUnlocked
                            ? 'border-gray-700 hover:border-gold/50 bg-black/40'
                            : 'border-gray-800 bg-black/20 opacity-60'
                      } transition-all`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full overflow-hidden ${
                          master.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-600 via-gold to-orange-500 p-0.5' :
                          master.rarity === 'epic' ? 'bg-gradient-to-r from-purple-600 to-pink-500 p-0.5' :
                          master.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 p-0.5' :
                          master.rarity === 'uncommon' ? 'bg-gradient-to-r from-green-500 to-emerald-400 p-0.5' :
                          'bg-gradient-to-r from-gray-500 to-gray-400 p-0.5'
                        }`}>
                          <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center p-1">
                            <img
                              src={master.image}
                              alt={master.name}
                              className={`w-full h-full object-contain ${
                                master.animation === 'spin' ? 'animate-spin-slow' :
                                master.animation === 'pulse' ? 'animate-pulse' :
                                master.animation === 'bounce' ? 'animate-bounce' :
                                master.animation === 'glitter' ? 'animate-pulse' :
                                master.animation === 'rainbow' ? 'animate-pulse' : ''
                              }`}
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="font-bold">{master.name}</h4>
                            <Badge className={`ml-2 ${
                              master.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-600 via-gold to-orange-500 text-white' :
                              master.rarity === 'epic' ? 'bg-purple-600 text-white' :
                              master.rarity === 'rare' ? 'bg-blue-600 text-white' :
                              master.rarity === 'uncommon' ? 'bg-green-600 text-white' :
                              'bg-gray-600 text-white'
                            }`}>
                              {master.rarity.charAt(0).toUpperCase() + master.rarity.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{master.description}</p>
                        </div>
                        {isUnlocked ? (
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            className={isSelected ? "bg-gold text-black" : "border-gold/50 text-white hover:bg-gold/10"}
                            onClick={() => setSelectedMaster(master)}
                          >
                            {isSelected ? "Selected" : "Select"}
                          </Button>
                        ) : (
                          <div className="text-xs text-gray-500">
                            Unlock at level {master.unlockLevel}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-4 p-3 rounded-lg border border-gold bg-gold/10 mb-3">
                  <div className={`w-16 h-16 rounded-full overflow-hidden ${
                    selectedMaster.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-600 via-gold to-orange-500 p-0.5' :
                    selectedMaster.rarity === 'epic' ? 'bg-gradient-to-r from-purple-600 to-pink-500 p-0.5' :
                    selectedMaster.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 p-0.5' :
                    selectedMaster.rarity === 'uncommon' ? 'bg-gradient-to-r from-green-500 to-emerald-400 p-0.5' :
                    'bg-gradient-to-r from-gray-500 to-gray-400 p-0.5'
                  }`}>
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center p-1">
                      <img
                        src={selectedMaster.image}
                        alt={selectedMaster.name}
                        className={`w-full h-full object-contain ${
                          selectedMaster.animation === 'spin' ? 'animate-spin-slow' :
                          selectedMaster.animation === 'pulse' ? 'animate-pulse' :
                          selectedMaster.animation === 'bounce' ? 'animate-bounce' :
                          selectedMaster.animation === 'glitter' ? 'animate-pulse' :
                          selectedMaster.animation === 'rainbow' ? 'animate-pulse' : ''
                        }`}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-bold text-lg">{selectedMaster.name}</h3>
                      <Badge className={`ml-2 ${
                        selectedMaster.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-600 via-gold to-orange-500 text-white' :
                        selectedMaster.rarity === 'epic' ? 'bg-purple-600 text-white' :
                        selectedMaster.rarity === 'rare' ? 'bg-blue-600 text-white' :
                        selectedMaster.rarity === 'uncommon' ? 'bg-green-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {selectedMaster.rarity.charAt(0).toUpperCase() + selectedMaster.rarity.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm mt-1">{selectedMaster.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {MEMORY_MASTERS.map((master) => {
                    const isUnlocked = unlockedMasters.includes(master.id);
                    return (
                      <Button
                        key={master.id}
                        variant="ghost"
                        className={`p-1 ${
                          selectedMaster.id === master.id
                            ? 'bg-gold/20 ring-2 ring-gold'
                            : isUnlocked
                              ? 'hover:bg-black/40'
                              : 'opacity-40 cursor-not-allowed'
                        }`}
                        onClick={() => isUnlocked && setSelectedMaster(master)}
                      >
                        <div className="flex flex-col items-center">
                          <div className={`w-12 h-12 rounded-full overflow-hidden ${
                            isUnlocked ? 'bg-black/40' : 'bg-gray-900'
                          } p-1 relative`}>
                            <img
                              src={master.image}
                              alt={master.name}
                              className="w-full h-full object-contain"
                            />
                            {!isUnlocked && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <span className="text-xs mt-1">{master.name}</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Game Stats */}
        <Card className="border-gold/30 bg-black/60 backdrop-blur-sm mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gold">Game Stats</CardTitle>
            <CardDescription>Your performance in {gameMode} mode</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-black/40 border border-gold/20 rounded-lg p-3">
                <div className="text-xs text-gray-400">Balance</div>
                <div className="mt-1 text-xl font-bold text-gold">
                  {balance} GOLD
                  {gameMode === "paid" && connected && (
                    <span className="ml-1 text-xs">(Real)</span>
                  )}
                </div>
              </div>
              <div className="bg-black/40 border border-gold/20 rounded-lg p-3">
                <div className="text-xs text-gray-400">Games Played</div>
                <div className="mt-1 text-xl font-bold">{gameStats.gamesPlayed}</div>
              </div>
              <div className="bg-black/40 border border-gold/20 rounded-lg p-3">
                <div className="text-xs text-gray-400">Win Rate</div>
                <div className="mt-1 text-xl font-bold text-green-500">
                  {gameStats.gamesPlayed > 0
                    ? `${Math.round((gameStats.gamesWon / gameStats.gamesPlayed) * 100)}%`
                    : "0%"}
                </div>
              </div>
              <div className="bg-black/40 border border-gold/20 rounded-lg p-3">
                <div className="text-xs text-gray-400">Best Time</div>
                <div className="mt-1 text-xl font-bold text-gold">
                  {gameStats.fastestWin < 999 ? formatTime(gameStats.fastestWin) : "-"}
                </div>
              </div>
            </div>

            <div className="bg-black/40 border border-gold/20 rounded-lg p-3 mb-6">
              <div className="text-sm font-medium mb-2">Performance</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Pairs:</span>
                  <span className="font-medium">{gameStats.totalPairsMatched}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fewest Moves:</span>
                  <span className="font-medium">
                    {gameStats.fewestMoves < 999 ? gameStats.fewestMoves : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Hints Available:</span>
                  <span className="font-medium text-gold">{hintsAvailable}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Winnings:</span>
                  <span className="font-medium text-gold">{totalWinnings} GOLD</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-4 text-gold">Game History</h3>
            {gameHistory.length > 0 ? (
              <div className="space-y-3">
                {gameHistory.map((game, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-gold/20 rounded-lg bg-black/40">
                    <div>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${game.won ? "bg-green-500" : "bg-red-500"} mr-2`}></div>
                        <span className="font-medium">{game.pairs} pairs</span>
                        <span className="text-xs text-gray-400 ml-2">({game.moves} moves)</span>
                        {game.perfect && <span className="ml-2 text-gold text-xs">★ Perfect</span>}
                        {game.specialEvent === "JACKPOT" && <span className="ml-2 text-purple-400 text-xs">JACKPOT!</span>}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{formatTime(game.time)}</div>
                    </div>
                    <div className={`font-bold ${game.won ? "text-green-500" : "text-red-500"}`}>
                      {game.won ? "+" + game.reward : "-" + game.bet} GOLD
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400 border border-dashed border-gray-700 rounded-lg">
                No games played yet
              </div>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <div className="mt-6">
                <div className="text-sm font-medium mb-2">Achievements</div>
                <div className="flex flex-wrap gap-2">
                  {achievements.includes("MATCH_6") && (
                    <Badge className="bg-blue-600">Matcher</Badge>
                  )}
                  {achievements.includes("MATCH_12") && (
                    <Badge className="bg-blue-600">Master Matcher</Badge>
                  )}
                  {achievements.includes("MATCH_24") && (
                    <Badge className="bg-blue-600">Memory Legend</Badge>
                  )}
                  {achievements.includes("PERFECT_GAME") && (
                    <Badge className="bg-gold text-black">Perfect Game</Badge>
                  )}
                  {achievements.includes("SPEED_30") && (
                    <Badge className="bg-green-600">Speedy</Badge>
                  )}
                  {achievements.includes("SPEED_15") && (
                    <Badge className="bg-green-600">Lightning Fast</Badge>
                  )}
                  {achievements.includes("EFFICIENCY") && (
                    <Badge className="bg-purple-600">Efficient</Badge>
                  )}
                  {achievements.includes("FIRST_JACKPOT") && (
                    <Badge className="bg-gradient-to-r from-purple-600 via-gold to-orange-500">Jackpot Winner</Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gold/30 bg-black/60 backdrop-blur-sm mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gold">How to Play</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-2 text-sm">
              <p className="flex items-start">
                <span className="text-gold mr-2">1.</span>
                <span>Choose your game mode - Demo (free) or Paid (real tokens)</span>
              </p>
              <p className="flex items-start">
                <span className="text-gold mr-2">2.</span>
                <span>Select your Memory Master for special abilities</span>
              </p>
              <p className="flex items-start">
                <span className="text-gold mr-2">3.</span>
                <span>Choose your favorite card theme and difficulty level</span>
              </p>
              <p className="flex items-start">
                <span className="text-gold mr-2">4.</span>
                <span>Set your bet amount and start the game</span>
              </p>
              <p className="flex items-start">
                <span className="text-gold mr-2">5.</span>
                <span>Click cards to flip them and find matching pairs</span>
              </p>
              <p className="flex items-start">
                <span className="text-gold mr-2">6.</span>
                <span>Match all pairs before time runs out to win</span>
              </p>
              <p className="flex items-start">
                <span className="text-gold mr-2">7.</span>
                <span>Level up to unlock new Memory Masters and card themes!</span>
              </p>
              <p className="mt-4 text-xs text-gold">
                In paid mode, your bets and winnings use real GOLD tokens from your connected wallet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
