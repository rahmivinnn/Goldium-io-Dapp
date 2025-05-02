"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowUpRight, Wallet, Coins, TrendingUp } from "lucide-react"

export default function DefiDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Safe formatter function that doesn't use toLocaleString
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return "N/A"
    try {
      return `$${value.toFixed(2)}`
    } catch (error) {
      return `$${value}`
    }
  }

  if (!isMounted) {
    return (
      <Card className="border border-amber-200/20 bg-black/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">DeFi Dashboard</CardTitle>
          <CardDescription>Manage your DeFi portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <p>Loading dashboard data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Mock data
  const portfolioValue = 12567.89
  const portfolioChange = 345.67
  const portfolioChangePercent = 2.83

  const tokenBalances = [
    { name: "GOLD", amount: 1250, value: 7187.5, change: 3.2 },
    { name: "SOL", amount: 25.5, value: 3825.0, change: 1.8 },
    { name: "USDC", amount: 1555.39, value: 1555.39, change: 0 },
  ]

  const stakingPositions = [
    { pool: "GOLD-SOL LP", staked: "$2,500.00", rewards: "12.5 GOLD", apr: "24.5%" },
    { pool: "GOLD Staking", staked: "$5,000.00", rewards: "25 GOLD", apr: "18.2%" },
  ]

  const recentTransactions = [
    { type: "Swap", description: "SOL → GOLD", amount: "2.5 SOL", value: "$375.00", time: "2 hours ago" },
    { type: "Stake", description: "GOLD Staking", amount: "500 GOLD", value: "$2,875.00", time: "1 day ago" },
    { type: "Swap", description: "USDC → SOL", amount: "500 USDC", value: "$500.00", time: "3 days ago" },
  ]

  return (
    <Card className="border border-amber-200/20 bg-black/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">DeFi Dashboard</CardTitle>
        <CardDescription>Manage your DeFi portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-black/40">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-400">Portfolio Value</p>
                      <h3 className="text-2xl font-bold">{formatCurrency(portfolioValue)}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-green-500 text-sm flex items-center">
                          <ArrowUpRight size={14} className="mr-1" />
                          {formatCurrency(portfolioChange)} ({portfolioChangePercent?.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                    <div className="bg-amber-500/20 p-2 rounded-full">
                      <Wallet size={20} className="text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-400">Staking Rewards</p>
                      <h3 className="text-2xl font-bold">{formatCurrency(1250.75)}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-green-500 text-sm flex items-center">
                          <ArrowUpRight size={14} className="mr-1" />
                          +37.5 GOLD this week
                        </span>
                      </div>
                    </div>
                    <div className="bg-amber-500/20 p-2 rounded-full">
                      <Coins size={20} className="text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-400">Total APR</p>
                      <h3 className="text-2xl font-bold">21.4%</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-green-500 text-sm flex items-center">
                          <ArrowUpRight size={14} className="mr-1" />
                          +2.1% from last week
                        </span>
                      </div>
                    </div>
                    <div className="bg-amber-500/20 p-2 rounded-full">
                      <TrendingUp size={20} className="text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Token Balances</h3>
              <div className="space-y-3">
                {tokenBalances.map((token) => (
                  <Card key={token.name} className="bg-black/40">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                            <span className="font-bold text-amber-500">{token.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium">{token.name}</p>
                            <p className="text-sm text-gray-400">
                              {token.amount ? `${token.amount} ${token.name}` : `0 ${token.name}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(token.value)}</p>
                          <p
                            className={`text-sm ${token.change > 0 ? "text-green-500" : token.change < 0 ? "text-red-500" : "text-gray-400"}`}
                          >
                            {token.change > 0 ? "+" : token.change < 0 ? "-" : ""}
                            {Math.abs(token.change || 0)}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="positions">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Staking Positions</h3>
              <div className="space-y-3">
                {stakingPositions.map((position, index) => (
                  <Card key={index} className="bg-black/40">
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-3">
                        <div className="flex justify-between">
                          <p className="font-medium">{position.pool}</p>
                          <p className="text-amber-500">{position.apr} APR</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-sm text-gray-400">Staked</p>
                            <p className="font-medium">{position.staked}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400">Rewards</p>
                            <p className="font-medium">{position.rewards}</p>
                          </div>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-800">
                          <button className="text-sm text-amber-500 hover:text-amber-400">Claim Rewards</button>
                          <button className="text-sm text-amber-500 hover:text-amber-400">Unstake</button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Liquidity Positions</h3>
              <Card className="bg-black/40">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-400">No active liquidity positions</p>
                  <button className="mt-3 text-sm text-amber-500 hover:text-amber-400">Add Liquidity</button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <div>
              <h3 className="text-lg font-medium mb-3">Recent Transactions</h3>
              <div className="space-y-3">
                {recentTransactions.map((tx, index) => (
                  <Card key={index} className="bg-black/40">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <div
                              className={`w-8 h-8 rounded-full ${
                                tx.type === "Swap"
                                  ? "bg-blue-500/20"
                                  : tx.type === "Stake"
                                    ? "bg-green-500/20"
                                    : "bg-purple-500/20"
                              } flex items-center justify-center mr-3`}
                            >
                              <span
                                className={`text-sm ${
                                  tx.type === "Swap"
                                    ? "text-blue-500"
                                    : tx.type === "Stake"
                                      ? "text-green-500"
                                      : "text-purple-500"
                                }`}
                              >
                                {tx.type.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{tx.type}</p>
                              <p className="text-sm text-gray-400">{tx.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{tx.amount}</p>
                          <p className="text-sm text-gray-400">{tx.time}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
