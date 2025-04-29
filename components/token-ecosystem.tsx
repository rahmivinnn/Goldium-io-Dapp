"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Globe,
  ShoppingBag,
  Sword,
  Zap,
  Shield,
  TrendingUp,
  BarChart3,
  Wallet,
  Coins,
  Users,
  Gift,
  Award,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TokenEcosystem() {
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  const handleAction = (action: string) => {
    toast({
      title: "Action Initiated",
      description: `${action} functionality will be available soon!`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-400">GOLD Token Ecosystem</h1>
          <p className="text-gray-400">Explore the complete GOLD token ecosystem and utilities</p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-amber-400 data-[state=active]:text-black">
            <Globe className="mr-2 h-5 w-5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="utilities" className="data-[state=active]:bg-amber-400 data-[state=active]:text-black">
            <Zap className="mr-2 h-5 w-5" />
            Utilities
          </TabsTrigger>
          <TabsTrigger value="tokenomics" className="data-[state=active]:bg-amber-400 data-[state=active]:text-black">
            <BarChart3 className="mr-2 h-5 w-5" />
            Tokenomics
          </TabsTrigger>
          <TabsTrigger value="governance" className="data-[state=active]:bg-amber-400 data-[state=active]:text-black">
            <Shield className="mr-2 h-5 w-5" />
            Governance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <Card className="border-amber-400 bg-black mb-8">
            <CardHeader>
              <CardTitle>GOLD Token Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-amber-400">What is GOLD Token?</h3>
                  <p className="text-gray-300 mb-4">
                    GOLD is the native utility token that powers the entire Goldium.io ecosystem. It serves multiple
                    functions across our platform, including gaming, NFT marketplace, staking, and governance.
                  </p>
                  <p className="text-gray-300 mb-4">
                    As a deflationary token with a fixed supply, GOLD is designed to increase in value over time as the
                    ecosystem grows and token utility expands.
                  </p>
                  <div className="space-y-2 mt-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Current Price</span>
                      <span className="font-bold text-amber-400">$0.85</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Market Cap</span>
                      <span className="font-bold">$4.25M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Circulating Supply</span>
                      <span className="font-bold">5M GOLD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Supply</span>
                      <span className="font-bold">10M GOLD</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 text-amber-400">Key Features</h3>
                  <ul className="space-y-4">
                    <li className="flex">
                      <div className="mr-4 bg-amber-400/10 p-2 rounded-full">
                        <Wallet className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-bold">Store of Value</h4>
                        <p className="text-gray-400">Hold GOLD as a digital asset with deflationary mechanics</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="mr-4 bg-amber-400/10 p-2 rounded-full">
                        <ShoppingBag className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-bold">NFT Marketplace Currency</h4>
                        <p className="text-gray-400">Buy, sell and trade NFTs using GOLD tokens</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="mr-4 bg-amber-400/10 p-2 rounded-full">
                        <Sword className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-bold">Gaming Rewards</h4>
                        <p className="text-gray-400">Earn GOLD by playing games and participating in tournaments</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="mr-4 bg-amber-400/10 p-2 rounded-full">
                        <Shield className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-bold">Governance</h4>
                        <p className="text-gray-400">Vote on platform decisions and future development</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-amber-400 bg-black">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp className="h-10 w-10 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Staking</h3>
                <p className="text-gray-400 text-center mb-4">
                  Earn passive income by staking your GOLD tokens with competitive APR rates
                </p>
                <Button
                  className="bg-amber-400 hover:bg-amber-500 text-black w-full"
                  onClick={() => handleAction("Staking")}
                >
                  Stake GOLD
                </Button>
              </CardContent>
            </Card>

            <Card className="border-amber-400 bg-black">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-4">
                  <ShoppingBag className="h-10 w-10 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">NFT Marketplace</h3>
                <p className="text-gray-400 text-center mb-4">
                  Buy, sell and trade unique digital collectibles using GOLD tokens
                </p>
                <Button
                  className="bg-amber-400 hover:bg-amber-500 text-black w-full"
                  onClick={() => handleAction("NFT Marketplace")}
                >
                  Explore NFTs
                </Button>
              </CardContent>
            </Card>

            <Card className="border-amber-400 bg-black">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-4">
                  <Sword className="h-10 w-10 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Gaming</h3>
                <p className="text-gray-400 text-center mb-4">
                  Play games and earn GOLD tokens through tournaments and competitions
                </p>
                <Button
                  className="bg-amber-400 hover:bg-amber-500 text-black w-full"
                  onClick={() => handleAction("Gaming")}
                >
                  Play Games
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="utilities" className="mt-0">
          <Card className="border-amber-400 bg-black mb-8">
            <CardHeader>
              <CardTitle>GOLD Token Utilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-amber-400">Platform Utilities</h3>
                  <ul className="space-y-6">
                    <li className="flex">
                      <div className="mr-4 bg-amber-400/10 p-2 rounded-full">
                        <ShoppingBag className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-bold">Marketplace Transactions</h4>
                        <p className="text-gray-400">Use GOLD to purchase NFTs and in-game items with reduced fees</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="mr-4 bg-amber-400/10 p-2 rounded-full">
                        <Sword className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-bold">Game Entry Fees</h4>
                        <p className="text-gray-400">Pay tournament entry fees and access premium gaming features</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="mr-4 bg-amber-400/10 p-2 rounded-full">
                        <Gift className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-bold">Reward Distribution</h4>
                        <p className="text-gray-400">
                          Earn GOLD tokens through gameplay, staking, and community activities
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 text-amber-400">Economic Utilities</h3>
                  <ul className="space-y-6">
                    <li className="flex">
                      <div className="mr-4 bg-amber-400/10 p-2 rounded-full">
                        <TrendingUp className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-bold">Staking Rewards</h4>
                        <p className="text-gray-400">Earn passive income by staking GOLD in various pools</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="mr-4 bg-amber-400/10 p-2 rounded-full">
                        <Shield className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-bold">Governance Rights</h4>
                        <p className="text-gray-400">Vote on platform decisions proportional to your GOLD holdings</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="mr-4 bg-amber-400/10 p-2 rounded-full">
                        <Award className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-bold">Premium Membership</h4>
                        <p className="text-gray-400">Access VIP features and benefits by holding GOLD tokens</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-amber-400">Utility Tiers</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-gray-700 bg-black/50">
                    <CardContent className="pt-6">
                      <h4 className="text-lg font-bold text-center mb-2">Basic Holder</h4>
                      <p className="text-center text-amber-400 font-bold mb-4">100-999 GOLD</p>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <div className="w-5 h-5 mr-2 text-green-500">✓</div>
                          <span className="text-gray-300">Marketplace access</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-5 h-5 mr-2 text-green-500">✓</div>
                          <span className="text-gray-300">Basic staking (5% APR)</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-5 h-5 mr-2 text-green-500">✓</div>
                          <span className="text-gray-300">Standard game access</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-amber-400 bg-black/50">
                    <CardContent className="pt-6">
                      <h4 className="text-lg font-bold text-center mb-2">Gold Member</h4>
                      <p className="text-center text-amber-400 font-bold mb-4">1,000-9,999 GOLD</p>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <div className="w-5 h-5 mr-2 text-green-500">✓</div>
                          <span className="text-gray-300">All Basic benefits</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-5 h-5 mr-2 text-green-500">✓</div>
                          <span className="text-gray-300">Enhanced staking (8% APR)</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-5 h-5 mr-2 text-green-500">✓</div>
                          <span className="text-gray-300">Voting rights</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-5 h-5 mr-2 text-green-500">✓</div>
                          <span className="text-gray-300">50% off marketplace fees</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-amber-600 bg-black/50">
                    <CardContent className="pt-6">
                      <h4 className="text-lg font-bold text-center mb-2">Platinum Whale</h4>
                      <p className="text-center text-amber-400 font-bold mb-4">10,000+ GOLD</p>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <div className="w-5 h-5 mr-2 text-green-500">✓</div>
                          <span className="text-gray-300">All Gold benefits</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-5 h-5 mr-2 text-green-500">✓</div>
                          <span className="text-gray-300">Premium staking (12% APR)</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-5 h-5 mr-2 text-green-500">✓</div>
                          <span className="text-gray-300">Enhanced voting power</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-5 h-5 mr-2 text-green-500">✓</div>
                          <span className="text-gray-300">Zero marketplace fees</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-5 h-5 mr-2 text-green-500">✓</div>
                          <span className="text-gray-300">Exclusive NFT airdrops</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokenomics" className="mt-0">
          <Card className="border-amber-400 bg-black mb-8">
            <CardHeader>
              <CardTitle>GOLD Token Tokenomics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-amber-400">Token Distribution</h3>
                  <div className="bg-black/50 p-6 rounded-lg border border-amber-400/20">
                    <ul className="space-y-4">
                      <li className="flex justify-between">
                        <span className="text-gray-300">Public Sale</span>
                        <span className="font-bold text-amber-400">30%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-300">Team & Advisors</span>
                        <span className="font-bold text-amber-400">15%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-300">Ecosystem Development</span>
                        <span className="font-bold text-amber-400">20%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-300">Staking Rewards</span>
                        <span className="font-bold text-amber-400">15%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-300">Marketing</span>
                        <span className="font-bold text-amber-400">10%</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-300">Reserve</span>
                        <span className="font-bold text-amber-400">10%</span>
                      </li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-bold mt-8 mb-4 text-amber-400">Token Metrics</h3>
                  <div className="bg-black/50 p-6 rounded-lg border border-amber-400/20">
                    <ul className="space-y-4">
                      <li className="flex justify-between">
                        <span className="text-gray-300">Total Supply</span>
                        <span className="font-bold">10,000,000 GOLD</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-300">Initial Circulating Supply</span>
                        <span className="font-bold">3,000,000 GOLD</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-300">Initial Market Cap</span>
                        <span className="font-bold">$1,500,000</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-300">Initial Token Price</span>
                        <span className="font-bold">$0.50</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-amber-400">Tokenomic Mechanisms</h3>
                  <div className="space-y-6">
                    <div className="bg-black/50 p-6 rounded-lg border border-amber-400/20">
                      <div className="flex items-center mb-2">
                        <Coins className="h-6 w-6 text-amber-400 mr-2" />
                        <h4 className="font-bold">Deflationary Model</h4>
                      </div>
                      <p className="text-gray-300">
                        2% of all marketplace transactions are burned, permanently reducing the total supply and
                        creating deflationary pressure.
                      </p>
                    </div>

                    <div className="bg-black/50 p-6 rounded-lg border border-amber-400/20">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="h-6 w-6 text-amber-400 mr-2" />
                        <h4 className="font-bold">Staking Rewards</h4>
                      </div>
                      <p className="text-gray-300">
                        Staking rewards are generated from a combination of transaction fees and the allocated staking
                        pool, ensuring sustainable APR rates.
                      </p>
                    </div>

                    <div className="bg-black/50 p-6 rounded-lg border border-amber-400/20">
                      <div className="flex items-center mb-2">
                        <Shield className="h-6 w-6 text-amber-400 mr-2" />
                        <h4 className="font-bold">Token Vesting</h4>
                      </div>
                      <p className="text-gray-300">
                        Team and advisor tokens are subject to a 24-month vesting period with a 6-month cliff to ensure
                        long-term alignment of interests.
                      </p>
                    </div>

                    <div className="bg-black/50 p-6 rounded-lg border border-amber-400/20">
                      <div className="flex items-center mb-2">
                        <Users className="h-6 w-6 text-amber-400 mr-2" />
                        <h4 className="font-bold">Community Treasury</h4>
                      </div>
                      <p className="text-gray-300">
                        5% of all transaction fees go to the community treasury, which is governed by GOLD token holders
                        through voting.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="governance" className="mt-0">
          <Card className="border-amber-400 bg-black mb-8">
            <CardHeader>
              <CardTitle>GOLD Token Governance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-amber-400">Governance Overview</h3>
                  <p className="text-gray-300 mb-4">
                    GOLD token holders have the power to participate in the decision-making process of the Goldium.io
                    ecosystem through our decentralized governance system.
                  </p>
                  <p className="text-gray-300 mb-4">
                    By staking GOLD tokens, you gain voting rights proportional to your stake, allowing you to influence
                    platform development, feature prioritization, and treasury allocations.
                  </p>

                  <h3 className="text-xl font-bold mt-8 mb-4 text-amber-400">Voting Power</h3>
                  <div className="bg-black/50 p-6 rounded-lg border border-amber-400/20">
                    <ul className="space-y-4">
                      <li className="flex justify-between">
                        <span className="text-gray-300">Basic (100-999 GOLD)</span>
                        <span className="font-bold text-amber-400">1x Voting Power</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-300">Gold (1,000-9,999 GOLD)</span>
                        <span className="font-bold text-amber-400">1.5x Voting Power</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-300">Platinum (10,000+ GOLD)</span>
                        <span className="font-bold text-amber-400">2x Voting Power</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-amber-400">Governance Process</h3>
                  <div className="space-y-6">
                    <div className="bg-black/50 p-6 rounded-lg border border-amber-400/20">
                      <div className="flex items-center mb-2">
                        <div className="bg-amber-400 text-black rounded-full w-6 h-6 flex items-center justify-center mr-2 font-bold">
                          1
                        </div>
                        <h4 className="font-bold">Proposal Submission</h4>
                      </div>
                      <p className="text-gray-300">
                        Any holder of 1,000+ GOLD tokens can submit a governance proposal for consideration by the
                        community.
                      </p>
                    </div>

                    <div className="bg-black/50 p-6 rounded-lg border border-amber-400/20">
                      <div className="flex items-center mb-2">
                        <div className="bg-amber-400 text-black rounded-full w-6 h-6 flex items-center justify-center mr-2 font-bold">
                          2
                        </div>
                        <h4 className="font-bold">Discussion Period</h4>
                      </div>
                      <p className="text-gray-300">
                        A 7-day discussion period allows the community to debate the proposal and suggest amendments.
                      </p>
                    </div>

                    <div className="bg-black/50 p-6 rounded-lg border border-amber-400/20">
                      <div className="flex items-center mb-2">
                        <div className="bg-amber-400 text-black rounded-full w-6 h-6 flex items-center justify-center mr-2 font-bold">
                          3
                        </div>
                        <h4 className="font-bold">Voting Period</h4>
                      </div>
                      <p className="text-gray-300">
                        After the discussion period, a 5-day voting period begins where token holders can cast their
                        votes.
                      </p>
                    </div>

                    <div className="bg-black/50 p-6 rounded-lg border border-amber-400/20">
                      <div className="flex items-center mb-2">
                        <div className="bg-amber-400 text-black rounded-full w-6 h-6 flex items-center justify-center mr-2 font-bold">
                          4
                        </div>
                        <h4 className="font-bold">Implementation</h4>
                      </div>
                      <p className="text-gray-300">
                        If approved by a majority vote (>50%), the proposal is implemented by the development team.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-amber-400">Active Proposals</h3>
                <div className="space-y-4">
                  <Card className="border-amber-400/50 bg-black/30">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold">GIP-001: Increase Staking Rewards</h4>
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
                          Voting Active
                        </span>
                      </div>
                      <p className="text-gray-400 mb-4">
                        Proposal to increase the staking rewards by 2% across all tiers to incentivize long-term
                        holding.
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Votes For: 65%</span>
                        <span className="text-gray-400">Votes Against: 35%</span>
                        <span className="text-gray-400">Ends in: 3 days</span>
                      </div>
                      <Button
                        className="w-full mt-4 bg-amber-400 hover:bg-amber-500 text-black"
                        onClick={() => handleAction("Vote")}
                      >
                        Cast Your Vote
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-amber-400/50 bg-black/30">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold">GIP-002: New NFT Collection Launch</h4>
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs">Discussion</span>
                      </div>
                      <p className="text-gray-400 mb-4">
                        Proposal to launch a new limited edition NFT collection with exclusive benefits for GOLD
                        holders.
                      </p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Discussion participants: 124</span>
                        <span className="text-gray-400">Comments: 37</span>
                        <span className="text-gray-400">Voting starts: 2 days</span>
                      </div>
                      <Button
                        className="w-full mt-4 bg-amber-400 hover:bg-amber-500 text-black"
                        onClick={() => handleAction("Join Discussion")}
                      >
                        Join Discussion
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <Button
                  className="bg-amber-400 hover:bg-amber-500 text-black px-8"
                  onClick={() => handleAction("Create Proposal")}
                >
                  Create New Proposal
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
