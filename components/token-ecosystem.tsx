"use client"

import { useState } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowRight, Coins, TrendingUp, Shield, Users } from "lucide-react"
import { Card3D } from "@/components/ui/card-3d"

export default function TokenEcosystem() {
  const [activeTab, setActiveTab] = useState("tokenomics")

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gold-gradient">GOLD Token Ecosystem</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The GOLD token powers the entire Goldium ecosystem, providing utility across gaming, NFTs, and DeFi
            applications.
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="tokenomics" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
              <Coins className="mr-2 h-4 w-4" />
              Tokenomics
            </TabsTrigger>
            <TabsTrigger value="utility" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
              <Shield className="mr-2 h-4 w-4" />
              Utility
            </TabsTrigger>
            <TabsTrigger value="staking" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
              <TrendingUp className="mr-2 h-4 w-4" />
              Staking
            </TabsTrigger>
            <TabsTrigger value="governance" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
              <Users className="mr-2 h-4 w-4" />
              Governance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tokenomics">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card3D className="bg-slate-900/80 backdrop-blur-sm col-span-1 md:col-span-1">
                <CardHeader>
                  <CardTitle>Token Distribution</CardTitle>
                  <CardDescription>Allocation of GOLD tokens</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-64 w-full">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl font-bold text-gold-500 mb-2">100M</div>
                        <div className="text-sm text-gray-400">Total Supply</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-gold-500 mr-2"></div>
                        <span>Community & Players</span>
                      </div>
                      <span className="font-medium">40%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span>Ecosystem Growth</span>
                      </div>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span>Team & Advisors</span>
                      </div>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                        <span>Treasury</span>
                      </div>
                      <span className="font-medium">10%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span>Private Sale</span>
                      </div>
                      <span className="font-medium">10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card3D>

              <Card3D className="bg-slate-900/80 backdrop-blur-sm col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Token Metrics</CardTitle>
                  <CardDescription>Key information about GOLD token</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm text-gray-400">Token Name</h4>
                        <p className="text-xl font-bold">GOLD</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-400">Token Type</h4>
                        <p className="text-xl font-bold">SPL Token (Solana)</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-400">Initial Price</h4>
                        <p className="text-xl font-bold">$0.10 USD</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-400">Current Price</h4>
                        <p className="text-xl font-bold text-gold-500">$0.85 USD</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm text-gray-400">Market Cap</h4>
                        <p className="text-xl font-bold">$4.25M USD</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-400">Circulating Supply</h4>
                        <p className="text-xl font-bold">5M GOLD</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-400">Emission Rate</h4>
                        <p className="text-xl font-bold">Deflationary</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-400">Burn Mechanism</h4>
                        <p className="text-xl font-bold">2% of all transactions</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <h4 className="font-medium mb-3">Token Release Schedule</h4>
                    <div className="relative h-12 bg-gray-800 rounded-full overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-gold-500 rounded-full"></div>
                      <div className="absolute left-[15%] top-0 bottom-0 w-[10%] bg-blue-500 rounded-full"></div>
                      <div className="absolute left-[25%] top-0 bottom-0 w-[5%] bg-green-500 rounded-full"></div>
                      <div className="absolute left-[30%] top-0 bottom-0 w-[5%] bg-purple-500 rounded-full"></div>
                      <div className="absolute left-[35%] top-0 bottom-0 w-[5%] bg-red-500 rounded-full"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                      <span>Launch</span>
                      <span>6 Months</span>
                      <span>1 Year</span>
                      <span>2 Years</span>
                      <span>4 Years</span>
                    </div>
                  </div>
                </CardContent>
              </Card3D>
            </div>
          </TabsContent>

          <TabsContent value="utility">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card3D className="bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center mb-4">
                    <Coins className="h-6 w-6 text-gold-500" />
                  </div>
                  <CardTitle>In-Game Currency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    GOLD serves as the primary currency within all Goldium games, allowing players to:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-gold-500 mr-2 shrink-0 mt-0.5" />
                      <span>Purchase in-game items and power-ups</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-gold-500 mr-2 shrink-0 mt-0.5" />
                      <span>Enter tournaments and competitive events</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-gold-500 mr-2 shrink-0 mt-0.5" />
                      <span>Trade with other players in the marketplace</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-gold-500 mr-2 shrink-0 mt-0.5" />
                      <span>Unlock premium game content and features</span>
                    </li>
                  </ul>
                </CardContent>
              </Card3D>

              <Card3D className="bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-gold-500" />
                  </div>
                  <CardTitle>NFT Ecosystem</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">GOLD is deeply integrated with our NFT ecosystem, enabling:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-gold-500 mr-2 shrink-0 mt-0.5" />
                      <span>Minting new NFTs with unique properties</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-gold-500 mr-2 shrink-0 mt-0.5" />
                      <span>Trading NFTs on the Goldium marketplace</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-gold-500 mr-2 shrink-0 mt-0.5" />
                      <span>Upgrading and enhancing existing NFTs</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-gold-500 mr-2 shrink-0 mt-0.5" />
                      <span>Participating in exclusive NFT drops and auctions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card3D>

              <Card3D className="bg-slate-900/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-gold-500" />
                  </div>
                  <CardTitle>DeFi Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-4">
                    GOLD powers our DeFi ecosystem with multiple financial utilities:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-gold-500 mr-2 shrink-0 mt-0.5" />
                      <span>Staking for passive income generation</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-gold-500 mr-2 shrink-0 mt-0.5" />
                      <span>Providing liquidity to earn trading fees</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-gold-500 mr-2 shrink-0 mt-0.5" />
                      <span>Yield farming with partner protocols</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-gold-500 mr-2 shrink-0 mt-0.5" />
                      <span>Collateral for borrowing other assets</span>
                    </li>
                  </ul>
                </CardContent>
              </Card3D>
            </div>
          </TabsContent>

          <TabsContent value="staking">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card3D className="bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Staking Rewards</CardTitle>
                  <CardDescription>Earn passive income by staking your GOLD tokens</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-black/30 rounded-lg">
                      <div>
                        <h4 className="font-bold text-lg">Flexible Staking</h4>
                        <p className="text-gray-400">No lock-up period, withdraw anytime</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gold-500">4.5% APR</div>
                        <Button
                          variant="outline"
                          className="mt-2 border-gold-500 text-gold-500 hover:bg-gold-500/10 button-3d"
                        >
                          Stake Now
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-black/30 rounded-lg">
                      <div>
                        <h4 className="font-bold text-lg">30-Day Lock</h4>
                        <p className="text-gray-400">Tokens locked for 30 days</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gold-500">8.2% APR</div>
                        <Button
                          variant="outline"
                          className="mt-2 border-gold-500 text-gold-500 hover:bg-gold-500/10 button-3d"
                        >
                          Stake Now
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-black/30 rounded-lg">
                      <div>
                        <h4 className="font-bold text-lg">90-Day Lock</h4>
                        <p className="text-gray-400">Tokens locked for 90 days</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gold-500">12.5% APR</div>
                        <Button
                          variant="outline"
                          className="mt-2 border-gold-500 text-gold-500 hover:bg-gold-500/10 button-3d"
                        >
                          Stake Now
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-black/30 rounded-lg">
                      <div>
                        <h4 className="font-bold text-lg">180-Day Lock</h4>
                        <p className="text-gray-400">Tokens locked for 180 days</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gold-500">18.0% APR</div>
                        <Button
                          variant="outline"
                          className="mt-2 border-gold-500 text-gold-500 hover:bg-gold-500/10 button-3d"
                        >
                          Stake Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card3D>

              <div className="space-y-8">
                <Card3D className="bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Staking Benefits</CardTitle>
                    <CardDescription>Additional perks for GOLD stakers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center mr-3 shrink-0">
                          <span className="text-gold-500 font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="font-bold">Governance Rights</h4>
                          <p className="text-gray-400">
                            Participate in protocol governance with voting power proportional to your staked amount
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center mr-3 shrink-0">
                          <span className="text-gold-500 font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="font-bold">NFT Boosters</h4>
                          <p className="text-gray-400">
                            Exclusive access to NFT boosters that enhance your in-game abilities
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center mr-3 shrink-0">
                          <span className="text-gold-500 font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="font-bold">Fee Discounts</h4>
                          <p className="text-gray-400">
                            Reduced marketplace and transaction fees based on your staking tier
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center mr-3 shrink-0">
                          <span className="text-gold-500 font-bold">4</span>
                        </div>
                        <div>
                          <h4 className="font-bold">Early Access</h4>
                          <p className="text-gray-400">
                            Priority access to new game features, NFT drops, and platform updates
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card3D>

                <Card3D className="bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Staking Stats</CardTitle>
                    <CardDescription>Current platform staking metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm text-gray-400">Total Value Locked</h4>
                        <p className="text-2xl font-bold text-gold-500">2.5M GOLD</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-400">% of Supply Staked</h4>
                        <p className="text-2xl font-bold">50%</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-400">Average Lock Time</h4>
                        <p className="text-2xl font-bold">45 days</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-400">Rewards Distributed</h4>
                        <p className="text-2xl font-bold">125K GOLD</p>
                      </div>
                    </div>
                  </CardContent>
                </Card3D>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="governance">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card3D className="bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Governance Overview</CardTitle>
                  <CardDescription>How GOLD token holders govern the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-6">
                    GOLD token holders have the power to influence the future direction of the Goldium ecosystem through
                    decentralized governance. By staking GOLD, you gain voting rights proportional to your stake.
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 bg-black/30 rounded-lg">
                      <h4 className="font-bold mb-2">Proposal Creation</h4>
                      <p className="text-sm text-gray-400">
                        Holders with at least 10,000 GOLD can submit governance proposals for community voting.
                      </p>
                    </div>

                    <div className="p-4 bg-black/30 rounded-lg">
                      <h4 className="font-bold mb-2">Voting Power</h4>
                      <p className="text-sm text-gray-400">
                        1 staked GOLD = 1 vote. Longer staking periods receive voting power multipliers.
                      </p>
                    </div>

                    <div className="p-4 bg-black/30 rounded-lg">
                      <h4 className="font-bold mb-2">Implementation</h4>
                      <p className="text-sm text-gray-400">
                        Proposals that reach quorum and majority approval are implemented by the core team.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card3D>

              <Card3D className="bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Governance Parameters</CardTitle>
                  <CardDescription>Current governance system settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Proposal Threshold</span>
                      <span className="font-bold">10,000 GOLD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Voting Period</span>
                      <span className="font-bold">7 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quorum</span>
                      <span className="font-bold">20% of staked GOLD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Approval Threshold</span>
                      <span className="font-bold">66%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Timelock</span>
                      <span className="font-bold">48 hours</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <h4 className="font-medium mb-3">Voting Power Multipliers</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Flexible Staking</span>
                        <span className="font-bold">1x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">30-Day Lock</span>
                        <span className="font-bold">1.5x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">90-Day Lock</span>
                        <span className="font-bold">2x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">180-Day Lock</span>
                        <span className="font-bold">3x</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card3D>

              <Card3D className="bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Active Proposals</CardTitle>
                  <CardDescription>Current governance votes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-black/30 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold">GIP-12: New Game Integration</h4>
                        <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded">Active</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">
                        Proposal to integrate a new card battle game with GOLD token rewards.
                      </p>
                      <div className="w-full bg-gray-800 h-2 rounded-full mb-2">
                        <div className="bg-gold-500 h-2 rounded-full" style={{ width: "72%" }}></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>72% Yes</span>
                        <span>28% No</span>
                        <span>5 days left</span>
                      </div>
                    </div>

                    <div className="p-4 bg-black/30 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold">GIP-13: Staking Rewards Adjustment</h4>
                        <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded">Active</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">
                        Proposal to increase staking rewards for 90+ day locks by 2%.
                      </p>
                      <div className="w-full bg-gray-800 h-2 rounded-full mb-2">
                        <div className="bg-gold-500 h-2 rounded-full" style={{ width: "65%" }}></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>65% Yes</span>
                        <span>35% No</span>
                        <span>3 days left</span>
                      </div>
                    </div>

                    <div className="p-4 bg-black/30 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold">GIP-14: Treasury Allocation</h4>
                        <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">Passed</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">
                        Allocate 100K GOLD from treasury for marketing initiatives.
                      </p>
                      <div className="w-full bg-gray-800 h-2 rounded-full mb-2">
                        <div className="bg-gold-500 h-2 rounded-full" style={{ width: "82%" }}></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>82% Yes</span>
                        <span>18% No</span>
                        <span>Implementation: 24h</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <Button className="bg-gold-500 hover:bg-gold-600 text-black button-3d">View All Proposals</Button>
                  </div>
                </CardContent>
              </Card3D>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
