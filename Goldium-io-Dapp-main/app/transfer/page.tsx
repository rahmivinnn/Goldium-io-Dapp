"use client"

import { TokenTransfer } from "@/components/defi/token-transfer"
import { BatchTokenTransfer } from "@/components/defi/batch-token-transfer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { ArrowLeftRight, History, Users } from "lucide-react"
import { TransactionHistory } from "@/components/transaction-history"

export default function TransferPage() {
  const { connected } = useSolanaWallet()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 gold-gradient">Token Transfer</h1>

      {!connected ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Card className="border-gold bg-slate-900/80 backdrop-blur-sm w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Connect Your Wallet</CardTitle>
              <CardDescription className="text-center">Connect your wallet to transfer tokens</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ConnectWalletButton className="gold-button" />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Tabs defaultValue="transfer" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="transfer" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <ArrowLeftRight className="mr-2 h-5 w-5" />
              Transfer
            </TabsTrigger>
            <TabsTrigger value="batch" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <Users className="mr-2 h-5 w-5" />
              Batch
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              <History className="mr-2 h-5 w-5" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transfer" className="mt-0">
            <TokenTransfer />
          </TabsContent>

          <TabsContent value="batch" className="mt-0">
            <BatchTokenTransfer />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <Card className="border-gold bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl gold-gradient">Transaction History</CardTitle>
                <CardDescription>Your recent token transfers</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionHistory />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
