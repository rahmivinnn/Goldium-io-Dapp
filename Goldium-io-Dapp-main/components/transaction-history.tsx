"use client"

import { useState, useEffect } from "react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ExternalLink,
  Coins,
  Repeat,
  Wallet,
  ArrowDownLeft
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { type Transaction, getTransactionHistory, getTransactionExplorerUrl } from "@/services/transaction-service"

type TransactionHistoryProps = {
  compact?: boolean;
  maxItems?: number;
  showHeader?: boolean;
  className?: string;
}

export function TransactionHistory({
  compact = false,
  maxItems = 5,
  showHeader = true,
  className = ""
}: TransactionHistoryProps) {
  const { connected, address, refreshBalance } = useSolanaWallet()
  const { network, networkConfig } = useNetwork()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filter, setFilter] = useState<"all" | "send" | "receive" | "swap" | "stake" | "claim">("all")

  // Fetch transactions
  const fetchTransactions = async (refresh = false) => {
    if (!connected || !address) return

    if (refresh) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }

    try {
      // In a real implementation, this would fetch transactions from the blockchain
      // For this demo, we'll use mock data

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Generate mock transactions
      const mockTransactions: Transaction[] = Array.from({ length: 10 }, (_, i) => {
        const types: Transaction["type"][] = ["send", "receive", "swap", "stake", "unstake", "claim"]
        const type = types[Math.floor(Math.random() * types.length)] as Transaction["type"]
        const now = Date.now()
        const blockTime = Math.floor((now - i * 86400000 * Math.random()) / 1000) // Random time in the past

        return {
          signature: `${Array.from({ length: 16 }, () =>
            "0123456789abcdef"[Math.floor(Math.random() * 16)]
          ).join("")}...`,
          blockTime,
          type,
          status: Math.random() > 0.1 ? "confirmed" : Math.random() > 0.5 ? "failed" : "pending",
          amount: Math.floor(Math.random() * 1000) / 10,
          fee: Math.floor(Math.random() * 100) / 100,
          from: type === "receive" ? `${Array.from({ length: 8 }, () =>
            "0123456789abcdef"[Math.floor(Math.random() * 16)]
          ).join("")}...` : address,
          to: type === "send" ? `${Array.from({ length: 8 }, () =>
            "0123456789abcdef"[Math.floor(Math.random() * 16)]
          ).join("")}...` : address,
          description: getTransactionDescription(type),
          token: Math.random() > 0.3 ? "GOLD" : "SOL",
        }
      })

      setTransactions(mockTransactions)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Get transaction description
  const getTransactionDescription = (type: Transaction["type"]) => {
    switch (type) {
      case "send":
        return "Sent tokens"
      case "receive":
        return "Received tokens"
      case "swap":
        return "Swapped tokens"
      case "stake":
        return "Staked tokens"
      case "unstake":
        return "Unstaked tokens"
      case "claim":
        return "Claimed rewards"
      default:
        return "Transaction"
    }
  }

  // Format time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000)
    return formatDistanceToNow(date, { addSuffix: true })
  }

  // Get transaction icon
  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "receive":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case "swap":
        return <Repeat className="h-4 w-4 text-blue-500" />
      case "stake":
        return <Wallet className="h-4 w-4 text-purple-500" />
      case "unstake":
        return <Wallet className="h-4 w-4 text-orange-500" />
      case "claim":
        return <Coins className="h-4 w-4 text-yellow-500" />
      default:
        return <Coins className="h-4 w-4" />
    }
  }

  // Get status badge
  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Confirmed</Badge>
      case "failed":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Failed</Badge>
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>
    }
  }

  // Format address
  const formatAddress = (address: string) => {
    if (!address) return ""
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  // Filter transactions
  const filteredTransactions = filter === "all"
    ? transactions
    : transactions.filter(tx => tx.type === filter)

  // Limit transactions based on maxItems
  const limitedTransactions = filteredTransactions.slice(0, maxItems)

  // Fetch transactions on mount
  useEffect(() => {
    if (connected && address) {
      fetchTransactions()
    }
  }, [connected, address])

  // Handle refresh
  const handleRefresh = () => {
    fetchTransactions(true)
  }

  // Compact view
  if (compact) {
    return (
      <div className={`space-y-4 ${className}`}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-gold/30 bg-black/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-10 w-[200px]" />
                  <Skeleton className="h-6 w-[50px]" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : limitedTransactions.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No transactions found
          </div>
        ) : (
          limitedTransactions.map((tx) => (
            <Card key={tx.signature} className="border-gold/30 bg-black/50 hover:bg-black/80 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-full ${tx.type === "send" ? "bg-red-500/20" : "bg-green-500/20"}`}>
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">
                        {tx.type === "send" ? "Sent" : "Received"} {tx.amount?.toFixed(4)} {tx.token}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatTime(tx.blockTime)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {networkConfig && tx.signature && (
                      <a
                        href={`${networkConfig.explorerUrl}/tx/${tx.signature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gold flex items-center justify-end hover:underline"
                      >
                        <span>View</span>
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {tx.type === "send" ? "To: " : "From: "}
                  {formatAddress(tx.type === "send" ? tx.to : tx.from)}
                </div>
              </CardContent>
            </Card>
          ))
        )}
        {!isLoading && limitedTransactions.length > 0 && (
          <div className="text-center">
            <Button variant="link" size="sm" className="text-xs text-gold">
              View All Transactions
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Full view
  return (
    <Card className={`w-full ${className}`}>
      {showHeader && (
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Recent transactions for your wallet
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="send">Sent</SelectItem>
                  <SelectItem value="receive">Received</SelectItem>
                  <SelectItem value="swap">Swaps</SelectItem>
                  <SelectItem value="stake">Stakes</SelectItem>
                  <SelectItem value="claim">Claims</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
      )}
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : limitedTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {limitedTransactions.map((tx) => (
                <TableRow key={tx.signature}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(tx.type)}
                      <span className="font-medium">{tx.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`font-medium ${tx.type === "send" ? "text-red-500" : tx.type === "receive" ? "text-green-500" : ""}`}>
                      {tx.type === "send" ? "-" : tx.type === "receive" ? "+" : ""}
                      {tx.amount} {tx.token}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(tx.blockTime)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(tx.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    {networkConfig && tx.signature && (
                      <a
                        href={`${networkConfig.explorerUrl}/tx/${tx.signature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-500 hover:text-blue-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {!isLoading && limitedTransactions.length > 0 && (
        <CardFooter className="flex justify-center">
          <Button variant="outline" size="sm" className="text-xs">
            View All Transactions
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

// Also add default export for backward compatibility
export default TransactionHistory
