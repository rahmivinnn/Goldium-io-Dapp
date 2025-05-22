"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, RefreshCw } from "lucide-react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { PhantomLogo } from "./phantom-logo"
import { cn } from "@/lib/utils"

interface WalletIdentityCardProps {
  onDisconnect: () => Promise<void>
}

export function WalletIdentityCard({ onDisconnect }: WalletIdentityCardProps) {
  const { address, solBalance, goldBalance, refreshBalance, isBalanceLoading, lastUpdated } = useSolanaWallet()
  const { network } = useNetwork()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  // Format timestamp to readable date
  const formatLastUpdated = () => {
    if (!lastUpdated) return "Never updated"
    return new Date(lastUpdated).toLocaleTimeString()
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

  // Handle refresh balance
  const handleRefresh = async () => {
    try {
      await refreshBalance()
      toast({
        title: "Balance Updated",
        description: "Your wallet balance has been refreshed",
      })
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh balance. Please try again.",
        variant: "destructive",
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
              <div className="font-medium">
                {isBalanceLoading ? (
                  <div className="flex justify-center">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  </div>
                ) : solBalance !== null ? (
                  solBalance.toFixed(4)
                ) : (
                  "Loading..."
                )}
              </div>
            </div>
            <div className="bg-gray-900/60 rounded-md p-2">
              <div className="text-xs text-gray-400">GOLD</div>
              <div className={cn("font-medium", goldBalance !== null && goldBalance > 0 ? "text-yellow-500" : "")}>
                {isBalanceLoading ? (
                  <div className="flex justify-center">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  </div>
                ) : goldBalance !== null ? (
                  goldBalance.toFixed(4)
                ) : (
                  "Loading..."
                )}
              </div>
            </div>
          </div>

          <div className="text-xs text-center text-gray-500">Last updated: {formatLastUpdated()}</div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
              onClick={handleRefresh}
              disabled={isBalanceLoading}
            >
              {isBalanceLoading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
              <span className="ml-1">Refresh</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400"
              onClick={onDisconnect}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
