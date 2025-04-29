"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Card {
  id: number
  value: string
  flipped: boolean
  matched: boolean
}

export default function CardFlipGame() {
  const [betAmount, setBetAmount] = useState(25)
  const [gameStarted, setGameStarted] = useState(false)
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [timer, setTimer] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [winnings, setWinnings] = useState(0)
  const { toast } = useToast()

  const maxBet = 100
  const minBet = 25
  const totalPairs = 6
  const cardValues = ["🗡️", "🛡️", "🧙", "🏆", "💎", "🔮"]

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (isNaN(value)) {
      setBetAmount(minBet)
    } else {
      setBetAmount(Math.min(Math.max(value, minBet), maxBet))
    }
  }

  const startGame = () => {
    // Create and shuffle cards
    const newCards: Card[] = []
    for (let i = 0; i < totalPairs; i++) {
      newCards.push({ id: i * 2, value: cardValues[i], flipped: false, matched: false })
      newCards.push({ id: i * 2 + 1, value: cardValues[i], flipped: false, matched: false })
    }

    // Fisher-Yates shuffle
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newCards[i], newCards[j]] = [newCards[j], newCards[i]]
    }

    setCards(newCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setTimer(0)
    setGameOver(false)
    setWinnings(0)
    setGameStarted(true)

    // Notify game start
    toast({
      title: "Game Started",
      description: "Find all matching pairs to win!",
    })
  }

  const flipCard = (id: number) => {
    // Don't allow flipping if already two cards are flipped or card is already flipped/matched
    if (flippedCards.length >= 2) return

    const card = cards.find((c) => c.id === id)
    if (!card || card.flipped || card.matched) return

    // Play flip sound effect (simulated)
    const playFlipSound = () => {
      // In a real implementation, this would play a sound
      console.log("Card flip sound played")
    }
    playFlipSound()

    // Flip the card
    setCards(cards.map((c) => (c.id === id ? { ...c, flipped: true } : c)))
    setFlippedCards([...flippedCards, id])
  }

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(moves + 1)

      const [first, second] = flippedCards
      const firstCard = cards.find((c) => c.id === first)
      const secondCard = cards.find((c) => c.id === second)

      if (firstCard?.value === secondCard?.value) {
        // Match found
        setCards(cards.map((c) => (c.id === first || c.id === second ? { ...c, matched: true } : c)))
        setMatchedPairs(matchedPairs + 1)
        setFlippedCards([])
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setCards(cards.map((c) => (c.id === first || c.id === second ? { ...c, flipped: false } : c)))
          setFlippedCards([])
        }, 1000)
      }
    }
  }, [flippedCards])

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [gameStarted, gameOver])

  // Check for game over
  useEffect(() => {
    if (matchedPairs === totalPairs && gameStarted) {
      setGameOver(true)

      // Calculate winnings based on speed and moves
      const timeBonus = Math.max(0, 120 - timer) * 0.5
      const moveBonus = Math.max(0, 20 - moves) * 2
      const totalWinnings = Math.round(betAmount + (betAmount * (timeBonus + moveBonus)) / 100)

      setWinnings(totalWinnings)

      toast({
        title: "Game Completed!",
        description: `You won ${totalWinnings} GOLD!`,
      })
    }
  }, [matchedPairs, gameStarted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (!gameStarted) {
    return (
      <div className="max-w-md mx-auto">
        <h3 className="text-xl font-bold mb-4">Memory Card Game</h3>
        <p className="text-gray-400 mb-6">
          Flip cards to find matching pairs. The faster you complete the game with fewer moves, the more GOLD you win!
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Entry Fee (GOLD)</label>
          <div className="flex items-center">
            <Input
              type="number"
              value={betAmount}
              onChange={handleBetChange}
              min={minBet}
              max={maxBet}
              className="bg-black border-gold/50 focus:border-gold"
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Min: {minBet} GOLD | Max: {maxBet} GOLD
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-gold/5 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Entry Fee</span>
              <span className="font-bold text-gold">{betAmount} GOLD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Potential Win</span>
              <span className="font-bold text-green-500">Up to {betAmount * 3} GOLD</span>
            </div>
          </div>
        </div>

        <Button className="gold-button w-full" onClick={startGame}>
          Start Game
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-gold mr-2" />
          <span className="font-bold">{formatTime(timer)}</span>
        </div>
        <div>
          <span className="text-gray-400 mr-2">Moves:</span>
          <span className="font-bold">{moves}</span>
        </div>
        <div>
          <span className="text-gray-400 mr-2">Pairs:</span>
          <span className="font-bold">
            {matchedPairs}/{totalPairs}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`aspect-square rounded-lg cursor-pointer transition-all duration-300 transform ${
              card.flipped || card.matched ? "rotate-y-180" : ""
            }`}
            onClick={() => !gameOver && flipCard(card.id)}
          >
            <div className="relative w-full h-full perspective-1000">
              <div
                className={`absolute inset-0 backface-hidden transition-all duration-300 ${
                  card.flipped || card.matched ? "opacity-0" : "opacity-100"
                }`}
              >
                <div className="w-full h-full bg-black border-2 border-gold rounded-lg flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-gold" />
                </div>
              </div>
              <div
                className={`absolute inset-0 backface-hidden transition-all duration-300 ${
                  card.flipped || card.matched ? "opacity-100" : "opacity-0"
                }`}
              >
                <div
                  className={`w-full h-full bg-gold rounded-lg flex items-center justify-center text-black text-4xl ${
                    card.matched ? "bg-green-500" : ""
                  }`}
                >
                  {card.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="bg-gold/10 border border-gold rounded-lg p-4 text-center mb-6">
          <h3 className="text-xl font-bold mb-2">Game Completed!</h3>
          <p className="mb-2">
            Time: {formatTime(timer)} | Moves: {moves}
          </p>
          <p className="text-2xl font-bold text-gold mb-4">You won {winnings} GOLD!</p>
          <Button className="gold-button" onClick={startGame}>
            Play Again
          </Button>
        </div>
      )}
    </div>
  )
}
