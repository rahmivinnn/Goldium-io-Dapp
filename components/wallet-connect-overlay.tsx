"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function WalletConnectOverlay() {
  const [connecting, setConnecting] = useState(false)

  const handleConnect = async () => {
    setConnecting(true)
    try {
      // Mock connection
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would connect to the wallet
      if (window.solana) {
        await window.solana.connect()
      } else {
        window.localStorage.setItem("walletConnected", "true")
        window.location.reload()
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setConnecting(false)
    }
  }

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
      <div className="text-center p-6">
        <h3 className="text-xl font-bold text-gold mb-4">Connect Wallet</h3>
        <p className="text-gray-300 mb-6">Connect your wallet to access staking features</p>
        <Button onClick={handleConnect} disabled={connecting} className="bg-gold hover:bg-gold/80 text-black">
          {connecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </div>
    </div>
  )
}
