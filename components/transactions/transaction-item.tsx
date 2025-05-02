"use client"

import { useState } from "react"
import { type Transaction, getTransactionExplorerUrl, getAddressExplorerUrl } from "@/services/transaction-service"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  Repeat,
  Palette,
  CoinsIcon,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { NetworkType } from "@/contexts/network-context"

interface TransactionItemProps {
  transaction: Transaction
  network: NetworkType
}

export function TransactionItem({ transaction, network }: TransactionItemProps) {
  const [expanded, setExpanded] = useState(false)

  // Format the transaction amount
  const formattedAmount = transaction.amount
    ? `${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} SOL`
    : "Unknown amount"

  // Get the transaction icon based on type
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case "send":
        return <ArrowUpRight className="h-5 w-5 text-red-500" />
      case "receive":
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />
      case "swap":
        return <Repeat className="h-5 w-5 text-blue-500" />
      case "nft":
        return <Palette className="h-5 w-5 text-purple-500" />
      case "stake":
        return <CoinsIcon className="h-5 w-5 text-yellow-500" />
      default:
        return <ExternalLink className="h-5 w-5 text-gray-500" />
    }
  }

  // Format the transaction time
  const formattedTime = transaction.blockTime
    ? formatDistanceToNow(new Date(transaction.blockTime), { addSuffix: true })
    : "Unknown time"

  // Format addresses to be shorter
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getTransactionIcon()}
            <div>
              <h3 className="font-medium">{transaction.description}</h3>
              <p className="text-sm text-muted-foreground">{formattedTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p
                className={`font-medium ${transaction.type === "send" ? "text-red-500" : transaction.type === "receive" ? "text-green-500" : ""}`}
              >
                {transaction.type === "send" ? "-" : transaction.type === "receive" ? "+" : ""}
                {formattedAmount}
              </p>
              <p className="text-xs text-muted-foreground">Fee: {transaction.fee.toFixed(6)} SOL</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Status</div>
              <div className={`${transaction.status === "confirmed" ? "text-green-500" : "text-red-500"}`}>
                {transaction.status === "confirmed" ? "Confirmed" : "Failed"}
              </div>

              <div className="text-muted-foreground">From</div>
              <div>
                <a
                  href={getAddressExplorerUrl(transaction.from, network)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {formatAddress(transaction.from)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="text-muted-foreground">To</div>
              <div>
                <a
                  href={getAddressExplorerUrl(transaction.to, network)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {formatAddress(transaction.to)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="text-muted-foreground">Transaction</div>
              <div>
                <a
                  href={getTransactionExplorerUrl(transaction.signature, network)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  {formatAddress(transaction.signature)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
