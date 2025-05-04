"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

interface BridgeTransactionProps {
  sourceNetwork: string
  destinationNetwork: string
  sourceToken: string
  destinationToken: string
  amount: string
  fee: string
  isProcessing: boolean
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export function BridgeTransaction({
  sourceNetwork,
  destinationNetwork,
  sourceToken,
  destinationToken,
  amount,
  fee,
  isProcessing,
  onConfirm,
  onCancel,
}: BridgeTransactionProps) {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const [txHash, setTxHash] = useState<string | null>(null)

  useEffect(() => {
    if (isProcessing && status === "idle") {
      setStatus("pending")

      // Simulate progress updates
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 500)

      return () => clearInterval(interval)
    }
  }, [isProcessing, status])

  useEffect(() => {
    if (progress === 100 && status === "pending") {
      // Simulate transaction hash
      setTxHash("0x" + Math.random().toString(16).substring(2, 42))
      setStatus("success")
    }
  }, [progress, status])

  const getExplorerLink = () => {
    if (!txHash) return "#"

    if (sourceNetwork === "ethereum") {
      return `https://etherscan.io/tx/${txHash}`
    } else if (sourceNetwork === "solana") {
      return `https://explorer.solana.com/tx/${txHash}`
    } else if (sourceNetwork === "binance") {
      return `https://bscscan.com/tx/${txHash}`
    } else if (sourceNetwork === "polygon") {
      return `https://polygonscan.com/tx/${txHash}`
    } else if (sourceNetwork === "avalanche") {
      return `https://snowtrace.io/tx/${txHash}`
    }

    return "#"
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-medium text-gold mb-2">Bridge Transaction</h3>
        <p className="text-gray-400">
          {status === "idle" && "Please confirm your transaction details"}
          {status === "pending" && "Processing your transaction..."}
          {status === "success" && "Transaction initiated successfully!"}
          {status === "error" && "Transaction failed. Please try again."}
        </p>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">From</span>
          <span className="text-white">
            {amount} {sourceToken} on {sourceNetwork}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">To</span>
          <span className="text-white">
            {(Number.parseFloat(amount) - Number.parseFloat(fee)).toFixed(4)} {destinationToken} on {destinationNetwork}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Fee</span>
          <span className="text-white">
            {fee} {sourceToken}
          </span>
        </div>
      </div>

      {status === "pending" && (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Processing Transaction</span>
            <span className="text-white">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-center text-sm text-gray-400">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing your bridge transaction...
          </div>
        </div>
      )}

      {status === "success" && (
        <motion.div
          className="bg-green-900/20 border border-green-500/30 rounded-lg p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-green-500">
                Bridge transaction initiated successfully! Your funds will arrive in approximately 15-30 minutes.
              </p>
              {txHash && (
                <a
                  href={getExplorerLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-green-400 hover:text-green-300"
                >
                  View on explorer <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          className="bg-red-900/20 border border-red-500/30 rounded-lg p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-500">There was an error processing your bridge transaction. Please try again.</p>
          </div>
        </motion.div>
      )}

      <div className="flex space-x-4">
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
          disabled={isProcessing}
        >
          {status === "success" ? "Close" : "Cancel"}
        </Button>

        {status === "idle" && (
          <Button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-gold to-amber-500 hover:from-amber-600 hover:to-amber-700 text-black font-medium"
            disabled={isProcessing}
          >
            Confirm Bridge
          </Button>
        )}
      </div>
    </div>
  )
}
