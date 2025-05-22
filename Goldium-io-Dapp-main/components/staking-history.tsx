"use client"

import { useEffect, useState } from "react"

export default function StakingHistory() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-gold/10 rounded-md"></div>
        ))}
      </div>
    )
  }

  // Mock data
  const history = [
    { type: "Stake", amount: 5000, time: "2h ago", address: "8xGZ...cQY" },
    { type: "Claim", amount: 250, time: "5h ago", address: "7tHJ...dFR" },
    { type: "Unstake", amount: 1000, time: "1d ago", address: "9pLM...gTY" },
    { type: "Stake", amount: 7500, time: "2d ago", address: "3kRS...hJK" },
  ]

  return (
    <div className="space-y-3">
      {history.map((item, index) => (
        <div key={index} className="p-2 rounded-md bg-black/30 border border-gold/10">
          <div className="flex justify-between items-center">
            <span
              className={`text-sm font-medium ${
                item.type === "Stake" ? "text-green-400" : item.type === "Unstake" ? "text-red-400" : "text-blue-400"
              }`}
            >
              {item.type}
            </span>
            <span className="text-xs text-gray-400">{item.time}</span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm font-mono text-gray-400">{item.address}</span>
            <span className="text-gold font-bold">{item.amount} GOLD</span>
          </div>
        </div>
      ))}
    </div>
  )
}
