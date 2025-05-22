"use client"

import { useState, useEffect, Suspense } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Connection, PublicKey, Transaction } from "@solana/web3.js"
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stars, PerspectiveCamera } from "@react-three/drei"
import { Physics, useBox, usePlane, useSphere } from "@react-three/cannon"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNetworkConfig } from "@/hooks/use-network-config"

// GOLD token mint address
const GOLD_TOKEN_MINT = new PublicKey("APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump")
// Faucet authority (this would be a PDA in a real implementation)
const FAUCET_AUTHORITY = new PublicKey("GStKMmGZ5fJJLBD7Z6YZXGXKjMU14xLnQvzHVtF1pH9m")

// Game components
function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#111" />
    </mesh>
  )
}

function Coin({ position, onCollect }) {
  const [ref, api] = useSphere(() => ({
    mass: 0,
    position,
    args: [0.5],
    isTrigger: true,
    onCollide: onCollect,
  }))

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
    </mesh>
  )
}

function Player({ position, controls }) {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position,
    args: [1, 1, 1],
  }))

  useEffect(() => {
    const handleKeyDown = (e) => {
      const speed = 5
      switch (e.key) {
        case "ArrowUp":
        case "w":
          api.velocity.set(0, 0, -speed)
          break
        case "ArrowDown":
        case "s":
          api.velocity.set(0, 0, speed)
          break
        case "ArrowLeft":
        case "a":
          api.velocity.set(-speed, 0, 0)
          break
        case "ArrowRight":
        case "d":
          api.velocity.set(speed, 0, 0)
          break
        case " ":
          api.velocity.set(0, 10, 0)
          break
      }
    }

    const handleKeyUp = (e) => {
      switch (e.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "w":
        case "s":
          api.velocity.set(0, 0, 0)
          break
        case "ArrowLeft":
        case "ArrowRight":
        case "a":
        case "d":
          api.velocity.set(0, 0, 0)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [api])

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ff0000" />
    </mesh>
  )
}

function GameScene({ onCollectCoin, onLevelComplete }) {
  const [coins, setCoins] = useState([
    [5, 1, 5],
    [-5, 1, -5],
    [10, 1, 0],
    [-10, 1, 0],
    [0, 1, 10],
    [0, 1, -10],
    [8, 1, 8],
    [-8, 1, -8],
    [8, 1, -8],
    [-8, 1, 8],
  ])

  const handleCollectCoin = (e) => {
    const position = e.body.position
    setCoins(
      coins.filter((coin, i) => {
        const [x, y, z] = coin
        const distance = Math.sqrt(
          Math.pow(position.x - x, 2) + Math.pow(position.y - y, 2) + Math.pow(position.z - z, 2),
        )
        return distance > 1
      }),
    )

    onCollectCoin()

    if (coins.length === 1) {
      onLevelComplete()
    }
  }

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <Physics>
        <Plane />
        <Player position={[0, 2, 0]} />
        {coins.map((position, i) => (
          <Coin key={i} position={position} onCollect={handleCollectCoin} />
        ))}
      </Physics>
      <Stars />
    </>
  )
}

export default function GamesPage() {
  const { publicKey, signTransaction, connected } = useWallet()
  const { toast } = useToast()
  const { endpoint, network } = useNetworkConfig()

  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [connection, setConnection] = useState<Connection | null>(null)
  const [isRewarding, setIsRewarding] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [goldBalance, setGoldBalance] = useState(0)

  // Initialize connection
  useEffect(() => {
    if (!connected || !publicKey) return

    const initConnection = async () => {
      try {
        setIsLoading(true)
        const conn = new Connection(endpoint, "confirmed")
        setConnection(conn)

        // Fetch GOLD balance
        await fetchGoldBalance(conn, publicKey)

        setIsLoading(false)
      } catch (error) {
        console.error("Error initializing:", error)
        toast({
          title: "Connection Error",
          description: "Failed to connect to the Solana network",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    initConnection()
  }, [connected, publicKey, endpoint])

  // Fetch GOLD token balance
  const fetchGoldBalance = async (conn: Connection, walletPubkey: PublicKey) => {
    try {
      // Get associated token account
      const tokenAccount = await getAssociatedTokenAddress(GOLD_TOKEN_MINT, walletPubkey)

      try {
        // Fetch token account info
        const tokenAccountInfo = await conn.getAccountInfo(tokenAccount)

        if (tokenAccountInfo) {
          // Parse token account data
          const data = Buffer.from(tokenAccountInfo.data)
          // Amount is at offset 64, 8 bytes
          const amountRaw = data.readBigUint64LE(64)
          const amount = Number(amountRaw) / 1e9 // Convert from lamports to GOLD
          setGoldBalance(amount)
        } else {
          setGoldBalance(0)
        }
      } catch (error) {
        console.error("Error fetching token account:", error)
        setGoldBalance(0)
      }
    } catch (error) {
      console.error("Error fetching GOLD balance:", error)
      setGoldBalance(0)
    }
  }

  // Handle coin collection
  const handleCollectCoin = () => {
    setScore(score + 1)
  }

  // Handle level complete
  const handleLevelComplete = () => {
    setGameCompleted(true)
    setIsPlaying(false)
  }

  // Handle start game
  const handleStartGame = () => {
    setScore(0)
    setGameCompleted(false)
    setIsPlaying(true)
  }

  // Handle claim reward
  const handleClaimReward = async () => {
    if (!connected || !publicKey || !signTransaction || !connection) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to claim rewards",
        variant: "destructive",
      })
      return
    }

    try {
      setIsRewarding(true)

      // Get associated token account
      const tokenAccount = await getAssociatedTokenAddress(GOLD_TOKEN_MINT, publicKey)

      // Create transaction
      const transaction = new Transaction()

      // Check if token account exists
      const tokenAccountInfo = await connection.getAccountInfo(tokenAccount)

      if (!tokenAccountInfo) {
        // Create associated token account
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey, // payer
            tokenAccount, // associated token account
            publicKey, // owner
            GOLD_TOKEN_MINT, // mint
          ),
        )
      }

      // Amount to mint: 5 GOLD
      const amount = BigInt(5_000_000_000) // 5 GOLD = 5 * 10^9 (9 decimals)

      // In a real implementation, this would be a program instruction to the game reward program
      // For demo purposes, we're simulating the mint instruction
      // This would fail in a real environment without the proper authority
      transaction.add(
        createMintToInstruction(
          GOLD_TOKEN_MINT, // mint
          tokenAccount, // destination
          FAUCET_AUTHORITY, // authority
          amount, // amount
        ),
      )

      // Set recent blockhash
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      transaction.feePayer = publicKey

      // Sign and send transaction
      const signedTransaction = await signTransaction(transaction)

      // In a real implementation, this would be sent to a backend API
      // that would sign with the game reward authority and execute the transaction
      // For demo purposes, we're simulating a successful transaction

      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update balance (simulated)
      setGoldBalance((prev) => prev + 5)

      toast({
        title: "Reward Claimed",
        description: "Successfully claimed 5 GOLD tokens",
      })

      // Reset game state
      setGameCompleted(false)
    } catch (error) {
      console.error("Error claiming reward:", error)
      toast({
        title: "Claim Failed",
        description: "Failed to claim GOLD tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRewarding(false)
    }
  }

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto bg-black/50 border border-yellow-500/30 text-white">
          <CardHeader>
            <CardTitle className="text-center text-yellow-500">Wallet Connection Required</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Please connect your wallet to play games and earn GOLD tokens
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <WalletMultiButton />
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
          Goldium Games
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Card className="bg-black/50 border border-yellow-500/30 text-white h-full">
              <div className="aspect-[16/9] w-full relative">
                {isPlaying ? (
                  <Canvas shadows>
                    <Suspense fallback={null}>
                      <PerspectiveCamera makeDefault position={[0, 10, 20]} />
                      <GameScene onCollectCoin={handleCollectCoin} onLevelComplete={handleLevelComplete} />
                      <OrbitControls />
                    </Suspense>
                  </Canvas>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                    {gameCompleted ? (
                      <>
                        <h2 className="text-3xl font-bold text-yellow-500 mb-4">Level Complete!</h2>
                        <p className="text-xl mb-6">You collected {score} coins</p>
                        <Button
                          onClick={handleClaimReward}
                          disabled={isRewarding}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black"
                        >
                          {isRewarding ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Claiming Reward...
                            </>
                          ) : (
                            "Claim 5 GOLD Reward"
                          )}
                        </Button>
                      </>
                    ) : (
                      <>
                        <h2 className="text-3xl font-bold text-yellow-500 mb-4">Coin Collector</h2>
                        <p className="text-xl mb-6">Collect all coins to earn GOLD tokens</p>
                        <Button onClick={handleStartGame} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                          Start Game
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
              {isPlaying && (
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Score</p>
                      <p className="text-2xl font-bold">{score}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-yellow-500/50 text-yellow-500"
                      onClick={() => setIsPlaying(false)}
                    >
                      Exit Game
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          <div>
            <Card className="bg-black/50 border border-yellow-500/30 text-white mb-6">
              <CardHeader>
                <CardTitle className="text-yellow-500">Game Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">How to Play</p>
                  <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mt-2">
                    <li>Use WASD or arrow keys to move</li>
                    <li>Press Space to jump</li>
                    <li>Collect all coins to complete the level</li>
                    <li>Complete the level to earn GOLD tokens</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Rewards</p>
                  <p className="text-sm text-gray-300 mt-2">
                    Earn 5 GOLD tokens for each completed level. Rewards can be claimed immediately after level
                    completion.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/50 border border-yellow-500/30 text-white">
              <CardHeader>
                <CardTitle className="text-yellow-500">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">GOLD Balance</p>
                  <p className="text-2xl font-bold">{goldBalance.toFixed(2)} GOLD</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Network</p>
                  <p className="text-lg">{network === "mainnet" ? "Mainnet" : "Devnet"}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="bg-black/50 border border-yellow-500/30 text-white">
          <CardHeader>
            <CardTitle className="text-yellow-500">About Goldium Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Play-to-Earn</h3>
                <p className="text-gray-300">
                  Goldium Games follow the play-to-earn model, allowing players to earn GOLD tokens by completing
                  levels, winning competitions, and achieving in-game milestones. These tokens can be used within the
                  Goldium ecosystem or traded on supported exchanges.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Game Assets</h3>
                <p className="text-gray-300">
                  In-game items, characters, and other assets are represented as NFTs, giving players true ownership of
                  their virtual possessions. These assets can be bought, sold, and traded on the Goldium NFT
                  marketplace.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Upcoming Games</h3>
                <p className="text-gray-300">
                  We're constantly developing new games for the Goldium platform. Stay tuned for upcoming releases,
                  including RPGs, strategy games, and multiplayer experiences, all integrated with the GOLD token
                  economy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
