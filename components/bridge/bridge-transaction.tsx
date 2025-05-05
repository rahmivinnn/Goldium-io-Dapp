"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink, Copy, Check } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface Network {
  id: string
  name: string
  icon: string
  chainId: string
}

interface Token {
  id: string
  name: string
  symbol: string
  icon: string
  decimals: number
}

interface BridgeTransactionProps {
  sourceNetwork: Network
  destinationNetwork: Network
  token: Token
  amount: string
  fee: string
  estimatedTime: string
  onConfirm: () => void
  onCancel: () => void
}

export function BridgeTransaction({
  sourceNetwork,
  destinationNetwork,
  token,
  amount,
  fee,
  estimatedTime,
  onConfirm,
  onCancel,
}: BridgeTransactionProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  // Mock transaction hash
  const txHash = "0x7d5F3BB6F5CC8251fd9E5FAF2Ec3c8F5e3a3439C"

  const handleCopy = () => {
    navigator.clipboard.writeText(txHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Address Copied",
      description: "Transaction hash copied to clipboard",
    })
  }

  const handleConfirm = () => {
    setIsConfirming(true)
    setTimeout(() => {
      onConfirm()
      setIsConfirming(false)
    }, 2000)
  }

  return (
    <Card className="border-yellow-500/30 bg-black/50">
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-black/50 flex items-center justify-center mb-2">
              <Image src={sourceNetwork.icon || "/placeholder.svg"} alt={sourceNetwork.name} width={40} height={40} />
            </div>
            <span className="text-sm font-medium">{sourceNetwork.name}</span>
          </div>

          <ArrowRight className="h-6 w-6 text-yellow-500 mx-4" />

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-black/50 flex items-center justify-center mb-2">
              <Image
                src={destinationNetwork.icon || "/placeholder.svg"}
                alt={destinationNetwork.name}
                width={40}
                height={40}
              />
            </div>
            <span className="text-sm font-medium">{destinationNetwork.name}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Amount</span>
            <div className="flex items-center">
              <div className="w-4 h-4 mr-1">
                <Image src={token.icon || "/placeholder.svg"} alt={token.symbol} width={16} height={16} />
              </div>
              <span className="text-white">
                {amount} {token.symbol}
              </span>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Fee</span>
            <span className="text-white">
              {fee} {token.symbol}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">You will receive</span>
            <span className="text-yellow-500 font-medium">
              {(Number.parseFloat(amount) - Number.parseFloat(fee)).toFixed(4)} {token.symbol}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Estimated time</span>
            <span className="text-white">{estimatedTime}</span>
          </div>

          <div className="pt-2 border-t border-gray-700">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Transaction</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-300 font-mono">
                  {txHash.substring(0, 6)}...{txHash.substring(txHash.length - 4)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-white"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-white"
                  onClick={() => window.open(`https://etherscan.io/tx/${txHash}`, "_blank")}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 border-gray-700 hover:bg-gray-800 hover:text-white"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
            onClick={handleConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? "Confirming..." : "Confirm Bridge"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default BridgeTransaction
