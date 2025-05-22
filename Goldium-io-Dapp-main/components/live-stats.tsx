"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Coins, Users, ShoppingBag, TrendingUp } from "lucide-react"

export default function LiveStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalGold: 0,
    goldPrice: 0,
    nftsSold: 0,
    stakingAPR: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        totalUsers: 12568,
        activeUsers: 1842,
        totalGold: 5250000,
        goldPrice: 0.85,
        nftsSold: 8745,
        stakingAPR: 8.2,
      })
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Simulate live updates
  useEffect(() => {
    if (loading) return

    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        totalGold: prev.totalGold + Math.floor(Math.random() * 1000),
        goldPrice: prev.goldPrice + (Math.random() * 0.02 - 0.01),
        nftsSold: prev.nftsSold + Math.floor(Math.random() * 2),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [loading])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-gold bg-black">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Users</h3>
            <Users className="h-5 w-5 text-gold" />
          </div>
          {loading ? (
            <div className="h-16 animate-pulse bg-gold/10 rounded"></div>
          ) : (
            <>
              <div className="text-3xl font-bold text-gold mb-2">{stats.totalUsers.toLocaleString()}</div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Active Now</span>
                <span className="font-medium">{stats.activeUsers.toLocaleString()}</span>
              </div>
              <Progress value={(stats.activeUsers / stats.totalUsers) * 100} className="h-1 mt-2" />
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-gold bg-black">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">GOLD Token</h3>
            <Coins className="h-5 w-5 text-gold" />
          </div>
          {loading ? (
            <div className="h-16 animate-pulse bg-gold/10 rounded"></div>
          ) : (
            <>
              <div className="text-3xl font-bold text-gold mb-2">${stats.goldPrice.toFixed(2)}</div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Total Supply</span>
                <span className="font-medium">{(stats.totalGold / 1000000).toFixed(2)}M GOLD</span>
              </div>
              <Progress value={75} className="h-1 mt-2" />
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-gold bg-black">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">NFT Market</h3>
            <ShoppingBag className="h-5 w-5 text-gold" />
          </div>
          {loading ? (
            <div className="h-16 animate-pulse bg-gold/10 rounded"></div>
          ) : (
            <>
              <div className="text-3xl font-bold text-gold mb-2">{stats.nftsSold.toLocaleString()}</div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Total NFTs</span>
                <span className="font-medium">12,500</span>
              </div>
              <Progress value={(stats.nftsSold / 12500) * 100} className="h-1 mt-2" />
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-gold bg-black">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Staking APR</h3>
            <TrendingUp className="h-5 w-5 text-gold" />
          </div>
          {loading ? (
            <div className="h-16 animate-pulse bg-gold/10 rounded"></div>
          ) : (
            <>
              <div className="text-3xl font-bold text-gold mb-2">{stats.stakingAPR.toFixed(1)}%</div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Total Staked</span>
                <span className="font-medium">1.2M GOLD</span>
              </div>
              <Progress value={60} className="h-1 mt-2" />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
