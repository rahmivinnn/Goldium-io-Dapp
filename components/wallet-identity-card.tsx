"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check, ExternalLink, RefreshCw } from "lucide-react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

export function WalletIdentityCard() {
  const { walletAddress, publicKey, solBalance, goldBalance, network, disconnect, refreshBalance } = useSolanaWallet()
  const [copied, setCopied] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  if (!walletAddress) {
    return null
  }

  // Copy address to clipboard
  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Alamat Disalin",
        description: "Alamat wallet berhasil disalin ke clipboard",
      })
    }
  }

  // Get explorer link based on network
  const getExplorerLink = () => {
    if (!walletAddress) return "#"

    switch (network) {
      case "mainnet":
        return `https://explorer.solana.com/address/${walletAddress}`
      case "testnet":
        return `https://explorer.solana.com/address/${walletAddress}?cluster=testnet`
      case "devnet":
        return `https://explorer.solana.com/address/${walletAddress}?cluster=devnet`
      default:
        return `https://explorer.solana.com/address/${walletAddress}`
    }
  }

  // Handle refresh balance
  const handleRefreshBalance = async () => {
    setRefreshing(true)
    await refreshBalance()
    setRefreshing(false)

    toast({
      title: "Saldo Diperbarui",
      description: "Informasi saldo telah diperbarui",
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="border-gold/30 bg-black/80 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-gold flex justify-between items-center">
            <span>Identitas Wallet</span>
            <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Terhubung</div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">Alamat Wallet</div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-gold"
                  onClick={copyAddress}
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-gold"
                  onClick={() => window.open(getExplorerLink(), "_blank")}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="font-mono text-sm bg-black/50 p-2 rounded border border-gold/20 break-all">
              {walletAddress}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/50 border border-gold/20 rounded p-3">
              <div className="text-sm text-gray-400 mb-1">SOL Balance</div>
              <div className="text-xl font-medium">{solBalance.toFixed(4)}</div>
              <div className="text-xs text-gray-500">SOL</div>
            </div>
            <div className="bg-black/50 border border-gold/20 rounded p-3">
              <div className="text-sm text-gray-400 mb-1">GOLD Balance</div>
              <div className="text-xl font-medium">{goldBalance.toFixed(2)}</div>
              <div className="text-xs text-gray-500">GOLD</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/50 border border-gold/20 rounded p-3">
              <div className="text-sm text-gray-400 mb-1">Network</div>
              <div className="font-medium capitalize">{network}</div>
            </div>
            <div className="bg-black/50 border border-gold/20 rounded p-3">
              <div className="text-sm text-gray-400 mb-1">Wallet Type</div>
              <div className="font-medium">Phantom</div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-gold/30 text-gold hover:bg-gold/10"
              onClick={handleRefreshBalance}
              disabled={refreshing}
            >
              {refreshing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Memperbarui...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Perbarui Saldo
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-red-500/50 text-red-500 hover:bg-red-500/10"
              onClick={disconnect}
            >
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
