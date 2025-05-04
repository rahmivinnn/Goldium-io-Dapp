"use client"

import { useState } from "react"
import { Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TokenContractDisplayProps {
  compact?: boolean
}

export function TokenContractDisplay({ compact = false }: TokenContractDisplayProps) {
  const [copied, setCopied] = useState(false)
  const contractAddress = "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openExplorer = () => {
    window.open(`https://explorer.solana.com/address/${contractAddress}`, "_blank")
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
          onClick={copyToClipboard}
        >
          {copied ? "Copied!" : "GOLD Token"}
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-black/30 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-3 w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-yellow-500 font-medium">GOLD Token CA:</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="bg-black/50 rounded px-3 py-2 text-white text-sm font-mono truncate max-w-[200px] sm:max-w-xs">
          {contractAddress}
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-yellow-500 hover:bg-yellow-500/10"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-yellow-500 hover:bg-yellow-500/10"
            onClick={openExplorer}
          >
            <ExternalLink className="h-4 w-4" />
            <span className="sr-only">View on Explorer</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
