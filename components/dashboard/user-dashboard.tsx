"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { WalletConnectOverlay } from "@/components/wallet-connect-overlay"
import { motion } from "framer-motion"
import {
  Wallet,
  ImageIcon,
  BarChart3,
  History,
  Settings,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react"

// Sample portfolio data
const PORTFOLIO_DATA = {
  totalValue: 12580.45,
  dailyChange: 3.2,
  tokens: [
    { name: "GOLD", symbol: "GOLD", balance: 1850, value: 1572.5, change: 2.5, icon: "/golden-g-logo.png" },
    { name: "Ethereum", symbol: "ETH", balance: 1.25, value: 4000, change: 5.2, icon: "/ethereum-crystal.png" },
    { name: "Bitcoin", symbol: "BTC", balance: 0.05, value: 3100, change: -1.8, icon: "/bitcoin-symbol-gold.png" },
    { name: "Tether", symbol: "USDT", balance: 2500, value: 2500, change: 0, icon: "/abstract-tether.png" },
    { name: "USD Coin", symbol: "USDC", balance: 1800, value: 1800, change: 0, icon: "/usdc-digital-currency.png" },
  ],
  nfts: [
    {
      id: "nft1",
      name: "Dragon's Breath Sword",
      collection: "Goldium Artifacts",
      value: 1250,
      image: "/dragon-breath-blade.png",
    },
    {
      id: "nft2",
      name: "Ethereal Shield",
      collection: "Goldium Artifacts",
      value: 850,
      image: "/shimmering-aegis.png",
    },
    { id: "nft3", name: "Arcane Fireball", collection: "Goldium Spells", value: 550, image: "/arcane-explosion.png" },
    {
      id: "nft4",
      name: "Crown of Wisdom",
      collection: "Goldium Artifacts",
      value: 1800,
      image: "/serpent-king's-regalia.png",
    },
  ],
}

// Sample transaction history
const TRANSACTION_HISTORY = [
  {
    id: "tx1",
    type: "send",
    amount: 250,
    to: "0x8765...4321",
    status: "completed",
    timestamp: "2025-04-29T10:15:00Z",
  },
  {
    id: "tx2",
    type: "receive",
    amount: 500,
    from: "0x2468...1357",
    status: "completed",
    timestamp: "2025-04-28T18:30:00Z",
  },
  {
    id: "tx3",
    type: "stake",
    amount: 1000,
    status: "completed",
    timestamp: "2025-04-27T14:45:00Z",
  },
  {
    id: "tx4",
    type: "claim",
    amount: 45,
    status: "completed",
    timestamp: "2025-04-26T09:20:00Z",
  },
  {
    id: "tx5",
    type: "send",
    amount: 150,
    to: "0x1357...2468",
    status: "pending",
    timestamp: "2025-04-29T11:05:00Z",
  },
]

export default function UserDashboard() {
  const { connected, address, balance } = useWallet()
  const [activeTab, setActiveTab] = useState("portfolio")

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-5 w-5 text-red-500" />
      case "receive":
        return <ArrowDownRight className="h-5 w-5 text-green-500" />
      case "stake":
        return <ArrowUpRight className="h-5 w-5 text-blue-500" />
      case "claim":
        return <ArrowDownRight className="h-5 w-5 text-gold" />
      default:
        return null
    }
  }

  // Get type label
  const getTypeLabel = (transaction: any) => {
    switch (transaction.type) {
      case "send":
        return `Send to ${transaction.to}`
      case "receive":
        return `Receive from ${transaction.from}`
      case "stake":
        return "Stake GOLD"
      case "claim":
        return "Claim Rewards"
      default:
        return transaction.type
    }
  }

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <WalletConnectOverlay message="Connect your wallet to view your dashboard" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">User Dashboard</h1>
          <p className="text-gray-400">Manage your assets and activities</p>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <div className="bg-gold/10 rounded-lg px-4 py-2 flex items-center">
            <Wallet className="h-5 w-5 text-gold mr-2" />
            <span className="font-mono">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="portfolio" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <BarChart3 className="mr-2 h-5 w-5" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="nfts" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <ImageIcon className="mr-2 h-5 w-5" />
            NFTs
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <History className="mr-2 h-5 w-5" />
            History
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-gold bg-black">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Total Value</h3>
                  <div
                    className={`text-sm px-2 py-1 rounded ${PORTFOLIO_DATA.dailyChange >= 0 ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
                  >
                    {PORTFOLIO_DATA.dailyChange >= 0 ? "+" : ""}
                    {PORTFOLIO_DATA.dailyChange}%
                  </div>
                </div>
                <div className="text-3xl font-bold text-gold">${PORTFOLIO_DATA.totalValue.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="border-gold bg-black">
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold mb-4">GOLD Balance</h3>
                <div className="flex items-center">
                  <img src="/golden-g-logo.png" alt="GOLD" className="w-10 h-10 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">{PORTFOLIO_DATA.tokens[0].balance} GOLD</div>
                    <div className="text-sm text-gray-400">${PORTFOLIO_DATA.tokens[0].value.toLocaleString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gold bg-black">
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold mb-4">Staking Rewards</h3>
                <div className="text-2xl font-bold text-green-500">+18.5 GOLD</div>
                <div className="text-sm text-gray-400 mb-2">Available to claim</div>
                <Button className="gold-button w-full">Claim Rewards</Button>
              </CardContent>
            </Card>
          </div>

          <Card className="border-gold bg-black mb-8">
            <CardHeader>
              <CardTitle>Token Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PORTFOLIO_DATA.tokens.map((token, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 border border-gold/20 rounded-lg hover:bg-gold/5 transition-colors"
                  >
                    <div className="flex items-center">
                      <img
                        src={token.icon || "/placeholder.svg"}
                        alt={token.name}
                        className="w-8 h-8 mr-3 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{token.name}</div>
                        <div className="text-xs text-gray-400">
                          {token.balance} {token.symbol}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${token.value.toLocaleString()}</div>
                      <div
                        className={`text-xs ${token.change > 0 ? "text-green-500" : token.change < 0 ? "text-red-500" : "text-gray-400"}`}
                      >
                        {token.change > 0 ? "+" : ""}
                        {token.change}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-gold bg-black">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="gold-button">
                    <Coins className="mr-2 h-4 w-4" />
                    Stake GOLD
                  </Button>
                  <Button variant="outline" className="border-gold text-gold hover:bg-gold/10">
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Send
                  </Button>
                  <Button variant="outline" className="border-gold text-gold hover:bg-gold/10">
                    <ArrowDownRight className="mr-2 h-4 w-4" />
                    Receive
                  </Button>
                  <Button variant="outline" className="border-gold text-gold hover:bg-gold/10">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Mint NFT
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gold bg-black">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {TRANSACTION_HISTORY.slice(0, 3).map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center p-2 border border-gold/20 rounded-lg">
                      <div className="flex items-center">
                        <div className="mr-3">{getTypeIcon(tx.type)}</div>
                        <div>
                          <div className="text-sm font-medium">{getTypeLabel(tx)}</div>
                          <div className="text-xs text-gray-400">{formatDate(tx.timestamp)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-bold ${
                            tx.type === "receive" || tx.type === "claim"
                              ? "text-green-500"
                              : tx.type === "send"
                                ? "text-red-500"
                                : "text-gold"
                          }`}
                        >
                          {tx.type === "receive" || tx.type === "claim" ? "+" : tx.type === "send" ? "-" : ""}
                          {tx.amount} GOLD
                        </div>
                        <div className="text-xs flex items-center justify-end">
                          {getStatusIcon(tx.status)}
                          <span className="ml-1 capitalize">{tx.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nfts" className="mt-0">
          <Card className="border-gold bg-black mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Your NFT Collection</CardTitle>
                <Button className="gold-button">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Mint New NFT
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {PORTFOLIO_DATA.nfts.map((nft) => (
                  <motion.div
                    key={nft.id}
                    className="border border-gold/30 rounded-lg overflow-hidden bg-black hover:border-gold transition-colors"
                    whileHover={{ scale: 1.03 }}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-bold text-gold truncate">{nft.name}</h4>
                      <div className="text-xs text-gray-400 mb-2">{nft.collection}</div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">${nft.value}</div>
                        <Button variant="ghost" size="sm" className="h-8 text-xs">
                          View
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-gold bg-black">
              <CardHeader>
                <CardTitle>NFT Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border border-gold/20 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center mr-3">
                        <ImageIcon className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <div className="font-medium">List on Marketplace</div>
                        <div className="text-xs text-gray-400">Sell your NFTs to other users</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-gold/50 text-gold hover:bg-gold/10">
                      List
                    </Button>
                  </div>

                  <div className="flex justify-between items-center p-3 border border-gold/20 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center mr-3">
                        <ArrowUpRight className="h-5 w-5 text-gold" />
                      </div>
                      <div>
                        <div className="font-medium">Transfer NFT</div>
                        <div className="text-xs text-gray-400">Send to another wallet</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-gold/50 text-gold hover:bg-gold/10">
                      Transfer
                    </Button>
                  </div>

                  <div className="flex justify-between items-center p-3 border border-gold/20 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mr-3">
                        <XCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <div className="font-medium">Burn NFT</div>
                        <div className="text-xs text-gray-400">Permanently destroy NFT</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-red-500/50 text-red-500 hover:bg-red-500/10">
                      Burn
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gold bg-black">
              <CardHeader>
                <CardTitle>NFT Marketplace Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border border-gold/20 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg overflow-hidden mr-3">
                        <img src="/dragon-breath-blade.png" alt="NFT" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium">Offer Received</div>
                        <div className="text-xs text-gray-400">Dragon's Breath Sword</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gold">1,250 GOLD</div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-1 h-7 text-xs border-green-500 text-green-500 hover:bg-green-500/10"
                      >
                        Accept
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 border border-gold/20 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg overflow-hidden mr-3">
                        <img src="/shimmering-aegis.png" alt="NFT" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium">Bid Placed</div>
                        <div className="text-xs text-gray-400">Ethereal Shield</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gold">850 GOLD</div>
                      <div className="text-xs text-gray-400">Ends in 6h 23m</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 border border-gold/20 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg overflow-hidden mr-3">
                        <img src="/arcane-explosion.png" alt="NFT" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium">Listed for Sale</div>
                        <div className="text-xs text-gray-400">Arcane Fireball</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gold">550 GOLD</div>
                      <div className="text-xs text-gray-400">Active listing</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-0">
          <Card className="border-gold bg-black">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View all your on-chain transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {TRANSACTION_HISTORY.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 border border-gold/20 rounded-lg hover:bg-gold/5 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="mr-3">{getTypeIcon(tx.type)}</div>
                      <div>
                        <div className="font-medium">{getTypeLabel(tx)}</div>
                        <div className="text-xs text-gray-400">{formatDate(tx.timestamp)}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="text-right mr-4">
                        <div
                          className={`font-bold ${
                            tx.type === "receive" || tx.type === "claim"
                              ? "text-green-500"
                              : tx.type === "send"
                                ? "text-red-500"
                                : "text-gold"
                          }`}
                        >
                          {tx.type === "receive" || tx.type === "claim" ? "+" : tx.type === "send" ? "-" : ""}
                          {tx.amount} GOLD
                        </div>
                        <div className="text-xs flex items-center justify-end">
                          {getStatusIcon(tx.status)}
                          <span className="ml-1 capitalize">{tx.status}</span>
                        </div>
                      </div>

                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gold">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4 border-gold/50 text-gold hover:bg-gold/10">
                View All Transactions
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-gold bg-black">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-gold/20 mr-4"></div>
                    <div>
                      <div className="font-medium">User Profile</div>
                      <div className="text-sm text-gray-400">Update your profile information</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Display Name</label>
                    <input
                      type="text"
                      className="w-full bg-black border border-gold/50 rounded-md px-3 py-2 focus:border-gold focus:outline-none"
                      placeholder="Enter display name"
                      defaultValue="GOLD Holder"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">ENS Name</label>
                    <div className="flex">
                      <input
                        type="text"
                        className="flex-1 bg-black border border-gold/50 rounded-l-md px-3 py-2 focus:border-gold focus:outline-none"
                        placeholder="Enter ENS name"
                        defaultValue="golduser.eth"
                      />
                      <Button className="rounded-l-none gold-button">Verify</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Avatar NFT</label>
                    <select className="w-full bg-black border border-gold/50 rounded-md px-3 py-2 focus:border-gold focus:outline-none">
                      <option>Select NFT as avatar</option>
                      <option>Dragon's Breath Sword</option>
                      <option>Ethereal Shield</option>
                      <option>Arcane Fireball</option>
                    </select>
                  </div>

                  <Button className="gold-button w-full mt-2">Save Profile</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gold bg-black">
              <CardHeader>
                <CardTitle>Wallet Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border border-gold/20 rounded-lg">
                    <div>
                      <div className="font-medium">Network</div>
                      <div className="text-sm text-gray-400">Select blockchain network</div>
                    </div>
                    <select className="bg-black border border-gold/50 rounded-md px-3 py-2 focus:border-gold focus:outline-none">
                      <option>Ethereum</option>
                      <option>Solana</option>
                      <option>BSC</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center p-3 border border-gold/20 rounded-lg">
                    <div>
                      <div className="font-medium">Gas Settings</div>
                      <div className="text-sm text-gray-400">Transaction speed preference</div>
                    </div>
                    <select className="bg-black border border-gold/50 rounded-md px-3 py-2 focus:border-gold focus:outline-none">
                      <option>Standard</option>
                      <option>Fast</option>
                      <option>Instant</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center p-3 border border-gold/20 rounded-lg">
                    <div>
                      <div className="font-medium">Hardware Wallet Support</div>
                      <div className="text-sm text-gray-400">Connect hardware wallet</div>
                    </div>
                    <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                      Connect
                    </Button>
                  </div>

                  <div className="flex justify-between items-center p-3 border border-gold/20 rounded-lg">
                    <div>
                      <div className="font-medium">Multi-Wallet Support</div>
                      <div className="text-sm text-gray-400">Add additional wallets</div>
                    </div>
                    <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                      Add Wallet
                    </Button>
                  </div>

                  <div className="flex justify-between items-center p-3 border border-gold/20 rounded-lg">
                    <div>
                      <div className="font-medium">Token Approvals</div>
                      <div className="text-sm text-gray-400">Manage contract approvals</div>
                    </div>
                    <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
