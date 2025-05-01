"use client"

import { useState, useEffect } from "react"
import { ArrowDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import TokenSelector from "./token-selector"
import { useWallet } from "@/hooks/use-wallet"

interface Token {
  id: string
  symbol: string
  name: string
  logo: string
  balance: string
  price: number
}

// Change from default export to named export to match the import in defi/page.tsx
export function AddLiquidity() {
  const { isConnected } = useWallet()
  const [tokenA, setTokenA] = useState<Token | undefined>()
  const [tokenB, setTokenB] = useState<Token | undefined>()
  const [amountA, setAmountA] = useState("")
  const [amountB, setAmountB] = useState("")
  const [slippage, setSlippage] = useState(0.5)
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [txHash, setTxHash] = useState("")

  // Calculate the exchange rate when tokens change
  useEffect(() => {
    if (tokenA && tokenB && amountA) {
      const rate = tokenA.price / tokenB.price
      setAmountB((Number.parseFloat(amountA) * rate).toFixed(6))
    }
  }, [tokenA, tokenB, amountA])

  // Handle amount A input change
  const handleAmountAChange = (value: string) => {
    setAmountA(value)
    if (tokenA && tokenB && value) {
      const rate = tokenA.price / tokenB.price
      setAmountB((Number.parseFloat(value) * rate).toFixed(6))
    } else {
      setAmountB("")
    }
  }

  // Handle amount B input change
  const handleAmountBChange = (value: string) => {
    setAmountB(value)
    if (tokenA && tokenB && value) {
      const rate = tokenB.price / tokenA.price
      setAmountA((Number.parseFloat(value) * rate).toFixed(6))
    } else {
      setAmountA("")
    }
  }

  // Handle add liquidity
  const handleAddLiquidity = async () => {
    if (!tokenA || !tokenB || !amountA || !amountB) return

    setIsLoading(true)

    try {
      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate transaction hash
      setTxHash("0x" + Math.random().toString(16).substring(2, 16) + Math.random().toString(16).substring(2, 16))
      setShowConfirmation(true)
    } catch (error) {
      console.error("Error adding liquidity:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate pool share
  const poolShare = tokenA && tokenB && amountA && amountB ? "0.0042%" : "0.00%"

  // Check if form is valid
  const isValid =
    tokenA && tokenB && amountA && amountB && Number.parseFloat(amountA) > 0 && Number.parseFloat(amountB) > 0

  return (
    <div className="space-y-6">
      {/* First token input */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-400">You provide:</label>
          {tokenA && (
            <span className="text-sm text-gray-400">
              Balance: {tokenA.balance} {tokenA.symbol}
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              type="number"
              placeholder="0.0"
              value={amountA}
              onChange={(e) => handleAmountAChange(e.target.value)}
              className="bg-black/40 border-amber-500/20 focus:border-amber-500/40 text-lg"
            />
          </div>
          <TokenSelector selectedToken={tokenA} onSelect={setTokenA} excludeToken={tokenB?.id} />
        </div>

        {tokenA && (
          <div className="flex justify-end">
            <div className="space-x-2 text-xs">
              <button
                className="text-amber-500 hover:text-amber-400"
                onClick={() =>
                  handleAmountAChange((Number.parseFloat(tokenA.balance.replace(/,/g, "")) * 0.25).toString())
                }
              >
                25%
              </button>
              <button
                className="text-amber-500 hover:text-amber-400"
                onClick={() =>
                  handleAmountAChange((Number.parseFloat(tokenA.balance.replace(/,/g, "")) * 0.5).toString())
                }
              >
                50%
              </button>
              <button
                className="text-amber-500 hover:text-amber-400"
                onClick={() =>
                  handleAmountAChange((Number.parseFloat(tokenA.balance.replace(/,/g, "")) * 0.75).toString())
                }
              >
                75%
              </button>
              <button
                className="text-amber-500 hover:text-amber-400"
                onClick={() => handleAmountAChange(tokenA.balance.replace(/,/g, ""))}
              >
                MAX
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Plus icon */}
      <div className="flex justify-center">
        <div className="bg-amber-500/20 p-2 rounded-full">
          <ArrowDown className="h-4 w-4 text-amber-500" />
        </div>
      </div>

      {/* Second token input */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-400">You provide:</label>
          {tokenB && (
            <span className="text-sm text-gray-400">
              Balance: {tokenB.balance} {tokenB.symbol}
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              type="number"
              placeholder="0.0"
              value={amountB}
              onChange={(e) => handleAmountBChange(e.target.value)}
              className="bg-black/40 border-amber-500/20 focus:border-amber-500/40 text-lg"
            />
          </div>
          <TokenSelector selectedToken={tokenB} onSelect={setTokenB} excludeToken={tokenA?.id} />
        </div>

        {tokenB && (
          <div className="flex justify-end">
            <div className="space-x-2 text-xs">
              <button
                className="text-amber-500 hover:text-amber-400"
                onClick={() =>
                  handleAmountBChange((Number.parseFloat(tokenB.balance.replace(/,/g, "")) * 0.25).toString())
                }
              >
                25%
              </button>
              <button
                className="text-amber-500 hover:text-amber-400"
                onClick={() =>
                  handleAmountBChange((Number.parseFloat(tokenB.balance.replace(/,/g, "")) * 0.5).toString())
                }
              >
                50%
              </button>
              <button
                className="text-amber-500 hover:text-amber-400"
                onClick={() =>
                  handleAmountBChange((Number.parseFloat(tokenB.balance.replace(/,/g, "")) * 0.75).toString())
                }
              >
                75%
              </button>
              <button
                className="text-amber-500 hover:text-amber-400"
                onClick={() => handleAmountBChange(tokenB.balance.replace(/,/g, ""))}
              >
                MAX
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      {tokenA && tokenB && amountA && amountB && (
        <div className="mt-6 p-4 bg-amber-500/10 rounded-lg">
          <h3 className="font-medium mb-2">Transaction Summary</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Pool share:</span>
              <span>{poolShare}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Rate:</span>
              <span>
                1 {tokenA.symbol} = {(Number.parseFloat(amountB) / Number.parseFloat(amountA)).toFixed(6)}{" "}
                {tokenB.symbol}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Slippage tolerance:</span>
              <span>0.5%</span>
            </div>
          </div>
        </div>
      )}

      {/* Action button */}
      <button
        className={`w-full mt-6 py-3 rounded-lg font-medium ${
          isValid ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!isValid || isLoading}
        onClick={handleAddLiquidity}
      >
        {isLoading
          ? "Processing..."
          : !tokenA || !tokenB
            ? "Select tokens"
            : !amountA || !amountB
              ? "Enter amounts"
              : "Add Liquidity"}
      </button>

      {/* Confirmation dialog would go here */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Transaction Submitted</h3>
            <p className="mb-4">Your liquidity has been added successfully!</p>
            <p className="text-sm text-gray-500 mb-4">Transaction hash: {txHash}</p>
            <button
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium"
              onClick={() => setShowConfirmation(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Also add a default export that points to the same component
export default AddLiquidity
