"use client"

import { useState, useEffect } from "react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNetwork } from "@/contexts/network-context"
import { formatDistanceToNow } from "date-fns"

interface Transaction {
  signature: string
  timestamp: number
  type: "incoming" | "outgoing" | "unknown"
  amount?: number
  sender?: string
  recipient?: string
}

export function TransactionMonitor() {
  const { connected, address, connection, publicKey, refreshBalance } = useSolanaWallet()
  const { network } = useNetwork()
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)

  // Format address for display
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  }

  // Get explorer link for transaction
  const getTransactionLink = (signature: string) => {
    const baseUrl =
      network === "mainnet" ? "https://explorer.solana.com" : "https://explorer.solana.com/?cluster=devnet"
    return `${baseUrl}/tx/${signature}`
  }

  // Poll for new transactions
  useEffect(() => {
    if (!connected || !connection || !publicKey) {
      if (pollingInterval) {
        clearInterval(pollingInterval)
        setPollingInterval(null)
      }
      return
    }

    // Initial fetch
    fetchRecentTransactions()

    // Set up polling
    const interval = setInterval(fetchRecentTransactions, 15000) // Poll every 15 seconds
    setPollingInterval(interval)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [connected, connection, publicKey, network])

  // Fetch recent transactions
  const fetchRecentTransactions = async () => {
    if (!connected || !connection || !publicKey) return

    try {
      setLoading(true)

      // Get recent signatures
      const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 5 })

      if (signatures.length === 0) {
        setLoading(false)
        return
      }

      // Process transactions
      const txPromises = signatures.map(async (sig) => {
        try {
          const tx = await connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
          })

          if (!tx) return null

          // Determine if incoming or outgoing
          let type: "incoming" | "outgoing" | "unknown" = "unknown"
          let amount: number | undefined = undefined

          if (tx.meta && tx.transaction) {
            // Check if this wallet is the fee payer (outgoing)
            if (tx.transaction.message.accountKeys[0].toString() === publicKey.toString()) {
              type = "outgoing"
            }

            // Check for SOL transfers
            if (tx.meta.preBalances && tx.meta.postBalances) {
              const preBalance = tx.meta.preBalances[0]
              const postBalance = tx.meta.postBalances[0]

              if (preBalance > postBalance) {
                type = "outgoing"
                // Subtract fee from amount calculation
                amount = (preBalance - postBalance) / 1e9
              } else if (postBalance > preBalance) {
                type = "incoming"
                amount = (postBalance - preBalance) / 1e9
              }
            }
          }

          return {
            signature: sig.signature,
            timestamp: sig.blockTime ? sig.blockTime * 1000 : Date.now(),
            type,
            amount,
            sender: tx.transaction?.message.accountKeys[0].toString(),
            recipient: tx.transaction?.message.accountKeys[1].toString(),
          }
        } catch (error) {
          console.error("Error processing transaction:", error)
          return null
        }
      })

      const processedTxs = (await Promise.all(txPromises)).filter(Boolean) as Transaction[]

      // Check if we have new transactions
      const newTxSignatures = processedTxs.map((tx) => tx.signature)
      const existingTxSignatures = transactions.map((tx) => tx.signature)

      const hasNewTransactions = newTxSignatures.some((sig) => !existingTxSignatures.includes(sig))

      if (hasNewTransactions) {
        // Update transactions
        setTransactions(processedTxs)

        // Refresh balance
        refreshBalance()

        // Notify user of new transaction
        const newTx = processedTxs.find((tx) => !existingTxSignatures.includes(tx.signature))
        if (newTx) {
          toast({
            title: newTx.type === "incoming" ? "Incoming Transaction" : "Outgoing Transaction",
            description: `${newTx.type === "incoming" ? "Received" : "Sent"} ${newTx.amount?.toFixed(4) || "unknown"} SOL`,
          })
        }
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!connected) {
    return null
  }

  return (
    <Card className="border border-yellow-500/30 bg-black/60 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Live Transactions</span>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-4 text-gray-400">No recent transactions found</div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <a
                key={tx.signature}
                href={getTransactionLink(tx.signature)}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    {tx.type === "incoming" ? (
                      <div className="bg-green-500/20 p-2 rounded-full">
                        <ArrowDownLeft className="h-4 w-4 text-green-500" />
                      </div>
                    ) : (
                      <div className="bg-red-500/20 p-2 rounded-full">
                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium">
                        {tx.type === "incoming" ? "Received" : "Sent"}
                        {tx.amount && ` ${tx.amount.toFixed(4)} SOL`}
                      </div>
                      <div className="text-xs text-gray-400">
                        {tx.type === "incoming"
                          ? `From: ${tx.sender ? formatAddress(tx.sender) : "Unknown"}`
                          : `To: ${tx.recipient ? formatAddress(tx.recipient) : "Unknown"}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant={tx.type === "incoming" ? "success" : "destructive"} className="mb-1">
                      {tx.type === "incoming" ? "IN" : "OUT"}
                    </Badge>
                    <div className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
