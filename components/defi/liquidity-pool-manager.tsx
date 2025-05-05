"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import { WalletConnectOverlay } from "@/components/wallet-connect-overlay"
import AddLiquidity from "./add-liquidity"
import LiquidityPositions from "./liquidity-positions"
import { Plus, Minus, RefreshCw, CheckCircle2, TrendingUp, Wallet } from "lucide-react"
import { Orbitron } from "next/font/google"

const orbitron = Orbitron({ subsets: ["latin"] })

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
  const { connected, address, isConnected } = useWallet()
  const [activeTab, setActiveTab] = useState("add")
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
    <div className="mt-12 pt-8">
      <h1
        className={`text-4xl font-bold mb-8 text-center ${orbitron.className} tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600`}
      >
        Liquidity Pool Manager
      </h1>

      <Card className="border-amber-200/20 bg-black/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Manage Liquidity</CardTitle>
          <CardDescription>Add or remove liquidity from pools to earn fees</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="add" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="add">Add Liquidity</TabsTrigger>
              <TabsTrigger value="positions">Your Positions</TabsTrigger>
            </TabsList>
            <TabsContent value="add" className="relative">
              <AddLiquidity
                TOKENS={TOKENS}
                INITIAL_POOLS={INITIAL_POOLS}
                getTokenById={getTokenById}
                formatCurrency={formatCurrency}
                connected={connected}
                toast={toast}
                token0Amount={token0Amount}
                token1Amount={token1Amount}
                handleToken0Change={handleToken0Change}
                handleToken1Change={handleToken1Change}
                selectedPool={selectedPool}
                approving={approving}
                adding={adding}
                handleAddLiquidity={handleAddLiquidity}
                RefreshCw={RefreshCw}
                CheckCircle2={CheckCircle2}
                Button={Button}
                Input={Input}
                Plus={Plus}
                useState={useState}
                transactionStatus={transactionStatus}
                setTransactionStatus={setTransactionStatus}
                setToken0Amount={setToken0Amount}
                setToken1Amount={setToken1Amount}
                setSelectedPool={setSelectedPool}
              />
              {!isConnected && <WalletConnectOverlay />}
            </TabsContent>
            <TabsContent value="positions" className="relative">
              <LiquidityPositions
                TOKENS={TOKENS}
                INITIAL_POOLS={INITIAL_POOLS}
                getTokenById={getTokenById}
                formatCurrency={formatCurrency}
                pools={pools}
                loading={loading}
                TrendingUp={TrendingUp}
                Wallet={Wallet}
                Plus={Plus}
                Minus={Minus}
                Button={Button}
                useState={useState}
                useEffect={useEffect}
                Skeleton={Skeleton}
                setShowAddLiquidity={setShowAddLiquidity}
                setShowRemoveLiquidity={setShowRemoveLiquidity}
                setSelectedPool={setSelectedPool}
                setActiveTab={setActiveTab}
              />
              {!isConnected && <WalletConnectOverlay />}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
