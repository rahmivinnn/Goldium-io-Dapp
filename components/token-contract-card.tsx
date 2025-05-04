"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Check } from "lucide-react"
import { useNetwork } from "@/contexts/network-context"
import { useToast } from "@/hooks/use-toast"

interface TokenContractCardProps {
  className?: string
  showLabel?: boolean
  compact?: boolean
}

export function TokenContractCard({ className = "", showLabel = true, compact = false }: TokenContractCardProps) {
  const { goldTokenAddress, explorerUrl, network } = useNetwork()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(goldTokenAddress)
    setCopied(true)
    toast({
      title: "Copied to clipboard",
      description: "Token address has been copied to clipboard",
      duration: 3000,
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const openExplorer = () => {
    window.open(
      `${explorerUrl}/address/${goldTokenAddress}${network === "testnet" ? "?cluster=testnet" : ""}`,
      "_blank",
    )
  }

  // Format address for display
  const formatAddress = (address: string, length = 6) => {
    if (!address) return ""
    return `${address.substring(0, length)}...${address.substring(address.length - length)}`
  }

  if (compact) {
    return (
      <Button
        variant="outline"
        className={`border-gold text-gold hover:bg-gold/10 flex items-center gap-2 ${className}`}
        onClick={copyToClipboard}
      >
        <span className="font-mono text-xs truncate">{formatAddress(goldTokenAddress)}</span>
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </Button>
    )
  }

  return (
    <Card className={`bg-black/30 backdrop-blur-sm border border-gold/20 ${className}`}>
      <CardContent className="p-3">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {showLabel && <span className="text-xs text-gold/80 whitespace-nowrap">GOLD Token CA:</span>}
          <code className="font-mono text-xs sm:text-sm text-gold truncate flex-grow">{goldTokenAddress}</code>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gold/80 hover:text-gold hover:bg-gold/10"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gold/80 hover:text-gold hover:bg-gold/10"
              onClick={openExplorer}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
