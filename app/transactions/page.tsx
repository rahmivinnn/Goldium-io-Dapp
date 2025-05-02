"use client"

import { useState, useEffect } from "react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { getTransactionHistory, type Transaction } from "@/services/transaction-service"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCcw } from "lucide-react"
import { TransactionItem } from "@/components/transactions/transaction-item"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { useToast } from "@/hooks/use-toast"

export default function TransactionsPage() {
  const { connected, walletAddress, publicKey } = useSolanaWallet()
  const { connection, network } = useNetwork()
  const { toast } = useToast()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [filter, setFilter] = useState<string>("all")

  // Fetch transactions when wallet is connected
  useEffect(() => {
    if (connected && walletAddress) {
      fetchTransactions()
    } else {
      setTransactions([])
    }
  }, [connected, walletAddress, network])

  // Function to fetch transactions
  const fetchTransactions = async (reset = true) => {
    if (!connected || !walletAddress) return

    try {
      setLoading(reset)

      const txs = await getTransactionHistory(connection, walletAddress, network, 10)

      setTransactions(txs)
      setHasMore(txs.length === 10)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      toast({
        title: "Error",
        description: "Failed to fetch transactions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Function to load more transactions
  const loadMoreTransactions = async () => {
    if (!connected || !walletAddress || transactions.length === 0) return

    try {
      setLoadingMore(true)

      const lastSignature = transactions[transactions.length - 1].signature

      const moreTxs = await getTransactionHistory(connection, walletAddress, network, 10, lastSignature)

      if (moreTxs.length > 0) {
        setTransactions([...transactions, ...moreTxs])
      }

      setHasMore(moreTxs.length === 10)
    } catch (error) {
      console.error("Error loading more transactions:", error)
      toast({
        title: "Error",
        description: "Failed to load more transactions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingMore(false)
    }
  }

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "all") return true
    return tx.type === filter
  })

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <div className="flex items-center gap-2">
          <TransactionFilters value={filter} onChange={setFilter} />
          <Button variant="outline" size="icon" onClick={() => fetchTransactions()} disabled={loading || !connected}>
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {!connected ? (
        <div className="bg-secondary/30 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-4">Connect your wallet to view your transaction history.</p>
        </div>
      ) : loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card rounded-lg p-4">
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="bg-secondary/30 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No Transactions Found</h2>
          <p className="text-muted-foreground mb-4">
            {filter === "all" ? "You don't have any transactions yet." : `You don't have any ${filter} transactions.`}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {filteredTransactions.map((tx) => (
              <TransactionItem key={tx.signature} transaction={tx} network={network} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-6 text-center">
              <Button onClick={loadMoreTransactions} disabled={loadingMore} variant="outline">
                {loadingMore ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
