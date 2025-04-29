"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, ExternalLink } from "lucide-react"

// Sample transaction data
const TRANSACTIONS = [
  {
    id: "tx1",
    type: "send",
    amount: 250,
    to: "0x8765...4321",
    status: "completed",
    timestamp: "2025-04-29T10:15:00Z",
  },
  {
    id: "tx2",
    type: "receive",
    amount: 500,
    from: "0x2468...1357",
    status: "completed",
    timestamp: "2025-04-28T18:30:00Z",
  },
  {
    id: "tx3",
    type: "stake",
    amount: 1000,
    status: "completed",
    timestamp: "2025-04-27T14:45:00Z",
  },
  {
    id: "tx4",
    type: "claim",
    amount: 45,
    status: "completed",
    timestamp: "2025-04-26T09:20:00Z",
  },
  {
    id: "tx5",
    type: "send",
    amount: 150,
    to: "0x1357...2468",
    status: "pending",
    timestamp: "2025-04-29T11:05:00Z",
  },
  {
    id: "tx6",
    type: "game",
    amount: 75,
    game: "Card Battle",
    status: "completed",
    timestamp: "2025-04-28T20:15:00Z",
  },
  {
    id: "tx7",
    type: "send",
    amount: 50,
    to: "0x9876...5432",
    status: "failed",
    timestamp: "2025-04-27T16:30:00Z",
  },
]

export default function TransactionHistory() {
  const [visibleTransactions, setVisibleTransactions] = useState(5)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-5 w-5 text-red-500" />
      case "receive":
        return <ArrowDownRight className="h-5 w-5 text-green-500" />
      case "stake":
        return <ArrowUpRight className="h-5 w-5 text-blue-500" />
      case "claim":
        return <ArrowDownRight className="h-5 w-5 text-gold" />
      case "game":
        return <ArrowDownRight className="h-5 w-5 text-purple-500" />
      default:
        return null
    }
  }

  const getTypeLabel = (transaction: any) => {
    switch (transaction.type) {
      case "send":
        return `Send to ${transaction.to}`
      case "receive":
        return `Receive from ${transaction.from}`
      case "stake":
        return "Stake GOLD"
      case "claim":
        return "Claim Rewards"
      case "game":
        return `${transaction.game} Winnings`
      default:
        return transaction.type
    }
  }

  const loadMore = () => {
    setVisibleTransactions((prev) => Math.min(prev + 5, TRANSACTIONS.length))
  }

  return (
    <div>
      <div className="space-y-4">
        {TRANSACTIONS.slice(0, visibleTransactions).map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 border border-gold/20 rounded-lg hover:bg-gold/5 transition-colors"
          >
            <div className="flex items-center">
              <div className="mr-3">{getTypeIcon(transaction.type)}</div>
              <div>
                <div className="font-medium">{getTypeLabel(transaction)}</div>
                <div className="text-xs text-gray-400">{formatDate(transaction.timestamp)}</div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="text-right mr-4">
                <div
                  className={`font-bold ${
                    transaction.type === "receive" || transaction.type === "claim" || transaction.type === "game"
                      ? "text-green-500"
                      : transaction.type === "send"
                        ? "text-red-500"
                        : "text-gold"
                  }`}
                >
                  {transaction.type === "receive" || transaction.type === "claim" || transaction.type === "game"
                    ? "+"
                    : transaction.type === "send"
                      ? "-"
                      : ""}
                  {transaction.amount} GOLD
                </div>
                <div className="text-xs flex items-center justify-end">
                  {getStatusIcon(transaction.status)}
                  <span className="ml-1 capitalize">{transaction.status}</span>
                </div>
              </div>

              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gold">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {visibleTransactions < TRANSACTIONS.length && (
        <div className="text-center mt-4">
          <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10" onClick={loadMore}>
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
