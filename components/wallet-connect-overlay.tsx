"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

export function WalletConnectOverlay() {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg z-10">
      <Wallet className="h-12 w-12 text-gold mb-4" />
      <h3 className="text-xl font-medium text-white mb-2">Connect Wallet</h3>
      <p className="text-gray-400 text-center mb-6 max-w-xs">
        Please connect your wallet to access bridge functionality
      </p>
      <Button
        className="bg-gradient-to-r from-gold to-amber-500 hover:from-amber-600 hover:to-amber-700 text-black font-medium"
        onClick={() => {
          // Trigger wallet connect
          window.dispatchEvent(new CustomEvent("connect-wallet-requested"))
        }}
      >
        Connect Wallet
      </Button>
    </div>
  )
}

export default WalletConnectOverlay
