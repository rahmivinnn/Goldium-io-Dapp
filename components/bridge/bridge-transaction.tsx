"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Info } from "lucide-react"

interface BridgeTransactionProps {
  amount: string
  setAmount: (amount: string) => void
  sourceNetwork: string
  targetNetwork: string
  selectedToken: string
}

export function BridgeTransaction({
  amount,
  setAmount,
  sourceNetwork,
  targetNetwork,
  selectedToken,
}: BridgeTransactionProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Calculate estimated fee (0.5% of the amount)
  const fee = amount ? (Number.parseFloat(amount) * 0.005).toFixed(4) : "0.0000"

  // Calculate estimated time based on networks
  const getEstimatedTime = () => {
    if (sourceNetwork === "solana" || targetNetwork === "solana") {
      return "15-30 minutes"
    } else if (sourceNetwork === "ethereum" || targetNetwork === "ethereum") {
      return "30-45 minutes"
    } else {
      return "15-20 minutes"
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmation(true)
  }

  const handleConfirm = async () => {
    setIsProcessing(true)
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setShowConfirmation(false)
    setAmount("")
  }

  const handleCancel = () => {
    setShowConfirmation(false)
  }

  return (
    <div>
      {!showConfirmation ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount
              </label>
              <span className="text-xs text-gray-400">
                Fee: {fee} {selectedToken}
              </span>
            </div>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white pr-16"
                step="0.0001"
                min="0.0001"
                required
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-400">{selectedToken}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Estimated Fee</span>
              <span className="text-white">
                {fee} {selectedToken}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">You will receive</span>
              <span className="text-white">
                {amount ? (Number.parseFloat(amount) - Number.parseFloat(fee)).toFixed(4) : "0.0000"} {selectedToken}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Estimated Time</span>
              <span className="text-white">{getEstimatedTime()}</span>
            </div>
          </div>

          <div className="flex items-start space-x-2 text-xs text-amber-400/80">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              Bridge transactions are irreversible. Please ensure the destination address and network are correct before
              proceeding.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-gold to-amber-500 hover:from-amber-600 hover:to-amber-700 text-black font-medium"
            disabled={!amount || Number.parseFloat(amount) <= 0}
          >
            Bridge {selectedToken} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-medium text-gold mb-2">Confirm Bridge Transaction</h3>
            <p className="text-gray-400">Please review your transaction details</p>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">From</span>
              <span className="text-white">
                {amount} {selectedToken} on {sourceNetwork}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">To</span>
              <span className="text-white">
                {(Number.parseFloat(amount) - Number.parseFloat(fee)).toFixed(4)} {selectedToken} on {targetNetwork}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Fee</span>
              <span className="text-white">
                {fee} {selectedToken}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Estimated Time</span>
              <span className="text-white">{getEstimatedTime()}</span>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-gradient-to-r from-gold to-amber-500 hover:from-amber-600 hover:to-amber-700 text-black font-medium"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">⟳</span> Processing...
                </>
              ) : (
                "Confirm Bridge"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// Add default export to fix the error
export default BridgeTransaction
