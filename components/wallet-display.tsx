"use client"

import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, ExternalLink, RefreshCw } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useNetwork } from "@/contexts/network-context"
import { PhantomLogo } from "./phantom-logo"

export function WalletDisplay() {
  const { connected, address, solBalance, goldBalance, refreshBalance } = useSolanaWallet()
  const { network } = useNetwork()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

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

  // Handle refresh balance
  const handleRefresh = async () => {
    if (!connected) return

    setRefreshing(true)
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
    } finally {
      setRefreshing(false)
    }
  }

  // Get explorer link based on selected network
  const getExplorerLink = () => {
    if (!address) return "#"
    const baseUrl =
      network === "mainnet" ? "https://explorer.solana.com" : "https://explorer.solana.com/?cluster=devnet"
    return `${baseUrl}/address/${address}`
  }

  if (!connected) {
    return null
  }

  return (
    <Card className="border border-yellow-500/30 bg-black/60 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PhantomLogo size={20} />
              <span className="text-yellow-500 font-medium">{shortenAddress(address)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10"
                onClick={copyAddress}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy address</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10"
                asChild
              >
                <a href={getExplorerLink()} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">View on explorer</span>
                </a>
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-800">
            <div className="flex flex-col">
              <div className="text-sm text-gray-400">SOL Balance</div>
              <div className="font-medium">{solBalance.toFixed(4)} SOL</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-sm text-gray-400">GOLD Balance</div>
              <div className="font-medium text-yellow-500">{goldBalance.toFixed(4)} GOLD</div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh Balance
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
