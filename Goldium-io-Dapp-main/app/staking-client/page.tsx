"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js"
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNetworkConfig } from "@/hooks/use-network-config"

// Staking program ID
const STAKING_PROGRAM_ID = new PublicKey("GStKMmGZ5fJJLBD7Z6YZXGXKjMU14xLnQvzHVtF1pH9m")
// GOLD token mint address
const GOLD_TOKEN_MINT = new PublicKey("APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump")

export default function StakingClientPage() {
  const { publicKey, signTransaction, connected } = useWallet()
  const { toast } = useToast()
  const { endpoint, network } = useNetworkConfig()

  const [amount, setAmount] = useState("")
  const [isStaking, setIsStaking] = useState(false)
  const [isUnstaking, setIsUnstaking] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [stakedAmount, setStakedAmount] = useState(0)
  const [rewards, setRewards] = useState(0)
  const [stakingPeriod, setStakingPeriod] = useState(0)
  const [goldBalance, setGoldBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [connection, setConnection] = useState<Connection | null>(null)
  const [apr, setApr] = useState(18.5) // 18.5% APR

  // Initialize connection and fetch data
  useEffect(() => {
    if (!connected || !publicKey) return

    const initConnection = async () => {
      try {
        setIsLoading(true)
        const conn = new Connection(endpoint, "confirmed")
        setConnection(conn)

        // Fetch staking data
        await fetchStakingData(conn, publicKey)

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

  // Fetch staking data from the smart contract
  const fetchStakingData = async (conn: Connection, walletPubkey: PublicKey) => {
    try {
      // Get staking account PDA
      const [stakingAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("staking"), walletPubkey.toBuffer()],
        STAKING_PROGRAM_ID,
      )

      // Fetch account info
      const accountInfo = await conn.getAccountInfo(stakingAccount)

      if (accountInfo) {
        // Parse account data
        const dataView = new DataView(accountInfo.data.buffer)
        const stakedAmountRaw = dataView.getBigUint64(8, true) // Offset 8, little endian
        const rewardsRaw = dataView.getBigUint64(16, true) // Offset 16, little endian
        const stakingTimestamp = dataView.getBigUint64(24, true) // Offset 24, little endian

        // Convert to human-readable values
        const stakedAmountValue = Number(stakedAmountRaw) / 1e9 // Convert from lamports to GOLD
        const rewardsValue = Number(rewardsRaw) / 1e9 // Convert from lamports to GOLD

        // Calculate staking period in days
        const now = BigInt(Math.floor(Date.now() / 1000))
        const stakingPeriodSeconds = now - stakingTimestamp
        const stakingPeriodDays = Number(stakingPeriodSeconds) / (60 * 60 * 24)

        setStakedAmount(stakedAmountValue)
        setRewards(rewardsValue)
        setStakingPeriod(Math.floor(stakingPeriodDays))
      } else {
        // No staking account found
        setStakedAmount(0)
        setRewards(0)
        setStakingPeriod(0)
      }
    } catch (error) {
      console.error("Error fetching staking data:", error)
      toast({
        title: "Data Fetch Error",
        description: "Failed to fetch staking data",
        variant: "destructive",
      })
    }
  }

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

  // Handle staking
  const handleStake = async () => {
    if (!connected || !publicKey || !signTransaction || !connection) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to stake GOLD tokens",
        variant: "destructive",
      })
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to stake",
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(amount) > goldBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough GOLD tokens",
        variant: "destructive",
      })
      return
    }

    try {
      setIsStaking(true)

      // Get staking account PDA
      const [stakingAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("staking"), publicKey.toBuffer()],
        STAKING_PROGRAM_ID,
      )

      // Get associated token account
      const tokenAccount = await getAssociatedTokenAddress(GOLD_TOKEN_MINT, publicKey)

      // Get staking vault PDA
      const [stakingVault] = PublicKey.findProgramAddressSync([Buffer.from("vault")], STAKING_PROGRAM_ID)

      // Create transaction
      const transaction = new Transaction()

      // Check if staking account exists
      const stakingAccountInfo = await connection.getAccountInfo(stakingAccount)

      if (!stakingAccountInfo) {
        // Initialize staking account
        transaction.add({
          keys: [
            { pubkey: publicKey, isSigner: true, isWritable: true },
            { pubkey: stakingAccount, isSigner: false, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          ],
          programId: STAKING_PROGRAM_ID,
          data: Buffer.from([0]), // Instruction: Initialize
        })
      }

      // Convert amount to lamports
      const amountLamports = BigInt(Math.floor(Number.parseFloat(amount) * 1e9))

      // Add stake instruction
      transaction.add({
        keys: [
          { pubkey: publicKey, isSigner: true, isWritable: true },
          { pubkey: stakingAccount, isSigner: false, isWritable: true },
          { pubkey: tokenAccount, isSigner: false, isWritable: true },
          { pubkey: stakingVault, isSigner: false, isWritable: true },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        programId: STAKING_PROGRAM_ID,
        data: Buffer.concat([
          Buffer.from([1]), // Instruction: Stake
          Buffer.from(new Uint8Array(new BigUint64Array([amountLamports]).buffer)), // Amount
        ]),
      })

      // Set recent blockhash
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      transaction.feePayer = publicKey

      // Sign and send transaction
      const signedTransaction = await signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTransaction.serialize())

      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed")

      toast({
        title: "Staking Successful",
        description: `Successfully staked ${amount} GOLD tokens`,
      })

      // Refresh data
      await fetchStakingData(connection, publicKey)
      await fetchGoldBalance(connection, publicKey)

      // Reset form
      setAmount("")
    } catch (error) {
      console.error("Error staking:", error)
      toast({
        title: "Staking Failed",
        description: "Failed to stake GOLD tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsStaking(false)
    }
  }

  // Handle unstaking
  const handleUnstake = async () => {
    if (!connected || !publicKey || !signTransaction || !connection) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to unstake GOLD tokens",
        variant: "destructive",
      })
      return
    }

    if (stakedAmount <= 0) {
      toast({
        title: "No Staked Tokens",
        description: "You don't have any staked GOLD tokens",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUnstaking(true)

      // Get staking account PDA
      const [stakingAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("staking"), publicKey.toBuffer()],
        STAKING_PROGRAM_ID,
      )

      // Get associated token account
      const tokenAccount = await getAssociatedTokenAddress(GOLD_TOKEN_MINT, publicKey)

      // Get staking vault PDA
      const [stakingVault] = PublicKey.findProgramAddressSync([Buffer.from("vault")], STAKING_PROGRAM_ID)

      // Create transaction
      const transaction = new Transaction()

      // Add unstake instruction
      transaction.add({
        keys: [
          { pubkey: publicKey, isSigner: true, isWritable: true },
          { pubkey: stakingAccount, isSigner: false, isWritable: true },
          { pubkey: tokenAccount, isSigner: false, isWritable: true },
          { pubkey: stakingVault, isSigner: false, isWritable: true },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        programId: STAKING_PROGRAM_ID,
        data: Buffer.from([2]), // Instruction: Unstake
      })

      // Set recent blockhash
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      transaction.feePayer = publicKey

      // Sign and send transaction
      const signedTransaction = await signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTransaction.serialize())

      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed")

      toast({
        title: "Unstaking Successful",
        description: `Successfully unstaked ${stakedAmount} GOLD tokens`,
      })

      // Refresh data
      await fetchStakingData(connection, publicKey)
      await fetchGoldBalance(connection, publicKey)
    } catch (error) {
      console.error("Error unstaking:", error)
      toast({
        title: "Unstaking Failed",
        description: "Failed to unstake GOLD tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUnstaking(false)
    }
  }

  // Handle claiming rewards
  const handleClaimRewards = async () => {
    if (!connected || !publicKey || !signTransaction || !connection) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to claim rewards",
        variant: "destructive",
      })
      return
    }

    if (rewards <= 0) {
      toast({
        title: "No Rewards",
        description: "You don't have any rewards to claim",
        variant: "destructive",
      })
      return
    }

    try {
      setIsClaiming(true)

      // Get staking account PDA
      const [stakingAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("staking"), publicKey.toBuffer()],
        STAKING_PROGRAM_ID,
      )

      // Get associated token account
      const tokenAccount = await getAssociatedTokenAddress(GOLD_TOKEN_MINT, publicKey)

      // Get staking vault PDA
      const [stakingVault] = PublicKey.findProgramAddressSync([Buffer.from("vault")], STAKING_PROGRAM_ID)

      // Create transaction
      const transaction = new Transaction()

      // Add claim rewards instruction
      transaction.add({
        keys: [
          { pubkey: publicKey, isSigner: true, isWritable: true },
          { pubkey: stakingAccount, isSigner: false, isWritable: true },
          { pubkey: tokenAccount, isSigner: false, isWritable: true },
          { pubkey: stakingVault, isSigner: false, isWritable: true },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        programId: STAKING_PROGRAM_ID,
        data: Buffer.from([3]), // Instruction: Claim Rewards
      })

      // Set recent blockhash
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      transaction.feePayer = publicKey

      // Sign and send transaction
      const signedTransaction = await signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTransaction.serialize())

      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed")

      toast({
        title: "Claim Successful",
        description: `Successfully claimed ${rewards.toFixed(2)} GOLD tokens`,
      })

      // Refresh data
      await fetchStakingData(connection, publicKey)
      await fetchGoldBalance(connection, publicKey)
    } catch (error) {
      console.error("Error claiming rewards:", error)
      toast({
        title: "Claim Failed",
        description: "Failed to claim rewards. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsClaiming(false)
    }
  }

  // Calculate estimated daily rewards
  const calculateDailyRewards = () => {
    return (stakedAmount * apr) / 365 / 100
  }

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto bg-black/50 border border-yellow-500/30 text-white">
          <CardHeader>
            <CardTitle className="text-center text-yellow-500">Wallet Connection Required</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Please connect your wallet to access the staking interface
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
          GOLD Staking Interface
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-black/50 border border-yellow-500/30 text-white">
            <CardHeader>
              <CardTitle className="text-yellow-500">Your Staking Stats</CardTitle>
              <CardDescription className="text-gray-300">Current staking information</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Staked Amount</p>
                    <p className="text-2xl font-bold">{stakedAmount.toFixed(2)} GOLD</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Pending Rewards</p>
                    <p className="text-2xl font-bold text-yellow-500">{rewards.toFixed(4)} GOLD</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Staking Period</p>
                    <p className="text-lg">{stakingPeriod} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">APR</p>
                    <p className="text-lg">{apr}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">GOLD Balance</p>
                    <p className="text-lg">{goldBalance.toFixed(2)} GOLD</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                onClick={handleUnstake}
                disabled={isLoading || stakedAmount <= 0 || isUnstaking}
                variant="outline"
                className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20"
              >
                {isUnstaking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Unstake All
              </Button>
              <Button
                onClick={handleClaimRewards}
                disabled={isLoading || rewards <= 0 || isClaiming}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {isClaiming ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Claim Rewards
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-black/50 border border-yellow-500/30 text-white">
            <CardHeader>
              <CardTitle className="text-yellow-500">Stake GOLD</CardTitle>
              <CardDescription className="text-gray-300">Stake your GOLD tokens to earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Amount to Stake</p>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-black/30 border-yellow-500/30 text-white"
                      disabled={isLoading || isStaking}
                    />
                    <Button
                      variant="outline"
                      className="border-yellow-500/50 text-yellow-500"
                      onClick={() => setAmount(goldBalance.toString())}
                      disabled={isLoading || isStaking || goldBalance <= 0}
                    >
                      MAX
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Estimated APR</p>
                  <p className="text-lg">{apr}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Estimated Daily Rewards</p>
                  <p className="text-lg">
                    {amount ? ((Number.parseFloat(amount) * apr) / 365 / 100).toFixed(4) : "0.0000"} GOLD
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleStake}
                disabled={
                  isLoading ||
                  !amount ||
                  Number.parseFloat(amount) <= 0 ||
                  Number.parseFloat(amount) > goldBalance ||
                  isStaking
                }
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {isStaking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Stake GOLD
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="bg-black/50 border border-yellow-500/30 text-white">
          <CardHeader>
            <CardTitle className="text-yellow-500">Staking Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">How Staking Works</h3>
                <p className="text-gray-300">
                  Staking your GOLD tokens allows you to earn passive income while supporting the Goldium ecosystem.
                  When you stake your tokens, they are locked in a smart contract, and you earn rewards based on the
                  current APR rate.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Rewards Distribution</h3>
                <p className="text-gray-300">
                  Rewards are calculated daily and can be claimed at any time. The APR rate may fluctuate based on the
                  total amount of GOLD staked in the protocol.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Unstaking</h3>
                <p className="text-gray-300">
                  You can unstake your GOLD tokens at any time without any penalty. However, any unclaimed rewards must
                  be claimed separately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
