"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink } from "lucide-react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { PhantomLogo } from "./phantom-logo"

interface WalletIdentityCardProps {
  onDisconnect: () => Promise<void>
}

export function WalletIdentityCard({ onDisconnect }: WalletIdentityCardProps) {
  const { address, solBalance, goldBalance } = useSolanaWallet()
  const { network } = useNetwork()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

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
    const baseUrl =
      network === "mainnet" ? "https://explorer.solana.com" : "https://explorer.solana.com/?cluster=devnet"
    return `${baseUrl}/address/${address}`
  }

  // Shorten wallet address for display
  const shortenAddress = (addr: string | null) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <Card className="w-72 border border-yellow-500/30 bg-black/90 backdrop-blur-sm shadow-xl">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PhantomLogo size={20} />
              <span className="text-yellow-500 font-medium">Phantom Wallet</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-900/60 rounded-md p-2">
            <span className="text-sm text-gray-300">{shortenAddress(address)}</span>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10"
                onClick={copyAddress}
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy address</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10"
                asChild
              >
                <a href={getExplorerLink()} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                  <span className="sr-only">View on explorer</span>
                </a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-gray-900/60 rounded-md p-2">
              <div className="text-xs text-gray-400">SOL</div>
              <div className="font-medium">{solBalance.toFixed(4)}</div>
            </div>
            <div className="bg-gray-900/60 rounded-md p-2">
              <div className="text-xs text-gray-400">GOLD</div>
              <div className="font-medium text-yellow-500">{goldBalance.toFixed(4)}</div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400"
            onClick={onDisconnect}
          >
            Disconnect Wallet
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
