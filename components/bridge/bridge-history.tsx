"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Transaction {
  id: string
  sourceNetwork: string
  destinationNetwork: string
  sourceToken: string
  destinationToken: string
  amount: string
  receivedAmount: string
  status: "pending" | "completed" | "failed"
  timestamp: number
  txHash: string
}

export function BridgeHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [expandedTx, setExpandedTx] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    // Simulate wallet connection
    const timer = setTimeout(() => {
      setConnected(true)
      setWalletAddress("7Xf3bGGdT5zFQGAqJdUNJGBKMUaJeGXKA5FeHkj8kP")
      fetchTransactions()
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const mockTransactions: Transaction[] = [
        {
          id: "tx1",
          sourceNetwork: "ethereum",
          destinationNetwork: "solana",
          sourceToken: "ETH",
          destinationToken: "SOL",
          amount: "0.5",
          receivedAmount: "10.25",
          status: "completed",
          timestamp: Date.now() - 3600000, // 1 hour ago
          txHash: "0x" + Math.random().toString(16).substring(2, 42),
        },
        {
          id: "tx2",
          sourceNetwork: "solana",
          destinationNetwork: "binance",
          sourceToken: "SOL",
          destinationToken: "BNB",
          amount: "5",
          receivedAmount: "0.12",
          status: "pending",
          timestamp: Date.now() - 1800000, // 30 minutes ago
          txHash: "0x" + Math.random().toString(16).substring(2, 42),
        },
        {
          id: "tx3",
          sourceNetwork: "binance",
          destinationNetwork: "ethereum",
          sourceToken: "BNB",
          destinationToken: "USDT",
          amount: "0.2",
          receivedAmount: "50",
          status: "failed",
          timestamp: Date.now() - 86400000, // 1 day ago
          txHash: "0x" + Math.random().toString(16).substring(2, 42),
        },
      ]

      setTransactions(mockTransactions)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleExpand = (txId: string) => {
    if (expandedTx === txId) {
      setExpandedTx(null)
    } else {
      setExpandedTx(txId)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getExplorerLink = (network: string, txHash: string) => {
    if (network === "ethereum") {
      return `https://etherscan.io/tx/${txHash}`
    } else if (network === "solana") {
      return `https://explorer.solana.com/tx/${txHash}`
    } else if (network === "binance") {
      return `https://bscscan.com/tx/${txHash}`
    } else if (network === "polygon") {
      return `https://polygonscan.com/tx/${txHash}`
    } else if (network === "avalanche") {
      return `https://snowtrace.io/tx/${txHash}`
    }

    return "#"
  }

  const getNetworkIcon = (network: string) => {
    if (network === "ethereum") return "/ethereum-crystal.png"
    if (network === "solana") return "/images/solana-logo.png"
    if (network === "binance") return "/binance-logo.png"
    if (network === "polygon") return "/polygon-logo.png"
    if (network === "avalanche") return "/avalanche-logo.png"
    return "/placeholder.svg"
  }

  const getStatusIcon = (status: string) => {
    if (status === "pending") return <Clock className="h-4 w-4 text-amber-500" />
    if (status === "completed") return <CheckCircle className="h-4 w-4 text-green-500" />
    if (status === "failed") return <XCircle className="h-4 w-4 text-red-500" />
    return null
  }

  const getStatusColor = (status: string) => {
    if (status === "pending") return "bg-amber-500/20 text-amber-500 border-amber-500/30"
    if (status === "completed") return "bg-green-500/20 text-green-500 border-green-500/30"
    if (status === "failed") return "bg-red-500/20 text-red-500 border-red-500/30"
    return ""
  }

  if (!connected) {
    return (
      <Card className="border border-gold bg-black/60 backdrop-blur-sm mt-8">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-400">Connect your wallet to view transaction history</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-gold bg-black/60 backdrop-blur-sm mt-8">
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No bridge transactions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="border border-gray-800 rounded-lg overflow-hidden">
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-900/50"
                  onClick={() => toggleExpand(tx.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={getNetworkIcon(tx.sourceNetwork) || "/placeholder.svg"}
                        alt={tx.sourceNetwork}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5">
                        <img
                          src={getNetworkIcon(tx.destinationNetwork) || "/placeholder.svg"}
                          alt={tx.destinationNetwork}
                          className="w-4 h-4 rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">
                        {tx.amount} {tx.sourceToken} → {tx.receivedAmount} {tx.destinationToken}
                      </div>
                      <div className="text-xs text-gray-400">{formatDate(tx.timestamp)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={`flex items-center space-x-1 ${getStatusColor(tx.status)}`}>
                      {getStatusIcon(tx.status)}
                      <span className="capitalize">{tx.status}</span>
                    </Badge>
                    {expandedTx === tx.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedTx === tx.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 border-t border-gray-800 bg-gray-900/30">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">From Network</span>
                            <div className="flex items-center">
                              <img
                                src={getNetworkIcon(tx.sourceNetwork) || "/placeholder.svg"}
                                alt={tx.sourceNetwork}
                                className="w-4 h-4 rounded-full mr-1"
                              />
                              <span className="capitalize">{tx.sourceNetwork}</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">To Network</span>
                            <div className="flex items-center">
                              <img
                                src={getNetworkIcon(tx.destinationNetwork) || "/placeholder.svg"}
                                alt={tx.destinationNetwork}
                                className="w-4 h-4 rounded-full mr-1"
                              />
                              <span className="capitalize">{tx.destinationNetwork}</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Amount Sent</span>
                            <span>
                              {tx.amount} {tx.sourceToken}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Amount Received</span>
                            <span>
                              {tx.receivedAmount} {tx.destinationToken}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Transaction Hash</span>
                            <a
                              href={getExplorerLink(tx.sourceNetwork, tx.txHash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-gold hover:text-amber-400"
                            >
                              {tx.txHash.substring(0, 6)}...{tx.txHash.substring(tx.txHash.length - 4)}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Add default export to fix the error
export default BridgeHistory
