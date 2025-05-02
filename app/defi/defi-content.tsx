"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/hooks/use-wallet"
import { WalletConnectOverlay } from "@/components/wallet-connect-overlay"
import dynamic from "next/dynamic"

// Dynamically import all components with no SSR
const TokenSwap = dynamic(() => import("@/components/defi/token-swap"), { ssr: false })
const AddLiquidity = dynamic(() => import("@/components/defi/add-liquidity"), { ssr: false })
const StakingInterface = dynamic(() => import("@/components/defi/staking-interface"), { ssr: false })
const YieldFarming = dynamic(() => import("@/components/defi/yield-farming"), { ssr: false })
const DefiDashboard = dynamic(() => import("@/components/defi/defi-dashboard"), { ssr: false })
const PriceChart = dynamic(() => import("@/components/defi/price-chart"), { ssr: false })

export default function DefiContent() {
  const { isConnected } = useWallet()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">
        Goldium DeFi Hub
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <DefiDashboard />
        </div>

        <div>
          <Card className="border border-amber-200/20 bg-black/60 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="text-xl">Price Charts</CardTitle>
            </CardHeader>
            <CardContent>
              <PriceChart />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border border-amber-200/20 bg-black/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl">DeFi Services</CardTitle>
            <CardDescription>Access all Goldium DeFi services in one place</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="swap" className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="swap">Swap</TabsTrigger>
                <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
                <TabsTrigger value="stake">Staking</TabsTrigger>
                <TabsTrigger value="farm">Yield Farming</TabsTrigger>
              </TabsList>

              <TabsContent value="swap" className="relative">
                <TokenSwap />
                {!isConnected && <WalletConnectOverlay />}
              </TabsContent>

              <TabsContent value="liquidity" className="relative">
                <AddLiquidity />
                {!isConnected && <WalletConnectOverlay />}
              </TabsContent>

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
    </div>
  )
}
