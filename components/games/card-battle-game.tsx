"use client"

import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Sword, Shield, Wand2, Heart, Zap, User, Trophy, XCircle, Crown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

// Card types and data
const CARD_TYPES = {
  ATTACK: { name: "Attack", icon: Sword, color: "text-red-500" },
  DEFENSE: { name: "Defense", icon: Shield, color: "text-blue-500" },
  MAGIC: { name: "Magic", icon: Zap, color: "text-purple-500" },
  HEAL: { name: "Heal", icon: Heart, color: "text-green-500" },
}

const PLAYER_DECK = [
  { id: 1, type: CARD_TYPES.ATTACK, name: "Sword Slash", power: 15, description: "Deal 15 damage to opponent" },
  { id: 2, type: CARD_TYPES.ATTACK, name: "Double Strike", power: 10, description: "Deal 10 damage twice" },
  { id: 3, type: CARD_TYPES.DEFENSE, name: "Shield Wall", power: 15, description: "Block 15 damage" },
  { id: 4, type: CARD_TYPES.DEFENSE, name: "Fortify", power: 10, description: "Block 10 damage and gain 5 armor" },
  { id: 5, type: CARD_TYPES.MAGIC, name: "Fireball", power: 20, description: "Deal 20 damage, ignores defense" },
  { id: 6, type: CARD_TYPES.MAGIC, name: "Lightning", power: 12, description: "Deal 12 damage and stun for 1 turn" },
  { id: 7, type: CARD_TYPES.HEAL, name: "Healing Potion", power: 15, description: "Restore 15 health" },
  { id: 8, type: CARD_TYPES.HEAL, name: "Regeneration", power: 8, description: "Restore 8 health and draw a card" },
]

const OPPONENT_DECK = [
  { id: 101, type: CARD_TYPES.ATTACK, name: "Crushing Blow", power: 18, description: "Deal 18 damage to player" },
  { id: 102, type: CARD_TYPES.ATTACK, name: "Quick Strike", power: 12, description: "Deal 12 damage to player" },
  { id: 103, type: CARD_TYPES.DEFENSE, name: "Iron Defense", power: 18, description: "Block 18 damage" },
  { id: 104, type: CARD_TYPES.DEFENSE, name: "Parry", power: 12, description: "Block 12 damage and counter with 5" },
  { id: 105, type: CARD_TYPES.MAGIC, name: "Frost Nova", power: 15, description: "Deal 15 damage, ignores defense" },
  { id: 106, type: CARD_TYPES.MAGIC, name: "Shadow Bolt", power: 10, description: "Deal 10 damage and drain 5 health" },
  { id: 107, type: CARD_TYPES.HEAL, name: "Life Drain", power: 12, description: "Restore 12 health" },
  { id: 108, type: CARD_TYPES.HEAL, name: "Rejuvenate", power: 10, description: "Restore 10 health and gain 5 armor" },
]

// Define Card and Deck types
interface CardType {
  id: string
  name: string
  type: "attack" | "defense" | "magic"
  power: number
  image: string
}

interface Deck {
  id: string
  name: string
  cards: CardType[]
}

// Sample cards and decks
const SAMPLE_CARDS: CardType[] = [
  { id: "card1", name: "Dragon's Fury", type: "attack", power: 8, image: "/emerald-inferno.png" },
  { id: "card2", name: "Knight's Shield", type: "defense", power: 7, image: "/guardian-crest.png" },
  { id: "card3", name: "Arcane Blast", type: "magic", power: 9, image: "/arcane-blast.png" },
  { id: "card4", name: "Assassin's Strike", type: "attack", power: 6, image: "/shadow-blade-card.png" },
  {
    id: "card5",
    name: "Stone Wall",
    type: "defense",
    power: 8,
    image: "/enchanted-stone-card.png",
  },
  {
    id: "card6",
    name: "Healing Light",
    type: "magic",
    power: 5,
    image: "/ethereal-mend.png",
  },
  {
    id: "card7",
    name: "Berserker Rage",
    type: "attack",
    power: 10,
    image: "/bloodrage-warrior.png",
  },
  {
    id: "card8",
    name: "Ice Barrier",
    type: "defense",
    power: 9,
    image: "/glacial-aegis.png",
  },
  {
    id: "card9",
    name: "Lightning Bolt",
    type: "magic",
    power: 7,
    image: "/arcane-lightning-strike.png",
  },
]

const SAMPLE_DECKS: Deck[] = [
  {
    id: "deck1",
    name: "Warrior's Might",
    cards: [SAMPLE_CARDS[0], SAMPLE_CARDS[1], SAMPLE_CARDS[3], SAMPLE_CARDS[4], SAMPLE_CARDS[6]],
  },
  {
    id: "deck2",
    name: "Arcane Mastery",
    cards: [SAMPLE_CARDS[2], SAMPLE_CARDS[5], SAMPLE_CARDS[7], SAMPLE_CARDS[8], SAMPLE_CARDS[1]],
  },
]

// Add this prop to the component
export default function CardBattleGame({ demoMode = false }) {
  const { toast } = useToast()
  const [betAmount, setBetAmount] = useState(50)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<"player" | "opponent" | null>(null)
  const [playerHealth, setPlayerHealth] = useState(100)
  const [opponentHealth, setOpponentHealth] = useState(100)
  const [playerArmor, setPlayerArmor] = useState(0)
  const [opponentArmor, setOpponentArmor] = useState(0)
  const [playerStunned, setPlayerStunned] = useState(false)
  const [opponentStunned, setOpponentStunned] = useState(false)
  const [playerHand, setPlayerHand] = useState<typeof PLAYER_DECK>([])
  const [opponentHand, setOpponentHand] = useState<typeof OPPONENT_DECK>([])
  const [playerDeck, setPlayerDeck] = useState<typeof PLAYER_DECK>([])
  const [opponentDeck, setOpponentDeck] = useState<typeof OPPONENT_DECK>([])
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [opponentSelectedCard, setOpponentSelectedCard] = useState<number | null>(null)
  const [turnPhase, setTurnPhase] = useState<"player" | "opponent" | "resolution">("player")
  const [turnCount, setTurnCount] = useState(0)
  const [gameLog, setGameLog] = useState<string[]>([])
  const [gameHistory, setGameHistory] = useState<
    Array<{ bet: number; result: "win" | "loss"; turns: number; reward: number }>
  >([])
  const [balance, setBalance] = useState(1850)
  const [showingCard, setShowingCard] = useState<{ id: number; player: "player" | "opponent" } | null>(null)

  const maxBet = 200

  const handleBetAmountChange = (value: number[]) => {
    setBetAmount(value[0])
  }

  const handleMaxBet = () => {
    setBetAmount(Math.min(balance, maxBet))
  }

  // Initialize game
  // Modify the startGame function to handle demo mode
  const startGame = () => {
    if (betAmount <= 0 || betAmount > balance) {
      toast({
        title: "Invalid Bet",
        description: `Please enter a bet between 1 and ${balance} GOLD.`,
        variant: "destructive",
      })
      return
    }

    // If in demo mode, show a toast
    if (demoMode) {
      toast({
        title: "Demo Mode",
        description: "Connect your wallet to earn real GOLD tokens!",
        variant: "default",
      })
    }

    // Deduct bet amount
    setBalance((prev) => prev - betAmount)

    // Reset game state
    setIsPlaying(true)
    setGameOver(false)
    setWinner(null)
    setPlayerHealth(100)
    setOpponentHealth(100)
    setPlayerArmor(0)
    setOpponentArmor(0)
    setPlayerStunned(false)
    setOpponentStunned(false)
    setSelectedCard(null)
    setOpponentSelectedCard(null)
    setTurnPhase("player")
    setTurnCount(1)
    setGameLog(["Battle started! Your turn to play a card."])

    // Shuffle decks
    const shuffledPlayerDeck = [...PLAYER_DECK].sort(() => Math.random() - 0.5)
    const shuffledOpponentDeck = [...OPPONENT_DECK].sort(() => Math.random() - 0.5)

    // Draw initial hands
    setPlayerHand(shuffledPlayerDeck.slice(0, 4))
    setOpponentHand(shuffledOpponentDeck.slice(0, 4))
    setPlayerDeck(shuffledPlayerDeck.slice(4))
    setOpponentDeck(shuffledOpponentDeck.slice(4))

    toast({
      title: "Battle Started",
      description: "Choose your cards wisely to defeat your opponent!",
    })
  }

  // Handle player card selection
  const selectCard = (cardId: number) => {
    if (turnPhase !== "player" || playerStunned) return
    setSelectedCard(cardId)
  }

  // Play selected card
  const playCard = () => {
    if (!selectedCard) return

    const card = playerHand.find((c) => c.id === selectedCard)
    if (!card) return

    // Remove card from hand
    setPlayerHand((prev) => prev.filter((c) => c.id !== selectedCard))

    // Log the play
    setGameLog((prev) => [...prev, `You played ${card.name}.`])

    // Show card animation
    setShowingCard({ id: card.id, player: "player" })

    // After animation, move to opponent's turn
    setTimeout(() => {
      setShowingCard(null)
      setTurnPhase("opponent")

      // If opponent is stunned, skip their turn
      if (opponentStunned) {
        setGameLog((prev) => [...prev, "Opponent is stunned and skips their turn!"])
        setOpponentStunned(false)
        resolveEffects(card, null)
      } else {
        // Opponent selects a card
        const opponentCard = opponentHand[Math.floor(Math.random() * opponentHand.length)]
        setOpponentSelectedCard(opponentCard.id)
        setOpponentHand((prev) => prev.filter((c) => c.id !== opponentCard.id))
        setGameLog((prev) => [...prev, `Opponent played ${opponentCard.name}.`])

        // Show opponent card animation
        setTimeout(() => {
          setShowingCard({ id: opponentCard.id, player: "opponent" })

          // After animation, resolve effects
          setTimeout(() => {
            setShowingCard(null)
            resolveEffects(card, opponentCard)
          }, 1500)
        }, 1000)
      }
    }, 1500)
  }

  // Resolve card effects
  const resolveEffects = (playerCard: (typeof PLAYER_DECK)[0], opponentCard: (typeof OPPONENT_DECK)[0] | null) => {
    setTurnPhase("resolution")
    let newPlayerHealth = playerHealth
    let newOpponentHealth = opponentHealth
    let newPlayerArmor = playerArmor
    let newOpponentArmor = opponentArmor
    const playerStun = false
    let opponentStun = false

    // Process player card
    if (playerCard) {
      switch (playerCard.type) {
        case CARD_TYPES.ATTACK:
          // Apply damage to opponent
          const playerDamage = playerCard.power
          if (newOpponentArmor > 0) {
            const absorbed = Math.min(newOpponentArmor, playerDamage)
            newOpponentArmor -= absorbed
            const remaining = playerDamage - absorbed
            if (remaining > 0) {
              newOpponentHealth -= remaining
            }
            setGameLog((prev) => [
              ...prev,
              `Your attack dealt ${playerDamage} damage. Opponent's armor absorbed ${absorbed} damage.`,
            ])
          } else {
            newOpponentHealth -= playerDamage
            setGameLog((prev) => [...prev, `Your attack dealt ${playerDamage} damage to opponent.`])
          }

          // Special effects
          if (playerCard.name === "Double Strike") {
            if (newOpponentArmor > 0) {
              const absorbed = Math.min(newOpponentArmor, 10)
              newOpponentArmor -= absorbed
              const remaining = 10 - absorbed
              if (remaining > 0) {
                newOpponentHealth -= remaining
              }
              setGameLog((prev) => [
                ...prev,
                `Your second strike dealt 10 damage. Opponent's armor absorbed ${absorbed} damage.`,
              ])
            } else {
              newOpponentHealth -= 10
              setGameLog((prev) => [...prev, `Your second strike dealt 10 damage to opponent.`])
            }
          }
          break

        case CARD_TYPES.DEFENSE:
          // Apply defense
          newPlayerArmor += playerCard.power
          setGameLog((prev) => [...prev, `You gained ${playerCard.power} armor.`])

          // Special effects
          if (playerCard.name === "Fortify") {
            newPlayerArmor += 5
            setGameLog((prev) => [...prev, `You gained an additional 5 armor from Fortify.`])
          }
          break

        case CARD_TYPES.MAGIC:
          // Magic ignores armor
          newOpponentHealth -= playerCard.power
          setGameLog((prev) => [...prev, `Your ${playerCard.name} dealt ${playerCard.power} magic damage to opponent.`])

          // Special effects
          if (playerCard.name === "Lightning") {
            opponentStun = true
            setGameLog((prev) => [...prev, `Opponent is stunned for the next turn!`])
          }
          break

        case CARD_TYPES.HEAL:
          // Apply healing
          newPlayerHealth = Math.min(100, newPlayerHealth + playerCard.power)
          setGameLog((prev) => [...prev, `You healed for ${playerCard.power} health.`])

          // Special effects
          if (playerCard.name === "Regeneration") {
            // Draw a card if possible
            if (playerDeck.length > 0) {
              const newCard = playerDeck[0]
              setPlayerHand((prev) => [...prev, newCard])
              setPlayerDeck((prev) => prev.slice(1))
              setGameLog((prev) => [...prev, `You drew a card from Regeneration.`])
            }
          }
          break
      }
    }

    // Process opponent card
    if (opponentCard) {
      switch (opponentCard.type) {
        case CARD_TYPES.ATTACK:
          // Apply damage to player
          const opponentDamage = opponentCard.power
          if (newPlayerArmor > 0) {
            const absorbed = Math.min(newPlayerArmor, opponentDamage)
            newPlayerArmor -= absorbed
            const remaining = opponentDamage - absorbed
            if (remaining > 0) {
              newPlayerHealth -= remaining
            }
            setGameLog((prev) => [
              ...prev,
              `Opponent's attack dealt ${opponentDamage} damage. Your armor absorbed ${absorbed} damage.`,
            ])
          } else {
            newPlayerHealth -= opponentDamage
            setGameLog((prev) => [...prev, `Opponent's attack dealt ${opponentDamage} damage to you.`])
          }

          // Special effects
          if (opponentCard.name === "Parry") {
            newPlayerHealth -= 5
            setGameLog((prev) => [...prev, `Opponent's Parry dealt an additional 5 damage to you.`])
          }
          break

        case CARD_TYPES.DEFENSE:
          // Apply defense
          newOpponentArmor += opponentCard.power
          setGameLog((prev) => [...prev, `Opponent gained ${opponentCard.power} armor.`])

          // Special effects
          if (opponentCard.name === "Parry") {
            newPlayerHealth -= 5
            setGameLog((prev) => [...prev, `Opponent's Parry dealt 5 damage to you.`])
          }
          break

        case CARD_TYPES.MAGIC:
          // Magic ignores armor
          newPlayerHealth -= opponentCard.power
          setGameLog((prev) => [
            ...prev,
            `Opponent's ${opponentCard.name} dealt ${opponentCard.power} magic damage to you.`,
          ])

          // Special effects
          if (opponentCard.name === "Shadow Bolt") {
            newOpponentHealth = Math.min(100, newOpponentHealth + 5)
            setGameLog((prev) => [...prev, `Opponent drained 5 health from you.`])
          }
          break

        case CARD_TYPES.HEAL:
          // Apply healing
          newOpponentHealth = Math.min(100, newOpponentHealth + opponentCard.power)
          setGameLog((prev) => [...prev, `Opponent healed for ${opponentCard.power} health.`])

          // Special effects
          if (opponentCard.name === "Rejuvenate") {
            newOpponentArmor += 5
            setGameLog((prev) => [...prev, `Opponent gained 5 armor from Rejuvenate.`])
          }
          break
      }
    }

    // Update state with new values
    setPlayerHealth(newPlayerHealth)
    setOpponentHealth(newOpponentHealth)
    setPlayerArmor(newPlayerArmor)
    setOpponentArmor(newOpponentArmor)
    setOpponentStunned(opponentStun)
    setPlayerStunned(playerStun)

    // Check for game over
    if (newPlayerHealth <= 0 || newOpponentHealth <= 0) {
      const playerWon = newOpponentHealth <= 0
      endGame(playerWon)
    } else {
      // Prepare for next turn
      setTimeout(() => {
        setTurnCount((prev) => prev + 1)
        setSelectedCard(null)
        setOpponentSelectedCard(null)

        // Draw cards if needed
        if (playerHand.length < 4 && playerDeck.length > 0) {
          const newCard = playerDeck[0]
          setPlayerHand((prev) => [...prev, newCard])
          setPlayerDeck((prev) => prev.slice(1))
        }

        if (opponentHand.length < 4 && opponentDeck.length > 0) {
          const newCard = opponentDeck[0]
          setOpponentHand((prev) => [...prev, newCard])
          setOpponentDeck((prev) => prev.slice(1))
        }

        // Start next turn
        setTurnPhase("player")
        setGameLog((prev) => [...prev, `--- Turn ${turnCount + 1} ---`])

        if (playerStunned) {
          setGameLog((prev) => [...prev, "You are stunned and skip your turn!"])
          setPlayerStunned(false)
          setTurnPhase("opponent")

          // Opponent plays automatically
          setTimeout(() => {
            const opponentCard = opponentHand[Math.floor(Math.random() * opponentHand.length)]
            setOpponentSelectedCard(opponentCard.id)
            setOpponentHand((prev) => prev.filter((c) => c.id !== opponentCard.id))
            setGameLog((prev) => [...prev, `Opponent played ${opponentCard.name}.`])

            setShowingCard({ id: opponentCard.id, player: "opponent" })

            setTimeout(() => {
              setShowingCard(null)
              resolveEffects(null, opponentCard)
            }, 1500)
          }, 1000)
        }
      }, 1000)
    }
  }

  // End game
  const endGame = (playerWon: boolean) => {
    setIsPlaying(false)
    setGameOver(true)
    setWinner(playerWon ? "player" : "opponent")

    const reward = playerWon ? Math.round(betAmount * 2) : 0

    // Update balance if won
    if (playerWon) {
      setBalance((prev) => prev + reward)
    }

    // Add to history
    setGameHistory((prev) => [
      {
        bet: betAmount,
        result: playerWon ? "win" : "loss",
        turns: turnCount,
        reward,
      },
      ...prev.slice(0, 4),
    ])

    // Show toast
    toast({
      title: playerWon ? "Victory!" : "Defeat!",
      description: playerWon
        ? `Congratulations! You defeated your opponent and won ${reward} GOLD.`
        : `Your opponent defeated you. You lost ${betAmount} GOLD.`,
      variant: playerWon ? "default" : "destructive",
    })
  }

  const handleEntryFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (isNaN(value)) {
      setEntryFee(50)
    } else {
      setEntryFee(Math.min(Math.max(value, 10), 200))
    }
  }

  const startGameOld = () => {
    setGameStage("deck")
  }

  const selectDeck = (deck: Deck) => {
    setSelectedDeck(deck)

    // Shuffle cards for player and opponent
    const shuffledPlayerCards = [...deck.cards].sort(() => Math.random() - 0.5)
    const shuffledOpponentCards = [...SAMPLE_CARDS].sort(() => Math.random() - 0.5).slice(0, 5)

    setPlayerCards(shuffledPlayerCards)
    setOpponentCards(shuffledOpponentCards)

    setGameStage("battle")
    setBattleLog(["Battle started! Select a card to play."])
  }

  const playCardOld = (card: CardType) => {
    if (selectedCard) return // Already selected a card for this round

    // Prevent multiple clicks
    if (roundResult !== null) return

    setSelectedCard(card)

    // Remove the played card from player's hand
    setPlayerCards(playerCards.filter((c) => c.id !== card.id))

    // Opponent selects a random card
    const randomIndex = Math.floor(Math.random() * opponentCards.length)
    const selectedOpponentCard = opponentCards[randomIndex]
    setOpponentCard(selectedOpponentCard)

    // Remove the played card from opponent's hand
    setOpponentCards(opponentCards.filter((c) => c.id !== selectedOpponentCard.id))

    // Add card play sound effect (simulated)
    const playCardSound = () => {
      // In a real implementation, this would play a sound
      console.log("Card played sound effect")
    }
    playCardSound()

    // Determine round winner
    setTimeout(() => {
      const result = determineRoundWinner(card, selectedOpponentCard)
      setRoundResult(result)

      // Update health based on result
      if (result === "win") {
        setOpponentHealth((prev) => Math.max(0, prev - card.power))
        setBattleLog((prev) => [...prev, `You played ${card.name} and dealt ${card.power} damage!`])
      } else if (result === "lose") {
        setPlayerHealth((prev) => Math.max(0, prev - selectedOpponentCard.power))
        setBattleLog((prev) => [
          ...prev,
          `Opponent played ${selectedOpponentCard.name} and dealt ${selectedOpponentCard.power} damage!`,
        ])
      } else {
        setBattleLog((prev) => [...prev, `Both played similar cards. It's a draw!`])
      }

      // Check if game is over
      setTimeout(() => {
        if (opponentHealth - (result === "win" ? card.power : 0) <= 0) {
          endGameOld("win")
        } else if (playerHealth - (result === "lose" ? selectedOpponentCard.power : 0) <= 0) {
          endGameOld("lose")
        } else {
          // Continue to next round
          setSelectedCard(null)
          setOpponentCard(null)
          setRoundResult(null)

          // Check if out of cards
          if (playerCards.length === 0 && opponentCards.length === 0) {
            // Determine winner by health
            if (playerHealth > opponentHealth) {
              endGameOld("win")
            } else if (opponentHealth > playerHealth) {
              endGameOld("lose")
            } else {
              // It's a draw, but give a small win to the player
              endGameOld("win")
            }
          }
        }
      }, 1000)
    }, 1000)
  }

  const determineRoundWinner = (playerCard: CardType, opponentCard: CardType): "win" | "lose" | "draw" => {
    // Type advantages: attack > magic > defense > attack
    if (playerCard.type === opponentCard.type) {
      return playerCard.power > opponentCard.power ? "win" : playerCard.power < opponentCard.power ? "lose" : "draw"
    }

    if (
      (playerCard.type === "attack" && opponentCard.type === "magic") ||
      (playerCard.type === "magic" && opponentCard.type === "defense") ||
      (playerCard.type === "defense" && opponentCard.type === "attack")
    ) {
      return "win"
    }

    return "lose"
  }

  const endGameOld = (result: "win" | "lose") => {
    setGameResult(result)

    if (result === "win") {
      const winAmount = entryFee * 2
      setWinnings(winAmount)
      toast({
        title: "Victory!",
        description: `You won ${winAmount} GOLD!`,
      })
    } else {
      toast({
        title: "Defeat",
        description: "Better luck next time!",
        variant: "destructive",
      })
    }

    setGameStage("result")
  }

  const resetGame = () => {
    setGameStage("entry")
    setSelectedDeck(null)
    setPlayerHealth(20)
    setOpponentHealth(20)
    setPlayerCards([])
    setOpponentCards([])
    setSelectedCardOld(null)
    setOpponentCard(null)
    setBattleLog([])
    setRoundResult(null)
    setGameResult(null)
    setWinnings(0)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "attack":
        return <Sword className="h-5 w-5 text-red-500" />
      case "defense":
        return <Shield className="h-5 w-5 text-blue-500" />
      case "magic":
        return <Wand2 className="h-5 w-5 text-purple-500" />
      default:
        return null
    }
  }

  const [gameStage, setGameStage] = useState<"entry" | "deck" | "battle" | "result">("entry")
  const [entryFee, setEntryFee] = useState(50)
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null)
  const [playerCards, setPlayerCards] = useState<CardType[]>([])
  const [opponentCards, setOpponentCards] = useState<CardType[]>([])
  const [selectedCardOld, setSelectedCardOld] = useState<CardType | null>(null)
  const [opponentCard, setOpponentCard] = useState<CardType | null>(null)
  const [battleLog, setBattleLog] = useState<string[]>([])
  const [roundResult, setRoundResult] = useState<"win" | "lose" | "draw" | null>(null)
  const [gameResult, setGameResult] = useState<"win" | "lose" | null>(null)
  const [winnings, setWinnings] = useState(0)

  // Entry Fee Screen
  if (!isPlaying && !gameOver) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md mb-6">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold mb-2">Card Battle</h2>
                <p className="text-gray-400">Strategic card game with powerful abilities</p>
              </div>

              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Bet Amount</label>
                <span className="text-sm text-gray-400">Balance: {balance} GOLD</span>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold text-gold">{betAmount} GOLD</div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gold/50 text-gold hover:bg-gold/10"
                    onClick={handleMaxBet}
                  >
                    MAX
                  </Button>
                </div>
                <Slider
                  defaultValue={[50]}
                  max={maxBet}
                  step={10}
                  value={[betAmount]}
                  onValueChange={handleBetAmountChange}
                />
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>Min: 10</span>
                  <span>Max: {maxBet}</span>
                </div>
              </div>

              <Button
                className="gold-button w-full"
                disabled={betAmount <= 0 || betAmount > balance}
                onClick={startGame}
              >
                Start Battle
              </Button>
            </div>
          </div>
        </div>
        <div>
          <Card className="border-gold bg-black">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold mb-4">Battle Stats</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Balance</span>
                  <span className="font-bold text-gold">{balance} GOLD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Battles Fought</span>
                  <span className="font-bold">{gameHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="font-bold text-green-500">
                    {gameHistory.length > 0
                      ? `${Math.round((gameHistory.filter((g) => g.result === "win").length / gameHistory.length) * 100)}%`
                      : "0%"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Earnings</span>
                  <span className="font-bold text-gold">
                    {gameHistory.reduce((sum, game) => sum + (game.result === "win" ? game.reward : 0), 0)} GOLD
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-4">Battle History</h3>
              {gameHistory.length > 0 ? (
                <div className="space-y-3">
                  {gameHistory.map((game, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border border-gold/20 rounded-lg">
                      <div>
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full ${game.result === "win" ? "bg-green-500" : "bg-red-500"} mr-2`}
                          ></div>
                          <span className="font-medium">{game.result === "win" ? "Victory" : "Defeat"}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{game.turns} turns</div>
                      </div>
                      <div className={`font-bold ${game.result === "win" ? "text-green-500" : "text-red-500"}`}>
                        {game.result === "win" ? "+" + game.reward : "-" + game.bet} GOLD
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400">No battles fought yet</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-gold bg-black mt-4">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold mb-4">Card Types</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <Sword className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-bold text-red-500">Attack</span>
                    <p className="text-gray-400">Deal damage to your opponent</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-bold text-blue-500">Defense</span>
                    <p className="text-gray-400">Gain armor to block incoming damage</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Zap className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-bold text-purple-500">Magic</span>
                    <p className="text-gray-400">Deal damage that ignores armor</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Heart className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-bold text-green-500">Heal</span>
                    <p className="text-gray-400">Restore your health points</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Deck Selection Screen
  if (gameStage === "deck") {
    return (
      <div>
        <h3 className="text-xl font-bold mb-4">Select Your Deck</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {SAMPLE_DECKS.map((deck) => (
            <div
              key={deck.id}
              className="border border-gold/50 rounded-lg p-4 cursor-pointer hover:border-gold hover:bg-gold/5"
              onClick={() => selectDeck(deck)}
            >
              <h4 className="text-lg font-bold mb-2">{deck.name}</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {deck.cards.map((card) => (
                  <div key={card.id} className="flex items-center bg-black/50 rounded px-2 py-1">
                    {getTypeIcon(card.type)}
                    <span className="ml-1 text-sm">{card.name}</span>
                  </div>
                ))}
              </div>
              <Button className="gold-button w-full">Select Deck</Button>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Battle Screen
  if (isPlaying || gameOver) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="flex flex-col items-center">
            <div className="w-full">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gold mr-2" />
                  <span className="font-bold">You</span>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400">Turn {turnCount}</div>
                  {turnPhase === "player" && !gameOver && <div className="text-xs text-gold">Your Turn</div>}
                </div>
                <div className="flex items-center">
                  <span className="font-bold">Opponent</span>
                  <Crown className="h-5 w-5 text-red-500 ml-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="border border-gold/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 text-red-500 mr-1" />
                      <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
                        <div
                          className="bg-red-500 h-full rounded-full"
                          style={{ width: `${Math.max(0, playerHealth)}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="ml-2 font-bold">{Math.max(0, playerHealth)}/100</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-blue-500 mr-1" />
                      <span>Armor</span>
                    </div>
                    <span className="font-bold text-blue-500">{playerArmor}</span>
                  </div>

                  {playerStunned && (
                    <div className="mt-2 text-center bg-yellow-500/20 text-yellow-500 rounded px-2 py-1 text-sm">
                      Stunned
                    </div>
                  )}
                </div>

                <div className="border border-gold/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 text-red-500 mr-1" />
                      <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
                        <div
                          className="bg-red-500 h-full rounded-full"
                          style={{ width: `${Math.max(0, opponentHealth)}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="ml-2 font-bold">{Math.max(0, opponentHealth)}/100</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-blue-500 mr-1" />
                      <span>Armor</span>
                    </div>
                    <span className="font-bold text-blue-500">{opponentArmor}</span>
                  </div>

                  {opponentStunned && (
                    <div className="mt-2 text-center bg-yellow-500/20 text-yellow-500 rounded px-2 py-1 text-sm">
                      Stunned
                    </div>
                  )}
                </div>
              </div>

              {/* Card display area */}
              <AnimatePresence>
                {showingCard && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
                  >
                    <motion.div
                      className="w-64 h-96 bg-gold rounded-xl p-4 flex flex-col items-center justify-center text-black"
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {showingCard.player === "player" ? (
                        <div className="text-center">
                          <div className="text-xl font-bold mb-4">
                            {playerHand.find((c) => c.id === showingCard.id)?.name ||
                              PLAYER_DECK.find((c) => c.id === showingCard.id)?.name}
                          </div>
                          <div className="mb-4">
                            {(() => {
                              const card =
                                playerHand.find((c) => c.id === showingCard.id) ||
                                PLAYER_DECK.find((c) => c.id === showingCard.id)
                              if (!card) return null
                              const Icon = card.type.icon
                              return <Icon className={`h-16 w-16 mx-auto ${card.type.color}`} />
                            })()}
                          </div>
                          <div className="text-sm mb-2">
                            {playerHand.find((c) => c.id === showingCard.id)?.description ||
                              PLAYER_DECK.find((c) => c.id === showingCard.id)?.description}
                          </div>
                          <div className="text-lg font-bold">
                            Power:{" "}
                            {playerHand.find((c) => c.id === showingCard.id)?.power ||
                              PLAYER_DECK.find((c) => c.id === showingCard.id)?.power}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="text-xl font-bold mb-4">
                            {opponentHand.find((c) => c.id === showingCard.id)?.name ||
                              OPPONENT_DECK.find((c) => c.id === showingCard.id)?.name}
                          </div>
                          <div className="mb-4">
                            {(() => {
                              const card =
                                opponentHand.find((c) => c.id === showingCard.id) ||
                                OPPONENT_DECK.find((c) => c.id === showingCard.id)
                              if (!card) return null
                              const Icon = card.type.icon
                              return <Icon className={`h-16 w-16 mx-auto ${card.type.color}`} />
                            })()}
                          </div>
                          <div className="text-sm mb-2">
                            {opponentHand.find((c) => c.id === showingCard.id)?.description ||
                              OPPONENT_DECK.find((c) => c.id === showingCard.id)?.description}
                          </div>
                          <div className="text-lg font-bold">
                            Power:{" "}
                            {opponentHand.find((c) => c.id === showingCard.id)?.power ||
                              OPPONENT_DECK.find((c) => c.id === showingCard.id)?.power}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Game over screen */}
              {gameOver && (
                <div className="text-center mb-6 p-6 border border-gold rounded-lg bg-black">
                  <h3 className="text-2xl font-bold mb-2">{winner === "player" ? "Victory!" : "Defeat!"}</h3>
                  <div className="text-6xl mb-4">{winner === "player" ? "🏆" : "💀"}</div>
                  <p className="text-gray-400 mb-4">
                    {winner === "player"
                      ? `You defeated your opponent in ${turnCount} turns!`
                      : `Your opponent defeated you in ${turnCount} turns.`}
                  </p>
                  <div className="mb-4 text-xl">
                    {winner === "player" ? (
                      <span className="text-green-500 font-bold">+{Math.round(betAmount * 2)} GOLD</span>
                    ) : (
                      <span className="text-red-500 font-bold">-{betAmount} GOLD</span>
                    )}
                  </div>
                  <Button
                    className="gold-button"
                    onClick={() => {
                      setGameOver(false)
                    }}
                  >
                    Play Again
                  </Button>
                </div>
              )}

              {/* Player hand */}
              {isPlaying && !gameOver && (
                <>
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">Your Hand</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {playerHand.map((card) => (
                        <div
                          key={card.id}
                          className={`border-2 rounded-lg p-2 cursor-pointer transition-all ${
                            selectedCard === card.id ? "border-gold bg-gold/20" : "border-gold/30 hover:border-gold/60"
                          } ${turnPhase !== "player" || playerStunned ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => turnPhase === "player" && !playerStunned && selectCard(card.id)}
                        >
                          <div className="text-sm font-bold mb-1 truncate">{card.name}</div>
                          <div className="flex justify-center mb-1">
                            {(() => {
                              const Icon = card.type.icon
                              return <Icon className={`h-6 w-6 ${card.type.color}`} />
                            })()}
                          </div>
                          <div className="text-xs text-center">{card.type.name}</div>
                          <div className="text-xs text-center mt-1">Power: {card.power}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {turnPhase === "player" && !playerStunned && (
                    <div className="flex justify-center mb-6">
                      <Button className="gold-button" disabled={!selectedCard} onClick={playCard}>
                        Play Card
                      </Button>
                    </div>
                  )}

                  {/* Opponent hand (face down) */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">Opponent's Hand</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {opponentHand.map((_, index) => (
                        <div key={index} className="border-2 border-red-500/30 rounded-lg p-2 bg-black">
                          <div className="flex justify-center items-center h-16">
                            <Sword className="h-6 w-6 text-red-500/50" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Battle log */}
              <div className="border border-gold/30 rounded-lg p-4 h-48 overflow-y-auto bg-black/50">
                <h3 className="text-lg font-bold mb-2">Battle Log</h3>
                <div className="space-y-1 text-sm">
                  {gameLog.map((log, index) => (
                    <div key={index} className="text-gray-300">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Card className="border-gold bg-black">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold mb-4">Battle Stats</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Balance</span>
                  <span className="font-bold text-gold">{balance} GOLD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Battles Fought</span>
                  <span className="font-bold">{gameHistory.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="font-bold text-green-500">
                    {gameHistory.length > 0
                      ? `${Math.round((gameHistory.filter((g) => g.result === "win").length / gameHistory.length) * 100)}%`
                      : "0%"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Earnings</span>
                  <span className="font-bold text-gold">
                    {gameHistory.reduce((sum, game) => sum + (game.result === "win" ? game.reward : 0), 0)} GOLD
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold mb-4">Battle History</h3>
              {gameHistory.length > 0 ? (
                <div className="space-y-3">
                  {gameHistory.map((game, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border border-gold/20 rounded-lg">
                      <div>
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full ${game.result === "win" ? "bg-green-500" : "bg-red-500"} mr-2`}
                          ></div>
                          <span className="font-medium">{game.result === "win" ? "Victory" : "Defeat"}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{game.turns} turns</div>
                      </div>
                      <div className={`font-bold ${game.result === "win" ? "text-green-500" : "text-red-500"}`}>
                        {game.result === "win" ? "+" + game.reward : "-" + game.bet} GOLD
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400">No battles fought yet</div>
              )}
            </CardContent>
          </Card>

          <Card className="border-gold bg-black mt-4">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold mb-4">Card Types</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <Sword className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-bold text-red-500">Attack</span>
                    <p className="text-gray-400">Deal damage to your opponent</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-bold text-blue-500">Defense</span>
                    <p className="text-gray-400">Gain armor to block incoming damage</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Zap className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-bold text-purple-500">Magic</span>
                    <p className="text-gray-400">Deal damage that ignores armor</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Heart className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-bold text-green-500">Heal</span>
                    <p className="text-gray-400">Restore your health points</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Result Screen
  if (gameStage === "result") {
    return (
      <div className="max-w-md mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4">{gameResult === "win" ? "Victory!" : "Defeat!"}</h3>

        <div className="mb-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-black border-4 border-gold flex items-center justify-center mb-4">
            {gameResult === "win" ? (
              <Trophy className="h-12 w-12 text-gold" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500" />
            )}
          </div>

          {gameResult === "win" ? (
            <div>
              <p className="text-gray-400 mb-2">Congratulations! You've won the battle.</p>
              <p className="text-2xl font-bold text-gold mb-4">+{winnings} GOLD</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-400 mb-2">You've been defeated. Better luck next time!</p>
              <p className="text-xl font-bold text-red-500 mb-4">-{entryFee} GOLD</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 flex-1" onClick={resetGame}>
            New Battle
          </Button>
          <Button className="gold-button flex-1">View Rewards</Button>
        </div>
      </div>
    )
  }

  return null
}
