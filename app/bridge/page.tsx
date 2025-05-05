"use client"

import { CrossChainBridge } from "@/components/bridge/cross-chain-bridge"
import { useEffect, useState } from "react"

export default function BridgePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-yellow-500/30 border-t-yellow-500 animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-yellow-500 text-center mb-8">Cross-Chain Bridge</h1>
      <CrossChainBridge />
    </div>
  )
}
