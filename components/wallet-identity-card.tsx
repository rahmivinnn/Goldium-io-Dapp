"use client"

import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Check } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function WalletIdentityCard() {
  const { walletAddress, solBalance, goldBalance, network, disconnect, connected } = useSolanaWallet()
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // Pastikan WalletIdentityCard menampilkan alamat wallet dengan benar
  // Tambahkan log untuk debugging:
  console.log("WalletIdentityCard render:", { walletAddress, connected })

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

  if (!walletAddress) return null

  return (
    <Card className="bg-black/80 border border-gold/30 rounded-lg w-full max-w-xs">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-gold font-medium">Wallet Terhubung</h3>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
            <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Terhubung</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-black/50 border border-gold/20 rounded p-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Alamat</span>
              <div className="flex space-x-1">
                <button
                  onClick={copyAddress}
                  className="text-gray-400 hover:text-gold p-1 rounded hover:bg-gold/10 transition-colors"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <a
                  href={getExplorerLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gold p-1 rounded hover:bg-gold/10 transition-colors"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
            <div className="font-mono text-sm mt-1 break-all">
              <span className="bg-gold/10 px-2 py-1 rounded text-gold">
                {`${walletAddress.slice(0, 8)}...${walletAddress.slice(-8)}`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-black/50 border border-gold/20 rounded p-2">
              <div className="text-sm text-gray-400">SOL Balance</div>
              <div className="font-medium">{solBalance.toFixed(4)} SOL</div>
            </div>
            <div className="bg-black/50 border border-gold/20 rounded p-2">
              <div className="text-sm text-gray-400">GOLD Balance</div>
              <div className="font-medium">{goldBalance.toFixed(2)} GOLD</div>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full mt-2 border-red-500/50 text-red-500 hover:bg-red-500/10"
            onClick={disconnect}
          >
            Disconnect Wallet
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
