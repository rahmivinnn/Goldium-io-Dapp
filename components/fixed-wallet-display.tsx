"use client"

import { useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface FixedWalletDisplayProps {
  compact?: boolean
}

export default function FixedWalletDisplay({ compact = false }: FixedWalletDisplayProps) {
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

  if (!connected || !publicKey) {
    return <div className="text-gray-400 text-center py-4">Wallet not connected</div>
  }

  if (compact) {
    return (
      <div className="flex items-center justify-between bg-black/60 rounded-lg p-2 text-sm">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-gray-400">{shortenAddress(publicKey.toString())}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-yellow-500 hover:bg-yellow-500/10"
            onClick={copyAddress}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <div>
            <span className="text-gray-400 mr-1">SOL:</span>
            <span className="text-yellow-500 font-medium">{solBalance.toFixed(5)}</span>
          </div>
          <div>
            <span className="text-gray-400 mr-1">GOLD:</span>
            <span className="text-yellow-500 font-medium">{goldBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="border-yellow-500/30 bg-black/60 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Address:</span>
              <span className="font-mono">{publicKey.toString()}</span>
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

          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Last updated: Just now</span>
            <Button variant="ghost" size="sm" className="h-6 text-yellow-500 hover:bg-yellow-500/10 p-0">
              <RefreshCw className="h-3 w-3 mr-1" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
