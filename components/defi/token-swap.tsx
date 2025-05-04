"use client"

import { useState, useEffect, useCallback } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowDown, AlertCircle, Info } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { useNetwork } from "@/contexts/network-context"
import { getSOLBalance, getGOLDBalance, estimateSwap } from "@/services/token-service"
import { useToast } from "@/hooks/use-toast"
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createTransferInstruction,
} from "@solana/spl-token"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TransactionConfirmation, type TransactionDetails } from "@/components/defi/transaction-confirmation"

export default function TokenSwap() {
  const { connected, publicKey, signTransaction, sendTransaction } = useWallet()
  const { connection, network, goldTokenAddress } = useNetwork()
  const { toast } = useToast()

  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [fromToken, setFromToken] = useState("SOL")
  const [toToken, setToToken] = useState("GOLD")
  const [solBalance, setSolBalance] = useState(0)
  const [goldBalance, setGoldBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [slippage, setSlippage] = useState(0.5) // Default 0.5%
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null)
  const [priceImpact, setPriceImpact] = useState(0)
  const [swapRate, setSwapRate] = useState(0)

  // Fetch balances
  const fetchBalances = useCallback(async () => {
    if (!connected || !publicKey) return

    try {
      const solBal = await getSOLBalance(connection, publicKey.toString())
      setSolBalance(solBal)

      const goldBal = await getGOLDBalance(connection, publicKey.toString(), network)
      setGoldBalance(goldBal)
    } catch (error) {
      console.error("Error fetching balances:", error)
    }
  }, [connection, connected, publicKey, network])

  useEffect(() => {
    fetchBalances()

    // Set up interval to refresh balances
    const intervalId = setInterval(fetchBalances, 30000) // every 30 seconds

    return () => clearInterval(intervalId)
  }, [fetchBalances])

  // Calculate swap rate
  useEffect(() => {
    if (fromToken === "SOL" && toToken === "GOLD") {
      setSwapRate(100) // 1 SOL = 100 GOLD
    } else {
      setSwapRate(0.01) // 1 GOLD = 0.01 SOL
    }
  }, [fromToken, toToken])

  // Calculate to amount based on from amount
  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value === "" || isNaN(Number(value))) {
      setFromAmount("")
      setToAmount("")
      setPriceImpact(0)
      return
    }

    setFromAmount(value)

    try {
      const numAmount = Number.parseFloat(value)
      const { estimatedAmount, priceImpact: impact } = estimateSwap(fromToken, toToken, numAmount)
      setToAmount(estimatedAmount.toFixed(6))
      setPriceImpact(impact)
    } catch (error) {
      console.error("Error calculating amount:", error)
      setToAmount("")
    }
  }

  // Handle max button click
  const handleMaxClick = () => {
    if (!connected) return

    const maxBalance =
      fromToken === "SOL"
        ? Math.max(0, solBalance - 0.01) // Leave some SOL for fees
        : goldBalance

    setFromAmount(maxBalance.toString())

    try {
      const { estimatedAmount, priceImpact: impact } = estimateSwap(fromToken, toToken, maxBalance)
      setToAmount(estimatedAmount.toFixed(6))
      setPriceImpact(impact)
    } catch (error) {
      console.error("Error calculating max amount:", error)
    }
  }

  // Swap tokens
  const handleSwapTokens = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)

    // Reset amounts
    setFromAmount("")
    setToAmount("")
    setPriceImpact(0)
  }

  // Prepare transaction details for confirmation
  const prepareSwap = () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to swap tokens",
        variant: "destructive",
      })
      return
    }

    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to swap",
        variant: "destructive",
      })
      return
    }

    // Check if user has enough balance
    const numFromAmount = Number.parseFloat(fromAmount)
    const availableBalance = fromToken === "SOL" ? solBalance : goldBalance

    if (numFromAmount > availableBalance) {
      toast({
        title: "Insufficient balance",
        description: `You don't have enough ${fromToken} to complete this swap`,
        variant: "destructive",
      })
      return
    }

    // Prepare transaction details
    setTransactionDetails({
      type: "swap",
      fromToken: {
        symbol: fromToken,
        logo: fromToken === "SOL" ? "/images/solana-logo.png" : "/gold_icon-removebg-preview.png",
        amount: fromAmount,
      },
      toToken: {
        symbol: toToken,
        logo: toToken === "SOL" ? "/images/solana-logo.png" : "/gold_icon-removebg-preview.png",
        amount: toAmount,
      },
      estimatedGas: "0.000005 SOL",
      slippage: slippage.toString(),
    })

    setShowConfirmation(true)
  }

  // Execute the swap
  const executeSwap = async (): Promise<boolean> => {
    if (!connected || !publicKey || !signTransaction) return false

    try {
      setIsLoading(true)

      const fromAmountValue = Number.parseFloat(fromAmount)

      // Create a new transaction
      const transaction = new Transaction()

      if (fromToken === "SOL" && toToken === "GOLD") {
        // SOL to GOLD swap
        // 1. Get the associated token account for GOLD
        const goldTokenMint = new PublicKey(goldTokenAddress)
        const userGoldTokenAccount = await getAssociatedTokenAddress(goldTokenMint, publicKey)

        // Check if the token account exists, if not create it
        try {
          await connection.getAccountInfo(userGoldTokenAccount)
        } catch (error) {
          // Token account doesn't exist, create it
          const createAccountInstruction = createAssociatedTokenAccountInstruction(
            publicKey,
            userGoldTokenAccount,
            publicKey,
            goldTokenMint,
          )
          transaction.add(createAccountInstruction)
        }

        // 2. Add SOL transfer instruction (simulating swap)
        // In a real DEX, this would be a swap instruction to the DEX program
        const solAmount = fromAmountValue * LAMPORTS_PER_SOL

        // For demo, we'll transfer SOL to a "pool" address (just using a placeholder)
        const poolAddress = new PublicKey("11111111111111111111111111111111")

        const transferSolInstruction = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: poolAddress,
          lamports: solAmount,
        })

        transaction.add(transferSolInstruction)

        // 3. In a real implementation, the DEX would transfer GOLD tokens to the user
        // For demo purposes, we'll simulate this with a mock success
      } else {
        // GOLD to SOL swap
        // 1. Get the associated token account for GOLD
        const goldTokenMint = new PublicKey(goldTokenAddress)
        const userGoldTokenAccount = await getAssociatedTokenAddress(goldTokenMint, publicKey)

        // 2. Add GOLD transfer instruction (simulating swap)
        // In a real DEX, this would be a swap instruction to the DEX program
        const goldAmount = Math.floor(fromAmountValue * Math.pow(10, 9)) // assuming 9 decimals

        // For demo, we'll transfer GOLD to a "pool" address (just using a placeholder)
        const poolAddress = new PublicKey("11111111111111111111111111111111")
        const poolGoldTokenAccount = await getAssociatedTokenAddress(goldTokenMint, poolAddress)

        // Check if the pool token account exists
        try {
          await connection.getAccountInfo(poolGoldTokenAccount)
        } catch (error) {
          // For demo purposes, we'll just simulate success
          // In a real implementation, the pool account would already exist
        }

        const transferGoldInstruction = createTransferInstruction(
          userGoldTokenAccount,
          poolGoldTokenAccount,
          publicKey,
          goldAmount,
        )

        transaction.add(transferGoldInstruction)

        // 3. In a real implementation, the DEX would transfer SOL to the user
        // For demo purposes, we'll simulate this with a mock success
      }

      // Add a recent blockhash
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      transaction.feePayer = publicKey

      // Sign and send the transaction
      const signedTransaction = await signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTransaction.serialize())

      // Wait for confirmation
      await connection.confirmTransaction(signature)

      // Refresh balances
      await fetchBalances()

      toast({
        title: "Swap successful",
        description: `Successfully swapped ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`,
      })

      return true
    } catch (error) {
      console.error("Error executing swap:", error)
      toast({
        title: "Swap failed",
        description: error instanceof Error ? error.message : "An error occurred during the swap",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">From</p>
        <Card className="p-4 bg-black/40">
          <div className="flex justify-between items-center">
            <input
              type="text"
              value={fromAmount}
              onChange={handleFromAmountChange}
              placeholder="0.0"
              className="bg-transparent outline-none w-2/3 text-xl"
              disabled={!connected || isLoading}
            />
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMaxClick}
                  disabled={!connected || isLoading}
                  className="text-xs h-6 px-2 py-0 mr-1"
                >
                  MAX
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-amber-500/20 text-amber-500 border-none"
                  disabled={isLoading}
                >
                  {fromToken}
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Balance: {fromToken === "SOL" ? solBalance.toFixed(4) : goldBalance.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-center my-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/40"
          onClick={handleSwapTokens}
          disabled={isLoading}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">To</p>
        <Card className="p-4 bg-black/40">
          <div className="flex justify-between items-center">
            <input
              type="text"
              value={toAmount}
              readOnly
              placeholder="0.0"
              className="bg-transparent outline-none w-2/3 text-xl"
            />
            <div className="flex flex-col items-end">
              <Button
                variant="outline"
                size="sm"
                className="bg-amber-500/20 text-amber-500 border-none"
                disabled={isLoading}
              >
                {toToken}
              </Button>
              <p className="text-xs text-gray-400 mt-1">
                Balance: {toToken === "SOL" ? solBalance.toFixed(4) : goldBalance.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-6">
        <Card className="p-3 bg-black/40">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">Exchange Rate</p>
            <p className="text-sm">
              1 {fromToken} = {swapRate} {toToken}
            </p>
          </div>
        </Card>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-400 flex items-center">
            Slippage Tolerance
            <span className="ml-1 cursor-help" title="Maximum price change you're willing to accept">
              <Info size={14} />
            </span>
          </p>
          <p className="text-sm">{slippage}%</p>
        </div>
        <Slider
          value={[slippage]}
          min={0.1}
          max={5}
          step={0.1}
          onValueChange={(values) => setSlippage(values[0])}
          disabled={isLoading}
          className="mb-4"
        />
        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSlippage(0.1)}
            className="text-xs h-6 px-2"
            disabled={isLoading}
          >
            0.1%
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSlippage(0.5)}
            className="text-xs h-6 px-2"
            disabled={isLoading}
          >
            0.5%
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSlippage(1)}
            className="text-xs h-6 px-2"
            disabled={isLoading}
          >
            1%
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSlippage(3)}
            className="text-xs h-6 px-2"
            disabled={isLoading}
          >
            3%
          </Button>
        </div>
      </div>

      {priceImpact > 1 && (
        <Alert variant="warning" className="mb-4 bg-amber-500/10 border-amber-500/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>High Price Impact</AlertTitle>
          <AlertDescription>
            Your swap has a price impact of {priceImpact.toFixed(2)}%. Consider reducing your swap amount.
          </AlertDescription>
        </Alert>
      )}

      <Button
        className="w-full bg-amber-500 hover:bg-amber-600 text-black"
        onClick={prepareSwap}
        disabled={!connected || isLoading || !fromAmount || Number.parseFloat(fromAmount) <= 0}
      >
        {!connected ? "Connect Wallet" : isLoading ? "Processing..." : `Swap ${fromToken} to ${toToken}`}
      </Button>

      {transactionDetails && (
        <TransactionConfirmation
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={executeSwap}
          details={transactionDetails}
        />
      )}
    </div>
  )
}
