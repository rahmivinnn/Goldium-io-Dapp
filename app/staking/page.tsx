"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StakingInterface from "@/components/defi/staking-interface"
import YieldFarming from "@/components/defi/yield-farming"
import { WalletConnectOverlay } from "@/components/wallet-connect-overlay"
import { useWallet } from "@/hooks/use-wallet"
import StakingLeaderboard from "@/components/staking-leaderboard"
import StakingHistory from "@/components/staking-history"

export default function StakingPage() {
  const { isConnected } = useWallet()
  const [activeTab, setActiveTab] = useState("stake")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">
        Goldium Staking & Yield
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border border-amber-200/20 bg-black/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Earn Rewards</CardTitle>
              <CardDescription className="text-center">Stake your tokens and earn passive income</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="stake">Staking</TabsTrigger>
                  <TabsTrigger value="farm">Yield Farming</TabsTrigger>
                </TabsList>

                <TabsContent value="stake" className="relative">
                  <StakingInterface />
                  {!isConnected && <WalletConnectOverlay />}
                </TabsContent>

                <TabsContent value="farm" className="relative">
                  <YieldFarming />
                  {!isConnected && <WalletConnectOverlay />}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border border-amber-200/20 bg-black/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Top Stakers</CardTitle>
            </CardHeader>
            <CardContent>
              <StakingLeaderboard />
            </CardContent>
          </Card>

          <Card className="border border-amber-200/20 bg-black/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <StakingHistory />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
