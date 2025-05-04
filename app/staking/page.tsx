"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StakingContract from "@/components/defi/staking-contract"
import YieldFarming from "@/components/defi/yield-farming"
import { WalletConnectOverlay } from "@/components/wallet-connect-overlay"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import StakingLeaderboard from "@/components/staking-leaderboard"
import StakingHistory from "@/components/staking-history"

export default function StakingPage() {
  const { connected } = useSolanaWallet()
  const [activeTab, setActiveTab] = useState("stake")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">
        Goldium Staking & Yield
      </h1>

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
                  <StakingContract />
                  {!connected && <WalletConnectOverlay />}
                </TabsContent>

                <TabsContent value="farm" className="relative">
                  <YieldFarming />
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
    </div>
  )
}
