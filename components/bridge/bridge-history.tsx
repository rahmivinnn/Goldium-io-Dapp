"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserBridgeTransactions, type BridgeTransaction } from "@/services/bridge-service"
import { formatDistanceToNow } from "date-fns"
import { CheckCircleIcon, XCircleIcon, ClockIcon, ExternalLinkIcon } from "lucide-react"
import Image from "next/image"

interface BridgeHistoryProps {
  walletAddress?: string
}

const getNetworkIcon = (networkId: string) => {
  const networkIcons: Record<string, string> = {
    ethereum: "/images/ethereum-logo.png",
    solana: "/images/solana-logo.png",
    binance: "/images/binance-logo.png",
    polygon: "/images/polygon-logo.png",
    avalanche: "/images/avalanche-logo.png",
  }

  return networkIcons[networkId] || "/images/ethereum-logo.png"
}

const getExplorerUrl = (network: string, hash: string) => {
  const explorers: Record<string, string> = {
    ethereum: `https://etherscan.io/tx/${hash}`,
    solana: `https://explorer.solana.com/tx/${hash}`,
    binance: `https://bscscan.com/tx/${hash}`,
    polygon: `https://polygonscan.com/tx/${hash}`,
    avalanche: `https://snowtrace.io/tx/${hash}`,
  }

  return explorers[network] || "#"
}

export default function BridgeHistory({ walletAddress }: BridgeHistoryProps) {
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (walletAddress) {
        try {
          setIsLoading(true)
          const txs = await getUserBridgeTransactions(walletAddress)
          setTransactions(txs)
        } catch (error) {
          console.error("Failed to fetch bridge transactions:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchTransactions()
  }, [walletAddress])

  if (isLoading) {
    return (
      <Card className="border border-amber-500/20 bg-black/60 backdrop-blur-sm mt-8">
        <CardHeader>
          <CardTitle className="text-amber-500">Recent Bridge Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <ClockIcon className="animate-spin h-8 w-8 text-amber-500" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!walletAddress) {
    return (
      <Card className="border border-amber-500/20 bg-black/60 backdrop-blur-sm mt-8">
        <CardHeader>
          <CardTitle className="text-amber-500">Recent Bridge Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            Connect your wallet to view your bridge transaction history
          </div>
        </CardContent>
      </Card>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card className="border border-amber-500/20 bg-black/60 backdrop-blur-sm mt-8">
        <CardHeader>
          <CardTitle className="text-amber-500">Recent Bridge Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">No bridge transactions found</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border border-amber-500/20 bg-black/60 backdrop-blur-sm mt-8">
      <CardHeader>
        <CardTitle className="text-amber-500">Recent Bridge Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  {tx.status === "completed" && <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />}
                  {tx.status === "pending" && <ClockIcon className="h-5 w-5 text-amber-500 mr-2" />}
                  {tx.status === "failed" && <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />}
                  <span className="text-sm capitalize">{tx.status}</span>
                </div>
                <div className="text-xs text-gray-400">{formatDistanceToNow(tx.timestamp, { addSuffix: true })}</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 relative mr-2 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                    <Image
                      src={getNetworkIcon(tx.sourceNetwork) || "/placeholder.svg"}
                      alt={tx.sourceNetwork}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-white">
                      {tx.amount} {tx.sourceToken}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">{tx.sourceNetwork}</div>
                  </div>
                </div>

                <div className="text-amber-500">→</div>

                <div className="flex items-center">
                  <div className="w-8 h-8 relative mr-2 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                    <Image
                      src={getNetworkIcon(tx.destinationNetwork) || "/placeholder.svg"}
                      alt={tx.destinationNetwork}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-white">
                      {(Number.parseFloat(tx.amount) - Number.parseFloat(tx.fee)).toFixed(4)} {tx.destinationToken}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">{tx.destinationNetwork}</div>
                  </div>
                </div>
              </div>

              {tx.hash && (
                <div className="mt-4 flex justify-between items-center text-xs">
                  <div className="text-gray-400">
                    Tx: {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 8)}
                  </div>
                  <a
                    href={getExplorerUrl(tx.sourceNetwork, tx.hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-amber-500 hover:text-amber-400"
                  >
                    View <ExternalLinkIcon className="h-3 w-3 ml-1" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
