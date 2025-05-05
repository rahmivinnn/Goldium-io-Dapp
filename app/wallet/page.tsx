"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function WalletPage() {
  const [connected, setConnected] = useState(false)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Wallet Dashboard</h1>

      <div className="border border-yellow-500/30 bg-black/60 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-yellow-500 mb-4">Wallet Balance</h2>

        {!connected ? (
          <div className="mb-6">
            <div className="text-center text-gray-400 mb-4">Connect your wallet to view balances</div>
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" onClick={() => setConnected(true)}>
              Connect Wallet
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="text-sm text-gray-400 mb-1">Address</div>
              <div className="font-mono bg-black/40 p-2 rounded flex justify-between items-center">
                <span>7Xf3...j8kP</span>
                <Button variant="ghost" size="sm" className="text-yellow-500 hover:bg-yellow-500/10" onClick={() => {}}>
                  Copy
                </Button>
              </div>
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
    </div>
  )
}
