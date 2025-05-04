"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowDown, ArrowRight, AlertCircle, Loader2, RefreshCw, CheckCircle } from "lucide-react"
import { NetworkSelector } from "./network-selector"
import { TokenSelector } from "./token-selector"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function BridgeInterface() {
  const { toast } = useToast()
  const isMobile = useMobile()
  const { connected, walletAddress, solBalance, goldBalance } = useSolanaWallet()

  const [sourceNetwork, setSourceNetwork] = useState("ethereum")
  const [destinationNetwork, setDestinationNetwork] = useState("solana")
  const [sourceToken, setSourceToken] = useState("ETH")
  const [destinationToken, setDestinationToken] = useState("SOL")
  const [amount, setAmount] = useState("")
  const [balance, setBalance] = useState<number>(0)
  const [fee, setFee] = useState<number>(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState<number>(0)
  const [availableNetworks, setAvailableNetworks] = useState<any[]>([])
  const [availableTokens, setAvailableTokens] = useState<any[]>([])
  const [receivedAmount, setReceivedAmount] = useState<number>(0)

  // Fetch available networks and tokens
  useEffect(() => {
    const fetchNetworksAndTokens = async () => {
      setIsLoading(true)
      try {
        // In a real app, these would be API calls
        const networks = [
          { id: "ethereum", name: "Ethereum", icon: "/ethereum-crystal.png" },
          { id: "solana", name: "Solana", icon: "/images/solana-logo.png" },
          { id: "binance", name: "Binance Smart Chain", icon: "/binance-logo.png" },
          { id: "polygon", name: "Polygon", icon: "/polygon-logo.png" },
          { id: "avalanche", name: "Avalanche", icon: "/avalanche-logo.png" },
        ]

        setAvailableNetworks(networks)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800))
      } catch (error) {
        console.error("Error fetching networks:", error)
        toast({
          title: "Network Error",
          description: "Failed to load available networks",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchNetworksAndTokens()
  }, [toast])

  // Fetch tokens based on selected network
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        // In a real app, this would be an API call
        let tokens = []

        if (sourceNetwork === "ethereum") {
          tokens = [
            { id: "ETH", name: "Ethereum", symbol: "ETH", icon: "/ethereum-crystal.png", decimals: 18 },
            { id: "USDT", name: "Tether", symbol: "USDT", icon: "/abstract-tether.png", decimals: 6 },
            { id: "GOLD", name: "Goldium", symbol: "GOLD", icon: "/gold-logo.png", decimals: 9 },
          ]
        } else if (sourceNetwork === "solana") {
          tokens = [
            { id: "SOL", name: "Solana", symbol: "SOL", icon: "/images/solana-logo.png", decimals: 9 },
            { id: "USDC", name: "USD Coin", symbol: "USDC", icon: "/usdc-digital-currency.png", decimals: 6 },
            { id: "GOLD", name: "Goldium", symbol: "GOLD", icon: "/gold-logo.png", decimals: 9 },
          ]
        } else if (sourceNetwork === "binance") {
          tokens = [
            { id: "BNB", name: "Binance Coin", symbol: "BNB", icon: "/binance-logo.png", decimals: 18 },
            { id: "BUSD", name: "Binance USD", symbol: "BUSD", icon: "/busd-logo.png", decimals: 18 },
            { id: "GOLD", name: "Goldium", symbol: "GOLD", icon: "/gold-logo.png", decimals: 9 },
          ]
        } else if (sourceNetwork === "polygon") {
          tokens = [
            { id: "MATIC", name: "Polygon", symbol: "MATIC", icon: "/polygon-logo.png", decimals: 18 },
            { id: "USDT", name: "Tether", symbol: "USDT", icon: "/abstract-tether.png", decimals: 6 },
            { id: "GOLD", name: "Goldium", symbol: "GOLD", icon: "/gold-logo.png", decimals: 9 },
          ]
        } else if (sourceNetwork === "avalanche") {
          tokens = [
            { id: "AVAX", name: "Avalanche", symbol: "AVAX", icon: "/avalanche-logo.png", decimals: 18 },
            { id: "USDC", name: "USD Coin", symbol: "USDC", icon: "/usdc-digital-currency.png", decimals: 6 },
            { id: "GOLD", name: "Goldium", symbol: "GOLD", icon: "/gold-logo.png", decimals: 9 },
          ]
        }

        setAvailableTokens(tokens)

        // Set default token for the network
        if (tokens.length > 0) {
          const defaultToken = tokens[0].id
          setSourceToken(defaultToken)
        }
      } catch (error) {
        console.error("Error fetching tokens:", error)
      }
    }

    fetchTokens()
  }, [sourceNetwork])

  // Update destination token when destination network changes
  useEffect(() => {
    const updateDestinationToken = async () => {
      try {
        // In a real app, this would be an API call
        let token = "SOL"

        if (destinationNetwork === "ethereum") {
          token = "ETH"
        } else if (destinationNetwork === "solana") {
          token = "SOL"
        } else if (destinationNetwork === "binance") {
          token = "BNB"
        } else if (destinationNetwork === "polygon") {
          token = "MATIC"
        } else if (destinationNetwork === "avalanche") {
          token = "AVAX"
        }

        setDestinationToken(token)
      } catch (error) {
        console.error("Error updating destination token:", error)
      }
    }

    updateDestinationToken()
  }, [destinationNetwork])

  // Fetch balance based on selected token and network
  useEffect(() => {
    const fetchBalance = async () => {
      if (!connected) {
        setBalance(0)
        return
      }

      try {
        // In a real app, this would fetch the actual balance from the wallet
        let balanceValue = 0

        if (sourceNetwork === "solana") {
          if (sourceToken === "SOL") {
            balanceValue = solBalance
          } else if (sourceToken === "GOLD") {
            balanceValue = goldBalance
          } else {
            // Mock balance for other tokens
            balanceValue = Math.random() * 1000
          }
        } else {
          // Mock balance for other networks
          balanceValue = Math.random() * 10
        }

        setBalance(balanceValue)
      } catch (error) {
        console.error("Error fetching balance:", error)
        setBalance(0)
      }
    }

    fetchBalance()
  }, [connected, sourceNetwork, sourceToken, solBalance, goldBalance])

  // Calculate fee and received amount
  useEffect(() => {
    if (amount && Number.parseFloat(amount) > 0) {
      const amountValue = Number.parseFloat(amount)

      // Calculate fee based on network and amount
      let feeRate = 0.005 // Default fee rate

      if (sourceNetwork === "ethereum") {
        feeRate = 0.008 // Higher fee for Ethereum
      } else if (sourceNetwork === "solana") {
        feeRate = 0.002 // Lower fee for Solana
      }

      const feeValue = amountValue * feeRate
      setFee(feeValue)

      // Calculate received amount
      setReceivedAmount(amountValue - feeValue)
    } else {
      setFee(0)
      setReceivedAmount(0)
    }
  }, [amount, sourceNetwork, destinationNetwork])

  // Calculate estimated time
  useEffect(() => {
    let time = 15 // Default 15 minutes

    if (sourceNetwork === "ethereum" && destinationNetwork === "solana") {
      time = 20
    } else if (sourceNetwork === "solana" && destinationNetwork === "ethereum") {
      time = 25
    } else if (sourceNetwork === "binance" || destinationNetwork === "binance") {
      time = 10
    }

    setEstimatedTime(time)
  }, [sourceNetwork, destinationNetwork])

  const handleSwapNetworks = () => {
    setSourceNetwork(destinationNetwork)
    setDestinationNetwork(sourceNetwork)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const handleMaxAmount = () => {
    setAmount(balance.toString())
  }

  const handleContinue = () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue",
        variant: "destructive",
      })
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to bridge",
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(amount) > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough balance for this transaction",
        variant: "destructive",
      })
      return
    }

    setShowConfirmation(true)
  }

  const handleConfirm = async () => {
    setIsProcessing(true)
    setTransactionStatus("pending")
    setProgress(0)

    try {
      // Simulate bridge transaction with progress updates
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 300))
        setProgress(i)
      }

      // Simulate transaction completion
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setTransactionStatus("success")

      toast({
        title: "Bridge initiated",
        description: `Bridging ${amount} ${sourceToken} from ${sourceNetwork} to ${destinationNetwork}`,
        variant: "default",
      })

      // Reset form after successful transaction
      setTimeout(() => {
        setAmount("")
        setShowConfirmation(false)
        setTransactionStatus("idle")
        setProgress(0)
      }, 3000)
    } catch (error) {
      setTransactionStatus("error")

      toast({
        title: "Bridge failed",
        description: "There was an error processing your bridge transaction",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    setShowConfirmation(false)
    setTransactionStatus("idle")
    setProgress(0)
  }

  // Get network display name
  const getNetworkName = (networkId: string) => {
    const network = availableNetworks.find((n) => n.id === networkId)
    return network ? network.name : networkId
  }

  // Get token display info
  const getTokenInfo = (networkId: string, tokenId: string) => {
    // This is a simplified version. In a real app, you'd have a more comprehensive token list
    if (tokenId === "ETH") return { name: "Ethereum", symbol: "ETH", icon: "/ethereum-crystal.png" }
    if (tokenId === "SOL") return { name: "Solana", symbol: "SOL", icon: "/images/solana-logo.png" }
    if (tokenId === "GOLD") return { name: "Goldium", symbol: "GOLD", icon: "/gold-logo.png" }
    if (tokenId === "BNB") return { name: "Binance Coin", symbol: "BNB", icon: "/binance-logo.png" }
    if (tokenId === "MATIC") return { name: "Polygon", symbol: "MATIC", icon: "/polygon-logo.png" }
    if (tokenId === "AVAX") return { name: "Avalanche", symbol: "AVAX", icon: "/avalanche-logo.png" }
    if (tokenId === "USDT") return { name: "Tether", symbol: "USDT", icon: "/abstract-tether.png" }
    if (tokenId === "USDC") return { name: "USD Coin", symbol: "USDC", icon: "/usdc-digital-currency.png" }

    return { name: tokenId, symbol: tokenId, icon: "/placeholder.svg" }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border border-gold bg-black/60 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-900/20 to-amber-700/20">
          <CardTitle className="text-2xl text-gold">Cross-Chain Bridge</CardTitle>
          <CardDescription>Transfer assets between different blockchain networks</CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-gold animate-spin mb-4" />
              <p className="text-gray-400">Loading bridge interface...</p>
            </div>
          ) : !connected ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-medium text-gold">Connect Your Wallet</h3>
                <p className="text-gray-400">Please connect your wallet to use the bridge</p>
              </div>
              <ConnectWalletButton
                variant="default"
                size="lg"
                showIdentityCard={false}
                className="bg-gold hover:bg-amber-600 text-black font-medium"
              />
            </div>
          ) : !showConfirmation ? (
            <AnimatePresence mode="wait">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gold">From</h3>
                    <div className="text-sm text-gray-400">
                      Balance:{" "}
                      <span className="text-white">
                        {balance.toFixed(4)} {sourceToken}
                      </span>
                    </div>
                  </div>

                  <NetworkSelector
                    networks={availableNetworks}
                    selectedNetwork={sourceNetwork}
                    onNetworkChange={setSourceNetwork}
                    excludeNetwork={destinationNetwork}
                  />

                  <div className="flex space-x-4">
                    <div className="flex-grow">
                      <TokenSelector
                        tokens={availableTokens}
                        selectedToken={sourceToken}
                        onTokenChange={setSourceToken}
                      />
                    </div>
                    <div className="flex-grow space-y-2">
                      <div className="relative">
                        <Input
                          type="text"
                          value={amount}
                          onChange={handleAmountChange}
                          placeholder="0.00"
                          className="w-full px-4 py-6 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-white"
                        />
                        <Button
                          onClick={handleMaxAmount}
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-gold/20 hover:bg-gold/30 text-gold px-2 py-1 rounded"
                        >
                          MAX
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <motion.button
                    onClick={handleSwapNetworks}
                    className="p-3 bg-gold/10 hover:bg-gold/20 rounded-full border border-gold/30"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isMobile ? (
                      <ArrowDown className="h-5 w-5 text-gold" />
                    ) : (
                      <ArrowRight className="h-5 w-5 text-gold" />
                    )}
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gold">To</h3>

                  <NetworkSelector
                    networks={availableNetworks}
                    selectedNetwork={destinationNetwork}
                    onNetworkChange={setDestinationNetwork}
                    excludeNetwork={sourceNetwork}
                  />

                  <div className="flex space-x-4">
                    <div className="flex-grow">
                      <div className="flex items-center space-x-2 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg">
                        {destinationToken && (
                          <img
                            src={getTokenInfo("", destinationToken).icon || "/placeholder.svg"}
                            alt={destinationToken}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <span className="font-medium">{destinationToken}</span>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-400">
                        {receivedAmount > 0 ? receivedAmount.toFixed(4) : "0.00"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated Fee</span>
                    <span className="text-white">
                      {fee.toFixed(4)} {sourceToken}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">You will receive</span>
                    <span className="text-white">
                      {receivedAmount > 0 ? receivedAmount.toFixed(4) : "0.00"} {destinationToken}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated Time</span>
                    <span className="text-white">{estimatedTime} minutes</span>
                  </div>
                  <div className="flex items-center text-xs text-gold mt-2">
                    <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>Bridge transactions are irreversible. Please verify all details before confirming.</span>
                  </div>
                </div>

                <Button
                  onClick={handleContinue}
                  className="w-full bg-gradient-to-r from-gold to-amber-500 hover:from-amber-600 hover:to-amber-700 text-black font-medium py-6"
                  disabled={!amount || Number.parseFloat(amount) <= 0 || Number.parseFloat(amount) > balance}
                >
                  Continue
                </Button>
              </motion.div>
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-medium text-gold mb-2">Confirm Bridge Transaction</h3>
                  <p className="text-gray-400">Please review the details of your transaction</p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">From Network</span>
                    <div className="flex items-center">
                      <img
                        src={availableNetworks.find((n) => n.id === sourceNetwork)?.icon || "/placeholder.svg"}
                        alt={sourceNetwork}
                        className="w-4 h-4 rounded-full mr-1"
                      />
                      <span className="text-white">{getNetworkName(sourceNetwork)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">To Network</span>
                    <div className="flex items-center">
                      <img
                        src={availableNetworks.find((n) => n.id === destinationNetwork)?.icon || "/placeholder.svg"}
                        alt={destinationNetwork}
                        className="w-4 h-4 rounded-full mr-1"
                      />
                      <span className="text-white">{getNetworkName(destinationNetwork)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Amount</span>
                    <div className="flex items-center">
                      <img
                        src={getTokenInfo("", sourceToken).icon || "/placeholder.svg"}
                        alt={sourceToken}
                        className="w-4 h-4 rounded-full mr-1"
                      />
                      <span className="text-white">
                        {amount} {sourceToken}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Fee</span>
                    <span className="text-white">
                      {fee.toFixed(4)} {sourceToken}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">You will receive</span>
                    <div className="flex items-center">
                      <img
                        src={getTokenInfo("", destinationToken).icon || "/placeholder.svg"}
                        alt={destinationToken}
                        className="w-4 h-4 rounded-full mr-1"
                      />
                      <span className="text-white">
                        {receivedAmount.toFixed(4)} {destinationToken}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated Time</span>
                    <span className="text-white">{estimatedTime} minutes</span>
                  </div>
                </div>

                {transactionStatus === "pending" && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Processing Transaction</span>
                      <span className="text-white">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-center justify-center text-sm text-gray-400">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processing your bridge transaction...
                    </div>
                  </div>
                )}

                {transactionStatus === "success" && (
                  <Alert className="bg-green-900/20 border-green-500/30">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <AlertDescription className="text-green-500">
                      Bridge transaction initiated successfully! Your funds will arrive in approximately {estimatedTime}{" "}
                      minutes.
                    </AlertDescription>
                  </Alert>
                )}

                {transactionStatus === "error" && (
                  <Alert className="bg-red-900/20 border-red-500/30">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <AlertDescription className="text-red-500">
                      There was an error processing your bridge transaction. Please try again.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex space-x-4">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                    disabled={isProcessing || transactionStatus === "success"}
                  >
                    {transactionStatus === "success" ? "Close" : "Cancel"}
                  </Button>

                  {transactionStatus === "idle" && (
                    <Button
                      onClick={handleConfirm}
                      className="flex-1 bg-gradient-to-r from-gold to-amber-500 hover:from-amber-600 hover:to-amber-700 text-black font-medium"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Confirm Bridge"
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
