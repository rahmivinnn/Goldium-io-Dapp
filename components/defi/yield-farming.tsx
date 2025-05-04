"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

export default function YieldFarming() {
  const [isClient, setIsClient] = useState(false)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [farms, setFarms] = useState([
    {
      id: "gold-sol",
      name: "GOLD-SOL LP",
      tvl: 1250000,
      apr: 42.5,
      userStaked: 0,
      rewards: 0,
      token1: "GOLD",
      token2: "SOL",
      isStaking: false,
      isClaiming: false,
    },
    {
      id: "gold-usdc",
      name: "GOLD-USDC LP",
      tvl: 750000,
      apr: 36.8,
      userStaked: 0,
      rewards: 0,
      token1: "GOLD",
      token2: "USDC",
      isStaking: false,
      isClaiming: false,
    },
  ])
  const { toast } = useToast()

  useEffect(() => {
    setIsClient(true)

    // Check if wallet is connected
    const checkWallet = () => {
      if (window.solana && window.solana.isConnected) {
        setConnected(true)
        // Fetch farm data
        fetchFarmData()
      } else {
        setConnected(false)
      }
    }

    checkWallet()

    // Listen for wallet connection changes
    if (window.solana) {
      window.solana.on("connect", checkWallet)
      window.solana.on("disconnect", () => setConnected(false))
    }

    return () => {
      // Cleanup listeners
      if (window.solana) {
        window.solana.removeAllListeners("connect")
        window.solana.removeAllListeners("disconnect")
      }
    }
  }, [])

  const fetchFarmData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Update with mock data
      setFarms((prevFarms) =>
        prevFarms.map((farm) => ({
          ...farm,
          userStaked: Math.floor(Math.random() * 1000),
          rewards: Math.floor(Math.random() * 50),
        })),
      )
    } catch (error) {
      console.error("Error fetching farm data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStake = async (farmId: string) => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to stake LP tokens.",
        variant: "destructive",
      })
      return
    }

    // Update farm status
    setFarms((prevFarms) => prevFarms.map((farm) => (farm.id === farmId ? { ...farm, isStaking: true } : farm)))

    try {
      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update farm data
      setFarms((prevFarms) =>
        prevFarms.map((farm) =>
          farm.id === farmId
            ? {
                ...farm,
                userStaked: farm.userStaked + 100, // Add 100 LP tokens
                isStaking: false,
              }
            : farm,
        ),
      )

      toast({
        title: "Staking Successful",
        description: `Successfully staked LP tokens in ${farmId} farm.`,
      })
    } catch (error) {
      console.error("Staking error:", error)
      toast({
        title: "Staking Failed",
        description: "There was an error processing your stake. Please try again.",
        variant: "destructive",
      })

      // Reset staking status
      setFarms((prevFarms) => prevFarms.map((farm) => (farm.id === farmId ? { ...farm, isStaking: false } : farm)))
    }
  }

  const handleClaim = async (farmId: string) => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to claim rewards.",
        variant: "destructive",
      })
      return
    }

    const farm = farms.find((f) => f.id === farmId)
    if (!farm || farm.rewards <= 0) {
      toast({
        title: "No Rewards",
        description: "You don't have any rewards to claim from this farm.",
        variant: "destructive",
      })
      return
    }

    // Update farm status
    setFarms((prevFarms) => prevFarms.map((farm) => (farm.id === farmId ? { ...farm, isClaiming: true } : farm)))

    try {
      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update farm data
      const claimedAmount = farm.rewards
      setFarms((prevFarms) =>
        prevFarms.map((farm) =>
          farm.id === farmId
            ? {
                ...farm,
                rewards: 0,
                isClaiming: false,
              }
            : farm,
        ),
      )

      toast({
        title: "Rewards Claimed",
        description: `Successfully claimed ${claimedAmount} GOLD tokens from ${farmId} farm.`,
      })
    } catch (error) {
      console.error("Claiming error:", error)
      toast({
        title: "Claiming Failed",
        description: "There was an error claiming your rewards. Please try again.",
        variant: "destructive",
      })

      // Reset claiming status
      setFarms((prevFarms) => prevFarms.map((farm) => (farm.id === farmId ? { ...farm, isClaiming: false } : farm)))
    }
  }

  // Don't render anything on the server
  if (!isClient) {
    return (
      <Card className="border-gold/30 bg-black/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-gold">Yield Farming</CardTitle>
          <CardDescription>Loading yield farming interface...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-lg bg-black/50 border border-gold/20 p-4 space-y-3">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between mt-2">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gold/30 bg-black/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-gold">Yield Farming</CardTitle>
        <CardDescription>Provide liquidity and earn GOLD rewards</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {farms.map((farm) => (
          <Card key={farm.id} className="bg-black/50 border-gold/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-gold">{farm.name}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-gray-400">Total Value Locked:</div>
                <div className="text-right font-medium">
                  {loading ? <Skeleton className="h-4 w-20 ml-auto" /> : `$${farm.tvl.toLocaleString()}`}
                </div>
                <div className="text-gray-400">APR:</div>
                <div className="text-right font-medium text-green-500">
                  {loading ? <Skeleton className="h-4 w-16 ml-auto" /> : `${farm.apr}%`}
                </div>
                <div className="text-gray-400">Your Staked LP:</div>
                <div className="text-right font-medium">
                  {loading ? <Skeleton className="h-4 w-20 ml-auto" /> : `${farm.userStaked.toLocaleString()}`}
                </div>
                <div className="text-gray-400">Pending Rewards:</div>
                <div className="text-right font-medium text-gold">
                  {loading ? <Skeleton className="h-4 w-20 ml-auto" /> : `${farm.rewards.toLocaleString()} GOLD`}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                className="border-gold/50 text-gold hover:bg-gold/10"
                onClick={() => handleStake(farm.id)}
                disabled={!connected || farm.isStaking}
              >
                {farm.isStaking ? "Staking..." : "Stake LP"}
              </Button>
              <Button
                className="bg-gold hover:bg-gold/80 text-black"
                onClick={() => handleClaim(farm.id)}
                disabled={!connected || farm.rewards <= 0 || farm.isClaiming}
              >
                {farm.isClaiming ? "Claiming..." : "Harvest"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" className="text-gold hover:text-gold/80">
          Add Liquidity to Earn LP Tokens
        </Button>
      </CardFooter>
    </Card>
  )
}
