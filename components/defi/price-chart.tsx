"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface PricePoint {
  timestamp: string
  price: number
  volume: number
}

interface PriceChartProps {
  tokenSymbol: string
  tokenName: string
  currentPrice: number
  priceChange: number
}

export function PriceChart({ tokenSymbol, tokenName, currentPrice, priceChange }: PriceChartProps) {
  const [timeframe, setTimeframe] = useState("24h")
  const [chartData, setChartData] = useState<PricePoint[]>([])
  const chartRef = useRef<HTMLDivElement>(null)

  // Generate mock chart data based on timeframe
  useEffect(() => {
    const generateMockData = () => {
      const data: PricePoint[] = []
      const now = new Date()
      let points = 24
      let interval = 60 * 60 * 1000 // 1 hour in milliseconds

      switch (timeframe) {
        case "24h":
          points = 24
          interval = 60 * 60 * 1000 // 1 hour
          break
        case "7d":
          points = 7
          interval = 24 * 60 * 60 * 1000 // 1 day
          break
        case "30d":
          points = 30
          interval = 24 * 60 * 60 * 1000 // 1 day
          break
        case "90d":
          points = 90
          interval = 24 * 60 * 60 * 1000 // 1 day
          break
        case "1y":
          points = 12
          interval = 30 * 24 * 60 * 60 * 1000 // 1 month
          break
      }

      // Base price and volatility based on timeframe
      const basePrice = currentPrice
      let volatility = 0.02 // 2% volatility for short timeframes

      if (timeframe === "7d") volatility = 0.05
      if (timeframe === "30d") volatility = 0.1
      if (timeframe === "90d") volatility = 0.15
      if (timeframe === "1y") volatility = 0.25

      // Generate data points
      for (let i = points - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * interval)

        // Create some price movement based on the overall trend (priceChange)
        const trendFactor = priceChange > 0 ? 1 : -1
        const randomFactor = (Math.random() - 0.5) * 2 // -1 to 1

        // Calculate price with some randomness but following the trend
        const priceFactor = 1 + ((i / points) * (priceChange / 100) * trendFactor + randomFactor * volatility)
        const price = basePrice * priceFactor

        // Volume is also somewhat random but correlates with price changes
        const volume = 1000000 + Math.random() * 500000 * (1 + Math.abs(randomFactor))

        data.push({
          timestamp: formatTimestamp(date, timeframe),
          price: Number(price.toFixed(2)),
          volume: Math.round(volume),
        })
      }

      return data
    }

    setChartData(generateMockData())
  }, [timeframe, currentPrice, priceChange])

  // Format timestamp based on timeframe
  const formatTimestamp = (date: Date, timeframe: string): string => {
    switch (timeframe) {
      case "24h":
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      case "7d":
        return date.toLocaleDateString([], { weekday: "short" })
      case "30d":
      case "90d":
        return date.toLocaleDateString([], { month: "short", day: "numeric" })
      case "1y":
        return date.toLocaleDateString([], { month: "short", year: "2-digit" })
      default:
        return date.toLocaleDateString()
    }
  }

  // Format tooltip values
  const formatTooltipValue = (value: number) => {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Format volume values
  const formatVolumeValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`
    }
    return `$${value}`
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-900 p-3 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg">
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="font-medium text-primary">Price: {formatTooltipValue(payload[0].value)}</p>
          <p className="text-gray-500 text-sm">Volume: {formatVolumeValue(payload[1].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{tokenSymbol} Price Chart</CardTitle>
          <div className="text-right">
            <div className="text-2xl font-bold">
              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-sm ${priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
              {priceChange >= 0 ? "+" : ""}
              {priceChange.toFixed(2)}%
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="24h" value={timeframe} onValueChange={setTimeframe} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="24h">24H</TabsTrigger>
            <TabsTrigger value="7d">7D</TabsTrigger>
            <TabsTrigger value="30d">30D</TabsTrigger>
            <TabsTrigger value="90d">90D</TabsTrigger>
            <TabsTrigger value="1y">1Y</TabsTrigger>
          </TabsList>
          <div className="h-[300px]" ref={chartRef}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#374151", opacity: 0.3 }}
                />
                <YAxis
                  yAxisId="price"
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#374151", opacity: 0.3 }}
                  tickFormatter={formatTooltipValue}
                />
                <YAxis
                  yAxisId="volume"
                  orientation="right"
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#374151", opacity: 0.3 }}
                  tickFormatter={formatVolumeValue}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="price"
                  name="Price"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="volume"
                  type="monotone"
                  dataKey="volume"
                  name="Volume"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default PriceChart
