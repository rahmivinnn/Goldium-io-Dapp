"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TokenSwap from "@/components/defi/token-swap"
import AddLiquidity from "@/components/defi/add-liquidity"
import LiquidityPositions from "@/components/defi/liquidity-positions"
import { WalletConnectOverlay } from "@/components/wallet-connect-overlay"
import { useWallet } from "@/hooks/use-wallet"

export default function SwapPage() {
  const { isConnected } = useWallet()
  const [activeTab, setActiveTab] = useState("swap")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">
        Goldium DeFi Exchange
      </h1>

      <div className="max-w-2xl mx-auto">
        <Card className="border border-amber-200/20 bg-black/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Trade & Liquidity</CardTitle>
            <CardDescription className="text-center">Swap tokens and provide liquidity to earn rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="swap">Swap</TabsTrigger>
                <TabsTrigger value="add">Add Liquidity</TabsTrigger>
                <TabsTrigger value="positions">Your Positions</TabsTrigger>
              </TabsList>

              <TabsContent value="swap" className="relative">
                <TokenSwap />
                {!isConnected && <WalletConnectOverlay />}
              </TabsContent>

              <TabsContent value="add" className="relative">
                <AddLiquidity />
                {!isConnected && <WalletConnectOverlay />}
              </TabsContent>

              <TabsContent value="positions" className="relative">
                <LiquidityPositions />
                {!isConnected && <WalletConnectOverlay />}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
