"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useNetwork } from "@/contexts/network-context"
import { getBurnStatistics } from "@/services/token-service"
import { Flame, TrendingUp, Calendar, Users } from "lucide-react"

interface BurnStats {
  totalBurned: number
  burnRate: {
    daily: number
    weekly: number
    monthly: number
  }
  largestBurn: {
    amount: number
    date: string
    txSignature: string
  }
  topBurners: {
    address: string
    amount: number
  }[]
  burnHistory: {
    date: string
    amount: number
  }[]
}

export function BurnStatistics() {
  const { network } = useNetwork()
  const [stats, setStats] = useState<BurnStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const data = await getBurnStatistics(network)
        setStats(data)
      } catch (error) {
        console.error("Error fetching burn statistics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [network])

  if (loading || !stats) {
    return (
      <Card className="border-gold bg-slate-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl gold-gradient">Burn Statistics</CardTitle>
          <CardDescription>Loading burn statistics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-800 animate-pulse rounded-md"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gold bg-slate-900/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl gold-gradient flex items-center gap-2">
          <Flame className="h-5 w-5 text-red-500" />
          Burn Statistics
        </CardTitle>
        <CardDescription>Overview of GOLD token burning activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Total Burned</span>
            <span className="font-bold text-red-500">{stats.totalBurned.toLocaleString()} GOLD</span>
          </div>
          <Progress value={(stats.totalBurned / 1000000) * 100} className="h-2 bg-gray-700" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{((stats.totalBurned / 1000000) * 100).toFixed(2)}% of supply</span>
            <span>{(1000000 - stats.totalBurned).toLocaleString()} remaining</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/40 rounded-lg p-3 border border-gold/20">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-gold" />
              <span className="text-sm text-gray-400">Daily Burn Rate</span>
            </div>
            <div className="font-bold">{stats.burnRate.daily.toLocaleString()} GOLD</div>
          </div>
          <div className="bg-black/40 rounded-lg p-3 border border-gold/20">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-gold" />
              <span className="text-sm text-gray-400">Monthly Burn</span>
            </div>
            <div className="font-bold">{stats.burnRate.monthly.toLocaleString()} GOLD</div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Flame className="h-4 w-4 text-red-500" />
            Largest Burn Transaction
          </h4>
          <div className="bg-black/40 rounded-lg p-3 border border-red-500/20">
            <div className="flex justify-between items-center">
              <span className="font-bold text-red-500">{stats.largestBurn.amount.toLocaleString()} GOLD</span>
              <span className="text-xs text-gray-500">{stats.largestBurn.date}</span>
            </div>
            <div className="mt-1">
              <a
                href={`${
                  network === "mainnet" ? "https://explorer.solana.com" : "https://explorer.solana.com/?cluster=devnet"
                }/tx/${stats.largestBurn.txSignature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gold hover:underline"
              >
                View transaction
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-gold" />
            Top Burners
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {stats.topBurners.map((burner, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm bg-black/30 p-2 rounded border border-gold/10"
              >
                <span className="text-xs truncate w-32">
                  {burner.address.slice(0, 6)}...{burner.address.slice(-4)}
                </span>
                <span className="font-medium text-red-500">{burner.amount.toLocaleString()} GOLD</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Burn History (Last 30 Days)</h4>
          <div className="h-32 relative">
            <div className="absolute inset-0 flex items-end">
              {stats.burnHistory.map((day, index) => {
                const maxAmount = Math.max(...stats.burnHistory.map((d) => d.amount))
                const height = day.amount > 0 ? (day.amount / maxAmount) * 100 : 0
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center justify-end group"
                    title={`${day.date}: ${day.amount.toLocaleString()} GOLD`}
                  >
                    <div
                      className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                    {index % 5 === 0 && (
                      <span className="text-[8px] text-gray-500 mt-1 rotate-90 origin-top-left absolute bottom-0 translate-y-4">
                        {day.date.split(" ")[0]}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
