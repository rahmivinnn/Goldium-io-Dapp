"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { NetworkSelector } from "./network-selector"
import { TokenSelector } from "./token-selector"
import { BridgeHistory } from "./bridge-history"
import { ArrowRight, AlertCircle, ArrowRightLeft, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNetwork } from "@/contexts/network-context"

// Define supported networks
const networks = [
  { id: "ethereum", name: "Ethereum", icon: "/ethereum-logo.png", chainId: "1" },
  { id: "solana", name: "Solana", icon: "/solana-logo.png", chainId: "SOL" },
  { id: "binance", name: "BNB Chain", icon: "/binance-logo.png", chainId: "56" },
  { id: "avalanche", name: "Avalanche", icon: "/avalanche-logo-abstract.png", chainId: "43114" },
]

// Define supported tokens
const tokens = [
  { id: "gold", name: "GOLD", symbol: "GOLD", icon: "/placeholder.svg?key=r5xnv", decimals: 18 },
  { id: "eth", name: "Ethereum", symbol: "ETH", icon: "/ethereum-logo.png", decimals: 18 },
  { id: "bnb", name: "BNB", symbol: "BNB", icon: "/binance-logo.png", decimals: 18 },
  { id: "avax", name: "Avalanche", symbol: "AVAX", icon: "/avalanche-logo-abstract.png", decimals: 18 },
  { id: "sol", name: "Solana", symbol: "SOL", icon: "/solana-logo.png", decimals: 9 },
  { id: "usdc", name: "USD Coin", symbol: "USDC", icon: "/placeholder.svg?key=p56i9", decimals: 6 },
]

export function CrossChainBridge() {
  const { toast } = useToast()
  const { goldTokenAddress } = useNetwork()

  // State for bridge form
  const [sourceNetwork, setSourceNetwork] = useState(networks[0])
  const [destinationNetwork, setDestinationNetwork] = useState(networks[1])
  const [selectedToken, setSelectedToken] = useState(tokens[0])
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [estimatedFee, setEstimatedFee] = useState("0.001")
  const [estimatedTime, setEstimatedTime] = useState("5-15 minutes")
  const [activeTab, setActiveTab] = useState("bridge")

  // Recent transactions (mock data)
  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: "tx1",
      sourceNetwork: networks[0],
      destinationNetwork: networks[1],
      token: tokens[0],
      amount: "100",
      status: "completed",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      txHash: "0x1234...5678",
    },
    {
      id: "tx2",
      sourceNetwork: networks[1],
      destinationNetwork: networks[0],
      token: tokens[0],
      amount: "50",
      status: "pending",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      txHash: "0xabcd...efgh",
    },
  ])

  // Update fee when networks or token changes
  useEffect(() => {
    // Mock fee calculation based on selected networks and token
    const baseFee = 0.001
    const networkMultiplier = sourceNetwork.id === "solana" || destinationNetwork.id === "solana" ? 0.5 : 1
    const tokenMultiplier = selectedToken.id === "gold" ? 0.8 : 1

    const calculatedFee = (baseFee * networkMultiplier * tokenMultiplier).toFixed(4)
    setEstimatedFee(calculatedFee)

    // Estimate time based on destination network
    if (destinationNetwork.id === "ethereum") {
      setEstimatedTime("10-20 minutes")
    } else if (destinationNetwork.id === "solana") {
      setEstimatedTime("1-2 minutes")
    } else {
      setEstimatedTime("5-15 minutes")
    }
  }, [sourceNetwork, destinationNetwork, selectedToken])

  // Handle network swap
  const handleSwapNetworks = () => {
    const temp = sourceNetwork
    setSourceNetwork(destinationNetwork)
    setDestinationNetwork(temp)
  }

  // Handle bridge transaction
  const handleBridge = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to bridge",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate processing
    setTimeout(() => {
      // Add new transaction to history
      const newTx = {
        id: `tx${Date.now()}`,
        sourceNetwork,
        destinationNetwork,
        token: selectedToken,
        amount,
        status: "pending",
        timestamp: new Date().toISOString(),
        txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 10)}`,
      }

      setRecentTransactions([newTx, ...recentTransactions])

      toast({
        title: "Bridge initiated",
        description: `Bridging ${amount} ${selectedToken.symbol} from ${sourceNetwork.name} to ${destinationNetwork.name}`,
      })

      setIsProcessing(false)
      setAmount("")
      setActiveTab("history")
    }, 2000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-2 border-yellow-500/30 bg-black/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-yellow-500 text-center">Cross-Chain Bridge</CardTitle>
          <CardDescription className="text-center text-gray-300">
            Transfer your tokens seamlessly between different blockchain networks
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="bridge" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="bridge" className="data-[state=active]:bg-yellow-500/20">
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Bridge
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-yellow-500/20">
                <Clock className="mr-2 h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bridge" className="space-y-6">
              {/* Source Network */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">From</label>
                <NetworkSelector
                  networks={networks}
                  selectedNetwork={sourceNetwork}
                  onNetworkChange={setSourceNetwork}
                  otherNetwork={destinationNetwork}
                />
              </div>

              {/* Network Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500"
                  onClick={handleSwapNetworks}
                >
                  <ArrowRight className="h-5 w-5 rotate-90" />
                </Button>
              </div>

              {/* Destination Network */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">To</label>
                <NetworkSelector
                  networks={networks}
                  selectedNetwork={destinationNetwork}
                  onNetworkChange={setDestinationNetwork}
                  otherNetwork={sourceNetwork}
                />
              </div>

              {/* Token Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Token</label>
                <TokenSelector tokens={tokens} selectedToken={selectedToken} onTokenChange={setSelectedToken} />
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-gray-300">Amount</label>
                  <span className="text-xs text-gray-400">Balance: 1,000 {selectedToken.symbol}</span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-black/30 border-yellow-500/30 focus:border-yellow-500/50 text-white pr-20"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 text-yellow-500 hover:text-yellow-400"
                    onClick={() => setAmount("1000")}
                  >
                    MAX
                  </Button>
                </div>
              </div>

              {/* Fee and Time Estimate */}
              <div className="bg-black/30 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Estimated Fee</span>
                  <span className="text-white">
                    {estimatedFee} {selectedToken.symbol}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Estimated Time</span>
                  <span className="text-white">{estimatedTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">You will receive</span>
                  <span className="text-yellow-500 font-medium">
                    {amount && Number.parseFloat(amount) > 0
                      ? (Number.parseFloat(amount) - Number.parseFloat(estimatedFee)).toFixed(4)
                      : "0"}{" "}
                    {selectedToken.symbol}
                  </span>
                </div>
              </div>

              {/* Warning */}
              <Alert className="bg-yellow-500/10 border-yellow-500/30">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-gray-300 text-sm">
                  Make sure you're sending to the correct network. Cross-chain transfers cannot be reversed.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="history">
              <BridgeHistory transactions={recentTransactions} />
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          {activeTab === "bridge" && (
            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3"
              disabled={!amount || Number.parseFloat(amount) <= 0 || isProcessing}
              onClick={handleBridge}
            >
              {isProcessing ? "Processing..." : "Bridge Tokens"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default CrossChainBridge
