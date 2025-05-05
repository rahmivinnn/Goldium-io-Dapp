"use client"

import { useState, useEffect } from "react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { Connection, PublicKey } from "@solana/web3.js"
import { useToast } from "@/hooks/use-toast"
import { Search, Filter, ArrowUpRight, ArrowDownLeft, RefreshCw, Coins, ImageIcon, X, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Transaction type
export type TransactionType = "send" | "receive" | "swap" | "stake" | "unstake" | "claim" | "nft" | "all"
export type TransactionStatus = "confirmed" | "pending" | "failed" | "all"

interface Transaction {
  signature: string
  blockTime: number
  type: TransactionType
  amount: number
  otherParty: string
  status: "confirmed" | "pending" | "failed"
  token: string
  fee: number
  description?: string
}

// Date range type
interface DateRange {
  from: Date | null
  to: Date | null
}

// Amount range type
interface AmountRange {
  min: number
  max: number
}

// Filter state type
interface FilterState {
  type: TransactionType
  status: TransactionStatus
  dateRange: DateRange
  amountRange: AmountRange
  token: string
  searchQuery: string
}

export default function TransactionsPage() {
  const { connected, address } = useSolanaWallet()
  const { toast } = useToast()
  const { endpoint, network } = useNetwork()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [connection, setConnection] = useState<Connection | null>(null)

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    status: "all",
    dateRange: { from: null, to: null },
    amountRange: { min: 0, max: 1000 },
    token: "all",
    searchQuery: "",
  })

  // Active filters count
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Filter panel visibility
  const [showFilters, setShowFilters] = useState(false)

  // Available tokens
  const availableTokens = ["GOLD", "SOL", "USDC", "BTC"]

  // Initialize connection and fetch data
  useEffect(() => {
    if (!connected || !address) return

    const initConnection = async () => {
      try {
        setIsLoading(true)
        const conn = new Connection(endpoint, "confirmed")
        setConnection(conn)

        // Fetch transactions
        await fetchTransactions(conn, new PublicKey(address))

        setIsLoading(false)
      } catch (error) {
        console.error("Error initializing:", error)
        toast({
          title: "Connection Error",
          description: "Failed to connect to the Solana network",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    initConnection()
  }, [connected, address, endpoint])

  // Count active filters
  useEffect(() => {
    let count = 0

    if (filters.type !== "all") count++
    if (filters.status !== "all") count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    if (filters.amountRange.min > 0 || filters.amountRange.max < 1000) count++
    if (filters.token !== "all") count++
    if (filters.searchQuery) count++

    setActiveFiltersCount(count)
  }, [filters])

  // Apply filters when filter state changes
  useEffect(() => {
    applyFilters()
  }, [filters, transactions])

  // Fetch transactions
  const fetchTransactions = async (conn: Connection, walletPubkey: PublicKey) => {
    try {
      // In a real implementation, this would fetch token transfer history
      // For demo purposes, we're using mock data

      // Generate mock transactions
      const mockTransactions: Transaction[] = []
      const types: TransactionType[] = ["send", "receive", "swap", "stake", "unstake", "claim", "nft"]
      const statuses: ("confirmed" | "pending" | "failed")[] = ["confirmed", "pending", "failed"]
      const tokens = ["GOLD", "SOL", "USDC", "BTC"]

      // Generate 50 random transactions
      for (let i = 0; i < 50; i++) {
        const type = types[Math.floor(Math.random() * types.length)] as TransactionType
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        const token = tokens[Math.floor(Math.random() * tokens.length)]
        const amount = Math.random() * 1000
        const fee = Math.random() * 0.1

        // Generate a random date within the last 30 days
        const date = new Date()
        date.setDate(date.getDate() - Math.floor(Math.random() * 30))

        mockTransactions.push({
          signature: `mock-signature-${i}-${Math.random().toString(36).substring(2, 10)}`,
          blockTime: date.getTime() / 1000,
          type,
          amount,
          otherParty: `mock-address-${Math.random().toString(36).substring(2, 10)}`,
          status,
          token,
          fee,
          description: getTransactionDescription(type, token, amount),
        })
      }

      // Sort by block time (newest first)
      mockTransactions.sort((a, b) => b.blockTime - a.blockTime)

      setTransactions(mockTransactions)
      setFilteredTransactions(mockTransactions)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      toast({
        title: "Error",
        description: "Failed to fetch transaction history",
        variant: "destructive",
      })
    }
  }

  // Get transaction description
  const getTransactionDescription = (type: TransactionType, token: string, amount: number): string => {
    switch (type) {
      case "send":
        return `Sent ${amount.toFixed(2)} ${token}`
      case "receive":
        return `Received ${amount.toFixed(2)} ${token}`
      case "swap":
        return `Swapped for ${amount.toFixed(2)} ${token}`
      case "stake":
        return `Staked ${amount.toFixed(2)} ${token}`
      case "unstake":
        return `Unstaked ${amount.toFixed(2)} ${token}`
      case "claim":
        return `Claimed ${amount.toFixed(2)} ${token} rewards`
      case "nft":
        return `NFT Transaction`
      default:
        return `Transaction of ${amount.toFixed(2)} ${token}`
    }
  }

  // Apply filters
  const applyFilters = () => {
    let filtered = [...transactions]

    // Filter by type
    if (filters.type !== "all") {
      filtered = filtered.filter((tx) => tx.type === filters.type)
    }

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter((tx) => tx.status === filters.status)
    }

    // Filter by date range
    if (filters.dateRange.from) {
      const fromTimestamp = filters.dateRange.from.getTime() / 1000
      filtered = filtered.filter((tx) => tx.blockTime >= fromTimestamp)
    }

    if (filters.dateRange.to) {
      const toTimestamp = filters.dateRange.to.getTime() / 1000
      filtered = filtered.filter((tx) => tx.blockTime <= toTimestamp)
    }

    // Filter by amount range
    filtered = filtered.filter((tx) => tx.amount >= filters.amountRange.min && tx.amount <= filters.amountRange.max)

    // Filter by token
    if (filters.token !== "all") {
      filtered = filtered.filter((tx) => tx.token === filters.token)
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (tx) =>
          tx.signature.toLowerCase().includes(query) ||
          tx.otherParty.toLowerCase().includes(query) ||
          tx.description?.toLowerCase().includes(query) ||
          tx.amount.toString().includes(query),
      )
    }

    setFilteredTransactions(filtered)
  }

  // Update filter
  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: "all",
      status: "all",
      dateRange: { from: null, to: null },
      amountRange: { min: 0, max: 1000 },
      token: "all",
      searchQuery: "",
    })
  }

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  // Format address
  const formatAddress = (address: string) => {
    if (address.length > 12) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    }
    return address
  }

  // Get transaction icon
  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case "receive":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case "swap":
        return <RefreshCw className="h-4 w-4 text-blue-500" />
      case "stake":
        return <Coins className="h-4 w-4 text-yellow-500" />
      case "unstake":
        return <Coins className="h-4 w-4 text-orange-500" />
      case "claim":
        return <ArrowDownLeft className="h-4 w-4 text-purple-500" />
      case "nft":
        return <ImageIcon className="h-4 w-4 text-pink-500" />
      default:
        return <ArrowUpRight className="h-4 w-4 text-gray-500" />
    }
  }

  // Get transaction type label
  const getTransactionTypeLabel = (type: TransactionType) => {
    switch (type) {
      case "send":
        return "Sent"
      case "receive":
        return "Received"
      case "swap":
        return "Swapped"
      case "stake":
        return "Staked"
      case "unstake":
        return "Unstaked"
      case "claim":
        return "Claimed"
      case "nft":
        return "NFT"
      default:
        return "Unknown"
    }
  }

  // Get transaction type color
  const getTransactionTypeColor = (type: TransactionType) => {
    switch (type) {
      case "send":
        return "bg-red-900 text-red-200"
      case "receive":
        return "bg-green-900 text-green-200"
      case "swap":
        return "bg-blue-900 text-blue-200"
      case "stake":
        return "bg-yellow-900 text-yellow-200"
      case "unstake":
        return "bg-orange-900 text-orange-200"
      case "claim":
        return "bg-purple-900 text-purple-200"
      case "nft":
        return "bg-pink-900 text-pink-200"
      default:
        return "bg-gray-900 text-gray-200"
    }
  }

  // Export transactions to CSV
  const exportToCSV = () => {
    // Create CSV content
    const headers = ["Type", "Amount", "Token", "Address", "Date", "Status", "Fee", "Signature"]
    const rows = filteredTransactions.map((tx) => [
      getTransactionTypeLabel(tx.type),
      tx.amount.toFixed(2),
      tx.token,
      tx.otherParty,
      formatDate(tx.blockTime),
      tx.status,
      tx.fee.toFixed(6),
      tx.signature,
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `goldium-transactions-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Successful",
      description: "Your transactions have been exported to CSV",
    })
  }

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-black/50 backdrop-blur-md border border-gold/20 rounded-lg p-8 text-center">
          <h1 className="text-3xl font-orbitron text-gold mb-4">Transaction History</h1>
          <p className="text-gray-300 mb-6">Please connect your wallet to view your transaction history.</p>
          <button
            className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold py-2 px-6 rounded-full"
            onClick={() =>
              toast({
                title: "Wallet Required",
                description: "Please connect your wallet using the button in the header",
              })
            }
          >
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-black/50 backdrop-blur-md border border-gold/20 rounded-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-orbitron text-gold">Transaction History</h1>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="border-gold/30 text-gold hover:bg-gold/10"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && <Badge className="ml-2 bg-gold text-black">{activeFiltersCount}</Badge>}
            </Button>

            <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by signature, address, or description..."
              className="pl-10 bg-gray-800 border-gray-700 text-white"
              value={filters.searchQuery}
              onChange={(e) => updateFilter("searchQuery", e.target.value)}
            />
            {filters.searchQuery && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => updateFilter("searchQuery", "")}
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Advanced filters panel */}
        {showFilters && (
          <Card className="mb-6 bg-gray-900 border-gray-700">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-gold">Advanced Filters</CardTitle>
                <Button variant="ghost" size="sm" onClick={resetFilters} className="text-gray-400 hover:text-white">
                  Reset All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Transaction Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Transaction Type</label>
                  <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="send">Send</SelectItem>
                      <SelectItem value="receive">Receive</SelectItem>
                      <SelectItem value="swap">Swap</SelectItem>
                      <SelectItem value="stake">Stake</SelectItem>
                      <SelectItem value="unstake">Unstake</SelectItem>
                      <SelectItem value="claim">Claim</SelectItem>
                      <SelectItem value="nft">NFT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) => updateFilter("status", value as TransactionStatus)}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Token Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Token</label>
                  <Select value={filters.token} onValueChange={(value) => updateFilter("token", value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-700">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all">All Tokens</SelectItem>
                      {availableTokens.map((token) => (
                        <SelectItem key={token} value={token}>
                          {token}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">From</label>
                      <Input
                        type="date"
                        className="bg-gray-800 border-gray-700 text-white"
                        value={filters.dateRange.from ? filters.dateRange.from.toISOString().split("T")[0] : ""}
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : null
                          updateFilter("dateRange", { ...filters.dateRange, from: date })
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">To</label>
                      <Input
                        type="date"
                        className="bg-gray-800 border-gray-700 text-white"
                        value={filters.dateRange.to ? filters.dateRange.to.toISOString().split("T")[0] : ""}
                        onChange={(e) => {
                          const date = e.target.value ? new Date(e.target.value) : null
                          updateFilter("dateRange", { ...filters.dateRange, to: date })
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Amount Range Filter */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Amount Range: {filters.amountRange.min.toFixed(0)} - {filters.amountRange.max.toFixed(0)}
                  </label>
                  <div className="px-2">
                    <Slider
                      defaultValue={[filters.amountRange.min, filters.amountRange.max]}
                      min={0}
                      max={1000}
                      step={10}
                      onValueChange={(value) => {
                        updateFilter("amountRange", { min: value[0], max: value[1] })
                      }}
                      className="my-6"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>250</span>
                    <span>500</span>
                    <span>750</span>
                    <span>1000+</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active filters display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.type !== "all" && (
              <Badge className="bg-gray-700 text-white flex items-center gap-1 px-3 py-1">
                Type: {getTransactionTypeLabel(filters.type)}
                <button onClick={() => updateFilter("type", "all")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.status !== "all" && (
              <Badge className="bg-gray-700 text-white flex items-center gap-1 px-3 py-1">
                Status: {filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}
                <button onClick={() => updateFilter("status", "all")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.token !== "all" && (
              <Badge className="bg-gray-700 text-white flex items-center gap-1 px-3 py-1">
                Token: {filters.token}
                <button onClick={() => updateFilter("token", "all")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {(filters.dateRange.from || filters.dateRange.to) && (
              <Badge className="bg-gray-700 text-white flex items-center gap-1 px-3 py-1">
                Date: {filters.dateRange.from ? filters.dateRange.from.toLocaleDateString() : "Any"}
                {" - "}
                {filters.dateRange.to ? filters.dateRange.to.toLocaleDateString() : "Any"}
                <button onClick={() => updateFilter("dateRange", { from: null, to: null })}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {(filters.amountRange.min > 0 || filters.amountRange.max < 1000) && (
              <Badge className="bg-gray-700 text-white flex items-center gap-1 px-3 py-1">
                Amount: {filters.amountRange.min.toFixed(0)} - {filters.amountRange.max.toFixed(0)}
                <button onClick={() => updateFilter("amountRange", { min: 0, max: 1000 })}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Transactions list */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-gray-800">
            <p className="text-gray-400 mb-2">No transactions found</p>
            <p className="text-gray-500 text-sm">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Address
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Fee
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.signature} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(tx.type)}`}
                      >
                        {getTransactionIcon(tx.type)}
                        <span className="ml-1">{getTransactionTypeLabel(tx.type)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {tx.amount.toFixed(2)} {tx.token}
                      </div>
                      {tx.description && <div className="text-xs text-gray-400">{tx.description}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{formatAddress(tx.otherParty)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(tx.blockTime)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tx.status === "confirmed"
                            ? "bg-blue-900 text-blue-200"
                            : tx.status === "pending"
                              ? "bg-yellow-900 text-yellow-200"
                              : "bg-red-900 text-red-200"
                        }`}
                      >
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{tx.fee.toFixed(6)} SOL</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-400">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10" disabled>
                Previous
              </Button>
              <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
