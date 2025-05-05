"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

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

interface Transaction {
  id: string
  sourceNetwork: Network
  destinationNetwork: Network
  token: Token
  amount: string
  status: "pending" | "completed" | "failed"
  timestamp: string
  txHash: string
}

interface BridgeHistoryProps {
  transactions: Transaction[]
}

export function BridgeHistory({ transactions }: BridgeHistoryProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No transaction history found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="bg-black/30 border border-yellow-500/20 rounded-lg p-4 hover:border-yellow-500/40 transition-all"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <Badge
                className={`
                  ${
                    tx.status === "completed"
                      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      : tx.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                        : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  }
                `}
              >
                {tx.status === "completed" ? "Completed" : tx.status === "pending" ? "Pending" : "Failed"}
              </Badge>
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-white"
              onClick={() => window.open(`https://etherscan.io/tx/${tx.txHash}`, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-black/50 flex items-center justify-center">
                <Image
                  src={tx.sourceNetwork.icon || "/placeholder.svg"}
                  alt={tx.sourceNetwork.name}
                  width={24}
                  height={24}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{tx.sourceNetwork.name}</span>
                <span className="text-xs text-gray-400">From</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-black/50 flex items-center justify-center">
                <Image src={tx.token.icon || "/placeholder.svg"} alt={tx.token.symbol} width={20} height={20} />
              </div>
              <span className="text-sm font-medium">
                {tx.amount} {tx.token.symbol}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-black/50 flex items-center justify-center">
                <Image
                  src={tx.destinationNetwork.icon || "/placeholder.svg"}
                  alt={tx.destinationNetwork.name}
                  width={24}
                  height={24}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{tx.destinationNetwork.name}</span>
                <span className="text-xs text-gray-400">To</span>
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-gray-700">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>
                Tx: {tx.txHash.substring(0, 8)}...{tx.txHash.substring(tx.txHash.length - 8)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BridgeHistory
