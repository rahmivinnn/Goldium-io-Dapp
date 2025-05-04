"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowDownIcon, ArrowRightIcon, AlertCircleIcon } from "lucide-react"
import NetworkSelector from "./network-selector"
import TokenSelector from "./token-selector"
import BridgeTransaction from "./bridge-transaction"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"

export default function BridgeInterface() {
  const { toast } = useToast()
  const isMobile = useMobile()

  const [sourceNetwork, setSourceNetwork] = useState("ethereum")
  const [destinationNetwork, setDestinationNetwork] = useState("solana")
  const [sourceToken, setSourceToken] = useState("ETH")
  const [destinationToken, setDestinationToken] = useState("SOL")
  const [amount, setAmount] = useState("")
  const [balance, setBalance] = useState("0.00")
  const [fee, setFee] = useState("0.00")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Simulate fetching balance
  useEffect(() => {
    // In a real app, this would fetch the actual balance from the wallet
    setBalance(Math.random() * 10).toFixed(4)
  }, [sourceNetwork, sourceToken])

  // Simulate fee calculation
  useEffect(() => {
    if (amount && Number.parseFloat(amount) > 0) {
      setFee((Number.parseFloat(amount) * 0.005).toFixed(4))
    } else {
      setFee("0.00")
    }
  }, [amount, sourceNetwork, destinationNetwork])

  const handleSwapNetworks = () => {
    setSourceNetwork(destinationNetwork)
    setDestinationNetwork(sourceNetwork)
    setSourceToken(destinationToken)
    setDestinationToken(sourceToken)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const handleMaxAmount = () => {
    setAmount(balance)
  }

  const handleContinue = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to bridge",
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(amount) > Number.parseFloat(balance)) {
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

    try {
      // Simulate bridge transaction
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast({
        title: "Bridge initiated",
        description: `Bridging ${amount} ${sourceToken} from ${sourceNetwork} to ${destinationNetwork}`,
        variant: "default",
      })

      setAmount("")
      setShowConfirmation(false)
    } catch (error) {
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
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border border-amber-500/20 bg-black/60 backdrop-blur-sm">
        <CardContent className="p-6">
          {!showConfirmation ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-amber-500">From</h3>
                  <div className="text-sm text-gray-400">
                    Balance:{" "}
                    <span className="text-white">
                      {balance} {sourceToken}
                    </span>
                  </div>
                </div>

                <NetworkSelector
                  network={sourceNetwork}
                  onNetworkChange={setSourceNetwork}
                  excludeNetwork={destinationNetwork}
                />

                <div className="flex space-x-4">
                  <div className="flex-grow">
                    <TokenSelector network={sourceNetwork} token={sourceToken} onTokenChange={setSourceToken} />
                  </div>
                  <div className="flex-grow space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="0.00"
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
                      />
                      <button
                        onClick={handleMaxAmount}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 px-2 py-1 rounded"
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleSwapNetworks}
                  className="p-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-full border border-amber-500/30"
                >
                  {isMobile ? (
                    <ArrowDownIcon className="h-5 w-5 text-amber-500" />
                  ) : (
                    <ArrowRightIcon className="h-5 w-5 text-amber-500" />
                  )}
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-amber-500">To</h3>

                <NetworkSelector
                  network={destinationNetwork}
                  onNetworkChange={setDestinationNetwork}
                  excludeNetwork={sourceNetwork}
                />

                <div className="flex space-x-4">
                  <div className="flex-grow">
                    <TokenSelector
                      network={destinationNetwork}
                      token={destinationToken}
                      onTokenChange={setDestinationToken}
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-400">
                      {amount ? Number.parseFloat(amount).toFixed(4) : "0.00"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Estimated Fee</span>
                  <span className="text-white">
                    {fee} {sourceToken}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">You will receive</span>
                  <span className="text-white">
                    {amount ? (Number.parseFloat(amount) - Number.parseFloat(fee)).toFixed(4) : "0.00"}{" "}
                    {destinationToken}
                  </span>
                </div>
                <div className="flex items-center text-xs text-amber-500 mt-2">
                  <AlertCircleIcon className="h-4 w-4 mr-1" />
                  <span>Bridge transactions typically take 10-30 minutes to complete</span>
                </div>
              </div>

              <Button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-300 hover:from-amber-600 hover:to-yellow-400 text-black font-medium py-6"
                disabled={!amount || Number.parseFloat(amount) <= 0}
              >
                Continue
              </Button>
            </div>
          ) : (
            <BridgeTransaction
              sourceNetwork={sourceNetwork}
              destinationNetwork={destinationNetwork}
              sourceToken={sourceToken}
              destinationToken={destinationToken}
              amount={amount}
              fee={fee}
              isProcessing={isProcessing}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
