"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { TransactionItem as TransactionItemType } from "@/services/transaction-service"
import { getExplorerUrl } from "@/services/transaction-service"
import { useNetwork } from "@/contexts/network-context"
import {
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Coins,
  ImageIcon,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface TransactionItemProps {
  transaction: TransactionItemType
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const { network } = useNetwork()
  const [expanded, setExpanded] = useState(false)

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleString()
  }

  const getTypeIcon = () => {
    switch (transaction.type) {
      case "send":
        return <ArrowUpRight className="h-5 w-5 text-red-500" />
      case "receive":
        return <ArrowDownRight className="h-5 w-5 text-green-500" />
      case "swap":
        return <RefreshCw className="h-5 w-5 text-blue-500" />
      case "stake":
        return <Coins className="h-5 w-5 text-gold" />
      case "nft":
        return <ImageIcon className="h-5 w-5 text-purple-500" />
      default:
        return <ArrowUpRight className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusIcon = () => {
    return transaction.status === "confirmed" ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    )
  }

  const getAmountColor = () => {
    if (transaction.type === "receive") return "text-green-500"
    if (transaction.type === "send") return "text-red-500"
    return "text-gold"
  }

  const getAmountPrefix = () => {
    if (transaction.type === "receive") return "+"
    if (transaction.type === "send") return "-"
    return ""
  }

  const explorerUrl = getExplorerUrl(transaction.signature, network === "mainnet" ? "mainnet-beta" : "devnet")

  return (
    <Card className="border border-gold/20 hover:border-gold/40 transition-colors p-4 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 p-2 bg-black/30 rounded-full">{getTypeIcon()}</div>
          <div>
            <div className="font-medium">{transaction.description || transaction.type}</div>
            <div className="text-xs text-gray-400">{formatDate(transaction.blockTime)}</div>
          </div>
        </div>

        <div className="flex items-center">
          {transaction.amount !== undefined && (
            <div className={`mr-4 text-right ${getAmountColor()}`}>
              <div className="font-bold">
                {getAmountPrefix()}
                {transaction.amount.toFixed(4)} {transaction.tokenSymbol || "SOL"}
              </div>
              <div className="text-xs text-gray-400 flex items-center justify-end">
                {getStatusIcon()}
                <span className="ml-1 capitalize">{transaction.status}</span>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-gold"
            onClick={() => window.open(explorerUrl, "_blank")}
            title="View on Solana Explorer"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="ml-2">
            {expanded ? "Less" : "More"}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gold/10 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-400">Signature:</div>
            <div className="font-mono text-xs truncate">{transaction.signature}</div>

            <div className="text-gray-400">Fee:</div>
            <div>{transaction.fee.toFixed(6)} SOL</div>

            {transaction.from && (
              <>
                <div className="text-gray-400">From:</div>
                <div className="font-mono text-xs truncate">{transaction.from}</div>
              </>
            )}

            {transaction.to && (
              <>
                <div className="text-gray-400">To:</div>
                <div className="font-mono text-xs truncate">{transaction.to}</div>
              </>
            )}

            {transaction.programId && (
              <>
                <div className="text-gray-400">Program:</div>
                <div className="font-mono text-xs truncate">{transaction.programId}</div>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
