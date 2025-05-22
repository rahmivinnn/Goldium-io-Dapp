"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { useWallet } from "@solana/wallet-adapter-react"
import { Copy, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function FixedWalletPage() {
  const { publicKey, connected } = useWallet()
  const [showCopied, setShowCopied] = useState(false)

  // Fixed SOL balance as requested
  const solBalance = 0.01667
  const goldBalance = 100

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
      setShowCopied(true)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      })
      setTimeout(() => setShowCopied(false), 2000)
    }
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center gold-gradient">Wallet Dashboard</h1>

      {!connected ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
          <p className="text-lg text-gray-400 mb-4">Connect your wallet to access the dashboard</p>
          <ConnectWalletButton className="gold-button text-lg py-3 px-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card className="border-yellow-500/30 bg-black/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Wallet Balance</span>
                <Button variant="ghost" size="sm" className="text-yellow-500 hover:bg-yellow-500/10">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Address:</span>
                    <span className="font-mono">
                      {publicKey ? shortenAddress(publicKey.toString()) : "Not connected"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                    onClick={copyAddress}
                  >
                    {showCopied ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-4 rounded-lg">
                    <div className="text-gray-400 text-sm">SOL Balance</div>
                    <div className="text-2xl font-bold text-yellow-500">{solBalance.toFixed(5)}</div>
                  </div>

                  <div className="bg-black/40 p-4 rounded-lg">
                    <div className="text-gray-400 text-sm">GOLD Balance</div>
                    <div className="text-2xl font-bold text-yellow-500">{goldBalance.toFixed(2)}</div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mt-2">Last updated: Just now</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
