"use client"

import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useEffect, useState } from "react"
import { PhantomLogo } from "./phantom-logo"
import { Loader2, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface CompactWalletDisplayProps {
  className?: string
}

export function CompactWalletDisplay({ className }: CompactWalletDisplayProps) {
  const { connected, address, solBalance, goldBalance, refreshBalance, isBalanceLoading, lastUpdated } =
    useSolanaWallet()
  const { toast } = useToast()
  const [timeAgo, setTimeAgo] = useState<string>("")

  // Update time ago display
  useEffect(() => {
    if (!lastUpdated) return

    const updateTimeAgo = () => {
      const now = Date.now()
      const diff = now - lastUpdated

      if (diff < 60000) {
        setTimeAgo("just now")
      } else if (diff < 3600000) {
        setTimeAgo(`${Math.floor(diff / 60000)}m ago`)
      } else {
        setTimeAgo(`${Math.floor(diff / 3600000)}h ago`)
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 60000)

    return () => clearInterval(interval)
  }, [lastUpdated])

  // Handle manual refresh
  const handleRefresh = async () => {
    try {
      await refreshBalance()
      toast({
        title: "Balance Updated",
        description: "Your wallet balance has been refreshed",
      })
    } catch (error) {
      console.error("Error refreshing balance:", error)
    }
  }

  // Shorten wallet address for display
  const shortenAddress = (addr: string | null) => {
    if (!addr) return ""
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`
  }

  if (!connected) return null

  return (
    <div
      className={cn(
        "flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-lg border border-yellow-500/30 px-3 py-2",
        className,
      )}
    >
      <div className="flex items-center">
        <PhantomLogo size={16} className="mr-1" />
        <span className="text-xs text-yellow-500 font-medium">{shortenAddress(address)}</span>
      </div>

      <div className="h-4 w-px bg-gray-700" />

      <div className="flex items-center gap-3">
        {isBalanceLoading ? (
          <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
        ) : (
          <>
            <div className="flex items-center">
              <span className="text-xs font-medium">{solBalance !== null ? solBalance.toFixed(4) : "..."}</span>
              <span className="text-xs text-gray-400 ml-1">SOL</span>
            </div>

            <div className="flex items-center">
              <span className="text-xs font-medium text-yellow-500">
                {goldBalance !== null ? goldBalance.toFixed(4) : "..."}
              </span>
              <span className="text-xs text-gray-400 ml-1">GOLD</span>
            </div>
          </>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 p-1 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10"
        onClick={handleRefresh}
        disabled={isBalanceLoading}
      >
        <RefreshCw className={cn("h-3 w-3", isBalanceLoading && "animate-spin")} />
        <span className="sr-only">Refresh balance</span>
      </Button>

      {lastUpdated && <span className="text-[10px] text-gray-500 hidden sm:inline-block">{timeAgo}</span>}
    </div>
  )
}
