"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Coins, Clock, TrendingUp, Lock, Unlock, Trophy, ArrowRight, Info } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import GoldBalance from "@/components/gold-balance"
import StakingHistory from "@/components/staking-history"
import StakingLeaderboard from "@/components/staking-leaderboard"
import { toast } from "@/components/ui/use-toast"

export default function Staking() {
  const { connected } = useWallet()
  const [stakeAmount, setStakeAmount] = useState(500)
  const [selectedPeriod, setSelectedPeriod] = useState("flexible")
  const [showTooltip, setShowTooltip] = useState(false)

  const maxStakeAmount = 2000
  const goldBalance = 1850

  const stakingOptions = {
    flexible: {
      apr: 4.5,
      lockPeriod: "No lock",
      minAmount: 100,
    },
    thirty: {
      apr: 8.2,
      lockPeriod: "30 days",
      minAmount: 250,
    },
    ninety: {
      apr: 12.5,
      lockPeriod: "90 days",
      minAmount: 500,
    },
  }

  const selectedOption = stakingOptions[selectedPeriod]
  const estimatedRewards =
    (stakeAmount * selectedOption.apr) /
    100 /
    (selectedPeriod === "flexible" ? 12 : selectedPeriod === "thirty" ? 12 : 4)

  const handleStakeAmountChange = (value) => {
    setStakeAmount(value[0])
  }

  const handleMaxAmount = () => {
    setStakeAmount(Math.min(goldBalance, maxStakeAmount))
  }

  // Ensure staking functionality works properly
  const handleStake = () => {
    if (stakeAmount < selectedOption.minAmount || stakeAmount > goldBalance) {
      toast({
        title: "Invalid Amount",
        description: `Please enter an amount between ${selectedOption.minAmount} and ${goldBalance} GOLD.`,
        variant: "destructive",
      })
      return
    }

    // Simulate staking process
    toast({
      title: "Staking in Progress",
      description: "Processing your staking request...",
    })

    // Simulate successful staking after a delay
    setTimeout(() => {
      toast({
        title: "Staking Successful",
        description: `You have successfully staked ${stakeAmount} GOLD at ${selectedOption.apr}% APR.`,
      })
    }, 2000)
  }

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>
        <p className="text-gray-400 mb-8">Please connect your wallet to access staking features.</p>
        <ConnectWalletButton className="gold-button" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">GOLD Staking</h1>
          <p className="text-gray-400">Stake your GOLD tokens to earn passive rewards</p>
        </div>
        <GoldBalance compact />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="border-gold bg-black">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Coins className="mr-2 h-5 w-5 text-gold" />
                Stake Your GOLD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="stake" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="stake" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                    Stake
                  </TabsTrigger>
                  <TabsTrigger value="unstake" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                    Unstake
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="stake" className="mt-0">
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium">Select Staking Period</label>
                      <div className="relative">
                        <Info
                          className="h-4 w-4 text-gray-400 cursor-pointer"
                          onMouseEnter={() => setShowTooltip(true)}
                          onMouseLeave={() => setShowTooltip(false)}
                        />
                        {showTooltip && (
                          <div className="tooltip right-0 w-64">
                            <p className="mb-1">Flexible: No lock period, withdraw anytime</p>
                            <p className="mb-1">30-Day: Locked for 30 days, higher APR</p>
                            <p>90-Day: Locked for 90 days, highest APR</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <Button
                        variant={selectedPeriod === "flexible" ? "default" : "outline"}
                        className={
                          selectedPeriod === "flexible"
                            ? "bg-gold text-black"
                            : "border-gold/50 text-white hover:bg-gold/10"
                        }
                        onClick={() => setSelectedPeriod("flexible")}
                      >
                        <Unlock className="mr-2 h-4 w-4" />
                        Flexible
                      </Button>
                      <Button
                        variant={selectedPeriod === "thirty" ? "default" : "outline"}
                        className={
                          selectedPeriod === "thirty"
                            ? "bg-gold text-black"
                            : "border-gold/50 text-white hover:bg-gold/10"
                        }
                        onClick={() => setSelectedPeriod("thirty")}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        30 Days
                      </Button>
                      <Button
                        variant={selectedPeriod === "ninety" ? "default" : "outline"}
                        className={
                          selectedPeriod === "ninety"
                            ? "bg-gold text-black"
                            : "border-gold/50 text-white hover:bg-gold/10"
                        }
                        onClick={() => setSelectedPeriod("ninety")}
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        90 Days
                      </Button>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">Amount to Stake</label>
                        <span className="text-sm text-gray-400">Balance: {goldBalance} GOLD</span>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-2xl font-bold text-gold">{stakeAmount} GOLD</div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gold/50 text-gold hover:bg-gold/10"
                            onClick={handleMaxAmount}
                          >
                            MAX
                          </Button>
                        </div>
                        <Slider
                          defaultValue={[500]}
                          max={maxStakeAmount}
                          step={50}
                          value={[stakeAmount]}
                          onValueChange={handleStakeAmountChange}
                        />
                        <div className="flex justify-between mt-2 text-xs text-gray-400">
                          <span>Min: {selectedOption.minAmount}</span>
                          <span>Max: {maxStakeAmount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gold/5 rounded-lg p-4 mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Staking Period</span>
                        <span>{selectedOption.lockPeriod}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">APR</span>
                        <span className="text-green-500 font-bold">{selectedOption.apr}%</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Estimated Rewards</span>
                        <span className="text-gold font-bold">~{estimatedRewards.toFixed(2)} GOLD / month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Minimum Stake</span>
                        <span>{selectedOption.minAmount} GOLD</span>
                      </div>
                    </div>

                    <Button
                      className="gold-button w-full"
                      disabled={stakeAmount < selectedOption.minAmount || stakeAmount > goldBalance}
                      onClick={handleStake}
                    >
                      Stake Now
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="unstake" className="mt-0">
                  <div className="mb-6">
                    <div className="bg-gold/5 rounded-lg p-4 mb-6">
                      <h3 className="font-bold mb-4">Your Staked GOLD</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 border border-gold/30 rounded-lg">
                          <div>
                            <div className="flex items-center">
                              <Unlock className="mr-2 h-4 w-4 text-gold" />
                              <span className="font-medium">Flexible Staking</span>
                            </div>
                            <div className="text-sm text-gray-400 mt-1">4.5% APR</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gold">250 GOLD</div>
                            <div className="text-sm text-green-500">+2.8 GOLD earned</div>
                          </div>
                          <Button size="sm" className="gold-button ml-4">
                            Unstake
                          </Button>
                        </div>

                        <div className="flex justify-between items-center p-3 border border-gold/30 rounded-lg">
                          <div>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-gold" />
                              <span className="font-medium">30-Day Staking</span>
                            </div>
                            <div className="text-sm text-gray-400 mt-1">8.2% APR</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gold">500 GOLD</div>
                            <div className="text-sm text-green-500">+10.2 GOLD earned</div>
                          </div>
                          <div className="ml-4">
                            <div className="text-xs text-gray-400 mb-1">Unlocks in</div>
                            <div className="text-sm">12 days</div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-3 border border-gold/30 rounded-lg">
                          <div>
                            <div className="flex items-center">
                              <Lock className="mr-2 h-4 w-4 text-gold" />
                              <span className="font-medium">90-Day Staking</span>
                            </div>
                            <div className="text-sm text-gray-400 mt-1">12.5% APR</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gold">500 GOLD</div>
                            <div className="text-sm text-green-500">+15.6 GOLD earned</div>
                          </div>
                          <div className="ml-4">
                            <div className="text-xs text-gray-400 mb-1">Unlocks in</div>
                            <div className="text-sm">45 days</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gold/5 rounded-lg p-4 mb-6">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Total Staked</span>
                        <span className="font-bold text-gold">1,250 GOLD</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Total Rewards Earned</span>
                        <span className="font-bold text-green-500">28.6 GOLD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Claimable Rewards</span>
                        <span className="font-bold text-gold">18.4 GOLD</span>
                      </div>
                    </div>

                    <Button className="gold-button w-full">Claim All Rewards</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-gold bg-black">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-gold" />
                Staking Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Total Value Staked</span>
                    <span className="font-bold text-gold">1,250 GOLD</span>
                  </div>
                  <Progress value={62.5} className="h-2 bg-gold/20" indicatorClassName="bg-gold" />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">0 GOLD</span>
                    <span className="text-xs text-gray-400">2,000 GOLD</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Current APR Range</span>
                    <span className="font-bold text-green-500">4.5% - 12.5%</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Your Staking Rank</span>
                    <span className="font-bold text-gold">#28 of 156</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Next Reward Distribution</span>
                    <span className="font-bold">12h 45m 22s</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="outline" className="w-full border-gold text-gold hover:bg-gold/10">
                  View Detailed Stats
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gold bg-black mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <Trophy className="mr-2 h-5 w-5 text-gold" />
                Top Stakers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StakingLeaderboard />
              <Button variant="outline" className="w-full border-gold text-gold hover:bg-gold/10 mt-4">
                View Full Leaderboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-gold bg-black mb-8">
        <CardHeader>
          <CardTitle>Staking History</CardTitle>
        </CardHeader>
        <CardContent>
          <StakingHistory />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-gold bg-black">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <Unlock className="h-12 w-12 text-gold" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Flexible Staking</h3>
            <p className="text-center text-gray-400 mb-4">No lock period, withdraw anytime</p>
            <div className="text-center text-2xl font-bold text-gold mb-4">4.5% APR</div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Withdraw anytime</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Minimum 100 GOLD</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Daily rewards</span>
              </li>
            </ul>
            <Button className="gold-button w-full">Stake Now</Button>
          </CardContent>
        </Card>

        <Card className="border-gold bg-black relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gold text-black px-3 py-1 text-sm font-bold">POPULAR</div>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <Clock className="h-12 w-12 text-gold" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">30-Day Staking</h3>
            <p className="text-center text-gray-400 mb-4">Lock for 30 days for higher returns</p>
            <div className="text-center text-2xl font-bold text-gold mb-4">8.2% APR</div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>30-day lock period</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Minimum 250 GOLD</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Weekly rewards</span>
              </li>
            </ul>
            <Button className="gold-button w-full">Stake Now</Button>
          </CardContent>
        </Card>

        <Card className="border-gold bg-black">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <Lock className="h-12 w-12 text-gold" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">90-Day Staking</h3>
            <p className="text-center text-gray-400 mb-4">Maximum returns with 90-day lock</p>
            <div className="text-center text-2xl font-bold text-gold mb-4">12.5% APR</div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>90-day lock period</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Minimum 500 GOLD</span>
              </li>
              <li className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Monthly rewards bonus</span>
              </li>
            </ul>
            <Button className="gold-button w-full">Stake Now</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
