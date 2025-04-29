"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Coins } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CoinFlipGame() {
  const [betAmount, setBetAmount] = useState(50)
  const [selectedSide, setSelectedSide] = useState<"heads" | "tails" | null>(null)
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState<"heads" | "tails" | null>(null)
  const [hasWon, setHasWon] = useState<boolean | null>(null)
  const [winnings, setWinnings] = useState(0)
  const [coinRotation, setCoinRotation] = useState(0)
  const { toast } = useToast()

  const maxBet = 500
  const minBet = 10

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (isNaN(value)) {
      setBetAmount(minBet)
    } else {
      setBetAmount(Math.min(Math.max(value, minBet), maxBet))
    }
  }

  const handleMaxBet = () => {
    setBetAmount(maxBet)
  }

  const handleMinBet = () => {
    setBetAmount(minBet)
  }

  // Ensure the coin flip game works properly
  const flipCoin = () => {
    if (!selectedSide) {
      toast({
        title: "Select a side",
        description: "Please select heads or tails before flipping",
        variant: "destructive",
      })
      return
    }

    // Prevent multiple clicks during animation
    if (isFlipping) return

    setIsFlipping(true)
    setResult(null)
    setHasWon(null)
    setWinnings(0)

    // Animate coin flip
    const flips = 10 + Math.floor(Math.random() * 5)
    let currentRotation = 0
    const flipInterval = setInterval(() => {
      currentRotation += 180
      setCoinRotation(currentRotation)
    }, 150)

    // Determine result after animation
    setTimeout(() => {
      clearInterval(flipInterval)
      const outcome = Math.random() > 0.5 ? "heads" : "tails"
      setResult(outcome)
      const won = outcome === selectedSide
      setHasWon(won)

      if (won) {
        setWinnings(betAmount * 2)
        toast({
          title: "You won!",
          description: `Congratulations! You won ${betAmount * 2} GOLD`,
          variant: "default",
        })
      } else {
        toast({
          title: "You lost",
          description: `Better luck next time!`,
          variant: "destructive",
        })
      }

      setIsFlipping(false)
    }, 2000)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-xl font-bold mb-4">Place Your Bet</h3>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Bet Amount (GOLD)</label>
          <div className="flex items-center">
            <Input
              type="number"
              value={betAmount}
              onChange={handleBetChange}
              min={minBet}
              max={maxBet}
              className="bg-black border-gold/50 focus:border-gold"
            />
            <Button
              variant="outline"
              size="sm"
              className="ml-2 border-gold/50 text-gold hover:bg-gold/10"
              onClick={handleMinBet}
            >
              Min
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="ml-2 border-gold/50 text-gold hover:bg-gold/10"
              onClick={handleMaxBet}
            >
              Max
            </Button>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Min: {minBet} GOLD | Max: {maxBet} GOLD
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Choose a Side</label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={selectedSide === "heads" ? "default" : "outline"}
              className={selectedSide === "heads" ? "bg-gold text-black" : "border-gold/50 text-white hover:bg-gold/10"}
              onClick={() => setSelectedSide("heads")}
            >
              Heads
            </Button>
            <Button
              variant={selectedSide === "tails" ? "default" : "outline"}
              className={selectedSide === "tails" ? "bg-gold text-black" : "border-gold/50 text-white hover:bg-gold/10"}
              onClick={() => setSelectedSide("tails")}
            >
              Tails
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-gold/5 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Your Bet</span>
              <span className="font-bold text-gold">{betAmount} GOLD</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Potential Win</span>
              <span className="font-bold text-green-500">{betAmount * 2} GOLD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Multiplier</span>
              <span>2x</span>
            </div>
          </div>
        </div>

        <Button className="gold-button w-full" disabled={isFlipping || !selectedSide} onClick={flipCoin}>
          {isFlipping ? "Flipping..." : "Flip Coin"}
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="relative w-40 h-40 mb-8">
          <div
            className={`absolute inset-0 rounded-full bg-gold transition-all duration-500 flex items-center justify-center text-black text-2xl font-bold`}
            style={{
              transform: `rotateY(${coinRotation}deg)`,
              backfaceVisibility: "hidden",
            }}
          >
            <Coins className="h-16 w-16" />
          </div>
          <div
            className={`absolute inset-0 rounded-full bg-black border-2 border-gold transition-all duration-500 flex items-center justify-center text-gold text-2xl font-bold`}
            style={{
              transform: `rotateY(${coinRotation + 180}deg)`,
              backfaceVisibility: "hidden",
            }}
          >
            G
          </div>
        </div>

        {result && (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">
              Result: <span className="capitalize">{result}</span>
            </h3>
            {hasWon !== null && (
              <div className={`text-lg font-bold ${hasWon ? "text-green-500" : "text-red-500"}`}>
                {hasWon ? `You won ${winnings} GOLD!` : "You lost!"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
