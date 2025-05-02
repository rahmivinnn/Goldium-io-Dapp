"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PriceChart() {
  const [timeframe, setTimeframe] = useState("1W")
  const [selectedToken, setSelectedToken] = useState("GOLD")

  // Safe formatter function
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return "N/A"
    try {
      return `$${value.toFixed(2)}`
    } catch (error) {
      return `$${value}`
    }
  }

  // Mock data
  const mockPrices = {
    GOLD: 5.75,
    SOL: 150.0,
    USDC: 1.0,
  }

  const currentPrice = mockPrices[selectedToken as keyof typeof mockPrices] || 0
  const change = currentPrice * 0.05 // Mock 5% change
  const isPositive = true

  return (
    <div className="w-full">
      <div className="flex flex-col mb-4">
        <Tabs defaultValue="GOLD" onValueChange={setSelectedToken}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="GOLD">GOLD</TabsTrigger>
            <TabsTrigger value="SOL">SOL</TabsTrigger>
            <TabsTrigger value="USDC">USDC</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col mb-4">
          <div className="text-3xl font-bold">{formatCurrency(currentPrice)}</div>
          <div className={`text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? "+" : ""}
            {formatCurrency(change)} ({isPositive ? "+" : ""}
            {5.0}%)
          </div>
        </div>

        <Tabs defaultValue="1W" onValueChange={setTimeframe}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="1D">1D</TabsTrigger>
            <TabsTrigger value="1W">1W</TabsTrigger>
            <TabsTrigger value="1M">1M</TabsTrigger>
            <TabsTrigger value="3M">3M</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="h-[200px] bg-black/20 rounded-md flex items-center justify-center">
        <p className="text-amber-500">Chart visualization</p>
      </div>
    </div>
  )
}
