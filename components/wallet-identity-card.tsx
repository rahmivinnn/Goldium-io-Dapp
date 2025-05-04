"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { Copy, ExternalLink, X } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface WalletIdentityCardProps {
  onClose?: () => void
}

export function WalletIdentityCard({ onClose }: WalletIdentityCardProps) {
  const { address, balance, disconnect } = useSolanaWallet()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  // Shorten wallet address for display
  const shortenAddress = (addr: string | null) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Copy address to clipboard
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  // Get explorer link based on selected network
  const getExplorerLink = () => {
    if (!address) return "#"
    return `https://solscan.io/account/${address}`
  }

  // Handle disconnect
  const handleDisconnect = () => {
    disconnect()
    if (onClose) onClose()
  }

  return (
    <Card className="w-80 border border-yellow-500/30 bg-black shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h4 className="text-sm font-medium text-yellow-500">Wallet</h4>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-yellow-500">{shortenAddress(address)}</span>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10"
                onClick={copyAddress}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10"
                asChild
              >
                <a href={getExplorerLink()} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="pt-2 border-t border-yellow-500/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Balance</span>
              <span className="font-medium text-yellow-500">{balance.toFixed(4)} SOL</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="w-full border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
        >
          Disconnect
        </Button>
      </CardFooter>
    </Card>
  )
}
