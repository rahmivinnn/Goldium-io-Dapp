"use client"

import { useEffect, useState } from "react"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"
import { useWallet } from "@solana/wallet-adapter-react"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { PhantomLogo } from "@/components/phantom-logo"

// You can make these configurable through environment variables or props
const SOLANA_RPC = clusterApiUrl("mainnet-beta")
const GOLD_MINT = new PublicKey("APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump")
const GOLD_DECIMALS = 9 // Assuming 9 decimals for GOLD token

interface WalletBalanceDisplayProps {
  className?: string
  compact?: boolean
}

export default function WalletBalanceDisplay({ className, compact = true }: WalletBalanceDisplayProps) {
  const { publicKey, connected } = useWallet()
  const [solBalance, setSolBalance] = useState<number | null>(null)
  const [goldBalance, setGoldBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const [timeAgo, setTimeAgo] = useState<string>("")
  const { toast } = useToast()

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

  const fetchBalances = async () => {
    if (!publicKey || !connected) return

    try {
      setIsLoading(true)
      console.log(`[WalletBalanceDisplay] Fetching balances for: ${publicKey.toString()}`)

      const connection = new Connection(SOLANA_RPC, {
        commitment: "confirmed",
        confirmTransactionInitialTimeout: 60000, // 60 seconds
      })

      // Get SOL balance
      const lamports = await connection.getBalance(publicKey)
      const solBalanceValue = lamports / 1e9
      console.log(`[WalletBalanceDisplay] SOL balance: ${solBalanceValue}`)
      setSolBalance(solBalanceValue)

      // Get GOLD token balance
      try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          mint: GOLD_MINT,
        })

        if (tokenAccounts.value.length > 0) {
          const amount = tokenAccounts.value[0]?.account?.data?.parsed?.info?.tokenAmount?.uiAmount ?? 0
          console.log(`[WalletBalanceDisplay] GOLD balance: ${amount}`)
          setGoldBalance(amount)
        } else {
          console.log("[WalletBalanceDisplay] No GOLD token accounts found")
          setGoldBalance(0)
        }
      } catch (err) {
        console.error("[WalletBalanceDisplay] Error fetching GOLD balance:", err)
        // Don't reset balance to null on error
      }

      setLastUpdated(Date.now())
    } catch (err) {
      console.error("[WalletBalanceDisplay] Error fetching balances:", err)
      // Don't reset balances to null on error
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch and periodic refresh
  useEffect(() => {
    if (!connected || !publicKey) {
      setSolBalance(null)
      setGoldBalance(null)
      setLastUpdated(null)
      return
    }

    fetchBalances()
    const interval = setInterval(fetchBalances, 30000) // refresh every 30s
    return () => clearInterval(interval)
  }, [connected, publicKey])

  // Handle manual refresh
  const handleRefresh = async () => {
    try {
      await fetchBalances()
      toast({
        title: "Balance Updated",
        description: "Your wallet balance has been refreshed",
      })
    } catch (error) {
      console.error("[WalletBalanceDisplay] Error refreshing balance:", error)
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh balance. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Shorten wallet address for display
  const shortenAddress = (addr: PublicKey | null) => {
    if (!addr) return ""
    const address = addr.toString()
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  if (!connected) {
    return null
  }

  // Compact display version (similar to previous CompactWalletDisplay)
  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 bg-black/80 backdrop-blur-sm rounded-lg border border-yellow-500/30 px-3 py-2",
          className,
        )}
      >
        <div className="flex items-center">
          <PhantomLogo size={16} className="mr-1" />
          <span className="text-xs text-yellow-500 font-medium">{shortenAddress(publicKey)}</span>
        </div>

        <div className="h-4 w-px bg-gray-700" />

        <div className="flex items-center gap-3">
          {isLoading ? (
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
          disabled={isLoading}
        >
          <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
          <span className="sr-only">Refresh balance</span>
        </Button>

        {lastUpdated && <span className="text-[10px] text-gray-500 hidden sm:inline-block">{timeAgo}</span>}
      </div>
    )
  }

  // Full display version
  return (
    <div
      className={cn("bg-black/90 text-white p-4 rounded-xl border border-yellow-500/30 shadow-md space-y-3", className)}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-yellow-500">Wallet Balance</h2>
        <Button
          variant="outline"
          size="sm"
          className="border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          {isLoading ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
          Refresh
        </Button>
      </div>

      <div className="flex items-center space-x-2 bg-gray-900/60 rounded-md p-2">
        <PhantomLogo size={16} />
        <span className="text-sm text-gray-300 break-all">{publicKey?.toString()}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900/60 rounded-md p-3 text-center">
          <div className="text-sm text-gray-400 mb-1">SOL</div>
          <div className="font-medium text-lg">
            {isLoading ? (
              <div className="flex justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : solBalance !== null ? (
              solBalance.toFixed(6)
            ) : (
              "Loading..."
            )}
          </div>
        </div>

        <div className="bg-gray-900/60 rounded-md p-3 text-center">
          <div className="text-sm text-gray-400 mb-1">GOLD</div>
          <div className={cn("font-medium text-lg", goldBalance !== null && goldBalance > 0 ? "text-yellow-500" : "")}>
            {isLoading ? (
              <div className="flex justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : goldBalance !== null ? (
              goldBalance.toFixed(6)
            ) : (
              "Loading..."
            )}
          </div>
        </div>
      </div>

      {lastUpdated && (
        <div className="text-xs text-center text-gray-500">
          Last updated: {new Date(lastUpdated).toLocaleTimeString()} ({timeAgo})
        </div>
      )}
    </div>
  )
}
