"use client"

import { useEffect, useState } from "react"

export default function StakingLeaderboard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="rounded-full bg-gold/20 h-8 w-8"></div>
            <div className="flex-1">
              <div className="h-3 bg-gold/20 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gold/20 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Mock data
  const leaderboard = [
    { address: "8xGZ...cQY", amount: 25000, rank: 1 },
    { address: "7tHJ...dFR", amount: 18750, rank: 2 },
    { address: "9pLM...gTY", amount: 12500, rank: 3 },
    { address: "3kRS...hJK", amount: 7500, rank: 4 },
  ]

  return (
    <div className="space-y-3">
      {leaderboard.map((staker) => (
        <div
          key={staker.rank}
          className="flex items-center justify-between p-2 rounded-md bg-black/30 border border-gold/10"
        >
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center text-xs">
              {staker.rank}
            </div>
            <div className="text-sm font-mono">{staker.address}</div>
          </div>
          <div className="text-gold font-bold">{staker.amount.toLocaleString()} GOLD</div>
        </div>
      ))}
    </div>
  )
}
