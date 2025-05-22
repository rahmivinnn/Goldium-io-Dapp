"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Connection, PublicKey, Transaction } from "@solana/web3.js"
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
} from "@solana/spl-token"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNetworkConfig } from "@/hooks/use-network-config"

// GOLD token mint address
const GOLD_TOKEN_MINT = new PublicKey("APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump")
// Faucet authority (this would be a PDA in a real implementation)
const FAUCET_AUTHORITY = new PublicKey("GStKMmGZ5fJJLBD7Z6YZXGXKjMU14xLnQvzHVtF1pH9m")
// Cooldown period in milliseconds (5 minutes)
const COOLDOWN_PERIOD = 5 * 60 * 1000

export default function FaucetPage() {
  const { publicKey, signTransaction, connected } = useWallet()
  const { toast } = useToast()
  const { endpoint, network } = useNetworkConfig()

  const [isClaiming, setIsClaiming] = useState(false)
  const [goldBalance, setGoldBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [connection, setConnection] = useState<Connection | null>(null)
  const [lastClaimTime, setLastClaimTime] = useState<number | null>(null)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const [cooldownProgress, setCooldownProgress] = useState(100)

  // Initialize connection and fetch data
  useEffect(() => {
    if (!connected || !publicKey) return

    const initConnection = async () => {
      try {
        setIsLoading(true)
        const conn = new Connection(endpoint, "confirmed")
        setConnection(conn)

        // Fetch GOLD balance
        await fetchGoldBalance(conn, publicKey)

        // Load last claim time from localStorage
        loadLastClaimTime()

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

  // Update cooldown timer
  useEffect(() => {
    if (!lastClaimTime) return

    const updateCooldown = () => {
      const now = Date.now()
      const elapsed = now - lastClaimTime
      const remaining = Math.max(0, COOLDOWN_PERIOD - elapsed)
      setCooldownRemaining(remaining)
      setCooldownProgress((remaining / COOLDOWN_PERIOD) * 100)
    }

    updateCooldown()
    const interval = setInterval(updateCooldown, 1000)

    return () => clearInterval(interval)
  }, [lastClaimTime])

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

  // Load last claim time from localStorage
  const loadLastClaimTime = () => {
    try {
      if (!publicKey) return

      const key = `goldium_faucet_last_claim_${publicKey.toString()}`
      const storedTime = localStorage.getItem(key)

      if (storedTime) {
        setLastClaimTime(Number.parseInt(storedTime))
      }
    } catch (error) {
      console.error("Error loading last claim time:", error)
    }
  }

  // Save last claim time to localStorage
  const saveLastClaimTime = () => {
    try {
      if (!publicKey) return

      const now = Date.now()
      const key = `goldium_faucet_last_claim_${publicKey.toString()}`

      localStorage.setItem(key, now.toString())
      setLastClaimTime(now)
    } catch (error) {
      console.error("Error saving last claim time:", error)
    }
  }

  // Check if user can claim
  const canClaim = () => {
    if (network !== "testnet") return false
    if (!lastClaimTime) return true

    const now = Date.now()
    const elapsed = now - lastClaimTime

    return elapsed >= COOLDOWN_PERIOD
  }

  // Format time remaining
  const formatTimeRemaining = () => {
    const minutes = Math.floor(cooldownRemaining / 60000)
    const seconds = Math.floor((cooldownRemaining % 60000) / 1000)

    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Handle claim
  const handleClaim = async () => {
    if (!connected || !publicKey || !signTransaction || !connection) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to claim GOLD tokens",
        variant: "destructive",
      })
      return
    }

    if (network !== "testnet") {
      toast({
        title: "Network Error",
        description: "Faucet is only available on Testnet",
        variant: "destructive",
      })
      return
    }

    if (!canClaim()) {
      toast({
        title: "Cooldown Active",
        description: `Please wait ${formatTimeRemaining()} before claiming again`,
        variant: "destructive",
      })
      return
    }

    try {
      setIsClaiming(true)

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

      // Amount to mint: 1 GOLD
      const amount = BigInt(1_000_000_000) // 1 GOLD = 10^9 (9 decimals)

      // In a real implementation, this would be a program instruction to the faucet program
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
      // that would sign with the faucet authority and execute the transaction
      // For demo purposes, we're simulating a successful transaction

      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update balance (simulated)
      setGoldBalance((prev) => prev + 1)

      // Save last claim time
      saveLastClaimTime()

      toast({
        title: "Claim Successful",
        description: "Successfully claimed 1 GOLD token",
      })
    } catch (error) {
      console.error("Error claiming tokens:", error)
      toast({
        title: "Claim Failed",
        description: "Failed to claim GOLD tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsClaiming(false)
    }
  }

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto bg-black/50 border border-yellow-500/30 text-white">
          <CardHeader>
            <CardTitle className="text-center text-yellow-500">Wallet Connection Required</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Please connect your wallet to use the GOLD token faucet
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
          GOLD Token Faucet
        </h1>

        {network !== "testnet" && (
          <div className="mb-8 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-500">Network Warning</h3>
              <p className="text-gray-300">
                The faucet is only available on Testnet. Please switch to Testnet to claim GOLD tokens.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-black/50 border border-yellow-500/30 text-white">
            <CardHeader>
              <CardTitle className="text-yellow-500">Claim GOLD Tokens</CardTitle>
              <CardDescription className="text-gray-300">Get free GOLD tokens on Testnet for testing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-400">Your GOLD Balance</p>
                    <p className="text-2xl font-bold">{goldBalance.toFixed(2)} GOLD</p>
                  </div>

                  {lastClaimTime && !canClaim() && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Cooldown</span>
                        <span>{formatTimeRemaining()}</span>
                      </div>
                      <Progress
                        value={cooldownProgress}
                        className="h-2 bg-gray-700"
                        indicatorClassName="bg-yellow-500"
                      />
                    </div>
                  )}

                  <div className="bg-black/30 rounded-lg p-4 border border-yellow-500/20">
                    <p className="text-sm text-gray-300">
                      You can claim 1 GOLD token every 5 minutes on Testnet for testing purposes.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleClaim}
                disabled={isLoading || network !== "testnet" || !canClaim() || isClaiming}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {isClaiming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Claiming...
                  </>
                ) : (
                  "Claim 1 GOLD"
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-black/50 border border-yellow-500/30 text-white">
            <CardHeader>
              <CardTitle className="text-yellow-500">About GOLD Token</CardTitle>
              <CardDescription className="text-gray-300">Information about the GOLD token</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Token Name</p>
                <p className="text-lg font-medium">Goldium Token (GOLD)</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Token Address</p>
                <p className="text-sm font-mono break-all">APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Decimals</p>
                <p className="text-lg font-medium">9</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Network</p>
                <p className="text-lg font-medium">Solana {network === "mainnet" ? "Mainnet" : "Testnet"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black/50 border border-yellow-500/30 text-white">
          <CardHeader>
            <CardTitle className="text-yellow-500">How to Use GOLD Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Testing on Testnet</h3>
                <p className="text-gray-300">
                  GOLD tokens claimed from this faucet can be used for testing the Goldium.io platform on Testnet. You
                  can stake them, send them to other wallets, or use them in the Goldium games.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Mainnet Tokens</h3>
                <p className="text-gray-300">
                  For real GOLD tokens on Mainnet, you can purchase them from supported exchanges or earn them through
                  various activities on the Goldium.io platform.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Token Utility</h3>
                <p className="text-gray-300">
                  GOLD tokens are used for governance, staking rewards, in-game purchases, and as a medium of exchange
                  within the Goldium ecosystem.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
