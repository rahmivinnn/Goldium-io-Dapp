"use client"

import { useState } from "react"
import { WalletDisplay } from "@/components/wallet-display"
import { TokenTransfer } from "@/components/defi/token-transfer"
import { TransactionMonitor } from "@/components/transaction-monitor"
import { TransactionItem } from "@/components/transactions/transaction-item"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { TokenContractDisplay } from "@/components/token-contract-display"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTransactionHistory, type Transaction } from "@/services/transaction-service"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function WalletPage() {
  const { connected, connection, address } = useSolanaWallet()
  const { network } = useNetwork()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch transaction history
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!connected || !connection || !address) return

      try {
        setLoading(true)
        const txs = await getTransactionHistory(connection, address, network)
        setTransactions(txs)
      } catch (error) {
        console.error("Error fetching transaction history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [connected, connection, address, network])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 gold-gradient">Wallet Dashboard</h1>

      {!connected ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
          <p className="text-lg text-gray-400 mb-4">Connect your wallet to access the dashboard</p>
          <ConnectWalletButton className="gold-button text-lg py-3 px-8" />

          <div className="mt-8 w-full max-w-md">
            <TokenContractDisplay />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <WalletDisplay />
            <TransactionMonitor />
          </div>

          {/* Middle Column */}
          <div className="md:col-span-2">
            <Tabs defaultValue="transfer" className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="transfer">Transfer Tokens</TabsTrigger>
                <TabsTrigger value="history">Transaction History</TabsTrigger>
              </TabsList>

              <TabsContent value="transfer">
                <TokenTransfer />
              </TabsContent>

              <TabsContent value="history">
                <Card className="border-yellow-500/30 bg-black/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">No transaction history found</div>
                    ) : (
                      <div className="space-y-4">
                        {transactions.map((tx) => (
                          <TransactionItem key={tx.signature} transaction={tx} network={network} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  )
}
