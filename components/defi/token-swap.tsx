"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowDown } from "lucide-react"

export default function TokenSwap() {
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [fromToken, setFromToken] = useState("SOL")
  const [toToken, setToToken] = useState("GOLD")

  // Safe calculation function
  const calculateToAmount = (amount: string) => {
    try {
      const numAmount = Number.parseFloat(amount)
      if (isNaN(numAmount)) return ""

      // Mock exchange rate: 1 SOL = 50 GOLD
      const rate = fromToken === "SOL" && toToken === "GOLD" ? 50 : fromToken === "GOLD" && toToken === "SOL" ? 0.02 : 1

      return (numAmount * rate).toFixed(4)
    } catch (error) {
      console.error("Error calculating amount:", error)
      return ""
    }
  }

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFromAmount(value)
    setToAmount(calculateToAmount(value))
  }

  const handleSwapTokens = () => {
    const tempToken = fromToken
    setFromToken(toToken)
    setToToken(tempToken)

    // Recalculate amounts
    setToAmount(calculateToAmount(fromAmount))
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
            />
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-400">Balance: 25.5</p>
              <Button variant="outline" size="sm" className="bg-amber-500/20 text-amber-500 border-none">
                {fromToken}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-center my-2">
        <Button variant="ghost" size="icon" className="rounded-full bg-black/40" onClick={handleSwapTokens}>
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
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-400">Balance: 1250</p>
              <Button variant="outline" size="sm" className="bg-amber-500/20 text-amber-500 border-none">
                {toToken}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="mb-6">
        <Card className="p-3 bg-black/40">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">Exchange Rate</p>
            <p className="text-sm">
              1 {fromToken} = {fromToken === "SOL" && toToken === "GOLD" ? "50" : "0.02"} {toToken}
            </p>
          </div>
        </Card>
      </div>

      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black">Swap</Button>
    </div>
  )
}
