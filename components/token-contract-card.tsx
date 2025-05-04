"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Check, QrCode } from "lucide-react"
import { useNetwork } from "@/contexts/network-context"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { QRCode } from "./qr-code"

interface TokenContractCardProps {
  className?: string
  compact?: boolean
  tokenAddress?: string
  tokenName?: string
  tokenSymbol?: string
  tokenColor?: string
}

export function TokenContractCard({
  className = "",
  compact = false,
  tokenAddress,
  tokenName = "GOLD",
  tokenSymbol = "GOLD",
  tokenColor = "yellow",
}: TokenContractCardProps) {
  const { goldTokenAddress, network } = useNetwork()
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  // Pastikan rendering hanya terjadi di client-side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Hardcoded address for demo purposes
  const address = tokenAddress || goldTokenAddress || "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump"

  // Fungsi untuk menyalin alamat ke clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
      explorerUrl = `https://explorer.solana.com/address/${address}`
    } else {
      explorerUrl = `https://explorer.solana.com/address/${address}?cluster=${network}`
    }

    window.open(explorerUrl, "_blank")
  }

  // Toggle QR code display
  const toggleQR = () => {
    setShowQR(!showQR)
  }

  // Jika belum di client-side, tampilkan placeholder
  if (!isClient) {
    return (
      <Card className={`border-${tokenColor}-500/30 bg-black/60 backdrop-blur-sm ${className}`}>
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
        className={`border-${tokenColor}-500 text-${tokenColor}-500 hover:bg-${tokenColor}-500/10 ${className}`}
        onClick={copyToClipboard}
      >
        {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
        {address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "Contract Address"}
      </Button>
    )
  }

  // Tampilan penuh
  return (
    <Card className={`border-${tokenColor}-500/30 bg-black/60 backdrop-blur-sm ${className}`}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">
              {tokenName} Token Contract Address ({network})
            </h3>
            {!showQR && (
              <p className={`text-${tokenColor}-500 font-mono text-sm break-all`}>
                {address || "Contract address not available"}
              </p>
            )}
          </div>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            {!showQR && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-${tokenColor}-500/50 text-${tokenColor}-500`}
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="sr-only">Copy</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`border-${tokenColor}-500/50 text-${tokenColor}-500`}
                  onClick={openInExplorer}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">View in Explorer</span>
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              className={`border-${tokenColor}-500/50 text-${tokenColor}-500`}
              onClick={toggleQR}
            >
              <QrCode className="h-4 w-4" />
              <span className="sr-only">Toggle QR Code</span>
            </Button>
          </div>
        </div>

        {showQR && (
          <div className="mt-4 flex justify-center">
            <QRCode
              value={address}
              tokenName={tokenName}
              color={tokenColor === "yellow" ? "#F59E0B" : tokenColor === "blue" ? "#3B82F6" : "#000000"}
              bgColor="#FFFFFF"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
