"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function WalletDisplay() {
  const [connected, setConnected] = useState(false)

  return (
    <div className="border border-yellow-500/30 bg-black/60 backdrop-blur-sm rounded-lg p-6">
      <h2 className="text-xl font-bold text-yellow-500 mb-4">Wallet Balance</h2>

      {!connected ? (
        <div className="mb-4">
          <div className="text-center text-gray-400 mb-4">Connect your wallet to view balances</div>
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" onClick={() => setConnected(true)}>
            Connect Wallet
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <div className="text-sm text-gray-400 mb-1">Address</div>
            <div className="font-mono bg-black/40 p-2 rounded">7Xf3...j8kP</div>
          </div>

          <div className="bg-black/40 p-4 rounded-lg mb-4">
            <div className="text-gray-400 text-sm">SOL Balance</div>
            <div className="text-2xl font-bold text-yellow-500">0.01667</div>
          </div>

          <div className="bg-black/40 p-4 rounded-lg mb-4">
            <div className="text-gray-400 text-sm">GOLD Balance</div>
            <div className="text-2xl font-bold text-yellow-500">100.00</div>
          </div>

          <Button
            variant="outline"
            className="w-full border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
            onClick={() => setConnected(false)}
          >
            Disconnect
          </Button>
        </>
      )}
    </div>
  )
}
