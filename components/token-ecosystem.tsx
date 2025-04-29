"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, ShoppingBag, Sword, Zap, Shield, TrendingUp, BarChart3, Wallet, Users, Lock } from "lucide-react"
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
          <h1 className="text-3xl font-bold text-gold">GOLD Token Ecosystem</h1>
          <p className="text-gray-400">Explore the complete GOLD token ecosystem and utilities</p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <Globe className="mr-2 h-5 w-5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="utilities" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <Zap className="mr-2 h-5 w-5" />
            Utilities
          </TabsTrigger>
          <TabsTrigger value="tokenomics" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <BarChart3 className="mr-2 h-5 w-5" />
            Tokenomics
          </TabsTrigger>
          <TabsTrigger value="governance" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <Shield className="mr-2 h-5 w-5" />
            Governance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <Card className="border-gold bg-black mb-8">
            <CardHeader>
              <CardTitle>GOLD Token Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gold">What is GOLD Token?</h3>
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
                      <span className="font-bold text-gold">$0.85</span>
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
                  <h3 className="text-xl font-bold mb-4 text-gold">Key Features</h3>
                  <ul className="space-y-4">
                    <li className="flex">
                      <div className="mr-4 bg-gold/10 p-2 rounded-full">
                        <Wallet className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-bold">Store of Value</h4>
                        <p className="text-gray-400">Hold GOLD as a digital asset with deflationary mechanics</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="mr-4 bg-gold/10 p-2 rounded-full">
                        <ShoppingBag className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-bold">NFT Marketplace Currency</h4>
                        <p className="text-gray-400">Buy, sell and trade NFTs using GOLD tokens</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="mr-4 bg-gold/10 p-2 rounded-full">
                        <Sword className="h-6 w-6 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-bold">Gaming Rewards</h4>
                        <p className="text-gray-400">Earn GOLD by playing games and participating in tournaments</p>
                      </div>
                    </li>
                    <li className="flex">
                      <div className="mr-4 bg-gold/10 p-2 rounded-full">
                        <Shield className="h-6 w-6 text-gold" />
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
            <Card className="border-gold bg-black">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp className="h-10 w-10 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Staking</h3>
                <p className="text-gray-400 text-center mb-4">
                  Earn passive income by staking your GOLD tokens with competitive APR rates
                </p>
                <Button className="gold-button w-full" onClick={() => handleAction("Staking")}>
                  Stake GOLD
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gold bg-black">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-4">
                  <ShoppingBag className="h-10 w-10 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">NFT Marketplace</h3>
                <p className="text-gray-400 text-center mb-4">
                  Buy, sell and trade unique fantasy-themed NFTs using GOLD tokens
                </p>
                <Button className="gold-button w-full" onClick={() => handleAction("Marketplace")}>
                  Browse NFTs
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gold bg-black">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-4">
                  <Sword className="h-10 w-10 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Gaming</h3>
                <p className="text-gray-400 text-center mb-4">Play games and tournaments to earn GOLD token rewards</p>
                <Button className="gold-button w-full" onClick={() => handleAction("Gaming")}>
                  Play Games
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="utilities" className="mt-0">
          <Card className="border-gold bg-black">
            <CardHeader>
              <CardTitle>GOLD Token Utilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gold">Platform Utilities</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="mr-4 bg-gold/10 p-2 rounded-full mt-1">
                        <ShoppingBag className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-bold">Marketplace Currency</h4>
                        <p className="text-gray-400 mb-2">
                          GOLD is the primary currency for buying and selling NFTs on the Goldium.io marketplace.
                        </p>
                        <p className="text-gray-400">
                          All transaction fees are paid in GOLD, with portions burned to reduce supply.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-4 bg-gold/10 p-2 rounded-full mt-1">
                        <Sword className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-bold">Game Economy</h4>
                        <p className="text-gray-400 mb-2">
                          Players use GOLD for entry fees, in-game purchases, and tournament registrations.
                        </p>
                        <p className="text-gray-400">Winning games and tournaments rewards players with GOLD tokens.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-4 bg-gold/10 p-2 rounded-full mt-1">
                        <TrendingUp className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-bold">Staking Rewards</h4>
                        <p className="text-gray-400 mb-2">
                          Stake GOLD to earn passive income with various locking periods.
                        </p>
                        <p className="text-gray-400">Higher amounts and longer lock periods earn greater APR.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gold">Additional Benefits</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="mr-4 bg-gold/10 p-2 rounded-full mt-1">
                        <Shield className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-bold">Governance Rights</h4>
                        <p className="text-gray-400 mb-2">
                          GOLD holders can vote on platform decisions and future development.
                        </p>
                        <p className="text-gray-400">Voting power is proportional to GOLD holdings.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-4 bg-gold/10 p-2 rounded-full mt-1">
                        <Users className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-bold">VIP Access</h4>
                        <p className="text-gray-400 mb-2">
                          Holding certain amounts of GOLD grants access to VIP areas and exclusive events.
                        </p>
                        <p className="text-gray-400">VIP holders get early access to new features and NFT drops.</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-4 bg-gold/10 p-2 rounded-full mt-1">
                        <Lock className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-bold">Fee Discounts</h4>
                        <p className="text-gray-400 mb-2">Holding GOLD reduces platform fees for various actions.</p>
                        <p className="text-gray-400">Higher holdings provide greater discounts.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-gold">Utility Tiers</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold/30">
                        <th className="px-4 py-3 text-left">Tier</th>
                        <th className="px-4 py-3 text-left">GOLD Required</th>
                        <th className="px-4 py-3 text-left">Fee Discount</th>
                        <th className="px-4 py-3 text-left">Staking Bonus</th>
                        <th className="px-4 py-3 text-left">Special Benefits</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gold/10 hover:bg-gold/5">
                        <td className="px-4 py-3">Bronze</td>
                        <td className="px-4 py-3">100 GOLD</td>
                        <td className="px-4 py-3">5%</td>
                        <td className="px-4 py-3">+0.5% APR</td>
                        <td className="px-4 py-3">Standard NFT drops</td>
                      </tr>
                      <tr className="border-b border-gold/10 hover:bg-gold/5">
                        <td className="px-4 py-3">Silver</td>
                        <td className="px-4 py-3">500 GOLD</td>
                        <td className="px-4 py-3">10%</td>
                        <td className="px-4 py-3">+1% APR</td>
                        <td className="px-4 py-3">Priority NFT drops</td>
                      </tr>
                      <tr className="border-b border-gold/10 hover:bg-gold/5">
                        <td className="px-4 py-3">Gold</td>
                        <td className="px-4 py-3">1,000 GOLD</td>
                        <td className="px-4 py-3">15%</td>
                        <td className="px-4 py-3">+2% APR</td>
                        <td className="px-4 py-3">Exclusive NFTs, VIP events</td>
                      </tr>
                      <tr className="border-b border-gold/10 hover:bg-gold/5">
                        <td className="px-4 py-3">Platinum</td>
                        <td className="px-4 py-3">5,000 GOLD</td>
                        <td className="px-4 py-3">25%</td>
                        <td className="px-4 py-3">+3% APR</td>
                        <td className="px-4 py-3">All benefits + Early access</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokenomics" className="mt-0">
          <Card className="border-gold bg-black">
            <CardHeader>
              <CardTitle>GOLD Token Tokenomics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gold">Token Distribution</h3>
                  <div className="h-64 flex items-center justify-center mb-4">
                    <div className="text-center text-gray-400">[Token Distribution Chart]</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-gold mr-2"></div>
                      <span>Community (40%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span>Team (15%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Reserve (20%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span>Ecosystem (25%)</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gold">Token Metrics</h3>
                  <ul className="space-y-4">
                    <li className="flex flex-col">
                      <div className="flex justify-between">
                        <span className="font-bold">Total Supply:</span>
                        <span>10,000,000 GOLD</span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        Fixed maximum supply, no additional tokens will be minted
                      </div>
                    </li>
                    <li className="flex flex-col">
                      <div className="flex justify-between">
                        <span className="font-bold">Circulating Supply:</span>
                        <span>5,000,000 GOLD</span>
                      </div>
                      <div className="text-gray-400 text-sm">50% of tokens currently in circulation</div>
                    </li>
                    <li className="flex flex-col">
                      <div className="flex justify-between">
                        <span className="font-bold">Initial Price:</span>
                        <span>$0.25 USD</span>
                      </div>
                      <div className="text-gray-400 text-sm">Token price at initial offering</div>
                    </li>
                    <li className="flex flex-col">
                      <div className="flex justify-between">
                        <span className="font-bold">Current Price:</span>
                        <span>$0.85 USD</span>
                      </div>
                      <div className="text-gray-400 text-sm">+240% increase since launch</div>
                    </li>
                    <li className="flex flex-col">
                      <div className="flex justify-between">
                        <span className="font-bold">Market Cap:</span>
                        <span>$4,250,000 USD</span>
                      </div>
                      <div className="text-gray-400 text-sm">Based on circulating supply</div>
                    </li>
                    <li className="flex flex-col">
                      <div className="flex justify-between">
                        <span className="font-bold">Fully Diluted Valuation:</span>
                        <span>$8,500,000 USD</span>
                      </div>
                      <div className="text-gray-400 text-sm">Based on total supply</div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-gold">Deflationary Mechanisms</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="black-gold-card">
                    <h4 className="text-lg font-bold mb-2">Transaction Burns</h4>
                    <p className="text-gray-400 mb-4">
                      2% of all marketplace transactions are automatically burned, permanently reducing the total
                      supply.
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Est. Monthly Burn:</span>
                      <span className="text-gold">~15,000 GOLD</span>
                    </div>
                  </div>

                  <div className="black-gold-card">
                    <h4 className="text-lg font-bold mb-2">Staking Incentives</h4>
                    <p className="text-gray-400 mb-4">
                      Staked tokens are locked from circulation, reducing effective supply and increasing scarcity.
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Currently Staked:</span>
                      <span className="text-gold">1.2M GOLD (24%)</span>
                    </div>
                  </div>

                  <div className="black-gold-card">
                    <h4 className="text-lg font-bold mb-2">Buy-back Program</h4>
                    <p className="text-gray-400 mb-4">
                      20% of platform revenue is used to buy back and burn GOLD tokens on a quarterly basis.
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Last Buyback:</span>
                      <span className="text-gold">50,000 GOLD</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-gold">Token Release Schedule</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gold/30">
                        <th className="px-4 py-3 text-left">Allocation</th>
                        <th className="px-4 py-3 text-left">Total Tokens</th>
                        <th className="px-4 py-3 text-left">Initial Unlock</th>
                        <th className="px-4 py-3 text-left">Vesting Period</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gold/10 hover:bg-gold/5">
                        <td className="px-4 py-3">Public Sale</td>
                        <td className="px-4 py-3">2,000,000 GOLD</td>
                        <td className="px-4 py-3">100%</td>
                        <td className="px-4 py-3">None</td>
                        <td className="px-4 py-3 text-green-500">Complete</td>
                      </tr>
                      <tr className="border-b border-gold/10 hover:bg-gold/5">
                        <td className="px-4 py-3">Team</td>
                        <td className="px-4 py-3">1,500,000 GOLD</td>
                        <td className="px-4 py-3">0%</td>
                        <td className="px-4 py-3">2 years (quarterly)</td>
                        <td className="px-4 py-3 text-blue-500">In Progress (50%)</td>
                      </tr>
                      <tr className="border-b border-gold/10 hover:bg-gold/5">
                        <td className="px-4 py-3">Ecosystem Growth</td>
                        <td className="px-4 py-3">2,500,000 GOLD</td>
                        <td className="px-4 py-3">20%</td>
                        <td className="px-4 py-3">3 years (quarterly)</td>
                        <td className="px-4 py-3 text-blue-500">In Progress (40%)</td>
                      </tr>
                      <tr className="border-b border-gold/10 hover:bg-gold/5">
                        <td className="px-4 py-3">Community Rewards</td>
                        <td className="px-4 py-3">2,000,000 GOLD</td>
                        <td className="px-4 py-3">10%</td>
                        <td className="px-4 py-3">4 years (monthly)</td>
                        <td className="px-4 py-3 text-blue-500">In Progress (35%)</td>
                      </tr>
                      <tr className="border-b border-gold/10 hover:bg-gold/5">
                        <td className="px-4 py-3">Reserve</td>
                        <td className="px-4 py-3">2,000,000 GOLD</td>
                        <td className="px-4 py-3">0%</td>
                        <td className="px-4 py-3">5 years (annual)</td>
                        <td className="px-4 py-3 text-blue-500">In Progress (20%)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="governance" className="mt-0">
          <Card className="border-gold bg-black">
            <CardHeader>
              <CardTitle>GOLD Token Governance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gold">Governance Overview</h3>
                  <p className="text-gray-300 mb-4">
                    GOLD token holders can participate in the governance of the Goldium.io ecosystem through a
                    decentralized voting system.
                  </p>
                  <p className="text-gray-300 mb-4">
                    Proposals can be submitted for various aspects of the platform, including feature development, token
                    economics, reward structures, and ecosystem growth initiatives.
                  </p>
                  <p className="text-gray-300 mb-4">
                    Voting power is proportional to the amount of GOLD tokens held or staked, with long-term stakers
                    receiving additional voting weight.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gold">Proposal Process</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center justify-center rounded-full bg-gold/10 text-gold w-6 h-6 mt-1 mr-3">
                        1
                      </div>
                      <div>
                        <h4 className="font-bold">Submission</h4>
                        <p className="text-gray-400">Holders with at least 10,000 GOLD can submit proposals</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center justify-center rounded-full bg-gold/10 text-gold w-6 h-6 mt-1 mr-3">
                        2
                      </div>
                      <div>
                        <h4 className="font-bold">Discussion</h4>
                        <p className="text-gray-400">7-day discussion period for community feedback</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center justify-center rounded-full bg-gold/10 text-gold w-6 h-6 mt-1 mr-3">
                        3
                      </div>
                      <div>
                        <h4 className="font-bold">Voting</h4>
                        <p className="text-gray-400">5-day voting period for all GOLD holders</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center justify-center rounded-full bg-gold/10 text-gold w-6 h-6 mt-1 mr-3">
                        4
                      </div>
                      <div>
                        <h4 className="font-bold">Implementation</h4>
                        <p className="text-gray-400">Successful proposals are implemented by the team</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4 text-gold">Active Proposals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="black-gold-card">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-bold">New Staking Rewards</h4>
                      <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded">Voting Active</span>
                    </div>
                    <p className="text-gray-400 mb-4">
                      Proposal to increase staking rewards by 2% for all tiers and add special NFT rewards for long-term
                      stakers.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>For:</span>
                        <span className="text-green-500">65%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Against:</span>
                        <span className="text-red-500">35%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Time Remaining:</span>
                        <span>2 days</span>
                      </div>
                    </div>
                    <Button className="gold-button w-full" onClick={() => handleAction("Vote")}>
                      Vote Now
                    </Button>
                  </div>

                  <div className="black-gold-card">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-bold">NFT Royalty Structure</h4>
                      <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded">Discussion</span>
                    </div>
                    <p className="text-gray-400 mb-4">
                      Proposal to update NFT royalty structure to provide better incentives for creators and collectors.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Comments:</span>
                        <span>24</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Sentiment:</span>
                        <span className="text-green-500">Positive</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Discussion Period:</span>
                        <span>5 days left</span>
                      </div>
                    </div>
                    <Button className="gold-button w-full" onClick={() => handleAction("Comment")}>
                      Join Discussion
                    </Button>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-4 text-gold">Past Governance Decisions</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gold/30">
                          <th className="px-4 py-3 text-left">Proposal</th>
                          <th className="px-4 py-3 text-left">Date</th>
                          <th className="px-4 py-3 text-left">Votes</th>
                          <th className="px-4 py-3 text-left">Result</th>
                          <th className="px-4 py-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gold/10 hover:bg-gold/5">
                          <td className="px-4 py-3">Burn Rate Increase</td>
                          <td className="px-4 py-3">Mar 15, 2025</td>
                          <td className="px-4 py-3">78% For</td>
                          <td className="px-4 py-3 text-green-500">Passed</td>
                          <td className="px-4 py-3">Implemented</td>
                        </tr>
                        <tr className="border-b border-gold/10 hover:bg-gold/5">
                          <td className="px-4 py-3">New Game Integration</td>
                          <td className="px-4 py-3">Feb 28, 2025</td>
                          <td className="px-4 py-3">92% For</td>
                          <td className="px-4 py-3 text-green-500">Passed</td>
                          <td className="px-4 py-3">In Development</td>
                        </tr>
                        <tr className="border-b border-gold/10 hover:bg-gold/5">
                          <td className="px-4 py-3">Token Bridge</td>
                          <td className="px-4 py-3">Jan 10, 2025</td>
                          <td className="px-4 py-3">45% For</td>
                          <td className="px-4 py-3 text-red-500">Failed</td>
                          <td className="px-4 py-3">Closed</td>
                        </tr>
                        <tr className="border-b border-gold/10 hover:bg-gold/5">
                          <td className="px-4 py-3">Staking Fee Reduction</td>
                          <td className="px-4 py-3">Dec 05, 2024</td>
                          <td className="px-4 py-3">82% For</td>
                          <td className="px-4 py-3 text-green-500">Passed</td>
                          <td className="px-4 py-3">Implemented</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
