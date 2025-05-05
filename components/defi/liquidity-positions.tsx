"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/hooks/use-wallet"
import { WalletConnectOverlay } from "@/components/wallet-connect-overlay"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Token type definition
interface Token {
  id: string
  name: string
  symbol: string
  icon: string
  price: number
}

// Liquidity Position type definition
interface LiquidityPosition {
  id: string
  token1: Token
  token2: Token
  token1Amount: number
  token2Amount: number
  lpTokens: number
  shareOfPool: number
  apr: number
  totalValue: number
  rewards: number
  createdAt: Date
}

// Mock data for liquidity positions
const mockLiquidityPositions: LiquidityPosition[] = [
  {
    id: "lp-1",
    token1: {
      id: "gold",
      name: "Goldium",
      symbol: "GOLD",
      icon: "/gold-logo.png",
      price: 2.34,
    },
    token2: {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      icon: "/ethereum-crystal.png",
      price: 3200,
    },
    token1Amount: 500,
    token2Amount: 0.365,
    lpTokens: 1250.75,
    shareOfPool: 0.12,
    apr: 24.5,
    totalValue: 2350,
    rewards: 12.5,
    createdAt: new Date("2023-10-15"),
  },
  {
    id: "lp-2",
    token1: {
      id: "gold",
      name: "Goldium",
      symbol: "GOLD",
      icon: "/gold-logo.png",
      price: 2.34,
    },
    token2: {
      id: "usdt",
      name: "Tether",
      symbol: "USDT",
      icon: "/abstract-tether.png",
      price: 1,
    },
    token1Amount: 1200,
    token2Amount: 2808,
    lpTokens: 2808,
    shareOfPool: 0.35,
    apr: 18.2,
    totalValue: 5616,
    rewards: 28.4,
    createdAt: new Date("2023-11-05"),
  },
  {
    id: "lp-3",
    token1: {
      id: "btc",
      name: "Bitcoin",
      symbol: "BTC",
      icon: "/bitcoin-symbol-gold.png",
      price: 65000,
    },
    token2: {
      id: "usdc",
      name: "USD Coin",
      symbol: "USDC",
      icon: "/usdc-digital-currency.png",
      price: 1,
    },
    token1Amount: 0.05,
    token2Amount: 3250,
    lpTokens: 3250,
    shareOfPool: 0.08,
    apr: 15.7,
    totalValue: 6500,
    rewards: 18.2,
    createdAt: new Date("2023-12-20"),
  },
]

export function LiquidityPositions() {
  const { toast } = useToast()
  const { isConnected } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [expandedPosition, setExpandedPosition] = useState<string | null>(null)
  const [positions, setPositions] = useState<LiquidityPosition[]>(mockLiquidityPositions)
  const [activeTab, setActiveTab] = useState<string>("active")

  // Toggle position expansion
  const toggleExpand = (positionId: string) => {
    if (expandedPosition === positionId) {
      setExpandedPosition(null)
    } else {
      setExpandedPosition(positionId)
    }
  }

  // Handle removing liquidity
  const handleRemoveLiquidity = async (position: LiquidityPosition, percentage: number) => {
    if (!isConnected) return

    setIsLoading(true)

    try {
      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const token1Amount = (position.token1Amount * percentage) / 100
      const token2Amount = (position.token2Amount * percentage) / 100

      toast({
        title: "Liquidity Removed Successfully",
        description: `Removed ${token1Amount.toFixed(4)} ${position.token1.symbol} and ${token2Amount.toFixed(4)} ${position.token2.symbol} from the pool.`,
        variant: "default",
      })

      // Update positions (simulate removal)
      if (percentage === 100) {
        setPositions(positions.filter((p) => p.id !== position.id))
      } else {
        setPositions(
          positions.map((p) => {
            if (p.id === position.id) {
              return {
                ...p,
                token1Amount: p.token1Amount * (1 - percentage / 100),
                token2Amount: p.token2Amount * (1 - percentage / 100),
                lpTokens: p.lpTokens * (1 - percentage / 100),
                totalValue: p.totalValue * (1 - percentage / 100),
                rewards: p.rewards * (1 - percentage / 100),
              }
            }
            return p
          }),
        )
      }
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Failed to remove liquidity. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle claiming rewards
  const handleClaimRewards = async (position: LiquidityPosition) => {
    if (!isConnected) return

    setIsLoading(true)

    try {
      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Rewards Claimed Successfully",
        description: `Claimed ${position.rewards.toFixed(4)} GOLD rewards.`,
        variant: "default",
      })

      // Update positions (simulate claiming)
      setPositions(
        positions.map((p) => {
          if (p.id === position.id) {
            return {
              ...p,
              rewards: 0,
            }
          }
          return p
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

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  // Calculate total value of all positions
  const totalValue = positions.reduce((sum, position) => sum + position.totalValue, 0)

  // Calculate total rewards of all positions
  const totalRewards = positions.reduce((sum, position) => sum + position.rewards, 0)

  // Filter positions based on active tab
  const filteredPositions = positions.filter((position) => {
    if (activeTab === "active") {
      return position.token1Amount > 0 && position.token2Amount > 0
    }
    return true
  })

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      {!isConnected && <WalletConnectOverlay />}

      <Card className="border-2 border-amber-500/20 bg-gradient-to-b from-amber-50/10 to-amber-100/10 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-amber-800">Your Liquidity Positions</CardTitle>
          <CardDescription className="text-amber-700">
            Manage your liquidity positions and claim rewards
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white/80 border border-amber-200">
              <CardContent className="p-4">
                <div className="text-sm text-amber-700 mb-1">Total Value Locked</div>
                <div className="text-2xl font-bold text-amber-900">{formatCurrency(totalValue)}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 border border-amber-200">
              <CardContent className="p-4">
                <div className="text-sm text-amber-700 mb-1">Total Positions</div>
                <div className="text-2xl font-bold text-amber-900">{positions.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 border border-amber-200">
              <CardContent className="p-4">
                <div className="text-sm text-amber-700 mb-1">Pending Rewards</div>
                <div className="text-2xl font-bold text-amber-900">{totalRewards.toFixed(2)} GOLD</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="active" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-amber-100/50">
              <TabsTrigger value="active" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                Active Positions
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                All Positions
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Positions List */}
          <div className="space-y-4">{/* Add positions here */}</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LiquidityPositions
