"use client"

import { useState, useEffect, useRef } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Coins, ArrowRight, Wallet, Sparkles, Crown, Star,
  Trophy, Zap, Gift, Flame, Heart, Shield, Rocket,
  Sparkle, Fireworks, PartyPopper, Medal
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import confetti from "canvas-confetti"

// Cute character images with special abilities
const CHARACTERS = [
  {
    id: "goldcoin",
    name: "Goldie",
    image: "/gold_icon-removebg-preview.png",
    description: "Increases win rewards by 10%",
    ability: "REWARD_BOOST",
    rarity: "common",
    animation: "spin",
    unlockLevel: 1
  },
  {
    id: "silvercoin",
    name: "Silvie",
    image: "/images/solana-logo.png",
    description: "5% chance to get free flip",
    ability: "FREE_FLIP",
    rarity: "uncommon",
    animation: "bounce",
    unlockLevel: 3
  },
  {
    id: "bronzecoin",
    name: "Bronzie",
    image: "/images/mana-logo.png",
    description: "Reduces losses by 5%",
    ability: "LOSS_REDUCTION",
    rarity: "rare",
    animation: "pulse",
    unlockLevel: 5
  },
  {
    id: "luckycoin",
    name: "Lucky",
    image: "/gold-logo.png",
    description: "2% chance to double winnings",
    ability: "DOUBLE_WIN",
    rarity: "epic",
    animation: "glitter",
    unlockLevel: 10
  },
  {
    id: "diamondcoin",
    name: "Diamante",
    image: "/gold-logo.png",
    description: "1% chance to win regardless of flip",
    ability: "GUARANTEED_WIN",
    rarity: "legendary",
    animation: "rainbow",
    unlockLevel: 15
  },
]

// Particle effects for wins
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
    case 'coins':
      confetti({
        particleCount: 80,
        angle: 90,
        spread: 360,
        shapes: ['circle'],
        colors: ['#FFD700', '#FFA000'],
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

export default function CoinFlipGame() {
  const { toast } = useToast()
  const { connected, goldBalance, sendTransaction, connection, publicKey, refreshBalance } = useSolanaWallet()
  const coinRef = useRef<HTMLDivElement>(null)
  const coinAnimationControls = useAnimation()

  // Game state
  const [betAmount, setBetAmount] = useState(50)
  const [selectedSide, setSelectedSide] = useState<"heads" | "tails" | null>(null)
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState<"heads" | "tails" | null>(null)
  const [hasWon, setHasWon] = useState<boolean | null>(null)
  const [gameHistory, setGameHistory] = useState<
    Array<{ bet: number; side: string; result: string; won: boolean; time: string; specialEvent?: string }>
  >([])
  const [balance, setBalance] = useState(1850)
  const [winStreak, setWinStreak] = useState(0)
  const [flipCount, setFlipCount] = useState(0)
  const [showStats, setShowStats] = useState(false)
  const [gameMode, setGameMode] = useState<"demo" | "paid">("demo")
  const [selectedCharacter, setSelectedCharacter] = useState(CHARACTERS[0])
  const [showCharacterSelect, setShowCharacterSelect] = useState(false)
  const [transactionPending, setTransactionPending] = useState(false)
  const [transactionHash, setTransactionHash] = useState("")

  // Progression system
  const [playerLevel, setPlayerLevel] = useState(1)
  const [playerXP, setPlayerXP] = useState(0)
  const [xpToNextLevel, setXpToNextLevel] = useState(100)
  const [totalWinnings, setTotalWinnings] = useState(0)
  const [achievements, setAchievements] = useState<string[]>([])
  const [unlockedCharacters, setUnlockedCharacters] = useState<string[]>(["goldcoin"])
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [specialAbilityActive, setSpecialAbilityActive] = useState(false)
  const [specialAbilityMessage, setSpecialAbilityMessage] = useState("")
  const [comboMultiplier, setComboMultiplier] = useState(1)
  const [showComboMessage, setShowComboMessage] = useState(false)
  const [lastWinTime, setLastWinTime] = useState(0)
  const [jackpotChance, setJackpotChance] = useState(0.001) // 0.1% base chance
  const [jackpotAmount, setJackpotAmount] = useState(5000)
  const [showJackpot, setShowJackpot] = useState(false)

  // Visual effects
  const [coinFlipCount, setCoinFlipCount] = useState(0)
  const [coinFlipSpeed, setCoinFlipSpeed] = useState(1)
  const [particleEffect, setParticleEffect] = useState("confetti")
  const [showSpecialAnimation, setShowSpecialAnimation] = useState(false)
  const [specialAnimationType, setSpecialAnimationType] = useState("")

  // Game settings
  const maxBet = 500
  const minBet = 10
  const baseXpPerFlip = 5
  const baseXpPerWin = 20
  const streakBonusXp = 5
  const comboTimeWindow = 10000 // 10 seconds for combo
  const maxComboMultiplier = 5

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
    const savedProgress = localStorage.getItem('coinFlipProgress')
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress)
        setPlayerLevel(progress.level || 1)
        setPlayerXP(progress.xp || 0)
        setXpToNextLevel(calculateXpForLevel(progress.level || 1))
        setTotalWinnings(progress.totalWinnings || 0)
        setAchievements(progress.achievements || [])
        setUnlockedCharacters(progress.unlockedCharacters || ["goldcoin"])
        setFlipCount(progress.flipCount || 0)
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
      unlockedCharacters,
      flipCount
    }
    localStorage.setItem('coinFlipProgress', JSON.stringify(progress))
  }, [playerLevel, playerXP, totalWinnings, achievements, unlockedCharacters, flipCount])

  // Check for level up
  useEffect(() => {
    if (playerXP >= xpToNextLevel) {
      // Level up!
      const newLevel = playerLevel + 1
      setPlayerLevel(newLevel)
      setPlayerXP(playerXP - xpToNextLevel)
      setXpToNextLevel(calculateXpForLevel(newLevel))
      setShowLevelUp(true)

      // Check for character unlocks
      const newUnlocks = CHARACTERS.filter(char =>
        char.unlockLevel === newLevel && !unlockedCharacters.includes(char.id)
      )

      if (newUnlocks.length > 0) {
        const newUnlockedIds = newUnlocks.map(char => char.id)
        setUnlockedCharacters([...unlockedCharacters, ...newUnlockedIds])

        toast({
          title: "New Character Unlocked!",
          description: `You've unlocked ${newUnlocks.map(c => c.name).join(', ')}!`,
          variant: "default",
        })

        // Auto-select the new character if it's the first one unlocked
        if (unlockedCharacters.length === 1 && unlockedCharacters[0] === "goldcoin") {
          setSelectedCharacter(newUnlocks[0])
        }
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
    }
  }, [playerXP, xpToNextLevel, playerLevel, unlockedCharacters])

  // Check for combo multiplier
  useEffect(() => {
    if (hasWon && winStreak > 1) {
      const now = Date.now()
      if (now - lastWinTime < comboTimeWindow) {
        // Combo achieved!
        const newMultiplier = Math.min(comboMultiplier + 0.5, maxComboMultiplier)
        setComboMultiplier(newMultiplier)
        setShowComboMessage(true)

        // Hide combo message after 2 seconds
        setTimeout(() => {
          setShowComboMessage(false)
        }, 2000)
      } else {
        // Combo broken
        setComboMultiplier(1)
      }
    }
  }, [winStreak, hasWon, lastWinTime])

  const handleBetAmountChange = (value: number[]) => {
    setBetAmount(value[0])
  }

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (isNaN(value)) {
      setBetAmount(minBet)
    } else {
      setBetAmount(Math.min(Math.max(value, minBet), maxBet))
    }
  }

  const handleMaxBet = () => {
    setBetAmount(Math.min(balance, maxBet))
  }

  const handleMinBet = () => {
    setBetAmount(minBet)
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

  // Process special character abilities
  const processCharacterAbility = (won: boolean, flipResult: string) => {
    setSpecialAbilityActive(false)
    setSpecialAbilityMessage("")

    // Check for special abilities based on character
    switch(selectedCharacter.ability) {
      case "REWARD_BOOST":
        if (won) {
          // Goldie: Increases win rewards by 10%
          const bonusAmount = Math.round(betAmount * 0.1)
          setBalance(prev => prev + bonusAmount)
          setTotalWinnings(prev => prev + bonusAmount)
          setSpecialAbilityActive(true)
          setSpecialAbilityMessage(`Goldie's ability: +${bonusAmount} GOLD bonus!`)
          return { bonusAmount, specialEvent: "REWARD_BOOST" }
        }
        break;

      case "FREE_FLIP":
        // Silvie: 5% chance to get free flip
        if (!won && Math.random() < 0.05) {
          setBalance(prev => prev + betAmount) // Refund the bet
          setSpecialAbilityActive(true)
          setSpecialAbilityMessage("Silvie's ability: Free flip! Bet refunded!")
          return { bonusAmount: betAmount, specialEvent: "FREE_FLIP" }
        }
        break;

      case "LOSS_REDUCTION":
        // Bronzie: Reduces losses by 5%
        if (!won) {
          const savedAmount = Math.round(betAmount * 0.05)
          setBalance(prev => prev + savedAmount)
          setSpecialAbilityActive(true)
          setSpecialAbilityMessage(`Bronzie's ability: Loss reduced by ${savedAmount} GOLD!`)
          return { bonusAmount: savedAmount, specialEvent: "LOSS_REDUCTION" }
        }
        break;

      case "DOUBLE_WIN":
        // Lucky: 2% chance to double winnings
        if (won && Math.random() < 0.02) {
          const doubleAmount = betAmount
          setBalance(prev => prev + doubleAmount)
          setTotalWinnings(prev => prev + doubleAmount)
          setSpecialAbilityActive(true)
          setSpecialAbilityMessage("Lucky's ability: Double win! 2x reward!")
          setParticleEffect("stars")
          return { bonusAmount: doubleAmount, specialEvent: "DOUBLE_WIN" }
        }
        break;

      case "GUARANTEED_WIN":
        // Diamante: 1% chance to win regardless of flip
        if (!won && Math.random() < 0.01) {
          setHasWon(true) // Override the loss
          setBalance(prev => prev + betAmount * 2) // Win the bet
          setTotalWinnings(prev => prev + betAmount * 2)
          setSpecialAbilityActive(true)
          setSpecialAbilityMessage("Diamante's ability: Guaranteed win activated!")
          setParticleEffect("jackpot")
          return { bonusAmount: betAmount * 2, specialEvent: "GUARANTEED_WIN" }
        }
        break;
    }

    return { bonusAmount: 0, specialEvent: undefined }
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

  // Check for achievements
  const checkAchievements = (flipCount: number, winStreak: number, totalWinnings: number) => {
    const newAchievements = [...achievements]
    let achievementUnlocked = false

    // Flip count achievements
    if (flipCount >= 10 && !achievements.includes("FLIP_10")) {
      newAchievements.push("FLIP_10")
      achievementUnlocked = true
    }
    if (flipCount >= 50 && !achievements.includes("FLIP_50")) {
      newAchievements.push("FLIP_50")
      achievementUnlocked = true
    }
    if (flipCount >= 100 && !achievements.includes("FLIP_100")) {
      newAchievements.push("FLIP_100")
      achievementUnlocked = true
    }

    // Win streak achievements
    if (winStreak >= 3 && !achievements.includes("STREAK_3")) {
      newAchievements.push("STREAK_3")
      achievementUnlocked = true
    }
    if (winStreak >= 5 && !achievements.includes("STREAK_5")) {
      newAchievements.push("STREAK_5")
      achievementUnlocked = true
    }
    if (winStreak >= 10 && !achievements.includes("STREAK_10")) {
      newAchievements.push("STREAK_10")
      achievementUnlocked = true
    }

    // Winnings achievements
    if (totalWinnings >= 1000 && !achievements.includes("WIN_1000")) {
      newAchievements.push("WIN_1000")
      achievementUnlocked = true
    }
    if (totalWinnings >= 5000 && !achievements.includes("WIN_5000")) {
      newAchievements.push("WIN_5000")
      achievementUnlocked = true
    }
    if (totalWinnings >= 10000 && !achievements.includes("WIN_10000")) {
      newAchievements.push("WIN_10000")
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

  // Advanced coin flip animation
  const playCoinFlipAnimation = async () => {
    // Set random number of flips between 10 and 15
    const flips = Math.floor(Math.random() * 6) + 10
    setCoinFlipCount(flips)

    // Animate the coin
    await coinAnimationControls.start({
      rotateX: flips * 180,
      transition: {
        duration: 2,
        ease: "easeInOut"
      }
    })

    // Reset for next flip
    coinAnimationControls.set({ rotateX: 0 })
  }

  // Ensure the coin flip game works properly
  const flipCoin = async () => {
    if (!selectedSide) {
      toast({
        title: "Select a Side",
        description: "Please select heads or tails before flipping.",
        variant: "destructive",
      })
      return
    }

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
    }

    setIsFlipping(true)
    setResult(null)
    setHasWon(null)
    setSpecialAbilityActive(false)
    setSpecialAbilityMessage("")
    setShowComboMessage(false)
    setParticleEffect("confetti") // Reset to default

    // Play coin flip animation
    await playCoinFlipAnimation()

    // Determine result with some randomness
    const random = Math.random()
    let flipResult = random > 0.5 ? "heads" : "tails"

    // Check for Diamante's guaranteed win ability (1% chance)
    const guaranteedWin = selectedCharacter.ability === "GUARANTEED_WIN" && Math.random() < 0.01
    if (guaranteedWin) {
      // Force the result to match the selected side
      flipResult = selectedSide
    }

    setResult(flipResult)
    const won = selectedSide === flipResult || guaranteedWin
    setHasWon(won)

    // Calculate base winnings
    let winAmount = betAmount

    // Apply combo multiplier if active
    if (won && comboMultiplier > 1) {
      winAmount = Math.round(betAmount * comboMultiplier)
    }

    // Update balance for demo mode
    if (gameMode === "demo") {
      setBalance((prev) => (won ? prev + winAmount : prev - betAmount))
    }

    // For paid mode and won, process winnings
    if (gameMode === "paid" && won) {
      await handlePaidWinning(winAmount)
    }

    // Process character abilities
    const { bonusAmount, specialEvent } = processCharacterAbility(won, flipResult)

    // Check for jackpot
    const { jackpotWon, amount: jackpotAmount } = checkJackpot(won)

    // Update win streak and last win time
    if (won) {
      setWinStreak((prev) => prev + 1)
      setLastWinTime(Date.now())
      setTotalWinnings(prev => prev + winAmount + bonusAmount)

      // Show appropriate win effect
      if (jackpotWon) {
        createWinEffect("jackpot")
      } else if (specialEvent === "DOUBLE_WIN" || specialEvent === "GUARANTEED_WIN") {
        createWinEffect("stars")
      } else if (comboMultiplier >= 2) {
        createWinEffect("coins")
      } else {
        createWinEffect("confetti")
      }
    } else {
      setWinStreak(0)
      setComboMultiplier(1)
    }

    // Update flip count
    setFlipCount((prev) => prev + 1)

    // Award XP
    const xpEarned = won
      ? baseXpPerWin + (winStreak * streakBonusXp)
      : baseXpPerFlip
    setPlayerXP(prev => prev + xpEarned)

    // Check for achievements
    checkAchievements(flipCount + 1, won ? winStreak + 1 : 0, totalWinnings + (won ? winAmount + bonusAmount : 0))

    // Add to history with special events
    setGameHistory((prev) => [
      {
        bet: betAmount,
        side: selectedSide,
        result: flipResult,
        won,
        time: "Just now",
        specialEvent: specialEvent || (jackpotWon ? "JACKPOT" : undefined)
      },
      ...prev.slice(0, 9), // Keep last 10 games
    ])

    // Show toast with XP
    toast({
      title: won ? "You Won!" : "You Lost",
      description: won
        ? `Congratulations! You won ${winAmount}${bonusAmount > 0 ? ` + ${bonusAmount} bonus` : ''} GOLD. +${xpEarned} XP`
        : `Better luck next time. You lost ${betAmount}${bonusAmount > 0 ? ` (saved ${bonusAmount})` : ''} GOLD. +${xpEarned} XP`,
      variant: won ? "default" : "destructive",
    })

    setIsFlipping(false)
  }

  const [coinRotation, setCoinRotation] = useState(0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="flex flex-col items-center">
          <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold mb-2">Flip a Coin</h2>
            <p className="text-gray-400">Choose heads or tails and place your bet</p>
          </div>

          {/* Player Level and XP */}
          <div className="w-full max-w-md mb-6">
            <Card className="border-gold/30 bg-gradient-to-b from-black/80 to-purple-950/30 backdrop-blur-sm overflow-hidden relative">
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
                    <Coins className="h-4 w-4 mr-1 text-gold" />
                    <span className="text-sm font-medium">{flipCount} Flips</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-gold" />
                    <span className="text-sm font-medium">{totalWinnings} GOLD Won</span>
                  </div>
                  <div className="flex items-center">
                    <Flame className="h-4 w-4 mr-1 text-orange-500" />
                    <span className="text-sm font-medium">{winStreak} Streak</span>
                  </div>
                </div>

                {showLevelUp && (
                  <div className="mt-3 bg-gold/20 p-2 rounded-md text-center animate-pulse">
                    <span className="text-gold font-bold">LEVEL UP!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Game Mode Selection */}
          <div className="w-full max-w-md mb-6">
            <Card className="border-gold/30 bg-black/60 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gold">Game Mode</CardTitle>
                <CardDescription>Choose how you want to play</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={gameMode === "demo" ? "default" : "outline"}
                    className={gameMode === "demo" ? "bg-gradient-to-r from-gold to-yellow-500 text-black" : "border-gold/50 text-white hover:bg-gold/10"}
                    onClick={() => setGameMode("demo")}
                    disabled={isFlipping}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Demo Mode
                  </Button>
                  <Button
                    variant={gameMode === "paid" ? "default" : "outline"}
                    className={gameMode === "paid" ? "bg-gradient-to-r from-gold to-yellow-500 text-black" : "border-gold/50 text-white hover:bg-gold/10"}
                    onClick={() => setGameMode("paid")}
                    disabled={isFlipping}
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

          {/* Character Selection */}
          <div className="w-full max-w-md mb-6">
            <Card className="border-gold/30 bg-black/60 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gold flex justify-between items-center">
                  <span>Your Lucky Character</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-gold hover:bg-gold/10"
                    onClick={() => setShowCharacterSelect(!showCharacterSelect)}
                  >
                    {showCharacterSelect ? "Hide Details" : "Show All"}
                  </Button>
                </CardTitle>
                <CardDescription>Choose your coin character for special abilities</CardDescription>
              </CardHeader>
              <CardContent>
                {showCharacterSelect ? (
                  <div className="space-y-3">
                    {CHARACTERS.map((character) => {
                      const isUnlocked = unlockedCharacters.includes(character.id);
                      const isSelected = selectedCharacter.id === character.id;

                      return (
                        <div
                          key={character.id}
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
                              character.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-600 via-gold to-orange-500 p-0.5' :
                              character.rarity === 'epic' ? 'bg-gradient-to-r from-purple-600 to-pink-500 p-0.5' :
                              character.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 p-0.5' :
                              character.rarity === 'uncommon' ? 'bg-gradient-to-r from-green-500 to-emerald-400 p-0.5' :
                              'bg-gradient-to-r from-gray-500 to-gray-400 p-0.5'
                            }`}>
                              <div className="w-full h-full rounded-full bg-black flex items-center justify-center p-1">
                                <img
                                  src={character.image}
                                  alt={character.name}
                                  className={`w-full h-full object-contain ${
                                    character.animation === 'spin' ? 'animate-spin-slow' :
                                    character.animation === 'pulse' ? 'animate-pulse' :
                                    character.animation === 'bounce' ? 'animate-bounce' :
                                    character.animation === 'glitter' ? 'animate-pulse' :
                                    character.animation === 'rainbow' ? 'animate-pulse' : ''
                                  }`}
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h4 className="font-bold">{character.name}</h4>
                                <Badge className={`ml-2 ${
                                  character.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-600 via-gold to-orange-500 text-white' :
                                  character.rarity === 'epic' ? 'bg-purple-600 text-white' :
                                  character.rarity === 'rare' ? 'bg-blue-600 text-white' :
                                  character.rarity === 'uncommon' ? 'bg-green-600 text-white' :
                                  'bg-gray-600 text-white'
                                }`}>
                                  {character.rarity.charAt(0).toUpperCase() + character.rarity.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">{character.description}</p>
                            </div>
                            {isUnlocked ? (
                              <Button
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                className={isSelected ? "bg-gold text-black" : "border-gold/50 text-white hover:bg-gold/10"}
                                onClick={() => setSelectedCharacter(character)}
                                disabled={isFlipping}
                              >
                                {isSelected ? "Selected" : "Select"}
                              </Button>
                            ) : (
                              <div className="text-xs text-gray-500">
                                Unlock at level {character.unlockLevel}
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
                        selectedCharacter.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-600 via-gold to-orange-500 p-0.5' :
                        selectedCharacter.rarity === 'epic' ? 'bg-gradient-to-r from-purple-600 to-pink-500 p-0.5' :
                        selectedCharacter.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 p-0.5' :
                        selectedCharacter.rarity === 'uncommon' ? 'bg-gradient-to-r from-green-500 to-emerald-400 p-0.5' :
                        'bg-gradient-to-r from-gray-500 to-gray-400 p-0.5'
                      }`}>
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center p-1">
                          <img
                            src={selectedCharacter.image}
                            alt={selectedCharacter.name}
                            className={`w-full h-full object-contain ${
                              selectedCharacter.animation === 'spin' ? 'animate-spin-slow' :
                              selectedCharacter.animation === 'pulse' ? 'animate-pulse' :
                              selectedCharacter.animation === 'bounce' ? 'animate-bounce' :
                              selectedCharacter.animation === 'glitter' ? 'animate-pulse' :
                              selectedCharacter.animation === 'rainbow' ? 'animate-pulse' : ''
                            }`}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-bold text-lg">{selectedCharacter.name}</h3>
                          <Badge className={`ml-2 ${
                            selectedCharacter.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-600 via-gold to-orange-500 text-white' :
                            selectedCharacter.rarity === 'epic' ? 'bg-purple-600 text-white' :
                            selectedCharacter.rarity === 'rare' ? 'bg-blue-600 text-white' :
                            selectedCharacter.rarity === 'uncommon' ? 'bg-green-600 text-white' :
                            'bg-gray-600 text-white'
                          }`}>
                            {selectedCharacter.rarity.charAt(0).toUpperCase() + selectedCharacter.rarity.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm mt-1">{selectedCharacter.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {CHARACTERS.map((character) => {
                        const isUnlocked = unlockedCharacters.includes(character.id);
                        return (
                          <Button
                            key={character.id}
                            variant="ghost"
                            className={`p-1 ${
                              selectedCharacter.id === character.id
                                ? 'bg-gold/20 ring-2 ring-gold'
                                : isUnlocked
                                  ? 'hover:bg-black/40'
                                  : 'opacity-40 cursor-not-allowed'
                            }`}
                            onClick={() => isUnlocked && setSelectedCharacter(character)}
                            disabled={isFlipping || !isUnlocked}
                          >
                            <div className="flex flex-col items-center">
                              <div className={`w-12 h-12 rounded-full overflow-hidden ${
                                isUnlocked ? 'bg-black/40' : 'bg-gray-900'
                              } p-1 relative`}>
                                <img
                                  src={character.image}
                                  alt={character.name}
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
                              <span className="text-xs mt-1">{character.name}</span>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Side Selection */}
          <div className="w-full max-w-md mb-6">
            <Card className="border-gold/30 bg-black/60 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gold">Choose Your Side</CardTitle>
                <CardDescription>Select heads or tails to place your bet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center gap-4">
                  <Button
                    variant={selectedSide === "heads" ? "default" : "outline"}
                    className={`w-32 h-32 rounded-full relative overflow-hidden group ${
                      selectedSide === "heads"
                        ? "bg-gradient-to-r from-yellow-400 via-gold to-yellow-500 text-black"
                        : "border-gold/50 text-white hover:bg-gold/10"
                    }`}
                    onClick={() => setSelectedSide("heads")}
                    disabled={isFlipping}
                  >
                    {selectedSide === "heads" && (
                      <div className="absolute inset-0 bg-white opacity-10 animate-pulse"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    <div className="flex flex-col items-center relative z-10">
                      <div className={`w-20 h-20 rounded-full overflow-hidden ${
                        selectedCharacter.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-600 via-gold to-orange-500 p-0.5' :
                        selectedCharacter.rarity === 'epic' ? 'bg-gradient-to-r from-purple-600 to-pink-500 p-0.5' :
                        selectedCharacter.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 p-0.5' :
                        selectedCharacter.rarity === 'uncommon' ? 'bg-gradient-to-r from-green-500 to-emerald-400 p-0.5' :
                        'bg-black p-0.5'
                      } mb-2`}>
                        <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center">
                          <img
                            src={selectedCharacter.image}
                            alt={selectedCharacter.name}
                            className={`w-16 h-16 object-contain ${
                              selectedSide === "heads" && selectedCharacter.animation === 'spin' ? 'animate-spin-slow' :
                              selectedSide === "heads" && selectedCharacter.animation === 'pulse' ? 'animate-pulse' :
                              selectedSide === "heads" && selectedCharacter.animation === 'bounce' ? 'animate-bounce' :
                              selectedSide === "heads" && selectedCharacter.animation === 'glitter' ? 'animate-pulse' :
                              selectedSide === "heads" && selectedCharacter.animation === 'rainbow' ? 'animate-pulse' : ''
                            }`}
                          />
                        </div>
                      </div>
                      <span className="text-lg font-bold">Heads</span>
                    </div>
                  </Button>

                  <Button
                    variant={selectedSide === "tails" ? "default" : "outline"}
                    className={`w-32 h-32 rounded-full relative overflow-hidden group ${
                      selectedSide === "tails"
                        ? "bg-gradient-to-r from-yellow-400 via-gold to-yellow-500 text-black"
                        : "border-gold/50 text-white hover:bg-gold/10"
                    }`}
                    onClick={() => setSelectedSide("tails")}
                    disabled={isFlipping}
                  >
                    {selectedSide === "tails" && (
                      <div className="absolute inset-0 bg-white opacity-10 animate-pulse"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    <div className="flex flex-col items-center relative z-10">
                      <div className={`w-20 h-20 rounded-full overflow-hidden ${
                        selectedCharacter.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-600 via-gold to-orange-500 p-0.5' :
                        selectedCharacter.rarity === 'epic' ? 'bg-gradient-to-r from-purple-600 to-pink-500 p-0.5' :
                        selectedCharacter.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 p-0.5' :
                        selectedCharacter.rarity === 'uncommon' ? 'bg-gradient-to-r from-green-500 to-emerald-400 p-0.5' :
                        'bg-black p-0.5'
                      } mb-2 rotate-180`}>
                        <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center">
                          <img
                            src={selectedCharacter.image}
                            alt={selectedCharacter.name}
                            className={`w-16 h-16 object-contain rotate-180 ${
                              selectedSide === "tails" && selectedCharacter.animation === 'spin' ? 'animate-spin-slow' :
                              selectedSide === "tails" && selectedCharacter.animation === 'pulse' ? 'animate-pulse' :
                              selectedSide === "tails" && selectedCharacter.animation === 'bounce' ? 'animate-bounce' :
                              selectedSide === "tails" && selectedCharacter.animation === 'glitter' ? 'animate-pulse' :
                              selectedSide === "tails" && selectedCharacter.animation === 'rainbow' ? 'animate-pulse' : ''
                            }`}
                          />
                        </div>
                      </div>
                      <span className="text-lg font-bold">Tails</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coin Flip Animation Area */}
          <div className="w-full max-w-md mb-8 flex justify-center">
            <div className="relative h-64 w-64 flex items-center justify-center">
              {/* Special ability message */}
              {specialAbilityActive && (
                <div className="absolute -top-10 left-0 right-0 bg-gold/20 text-gold font-bold py-2 px-4 rounded-lg text-center animate-bounce z-30">
                  {specialAbilityMessage}
                </div>
              )}

              {/* Combo multiplier message */}
              {showComboMessage && comboMultiplier > 1 && (
                <div className="absolute -top-10 left-0 right-0 bg-orange-500/20 text-orange-400 font-bold py-2 px-4 rounded-lg text-center z-30">
                  {comboMultiplier}x Combo Multiplier!
                </div>
              )}

              {/* Jackpot message */}
              {showJackpot && (
                <div className="absolute -top-16 left-0 right-0 bg-gradient-to-r from-purple-600 via-gold to-orange-500 text-white font-bold py-3 px-4 rounded-lg text-center text-xl animate-pulse z-30">
                  JACKPOT! +{jackpotAmount} GOLD!
                </div>
              )}

              {/* Result coin */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ scale: 0, rotate: 0, y: 50, opacity: 0 }}
                    animate={{ scale: 1, rotate: 720, y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
                    className="absolute inset-0 flex items-center justify-center z-20"
                  >
                    <div
                      className={`w-56 h-56 rounded-full flex items-center justify-center ${
                        hasWon
                          ? "bg-gradient-to-r from-green-500 to-emerald-400 shadow-lg shadow-green-500/30"
                          : "bg-gradient-to-r from-red-500 to-rose-400 shadow-lg shadow-red-500/30"
                      }`}
                    >
                      <div className="bg-gradient-to-r from-yellow-400 via-gold to-yellow-500 w-52 h-52 rounded-full flex items-center justify-center shadow-inner">
                        <div className="bg-black/10 w-48 h-48 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <div className="text-black text-2xl font-bold">
                            {result === "heads" ? (
                              <div className="flex flex-col items-center">
                                <div className={`w-28 h-28 rounded-full overflow-hidden ${
                                  selectedCharacter.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-600 via-gold to-orange-500 p-0.5' :
                                  selectedCharacter.rarity === 'epic' ? 'bg-gradient-to-r from-purple-600 to-pink-500 p-0.5' :
                                  selectedCharacter.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 p-0.5' :
                                  selectedCharacter.rarity === 'uncommon' ? 'bg-gradient-to-r from-green-500 to-emerald-400 p-0.5' :
                                  'bg-black p-0.5'
                                } mb-2`}>
                                  <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center">
                                    <img
                                      src={selectedCharacter.image}
                                      alt={selectedCharacter.name}
                                      className={`w-24 h-24 object-contain ${
                                        hasWon && selectedCharacter.animation === 'spin' ? 'animate-spin-slow' :
                                        hasWon && selectedCharacter.animation === 'pulse' ? 'animate-pulse' :
                                        hasWon && selectedCharacter.animation === 'bounce' ? 'animate-bounce' :
                                        hasWon && selectedCharacter.animation === 'glitter' ? 'animate-pulse' :
                                        hasWon && selectedCharacter.animation === 'rainbow' ? 'animate-pulse' : ''
                                      }`}
                                    />
                                  </div>
                                </div>
                                <span className="text-lg">Heads</span>
                                {hasWon && (
                                  <div className="flex items-center mt-1">
                                    <Crown className="h-5 w-5 text-yellow-600 mr-1" />
                                    <span className="text-green-800 font-bold">Winner!</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <div className={`w-28 h-28 rounded-full overflow-hidden ${
                                  selectedCharacter.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-600 via-gold to-orange-500 p-0.5' :
                                  selectedCharacter.rarity === 'epic' ? 'bg-gradient-to-r from-purple-600 to-pink-500 p-0.5' :
                                  selectedCharacter.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 p-0.5' :
                                  selectedCharacter.rarity === 'uncommon' ? 'bg-gradient-to-r from-green-500 to-emerald-400 p-0.5' :
                                  'bg-black p-0.5'
                                } mb-2 rotate-180`}>
                                  <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center">
                                    <img
                                      src={selectedCharacter.image}
                                      alt={selectedCharacter.name}
                                      className={`w-24 h-24 object-contain rotate-180 ${
                                        hasWon && selectedCharacter.animation === 'spin' ? 'animate-spin-slow' :
                                        hasWon && selectedCharacter.animation === 'pulse' ? 'animate-pulse' :
                                        hasWon && selectedCharacter.animation === 'bounce' ? 'animate-bounce' :
                                        hasWon && selectedCharacter.animation === 'glitter' ? 'animate-pulse' :
                                        hasWon && selectedCharacter.animation === 'rainbow' ? 'animate-pulse' : ''
                                      }`}
                                    />
                                  </div>
                                </div>
                                <span className="text-lg">Tails</span>
                                {hasWon && (
                                  <div className="flex items-center mt-1">
                                    <Crown className="h-5 w-5 text-yellow-600 mr-1" />
                                    <span className="text-green-800 font-bold">Winner!</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Flipping coin animation */}
              {isFlipping && (
                <motion.div
                  ref={coinRef}
                  animate={coinAnimationControls}
                  className="absolute inset-0 flex items-center justify-center perspective-1000 z-10"
                >
                  <div className="relative w-56 h-56 transform-style-3d">
                    {/* Heads side */}
                    <div className="absolute w-full h-full backface-hidden rounded-full bg-gradient-to-r from-yellow-400 via-gold to-yellow-500 flex items-center justify-center shadow-lg">
                      <div className="w-52 h-52 rounded-full bg-black/10 flex items-center justify-center backdrop-blur-sm">
                        <div className={`w-32 h-32 rounded-full overflow-hidden ${
                          selectedCharacter.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-600 via-gold to-orange-500 p-0.5' :
                          selectedCharacter.rarity === 'epic' ? 'bg-gradient-to-r from-purple-600 to-pink-500 p-0.5' :
                          selectedCharacter.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 p-0.5' :
                          selectedCharacter.rarity === 'uncommon' ? 'bg-gradient-to-r from-green-500 to-emerald-400 p-0.5' :
                          'bg-black p-0.5'
                        }`}>
                          <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center">
                            <img
                              src={selectedCharacter.image}
                              alt={selectedCharacter.name}
                              className="w-28 h-28 object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tails side */}
                    <div className="absolute w-full h-full backface-hidden rounded-full bg-gradient-to-r from-yellow-400 via-gold to-yellow-500 flex items-center justify-center rotate-y-180 shadow-lg">
                      <div className="w-52 h-52 rounded-full bg-black/10 flex items-center justify-center backdrop-blur-sm">
                        <div className={`w-32 h-32 rounded-full overflow-hidden ${
                          selectedCharacter.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-600 via-gold to-orange-500 p-0.5' :
                          selectedCharacter.rarity === 'epic' ? 'bg-gradient-to-r from-purple-600 to-pink-500 p-0.5' :
                          selectedCharacter.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-cyan-400 p-0.5' :
                          selectedCharacter.rarity === 'uncommon' ? 'bg-gradient-to-r from-green-500 to-emerald-400 p-0.5' :
                          'bg-black p-0.5'
                        } rotate-180`}>
                          <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center">
                            <img
                              src={selectedCharacter.image}
                              alt={selectedCharacter.name}
                              className="w-28 h-28 object-contain rotate-180"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flipping text */}
                  <div className="absolute -bottom-12 left-0 right-0 text-center">
                    <div className="text-gold text-xl font-bold animate-pulse">Flipping...</div>
                    <div className="text-xs text-gray-400 mt-1">Good luck!</div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Bet Amount */}
          <div className="w-full max-w-md mb-6">
            <Card className="border-gold/30 bg-black/60 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-gold/50 to-amber-500/50"></div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-gold flex items-center">
                    <Coins className="h-5 w-5 mr-2 text-gold" />
                    Bet Amount
                  </CardTitle>
                  <div className="flex items-center bg-black/40 px-3 py-1 rounded-full border border-gold/20">
                    <Coins className="h-4 w-4 mr-1 text-gold" />
                    <span className="text-sm font-medium text-gold">{balance} GOLD</span>
                    {gameMode === "paid" && connected && (
                      <Badge className="ml-2 bg-gold/20 text-gold text-xs">Real</Badge>
                    )}
                  </div>
                </div>
                <CardDescription>Set your bet and try your luck</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-gold to-yellow-500 text-transparent bg-clip-text">
                      {betAmount} GOLD
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gold/50 text-gold hover:bg-gold/10 h-8"
                        onClick={() => setBetAmount(minBet)}
                        disabled={isFlipping}
                      >
                        MIN
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gold/50 text-gold hover:bg-gold/10 h-8"
                        onClick={() => setBetAmount(Math.floor(balance * 0.5))}
                        disabled={isFlipping}
                      >
                        HALF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gold/50 text-gold hover:bg-gold/10 h-8"
                        onClick={handleMaxBet}
                        disabled={isFlipping}
                      >
                        MAX
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    <Slider
                      defaultValue={[50]}
                      max={maxBet}
                      step={10}
                      value={[betAmount]}
                      onValueChange={handleBetAmountChange}
                      disabled={isFlipping}
                      className="z-10 relative"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-gold/20 to-gold/10 rounded-full blur-sm"></div>
                  </div>

                  <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>Min: {minBet}</span>
                    <span>Max: {maxBet}</span>
                  </div>
                </div>

                {/* Potential Win */}
                <div className="bg-black/40 rounded-lg p-3 border border-gold/10">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-300">Potential Win:</div>
                    <div className="text-lg font-bold text-green-400">
                      {Math.round(betAmount * (comboMultiplier > 1 ? comboMultiplier : 1))} GOLD
                      {comboMultiplier > 1 && (
                        <span className="text-xs ml-1 text-orange-400">({comboMultiplier}x)</span>
                      )}
                    </div>
                  </div>
                  {selectedCharacter.ability === "REWARD_BOOST" && (
                    <div className="flex justify-between items-center mt-1 text-xs">
                      <div className="text-gray-400">Character Bonus:</div>
                      <div className="text-gold">+{Math.round(betAmount * 0.1)} GOLD (10%)</div>
                    </div>
                  )}
                  {selectedCharacter.ability === "DOUBLE_WIN" && (
                    <div className="flex justify-between items-center mt-1 text-xs">
                      <div className="text-gray-400">Double Win Chance:</div>
                      <div className="text-gold">2%</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Wallet Connection Warning */}
          {gameMode === "paid" && !connected && (
            <div className="w-full max-w-md mb-6">
              <Card className="border-red-500/30 bg-red-950/20 overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-red-500/50 to-rose-500/50"></div>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-red-400">
                    <div className="w-10 h-10 rounded-full bg-red-950 flex items-center justify-center">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Wallet Not Connected</p>
                      <p className="text-sm">Connect your wallet to play in paid mode</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Transaction Pending */}
          {transactionPending && (
            <div className="w-full max-w-md mb-6">
              <Card className="border-yellow-500/30 bg-yellow-950/20 overflow-hidden">
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-yellow-500/50 to-amber-500/50"></div>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-yellow-400">
                    <div className="w-10 h-10 rounded-full bg-yellow-950 flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
                    </div>
                    <div>
                      <p className="font-medium">Transaction Pending</p>
                      <p className="text-sm">Please wait while your transaction is being processed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Flip Button */}
          <div className="w-full max-w-md mb-6">
            <div className="relative">
              <Button
                className={`w-full h-16 relative overflow-hidden ${
                  !selectedSide || isFlipping || betAmount <= 0 || betAmount > balance || (gameMode === "paid" && !connected) || transactionPending
                    ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-400 via-gold to-yellow-500 hover:from-yellow-500 hover:via-amber-500 hover:to-yellow-600 text-black"
                }`}
                disabled={
                  !selectedSide ||
                  isFlipping ||
                  betAmount <= 0 ||
                  betAmount > balance ||
                  (gameMode === "paid" && !connected) ||
                  transactionPending
                }
                onClick={flipCoin}
              >
                {/* Animated background for enabled button */}
                {!(
                  !selectedSide ||
                  isFlipping ||
                  betAmount <= 0 ||
                  betAmount > balance ||
                  (gameMode === "paid" && !connected) ||
                  transactionPending
                ) && (
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 left-0 right-0 h-px bg-white animate-shimmer"></div>
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-white animate-shimmer delay-150"></div>
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-white animate-shimmer-vertical"></div>
                      <div className="absolute right-0 top-0 bottom-0 w-px bg-white animate-shimmer-vertical delay-150"></div>
                    </div>
                  </div>
                )}

                {isFlipping ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin mr-3 h-6 w-6 border-3 border-white border-t-transparent rounded-full"></div>
                    <span className="text-lg font-bold">Flipping...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <div className="absolute left-4 flex space-x-1">
                      <Star className="h-5 w-5 text-black fill-black animate-pulse" />
                      <Star className="h-4 w-4 text-black fill-black animate-pulse delay-100" />
                      <Star className="h-3 w-3 text-black fill-black animate-pulse delay-200" />
                    </div>
                    <span className="text-xl font-bold">FLIP COIN</span>
                    <div className="absolute right-4 flex space-x-1">
                      <Star className="h-3 w-3 text-black fill-black animate-pulse delay-200" />
                      <Star className="h-4 w-4 text-black fill-black animate-pulse delay-100" />
                      <Star className="h-5 w-5 text-black fill-black animate-pulse" />
                    </div>
                  </div>
                )}
              </Button>

              {/* Shadow effect */}
              <div className="absolute -bottom-3 left-4 right-4 h-6 bg-gold/20 blur-md rounded-full"></div>
            </div>

            {gameMode === "paid" && (
              <p className="text-xs text-center mt-3 text-gray-400">
                {connected
                  ? "Playing with real GOLD tokens. Winnings will be credited to your wallet."
                  : "Connect your wallet to play with real GOLD tokens."}
              </p>
            )}

            {/* Game tips */}
            <div className="mt-4 bg-black/40 rounded-lg p-3 border border-gold/10">
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <Sparkles className="h-4 w-4 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-gray-300">
                    <span className="text-gold font-medium">Tip:</span> Win consecutive flips within 10 seconds to build a combo multiplier and increase your rewards!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Card className="border-gold/30 bg-black/60 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gold flex justify-between items-center">
              <span>Game Stats</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gold h-8 px-2"
                onClick={() => setShowStats(!showStats)}
              >
                {showStats ? "Hide" : "Show"}
              </Button>
            </CardTitle>
            <CardDescription>Your performance in {gameMode} mode</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <AnimatePresence>
              {showStats && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-black/40 border border-gold/20 rounded-lg p-3">
                      <div className="text-xs text-gray-400">Total Flips</div>
                      <div className="mt-1 text-xl font-bold flex items-center">
                        <Coins className="h-4 w-4 mr-2 text-gold" />
                        {flipCount}
                      </div>
                    </div>
                    <div className="bg-black/40 border border-gold/20 rounded-lg p-3">
                      <div className="text-xs text-gray-400">Win Rate</div>
                      <div className="mt-1 text-xl font-bold text-green-500">
                        {flipCount > 0
                          ? `${Math.round((gameHistory.filter((g) => g.won).length / flipCount) * 100)}%`
                          : "0%"}
                      </div>
                    </div>
                    <div className="bg-black/40 border border-gold/20 rounded-lg p-3">
                      <div className="text-xs text-gray-400">Current Streak</div>
                      <div className="mt-1 text-xl font-bold text-gold flex items-center">
                        <Star className="h-4 w-4 mr-2 fill-gold" />
                        {winStreak}
                      </div>
                    </div>
                    <div className="bg-black/40 border border-gold/20 rounded-lg p-3">
                      <div className="text-xs text-gray-400">Biggest Win</div>
                      <div className="mt-1 text-xl font-bold text-green-500">
                        {gameHistory.filter((g) => g.won).length > 0
                          ? `${Math.max(...gameHistory.filter((g) => g.won).map((g) => g.bet))} GOLD`
                          : "0 GOLD"}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <h3 className="text-lg font-bold mb-4 text-gold">Recent Flips</h3>
            {gameHistory.length > 0 ? (
              <div className="space-y-3">
                {gameHistory.map((game, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-gold/20 rounded-lg bg-black/40">
                    <div>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${game.won ? "bg-green-500" : "bg-red-500"} mr-2`}></div>
                        <span className="font-medium">{game.side}</span>
                        <ArrowRight className="h-3 w-3 mx-1 text-gray-400" />
                        <span>{game.result}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{game.time}</div>
                    </div>
                    <div className={`font-bold ${game.won ? "text-green-500" : "text-red-500"}`}>
                      {game.won ? "+" : "-"}
                      {game.bet} GOLD
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400 border border-dashed border-gray-700 rounded-lg">
                No games played yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gold/30 bg-black/60 backdrop-blur-sm mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gold">Leaderboard</CardTitle>
            <CardDescription>Top players this week</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-3">
              {[
                { name: "CryptoKing", character: CHARACTERS[0], wins: 145, profit: 12500 },
                { name: "GoldRush", character: CHARACTERS[1], wins: 132, profit: 8750 },
                { name: "LuckyFlip", character: CHARACTERS[2], wins: 118, profit: 7200 },
                { name: "You", character: selectedCharacter, wins: 85, profit: 4200, isYou: true },
                { name: "CoinMaster", character: CHARACTERS[3], wins: 76, profit: 3800 },
              ].map((player, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-3 rounded-lg ${
                    player.isYou ? "border-2 border-gold bg-gold/10" : "border border-gold/20 bg-black/40"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center mr-2 overflow-hidden">
                      {index === 0 && <Crown className="h-4 w-4 text-yellow-400 absolute -top-1" />}
                      <img
                        src={player.character.image}
                        alt={player.character.name}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <div>
                      <span className={player.isYou ? "font-bold text-gold" : "font-medium"}>{player.name}</span>
                      {player.isYou && <span className="text-xs ml-2 text-gold">(You)</span>}
                      <div className="text-xs text-gray-400">Rank #{index + 1}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{player.wins} wins</div>
                    <div className="text-xs text-green-500">+{player.profit} GOLD</div>
                  </div>
                </div>
              ))}
            </div>
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
                <span>Select your lucky character for good fortune</span>
              </p>
              <p className="flex items-start">
                <span className="text-gold mr-2">3.</span>
                <span>Pick Heads or Tails and set your bet amount</span>
              </p>
              <p className="flex items-start">
                <span className="text-gold mr-2">4.</span>
                <span>Flip the coin and see if luck is on your side!</span>
              </p>
              <p className="flex items-start">
                <span className="text-gold mr-2">5.</span>
                <span>Win double your bet if you guess correctly</span>
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
