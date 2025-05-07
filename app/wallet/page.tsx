"use client"

import { useState, useEffect } from "react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { NetworkSelector } from "@/components/network-selector"
import { GiftGoldModal } from "@/components/gift-gold-modal"
import { Copy, ExternalLink, RefreshCw, Loader2, Gift } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { playWalletSound } from "@/services/sound-effects-service"
import Link from "next/link"

export default function WalletPage() {
  const { connected, address, solBalance, goldBalance, isBalanceLoading, refreshBalance, walletType } =
    useSolanaWallet()
  const { explorerUrl } = useNetwork()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Play wallet connected sound if wallet is connected
    if (connected) {
      playWalletSound(true)
    }
  }, [connected])

  const handleCopyAddress = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    })
  }

  const handleViewOnExplorer = () => {
    if (!address) return
    window.open(`${explorerUrl}/address/${address}`, "_blank")
  }

  const handleRefreshBalance = async () => {
    await refreshBalance()
    toast({
      title: "Balance Refreshed",
      description: "Your wallet balance has been updated",
    })
  }

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            Wallet
          </h1>
          <Card className="bg-black/50 border border-yellow-500/30 text-white">
            <CardContent className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            Wallet
          </h1>
          <NetworkSelector />
        </div>

        {!connected ? (
          <Card className="bg-black/50 border border-yellow-500/30 text-white">
            <CardHeader>
              <CardTitle className="text-center text-yellow-500">Connect Your Wallet</CardTitle>
              <CardDescription className="text-center text-gray-300">
                Connect your Solana wallet to view your balances and interact with the Goldium.io platform
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <WalletConnectButton />
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-black/50 border border-yellow-500/30">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger value="send" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
                  Send
                </TabsTrigger>
                <TabsTrigger
                  value="transactions"
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
                >
                  Transactions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-black/50 border border-yellow-500/30 text-white">
                    <CardHeader>
                      <CardTitle className="text-yellow-500">Wallet Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-400">Connected Wallet</p>
                        <div className="flex items-center mt-1">
                          <img
                            src={walletType === "phantom" ? "/phantom-icon.png" : "/solflare-icon.png"}
                            alt="Wallet"
                            className="h-5 w-5 mr-2"
                          />
                          <span className="font-medium">{walletType === "phantom" ? "Phantom" : "Solflare"}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-400">Wallet Address</p>
                        <div className="flex items-center justify-between mt-1 bg-black/30 rounded-md p-2 border border-yellow-500/20">
                          <span className="font-mono text-sm truncate">{address}</span>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-400 hover:text-yellow-500"
                              onClick={handleCopyAddress}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-gray-400 hover:text-yellow-500"
                              onClick={handleViewOnExplorer}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 border border-yellow-500/30 text-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-yellow-500">Balances</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-yellow-500"
                        onClick={handleRefreshBalance}
                        disabled={isBalanceLoading}
                      >
                        <RefreshCw className={`h-4 w-4 ${isBalanceLoading ? "animate-spin" : ""}`} />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-black/30 rounded-md p-4 border border-yellow-500/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img src="/images/solana-logo.png" alt="SOL" className="h-6 w-6 mr-2" />
                            <span>SOL</span>
                          </div>
                          {isBalanceLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span className="font-medium">{solBalance?.toFixed(6) || "0"}</span>
                          )}
                        </div>
                      </div>

                      <div className="bg-black/30 rounded-md p-4 border border-yellow-500/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <img src="/gold_icon-removebg-preview.png" alt="GOLD" className="h-6 w-6 mr-2" />
                            <span>GOLD</span>
                          </div>
                          {isBalanceLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span className="font-medium">{goldBalance?.toFixed(2) || "0"}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-center gap-4">
                      <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                        <Link href="/send">Send GOLD</Link>
                      </Button>
                      <Button asChild variant="outline" className="border-yellow-500/50 text-yellow-500">
                        <Link href="/faucet">Get GOLD</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <Card className="bg-black/50 border border-yellow-500/30 text-white">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <img src="/gold_icon-removebg-preview.png" alt="Staking" className="h-12 w-12 mb-4" />
                        <h3 className="text-lg font-semibold text-yellow-500 mb-2">Stake GOLD</h3>
                        <p className="text-gray-400 text-sm mb-4">Earn rewards by staking your GOLD tokens</p>
                        <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                          <Link href="/staking">Stake Now</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 border border-yellow-500/30 text-white">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <img src="/nft-images/crown-of-wisdom.png" alt="NFTs" className="h-12 w-12 mb-4" />
                        <h3 className="text-lg font-semibold text-yellow-500 mb-2">View NFTs</h3>
                        <p className="text-gray-400 text-sm mb-4">Browse your NFT collection</p>
                        <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                          <Link href="/gallery">NFT Gallery</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 border border-yellow-500/30 text-white">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <img src="/dragon-breath-blade.png" alt="Game" className="h-12 w-12 mb-4" />
                        <h3 className="text-lg font-semibold text-yellow-500 mb-2">Play & Earn</h3>
                        <p className="text-gray-400 text-sm mb-4">Play games and earn GOLD tokens</p>
                        <Button asChild className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                          <Link href="/game">Play Game</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="send" className="mt-4">
                <Card className="bg-black/50 border border-yellow-500/30 text-white">
                  <CardHeader>
                    <CardTitle className="text-yellow-500">Send GOLD Tokens</CardTitle>
                    <CardDescription className="text-gray-300">
                      Transfer GOLD tokens to another wallet address
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center py-4">
                      <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                        <Link href="/send">Go to Send Page</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transactions" className="mt-4">
                <Card className="bg-black/50 border border-yellow-500/30 text-white">
                  <CardHeader>
                    <CardTitle className="text-yellow-500">Transaction History</CardTitle>
                    <CardDescription className="text-gray-300">View your recent transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center py-4">
                      <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                        <Link href="/transactions">View Transactions</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card className="bg-black/50 border border-yellow-500/30 text-white">
                <CardHeader>
                  <CardTitle className="text-yellow-500">GOLD Token</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Token Address</p>
                    <div className="flex items-center justify-between mt-1 bg-black/30 rounded-md p-2 border border-yellow-500/20">
                      <span className="font-mono text-sm truncate">APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump</span>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-yellow-500"
                          onClick={() => {
                            navigator.clipboard.writeText("APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump")
                            toast({
                              title: "Address Copied",
                              description: "GOLD token address copied to clipboard",
                            })
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-400 hover:text-yellow-500"
                          onClick={() => {
                            window.open(`${explorerUrl}/address/APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump`, "_blank")
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Token Details</p>
                    <div className="space-y-2 mt-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span>Goldium Token</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Symbol:</span>
                        <span>GOLD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Decimals:</span>
                        <span>9</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Network:</span>
                        <span>Solana</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/50 border border-yellow-500/30 text-white">
                <CardHeader>
                  <CardTitle className="text-yellow-500">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                      <Link href="/send">Send GOLD</Link>
                    </Button>
                    <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                      <Link href="/staking">Stake GOLD</Link>
                    </Button>
                    <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                      <Link href="/gallery">View NFTs</Link>
                    </Button>
                    <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                      <Link href="/game">Play Game</Link>
                    </Button>
                    <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                      <Link href="/faucet">Faucet</Link>
                    </Button>
                    <GiftGoldModal
                      trigger={
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black flex items-center gap-2">
                          <Gift className="h-4 w-4" />
                          <span>Gift GOLD</span>
                        </Button>
                      }
                      onSuccess={refreshBalance}
                    />
                    <Button asChild className="bg-yellow-500 hover:bg-yellow-600 text-black">
                      <Link href="/transactions">Transactions</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
