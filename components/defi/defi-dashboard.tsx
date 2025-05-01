"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/hooks/use-wallet"
import { WalletConnectOverlay } from "@/components/wallet-connect-overlay"

// Import DeFi components
import { PriceChart } from "./price-chart"
import { TokenSwap } from "./token-swap"
import { AddLiquidity } from "./add-liquidity"
import { LiquidityPositions } from "./liquidity-positions"
import { StakingInterface } from "./staking-interface"
import { YieldFarming } from "./yield-farming"

export default function DefiDashboard() {
  const { isConnected } = useWallet()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for the overview
  const overviewData = {
    totalValueLocked: 12450000,
    goldPrice: 2.34,
    goldPriceChange: 5.67,
    totalTransactions: 1245789,
    activeUsers: 45678,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-amber-800">DeFi Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-800">Total Value Locked</CardTitle>
            <CardDescription className="text-amber-600">Across all protocols</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-900">${overviewData.totalValueLocked.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-800">GOLD Price</CardTitle>
            <CardDescription className="text-amber-600">Current market price</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-900">${overviewData.goldPrice}</p>
            <p className={`text-sm ${overviewData.goldPriceChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {overviewData.goldPriceChange >= 0 ? "+" : ""}
              {overviewData.goldPriceChange}% (24h)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-800">Protocol Stats</CardTitle>
            <CardDescription className="text-amber-600">Platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-amber-700">Transactions</p>
                <p className="text-xl font-bold text-amber-900">{overviewData.totalTransactions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-amber-700">Active Users</p>
                <p className="text-xl font-bold text-amber-900">{overviewData.activeUsers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        {!isConnected && <WalletConnectOverlay />}

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="swap">Swap</TabsTrigger>
            <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="staking">Staking</TabsTrigger>
            <TabsTrigger value="farming">Yield Farming</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <PriceChart
              tokenSymbol="GOLD"
              tokenName="Goldium"
              currentPrice={overviewData.goldPrice}
              priceChange={overviewData.goldPriceChange}
            />
          </TabsContent>

          <TabsContent value="swap">
            <TokenSwap />
          </TabsContent>

          <TabsContent value="liquidity">
            <AddLiquidity />
          </TabsContent>

          <TabsContent value="positions">
            <LiquidityPositions />
          </TabsContent>

          <TabsContent value="staking">
            <StakingInterface />
          </TabsContent>

          <TabsContent value="farming">
            <YieldFarming />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
