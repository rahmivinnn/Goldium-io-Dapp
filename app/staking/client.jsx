"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletConnectOverlay } from "@/components/wallet-connect-overlay"
import StakingLeaderboard from "@/components/staking-leaderboard"
import StakingHistory from "@/components/staking-history"

// Mock components for staking functionality
function StakingContract() {
  return (
    <Card className="border-gold/30 bg-black/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-gold">Stake GOLD Tokens</CardTitle>
        <CardDescription>Stake your GOLD tokens to earn rewards</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-black/50 border border-gold/20 p-3">
            <div className="text-xs text-gray-400">Total Staked</div>
            <div className="mt-1 text-xl font-bold text-gold">2500.00 GOLD</div>
          </div>
          <div className="rounded-lg bg-black/50 border border-gold/20 p-3">
            <div className="text-xs text-gray-400">APY</div>
            <div className="mt-1 text-xl font-bold text-gold">18.5%</div>
          </div>
          <div className="rounded-lg bg-black/50 border border-gold/20 p-3">
            <div className="text-xs text-gray-400">Pending Rewards</div>
            <div className="mt-1 text-xl font-bold text-gold">125.00 GOLD</div>
          </div>
          <div className="rounded-lg bg-black/50 border border-gold/20 p-3">
            <div className="text-xs text-gray-400">Daily Rewards</div>
            <div className="mt-1 text-xl font-bold text-gold">1.27 GOLD</div>
          </div>
        </div>
        <button className="w-full py-2 bg-gold hover:bg-gold/80 text-black rounded-md">Connect Wallet to Stake</button>
      </CardContent>
    </Card>
  )
}

function YieldFarming() {
  return (
    <Card className="border-gold/30 bg-black/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-gold">Yield Farming</CardTitle>
        <CardDescription>Provide liquidity and earn rewards</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-black/50 border border-gold/20 p-3">
            <div className="text-xs text-gray-400">Total Value Locked</div>
            <div className="mt-1 text-xl font-bold text-gold">5000.00 GOLD</div>
          </div>
          <div className="rounded-lg bg-black/50 border border-gold/20 p-3">
            <div className="text-xs text-gray-400">APY</div>
            <div className="mt-1 text-xl font-bold text-gold">24.5%</div>
          </div>
        </div>
        <button className="w-full py-2 bg-gold hover:bg-gold/80 text-black rounded-md">Connect Wallet to Farm</button>
      </CardContent>
    </Card>
  )
}

export default function StakingClient() {
  const [activeTab, setActiveTab] = useState("stake")
  const [mounted, setMounted] = useState(false)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if wallet is connected (simplified mock)
    if (window.localStorage.getItem("walletConnected") === "true") {
      setConnected(true)
    }
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card className="border border-gold/20 bg-black/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gold">Earn Rewards</CardTitle>
            <CardDescription className="text-center">Stake your tokens and earn passive income</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6 bg-black/50 border border-gold/20">
                <TabsTrigger value="stake" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  Staking
                </TabsTrigger>
                <TabsTrigger value="farm" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  Yield Farming
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stake" className="relative">
                {activeTab === "stake" && <StakingContract />}
                {!connected && <WalletConnectOverlay />}
              </TabsContent>

              <TabsContent value="farm" className="relative">
                {activeTab === "farm" && <YieldFarming />}
                {!connected && <WalletConnectOverlay />}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card className="border border-gold/20 bg-black/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gold">Top Stakers</CardTitle>
          </CardHeader>
          <CardContent>
            <StakingLeaderboard />
          </CardContent>
        </Card>

        <Card className="border border-gold/20 bg-black/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-gold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <StakingHistory />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
