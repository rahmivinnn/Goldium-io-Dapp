"use client"

import { useState, useEffect } from "react"
import { useConnection } from "@solana/wallet-adapter-react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import type { Program } from "@project-serum/anchor"
import { PublicKey } from "@solana/web3.js"

// This would be your actual IDL from the Anchor program
const idl = {
  // This is a simplified version of what would be your actual IDL
  version: "0.1.0",
  name: "goldium_staking",
  instructions: [
    {
      name: "initialize",
      accounts: [
        /* ... */
      ],
      args: [
        /* ... */
      ],
    },
    {
      name: "stake",
      accounts: [
        /* ... */
      ],
      args: [
        /* ... */
      ],
    },
    {
      name: "unstake",
      accounts: [
        /* ... */
      ],
      args: [
        /* ... */
      ],
    },
    {
      name: "claimReward",
      accounts: [
        /* ... */
      ],
      args: [
        /* ... */
      ],
    },
  ],
  accounts: [
    /* ... */
  ],
  errors: [
    /* ... */
  ],
}

// This would be your actual program ID
const PROGRAM_ID = new PublicKey("GoldXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")

export default function StakingContract() {
  const { connection } = useConnection()
  const { publicKey, signTransaction, connected, goldTokenAddress, goldBalance } = useSolanaWallet()
  const { network } = useNetwork()
  const { toast } = useToast()

  const [stakeAmount, setStakeAmount] = useState("")
  const [unstakeAmount, setUnstakeAmount] = useState("")
  const [stakedAmount, setStakedAmount] = useState<number | null>(null)
  const [pendingRewards, setPendingRewards] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [isStaking, setIsStaking] = useState(false)
  const [isUnstaking, setIsUnstaking] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [program, setProgram] = useState<Program | null>(null)

  // APY rates - increased to be more attractive
  const apy = 18.5 // 18.5% APY

  // Initialize the program when wallet is connected
  useEffect(() => {
    if (connected && publicKey) {
      try {
        // In a real implementation, you would create an AnchorProvider and Program
        // For now, we'll simulate this

        // This is a mock implementation
        // In production, you would use:
        /*
        const provider = new AnchorProvider(
          connection,
          {
            publicKey,
            signTransaction: signTransaction!,
            signAllTransactions: wallet.signAllTransactions!,
          },
          { commitment: "confirmed" }
        )
        const program = new Program(idl as any, PROGRAM_ID, provider)
        setProgram(program)
        */

        // For now, we'll just set a mock program
        setProgram({} as any)

        // Fetch staking data
        fetchStakingData()
      } catch (error) {
        console.error("Error initializing program:", error)
      }
    }
  }, [connected, publicKey, network])

  // Fetch staking data from the contract
  const fetchStakingData = async () => {
    if (!connected || !publicKey) return

    setLoading(true)

    try {
      // In a real implementation, you would fetch data from the contract
      // For now, we'll simulate this with mock data

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data based on network
      const mockStakedAmount = network === "mainnet" ? 500 : 2500
      const mockPendingRewards = network === "mainnet" ? 25 : 125

      setStakedAmount(mockStakedAmount)
      setPendingRewards(mockPendingRewards)
    } catch (error) {
      console.error("Error fetching staking data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch staking data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle staking
  const handleStake = async () => {
    if (!connected || !publicKey || !goldTokenAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to stake GOLD tokens.",
        variant: "destructive",
      })
      return
    }

    if (!stakeAmount || isNaN(Number(stakeAmount)) || Number(stakeAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to stake.",
        variant: "destructive",
      })
      return
    }

    // Check if user has enough balance
    if (Number(stakeAmount) > goldBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough GOLD tokens to stake this amount.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsStaking(true)

      // In a real implementation, you would call the stake function on the contract
      // For now, we'll simulate this

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update staked amount (this would come from the contract in a real implementation)
      setStakedAmount((prev) => (prev || 0) + Number(stakeAmount))

      toast({
        title: "Staking Successful",
        description: `Successfully staked ${stakeAmount} GOLD tokens.`,
      })

      // Reset form
      setStakeAmount("")
    } catch (error) {
      console.error("Staking error:", error)
      toast({
        title: "Staking Failed",
        description: "There was an error processing your stake. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsStaking(false)
    }
  }

  // Handle unstaking
  const handleUnstake = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to unstake GOLD tokens.",
        variant: "destructive",
      })
      return
    }

    if (!unstakeAmount || isNaN(Number(unstakeAmount)) || Number(unstakeAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to unstake.",
        variant: "destructive",
      })
      return
    }

    // Check if user has enough staked
    if (stakedAmount === null || Number(unstakeAmount) > stakedAmount) {
      toast({
        title: "Insufficient Staked Amount",
        description: "You don't have enough staked GOLD tokens to unstake this amount.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUnstaking(true)

      // In a real implementation, you would call the unstake function on the contract
      // For now, we'll simulate this

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update staked amount (this would come from the contract in a real implementation)
      setStakedAmount((prev) => (prev || 0) - Number(unstakeAmount))

      toast({
        title: "Unstaking Successful",
        description: `Successfully unstaked ${unstakeAmount} GOLD tokens.`,
      })

      // Reset form
      setUnstakeAmount("")
    } catch (error) {
      console.error("Unstaking error:", error)
      toast({
        title: "Unstaking Failed",
        description: "There was an error processing your unstake. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUnstaking(false)
    }
  }

  // Handle claiming rewards
  const handleClaimRewards = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to claim rewards.",
        variant: "destructive",
      })
      return
    }

    if (!pendingRewards || pendingRewards <= 0) {
      toast({
        title: "No Rewards",
        description: "You don't have any pending rewards to claim.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsClaiming(true)

      // In a real implementation, you would call the claimReward function on the contract
      // For now, we'll simulate this

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update rewards (this would come from the contract in a real implementation)
      const claimedAmount = pendingRewards
      setPendingRewards(0)

      toast({
        title: "Rewards Claimed",
        description: `Successfully claimed ${claimedAmount} GOLD tokens.`,
      })
    } catch (error) {
      console.error("Claiming rewards error:", error)
      toast({
        title: "Claiming Failed",
        description: "There was an error claiming your rewards. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsClaiming(false)
    }
  }

  // Calculate estimated daily rewards
  const calculateDailyRewards = () => {
    if (stakedAmount === null) return 0
    return (stakedAmount * (apy / 100)) / 365
  }

  return (
    <Card className="border-gold/30 bg-black/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-gold">Stake GOLD Tokens</CardTitle>
        <CardDescription>
          Stake your GOLD tokens to earn {apy}% APY
          {network === "testnet" && " (Testnet Mode)"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Staking Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-black/50 border border-gold/20 p-3">
            <div className="text-xs text-gray-400">Total Staked</div>
            {loading ? (
              <Skeleton className="h-6 w-20 mt-1" />
            ) : (
              <div className="mt-1 text-xl font-bold text-gold">
                {stakedAmount !== null ? stakedAmount.toFixed(2) : "0.00"} GOLD
              </div>
            )}
          </div>
          <div className="rounded-lg bg-black/50 border border-gold/20 p-3">
            <div className="text-xs text-gray-400">APY</div>
            <div className="mt-1 text-xl font-bold text-gold">{apy}%</div>
          </div>
          <div className="rounded-lg bg-black/50 border border-gold/20 p-3">
            <div className="text-xs text-gray-400">Pending Rewards</div>
            {loading ? (
              <Skeleton className="h-6 w-20 mt-1" />
            ) : (
              <div className="mt-1 text-xl font-bold text-gold">
                {pendingRewards !== null ? pendingRewards.toFixed(2) : "0.00"} GOLD
              </div>
            )}
          </div>
          <div className="rounded-lg bg-black/50 border border-gold/20 p-3">
            <div className="text-xs text-gray-400">Daily Rewards</div>
            {loading ? (
              <Skeleton className="h-6 w-20 mt-1" />
            ) : (
              <div className="mt-1 text-xl font-bold text-gold">{calculateDailyRewards().toFixed(2)} GOLD</div>
            )}
          </div>
        </div>

        {/* Staking Actions */}
        <Tabs defaultValue="stake" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-gold/20">
            <TabsTrigger value="stake" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Stake
            </TabsTrigger>
            <TabsTrigger value="unstake" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Unstake
            </TabsTrigger>
          </TabsList>
          <TabsContent value="stake" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Amount to Stake</label>
                <button
                  type="button"
                  className="text-xs text-gold hover:underline"
                  onClick={() => setStakeAmount(goldBalance.toString())}
                >
                  Max
                </button>
              </div>
              <Input
                type="number"
                placeholder="0.0"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="bg-black/50 border-gold/30 focus:border-gold"
              />
            </div>
            <Button
              className="w-full bg-gold hover:bg-gold/80 text-black"
              onClick={handleStake}
              disabled={!connected || !stakeAmount || isStaking}
            >
              {isStaking ? "Staking..." : "Stake GOLD"}
            </Button>
          </TabsContent>
          <TabsContent value="unstake" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Amount to Unstake</label>
                <button
                  type="button"
                  className="text-xs text-gold hover:underline"
                  onClick={() => setUnstakeAmount(stakedAmount?.toString() || "0")}
                >
                  Max
                </button>
              </div>
              <Input
                type="number"
                placeholder="0.0"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                className="bg-black/50 border-gold/30 focus:border-gold"
              />
            </div>
            <Button
              className="w-full bg-gold hover:bg-gold/80 text-black"
              onClick={handleUnstake}
              disabled={!connected || !unstakeAmount || isUnstaking}
            >
              {isUnstaking ? "Unstaking..." : "Unstake GOLD"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full border-gold/50 text-gold hover:bg-gold/10"
          onClick={handleClaimRewards}
          disabled={!connected || !pendingRewards || pendingRewards <= 0 || isClaiming}
        >
          {isClaiming ? "Claiming..." : `Claim ${pendingRewards?.toFixed(2) || "0.00"} GOLD Rewards`}
        </Button>
      </CardFooter>
    </Card>
  )
}
