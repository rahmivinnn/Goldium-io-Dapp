"use client"

import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Coins, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

// Add this prop to the component
export default function CoinFlipGame({ demoMode = false }) {
  const { toast } = useToast()
  const [betAmount, setBetAmount] = useState(50)
  const [selectedSide, setSelectedSide] = useState<"heads" | "tails" | null>(null)
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState<"heads" | "tails" | null>(null)
  const [hasWon, setHasWon] = useState<boolean | null>(null)
  const [gameHistory, setGameHistory] = useState<
    Array<{ bet: number; side: string; result: string; won: boolean; time: string }>
  >([])
  const [balance, setBalance] = useState(1850)
  const [winStreak, setWinStreak] = useState(0)
  const [flipCount, setFlipCount] = useState(0)
  const [showStats, setShowStats] = useState(false)

  const maxBet = 500
  const minBet = 10

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

  // Modify the flipCoin function to handle demo mode
  const flipCoin = () => {
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

    // If in demo mode and not connected, show a toast
    if (demoMode) {
      toast({
        title: "Demo Mode",
        description: "Connect your wallet to earn real GOLD tokens!",
        variant: "default",
      })
    }

    setIsFlipping(true)
    setResult(null)
    setHasWon(null)

    // Simulate coin flip animation
    setTimeout(() => {
      const flipResult = Math.random() > 0.5 ? "heads" : "tails"
      setResult(flipResult)
      const won = selectedSide === flipResult
      setHasWon(won)

      // Update balance
      setBalance((prev) => (won ? prev + betAmount : prev - betAmount))

      // Update win streak
      setWinStreak((prev) => (won ? prev + 1 : 0))

      // Update flip count
      setFlipCount((prev) => prev + 1)

      // Add to history
      setGameHistory((prev) => [
        {
          bet: betAmount,
          side: selectedSide,
          result: flipResult,
          won,
          time: "Just now",
        },
        ...prev.slice(0, 4),
      ])

      // Show toast
      toast({
        title: won ? "You Won!" : "You Lost",
        description: won
          ? `Congratulations! You won ${betAmount} GOLD.`
          : `Better luck next time. You lost ${betAmount} GOLD.`,
        variant: won ? "default" : "destructive",
      })

      setIsFlipping(false)
    }, 2000)
  }

  const [coinRotation, setCoinRotation] = useState(0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="flex flex-col items-center">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Flip a Coin</h2>
            <p className="text-gray-400">Choose heads or tails and place your bet</p>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={selectedSide === "heads" ? "default" : "outline"}
              className={`w-32 h-32 rounded-full ${
                selectedSide === "heads" ? "bg-gold text-black" : "border-gold/50 text-white hover:bg-gold/10"
              }`}
              onClick={() => setSelectedSide("heads")}
              disabled={isFlipping}
            >
              <div className="flex flex-col items-center">
                <Coins className="h-10 w-10 mb-2" />
                <span className="text-lg font-bold">Heads</span>
              </div>
            </Button>

            <Button
              variant={selectedSide === "tails" ? "default" : "outline"}
              className={`w-32 h-32 rounded-full ${
                selectedSide === "tails" ? "bg-gold text-black" : "border-gold/50 text-white hover:bg-gold/10"
              }`}
              onClick={() => setSelectedSide("tails")}
              disabled={isFlipping}
            >
              <div className="flex flex-col items-center">
                <Coins className="h-10 w-10 mb-2 rotate-180" />
                <span className="text-lg font-bold">Tails</span>
              </div>
            </Button>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 720 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="mb-8"
              >
                <div
                  className={`w-40 h-40 rounded-full flex items-center justify-center ${
                    hasWon ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  <div className="bg-gold w-36 h-36 rounded-full flex items-center justify-center">
                    <div className="text-black text-2xl font-bold">
                      {result === "heads" ? (
                        <div className="flex flex-col items-center">
                          <Coins className="h-12 w-12 mb-1" />
                          <span>Heads</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Coins className="h-12 w-12 mb-1 rotate-180" />
                          <span>Tails</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isFlipping && (
            <motion.div
              animate={{ rotateY: [0, 180, 360, 540, 720, 900, 1080] }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="mb-8"
            >
              <div className="w-40 h-40 rounded-full bg-gold flex items-center justify-center">
                <div className="bg-black w-36 h-36 rounded-full flex items-center justify-center">
                  <div className="text-gold text-2xl font-bold">Flipping...</div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="w-full max-w-md mb-6">
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
                  disabled={isFlipping}
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
                disabled={isFlipping}
              />
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>Min: 10</span>
                <span>Max: {maxBet}</span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md">
            <Button
              className="gold-button w-full"
              disabled={!selectedSide || isFlipping || betAmount <= 0 || betAmount > balance}
              onClick={flipCoin}
            >
              {isFlipping ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Flipping...
                </div>
              ) : (
                "Flip Coin"
              )}
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Card className="border-gold bg-black">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Game Stats</h3>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gold"
                onClick={() => setShowStats(!showStats)}
              >
                {showStats ? "Hide" : "Show"}
              </Button>
            </div>

            <AnimatePresence>
              {showStats && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Flips</span>
                      <span className="font-bold">{flipCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Win Rate</span>
                      <span className="font-bold text-green-500">
                        {flipCount > 0
                          ? `${Math.round((gameHistory.filter((g) => g.won).length / flipCount) * 100)}%`
                          : "0%"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Streak</span>
                      <span className="font-bold text-gold">{winStreak}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Biggest Win</span>
                      <span className="font-bold text-green-500">
                        {gameHistory.filter((g) => g.won).length > 0
                          ? `${Math.max(...gameHistory.filter((g) => g.won).map((g) => g.bet))} GOLD`
                          : "0 GOLD"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <h3 className="text-lg font-bold mb-4">Recent Flips</h3>
            {gameHistory.length > 0 ? (
              <div className="space-y-3">
                {gameHistory.map((game, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border border-gold/20 rounded-lg">
                    <div>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${game.won ? "bg-green-500" : "bg-red-500"} mr-2`}></div>
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
              <div className="text-center py-4 text-gray-400">No games played yet</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gold bg-black mt-4">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold mb-4">Leaderboard</h3>
            <div className="space-y-3">
              {[
                { name: "CryptoKing", wins: 145, profit: 12500 },
                { name: "GoldRush", wins: 132, profit: 8750 },
                { name: "LuckyFlip", wins: 118, profit: 7200 },
                { name: "You", wins: 85, profit: 4200, isYou: true },
                { name: "CoinMaster", wins: 76, profit: 3800 },
              ].map((player, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center p-2 rounded-lg ${
                    player.isYou ? "border-2 border-gold bg-gold/10" : "border border-gold/20"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center mr-2 text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className={player.isYou ? "font-bold text-gold" : "font-medium"}>{player.name}</span>
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
      </div>
    </div>
  )
}
