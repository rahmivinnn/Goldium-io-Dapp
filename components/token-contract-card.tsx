"use client"

import { useState } from "react"
import { Copy, ExternalLink, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TokenContractCardProps {
  contractAddress: string
  tokenSymbol: string
  explorerUrl: string
  className?: string
}

export function TokenContractCard({ contractAddress, tokenSymbol, explorerUrl, className }: TokenContractCardProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Truncate address for display
  const truncatedAddress = `${contractAddress.slice(0, 6)}...${contractAddress.slice(-6)}`

  return (
    <Card className={`border-gold/30 bg-black/50 backdrop-blur-sm ${className}`}>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gold/80">{tokenSymbol} Contract:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <code className="font-mono text-xs sm:text-sm text-gold bg-black/30 px-2 py-1 rounded">
                    {truncatedAddress}
                  </code>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-mono text-xs">{contractAddress}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 border-gold/30 text-gold hover:bg-gold/10"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 border-gold/30 text-gold hover:bg-gold/10"
              onClick={() => window.open(explorerUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Explorer</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
