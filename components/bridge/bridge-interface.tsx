"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowDownUp } from "lucide-react"
import { NetworkSelector } from "./network-selector"
import { TokenSelector } from "./token-selector"
import { BridgeTransaction } from "./bridge-transaction"
import { BridgeHistory } from "./bridge-history"
import { useWallet } from "@/hooks/use-wallet"
import { WalletConnectOverlay } from "@/components/wallet-connect-overlay"
import { Orbitron } from "next/font/google"

const orbitron = Orbitron({ subsets: ["latin"] })

export function BridgeInterface() {
  const { isConnected } = useWallet()
  const [amount, setAmount] = useState("")
  const [sourceNetwork, setSourceNetwork] = useState("ethereum")
  const [targetNetwork, setTargetNetwork] = useState("solana")
  const [selectedToken, setSelectedToken] = useState("GOLD")
  const [activeTab, setActiveTab] = useState("bridge")

  const handleSwapNetworks = () => {
    const temp = sourceNetwork
    setSourceNetwork(targetNetwork)
    setTargetNetwork(temp)
  }

  return (
    <div className="mt-12 pt-8">
      <h1
        className={`text-4xl font-bold mb-8 text-center ${orbitron.className} tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600`}
      >
        Cross-Chain Bridge
      </h1>

      <Card className="border-amber-200/20 bg-black/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Bridge Assets</CardTitle>
          <CardDescription>Transfer your assets between different blockchains</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bridge" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="bridge">Bridge</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="bridge" className="relative">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">From</label>
                  <NetworkSelector
                    networks={[
                      { id: "ethereum", name: "Ethereum", icon: "/ethereum-crystal.png" },
                      { id: "solana", name: "Solana", icon: "/images/solana-logo.png" },
                      { id: "binance", name: "Binance Smart Chain", icon: "/binance-logo.png" },
                      { id: "polygon", name: "Polygon", icon: "/polygon-logo.png" },
                      { id: "avalanche", name: "Avalanche", icon: "/avalanche-logo.png" },
                    ]}
                    selectedNetwork={sourceNetwork}
                    onNetworkChange={setSourceNetwork}
                    excludeNetwork={targetNetwork}
                  />
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSwapNetworks}
                    className="rounded-full bg-black/50 hover:bg-black/70 border border-amber-200/30"
                  >
                    <ArrowDownUp className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">To</label>
                  <NetworkSelector
                    networks={[
                      { id: "ethereum", name: "Ethereum", icon: "/ethereum-crystal.png" },
                      { id: "solana", name: "Solana", icon: "/images/solana-logo.png" },
                      { id: "binance", name: "Binance Smart Chain", icon: "/binance-logo.png" },
                      { id: "polygon", name: "Polygon", icon: "/polygon-logo.png" },
                      { id: "avalanche", name: "Avalanche", icon: "/avalanche-logo.png" },
                    ]}
                    selectedNetwork={targetNetwork}
                    onNetworkChange={setTargetNetwork}
                    excludeNetwork={sourceNetwork}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Token</label>
                  <TokenSelector
                    tokens={[
                      { id: "GOLD", name: "Goldium", symbol: "GOLD", icon: "/gold-logo.png" },
                      { id: "ETH", name: "Ethereum", symbol: "ETH", icon: "/ethereum-crystal.png" },
                      { id: "SOL", name: "Solana", symbol: "SOL", icon: "/images/solana-logo.png" },
                      { id: "BNB", name: "Binance Coin", symbol: "BNB", icon: "/binance-logo.png" },
                      { id: "USDT", name: "Tether", symbol: "USDT", icon: "/abstract-tether.png" },
                      { id: "USDC", name: "USD Coin", symbol: "USDC", icon: "/usdc-digital-currency.png" },
                    ]}
                    selectedToken={selectedToken}
                    onTokenChange={setSelectedToken}
                  />
                </div>

                <BridgeTransaction
                  sourceNetwork={sourceNetwork}
                  destinationNetwork={targetNetwork}
                  sourceToken={selectedToken}
                  destinationToken={selectedToken}
                  amount={amount}
                  fee={(Number.parseFloat(amount || "0") * 0.005).toFixed(4)}
                  isProcessing={false}
                  onConfirm={async () => {
                    // Simulate confirmation
                    await new Promise((resolve) => setTimeout(resolve, 2000))
                    setAmount("")
                  }}
                  onCancel={() => {
                    // Handle cancel
                  }}
                />
              </div>
              {!isConnected && <WalletConnectOverlay />}
            </TabsContent>
            <TabsContent value="history" className="relative">
              <BridgeHistory />
              {!isConnected && <WalletConnectOverlay />}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

// Add default export to fix the error
export default BridgeInterface
