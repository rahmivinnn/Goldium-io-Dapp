"use client"

import { useState, useEffect } from "react"
import { ArrowDownUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useWallet } from "@/components/wallet-provider"
import { useNetwork } from "@/contexts/network-context"
import { useToast } from "@/hooks/use-toast"

// Named export for compatibility with existing imports
export function TokenSwap() {
  const [fromToken, setFromToken] = useState("SOL")
  const [toToken, setToToken] = useState("GOLD")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { connected, solBalance, goldBalance } = useWallet()
  const { isTestnet } = useNetwork()
  const { toast } = useToast()

  // Exchange rates (simplified for demo)
  const exchangeRates = {
    SOL_GOLD: 50, // 1 SOL = 50 GOLD
    GOLD_SOL: 0.02, // 1 GOLD = 0.02 SOL
  }

  // Update to amount when from amount changes
  useEffect(() => {
    if (fromAmount && !isNaN(Number(fromAmount))) {
      const rate = fromToken === "SOL" && toToken === "GOLD" ? exchangeRates.SOL_GOLD : exchangeRates.GOLD_SOL

      const calculatedAmount = Number(fromAmount) * rate
      setToAmount(calculatedAmount.toFixed(6))
    } else {
      setToAmount("")
    }
  }, [fromAmount, fromToken, toToken])

  // Swap the tokens
  const handleSwapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
    setFromAmount("")
    setToAmount("")
  }

  // Execute the swap
  const handleSwap = async () => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to swap tokens.",
        variant: "destructive",
      })
      return
    }

    if (!fromAmount || isNaN(Number(fromAmount)) || Number(fromAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to swap.",
        variant: "destructive",
      })
      return
    }

    // Check if user has enough balance
    const fromTokenBalance = fromToken === "SOL" ? solBalance : goldBalance
    if (Number(fromAmount) > fromTokenBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough ${fromToken} to complete this swap.`,
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Swap Successful",
        description: `Swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`,
      })

      // Reset form
      setFromAmount("")
      setToAmount("")
    } catch (error) {
      console.error("Swap error:", error)
      toast({
        title: "Swap Failed",
        description: "There was an error processing your swap. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Swap Tokens</CardTitle>
        <CardDescription>
          Exchange SOL and GOLD tokens instantly
          {isTestnet && " (Testnet Mode)"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* From Token */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">From</label>
            <span className="text-xs text-muted-foreground">
              Balance: {fromToken === "SOL" ? solBalance : goldBalance} {fromToken}
            </span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
              />
            </div>
            <div className="w-1/3">
              <select
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="SOL">SOL</option>
                <option value="GOLD">GOLD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button variant="ghost" size="icon" onClick={handleSwapTokens} className="rounded-full h-8 w-8 bg-muted">
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">To</label>
            <span className="text-xs text-muted-foreground">
              Balance: {toToken === "SOL" ? solBalance : goldBalance} {toToken}
            </span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input type="number" placeholder="0.0" value={toAmount} readOnly />
            </div>
            <div className="w-1/3">
              <select
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="SOL">SOL</option>
                <option value="GOLD">GOLD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Exchange Rate */}
        <div className="rounded-md bg-muted p-2 text-xs">
          <div className="flex items-center gap-1">
            <span>Exchange Rate:</span>
          </div>
          <div className="mt-1">
            1 {fromToken} = {fromToken === "SOL" ? exchangeRates.SOL_GOLD : exchangeRates.GOLD_SOL} {toToken}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSwap} disabled={!connected || !fromAmount || isLoading}>
          {isLoading ? "Processing..." : connected ? "Swap" : "Connect Wallet to Swap"}
        </Button>
      </CardFooter>
    </Card>
  )
}

// Default export for modern imports
export default TokenSwap
