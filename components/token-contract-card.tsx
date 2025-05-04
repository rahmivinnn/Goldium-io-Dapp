"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink } from "lucide-react"
import { useNetwork } from "@/contexts/network-context"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface TokenContractCardProps {
  className?: string
  compact?: boolean
}

export function TokenContractCard({ className = "", compact = false }: TokenContractCardProps) {
  const { goldTokenAddress, network } = useNetwork()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)

  // Pastikan rendering hanya terjadi di client-side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Hardcoded address for demo purposes
  const tokenAddress = goldTokenAddress || "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump"

  // Fungsi untuk menyalin alamat ke clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(tokenAddress)
    toast({
      title: "Address Copied",
      description: "Token address copied to clipboard",
    })
  }

  // Fungsi untuk membuka explorer
  const openInExplorer = () => {
    let explorerUrl = ""

    // Tentukan URL explorer berdasarkan jaringan
    if (network === "mainnet") {
      explorerUrl = `https://explorer.solana.com/address/${tokenAddress}`
    } else {
      explorerUrl = `https://explorer.solana.com/address/${tokenAddress}?cluster=${network}`
    }

    window.open(explorerUrl, "_blank")
  }

  // Jika belum di client-side, tampilkan placeholder
  if (!isClient) {
    return (
      <Card className={`border-gold/30 bg-black/60 backdrop-blur-sm ${className}`}>
        <CardContent className="p-4">
          <div className="animate-pulse bg-gray-700 h-6 w-full rounded"></div>
        </CardContent>
      </Card>
    )
  }

  // Tampilan compact untuk tombol
  if (compact) {
    return (
      <Button
        variant="outline"
        className={`border-gold text-gold hover:bg-gold/10 ${className}`}
        onClick={copyToClipboard}
      >
        <Copy className="mr-2 h-4 w-4" />
        {tokenAddress ? `${tokenAddress.slice(0, 4)}...${tokenAddress.slice(-4)}` : "Contract Address"}
      </Button>
    )
  }

  // Tampilan penuh
  return (
    <Card className={`border-gold/30 bg-black/60 backdrop-blur-sm ${className}`}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">GOLD Token Contract Address ({network})</h3>
            <p className="text-gold font-mono text-sm break-all">{tokenAddress || "Contract address not available"}</p>
          </div>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <Button variant="outline" size="sm" className="border-gold/50 text-gold" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>
            <Button variant="outline" size="sm" className="border-gold/50 text-gold" onClick={openInExplorer}>
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">View in Explorer</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
