"use client"

import { useState, useEffect } from "react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { Button } from "@/components/ui/button"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Copy, ExternalLink, LogOut, RefreshCw, Wallet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatNumber } from "@/lib/utils"
import Link from "next/link"

export function WalletStatus() {
  const { connected, address, solBalance, goldBalance, isBalanceLoading, disconnect, refreshBalance, walletType } = useSolanaWallet()
  const { network, networkConfig } = useNetwork()
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showCopied, setShowCopied] = useState(false)

  // Format the wallet address for display
  const shortenedAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : ""

  // Handle refresh balance
  const handleRefreshBalance = async () => {
    if (isRefreshing) return

    setIsRefreshing(true)
    await refreshBalance()
    setIsRefreshing(false)
  }

  // Handle copy address
  const handleCopyAddress = () => {
    if (!address) return

    navigator.clipboard.writeText(address)
    setShowCopied(true)

    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    })

    setTimeout(() => setShowCopied(false), 2000)
  }

  // Handle disconnect
  const handleDisconnect = async () => {
    await disconnect()
  }

  // Get wallet icon based on type
  const getWalletIcon = () => {
    if (!walletType) return null

    return (
      <div className="w-4 h-4 mr-1">
        <img
          src={`/images/${walletType}-icon.png`}
          alt={walletType}
          className="w-full h-full rounded-full"
        />
      </div>
    )
  }

  if (!connected) {
    return <WalletConnectModal />
  }

  return (
    <div className="flex items-center space-x-2">
      <Badge variant="outline" className="px-2 py-1 bg-background/50 backdrop-blur-sm">
        {network === "mainnet" ? (
          <span className="flex items-center text-green-500">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
            Mainnet
          </span>
        ) : (
          <span className="flex items-center text-amber-500">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5"></span>
            Testnet
          </span>
        )}
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <div className="flex items-center">
              {getWalletIcon()}
              <span>{shortenedAddress}</span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div className="px-2 py-1.5">
            <div className="text-xs text-muted-foreground mb-1">SOL Balance</div>
            {isBalanceLoading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <div className="font-medium">{formatNumber(solBalance || 0)} SOL</div>
            )}
          </div>

          <div className="px-2 py-1.5">
            <div className="text-xs text-muted-foreground mb-1">GOLD Balance</div>
            {isBalanceLoading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <div className="font-medium">{formatNumber(goldBalance || 0)} GOLD</div>
            )}
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleCopyAddress}>
            <Copy className="mr-2 h-4 w-4" />
            <span>{showCopied ? "Copied!" : "Copy Address"}</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleRefreshBalance} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh Balance</span>
          </DropdownMenuItem>

          {networkConfig && address && (
            <DropdownMenuItem asChild>
              <Link
                href={`${networkConfig.explorerUrl}/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>View on Explorer</span>
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleDisconnect} className="text-red-500 focus:text-red-500">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
