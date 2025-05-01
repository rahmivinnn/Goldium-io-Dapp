"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import { Plus, Minus, RefreshCw, ChevronDown, ChevronUp, CheckCircle2, TrendingUp, Wallet } from "lucide-react"

// Sample token data
const TOKENS = [
  { id: "gold", name: "GOLD", symbol: "GOLD", balance: 1850, price: 0.85, icon: "/gold-logo.png" },
  { id: "eth", name: "Ethereum", symbol: "ETH", balance: 1.25, price: 3200, icon: "/ethereum-crystal.png" },
  { id: "btc", name: "Bitcoin", symbol: "BTC", balance: 0.05, price: 62000, icon: "/bitcoin-symbol-gold.png" },
  { id: "usdt", name: "Tether", symbol: "USDT", balance: 2500, price: 1, icon: "/abstract-tether.png" },
  { id: "usdc", name: "USD Coin", symbol: "USDC", balance: 1800, price: 1, icon: "/usdc-digital-currency.png" },
]

// Sample liquidity pool data
const INITIAL_POOLS = [
  {
    id: "gold-eth",
    token0: "gold",
    token1: "eth",
    reserve0: 125000,
    reserve1: 33.2,
    apr: 24.5,
    totalLiquidity: 212500,
    myLiquidity: 0,
    myToken0: 0,
    myToken1: 0,
    myShare: 0,
  },
  {
    id: "gold-usdt",
    token0: "gold",
    token1: "usdt",
    reserve0: 350000,
    reserve1: 297500,
    apr: 18.2,
    totalLiquidity: 297500,
    myLiquidity: 5250,
    myToken0: 6176.47,
    myToken1: 5250,
    myShare: 1.76,
  },
  {
    id: "eth-usdt",
    token0: "eth",
    token1: "usdt",
    reserve0: 125,
    reserve1: 400000,
    apr: 15.8,
    totalLiquidity: 400000,
    myLiquidity: 0,
    myToken0: 0,
    myToken1: 0,
    myShare: 0,
  },
]

export default function LiquidityPoolManager() {
  const { toast } = useToast()
  const { connected, address } = useWallet()
  const [activeTab, setActiveTab] = useState("pools")
  const [loading, setLoading] = useState(true)
  const [pools, setPools] = useState(INITIAL_POOLS)
  const [selectedPool, setSelectedPool] = useState(null)
  const [showAddLiquidity, setShowAddLiquidity] = useState(false)
  const [showRemoveLiquidity, setShowRemoveLiquidity] = useState(false)
  const [token0Amount, setToken0Amount] = useState("")
  const [token1Amount, setToken1Amount] = useState("")
  const [removePercentage, setRemovePercentage] = useState(50)
  const [approving, setApproving] = useState(false)
  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState(null)
  const [expandedPoolId, setExpandedPoolId] = useState(null)

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Handle token 0 amount change
  const handleToken0Change = (value, pool) => {
    setToken0Amount(value)
    if (value && !isNaN(value) && pool) {
      const ratio = pool.reserve1 / pool.reserve0
      setToken1Amount((Number.parseFloat(value) * ratio).toFixed(6))
    } else {
      setToken1Amount("")
    }
  }

  // Handle token 1 amount change
  const handleToken1Change = (value, pool) => {
    setToken1Amount(value)
    if (value && !isNaN(value) && pool) {
      const ratio = pool.reserve0 / pool.reserve1
      setToken0Amount((Number.parseFloat(value) * ratio).toFixed(6))
    } else {
      setToken0Amount("")
    }
  }

  // Get token data by ID
  const getTokenById = (id) => {
    return TOKENS.find((token) => token.id === id) || {}
  }

  // Format currency
  const formatCurrency = (value) => {
    if (!value) return "0.00"
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value)
  }

  // Handle add liquidity
  const handleAddLiquidity = (pool) => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to add liquidity.",
        variant: "destructive",
      })
      return
    }

    if (
      !token0Amount ||
      !token1Amount ||
      isNaN(Number.parseFloat(token0Amount)) ||
      isNaN(Number.parseFloat(token1Amount))
    ) {
      toast({
        title: "Invalid Amount",
        description: "Please enter valid amounts for both tokens.",
        variant: "destructive",
      })
      return
    }

    const token0 = getTokenById(pool.token0)
    const token1 = getTokenById(pool.token1)

    if (Number.parseFloat(token0Amount) > token0.balance) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough ${token0.symbol} to add liquidity.`,
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(token1Amount) > token1.balance) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough ${token1.symbol} to add liquidity.`,
        variant: "destructive",
      })
      return
    }

    // Start approval process
    setApproving(true)
    setTransactionStatus("approving")

    toast({
      title: "Approving Tokens",
      description: `Approving ${token0.symbol} and ${token1.symbol} for liquidity addition...`,
    })

    // Simulate approval delay
    setTimeout(() => {
      setApproving(false)
      setAdding(true)
      setTransactionStatus("adding")

      toast({
        title: "Tokens Approved",
        description: `Adding liquidity with ${token0Amount} ${token0.symbol} and ${token1Amount} ${token1.symbol}...`,
      })

      // Simulate adding liquidity delay
      setTimeout(() => {
        setAdding(false)
        setTransactionStatus("success")

        // Update pool data
        setPools((prevPools) => {
          return prevPools.map((p) => {
            if (p.id === pool.id) {
              const addedToken0 = Number.parseFloat(token0Amount)
              const addedToken1 = Number.parseFloat(token1Amount)
              const newTotalLiquidity = p.totalLiquidity + addedToken1
              const newMyLiquidity = p.myLiquidity + addedToken1
              const newShare = (newMyLiquidity / newTotalLiquidity) * 100

              return {
                ...p,
                reserve0: p.reserve0 + addedToken0,
                reserve1: p.reserve1 + addedToken1,
                totalLiquidity: newTotalLiquidity,
                myLiquidity: newMyLiquidity,
                myToken0: p.myToken0 + addedToken0,
                myToken1: p.myToken1 + addedToken1,
                myShare: newShare,
              }
            }
            return p
          })
        })

        // Update token balances
        const updatedTokens = [...TOKENS]
        const token0Index = updatedTokens.findIndex((t) => t.id === pool.token0)
        const token1Index = updatedTokens.findIndex((t) => t.id === pool.token1)

        if (token0Index >= 0) {
          updatedTokens[token0Index] = {
            ...updatedTokens[token0Index],
            balance: updatedTokens[token0Index].balance - Number.parseFloat(token0Amount),
          }
        }

        if (token1Index >= 0) {
          updatedTokens[token1Index] = {
            ...updatedTokens[token1Index],
            balance: updatedTokens[token1Index].balance - Number.parseFloat(token1Amount),
          }
        }

        toast({
          title: "Liquidity Added",
          description: `Successfully added liquidity to the ${token0.symbol}-${token1.symbol} pool.`,
        })

        // Reset form
        setToken0Amount("")
        setToken1Amount("")
        setShowAddLiquidity(false)
        setSelectedPool(null)
        setTransactionStatus(null)
      }, 2000)
    }, 2000)
  }

  // Handle remove liquidity
  const handleRemoveLiquidity = (pool) => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to remove liquidity.",
        variant: "destructive",
      })
      return
    }

    if (pool.myLiquidity <= 0) {
      toast({
        title: "No Liquidity",
        description: "You don't have any liquidity in this pool to remove.",
        variant: "destructive",
      })
      return
    }

    const token0 = getTokenById(pool.token0)
    const token1 = getTokenById(pool.token1)
    const removeAmount = (pool.myLiquidity * removePercentage) / 100
    const removeToken0 = (pool.myToken0 * removePercentage) / 100
    const removeToken1 = (pool.myToken1 * removePercentage) / 100

    // Start removing process
    setRemoving(true)
    setTransactionStatus("removing")

    toast({
      title: "Removing Liquidity",
      description: `Removing ${removePercentage}% of your liquidity from the ${token0.symbol}-${token1.symbol} pool...`,
    })

    // Simulate removing liquidity delay
    setTimeout(() => {
      setRemoving(false)
      setTransactionStatus("success")

      // Update pool data
      setPools((prevPools) => {
        return prevPools.map((p) => {
          if (p.id === pool.id) {
            const newMyLiquidity = p.myLiquidity - removeAmount
            const newShare = newMyLiquidity > 0 ? (newMyLiquidity / (p.totalLiquidity - removeAmount)) * 100 : 0

            return {
              ...p,
              reserve0: p.reserve0 - removeToken0,
              reserve1: p.reserve1 - removeToken1,
              totalLiquidity: p.totalLiquidity - removeAmount,
              myLiquidity: newMyLiquidity,
              myToken0: p.myToken0 - removeToken0,
              myToken1: p.myToken1 - removeToken1,
              myShare: newShare,
            }
          }
          return p
        })
      })

      // Update token balances
      const updatedTokens = [...TOKENS]
      const token0Index = updatedTokens.findIndex((t) => t.id === pool.token0)
      const token1Index = updatedTokens.findIndex((t) => t.id === pool.token1)

      if (token0Index >= 0) {
        updatedTokens[token0Index] = {
          ...updatedTokens[token0Index],
          balance: updatedTokens[token0Index].balance + removeToken0,
        }
      }

      if (token1Index >= 0) {
        updatedTokens[token1Index] = {
          ...updatedTokens[token1Index],
          balance: updatedTokens[token1Index].balance + removeToken1,
        }
      }

      toast({
        title: "Liquidity Removed",
        description: `Successfully removed ${removePercentage}% of your liquidity from the ${token0.symbol}-${token1.symbol} pool.`,
      })

      // Reset form
      setRemovePercentage(50)
      setShowRemoveLiquidity(false)
      setSelectedPool(null)
      setTransactionStatus(null)
    }, 3000)
  }

  // Toggle pool expansion
  const togglePoolExpansion = (poolId) => {
    if (expandedPoolId === poolId) {
      setExpandedPoolId(null)
    } else {
      setExpandedPoolId(poolId)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gold">Liquidity Pools</h1>
          <p className="text-gray-400">Provide liquidity to earn trading fees and rewards</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            className="gold-button"
            onClick={() => {
              setShowAddLiquidity(true)
              setShowRemoveLiquidity(false)
              setSelectedPool(pools[0])
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Liquidity
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="pools" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            All Pools
          </TabsTrigger>
          <TabsTrigger value="my-liquidity" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            My Liquidity
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pools" className="mt-0">
          <Card className="border-gold bg-black">
            <CardHeader>
              <CardTitle>Available Liquidity Pools</CardTitle>
              <CardDescription>Provide liquidity to earn trading fees and APR rewards</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full bg-gold/10" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {pools.map((pool) => {
                    const token0 = getTokenById(pool.token0)
                    const token1 = getTokenById(pool.token1)
                    const isExpanded = expandedPoolId === pool.id

                    return (
                      <div
                        key={pool.id}
                        className="border border-gold/30 rounded-lg overflow-hidden transition-all duration-300"
                      >
                        <div
                          className="p-4 cursor-pointer hover:bg-gold/5"
                          onClick={() => togglePoolExpansion(pool.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex -space-x-2 mr-3">
                                <img
                                  src={token0.icon || "/placeholder.svg"}
                                  alt={token0.symbol}
                                  className="w-8 h-8 rounded-full border border-black"
                                />
                                <img
                                  src={token1.icon || "/placeholder.svg"}
                                  alt={token1.symbol}
                                  className="w-8 h-8 rounded-full border border-black"
                                />
                              </div>
                              <div>
                                <h3 className="font-bold">
                                  {token0.symbol}-{token1.symbol}
                                </h3>
                                <div className="flex items-center text-xs text-gray-400">
                                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                                  {pool.apr}% APR
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="text-right mr-4">
                                <div className="font-medium">${formatCurrency(pool.totalLiquidity)}</div>
                                <div className="text-xs text-gray-400">TVL</div>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-gold" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gold" />
                              )}
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-gold/10 pt-4 bg-gold/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Pool Information</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-400 text-sm">Total Liquidity</span>
                                    <span>${formatCurrency(pool.totalLiquidity)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400 text-sm">{token0.symbol} Reserved</span>
                                    <span>
                                      {formatCurrency(pool.reserve0)} {token0.symbol}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400 text-sm">{token1.symbol} Reserved</span>
                                    <span>
                                      {formatCurrency(pool.reserve1)} {token1.symbol}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-400 text-sm">APR</span>
                                    <span className="text-green-500">{pool.apr}%</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-2">Your Position</h4>
                                {pool.myLiquidity > 0 ? (
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-gray-400 text-sm">Your Liquidity</span>
                                      <span>${formatCurrency(pool.myLiquidity)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400 text-sm">{token0.symbol}</span>
                                      <span>
                                        {formatCurrency(pool.myToken0)} {token0.symbol}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400 text-sm">{token1.symbol}</span>
                                      <span>
                                        {formatCurrency(pool.myToken1)} {token1.symbol}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-400 text-sm">Pool Share</span>
                                      <span>{pool.myShare.toFixed(2)}%</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-4 text-gray-400">
                                    You don't have any liquidity in this pool yet
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                className="flex-1 gold-button"
                                onClick={() => {
                                  setShowAddLiquidity(true)
                                  setShowRemoveLiquidity(false)
                                  setSelectedPool(pool)
                                }}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add
                              </Button>
                              {pool.myLiquidity > 0 && (
                                <Button
                                  className="flex-1 border-gold text-gold hover:bg-gold/10"
                                  variant="outline"
                                  onClick={() => {
                                    setShowRemoveLiquidity(true)
                                    setShowAddLiquidity(false)
                                    setSelectedPool(pool)
                                  }}
                                >
                                  <Minus className="mr-2 h-4 w-4" />
                                  Remove
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-liquidity" className="mt-0">
          <Card className="border-gold bg-black">
            <CardHeader>
              <CardTitle>My Liquidity Positions</CardTitle>
              <CardDescription>Manage your liquidity positions across all pools</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full bg-gold/10" />
                  ))}
                </div>
              ) : (
                <>
                  {pools.filter((pool) => pool.myLiquidity > 0).length > 0 ? (
                    <div className="space-y-4">
                      {pools
                        .filter((pool) => pool.myLiquidity > 0)
                        .map((pool) => {
                          const token0 = getTokenById(pool.token0)
                          const token1 = getTokenById(pool.token1)

                          return (
                            <div
                              key={pool.id}
                              className="border border-gold/30 rounded-lg p-4 hover:bg-gold/5 transition-all duration-300"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                  <div className="flex -space-x-2 mr-3">
                                    <img
                                      src={token0.icon || "/placeholder.svg"}
                                      alt={token0.symbol}
                                      className="w-8 h-8 rounded-full border border-black"
                                    />
                                    <img
                                      src={token1.icon || "/placeholder.svg"}
                                      alt={token1.symbol}
                                      className="w-8 h-8 rounded-full border border-black"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-bold">
                                      {token0.symbol}-{token1.symbol}
                                    </h3>
                                    <div className="flex items-center text-xs text-gray-400">
                                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                                      {pool.apr}% APR
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">${formatCurrency(pool.myLiquidity)}</div>
                                  <div className="text-xs text-gray-400">Your Liquidity</div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="flex flex-col">
                                  <span className="text-gray-400 text-xs mb-1">Your Assets</span>
                                  <div className="flex items-center">
                                    <img
                                      src={token0.icon || "/placeholder.svg"}
                                      alt={token0.symbol}
                                      className="w-4 h-4 rounded-full mr-1"
                                    />
                                    <span>
                                      {formatCurrency(pool.myToken0)} {token0.symbol}
                                    </span>
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <img
                                      src={token1.icon || "/placeholder.svg"}
                                      alt={token1.symbol}
                                      className="w-4 h-4 rounded-full mr-1"
                                    />
                                    <span>
                                      {formatCurrency(pool.myToken1)} {token1.symbol}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-400 text-xs mb-1">Pool Share</span>
                                  <div className="font-medium">{pool.myShare.toFixed(2)}%</div>
                                </div>
                                <div>
                                  <span className="text-gray-400 text-xs mb-1">Earned Fees (Est.)</span>
                                  <div className="font-medium text-green-500">
                                    ${formatCurrency((pool.myLiquidity * pool.apr) / 100 / 365)}
                                    <span className="text-xs text-gray-400 ml-1">daily</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  className="flex-1 gold-button"
                                  onClick={() => {
                                    setShowAddLiquidity(true)
                                    setShowRemoveLiquidity(false)
                                    setSelectedPool(pool)
                                  }}
                                >
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add More
                                </Button>
                                <Button
                                  className="flex-1 border-gold text-gold hover:bg-gold/10"
                                  variant="outline"
                                  onClick={() => {
                                    setShowRemoveLiquidity(true)
                                    setShowAddLiquidity(false)
                                    setSelectedPool(pool)
                                  }}
                                >
                                  <Minus className="mr-2 h-4 w-4" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Wallet className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">No Liquidity Positions</h3>
                      <p className="text-gray-400 mb-6">You haven't added liquidity to any pools yet</p>
                      <Button
                        className="gold-button"
                        onClick={() => {
                          setShowAddLiquidity(true)
                          setShowRemoveLiquidity(false)
                          setSelectedPool(pools[0])
                          setActiveTab("pools")
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Liquidity
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          <Card className="border-gold bg-black">
            <CardHeader>
              <CardTitle>Liquidity Pool Analytics</CardTitle>
              <CardDescription>View detailed analytics for all liquidity pools</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-64 w-full bg-gold/10" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full bg-gold/10" />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-64 flex items-center justify-center mb-8 border border-gold/20 rounded-lg">
                    <div className="text-center text-gray-400">[Liquidity Pool Volume Chart]</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="border border-gold/30 rounded-lg p-4">
                      <h3 className="text-lg font-bold mb-2">Total Value Locked</h3>
                      <div className="text-2xl font-bold text-gold">$910,000</div>
                      <div className="flex items-center text-green-500 text-sm">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +15.2% from last week
                      </div>
                    </div>

                    <div className="border border-gold/30 rounded-lg p-4">
                      <h3 className="text-lg font-bold mb-2">24h Trading Volume</h3>
                      <div className="text-2xl font-bold text-gold">$125,450</div>
                      <div className="flex items-center text-green-500 text-sm">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +8.7% from yesterday
                      </div>
                    </div>

                    <div className="border border-gold/30 rounded-lg p-4">
                      <h3 className="text-lg font-bold mb-2">Total Fees (24h)</h3>
                      <div className="text-2xl font-bold text-gold">$3,763</div>
                      <div className="text-sm text-gray-400">Distributed to liquidity providers</div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-4">Pool Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gold/30">
                          <th className="px-4 py-3 text-left">Pool</th>
                          <th className="px-4 py-3 text-left">TVL</th>
                          <th className="px-4 py-3 text-left">Volume (24h)</th>
                          <th className="px-4 py-3 text-left">Fees (24h)</th>
                          <th className="px-4 py-3 text-left">APR</th>
                          <th className="px-4 py-3 text-left">7d Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pools.map((pool) => {
                          const token0 = getTokenById(pool.token0)
                          const token1 = getTokenById(pool.token1)
                          const volume = Math.floor(pool.totalLiquidity * 0.15)
                          const fees = volume * 0.003

                          return (
                            <tr key={pool.id} className="border-b border-gold/10 hover:bg-gold/5">
                              <td className="px-4 py-3">
                                <div className="flex items-center">
                                  <div className="flex -space-x-2 mr-2">
                                    <img
                                      src={token0.icon || "/placeholder.svg"}
                                      alt={token0.symbol}
                                      className="w-6 h-6 rounded-full border border-black"
                                    />
                                    <img
                                      src={token1.icon || "/placeholder.svg"}
                                      alt={token1.symbol}
                                      className="w-6 h-6 rounded-full border border-black"
                                    />
                                  </div>
                                  {token0.symbol}-{token1.symbol}
                                </div>
                              </td>
                              <td className="px-4 py-3">${formatCurrency(pool.totalLiquidity)}</td>
                              <td className="px-4 py-3">${formatCurrency(volume)}</td>
                              <td className="px-4 py-3">${formatCurrency(fees)}</td>
                              <td className="px-4 py-3 text-green-500">{pool.apr}%</td>
                              <td className="px-4 py-3 text-green-500">+{(Math.random() * 10).toFixed(2)}%</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Liquidity Modal */}
      {showAddLiquidity && selectedPool && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-gold rounded-lg w-full max-w-md p-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add Liquidity</h3>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
                onClick={() => {
                  setShowAddLiquidity(false)
                  setToken0Amount("")
                  setToken1Amount("")
                  setSelectedPool(null)
                  setTransactionStatus(null)
                }}
              >
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Button>
            </div>

            {transactionStatus ? (
              <div className="text-center py-8">
                {transactionStatus === "approving" && (
                  <>
                    <RefreshCw className="h-16 w-16 text-gold mx-auto mb-4 animate-spin" />
                    <h3 className="text-xl font-bold mb-2">Approving Tokens</h3>
                    <p className="text-gray-400 mb-2">Approving tokens for the liquidity pool...</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                      <div className="bg-gold h-2 rounded-full w-1/3 animate-pulse"></div>
                    </div>
                    <p className="text-sm text-gray-500">Please confirm the transaction in your wallet</p>
                  </>
                )}

                {transactionStatus === "adding" && (
                  <>
                    <RefreshCw className="h-16 w-16 text-gold mx-auto mb-4 animate-spin" />
                    <h3 className="text-xl font-bold mb-2">Adding Liquidity</h3>
                    <p className="text-gray-400 mb-2">Adding your tokens to the liquidity pool...</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                      <div className="bg-gold h-2 rounded-full w-2/3 animate-pulse"></div>
                    </div>
                    <p className="text-sm text-gray-500">This may take a few moments</p>
                  </>
                )}

                {transactionStatus === "success" && (
                  <>
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Success!</h3>
                    <p className="text-gray-400 mb-6">Your liquidity has been added successfully</p>
                    <Button
                      className="gold-button w-full"
                      onClick={() => {
                        setShowAddLiquidity(false)
                        setToken0Amount("")
                        setToken1Amount("")
                        setSelectedPool(null)
                        setTransactionStatus(null)
                      }}
                    >
                      Close
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center mb-4">
                  <div className="flex -space-x-4">
                    <img
                      src={getTokenById(selectedPool.token0).icon || "/placeholder.svg"}
                      alt={getTokenById(selectedPool.token0).symbol}
                      className="w-12 h-12 rounded-full border-2 border-black"
                    />
                    <img
                      src={getTokenById(selectedPool.token1).icon || "/placeholder.svg"}
                      alt={getTokenById(selectedPool.token1).symbol}
                      className="w-12 h-12 rounded-full border-2 border-black"
                    />
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h4 className="font-bold">
                    {getTokenById(selectedPool.token0).symbol}-{getTokenById(selectedPool.token1).symbol} Pool
                  </h4>
                  <div className="text-sm text-gray-400">
                    Current APR: <span className="text-green-500">{selectedPool.apr}%</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">{getTokenById(selectedPool.token0).symbol}</label>
                    <span className="text-sm text-gray-400">
                      Balance: {formatCurrency(getTokenById(selectedPool.token0).balance)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={token0Amount}
                        onChange={(e) => handleToken0Change(e.target.value, selectedPool)}
                        className="bg-black border-gold/50 focus:border-gold pr-20"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gold hover:text-gold-hover"
                        onClick={() =>
                          handleToken0Change(getTokenById(selectedPool.token0).balance.toString(), selectedPool)
                        }
                      >
                        MAX
                      </Button>
                    </div>
                    <div className="w-24 flex items-center justify-center bg-gold/10 rounded-md px-2">
                      <img
                        src={getTokenById(selectedPool.token0).icon || "/placeholder.svg"}
                        alt={getTokenById(selectedPool.token0).symbol}
                        className="w-5 h-5 rounded-full mr-2"
                      />
                      <span>{getTokenById(selectedPool.token0).symbol}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center my-4">
                  <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                    <Plus className="h-4 w-4 text-gold" />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">{getTokenById(selectedPool.token1).symbol}</label>
                    <span className="text-sm text-gray-400">
                      Balance: {formatCurrency(getTokenById(selectedPool.token1).balance)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={token1Amount}
                        onChange={(e) => handleToken1Change(e.target.value, selectedPool)}
                        className="bg-black border-gold/50 focus:border-gold pr-20"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gold hover:text-gold-hover"
                        onClick={() =>
                          handleToken1Change(getTokenById(selectedPool.token1).balance.toString(), selectedPool)
                        }
                      >
                        MAX
                      </Button>
                    </div>
                    <div className="w-24 flex items-center justify-center bg-gold/10 rounded-md px-2">
                      <img
                        src={getTokenById(selectedPool.token1).icon || "/placeholder.svg"}
                        alt={getTokenById(selectedPool.token1).symbol}
                        className="w-5 h-5 rounded-full mr-2"
                      />
                      <span>{getTokenById(selectedPool.token1).symbol}</span>
                    </div>
                  </div>
                </div>

                {token0Amount && token1Amount && (
                  <div className="bg-gold/5 rounded-lg p-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Exchange Rate</span>
                      <span>
                        1 {getTokenById(selectedPool.token0).symbol} ={" "}
                        {(selectedPool.reserve1 / selectedPool.reserve0).toFixed(6)}{" "}
                        {getTokenById(selectedPool.token1).symbol}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Share of Pool</span>
                      <span>
                        {(
                          (Number.parseFloat(token1Amount) /
                            (selectedPool.reserve1 + Number.parseFloat(token1Amount))) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expected LP Tokens</span>
                      <span>
                        {Math.sqrt(Number.parseFloat(token0Amount) * Number.parseFloat(token1Amount)).toFixed(6)}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  className="gold-button w-full"
                  disabled={!token0Amount || !token1Amount || approving || adding}
                  onClick={() => handleAddLiquidity(selectedPool)}
                >
                  {approving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Approving...
                    </>
                  ) : adding ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Adding Liquidity...
                    </>
                  ) : (
                    "Add Liquidity"
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Remove Liquidity Modal */}
      {showRemoveLiquidity && selectedPool && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-gold rounded-lg w-full max-w-md p-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Remove Liquidity</h3>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
                onClick={() => {
                  setShowRemoveLiquidity(false)
                  setRemovePercentage(50)
                  setSelectedPool(null)
                  setTransactionStatus(null)
                }}
              >
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Button>
            </div>

            {transactionStatus ? (
              <div className="text-center py-8">
                {transactionStatus === "removing" && (
                  <>
                    <RefreshCw className="h-16 w-16 text-gold mx-auto mb-4 animate-spin" />
                    <h3 className="text-xl font-bold mb-2">Removing Liquidity</h3>
                    <p className="text-gray-400 mb-2">Removing your liquidity from the pool...</p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                      <div className="bg-gold h-2 rounded-full w-2/3 animate-pulse"></div>
                    </div>
                    <p className="text-sm text-gray-500">This may take a few moments</p>
                  </>
                )}

                {transactionStatus === "success" && (
                  <>
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Success!</h3>
                    <p className="text-gray-400 mb-6">Your liquidity has been removed successfully</p>
                    <Button
                      className="gold-button w-full"
                      onClick={() => {
                        setShowRemoveLiquidity(false)
                        setRemovePercentage(50)
                        setSelectedPool(null)
                        setTransactionStatus(null)
                      }}
                    >
                      Close
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center mb-4">
                  <div className="flex -space-x-4">
                    <img
                      src={getTokenById(selectedPool.token0).icon || "/placeholder.svg"}
                      alt={getTokenById(selectedPool.token0).symbol}
                      className="w-12 h-12 rounded-full border-2 border-black"
                    />
                    <img
                      src={getTokenById(selectedPool.token1).icon || "/placeholder.svg"}
                      alt={getTokenById(selectedPool.token1).symbol}
                      className="w-12 h-12 rounded-full border-2 border-black"
                    />
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h4 className="font-bold">
                    {getTokenById(selectedPool.token0).symbol}-{getTokenById(selectedPool.token1).symbol} Pool
                  </h4>
                  <div className="text-sm text-gray-400">
                    Your liquidity: ${formatCurrency(selectedPool.myLiquidity)}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">Amount to Remove</label>
                    <span className="text-sm font-medium text-gold">{removePercentage}%</span>
                  </div>
                  <Slider
                    value={[removePercentage]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={(value) => setRemovePercentage(value[0])}
                    className="mb-4"
                  />
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gold/50 text-gold hover:bg-gold/10"
                      onClick={() => setRemovePercentage(25)}
                    >
                      25%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gold/50 text-gold hover:bg-gold/10"
                      onClick={() => setRemovePercentage(50)}
                    >
                      50%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gold/50 text-gold hover:bg-gold/10"
                      onClick={() => setRemovePercentage(75)}
                    >
                      75%
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gold/50 text-gold hover:bg-gold/10"
                      onClick={() => setRemovePercentage(100)}
                    >
                      Max
                    </Button>
                  </div>
                </div>

                <div className="bg-gold/5 rounded-lg p-4 mb-6">
                  <h4 className="font-medium mb-3">You Will Receive</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <img
                          src={getTokenById(selectedPool.token0).icon || "/placeholder.svg"}
                          alt={getTokenById(selectedPool.token0).symbol}
                          className="w-5 h-5 rounded-full mr-2"
                        />
                        <span>{getTokenById(selectedPool.token0).symbol}</span>
                      </div>
                      <span>{formatCurrency((selectedPool.myToken0 * removePercentage) / 100)}</span>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <img
                          src={getTokenById(selectedPool.token1).icon || "/placeholder.svg"}
                          alt={getTokenById(selectedPool.token1).symbol}
                          className="w-5 h-5 rounded-full mr-2"
                        />
                        <span>{getTokenById(selectedPool.token1).symbol}</span>
                      </div>
                      <span>{formatCurrency((selectedPool.myToken1 * removePercentage) / 100)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="gold-button w-full"
                  disabled={removing}
                  onClick={() => handleRemoveLiquidity(selectedPool)}
                >
                  {removing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Removing Liquidity...
                    </>
                  ) : (
                    "Remove Liquidity"
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
