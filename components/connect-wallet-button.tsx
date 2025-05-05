"use client"

import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { Button } from "@/components/ui/button"
import { Loader2, Copy, ExternalLink, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface ConnectWalletButtonProps {
  className?: string
}

export function ConnectWalletButton({ className = "" }: ConnectWalletButtonProps) {
  const { address, disconnect, solBalance, goldBalance, isBalanceLoading, refreshBalance, walletType } =
    useSolanaWallet()
  const { explorerUrl } = useNetwork()
  const { toast } = useToast()

  if (!address) return null

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address)
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    })
  }

  const handleViewOnExplorer = () => {
    window.open(`${explorerUrl}/address/${address}`, "_blank")
  }

  const handleDisconnect = async () => {
    await disconnect()
  }

  const handleRefreshBalance = async () => {
    await refreshBalance()
  }

  const shortenedAddress = `${address.slice(0, 4)}...${address.slice(-4)}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`border-yellow-500/30 bg-black/50 text-white ${className}`}>
          <img
            src={walletType === "phantom" ? "/phantom-icon.png" : "/solflare-icon.png"}
            alt="Wallet"
            className="h-4 w-4 mr-2"
          />
          {shortenedAddress}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black/90 border border-yellow-500/30 text-white">
        <DropdownMenuLabel>Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-yellow-500/20" />
        <DropdownMenuItem className="flex justify-between hover:bg-yellow-500/10">
          <span className="text-gray-400">SOL Balance:</span>
          {isBalanceLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span>{solBalance?.toFixed(4) || "0"}</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem className="flex justify-between hover:bg-yellow-500/10">
          <span className="text-gray-400">GOLD Balance:</span>
          {isBalanceLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span>{goldBalance?.toFixed(2) || "0"}</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-yellow-500/20" />
        <DropdownMenuItem className="cursor-pointer hover:bg-yellow-500/10" onClick={handleRefreshBalance}>
          <Loader2 className="mr-2 h-4 w-4" />
          Refresh Balance
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-yellow-500/10" onClick={handleCopyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-yellow-500/10" onClick={handleViewOnExplorer}>
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-yellow-500/20" />
        <DropdownMenuItem className="cursor-pointer hover:bg-yellow-500/10" onClick={handleDisconnect}>
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
