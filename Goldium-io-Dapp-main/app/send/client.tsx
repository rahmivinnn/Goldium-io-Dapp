"use client"

import { useState, useEffect } from "react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { NetworkDetector } from "@/components/network-detector"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import { TokenTransfer } from "@/components/token-transfer"
import { GiftGoldModal } from "@/components/gift-gold-modal"
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
  Send,
  Gift,
  History,
  ExternalLink,
  Info,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatNumber } from "@/lib/utils"
import { playTokenTransferSound } from "@/services/sound-effects-service"
import Link from "next/link"

export default function SendClient() {
  const { connected, address, solBalance, goldBalance, isBalanceLoading, refreshBalance } = useSolanaWallet()
  const { network, networkConfig } = useNetwork()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("send")
  const [mounted, setMounted] = useState(false)

  // Set mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <NetworkDetector />

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
            SEND GOLD TOKENS
          </h1>

          {!connected && (
            <div className="mt-4 md:mt-0">
              <WalletConnectModal />
            </div>
          )}
        </div>

        {connected ? (
          <>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="send">
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </TabsTrigger>
                <TabsTrigger value="gift">
                  <Gift className="mr-2 h-4 w-4" />
                  Gift
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="mr-2 h-4 w-4" />
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="send" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TokenTransfer />

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Info className="h-5 w-5 mr-2 text-yellow-500" />
                        Transfer Information
                      </CardTitle>
                      <CardDescription>
                        Important information about sending GOLD tokens
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-yellow-500/10 p-4 rounded-md">
                        <div className="flex items-center text-yellow-500 mb-2">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          <h3 className="font-medium">Important Notes</h3>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Always double-check the recipient address</li>
                          <li>Blockchain transactions are irreversible</li>
                          <li>You need SOL to pay for transaction fees</li>
                          <li>Transactions typically confirm within seconds</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Network</h3>
                        <p className="text-sm flex items-center">
                          {network === "mainnet" ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                              Solana Mainnet
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
                              Solana Testnet
                            </>
                          )}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Your Balance</h3>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">GOLD:</span>
                          {isBalanceLoading ? (
                            <Skeleton className="h-4 w-16" />
                          ) : (
                            <span className="text-sm font-medium">{formatNumber(goldBalance || 0)} GOLD</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm">SOL:</span>
                          {isBalanceLoading ? (
                            <Skeleton className="h-4 w-16" />
                          ) : (
                            <span className="text-sm font-medium">{formatNumber(solBalance || 0, 6)} SOL</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => networkConfig && address &&
                          window.open(`${networkConfig.explorerUrl}/address/${address}`, "_blank")}
                        disabled={!networkConfig || !address}
                      >
                        View Wallet on Explorer
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="gift" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Gift className="h-5 w-5 mr-2 text-yellow-500" />
                        Gift GOLD Tokens
                      </CardTitle>
                      <CardDescription>
                        Send GOLD tokens as a gift with a personal message
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-8">
                      <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
                        <Gift className="h-8 w-8 text-yellow-500" />
                      </div>
                      <p className="text-center mb-6 max-w-xs">
                        Surprise someone with GOLD tokens! Add a personal message to make your gift special.
                      </p>
                      <GiftGoldModal
                        trigger={
                          <Button className="bg-gradient-to-r from-amber-500 to-yellow-300 text-black hover:from-amber-600 hover:to-yellow-400">
                            <Gift className="mr-2 h-4 w-4" />
                            Create Gift
                          </Button>
                        }
                        onSuccess={() => {
                          refreshBalance()
                          toast({
                            title: "Gift Sent Successfully",
                            description: "Your GOLD tokens have been gifted!",
                          })
                          playTokenTransferSound()
                        }}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CheckCircle2 className="h-5 w-5 mr-2 text-yellow-500" />
                        Benefits of Gifting
                      </CardTitle>
                      <CardDescription>
                        Why gifting GOLD tokens is a great idea
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-yellow-500 font-bold">1</span>
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Personal Touch</h3>
                          <p className="text-sm text-muted-foreground">
                            Add a personal message to make your gift meaningful and memorable.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-yellow-500 font-bold">2</span>
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Introduce Friends to Crypto</h3>
                          <p className="text-sm text-muted-foreground">
                            Help friends and family get started with cryptocurrency by gifting them GOLD tokens.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-yellow-500 font-bold">3</span>
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Celebrate Special Occasions</h3>
                          <p className="text-sm text-muted-foreground">
                            Perfect for birthdays, holidays, or any special occasion worth celebrating.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <TransactionHistory compact={false} maxItems={10} />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Connect your Solana wallet to send and gift GOLD tokens.
            </p>
            <WalletConnectModal />
          </div>
        )}
      </div>
    </div>
  )
}
