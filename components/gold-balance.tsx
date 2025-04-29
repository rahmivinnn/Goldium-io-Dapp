"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { Coins, RefreshCw, DollarSign } from "lucide-react"

interface GoldBalanceProps {
  compact?: boolean
}

export default function GoldBalance({ compact = false }: GoldBalanceProps) {
  const { balance } = useWallet()
  const [showUSD, setShowUSD] = useState(false)
  const goldToUSD = 0.85 // Mock exchange rate

  const toggleCurrency = () => {
    setShowUSD(!showUSD)
  }

  if (compact) {
    return (
      <div className="flex items-center bg-black border border-gold/50 rounded-lg px-3 py-2">
        <Coins className="h-5 w-5 text-gold mr-2" />
        <span className="font-bold">
          {showUSD ? `$${(balance * goldToUSD).toFixed(2)}` : `${balance.toLocaleString()} GOLD`}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 ml-2 text-gray-400 hover:text-gold hover:bg-transparent"
          onClick={toggleCurrency}
        >
          {showUSD ? <Coins className="h-4 w-4" /> : <DollarSign className="h-4 w-4" />}
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Coins className="h-6 w-6 text-gold mr-2" />
          <span className="text-lg font-medium">Your Balance</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-400 hover:text-gold hover:bg-transparent"
          onClick={toggleCurrency}
        >
          {showUSD ? <Coins className="h-5 w-5" /> : <DollarSign className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gold">
          {showUSD ? `$${(balance * goldToUSD).toFixed(2)}` : `${balance.toLocaleString()}`}
        </span>
        <span className="ml-2 text-gray-400">{showUSD ? "USD" : "GOLD"}</span>
      </div>

      <div className="flex items-center mt-2 text-sm text-gray-400">
        <RefreshCw className="h-3 w-3 mr-1" />
        <span>Updated just now</span>
      </div>
    </div>
  )
}
