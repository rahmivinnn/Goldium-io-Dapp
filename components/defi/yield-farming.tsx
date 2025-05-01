"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import { WalletConnectOverlay } from "@/components/wallet-connect-overlay"

// Farm type definition
interface Farm {
  id: string
  name: string
  token1: {
    symbol: string
    icon: string
  }
  token2: {
    symbol: string
    icon: string
  }
  apr: number
  tvl: number
  yourStake: number
  yourRewards: number
  multiplier: string
}

// Mock data for farms
const mockFarms: Farm[] = [
  {
    id: "farm-1",
    name: "GOLD-ETH LP",
    token1: {
      symbol: "GOLD",
      icon: "/gold-logo.png",
    },
    token2: {
      symbol: "ETH",
      icon: "/ethereum-crystal.png",
    },
    apr: 87.5,
    tvl: 3450000,
    yourStake: 1250,
    yourRewards: 45.75,
    multiplier: "40x",
  },
  {
    id: "farm-2",
    name: "GOLD-USDT LP",
    token1: {
      symbol: "GOLD",
      icon: "/gold-logo.png",
    },
    token2: {
      symbol: "USDT",
      icon: "/abstract-tether.png",
    },
    apr: 65.2,
    tvl: 2780000,
    yourStake: 850,
    yourRewards: 28.4,
    multiplier: "30x",
  },
  {
    id: "farm-3",
    name: "GOLD-BTC LP",
    token1: {
      symbol: "GOLD",
      icon: "/gold-logo.png",
    },
    token2: {
      symbol: "BTC",
      icon: "/bitcoin-symbol-gold.png",
    },
    apr: 92.8,
    tvl: 4120000,
    yourStake: 0,
    yourRewards: 0,
    multiplier: "50x",
  },
  {
    id: "farm-4",
    name: "GOLD-USDC LP",
    token1: {
      symbol: "GOLD",
      icon: "/gold-logo.png",
    },
    token2: {
      symbol: "USDC",
      icon: "/usdc-digital-currency.png",
    },
    apr: 58.6,
    tvl: 1950000,
    yourStake: 0,
    yourRewards: 0,
    multiplier: "25x",
  },
]

export function YieldFarming() {
  const { toast } = useToast()
  const { isConnected } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [expandedFarm, setExpandedFarm] = useState<string | null>(null)
  const [farms, setFarms] = useState<Farm[]>(mockFarms)
  const [stakeAmount, setStakeAmount] = useState<Record<string, string>>({})
  const [unstakeAmount, setUnstakeAmount] = useState<Record<string, string>>({})

  // Toggle farm expansion
  const toggleExpand = (farmId: string) => {
    if (expandedFarm === farmId) {
      setExpandedFarm(null)
    } else {
      setExpandedFarm(farmId)
    }
  }

  // Handle staking
  const handleStake = async (farm: Farm) => {
    if (!isConnected) return
    if (!stakeAmount[farm.id] || Number.parseFloat(stakeAmount[farm.id]) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to stake.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const amount = Number.parseFloat(stakeAmount[farm.id])

      toast({
        title: "Staking Successful",
        description: `Successfully staked ${amount} LP tokens in ${farm.name} farm.`,
        variant: "default",
      })

      // Update farms (simulate staking)
      setFarms(
        farms.map((f) => {
          if (f.id === farm.id) {
            return {
              ...f,
              yourStake: f.yourStake + amount,
            }
          }
          return f
        }),
      )

      // Reset stake amount
      setStakeAmount({
        ...stakeAmount,
        [farm.id]: "",
      })
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Failed to stake LP tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle unstaking
  const handleUnstake = async (farm: Farm) => {
    if (!isConnected) return
    if (
      !unstakeAmount[farm.id] ||
      Number.parseFloat(unstakeAmount[farm.id]) <= 0 ||
      Number.parseFloat(unstakeAmount[farm.id]) > farm.yourStake
    ) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to unstake.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const amount = Number.parseFloat(unstakeAmount[farm.id])

      toast({
        title: "Unstaking Successful",
        description: `Successfully unstaked ${amount} LP tokens from ${farm.name} farm.`,
        variant: "default",
      })

      // Update farms (simulate unstaking)
      setFarms(
        farms.map((f) => {
          if (f.id === farm.id) {
            return {
              ...f,
              yourStake: f.yourStake - amount,
            }
          }
          return f
        }),
      )

      // Reset unstake amount
      setUnstakeAmount({
        ...unstakeAmount,
        [farm.id]: "",
      })
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Failed to unstake LP tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle claiming rewards
  const handleClaimRewards = async (farm: Farm) => {
    if (!isConnected) return
    if (farm.yourRewards <= 0) {
      toast({
        title: "No Rewards",
        description: "You don't have any rewards to claim.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Rewards Claimed",
        description: `Successfully claimed ${farm.yourRewards.toFixed(2)} GOLD rewards from ${farm.name} farm.`,
        variant: "default",
      })

      // Update farms (simulate claiming)
      setFarms(
        farms.map((f) => {
          if (f.id === farm.id) {
            return {
              ...f,
              yourRewards: 0,
            }
          }
          return f
        }),
      )
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Failed to claim rewards. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Calculate total staked value
  const totalStaked = farms.reduce((sum, farm) => sum + farm.yourStake, 0)

  // Calculate total rewards
  const totalRewards = farms.reduce((sum, farm) => sum + farm.yourRewards, 0)

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      {!isConnected && <WalletConnectOverlay />}

      <Card className="border-2 border-amber-500/20 bg-gradient-to-b from-amber-50/10 to-amber-100/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-amber-800">Yield Farming</CardTitle>
          <CardDescription className="text-amber-700">
            Stake your LP tokens to earn additional GOLD rewards
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white/80 border border-amber-200">
              <CardContent className="p-4">
                <div className="text-sm text-amber-700 mb-1">Total Value Locked</div>
                <div className="text-2xl font-bold text-amber-900">
                  {formatCurrency(farms.reduce((sum, farm) => sum + farm.tvl, 0))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 border border-amber-200">
              <CardContent className="p-4">
                <div className="text-sm text-amber-700 mb-1">Your Total Staked</div>
                <div className="text-2xl font-bold text-amber-900">{formatCurrency(totalStaked)}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 border border-amber-200">
              <CardContent className="p-4">
                <div className="text-sm text-amber-700 mb-1">Pending Rewards</div>
                <div className="text-2xl font-bold text-amber-900">{totalRewards.toFixed(2)} GOLD</div>
              </CardContent>
            </Card>
          </div>

          {/* Farms List */}
          <div className="space-y-4">
            {farms.map((farm) => (
              <Card key={farm.id} className="border border-amber-200 overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-amber-50 transition-colors"
                  onClick={() => toggleExpand(farm.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={farm.token1.icon || "/placeholder.svg"}
                          alt={farm.token1.symbol}
                          className="w-8 h-8 rounded-full"
                        />
                        <img
                          src={farm.token2.icon || "/placeholder.svg"}
                          alt={farm.token2.symbol}
                          className="w-8 h-8 rounded-full absolute -bottom-1 -right-1"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-amber-900">{farm.name}</h3>
                        <div className="text-xs text-amber-700">Multiplier: {farm.multiplier}</div>
                      </div>
                    </div>

                    <div className="hidden md:block text-center">
                      <div className="text-xs text-amber-700">APR</div>
                      <div className="font-bold text-amber-900">{farm.apr}%</div>
                    </div>

                    <div className="hidden md:block text-center">
                      <div className="text-xs text-amber-700">TVL</div>
                      <div className="font-bold text-amber-900">{formatCurrency(farm.tvl)}</div>
                    </div>

                    <div className="hidden md:block text-center">
                      <div className="text-xs text-amber-700">Your Stake</div>
                      <div className="font-bold text-amber-900">{formatCurrency(farm.yourStake)}</div>
                    </div>

                    <div className="hidden md:block text-center">
                      <div className="text-xs text-amber-700">Rewards</div>
                      <div className="font-bold text-amber-900">{farm.yourRewards.toFixed(2)} GOLD</div>
                    </div>

                    <div className="text-amber-500">
                      {expandedFarm === farm.id ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m18 15-6-6-6 6" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Mobile view stats */}
                  <div className="grid grid-cols-3 gap-2 mt-3 md:hidden">
                    <div className="text-center">
                      <div className="text-xs text-amber-700">APR</div>
                      <div className="font-bold text-amber-900">{farm.apr}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-amber-700">Your Stake</div>
                      <div className="font-bold text-amber-900">{formatCurrency(farm.yourStake)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-amber-700">Rewards</div>
                      <div className="font-bold text-amber-900">{farm.yourRewards.toFixed(2)} GOLD</div>
                    </div>
                  </div>
                </div>

                {/* Expanded content */}
                {expandedFarm === farm.id && (
                  <div className="p-4 border-t border-amber-200 bg-amber-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Stake section */}
                      <div className="p-4 bg-white rounded-lg border border-amber-200">
                        <h4 className="font-bold text-amber-900 mb-2">Stake LP Tokens</h4>
                        <div className="flex space-x-2 mb-4">
                          <input
                            type="number"
                            placeholder="Amount"
                            className="flex-1 px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            value={stakeAmount[farm.id] || ""}
                            onChange={(e) => setStakeAmount({ ...stakeAmount, [farm.id]: e.target.value })}
                            disabled={isLoading}
                          />
                          <Button
                            variant="outline"
                            className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
                            onClick={() => setStakeAmount({ ...stakeAmount, [farm.id]: "100" })}
                            disabled={isLoading}
                          >
                            MAX
                          </Button>
                        </div>
                        <Button
                          className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                          onClick={() => handleStake(farm)}
                          disabled={isLoading}
                        >
                          {isLoading ? "Processing..." : "Stake"}
                        </Button>
                      </div>

                      {/* Unstake section */}
                      <div className="p-4 bg-white rounded-lg border border-amber-200">
                        <h4 className="font-bold text-amber-900 mb-2">Unstake LP Tokens</h4>
                        <div className="flex space-x-2 mb-4">
                          <input
                            type="number"
                            placeholder="Amount"
                            className="flex-1 px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                            value={unstakeAmount[farm.id] || ""}
                            onChange={(e) => setUnstakeAmount({ ...unstakeAmount, [farm.id]: e.target.value })}
                            disabled={isLoading || farm.yourStake <= 0}
                          />
                          <Button
                            variant="outline"
                            className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white"
                            onClick={() => setUnstakeAmount({ ...unstakeAmount, [farm.id]: farm.yourStake.toString() })}
                            disabled={isLoading || farm.yourStake <= 0}
                          >
                            MAX
                          </Button>
                        </div>
                        <Button
                          className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                          onClick={() => handleUnstake(farm)}
                          disabled={isLoading || farm.yourStake <= 0}
                        >
                          {isLoading ? "Processing..." : "Unstake"}
                        </Button>
                      </div>
                    </div>

                    {/* Rewards section */}
                    <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-bold text-amber-900">Pending Rewards</h4>
                        <span className="font-bold text-amber-900">{farm.yourRewards.toFixed(2)} GOLD</span>
                      </div>
                      <Progress value={(farm.yourRewards / (farm.yourRewards + 10)) * 100} className="mb-4" />
                      <Button
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                        onClick={() => handleClaimRewards(farm)}
                        disabled={isLoading || farm.yourRewards <= 0}
                      >
                        {isLoading ? "Processing..." : "Claim Rewards"}
                      </Button>
                    </div>

                    {/* Farm details */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-white rounded-lg border border-amber-200">
                        <div className="text-xs text-amber-700">Total Value Locked</div>
                        <div className="font-bold text-amber-900">{formatCurrency(farm.tvl)}</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-amber-200">
                        <div className="text-xs text-amber-700">APR</div>
                        <div className="font-bold text-amber-900">{farm.apr}%</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-amber-200">
                        <div className="text-xs text-amber-700">Multiplier</div>
                        <div className="font-bold text-amber-900">{farm.multiplier}</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-amber-200">
                        <div className="text-xs text-amber-700">Your Share</div>
                        <div className="font-bold text-amber-900">
                          {farm.tvl > 0 ? ((farm.yourStake / farm.tvl) * 100).toFixed(4) : "0"}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default YieldFarming
