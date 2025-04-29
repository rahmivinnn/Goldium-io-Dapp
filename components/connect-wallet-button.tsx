"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader2, Wallet, LogOut, Copy, ExternalLink } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/hooks/use-toast"

interface ConnectWalletButtonProps {
  className?: string
}

export function ConnectWalletButton({ className }: ConnectWalletButtonProps) {
  const { connected, connecting, address, balance, connect, disconnect } = useWallet()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (connecting) {
    return (
      <Button disabled className={`bg-dark-300 border border-gold-500/30 text-gold-400 ${className}`}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    )
  }

  if (connected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`border-gold-500/30 bg-dark-300/50 backdrop-blur-sm text-gold-400
            className={\`border-gold-500/30 bg-dark-300/50 backdrop-blur-sm text-gold-400 hover:bg-dark-200 hover:border-gold-500 ${className}`}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "Connected"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-dark-300/95 backdrop-blur-lg border-gold-500/20">
          <DropdownMenuLabel className="text-gold-400">Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gold-500/20" />
          <DropdownMenuItem className="flex justify-between">
            <span className="text-gray-400">Balance:</span>
            <span className="font-bold text-gold-500">{balance} GOLD</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gold-500/20" />
          <DropdownMenuItem onClick={handleCopyAddress} className="cursor-pointer hover:bg-dark-200">
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "Copied!" : "Copy Address"}
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer hover:bg-dark-200">
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gold-500/20" />
          <DropdownMenuItem
            onClick={disconnect}
            className="cursor-pointer text-red-500 focus:text-red-500 hover:bg-dark-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button onClick={handleConnect} className={`gold-button ${className}`}>
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    </motion.div>
  )
}
