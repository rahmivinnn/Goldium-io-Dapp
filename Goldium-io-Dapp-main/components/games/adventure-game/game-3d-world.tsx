"use client"

import { useEffect, useRef, useState } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Coins, Gamepad2, Trophy, Sword, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Game3DWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { wallet, isConnected } = useWallet()
  const [gameStarted, setGameStarted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [playerStats, setPlayerStats] = useState({
    health: 100,
    gold: 0,
    level: 1,
    experience: 0,
    power: 10,
    defense: 5,
  })
  const [gameObjects, setGameObjects] = useState<any[]>([])
  const [enemies, setEnemies] = useState<any[]>([])
  const [rewards, setRewards] = useState<any[]>([])
  const { toast } = useToast()

  // Initialize the 3D game world
  useEffect(() => {
    if (!canvasRef.current || !gameStarted) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 800
    canvas.height = 600

    // Simple game loop for demonstration
    const gameLoop = setInterval(() => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background
      ctx.fillStyle = "#111827"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw player
      ctx.fillStyle = "#FFD700" // Gold color
      ctx.beginPath()
      ctx.arc(400, 300, 20, 0, Math.PI * 2)
      ctx.fill()

      // Draw game objects (simplified for demonstration)
      gameObjects.forEach((obj) => {
        ctx.fillStyle = obj.color
        ctx.beginPath()
        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw enemies
      enemies.forEach((enemy) => {
        ctx.fillStyle = "#FF4444"
        ctx.beginPath()
        ctx.arc(enemy.x, enemy.y, 15, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw rewards
      rewards.forEach((reward) => {
        ctx.fillStyle = "#44FF44"
        ctx.beginPath()
        ctx.arc(reward.x, reward.y, 10, 0, Math.PI * 2)
        ctx.fill()
      })
    }, 1000 / 60) // 60 FPS

    // Generate random game objects
    generateGameWorld()

    return () => {
      clearInterval(gameLoop)
    }
  }, [canvasRef, gameStarted, gameObjects, enemies, rewards])

  // Generate game world with objects, enemies, and rewards
  const generateGameWorld = () => {
    // Generate random game objects
    const newObjects = []
    for (let i = 0; i < 20; i++) {
      newObjects.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        radius: 5 + Math.random() * 10,
        color: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`,
      })
    }
    setGameObjects(newObjects)

    // Generate enemies
    const newEnemies = []
    for (let i = 0; i < 5; i++) {
      newEnemies.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        health: 50,
        power: 5 + Math.floor(Math.random() * 10),
      })
    }
    setEnemies(newEnemies)

    // Generate rewards
    const newRewards = []
    for (let i = 0; i < 10; i++) {
      newRewards.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        value: 5 + Math.floor(Math.random() * 20),
      })
    }
    setRewards(newRewards)
  }

  // Start the game
  const handleStartGame = () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to play the game",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    // Simulate loading game assets
    setTimeout(() => {
      setGameStarted(true)
      setLoading(false)
      toast({
        title: "Game started",
        description: "Welcome to the Goldium 3D Adventure!",
      })
    }, 2000)
  }

  // Collect reward (simulated)
  const collectReward = () => {
    const rewardAmount = 5 + Math.floor(Math.random() * 20)
    setPlayerStats((prev) => ({
      ...prev,
      gold: prev.gold + rewardAmount,
    }))

    toast({
      title: "Reward collected!",
      description: `You earned ${rewardAmount} GOLD tokens!`,
    })
  }

  // Fight enemy (simulated)
  const fightEnemy = () => {
    const damage = Math.floor(Math.random() * playerStats.power)
    const enemyDamage = Math.floor(Math.random() * 10)

    setPlayerStats((prev) => ({
      ...prev,
      health: Math.max(0, prev.health - enemyDamage),
      experience: prev.experience + 10,
    }))

    if (Math.random() > 0.5) {
      const goldReward = Math.floor(Math.random() * 15)
      setPlayerStats((prev) => ({
        ...prev,
        gold: prev.gold + goldReward,
      }))

      toast({
        title: "Victory!",
        description: `You defeated an enemy and earned ${goldReward} GOLD!`,
      })
    } else {
      toast({
        title: "Battle result",
        description: `You took ${enemyDamage} damage but dealt ${damage} damage to the enemy!`,
      })
    }

    // Level up if enough experience
    if (playerStats.experience >= playerStats.level * 100) {
      setPlayerStats((prev) => ({
        ...prev,
        level: prev.level + 1,
        power: prev.power + 2,
        defense: prev.defense + 1,
        health: 100,
        experience: 0,
      }))

      toast({
        title: "Level Up!",
        description: `You reached level ${playerStats.level + 1}! Your stats have increased.`,
      })
    }
  }

  // Claim tokens to wallet (simulated)
  const claimTokens = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to claim tokens",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    // Simulate blockchain transaction
    setTimeout(() => {
      toast({
        title: "Tokens claimed!",
        description: `${playerStats.gold} GOLD tokens have been transferred to your wallet`,
      })

      setPlayerStats((prev) => ({
        ...prev,
        gold: 0,
      }))

      setLoading(false)
    }, 2000)
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-4xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-xl border border-yellow-500/20">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-yellow-400">Goldium 3D Adventure</h2>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30 px-3 py-1">
              <Gamepad2 className="w-4 h-4 mr-1" /> Play-to-Earn
            </Badge>
          </div>

          {!gameStarted ? (
            <div className="flex flex-col items-center justify-center py-12">
              <img
                src="/placeholder.svg?key=1l1j6"
                alt="Game Character"
                className="w-48 h-48 mb-6 rounded-full border-4 border-yellow-500/30 shadow-lg shadow-yellow-500/10"
              />
              <h3 className="text-2xl font-bold text-white mb-4">Ready for an Adventure?</h3>
              <p className="text-gray-300 mb-8 text-center max-w-lg">
                Connect your wallet and embark on an epic journey. Defeat enemies, collect rewards, and earn GOLD tokens
                that can be transferred to your wallet!
              </p>
              <Button
                onClick={handleStartGame}
                disabled={loading}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-6 text-lg rounded-lg transition-all transform hover:scale-105"
              >
                {loading ? "Loading..." : "Start Adventure"}
                {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-2/3">
                <canvas
                  ref={canvasRef}
                  className="w-full h-[500px] bg-gray-900 rounded-lg border border-yellow-500/20 shadow-inner shadow-yellow-500/5"
                />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <Button onClick={collectReward} className="bg-green-600 hover:bg-green-700">
                    <Coins className="w-4 h-4 mr-2" /> Collect Reward
                  </Button>
                  <Button onClick={fightEnemy} className="bg-red-600 hover:bg-red-700">
                    <Sword className="w-4 h-4 mr-2" /> Fight Enemy
                  </Button>
                  <Button
                    onClick={claimTokens}
                    disabled={loading || playerStats.gold === 0}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    <Trophy className="w-4 h-4 mr-2" /> Claim {playerStats.gold} GOLD
                  </Button>
                </div>
              </div>
              <div className="lg:w-1/3">
                <Card className="bg-gray-800 border-yellow-500/20 shadow-lg p-4">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Player Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Level:</span>
                      <span className="text-white font-bold">{playerStats.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Health:</span>
                      <div className="w-32 bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-red-600 h-2.5 rounded-full"
                          style={{ width: `${playerStats.health}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Experience:</span>
                      <div className="w-32 bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${(playerStats.experience / (playerStats.level * 100)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Attack Power:</span>
                      <span className="text-white font-bold">{playerStats.power}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Defense:</span>
                      <span className="text-white font-bold">{playerStats.defense}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">GOLD Earned:</span>
                      <span className="text-yellow-400 font-bold">{playerStats.gold}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <h4 className="text-lg font-bold text-yellow-400 mb-2">Game Controls</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Use WASD or arrow keys to move</li>
                      <li>• Click on enemies to attack</li>
                      <li>• Click on rewards to collect</li>
                      <li>• Press E to interact with objects</li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <h4 className="text-lg font-bold text-yellow-400 mb-2">Web3 Integration</h4>
                    <p className="text-sm text-gray-300 mb-2">
                      All GOLD tokens earned can be claimed to your connected wallet and used across the Goldium
                      ecosystem.
                    </p>
                    <div className="flex items-center text-xs text-gray-400 mt-2">
                      <Shield className="w-3 h-3 mr-1" />
                      Connected as:{" "}
                      {isConnected
                        ? wallet?.address.substring(0, 6) +
                          "..." +
                          wallet?.address.substring(wallet?.address.length - 4)
                        : "Not connected"}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
