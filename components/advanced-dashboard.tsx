"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Wallet,
  Clock,
  Gift,
  Bell,
  Users,
  Sword,
  Coins,
  TrendingUp,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  PieChart,
  Trophy,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import TransactionHistory from "@/components/transaction-history"
import NFTGalleryPreview from "@/components/nft-gallery-preview"
import GameHistoryPreview from "@/components/game-history-preview"
import DailyRewardCard from "@/components/daily-reward-card"
import NotificationCenter from "@/components/notification-center"

export default function AdvancedDashboard() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [portfolioValue, setPortfolioValue] = useState(0)
  const [portfolioChange, setPortfolioChange] = useState(0)
  const [stakingStats, setStakingStats] = useState({
    totalStaked: 0,
    rewards: 0,
    apr: 0,
  })
  const [nftStats, setNftStats] = useState({
    owned: 0,
    value: 0,
    rarest: "",
  })
  const [gameStats, setGameStats] = useState({
    played: 0,
    won: 0,
    earnings: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false)
      setPortfolioValue(3250)
      setPortfolioChange(12.5)
      setStakingStats({
        totalStaked: 1250,
        rewards: 24.6,
        apr: 8.2,
      })
      setNftStats({
        owned: 12,
        value: 4500,
        rarest: "Legendary",
      })
      setGameStats({
        played: 137,
        won: 85,
        earnings: 1250,
      })
      setRecentActivity([
        { type: "stake", amount: 500, time: "2h ago" },
        { type: "game_win", amount: 120, time: "5h ago" },
        { type: "nft_buy", item: "Dragon's Breath Sword", amount: 1250, time: "1d ago" },
        { type: "reward", amount: 50, time: "1d ago" },
      ])
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const claimStakingRewards = () => {
    toast({
      title: "Rewards Claimed",
      description: `Successfully claimed ${stakingStats.rewards} GOLD`,
    })

    // In a real implementation, this would call a blockchain transaction
    setStakingStats((prev) => ({
      ...prev,
      rewards: 0,
    }))
  }

  const handleDailyBonus = () => {
    toast({
      title: "Daily Bonus",
      description: "Redirecting to daily bonus page...",
    })

    // In a real implementation, this would navigate to the daily bonus page
    // or open a modal with the daily bonus
    console.log("Navigate to daily bonus")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 mt-32">
        <div>
          <h1 className="text-3xl font-bold text-gold-500">Advanced Dashboard</h1>
          <p className="text-gray-400">Complete overview of your GOLD ecosystem activities</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" className="border-gold-500 text-gold-500 hover:bg-gold-500/10">
            <Bell className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
            <span className="notification-badge">5</span>
          </Button>
          <Button className="bg-gold-500 hover:bg-gold-600 text-black" onClick={handleDailyBonus}>
            <Gift className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Daily Bonus</span>
          </Button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <Card className="border-gold-500 bg-black mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Wallet className="mr-2 h-5 w-5 text-gold-500" />
            Portfolio Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full bg-gold-500/10" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Total Portfolio Value</div>
                <div className="text-3xl font-bold text-gold-500">{portfolioValue} GOLD</div>
                <div
                  className={`text-sm flex items-center ${portfolioChange >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {portfolioChange >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(portfolioChange)}% {portfolioChange >= 0 ? "increase" : "decrease"} this week
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-400">Staking</div>
                <div className="text-2xl font-bold text-gold-500">{stakingStats.totalStaked} GOLD</div>
                <div className="text-sm flex items-center text-green-500">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stakingStats.apr}% APR
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-400">NFT Collection</div>
                <div className="text-2xl font-bold text-gold-500">{nftStats.owned} NFTs</div>
                <div className="text-sm flex items-center">Est. Value: {nftStats.value} GOLD</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-400">Gaming Earnings</div>
                <div className="text-2xl font-bold text-gold-500">{gameStats.earnings} GOLD</div>
                <div className="text-sm flex items-center">
                  Win Rate: {Math.round((gameStats.won / gameStats.played) * 100)}%
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
            <Layers className="mr-2 h-5 w-5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="staking" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
            <Coins className="mr-2 h-5 w-5" />
            Staking
          </TabsTrigger>
          <TabsTrigger value="nfts" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
            <Shield className="mr-2 h-5 w-5" />
            NFTs
          </TabsTrigger>
          <TabsTrigger value="games" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
            <Sword className="mr-2 h-5 w-5" />
            Games
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
            <PieChart className="mr-2 h-5 w-5" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-gold-500 bg-black h-full">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full bg-gold-500/10" />
                      ))}
                    </div>
                  ) : (
                    <Tabs defaultValue="transactions">
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger
                          value="transactions"
                          className="data-[state=active]:bg-gold-500 data-[state=active]:text-black"
                        >
                          Transactions
                        </TabsTrigger>
                        <TabsTrigger
                          value="games"
                          className="data-[state=active]:bg-gold-500 data-[state=active]:text-black"
                        >
                          Games
                        </TabsTrigger>
                        <TabsTrigger
                          value="nfts"
                          className="data-[state=active]:bg-gold-500 data-[state=active]:text-black"
                        >
                          NFTs
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="transactions" className="mt-0">
                        <TransactionHistory />
                      </TabsContent>

                      <TabsContent value="games" className="mt-0">
                        <GameHistoryPreview />
                      </TabsContent>

                      <TabsContent value="nfts" className="mt-0">
                        <NFTGalleryPreview />
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="grid grid-cols-1 gap-6">
                <DailyRewardCard loading={loading} />

                <Card className="border-gold-500 bg-black">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Coins className="mr-2 h-5 w-5 text-gold-500" />
                      Staking Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-16 w-full bg-gold-500/10" />
                    ) : (
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Total Staked</span>
                          <span className="font-bold text-gold-500">{stakingStats.totalStaked} GOLD</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Current APR</span>
                          <span className="font-bold text-green-500">{stakingStats.apr}%</span>
                        </div>
                        <div className="flex justify-between mb-4">
                          <span className="text-gray-400">Rewards Available</span>
                          <span className="font-bold text-gold-500">{stakingStats.rewards} GOLD</span>
                        </div>
                        <Button
                          className="w-full bg-gold-500 hover:bg-gold-600 text-black"
                          disabled={stakingStats.rewards === 0}
                          onClick={claimStakingRewards}
                        >
                          {stakingStats.rewards > 0 ? "Claim Rewards" : "No Rewards Available"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-gold-500 bg-black">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-gold-500" />
                      Next Event
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <Skeleton className="h-16 w-full bg-gold-500/10" />
                    ) : (
                      <div>
                        <h3 className="font-bold mb-1">Mystery Box Drop</h3>
                        <p className="text-sm text-gray-400 mb-3">Limited edition items with 2x GOLD rewards</p>
                        <div className="countdown-timer mb-4">
                          <div className="countdown-item">
                            <span className="countdown-value">12</span>
                            <span className="countdown-label">Hours</span>
                          </div>
                          <div className="countdown-item">
                            <span className="countdown-value">45</span>
                            <span className="countdown-label">Mins</span>
                          </div>
                          <div className="countdown-item">
                            <span className="countdown-value">22</span>
                            <span className="countdown-label">Secs</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full border-gold-500 text-gold-500 hover:bg-gold-500/10"
                          onClick={() => {
                            toast({
                              title: "Reminder Set",
                              description: "You'll be notified when the event starts",
                            })
                          }}
                        >
                          Set Reminder
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="staking" className="mt-0">
          <Card className="border-gold-500 bg-black">
            <CardHeader>
              <CardTitle>Staking Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="black-gold-card">
                  <h3 className="text-xl font-bold mb-4">Active Stakes</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Flexible</span>
                      <span className="font-bold text-gold-500">250 GOLD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">30-Day Lock</span>
                      <span className="font-bold text-gold-500">500 GOLD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">90-Day Lock</span>
                      <span className="font-bold text-gold-500">500 GOLD</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gold-500/20">
                      <span className="text-gray-400">Total Staked</span>
                      <span className="font-bold text-gold-500">1,250 GOLD</span>
                    </div>
                  </div>
                </div>

                <div className="black-gold-card">
                  <h3 className="text-xl font-bold mb-4">Rewards</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pending Rewards</span>
                      <span className="font-bold text-green-500">24.6 GOLD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Next Distribution</span>
                      <span>12h 45m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Earned</span>
                      <span className="font-bold text-gold-500">156.8 GOLD</span>
                    </div>
                    <Button
                      className="w-full bg-gold-500 hover:bg-gold-600 text-black mt-2"
                      onClick={claimStakingRewards}
                    >
                      Claim All Rewards
                    </Button>
                  </div>
                </div>

                <div className="black-gold-card">
                  <h3 className="text-xl font-bold mb-4">Staking Options</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Flexible</span>
                      <span className="font-bold text-green-500">4.5% APR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">30-Day Lock</span>
                      <span className="font-bold text-green-500">8.2% APR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">90-Day Lock</span>
                      <span className="font-bold text-green-500">12.5% APR</span>
                    </div>
                    <Button
                      className="w-full bg-gold-500 hover:bg-gold-600 text-black mt-2"
                      onClick={() => {
                        toast({
                          title: "Staking",
                          description: "Opening staking modal...",
                        })
                      }}
                    >
                      Stake More GOLD
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Staking History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold-500/30">
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-left">Amount</th>
                        <th className="px-4 py-3 text-left">Plan</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gold-500/10 hover:bg-gold-500/5">
                        <td className="px-4 py-3">Stake</td>
                        <td className="px-4 py-3 font-bold text-gold-500">500 GOLD</td>
                        <td className="px-4 py-3">90-Day Lock</td>
                        <td className="px-4 py-3">Apr 15, 2025</td>
                        <td className="px-4 py-3 text-right text-blue-500">Locked</td>
                      </tr>
                      <tr className="border-b border-gold-500/10 hover:bg-gold-500/5">
                        <td className="px-4 py-3">Stake</td>
                        <td className="px-4 py-3 font-bold text-gold-500">250 GOLD</td>
                        <td className="px-4 py-3">Flexible</td>
                        <td className="px-4 py-3">Apr 10, 2025</td>
                        <td className="px-4 py-3 text-right text-green-500">Active</td>
                      </tr>
                      <tr className="border-b border-gold-500/10 hover:bg-gold-500/5">
                        <td className="px-4 py-3">Claim</td>
                        <td className="px-4 py-3 font-bold text-green-500">18.5 GOLD</td>
                        <td className="px-4 py-3">Rewards</td>
                        <td className="px-4 py-3">Apr 5, 2025</td>
                        <td className="px-4 py-3 text-right text-gray-400">Completed</td>
                      </tr>
                      <tr className="border-b border-gold-500/10 hover:bg-gold-500/5">
                        <td className="px-4 py-3">Unstake</td>
                        <td className="px-4 py-3 font-bold text-orange-500">100 GOLD</td>
                        <td className="px-4 py-3">Flexible</td>
                        <td className="px-4 py-3">Apr 1, 2025</td>
                        <td className="px-4 py-3 text-right text-gray-400">Completed</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nfts" className="mt-0">
          <Card className="border-gold-500 bg-black">
            <CardHeader>
              <CardTitle>NFT Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="black-gold-card">
                  <h3 className="text-xl font-bold mb-4">Collection Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total NFTs</span>
                      <span className="font-bold text-gold-500">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estimated Value</span>
                      <span className="font-bold text-gold-500">4,500 GOLD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rarest Item</span>
                      <span className="font-bold text-purple-500">Legendary</span>
                    </div>
                  </div>
                </div>

                <div className="black-gold-card">
                  <h3 className="text-xl font-bold mb-4">Rarity Breakdown</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Common</span>
                      <span>3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Uncommon</span>
                      <span>4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rare</span>
                      <span>2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Epic</span>
                      <span>2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Legendary</span>
                      <span className="font-bold text-gold-500">1</span>
                    </div>
                  </div>
                </div>

                <div className="black-gold-card">
                  <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Purchased</span>
                      <span>2 NFTs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sold</span>
                      <span>1 NFT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Profit/Loss</span>
                      <span className="font-bold text-green-500">+250 GOLD</span>
                    </div>
                  </div>
                </div>

                <div className="black-gold-card">
                  <h3 className="text-xl font-bold mb-4">Marketplace</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Floor Price</span>
                      <span className="font-bold text-gold-500">120 GOLD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Volume (24h)</span>
                      <span>5,280 GOLD</span>
                    </div>
                    <Button className="gold-button w-full mt-2">Browse Marketplace</Button>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Your NFT Collection</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="border border-gold-500/30 rounded-lg p-2 hover:border-gold-500 transition-colors"
                    >
                      <div className="relative aspect-square mb-2 bg-black/50">
                        <div
                          className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                            i === 0
                              ? "bg-gold-500"
                              : i < 3
                                ? "bg-purple-500"
                                : i < 5
                                  ? "bg-blue-500"
                                  : i < 9
                                    ? "bg-green-500"
                                    : "bg-gray-500"
                          }`}
                        ></div>
                      </div>
                      <div className="truncate text-sm">NFT #{i + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="games" className="mt-0">
          <Card className="border-gold-500 bg-black">
            <CardHeader>
              <CardTitle>Gaming Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="black-gold-card">
                  <div className="flex items-center justify-center mb-4">
                    <Trophy className="h-10 w-10 text-gold-500" />
                  </div>
                  <h3 className="text-lg font-bold text-center mb-1">Your Rank</h3>
                  <div className="text-center text-2xl font-bold text-gold-500 mb-2">#42</div>
                  <p className="text-center text-sm text-gray-400">Top 15% of players</p>
                </div>

                <div className="black-gold-card">
                  <div className="flex items-center justify-center mb-4">
                    <Coins className="h-10 w-10 text-gold-500" />
                  </div>
                  <h3 className="text-lg font-bold text-center mb-1">Total Winnings</h3>
                  <div className="text-center text-2xl font-bold text-gold-500 mb-2">1,250 GOLD</div>
                  <p className="text-center text-sm text-gray-400">Across all games</p>
                </div>

                <div className="black-gold-card">
                  <div className="flex items-center justify-center mb-4">
                    <Sword className="h-10 w-10 text-gold-500" />
                  </div>
                  <h3 className="text-lg font-bold text-center mb-1">Win Rate</h3>
                  <div className="text-center text-2xl font-bold text-gold-500 mb-2">62%</div>
                  <p className="text-center text-sm text-gray-400">85 wins / 137 games</p>
                </div>

                <div className="black-gold-card">
                  <div className="flex items-center justify-center mb-4">
                    <Users className="h-10 w-10 text-gold-500" />
                  </div>
                  <h3 className="text-lg font-bold text-center mb-1">Online Players</h3>
                  <div className="text-center text-2xl font-bold text-gold-500 mb-2">156</div>
                  <p className="text-center text-sm text-gray-400">24 in matchmaking</p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Game History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold-500/30">
                        <th className="px-4 py-3 text-left">Game</th>
                        <th className="px-4 py-3 text-left">Result</th>
                        <th className="px-4 py-3 text-left">Opponent</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-right">Reward/Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gold-500/10 hover:bg-gold-500/5">
                        <td className="px-4 py-3">Card Battle</td>
                        <td className="px-4 py-3 text-green-500">Victory</td>
                        <td className="px-4 py-3">CryptoWizard</td>
                        <td className="px-4 py-3">Apr 29, 2025</td>
                        <td className="px-4 py-3 text-right font-bold text-green-500">+120 GOLD</td>
                      </tr>
                      <tr className="border-b border-gold-500/10 hover:bg-gold-500/5">
                        <td className="px-4 py-3">Coin Flip</td>
                        <td className="px-4 py-3 text-green-500">Victory</td>
                        <td className="px-4 py-3">-</td>
                        <td className="px-4 py-3">Apr 28, 2025</td>
                        <td className="px-4 py-3 text-right font-bold text-green-500">+100 GOLD</td>
                      </tr>
                      <tr className="border-b border-gold-500/10 hover:bg-gold-500/5">
                        <td className="px-4 py-3">Card Flip</td>
                        <td className="px-4 py-3 text-red-500">Defeat</td>
                        <td className="px-4 py-3">-</td>
                        <td className="px-4 py-3">Apr 28, 2025</td>
                        <td className="px-4 py-3 text-right font-bold text-red-500">-25 GOLD</td>
                      </tr>
                      <tr className="border-b border-gold-500/10 hover:bg-gold-500/5">
                        <td className="px-4 py-3">Card Battle</td>
                        <td className="px-4 py-3 text-green-500">Victory</td>
                        <td className="px-4 py-3">TokenMaster</td>
                        <td className="px-4 py-3">Apr 27, 2025</td>
                        <td className="px-4 py-3 text-right font-bold text-green-500">+85 GOLD</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Available Games</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="black-gold-card hover:gold-glow transition-all duration-300">
                    <h3 className="text-xl font-bold mb-2">Card Battle</h3>
                    <p className="text-gray-400 mb-4">Strategic card battle game with deck building</p>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Entry Fee</span>
                      <span>50 GOLD</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-400">Potential Win</span>
                      <span className="text-green-500">Up to 100 GOLD</span>
                    </div>
                    <Button className="gold-button w-full">Play Now</Button>
                  </div>

                  <div className="black-gold-card hover:gold-glow transition-all duration-300">
                    <h3 className="text-xl font-bold mb-2">Coin Flip</h3>
                    <p className="text-gray-400 mb-4">Simple yet exciting game of chance</p>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Min Bet</span>
                      <span>10 GOLD</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-400">Multiplier</span>
                      <span className="text-green-500">2x</span>
                    </div>
                    <Button className="gold-button w-full">Play Now</Button>
                  </div>

                  <div className="black-gold-card hover:gold-glow transition-all duration-300">
                    <h3 className="text-xl font-bold mb-2">Card Flip</h3>
                    <p className="text-gray-400 mb-4">Test your memory by matching pairs of cards</p>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Entry Fee</span>
                      <span>25 GOLD</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-400">Potential Win</span>
                      <span className="text-green-500">Up to 75 GOLD</span>
                    </div>
                    <Button className="gold-button w-full">Play Now</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          <Card className="border-gold-500 bg-black">
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="black-gold-card">
                  <h3 className="text-xl font-bold mb-4">Portfolio Distribution</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-gray-400">[Portfolio Distribution Chart]</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gold-500 mr-2"></div>
                      <span>Staking (38%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span>NFTs (28%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Liquid (22%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span>Gaming (12%)</span>
                    </div>
                  </div>
                </div>

                <div className="black-gold-card">
                  <h3 className="text-xl font-bold mb-4">GOLD Price History</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center text-gray-400">[GOLD Price Chart]</div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <div>
                      <div className="text-sm text-gray-400">Current Price</div>
                      <div className="font-bold text-gold-500">$0.85</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">24h Change</div>
                      <div className="font-bold text-green-500">+5.2%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">7d Change</div>
                      <div className="font-bold text-green-500">+12.5%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Market Cap</div>
                      <div className="font-bold">$4.25M</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="black-gold-card">
                  <h3 className="text-xl font-bold mb-4">Staking Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Staked</span>
                      <span className="font-bold text-gold-500">1,250 GOLD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Rewards</span>
                      <span className="font-bold text-green-500">156.8 GOLD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">ROI</span>
                      <span className="font-bold text-green-500">12.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Projected Annual</span>
                      <span className="font-bold text-green-500">~320 GOLD</span>
                    </div>
                  </div>
                </div>

                <div className="black-gold-card">
                  <h3 className="text-xl font-bold mb-4">NFT Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Value</span>
                      <span className="font-bold text-gold-500">4,500 GOLD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Purchased For</span>
                      <span className="font-bold">4,250 GOLD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Unrealized Gain</span>
                      <span className="font-bold text-green-500">+250 GOLD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">ROI</span>
                      <span className="font-bold text-green-500">+5.9%</span>
                    </div>
                  </div>
                </div>

                <div className="black-gold-card">
                  <h3 className="text-xl font-bold mb-4">Gaming Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Games Played</span>
                      <span className="font-bold">137</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Win Rate</span>
                      <span className="font-bold text-green-500">62%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Wagered</span>
                      <span className="font-bold">2,850 GOLD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Net Profit</span>
                      <span className="font-bold text-green-500">+1,250 GOLD</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Transaction Analytics</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold-500/30">
                        <th className="px-4 py-3 text-left">Category</th>
                        <th className="px-4 py-3 text-left">Count</th>
                        <th className="px-4 py-3 text-left">Volume</th>
                        <th className="px-4 py-3 text-left">Average</th>
                        <th className="px-4 py-3 text-right">Net Flow</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gold-500/10 hover:bg-gold-500/5">
                        <td className="px-4 py-3">Staking</td>
                        <td className="px-4 py-3">12</td>
                        <td className="px-4 py-3">1,850 GOLD</td>
                        <td className="px-4 py-3">154.2 GOLD</td>
                        <td className="px-4 py-3 text-right font-bold text-green-500">+156.8 GOLD</td>
                      </tr>
                      <tr className="border-b border-gold-500/10 hover:bg-gold-500/5">
                        <td className="px-4 py-3">NFT Trading</td>
                        <td className="px-4 py-3">8</td>
                        <td className="px-4 py-3">4,750 GOLD</td>
                        <td className="px-4 py-3">593.8 GOLD</td>
                        <td className="px-4 py-3 text-right font-bold text-green-500">+250 GOLD</td>
                      </tr>
                      <tr className="border-b border-gold-500/10 hover:bg-gold-500/5">
                        <td className="px-4 py-3">Gaming</td>
                        <td className="px-4 py-3">137</td>
                        <td className="px-4 py-3">2,850 GOLD</td>
                        <td className="px-4 py-3">20.8 GOLD</td>
                        <td className="px-4 py-3 text-right font-bold text-green-500">+1,250 GOLD</td>
                      </tr>
                      <tr className="border-b border-gold-500/10 hover:bg-gold-500/5">
                        <td className="px-4 py-3">Transfers</td>
                        <td className="px-4 py-3">24</td>
                        <td className="px-4 py-3">3,200 GOLD</td>
                        <td className="px-4 py-3">133.3 GOLD</td>
                        <td className="px-4 py-3 text-right font-bold text-red-500">-850 GOLD</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <NotificationCenter />
    </div>
  )
}
