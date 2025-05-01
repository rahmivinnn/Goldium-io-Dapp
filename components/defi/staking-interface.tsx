"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/components/wallet-provider"
import { useNetwork } from "@/contexts/network-context"
import { useToast } from "@/hooks/use-toast"

export function StakingInterface() {
  const [stakeAmount, setStakeAmount] = useState("")
  const [unstakeAmount, setUnstakeAmount] = useState("")
  const [isStaking, setIsStaking] = useState(false)
  const [isUnstaking, setIsUnstaking] = useState(false)
  const { connected, goldBalance } = useWallet()
  const { isTestnet } = useNetwork()
  const { toast } = useToast()

  // Mock staked amount and rewards
  const [stakedAmount, setStakedAmount] = useState(isTestnet ? 2500 : 750)
  const [pendingRewards, setPendingRewards] = useState(isTestnet ? 125 : 37.5)

  // APY rates
  const apy = 15 // 15% APY

  // Handle staking
  const handleStake = async () => {
    if (!connected) {
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

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update staked amount
      setStakedAmount((prev) => prev + Number(stakeAmount))

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
    if (!connected) {
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
    if (Number(unstakeAmount) > stakedAmount) {
      toast({
        title: "Insufficient Staked Amount",
        description: "You don't have enough staked GOLD tokens to unstake this amount.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUnstaking(true)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update staked amount
      setStakedAmount((prev) => prev - Number(unstakeAmount))

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
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to claim rewards.",
        variant: "destructive",
      })
      return
    }

    if (pendingRewards <= 0) {
      toast({
        title: "No Rewards",
        description: "You don't have any pending rewards to claim.",
        variant: "destructive",
      })
      return
    }

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Rewards Claimed",
        description: `Successfully claimed ${pendingRewards} GOLD tokens.`,
      })

      // Reset rewards
      setPendingRewards(0)
    } catch (error) {
      console.error("Claiming rewards error:", error)
      toast({
        title: "Claiming Failed",
        description: "There was an error claiming your rewards. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Stake GOLD Tokens</CardTitle>
        <CardDescription>
          Stake your GOLD tokens to earn rewards
          {isTestnet && " (Testnet Mode)"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Staking Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted p-3">
            <div className="text-xs text-muted-foreground">Total Staked</div>
            <div className="mt-1 text-xl font-bold">{stakedAmount.toFixed(2)} GOLD</div>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <div className="text-xs text-muted-foreground">APY</div>
            <div className="mt-1 text-xl font-bold text-green-500">{apy}%</div>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <div className="text-xs text-muted-foreground">Pending Rewards</div>
            <div className="mt-1 text-xl font-bold">{pendingRewards.toFixed(2)} GOLD</div>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <div className="text-xs text-muted-foreground">Available Balance</div>
            <div className="mt-1 text-xl font-bold">{goldBalance.toFixed(2)} GOLD</div>
          </div>
        </div>

        {/* Staking Actions */}
        <Tabs defaultValue="stake" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stake">Stake</TabsTrigger>
            <TabsTrigger value="unstake">Unstake</TabsTrigger>
          </TabsList>
          <TabsContent value="stake" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Amount to Stake</label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
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
              />
            </div>
            <Button className="w-full" onClick={handleStake} disabled={!connected || !stakeAmount || isStaking}>
              {isStaking ? "Staking..." : "Stake GOLD"}
            </Button>
          </TabsContent>
          <TabsContent value="unstake" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Amount to Unstake</label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() => setUnstakeAmount(stakedAmount.toString())}
                >
                  Max
                </button>
              </div>
              <Input
                type="number"
                placeholder="0.0"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleUnstake} disabled={!connected || !unstakeAmount || isUnstaking}>
              {isUnstaking ? "Unstaking..." : "Unstake GOLD"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleClaimRewards}
          disabled={!connected || pendingRewards <= 0}
        >
          Claim {pendingRewards.toFixed(2)} GOLD Rewards
        </Button>
      </CardFooter>
    </Card>
  )
}

export default StakingInterface
