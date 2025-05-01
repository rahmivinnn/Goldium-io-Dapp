"use client"

import { useState, useEffect } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { WalletConnectOverlay } from "@/components/wallet-connect-overlay"
import { TransactionItem } from "@/components/transactions/transaction-item"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import {
  getTransactionHistory,
  type TransactionItem as TransactionItemType,
  type TransactionType,
} from "@/services/transaction-service"
import { RefreshCw } from "lucide-react"

const ITEMS_PER_PAGE = 10

export default function TransactionsPage() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [transactions, setTransactions] = useState<TransactionItemType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<TransactionType>("all")
  const [lastSignature, setLastSignature] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  // Fetch transactions when wallet connects or filter changes
  useEffect(() => {
    if (!publicKey) return

    const fetchTransactions = async () => {
      setLoading(true)
      setError(null)

      try {
        const txs = await getTransactionHistory(connection, publicKey.toString(), ITEMS_PER_PAGE)

        setTransactions(txs)
        setHasMore(txs.length === ITEMS_PER_PAGE)

        if (txs.length > 0) {
          setLastSignature(txs[txs.length - 1].signature)
        } else {
          setLastSignature(undefined)
          setHasMore(false)
        }
      } catch (err) {
        console.error("Error fetching transactions:", err)
        setError("Failed to load transactions. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [publicKey, connection, refreshKey])

  const loadMore = async () => {
    if (!publicKey || !lastSignature || !hasMore) return

    setLoading(true)

    try {
      const txs = await getTransactionHistory(connection, publicKey.toString(), ITEMS_PER_PAGE, lastSignature)

      if (txs.length > 0) {
        setTransactions([...transactions, ...txs])
        setLastSignature(txs[txs.length - 1].signature)
        setHasMore(txs.length === ITEMS_PER_PAGE)
      } else {
        setHasMore(false)
      }
    } catch (err) {
      console.error("Error fetching more transactions:", err)
      setError("Failed to load more transactions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (type: TransactionType) => {
    setActiveFilter(type)
    // Reset pagination when filter changes
    setLastSignature(undefined)
    setRefreshKey((prev) => prev + 1)
  }

  const handleRefresh = () => {
    setLastSignature(undefined)
    setRefreshKey((prev) => prev + 1)
  }

  const filteredTransactions =
    activeFilter === "all" ? transactions : transactions.filter((tx) => tx.type === activeFilter)

  if (!publicKey) {
    return (
      <div className="container mx-auto px-4 py-16">
        <WalletConnectOverlay message="Connect your wallet to view your transaction history" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <TransactionFilters onFilterChange={handleFilterChange} activeFilter={activeFilter} />

        <Button
          variant="outline"
          className="border-gold/30 text-gold hover:bg-gold/10"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-red-500/50 mb-6">
          <CardContent className="pt-6 text-red-500">{error}</CardContent>
        </Card>
      )}

      {loading && transactions.length === 0 ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="border border-gold/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div>
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredTransactions.length === 0 ? (
        <Card className="border border-gold/20 p-6 text-center">
          <p className="text-gray-400">No transactions found.</p>
          {activeFilter !== "all" && (
            <Button variant="link" className="text-gold mt-2" onClick={() => handleFilterChange("all")}>
              View all transactions
            </Button>
          )}
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {filteredTransactions.map((tx) => (
              <TransactionItem key={tx.signature} transaction={tx} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                className="border-gold/30 text-gold hover:bg-gold/10"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
