"use client"

import { useState, useEffect } from "react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { NetworkDetector } from "@/components/network-detector"
import { WalletStatus } from "@/components/wallet-status"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import { GoldTokenFaucet } from "@/components/gold-token-faucet"
import { TokenTransfer } from "@/components/token-transfer"
import { TransactionHistory } from "@/components/transaction-history"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  RefreshCw,
  Send,
  History,
  Gift,
  ExternalLink,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatNumber } from "@/lib/utils"
import Link from "next/link"

export default function DashboardClient() {
  const { connected, address, solBalance, goldBalance, isBalanceLoading, refreshBalance } = useSolanaWallet()
  const { network, networkConfig } = useNetwork()
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [portfolioValue, setPortfolioValue] = useState<number | null>(null)
  const [portfolioChange, setPortfolioChange] = useState<number>(0)

  // Calculate portfolio value
  useEffect(() => {
    if (goldBalance !== null && solBalance !== null) {
      // In a real implementation, this would fetch token prices
      // For this demo, we'll use fixed prices
      const goldPrice = 0.1 // 1 GOLD = 0.1 SOL
      const solPrice = 100 // 1 SOL = $100 USD

      const goldValueInSol = goldBalance * goldPrice
      const totalValueInSol = goldValueInSol + solBalance
      const totalValueInUsd = totalValueInSol * solPrice

      setPortfolioValue(totalValueInUsd)

      // Random portfolio change for demo
      setPortfolioChange(Math.random() > 0.5 ? 12.5 : -8.3)
    }
  }, [goldBalance, solBalance])

  // Handle refresh
  const handleRefresh = async () => {
    if (isRefreshing) return

    setIsRefreshing(true)
    await refreshBalance()
    setIsRefreshing(false)

    toast({
      title: "Balances Refreshed",
      description: "Your wallet balances have been updated",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <NetworkDetector />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
            GOLDIUM DASHBOARD
          </h1>
          <p className="text-muted-foreground">
            Manage your GOLD tokens and view your transactions
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          {connected ? (
            <WalletStatus />
          ) : (
            <WalletConnectModal />
          )}
        </div>
      </div>

      {connected ? (
        <>
          {/* Portfolio Summary */}
          <Card className="mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-yellow-500" />
                Portfolio Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
                  {isBalanceLoading || portfolioValue === null ? (
                    <Skeleton className="h-9 w-32" />
                  ) : (
                    <div className="text-3xl font-bold text-yellow-500">${formatNumber(portfolioValue)}</div>
                  )}
                  {!isBalanceLoading && portfolioValue !== null && (
                    <div
                      className={`text-sm flex items-center ${portfolioChange >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {portfolioChange >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(portfolioChange)}% {portfolioChange >= 0 ? "increase" : "decrease"} this week
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">GOLD Balance</div>
                  {isBalanceLoading ? (
                    <Skeleton className="h-9 w-32" />
                  ) : (
                    <div className="text-3xl font-bold text-yellow-500">{formatNumber(goldBalance || 0)} GOLD</div>
                  )}
                  <div className="text-sm flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">SOL Balance</div>
                  {isBalanceLoading ? (
                    <Skeleton className="h-9 w-32" />
                  ) : (
                    <div className="text-3xl font-bold text-yellow-500">{formatNumber(solBalance || 0)} SOL</div>
                  )}
                  <div className="text-sm flex items-center">
                    {networkConfig && address && (
                      <Link
                        href={`${networkConfig.explorerUrl}/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:text-blue-600 hover:underline flex items-center"
                      >
                        View on Explorer
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="overview">
                <Wallet className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="transfer">
                <Send className="mr-2 h-4 w-4" />
                Transfer
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="mr-2 h-4 w-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="faucet">
                <Gift className="mr-2 h-4 w-4" />
                Faucet
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TransactionHistory compact={false} maxItems={5} />
                </div>

                <div>
                  <GoldTokenFaucet />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transfer" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TokenTransfer />

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Coins className="h-5 w-5 mr-2 text-yellow-500" />
                      GOLD Token Info
                    </CardTitle>
                    <CardDescription>
                      Information about the GOLD token
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Token Address</h3>
                      <p className="text-sm break-all">{networkConfig.goldTokenAddress}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Network</h3>
                      <p className="text-sm">{network === "mainnet" ? "Solana Mainnet" : "Solana Testnet"}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Decimals</h3>
                      <p className="text-sm">9</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Total Supply</h3>
                      <p className="text-sm">1,000,000,000 GOLD</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => networkConfig && networkConfig.goldTokenAddress &&
                        window.open(`${networkConfig.explorerUrl}/address/${networkConfig.goldTokenAddress}`, "_blank")}
                      disabled={!networkConfig || !networkConfig.goldTokenAddress}
                    >
                      View Token on Explorer
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <TransactionHistory compact={false} maxItems={10} />
            </TabsContent>

            <TabsContent value="faucet" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GoldTokenFaucet />

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Gift className="h-5 w-5 mr-2 text-yellow-500" />
                      About the Faucet
                    </CardTitle>
                    <CardDescription>
                      How to get GOLD tokens on testnet
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      The GOLD token faucet allows you to claim free GOLD tokens on the Solana testnet for testing purposes.
                      You can claim tokens once every 24 hours.
                    </p>

                    <div className="bg-yellow-500/10 p-4 rounded-md">
                      <h3 className="font-medium text-yellow-500 mb-2">Important Notes</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Faucet is only available on Solana testnet</li>
                        <li>Tokens have no real value and are for testing only</li>
                        <li>Limited to one claim per wallet per day</li>
                        <li>You need a small amount of SOL for transaction fees</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Connect your Solana wallet to access the Goldium dashboard and manage your GOLD tokens.
          </p>
          <WalletConnectModal />
        </div>
      )}
    </div>
  )
}
