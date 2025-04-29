"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { CreditCard, Clock, Trophy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

// Card symbols
const CARD_SYMBOLS = ["🗡️", "🛡️", "🔮", "🏆", "💎", "🔥", "⚡", "🧙‍♂️"]

// Add this prop to the component
export default function CardFlipGame({ demoMode = false }) {
  const { toast } = useToast()
  const [betAmount, setBetAmount] = useState(25)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [cards, setCards] = useState<Array<{ id: number; symbol: string; flipped: boolean; matched: boolean }>>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const [gameHistory, setGameHistory] = useState<
    Array<{ bet: number; pairs: number; moves: number; time: number; won: boolean; reward: number }>
  >([])
  const [balance, setBalance] = useState(1850)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")

  const maxBet = 200

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
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setGameTime(0)

    // Create cards
    const pairs = difficultySettings[difficulty].pairs
    const symbols = [...CARD_SYMBOLS].slice(0, pairs)
    const cardDeck = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        flipped: false,
        matched: false,
      }))

    setCards(cardDeck)

    // Start timer
    if (timer) clearInterval(timer)
    const newTimer = setInterval(() => {
      setGameTime((prev) => {
        if (prev >= difficultySettings[difficulty].timeLimit - 1) {
          clearInterval(newTimer)
          endGame(false)
          return difficultySettings[difficulty].timeLimit
        }
        return prev + 1
      })
    }, 1000)
    setTimer(newTimer)

    toast({
      title: "Game Started",
      description: `Find all ${pairs} pairs before time runs out!`,
    })
  }

  // Handle card flip
  const flipCard = (id: number) => {
    // Prevent flipping if already two cards are flipped or card is already flipped/matched
    if (flippedCards.length >= 2) return
    if (cards.find((card) => card.id === id)?.flipped) return
    if (cards.find((card) => card.id === id)?.matched) return

    // Flip the card
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
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstCardId || card.id === secondCardId ? { ...card, matched: true } : card,
            ),
          )
          setMatchedPairs((prev) => {
            const newMatchedPairs = prev + 1
            if (newMatchedPairs === difficultySettings[difficulty].pairs) {
              endGame(true)
            }
            return newMatchedPairs
          })
          setFlippedCards([])
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstCardId || card.id === secondCardId ? { ...card, flipped: false } : card,
            ),
          )
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  // End game
  const endGame = (won: boolean) => {
    setIsPlaying(false)
    setGameOver(true)
    if (timer) clearInterval(timer)
    setTimer(null)

    const reward = won
      ? Math.round(
          betAmount *
            difficultySettings[difficulty].multiplier *
            (1 - moves / (difficultySettings[difficulty].pairs * 3)),
        )
      : 0

    // Update balance if won
    if (won) {
      setBalance((prev) => prev + reward)
    }

    // Add to history
    setGameHistory((prev) => [
      {
        bet: betAmount,
        pairs: matchedPairs,
        moves,
        time: gameTime,
        won,
        reward,
      },
      ...prev.slice(0, 4),
    ])

    // Show toast
    toast({
      title: won ? "You Won!" : "Game Over",
      description: won
        ? `Congratulations! You found all pairs and won ${reward} GOLD.`
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
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-3">Select Difficulty</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={difficulty === "easy" ? "default" : "outline"}
                    className={
                      difficulty === "easy" ? "bg-gold text-black" : "border-gold/50 text-white hover:bg-gold/10"
                    }
                    onClick={() => setDifficulty("easy")}
                  >
                    Easy
                  </Button>
                  <Button
                    variant={difficulty === "medium" ? "default" : "outline"}
                    className={
                      difficulty === "medium" ? "bg-gold text-black" : "border-gold/50 text-white hover:bg-gold/10"
                    }
                    onClick={() => setDifficulty("medium")}
                  >
                    Medium
                  </Button>
                  <Button
                    variant={difficulty === "hard" ? "default" : "outline"}
                    className={
                      difficulty === "hard" ? "bg-gold text-black" : "border-gold/50 text-white hover:bg-gold/10"
                    }
                    onClick={() => setDifficulty("hard")}
                  >
                    Hard
                  </Button>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  <div>Easy: 6 pairs, 60 seconds, 1.5x multiplier</div>
                  <div>Medium: 8 pairs, 90 seconds, 2x multiplier</div>
                  <div>Hard: 12 pairs, 120 seconds, 3x multiplier</div>
                </div>
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
              </div>

              <Button
                className="gold-button w-full"
                disabled={betAmount <= 0 || betAmount > balance}
                onClick={startGame}
              >
                Start Game
              </Button>
            </div>
          )}

          {(isPlaying || gameOver) && (
            <div className="w-full max-w-xl mb-6">
              <div className="flex justify-between mb-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gold mr-2" />
                  <span className="font-bold">{formatTime(difficultySettings[difficulty].timeLimit - gameTime)}</span>
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

              <div className={`grid grid-cols-${difficulty === "hard" ? "6" : "4"} gap-2 mb-4`}>
                <AnimatePresence>
                  {cards.map((card) => (
                    <motion.div
                      key={card.id}
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={`aspect-square cursor-pointer ${isPlaying ? "hover:border-gold" : ""} ${
                        card.matched ? "border-green-500" : "border-gold/30"
                      } border-2 rounded-lg overflow-hidden perspective-500`}
                      onClick={() => isPlaying && flipCard(card.id)}
                    >
                      <div className="relative w-full h-full transform-style-3d">
                        <div
                          className={`absolute w-full h-full flex items-center justify-center bg-black backface-hidden ${
                            card.flipped || card.matched ? "rotate-y-180" : ""
                          }`}
                        >
                          <CreditCard className="h-8 w-8 text-gold" />
                        </div>
                        <div
                          className={`absolute w-full h-full flex items-center justify-center bg-gold text-black text-3xl backface-hidden rotate-y-180 ${
                            card.flipped || card.matched ? "rotate-y-0" : ""
                          }`}
                        >
                          {card.symbol}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {gameOver && (
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold mb-2">
                    {matchedPairs === difficultySettings[difficulty].pairs ? "You Won!" : "Game Over"}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {matchedPairs === difficultySettings[difficulty].pairs
                      ? `You found all pairs in ${moves} moves and ${formatTime(gameTime)}!`
                      : `You found ${matchedPairs} out of ${difficultySettings[difficulty].pairs} pairs.`}
                  </p>
                  <Button
                    className="gold-button"
                    onClick={() => {
                      setGameOver(false)
                      setCards([])
                    }}
                  >
                    Play Again
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <Card className="border-gold bg-black">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold mb-4">Game Stats</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Balance</span>
                <span className="font-bold text-gold">{balance} GOLD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Games Played</span>
                <span className="font-bold">{gameHistory.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Win Rate</span>
                <span className="font-bold text-green-500">
                  {gameHistory.length > 0
                    ? `${Math.round((gameHistory.filter((g) => g.won).length / gameHistory.length) * 100)}%`
                    : "0%"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Best Time</span>
                <span className="font-bold text-gold">
                  {gameHistory.filter((g) => g.won).length > 0
                    ? formatTime(Math.min(...gameHistory.filter((g) => g.won).map((g) => g.time)))
                    : "-"}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-4">Game History</h3>
            {gameHistory.length > 0 ? (
              <div className="space-y-3">
                {gameHistory.map((game, index) => (
                  <div key={index} className="flex justify-between items-center p-2 border border-gold/20 rounded-lg">
                    <div>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${game.won ? "bg-green-500" : "bg-red-500"} mr-2`}></div>
                        <span className="font-medium">{game.pairs} pairs</span>
                        <span className="text-xs text-gray-400 ml-2">({game.moves} moves)</span>
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
              <div className="text-center py-4 text-gray-400">No games played yet</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-gold bg-black mt-4">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold mb-4">How to Play</h3>
            <div className="space-y-3 text-sm">
              <p>1. Select difficulty and place your bet</p>
              <p>2. Click cards to flip them and find matching pairs</p>
              <p>3. Match all pairs before time runs out to win</p>
              <p>4. The faster you match with fewer moves, the higher your reward</p>
              <p className="text-gold">Tip: Try to remember card positions to make fewer moves!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
