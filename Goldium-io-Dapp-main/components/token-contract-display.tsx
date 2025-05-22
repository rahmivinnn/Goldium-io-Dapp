"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TokenContractDisplayProps {
  tokenName: string
  tokenSymbol: string
  tokenIcon: string
  contractAddress: string
  decimals: number
  totalSupply?: string
  network: string
  explorerUrl: string
}

export function TokenContractDisplay({
  tokenName,
  tokenSymbol,
  tokenIcon,
  contractAddress,
  decimals,
  totalSupply,
  network,
  explorerUrl,
}: TokenContractDisplayProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress)
    setCopied(true)
    toast({
      title: "Address Copied",
      description: "Contract address copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="border-gold bg-black/60 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <img src={tokenIcon || "/placeholder.svg"} alt={tokenName} className="w-10 h-10 rounded-full" />
          <div>
            <CardTitle className="text-gold">{tokenName}</CardTitle>
            <CardDescription>{tokenSymbol} Token Contract</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-400 mb-1">Contract Address (CA)</p>
          <div className="flex items-center gap-2 bg-black/40 p-3 rounded-md border border-gold/20 overflow-x-auto">
            <code className="text-xs sm:text-sm text-gold break-all">{contractAddress}</code>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 text-gray-400 hover:text-white"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Network</p>
            <p className="font-medium">{network}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Decimals</p>
            <p className="font-medium">{decimals}</p>
          </div>
          {totalSupply && (
            <div className="col-span-2">
              <p className="text-sm text-gray-400 mb-1">Total Supply</p>
              <p className="font-medium">{totalSupply}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full border-gold/50 text-gold hover:bg-gold/10"
          onClick={() => window.open(`${explorerUrl}/address/${contractAddress}`, "_blank")}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </Button>
      </CardFooter>
    </Card>
  )
}
