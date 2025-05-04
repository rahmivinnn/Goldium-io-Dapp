"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { type Transaction, getTransactionHistory, getTransactionExplorerUrl } from "@/services/transaction-service"
import { useEffect, useState } from "react"

type TransactionHistoryProps = {}

export function TransactionHistory({}: TransactionHistoryProps) {
  const { connected, publicKey, connection } = useSolanaWallet()
  const { network } = useNetwork()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!connected || !publicKey || !connection) return

      setIsLoading(true)
      try {
        const walletAddress = publicKey.toString()
        const txs = await getTransactionHistory(connection, walletAddress, network, 5)
        setTransactions(txs)
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [connected, publicKey, connection, network])

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-5 w-5 text-gold" />
      case "receive":
        return <ArrowDownLeft className="h-5 w-5 text-gold" />
      default:
        return <ExternalLink className="h-5 w-5 text-gray-500" />
    }
  }

  const formatAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <Card key={tx.signature} className="border-gold/30 bg-black hover:bg-black/80 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${tx.type === "send" ? "bg-gold/20" : "bg-gold/20"}`}>
                  {getTransactionIcon(tx.type)}
                </div>
                <div className="ml-3">
                  <p className="font-medium">
                    {tx.type === "send" ? "Sent" : "Received"} {tx.amount?.toFixed(4)}
                  </p>
                  <p className="text-sm text-gray-400">
                    {formatDistanceToNow(new Date(tx.blockTime), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <a
                  href={getTransactionExplorerUrl(tx.signature, network)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gold flex items-center justify-end hover:underline"
                >
                  <span>View</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              {tx.type === "send" ? "To: " : "From: "}
              {formatAddress(tx.from)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Also add default export for backward compatibility
export default TransactionHistory
