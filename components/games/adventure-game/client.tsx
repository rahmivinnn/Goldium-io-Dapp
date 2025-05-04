"use client"

import { useState, useEffect } from "react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Coins, Trophy, Users, Info, ArrowRight, Heart, Star, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { GameProvider, useGameContext, type CharacterType } from "./game-context"
import CharacterSelection from "./character-selection"
import FantasyGameScene from "./fantasy-game-scene"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"

export default function AdventureGameClient() {
  const { connected, connecting, goldBalance, walletAddress, openWalletModal } = useSolanaWallet()
  const [gameState, setGameState] = useState<"intro" | "character" | "loading" | "playing" | "gameOver" | "rewards">(
    "intro",
  )
  const [stakeAmount, setStakeAmount] = useState(10)
  const [isStaking, setIsStaking] = useState(false)
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)
  const [score, setScore] = useState(0)
  const [goldCollected, setGoldCollected] = useState(0)
  const [health, setHealth] = useState(100)
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType>("cat")
  const [showCutscene, setShowCutscene] = useState(false)
  const [cutsceneText, setCutsceneText] = useState("")
  const [gameRewards, setGameRewards] = useState<{ gold: number; nfts: string[] }>({ gold: 0, nfts: [] })
  const [transactionPending, setTransactionPending] = useState(false)
  const [transactionHash, setTransactionHash] = useState("")

  // Prevent hydration errors by only rendering client-side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Handle stake and play
  const handleStakeAndPlay = async () => {
    if (!connected || !walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to play the game.",
        variant: "destructive",
      })
      return
    }

    if (goldBalance < stakeAmount) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least ${stakeAmount} GOLD tokens to play.`,
        variant: "destructive",
      })
      return
    }

    setIsStaking(true)
    setTransactionPending(true)

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a fake transaction hash
      const fakeHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
      setTransactionHash(fakeHash)

      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Tokens Staked",
        description: `Successfully staked ${stakeAmount} GOLD tokens.`,
      })

      // Go to character selection
      setGameState("character")
    } catch (error) {
      console.error("Staking error:", error)
      toast({
        title: "Staking Failed",
        description: "Failed to stake tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsStaking(false)
      setTransactionPending(false)
    }
  }

  // Handle character selection
  const handleCharacterSelect = (character: CharacterType) => {
    setSelectedCharacter(character)
    setGameState("loading")

    // Show intro cutscene
    setShowCutscene(true)
    setCutsceneText(
      "Welcome to the Floating Islands of Goldium. Your quest to collect the ancient GOLD tokens begins now. Legend says that whoever collects all the tokens will gain immense power...",
    )

    // Simulate loading assets
    setTimeout(() => {
      setShowCutscene(false)
      setGameState("playing")
    }, 5000)
  }

  // Handle game over and rewards
  const handleGameOver = (finalScore: number, finalGold: number) => {
    setScore(finalScore)
    setGoldCollected(finalGold)

    // Calculate rewards based on performance
    const goldReward = Math.floor(finalGold * 1.5) + Math.floor(finalScore / 100)

    // 10% chance to get NFT for every 1000 points
    const nftChance = Math.min(0.5, (finalScore / 1000) * 0.1)
    const gotNft = Math.random() < nftChance

    const nfts = gotNft ? ["Goldium Adventure Trophy"] : []

    setGameRewards({ gold: goldReward, nfts })
    setGameState("gameOver")
  }

  // Handle claiming rewards
  const handleClaimRewards = async () => {
    if (!connected || !walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to claim rewards.",
        variant: "destructive",
      })
      return
    }

    setTransactionPending(true)

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a fake transaction hash
      const fakeHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
      setTransactionHash(fakeHash)

      toast({
        title: "Rewards Claimed",
        description: `Successfully claimed ${gameRewards.gold} GOLD tokens${gameRewards.nfts.length > 0 ? " and NFT rewards" : ""}.`,
      })

      // Show confetti for successful claim
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      // Go to rewards screen
      setGameState("rewards")
    } catch (error) {
      console.error("Claiming error:", error)
      toast({
        title: "Claiming Failed",
        description: "Failed to claim rewards. Please try again.",
        variant: "destructive",
      })
    } finally {
      setTransactionPending(false)
    }
  }

  // If not client-side yet, show loading
  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    )
  }

  // If wallet is not connected, show connect prompt
  if (!connected) {
    return <WalletConnectPrompt onConnect={openWalletModal} />
  }

  // If in intro state, show game entrance
  if (gameState === "intro") {
    return (
      <GameEntrance
        goldBalance={goldBalance}
        onStake={handleStakeAndPlay}
        stakeAmount={stakeAmount}
        setStakeAmount={setStakeAmount}
        isStaking={isStaking}
        transactionPending={transactionPending}
        transactionHash={transactionHash}
      />
    )
  }

  // If in character selection state
  if (gameState === "character") {
    return <CharacterSelection onSelect={handleCharacterSelect} onBack={() => setGameState("intro")} />
  }

  // If loading, show loading screen
  if (gameState === "loading") {
    return <LoadingScreen showCutscene={showCutscene} cutsceneText={cutsceneText} />
  }

  // If playing, show the game
  if (gameState === "playing") {
    return (
      <GameProvider>
        <AdventureGame
          onExit={() => handleGameOver(score, goldCollected)}
          onScoreChange={setScore}
          onGoldCollect={setGoldCollected}
          onHealthChange={setHealth}
          score={score}
          goldCollected={goldCollected}
          health={health}
          character={selectedCharacter}
        />
      </GameProvider>
    )
  }

  // If game over, show results
  if (gameState === "gameOver") {
    return (
      <GameResults
        onPlayAgain={() => setGameState("intro")}
        onClaimRewards={handleClaimRewards}
        stakedAmount={stakeAmount}
        score={score}
        goldCollected={goldCollected}
        rewards={gameRewards}
        transactionPending={transactionPending}
        transactionHash={transactionHash}
      />
    )
  }

  // If rewards claimed, show rewards screen
  if (gameState === "rewards") {
    return (
      <RewardsScreen onContinue={() => setGameState("intro")} rewards={gameRewards} transactionHash={transactionHash} />
    )
  }

  // Fallback
  return <div>Loading...</div>
}

// Component for wallet connect prompt
function WalletConnectPrompt({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="relative h-screen flex flex-col justify-center items-center">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800">
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                opacity: Math.random() * 0.5 + 0.3,
                animation: `twinkle ${Math.random() * 5 + 3}s infinite ${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="z-10 w-full max-w-md px-4">
        <Card className="border-gold bg-black/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-gold text-center text-2xl">Goldium Fantasy Adventure</CardTitle>
            <CardDescription className="text-center">Connect your wallet to start your adventure</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="w-32 h-32 relative mb-4">
              <img src="/gold-logo.png" alt="Goldium" className="w-full h-full object-contain animate-float" />
              <div className="absolute inset-0 rounded-full animate-pulse bg-gold/20 filter blur-xl"></div>
            </div>
            <p className="text-gray-300 text-center">
              You need to connect your wallet to play this game and stake GOLD tokens.
            </p>
            <Button
              onClick={onConnect}
              className="bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-black font-bold"
            >
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Component for game entrance
function GameEntrance({
  goldBalance,
  onStake,
  stakeAmount,
  setStakeAmount,
  isStaking,
  transactionPending,
  transactionHash,
}: {
  goldBalance: number
  onStake: () => void
  stakeAmount: number
  setStakeAmount: (amount: number) => void
  isStaking: boolean
  transactionPending: boolean
  transactionHash: string
}) {
  return (
    <div className="relative h-screen flex flex-col justify-center items-center">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800">
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                opacity: Math.random() * 0.5 + 0.3,
                animation: `twinkle ${Math.random() * 5 + 3}s infinite ${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="z-10 w-full max-w-md px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-gold bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 text-center text-2xl">
                Goldium Fantasy Adventure
              </CardTitle>
              <CardDescription className="text-center text-gray-300">
                Stake GOLD tokens to start your adventure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="w-32 h-32 mx-auto relative mb-4">
                  <img src="/gold-logo.png" alt="Goldium" className="w-full h-full object-contain animate-float" />
                  <div className="absolute inset-0 rounded-full animate-pulse bg-gold/20 filter blur-xl"></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Your GOLD Balance:</span>
                  <span className="font-medium text-gold">{goldBalance.toLocaleString()} GOLD</span>
                </div>

                <div className="space-y-2">
                  <label htmlFor="stake-amount" className="text-sm text-gray-400">
                    Stake Amount:
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      id="stake-amount"
                      min="10"
                      max="100"
                      step="10"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="w-16 text-center font-medium text-gold">{stakeAmount} GOLD</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center text-sm text-gray-300 mb-3">
                    <Info className="h-4 w-4 mr-2 text-gold" />
                    <span>Potential Rewards</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                      <Coins className="h-4 w-4 mr-2 text-gold" />
                      <span className="text-gray-200">Up to {stakeAmount * 3} GOLD</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2 text-gold" />
                      <span className="text-gray-200">Rare NFT chance</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gold" />
                      <span className="text-gray-200">Leaderboard points</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-2 text-gold" />
                      <span className="text-gray-200">Unique abilities</span>
                    </div>
                  </div>
                </div>

                {transactionPending && (
                  <div className="bg-black/50 p-3 rounded-lg border border-gold/30 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2 text-gold" />
                    <span className="text-sm text-gold">Processing transaction...</span>
                  </div>
                )}

                {transactionHash && !transactionPending && (
                  <div className="bg-black/50 p-3 rounded-lg border border-gold/30">
                    <p className="text-xs text-gray-400 mb-1">Transaction Hash:</p>
                    <p className="text-xs text-gold break-all">{transactionHash}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-black font-bold py-6"
                onClick={onStake}
                disabled={isStaking || goldBalance < stakeAmount || transactionPending}
              >
                {isStaking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Staking...
                  </>
                ) : (
                  <>
                    Start Adventure <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

// Loading Screen with Cutscene
function LoadingScreen({ showCutscene, cutsceneText }: { showCutscene: boolean; cutsceneText: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <AnimatePresence>
        {showCutscene ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl text-center px-4"
          >
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500">
              The Legend of Goldium
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-xl text-gray-200 leading-relaxed"
            >
              {cutsceneText}
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <div className="w-64 h-64 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/gold-logo.png" alt="Goldium" className="w-32 h-32 animate-pulse" />
              </div>
              <div className="absolute inset-0 border-t-4 border-gold rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold mt-8 text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500">
              Loading Adventure...
            </h2>
            <p className="text-gray-400 mt-2">Preparing your journey to the Floating Islands</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 3D Adventure Game
function AdventureGame({
  onExit,
  onScoreChange,
  onGoldCollect,
  onHealthChange,
  score,
  goldCollected,
  health,
  character,
}: {
  onExit: () => void
  onScoreChange: (score: number) => void
  onGoldCollect: (gold: number) => void
  onHealthChange: (health: number) => void
  score: number
  goldCollected: number
  health: number
  character: CharacterType
}) {
  const [isMobile, setIsMobile] = useState(false)
  const { setCharacter, characterStats, activeEffects, level, experience } = useGameContext()
  const [showControls, setShowControls] = useState(false)

  // Set character in context
  useEffect(() => {
    setCharacter(character)
  }, [character, setCharacter])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Helper function to dispatch game events
  const dispatchGameEvent = (type: string, value: number) => {
    if (type === "score") {
      onScoreChange((prev) => prev + value)
    } else if (type === "gold") {
      onGoldCollect((prev) => prev + value)
    } else if (type === "health") {
      onHealthChange((prev) => Math.max(0, prev + value))
    }
  }

  return (
    <div className="h-screen w-full relative">
      {/* Game Canvas */}
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-black">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        }
      >
        <Canvas shadows className="w-full h-full">
          <FantasyGameScene isMobile={isMobile} dispatchGameEvent={dispatchGameEvent} />
        </Canvas>
      </Suspense>

      {/* HUD Overlay */}
      <div className="absolute top-0 left-0 w-full p-4 pointer-events-none">
        <div className="flex justify-between items-start max-w-7xl mx-auto">
          {/* Player Stats */}
          <div className="bg-black/50 backdrop-blur-md p-3 rounded-lg border border-gold/30 pointer-events-auto">
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-xs text-gray-300 flex items-center">
                  <Heart className="h-3 w-3 mr-1 text-red-400" /> HEALTH
                </p>
                <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-600 to-red-400" style={{ width: `${health}%` }} />
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-300 flex items-center">
                  <Star className="h-3 w-3 mr-1 text-amber-400" /> SCORE
                </p>
                <p className="text-xl font-bold text-white">{score}</p>
              </div>

              <div>
                <p className="text-xs text-gray-300 flex items-center">
                  <Coins className="h-3 w-3 mr-1 text-gold" /> GOLD
                </p>
                <p className="text-xl font-bold text-gold">{goldCollected}</p>
              </div>

              <div>
                <p className="text-xs text-gray-300 flex items-center">
                  <Zap className="h-3 w-3 mr-1 text-blue-400" /> LEVEL
                </p>
                <p className="text-xl font-bold text-blue-400">{level}</p>
              </div>
            </div>

            {/* Active Effects */}
            {activeEffects.length > 0 && (
              <div className="mt-2 flex space-x-2">
                <p className="text-xs text-gray-300">Active:</p>
                <div className="flex space-x-1">
                  {activeEffects.map((effect, index) => (
                    <span
                      key={index}
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        effect === "speed"
                          ? "bg-cyan-500/70"
                          : effect === "jump"
                            ? "bg-green-500/70"
                            : effect === "attack"
                              ? "bg-red-500/70"
                              : effect === "defense"
                                ? "bg-yellow-500/70"
                                : "bg-pink-500/70"
                      }`}
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Controls Button */}
          <div className="pointer-events-auto">
            <Button
              variant="outline"
              className="bg-black/50 border-gold/30 text-white hover:bg-black/70"
              onClick={() => setShowControls(!showControls)}
            >
              Controls
            </Button>
          </div>
        </div>
      </div>

      {/* Controls Modal */}
      {showControls && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-black/90 border border-gold/30 rounded-lg p-6 max-w-md">
            <h3 className="text-xl font-bold text-gold mb-4">Game Controls</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Move</span>
                <span className="text-white">W, A, S, D or Arrow Keys</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Jump</span>
                <span className="text-white">Space</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Attack</span>
                <span className="text-white">E or Left Mouse</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Special Ability</span>
                <span className="text-white">Q or F</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button className="bg-gold hover:bg-gold/80 text-black" onClick={() => setShowControls(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Controls */}
      {isMobile && (
        <div className="absolute bottom-20 left-0 w-full flex justify-center items-center">
          <div className="relative w-40 h-40">
            {/* Up button */}
            <button
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full border border-gold/30 flex items-center justify-center"
              onTouchStart={() => window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowUp" }))}
              onTouchEnd={() => window.dispatchEvent(new KeyboardEvent("keyup", { code: "ArrowUp" }))}
            >
              <span className="text-white">↑</span>
            </button>

            {/* Down button */}
            <button
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full border border-gold/30 flex items-center justify-center"
              onTouchStart={() => window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowDown" }))}
              onTouchEnd={() => window.dispatchEvent(new KeyboardEvent("keyup", { code: "ArrowDown" }))}
            >
              <span className="text-white">↓</span>
            </button>

            {/* Left button */}
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full border border-gold/30 flex items-center justify-center"
              onTouchStart={() => window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowLeft" }))}
              onTouchEnd={() => window.dispatchEvent(new KeyboardEvent("keyup", { code: "ArrowLeft" }))}
            >
              <span className="text-white">←</span>
            </button>

            {/* Right button */}
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full border border-gold/30 flex items-center justify-center"
              onTouchStart={() => window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowRight" }))}
              onTouchEnd={() => window.dispatchEvent(new KeyboardEvent("keyup", { code: "ArrowRight" }))}
            >
              <span className="text-white">→</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="absolute bottom-4 right-4 flex space-x-4">
            <button
              className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full border border-gold/30 flex items-center justify-center"
              onTouchStart={() => window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }))}
              onTouchEnd={() => window.dispatchEvent(new KeyboardEvent("keyup", { code: "Space" }))}
            >
              <span className="text-white">JUMP</span>
            </button>
            <button
              className="w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full border border-red-500/30 flex items-center justify-center"
              onTouchStart={() => window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyE" }))}
              onTouchEnd={() => window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyE" }))}
            >
              <span className="text-white">ATTACK</span>
            </button>
          </div>
        </div>
      )}

      {/* Exit Button */}
      <button
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        onClick={onExit}
      >
        Exit Game
      </button>
    </div>
  )
}

// Game results screen
function GameResults({
  onPlayAgain,
  onClaimRewards,
  stakedAmount,
  score,
  goldCollected,
  rewards,
  transactionPending,
  transactionHash,
}: {
  onPlayAgain: () => void
  onClaimRewards: () => void
  stakedAmount: number
  score: number
  goldCollected: number
  rewards: { gold: number; nfts: string[] }
  transactionPending: boolean
  transactionHash: string
}) {
  return (
    <div className="relative h-screen flex flex-col justify-center items-center">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800">
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                opacity: Math.random() * 0.5 + 0.3,
                animation: `twinkle ${Math.random() * 5 + 3}s infinite ${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="z-10 w-full max-w-md px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-gold bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 text-center text-2xl">
                Adventure Complete!
              </CardTitle>
              <CardDescription className="text-center text-gray-300">
                Congratulations on completing your adventure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gold/10 p-6 rounded-lg text-center border border-gold/30">
                  <h3 className="text-lg font-semibold mb-2 text-gold">Rewards Earned</h3>
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500">
                    {rewards.gold} GOLD
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Claim your rewards to your wallet</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg text-center border border-white/10">
                    <div className="text-sm text-gray-400">Final Score</div>
                    <div className="text-2xl font-bold text-white">{score}</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg text-center border border-white/10">
                    <div className="text-sm text-gray-400">Gold Collected</div>
                    <div className="text-2xl font-bold text-gold">{goldCollected}</div>
                  </div>
                </div>

                {/* NFT Reward (if available) */}
                {rewards.nfts.length > 0 && (
                  <div className="bg-white/5 p-4 rounded-lg text-center border border-white/10">
                    <div className="text-sm text-gray-400 mb-2">NFT Reward Unlocked!</div>
                    <div className="w-32 h-32 mx-auto relative">
                      <img
                        src="/nft-images/dragon-egg.png"
                        alt="Dragon Egg NFT"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 rounded-full animate-pulse bg-purple-500/20 filter blur-xl"></div>
                    </div>
                    <div className="text-lg font-bold text-purple-400 mt-2">{rewards.nfts[0]}</div>
                  </div>
                )}

                {transactionPending && (
                  <div className="bg-black/50 p-3 rounded-lg border border-gold/30 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2 text-gold" />
                    <span className="text-sm text-gold">Processing transaction...</span>
                  </div>
                )}

                {transactionHash && !transactionPending && (
                  <div className="bg-black/50 p-3 rounded-lg border border-gold/30">
                    <p className="text-xs text-gray-400 mb-1">Transaction Hash:</p>
                    <p className="text-xs text-gold break-all">{transactionHash}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-black font-bold py-6"
                onClick={onClaimRewards}
                disabled={transactionPending}
              >
                {transactionPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Claim Rewards"
                )}
              </Button>

              <Button variant="outline" className="w-full border-gold/30 text-gold hover:bg-">
                Play Again
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

// Rewards screen
function RewardsScreen({
  onContinue,
  rewards,
  transactionHash,
}: { onContinue: () => void; rewards: { gold: number; nfts: string[] }; transactionHash: string }) {
  return (
    <div className="relative h-screen flex flex-col justify-center items-center">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800">
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                opacity: Math.random() * 0.5 + 0.3,
                animation: `twinkle ${Math.random() * 5 + 3}s infinite ${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="z-10 w-full max-w-md px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-gold bg-black/40 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500 text-center text-2xl">
                Rewards Claimed!
              </CardTitle>
              <CardDescription className="text-center text-gray-300">
                Congratulations on claiming your rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gold/10 p-6 rounded-lg text-center border border-gold/30">
                  <h3 className="text-lg font-semibold mb-2 text-gold">You Received</h3>
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500">
                    {rewards.gold} GOLD
                  </div>
                </div>

                {/* NFT Reward (if available) */}
                {rewards.nfts.length > 0 && (
                  <div className="bg-white/5 p-4 rounded-lg text-center border border-white/10">
                    <div className="text-sm text-gray-400 mb-2">NFT Reward:</div>
                    <div className="w-32 h-32 mx-auto relative">
                      <img
                        src="/nft-images/dragon-egg.png"
                        alt="Dragon Egg NFT"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 rounded-full animate-pulse bg-purple-500/20 filter blur-xl"></div>
                    </div>
                    <div className="text-lg font-bold text-purple-400 mt-2">{rewards.nfts[0]}</div>
                  </div>
                )}

                {transactionHash && (
                  <div className="bg-black/50 p-3 rounded-lg border border-gold/30">
                    <p className="text-xs text-gray-400 mb-1">Transaction Hash:</p>
                    <p className="text-xs text-gold break-all">{transactionHash}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-black font-bold py-6"
                onClick={onContinue}
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
