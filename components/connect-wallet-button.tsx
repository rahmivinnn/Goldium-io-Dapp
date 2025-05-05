"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { ChevronDown, LogOut, RefreshCw } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ConnectWalletButtonProps {
  showIdentityCard?: boolean
  className?: string
}

export function ConnectWalletButton({ showIdentityCard = true, className = "" }: ConnectWalletButtonProps) {
  const [mounted, setMounted] = useState(false)
  const { connected, address, disconnect, solBalance, goldBalance, refreshBalance, isBalanceLoading } =
    useSolanaWallet()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleDisconnect = async () => {
    if (!mounted) return
    try {
      await disconnect()
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  const handleRefresh = async () => {
    await refreshBalance()
  }

  // Format the wallet address for display
  const formattedAddress = address
    ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
    : "Not Connected"

  if (!mounted) {
    return (
      <Button className={`bg-yellow-500 hover:bg-yellow-600 text-black font-medium ${className}`} disabled>
        Loading...
      </Button>
    )
  }

  if (!connected) {
    return null // WalletConnectButton will be shown instead
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={`bg-yellow-500 hover:bg-yellow-600 text-black font-medium ${className}`}>
          <div className="relative w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          {formattedAddress}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-black/90 border border-yellow-500/30 text-white">
        <DropdownMenuLabel>Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-yellow-500/30" />
        <div className="px-2 py-2">
          <div className="mb-2">
            <p className="text-xs text-gray-400">Address</p>
            <p className="text-sm font-mono break-all">{address}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <p className="text-xs text-gray-400">SOL Balance</p>
              <p className="text-sm">{isBalanceLoading ? "Loading..." : solBalance?.toFixed(4) || "0.0000"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">GOLD Balance</p>
              <p className="text-sm text-yellow-500">
                {isBalanceLoading ? "Loading..." : goldBalance?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator className="bg-yellow-500/30" />
        <DropdownMenuItem
          onClick={handleRefresh}
          className="cursor-pointer hover:bg-yellow-500/20 hover:text-yellow-500"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Balance
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDisconnect} className="cursor-pointer hover:bg-red-500/20 hover:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
