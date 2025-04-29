"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Repeat, ArrowDownUp, Info, RefreshCw, Clock } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { useToast } from "@/hooks/use-toast"
import GoldBalance from "@/components/gold-balance"

// Sample token data
const TOKENS = [
  { id: "gold", name: "GOLD", symbol: "GOLD", balance: 1850, price: 0.85, icon: "/golden-g-logo.png" },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    balance: 1.25,
    price: 3200,
    icon: "/placeholder.svg?height=32&width=32&query=ethereum logo",
  },
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    balance: 0.05,
    price: 62000,
    icon: "/placeholder.svg?height=32&width=32&query=bitcoin logo",
  },
  {
    id: "usdt",
    name: "Tether",
    symbol: "USDT",
    balance: 2500,
    price: 1,
    icon: "/placeholder.svg?height=32&width=32&query=tether logo",
  },
  {
    id: "usdc",
    name: "USD Coin",
    symbol: "USDC",
    balance: 1800,
    price: 1,
    icon: "/placeholder.svg?height=32&width=32&query=usdc logo",
  },
]

// Sample transaction history
const TRANSACTION_HISTORY = [
  {
    id: "tx1",
    type: "swap",
    fromToken: "GOLD",
    toToken: "ETH",
    fromAmount: 500,
    toAmount: 0.13,
    status: "completed",
    timestamp: "2025-04-29T10:15:00Z",
  },
  {
    id: "tx2",
    type: "swap",
    fromToken: "ETH",
    toToken: "GOLD",
    fromAmount: 0.2,
    toAmount: 750,
    status: "completed",
    timestamp: "2025-04-28T18:30:00Z",
  },
  {
    id: "tx3",
    type: "swap",
    fromToken: "USDT",
    toToken: "GOLD",
    fromAmount: 1000,
    toAmount: 1176.5,
    status: "completed",
    timestamp: "2025-04-27T14:45:00Z",
  },
]

export default function Swap() {
  const { connected } = useWallet()
  const { toast } = useToast()
  const [fromToken, setFromToken] = useState(TOKENS[0])
  const [toToken, setToToken] = useState(TOKENS[1])
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [slippage, setSlippage] = useState("0.5")
  const [swapping, setSwapping] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Calculate exchange rate
  const getExchangeRate = (from, to) => {
    const fromTokenData = TOKENS.find((t) => t.id === from.id)
    const toTokenData = TOKENS.find((t) => t.id === to.id)
    return fromTokenData.price / toTokenData.price
  }

  // Handle from amount change
  const handleFromAmountChange = (value) => {
    setFromAmount(value)
    if (value && !isNaN(value)) {
      const rate = getExchangeRate(fromToken, toToken)
      setToAmount((Number.parseFloat(value) * rate).toFixed(6))
    } else {
      setToAmount("")
    }
  }

  // Handle to amount change
  const handleToAmountChange = (value) => {
    setToAmount(value)
    if (value && !isNaN(value)) {
      const rate = getExchangeRate(toToken, fromToken)
      setFromAmount((Number.parseFloat(value) * rate).toFixed(6))
    } else {
      setFromAmount("")
    }
  }

  // Swap tokens
  const swapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  // Execute swap
  const executeSwap = () => {
    if (!fromAmount || !toAmount || isNaN(Number.parseFloat(fromAmount)) || isNaN(Number.parseFloat(toAmount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter valid amounts to swap.",
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(fromAmount) > fromToken.balance) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough ${fromToken.symbol} to complete this swap.`,
        variant: "destructive",
      })
      return
    }

    setSwapping(true)
    toast({
      title: "Swap Initiated",
      description: "Processing your swap request...",
    })

    // Simulate swap delay
    setTimeout(() => {
      setSwapping(false)
      toast({
        title: "Swap Successful",
        description: `Successfully swapped ${fromAmount} ${fromToken.symbol} for ${toAmount} ${toToken.symbol}.`,
      })

      // Reset form
      setFromAmount("")
      setToAmount("")
    }, 2000)
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>
        <p className="text-gray-400 mb-8">Please connect your wallet to access the token swap feature.</p>
        <ConnectWalletButton className="gold-button" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Token Swap</h1>
          <p className="text-gray-400">Swap GOLD tokens for other cryptocurrencies</p>
        </div>
        <GoldBalance compact />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-gold bg-black">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Repeat className="mr-2 h-5 w-5 text-gold" />
                  Swap Tokens
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-gold"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {showSettings && (
                <div className="mb-6 p-4 bg-gold/5 rounded-lg">
                  <h3 className="text-sm font-medium mb-3">Transaction Settings</h3>
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-gray-400 mr-2">Slippage Tolerance</span>
                    <Info className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="flex space-x-2 ml-auto">
                      {["0.1", "0.5", "1.0"].map((value) => (
                        <Button
                          key={value}
                          variant={slippage === value ? "default" : "outline"}
                          size="sm"
                          className={
                            slippage === value
                              ? "bg-gold text-black h-7"
                              : "border-gold/50 text-white hover:bg-gold/10 h-7"
                          }
                          onClick={() => setSlippage(value)}
                        >
                          {value}%
                        </Button>
                      ))}
                      <div className="relative">
                        <Input
                          type="number"
                          value={slippage}
                          onChange={(e) => setSlippage(e.target.value)}
                          className="w-16 h-7 bg-black border-gold/50 focus:border-gold"
                        />
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm">%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-400 mr-2">Transaction Deadline</span>
                    <Info className="h-4 w-4 text-gray-400" />
                    <div className="flex items-center ml-auto">
                      <Input
                        type="number"
                        defaultValue="20"
                        className="w-16 h-7 bg-black border-gold/50 focus:border-gold"
                      />
                      <span className="ml-2 text-sm text-gray-400">minutes</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">From</label>
                  <span className="text-sm text-gray-400">
                    Balance: {fromToken.balance} {fromToken.symbol}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={fromAmount}
                        onChange={(e) => handleFromAmountChange(e.target.value)}
                        className="bg-black border-gold/50 focus:border-gold pr-20"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gold hover:text-gold-hover"
                        onClick={() => handleFromAmountChange(fromToken.balance.toString())}
                      >
                        MAX
                      </Button>
                    </div>
                  </div>
                  <Select
                    value={fromToken.id}
                    onValueChange={(value) => {
                      const token = TOKENS.find((t) => t.id === value)
                      if (token.id === toToken.id) {
                        // Swap if selecting the same token
                        setToToken(fromToken)
                      }
                      setFromToken(token)
                      handleFromAmountChange(fromAmount)
                    }}
                  >
                    <SelectTrigger className="w-[180px] bg-black border-gold/50 focus:border-gold">
                      <SelectValue placeholder="Select token">
                        <div className="flex items-center">
                          <img
                            src={fromToken.icon || "/placeholder.svg"}
                            alt={fromToken.symbol}
                            className="w-5 h-5 mr-2 rounded-full"
                          />
                          {fromToken.symbol}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-black border-gold">
                      {TOKENS.map((token) => (
                        <SelectItem key={token.id} value={token.id}>
                          <div className="flex items-center">
                            <img
                              src={token.icon || "/placeholder.svg"}
                              alt={token.symbol}
                              className="w-5 h-5 mr-2 rounded-full"
                            />
                            {token.symbol}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-center my-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-gold/50 text-gold hover:bg-gold/10"
                  onClick={swapTokens}
                >
                  <ArrowDownUp className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">To</label>
                  <span className="text-sm text-gray-400">
                    Balance: {toToken.balance} {toToken.symbol}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={toAmount}
                        onChange={(e) => handleToAmountChange(e.target.value)}
                        className="bg-black border-gold/50 focus:border-gold pr-20"
                      />
                    </div>
                  </div>
                  <Select
                    value={toToken.id}
                    onValueChange={(value) => {
                      const token = TOKENS.find((t) => t.id === value)
                      if (token.id === fromToken.id) {
                        // Swap if selecting the same token
                        setFromToken(toToken)
                      }
                      setToToken(token)
                      handleFromAmountChange(fromAmount)
                    }}
                  >
                    <SelectTrigger className="w-[180px] bg-black border-gold/50 focus:border-gold">
                      <SelectValue placeholder="Select token">
                        <div className="flex items-center">
                          <img
                            src={toToken.icon || "/placeholder.svg"}
                            alt={toToken.symbol}
                            className="w-5 h-5 mr-2 rounded-full"
                          />
                          {toToken.symbol}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="bg-black border-gold">
                      {TOKENS.map((token) => (
                        <SelectItem key={token.id} value={token.id}>
                          <div className="flex items-center">
                            <img
                              src={token.icon || "/placeholder.svg"}
                              alt={token.symbol}
                              className="w-5 h-5 mr-2 rounded-full"
                            />
                            {token.symbol}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {fromAmount && toAmount && (
                <div className="bg-gold/5 rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Exchange Rate</span>
                    <span>
                      1 {fromToken.symbol} = {getExchangeRate(fromToken, toToken).toFixed(6)} {toToken.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Expected Output</span>
                    <span>
                      {toAmount} {toToken.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Price Impact</span>
                    <span className="text-green-500">{"< 0.1%"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Slippage Tolerance</span>
                    <span>{slippage}%</span>
                  </div>
                </div>
              )}

              <Button
                className="gold-button w-full"
                disabled={!fromAmount || !toAmount || swapping}
                onClick={executeSwap}
              >
                {swapping ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Swapping...
                  </>
                ) : (
                  "Swap"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-gold bg-black">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-gold" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {TRANSACTION_HISTORY.length > 0 ? (
                <div className="space-y-4">
                  {TRANSACTION_HISTORY.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex flex-col p-3 border border-gold/20 rounded-lg hover:bg-gold/5 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium">
                          Swap {tx.fromToken} to {tx.toToken}
                        </div>
                        <div className="text-xs text-gray-400">{formatDate(tx.timestamp)}</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          {tx.fromAmount} {tx.fromToken} → {tx.toAmount} {tx.toToken}
                        </div>
                        <div className="text-xs flex items-center text-green-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                          {tx.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-10 w-10 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">No transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-gold bg-black mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Info className="mr-2 h-5 w-5 text-gold" />
                About Swapping
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <p>
                  Swap tokens instantly with low fees. Our smart routing system ensures you get the best rates across
                  multiple liquidity sources.
                </p>
                <div>
                  <h4 className="font-medium mb-1">Key Features:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-gray-400">
                    <li>Low 0.3% swap fee</li>
                    <li>Optimized routing for best prices</li>
                    <li>Support for major tokens</li>
                    <li>Fast transaction processing</li>
                  </ul>
                </div>
                <p className="text-gray-400">
                  Note: All swaps are subject to market conditions. Slippage may occur during times of high volatility.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="liquidity" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="liquidity" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Liquidity Pools
            </TabsTrigger>
            <TabsTrigger value="farms" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Yield Farms
            </TabsTrigger>
          </TabsList>

          <TabsContent value="liquidity" className="mt-0">
            <Card className="border-gold bg-black">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { pair: "GOLD-ETH", tvl: "$1.2M", apr: "12.5%", myLiquidity: "$5,250" },
                    { pair: "GOLD-USDT", tvl: "$850K", apr: "8.2%", myLiquidity: "$0" },
                    { pair: "GOLD-BTC", tvl: "$2.1M", apr: "10.8%", myLiquidity: "$0" },
                  ].map((pool) => (
                    <div key={pool.pair} className="border border-gold/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold">{pool.pair}</h3>
                        <div className="text-xs text-green-500 font-medium">{pool.apr} APR</div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Total Value Locked</span>
                          <span className="font-medium">{pool.tvl}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">My Liquidity</span>
                          <span className="font-medium">{pool.myLiquidity}</span>
                        </div>
                      </div>
                      <Button
                        className={
                          pool.myLiquidity !== "$0"
                            ? "gold-button w-full"
                            : "w-full border-gold text-gold hover:bg-gold/10"
                        }
                        variant={pool.myLiquidity !== "$0" ? "default" : "outline"}
                        onClick={() => {
                          toast({
                            title: "Liquidity Pool",
                            description: `${pool.myLiquidity !== "$0" ? "Manage" : "Add"} liquidity for ${pool.pair} pool`,
                          })
                        }}
                      >
                        {pool.myLiquidity !== "$0" ? "Manage" : "Add Liquidity"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="farms" className="mt-0">
            <Card className="border-gold bg-black">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { name: "GOLD Staking", tvl: "$3.5M", apr: "15.2%", myStake: "500 GOLD", rewards: "18.5 GOLD" },
                    { name: "GOLD-ETH LP", tvl: "$1.2M", apr: "24.8%", myStake: "$0", rewards: "0 GOLD" },
                  ].map((farm) => (
                    <div key={farm.name} className="border border-gold/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold">{farm.name}</h3>
                        <div className="text-xs text-green-500 font-medium">{farm.apr} APR</div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Total Value Locked</span>
                          <span className="font-medium">{farm.tvl}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">My Stake</span>
                          <span className="font-medium">{farm.myStake}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400 text-sm">Pending Rewards</span>
                          <span className="font-medium text-gold">{farm.rewards}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className={
                            farm.myStake !== "$0" && farm.myStake !== "0 GOLD"
                              ? "gold-button flex-1"
                              : "flex-1 border-gold text-gold hover:bg-gold/10"
                          }
                          variant={farm.myStake !== "$0" && farm.myStake !== "0 GOLD" ? "default" : "outline"}
                          onClick={() => {
                            toast({
                              title: "Farm",
                              description: `${farm.myStake !== "$0" && farm.myStake !== "0 GOLD" ? "Manage" : "Stake in"} ${farm.name} farm`,
                            })
                          }}
                        >
                          {farm.myStake !== "$0" && farm.myStake !== "0 GOLD" ? "Manage" : "Stake"}
                        </Button>
                        {farm.rewards !== "0 GOLD" && (
                          <Button
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => {
                              toast({
                                title: "Rewards Claimed",
                                description: `Successfully claimed ${farm.rewards}`,
                              })
                            }}
                          >
                            Claim
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
