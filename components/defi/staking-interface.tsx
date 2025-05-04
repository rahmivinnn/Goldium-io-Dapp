"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Lock, Unlock } from "lucide-react"

// Mock data and functions to avoid any Solana dependencies
const mockData = {
  goldBalance: 1000,
  stakedAmount: 500,
  rewards: 25.5,
  stakingAPY: 15.5,
}

export default function StakingInterface() {
  const [mounted, setMounted] = useState(false)
  const [connected, setConnected] = useState(false)
  const [goldBalance, setGoldBalance] = useState(0)
  const [stakeAmount, setStakeAmount] = useState<number>(0)
  const [stakedAmount, setStakedAmount] = useState<number>(0)
  const [rewards, setRewards] = useState<number>(0)
  const [stakingAPY, setStakingAPY] = useState<number>(15.5)
  const [isStaking, setIsStaking] = useState<boolean>(false)
  const [isClaiming, setIsClaiming] = useState<boolean>(false)
  const [isUnstaking, setIsUnstaking] = useState<boolean>(false)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)

    // Mock wallet connection for demo
    const isConnected = localStorage.getItem("walletConnected") === "true"
    if (isConnected) {
      setConnected(true)
      setGoldBalance(mockData.goldBalance)
      setStakedAmount(mockData.stakedAmount)
      setRewards(mockData.rewards)
      setStakingAPY(mockData.stakingAPY)
    }
  }, [])

  const handleConnect = () => {
    setConnected(true)
    setGoldBalance(mockData.goldBalance)
    setStakedAmount(mockData.stakedAmount)
    setRewards(mockData.rewards)
    localStorage.setItem("walletConnected", "true")
  }

  const handleDisconnect = () => {
    setConnected(false)
    setGoldBalance(0)
    setStakedAmount(0)
    setRewards(0)
    localStorage.removeItem("walletConnected")
  }

  const handleStakeAmountChange = (value: number[]) => {
    setStakeAmount(value[0])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value) && value >= 0 && value <= goldBalance) {
      setStakeAmount(value)
    }
  }

  const handleMaxClick = () => {
    setStakeAmount(goldBalance)
  }

  const handleStake = async () => {
    if (!connected || stakeAmount <= 0 || stakeAmount > goldBalance) return

    setIsStaking(true)
    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update staked amount
      setStakedAmount((prev) => prev + stakeAmount)
      setGoldBalance((prev) => prev - stakeAmount)
      setStakeAmount(0)

      toast({
        title: "Staking Successful",
        description: `Successfully staked ${stakeAmount} GOLD tokens`,
      })
    } catch (error) {
      console.error("Staking error:", error)
      toast({
        title: "Staking Failed",
        description: "Failed to stake tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsStaking(false)
    }
  }

  const handleUnstake = async () => {
    if (!connected || stakedAmount <= 0) return

    setIsUnstaking(true)
    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update staked amount
      setGoldBalance((prev) => prev + stakedAmount)
      setStakedAmount(0)

      toast({
        title: "Unstaking Successful",
        description: `Successfully unstaked ${stakedAmount} GOLD tokens`,
      })
    } catch (error) {
      console.error("Unstaking error:", error)
      toast({
        title: "Unstaking Failed",
        description: "Failed to unstake tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUnstaking(false)
    }
  }

  const handleClaimRewards = async () => {
    if (!connected || rewards <= 0) return

    setIsClaiming(true)
    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Reset rewards
      const claimedAmount = rewards
      setGoldBalance((prev) => prev + rewards)
      setRewards(0)

      toast({
        title: "Rewards Claimed",
        description: `Successfully claimed ${claimedAmount} GOLD tokens`,
      })
    } catch (error) {
      console.error("Claiming error:", error)
      toast({
        title: "Claiming Failed",
        description: "Failed to claim rewards. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsClaiming(false)
    }
  }

  // Calculate estimated annual yield
  const calculateAnnualYield = () => {
    return (stakedAmount * stakingAPY) / 100
  }

  if (!mounted) {
    return (
      <Card className="w-full max-w-md mx-auto border-gold/30 bg-black/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gold">GOLD Token Staking</CardTitle>
          <CardDescription>Loading staking interface...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
          <div className="animate-pulse w-full space-y-4">
            <div className="h-4 bg-gold/20 rounded w-3/4"></div>
            <div className="h-4 bg-gold/20 rounded w-1/2"></div>
            <div className="h-10 bg-gold/10 rounded"></div>
            <div className="h-10 bg-gold/10 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!connected) {
    return (
      <Card className="w-full max-w-md mx-auto border-gold/30 bg-black/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gold">GOLD Token Staking</CardTitle>
          <CardDescription>Stake your GOLD tokens to earn rewards</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
          <p className="text-center text-muted-foreground">Connect your wallet to start staking</p>
          <Button className="bg-gold hover:bg-gold/80 text-black font-medium" onClick={handleConnect}>
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto border-gold/30 bg-black/60 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl text-gold">GOLD Token Staking</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleDisconnect} className="text-gray-400 hover:text-white">
            Disconnect
          </Button>
        </div>
        <CardDescription>Current APY: {stakingAPY}%</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Available Balance</span>
            <span className="text-sm">{goldBalance.toFixed(2)} GOLD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Staked Amount</span>
            <span className="text-sm">{stakedAmount.toFixed(2)} GOLD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Pending Rewards</span>
            <span className="text-sm">{rewards.toFixed(2)} GOLD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Estimated Annual Yield</span>
            <span className="text-sm">{calculateAnnualYield().toFixed(2)} GOLD</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Stake Amount</label>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={stakeAmount}
                onChange={handleInputChange}
                min={0}
                max={goldBalance}
                step={0.1}
                disabled={isStaking}
                className="bg-black/50 border-gold/30 focus:border-gold"
              />
              <Button
                variant="outline"
                onClick={handleMaxClick}
                disabled={isStaking || goldBalance <= 0}
                className="border-gold/50 text-gold hover:bg-gold/10"
              >
                Max
              </Button>
            </div>
          </div>

          <Slider
            value={[stakeAmount]}
            max={goldBalance}
            step={0.1}
            onValueChange={handleStakeAmountChange}
            disabled={isStaking || goldBalance <= 0}
            className="[&>span]:bg-gold"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button
            onClick={handleStake}
            disabled={!connected || stakeAmount <= 0 || stakeAmount > goldBalance || isStaking}
            className="w-full bg-gold hover:bg-gold/80 text-black"
          >
            {isStaking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Staking...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Stake
              </>
            )}
          </Button>
          <Button
            onClick={handleUnstake}
            disabled={!connected || stakedAmount <= 0 || isUnstaking}
            variant="outline"
            className="w-full border-gold/50 text-gold hover:bg-gold/10"
          >
            {isUnstaking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Unstaking...
              </>
            ) : (
              <>
                <Unlock className="mr-2 h-4 w-4" />
                Unstake
              </>
            )}
          </Button>
        </div>
        <Button
          onClick={handleClaimRewards}
          disabled={!connected || rewards <= 0 || isClaiming}
          variant="secondary"
          className="w-full bg-black/50 border border-gold/50 text-gold hover:bg-gold/10"
        >
          {isClaiming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Claiming...
            </>
          ) : (
            <>Claim {rewards.toFixed(2)} GOLD Rewards</>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
