"use client"

import { useState } from "react"
import { AlertCircle, ArrowRight, Check, Loader2 } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export interface TransactionDetails {
  type: "swap" | "addLiquidity" | "removeLiquidity" | "stake" | "unstake" | "claim"
  fromToken?: {
    symbol: string
    logo: string
    amount: string
  }
  toToken?: {
    symbol: string
    logo: string
    amount: string
  }
  lpTokens?: {
    symbol: string
    logo: string
    amount: string
  }
  stakingToken?: {
    symbol: string
    logo: string
    amount: string
  }
  rewardToken?: {
    symbol: string
    logo: string
    amount: string
  }
  estimatedGas: string
  slippage?: string
}

interface TransactionConfirmationProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<boolean>
  details: TransactionDetails
}

type TransactionStatus = "initial" | "pending" | "success" | "error"

export function TransactionConfirmation({ isOpen, onClose, onConfirm, details }: TransactionConfirmationProps) {
  const [status, setStatus] = useState<TransactionStatus>("initial")
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setStatus("pending")
    setProgress(0)

    // Simulate transaction progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          return prev
        }
        return prev + 10
      })
    }, 500)

    try {
      const success = await onConfirm()
      clearInterval(interval)

      if (success) {
        setProgress(100)
        setStatus("success")
      } else {
        setProgress(0)
        setStatus("error")
        setError("Transaction failed. Please try again.")
      }
    } catch (err) {
      clearInterval(interval)
      setProgress(0)
      setStatus("error")
      setError(err instanceof Error ? err.message : "Transaction failed. Please try again.")
    }
  }

  const handleClose = () => {
    if (status !== "pending") {
      setStatus("initial")
      setProgress(0)
      setError(null)
      onClose()
    }
  }

  const renderTransactionDetails = () => {
    switch (details.type) {
      case "swap":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={details.fromToken!.logo || "/placeholder.svg"}
                    alt={details.fromToken!.symbol}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">
                  {details.fromToken!.amount} {details.fromToken!.symbol}
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-500" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={details.toToken!.logo || "/placeholder.svg"}
                    alt={details.toToken!.symbol}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">
                  {details.toToken!.amount} {details.toToken!.symbol}
                </span>
              </div>
            </div>
            {details.slippage && (
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Max slippage:</span>
                <span>{details.slippage}%</span>
              </div>
            )}
          </div>
        )

      case "addLiquidity":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={details.fromToken!.logo || "/placeholder.svg"}
                    alt={details.fromToken!.symbol}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">
                  {details.fromToken!.amount} {details.fromToken!.symbol}
                </span>
              </div>
              <span className="text-gray-500">+</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={details.toToken!.logo || "/placeholder.svg"}
                    alt={details.toToken!.symbol}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">
                  {details.toToken!.amount} {details.toToken!.symbol}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-500">You will receive:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {details.lpTokens!.amount} {details.lpTokens!.symbol}
                </span>
              </div>
            </div>
          </div>
        )

      case "removeLiquidity":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {details.lpTokens!.amount} {details.lpTokens!.symbol}
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-500" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={details.fromToken!.logo || "/placeholder.svg"}
                    alt={details.fromToken!.symbol}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">
                  {details.fromToken!.amount} {details.fromToken!.symbol}
                </span>
              </div>
              <span className="text-gray-500">+</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={details.toToken!.logo || "/placeholder.svg"}
                    alt={details.toToken!.symbol}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">
                  {details.toToken!.amount} {details.toToken!.symbol}
                </span>
              </div>
            </div>
          </div>
        )

      case "stake":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Staking:</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={details.stakingToken!.logo || "/placeholder.svg"}
                    alt={details.stakingToken!.symbol}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">
                  {details.stakingToken!.amount} {details.stakingToken!.symbol}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-gray-500">Estimated APR:</span>
              <span className="font-medium text-green-500">12.5%</span>
            </div>
          </div>
        )

      case "unstake":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Unstaking:</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={details.stakingToken!.logo || "/placeholder.svg"}
                    alt={details.stakingToken!.symbol}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">
                  {details.stakingToken!.amount} {details.stakingToken!.symbol}
                </span>
              </div>
            </div>
          </div>
        )

      case "claim":
        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Claiming rewards:</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={details.rewardToken!.logo || "/placeholder.svg"}
                    alt={details.rewardToken!.symbol}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">
                  {details.rewardToken!.amount} {details.rewardToken!.symbol}
                </span>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderTransactionStatus = () => {
    switch (status) {
      case "initial":
        return (
          <div className="flex flex-col gap-4">
            {renderTransactionDetails()}
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Estimated gas fee:</span>
              <span>{details.estimatedGas}</span>
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleConfirm}>
                Confirm
              </Button>
            </div>
          </div>
        )

      case "pending":
        return (
          <div className="flex flex-col items-center gap-4 py-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h3 className="text-lg font-medium">Transaction in progress</h3>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500">Please wait while your transaction is being processed...</p>
          </div>
        )

      case "success":
        return (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-medium">Transaction successful</h3>
            <p className="text-sm text-gray-500 text-center">Your transaction has been successfully processed.</p>
            <Button className="mt-2" onClick={handleClose}>
              Close
            </Button>
          </div>
        )

      case "error":
        return (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium">Transaction failed</h3>
            <p className="text-sm text-red-500 text-center">{error || "Something went wrong. Please try again."}</p>
            <div className="flex gap-3 mt-2">
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Close
              </Button>
              <Button className="flex-1" onClick={handleConfirm}>
                Try Again
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {status === "initial" && `Confirm ${details.type.replace(/([A-Z])/g, " $1").toLowerCase()}`}
            {status === "pending" && "Processing Transaction"}
            {status === "success" && "Transaction Successful"}
            {status === "error" && "Transaction Failed"}
          </DialogTitle>
        </DialogHeader>
        {renderTransactionStatus()}
      </DialogContent>
    </Dialog>
  )
}
