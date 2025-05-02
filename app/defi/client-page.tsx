"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DefiClientPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">
          Goldium DeFi Hub
        </h1>

        <div className="border border-amber-200/20 bg-black/60 backdrop-blur-sm rounded-lg p-8 text-center">
          <p className="mb-4">Loading DeFi Hub...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">
        Goldium DeFi Hub
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card className="border border-amber-200/20 bg-black/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">DeFi Dashboard</CardTitle>
              <CardDescription>Manage your DeFi portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-black/40 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Portfolio Value</p>
                  <h3 className="text-2xl font-bold">$12,567.89</h3>
                  <div className="text-green-500 text-sm">+$345.67 (2.83%)</div>
                </div>

                <div className="bg-black/40 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Staking Rewards</p>
                  <h3 className="text-2xl font-bold">$1,250.75</h3>
                  <div className="text-green-500 text-sm">+37.5 GOLD this week</div>
                </div>

                <div className="bg-black/40 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">Total APR</p>
                  <h3 className="text-2xl font-bold">21.4%</h3>
                  <div className="text-green-500 text-sm">+2.1% from last week</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Token Balances</h3>
                <div className="space-y-3">
                  <div className="bg-black/40 p-4 rounded-lg flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                        <span className="font-bold text-amber-500">G</span>
                      </div>
                      <div>
                        <p className="font-medium">GOLD</p>
                        <p className="text-sm text-gray-400">1,250 GOLD</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$7,187.50</p>
                      <p className="text-sm text-green-500">+3.2%</p>
                    </div>
                  </div>

                  <div className="bg-black/40 p-4 rounded-lg flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                        <span className="font-bold text-amber-500">S</span>
                      </div>
                      <div>
                        <p className="font-medium">SOL</p>
                        <p className="text-sm text-gray-400">25.5 SOL</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">$3,825.00</p>
                      <p className="text-sm text-green-500">+1.8%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border border-amber-200/20 bg-black/60 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="text-xl">Price Charts</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="GOLD">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="GOLD">GOLD</TabsTrigger>
                  <TabsTrigger value="SOL">SOL</TabsTrigger>
                  <TabsTrigger value="USDC">USDC</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-col mb-4">
                <div className="text-3xl font-bold">$5.75</div>
                <div className="text-sm text-green-500">+$0.29 (+5.00%)</div>
              </div>

              <div className="h-[200px] bg-black/20 rounded-md flex items-center justify-center">
                <p className="text-amber-500">Chart visualization</p>
              </div>
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
                <div className="bg-black/40 p-6 rounded-lg">
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">From</p>
                    <div className="flex items-center justify-between bg-black/60 p-3 rounded-lg">
                      <input type="text" placeholder="0.0" className="bg-transparent outline-none w-full" />
                      <button className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-lg">SOL</button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">To</p>
                    <div className="flex items-center justify-between bg-black/60 p-3 rounded-lg">
                      <input type="text" placeholder="0.0" className="bg-transparent outline-none w-full" />
                      <button className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-lg">GOLD</button>
                    </div>
                  </div>

                  <button className="w-full bg-amber-500 text-black py-2 rounded-lg font-medium">Swap</button>
                </div>
              </TabsContent>

              <TabsContent value="liquidity" className="relative">
                <div className="p-6 text-center">
                  <p>Liquidity management interface</p>
                </div>
              </TabsContent>

              <TabsContent value="stake" className="relative">
                <div className="p-6 text-center">
                  <p>Staking interface</p>
                </div>
              </TabsContent>

              <TabsContent value="farm" className="relative">
                <div className="p-6 text-center">
                  <p>Yield farming interface</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
