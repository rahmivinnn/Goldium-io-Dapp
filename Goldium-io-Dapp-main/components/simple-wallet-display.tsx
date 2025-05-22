"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { cn } from "@/lib/utils"

interface SimpleWalletDisplayProps {
  className?: string
  compact?: boolean
}

export default function SimpleWalletDisplay({ className, compact = true }: SimpleWalletDisplayProps) {
  const { publicKey, connected } = useWallet()
  const [timeAgo, setTimeAgo] = useState<string>("just now")

  // Fixed balance values as requested
  const solBalance = 0.01667
  const goldBalance = 100

  // Update time ago display
  useEffect(() => {
    const interval = setInterval(() => {
      const minutes = Math.floor(Math.random() * 5) + 1
      setTimeAgo(`${minutes}m ago`)
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Shorten wallet address for display
  const shortenAddress = (addr: string | null) => {
    if (!addr) return ""
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  }

  if (!connected || !publicKey) {
    return (
      <div className={cn("bg-black/80 backdrop-blur-sm rounded-lg border border-yellow-500/30 px-3 py-2", className)}>
        <span className="text-xs text-gray-400">Wallet not connected</span>
      </div>
    )
  }

  // Compact display version
  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-lg border border-yellow-500/30 px-3 py-2",
          className,
        )}
      >
        <div className="flex items-center">
          <span className="text-xs text-yellow-500 font-medium">{shortenAddress(publicKey.toString())}</span>
        </div>

        <div className="h-4 w-px bg-gray-700" />

        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <span className="text-xs font-medium">{solBalance.toFixed(5)}</span>
            <span className="text-xs text-gray-400 ml-1">SOL</span>
          </div>

          <div className="flex items-center">
            <span className="text-xs font-medium text-yellow-500">{goldBalance.toFixed(2)}</span>
            <span className="text-xs text-gray-400 ml-1">GOLD</span>
          </div>
        </div>

        <span className="text-[10px] text-gray-500 hidden sm:inline-block">{timeAgo}</span>
      </div>
    )
  }

  // Full display version
  return (
    <div
      className={cn("bg-black/90 text-white p-4 rounded-xl border border-yellow-500/30 shadow-md space-y-3", className)}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-yellow-500">Wallet Balance</h2>
      </div>

      <div className="flex items-center space-x-2 bg-gray-900/60 rounded-md p-2">
        <span className="text-sm text-gray-300 break-all">{publicKey?.toString()}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900/60 rounded-md p-3 text-center">
          <div className="text-sm text-gray-400 mb-1">SOL</div>
          <div className="font-medium text-lg">{solBalance.toFixed(5)}</div>
        </div>

        <div className="bg-gray-900/60 rounded-md p-3 text-center">
          <div className="text-sm text-gray-400 mb-1">GOLD</div>
          <div className="font-medium text-lg text-yellow-500">{goldBalance.toFixed(2)}</div>
        </div>
      </div>

      <div className="text-xs text-center text-gray-500">
        Last updated: {new Date().toLocaleTimeString()} ({timeAgo})
      </div>
    </div>
  )
}
