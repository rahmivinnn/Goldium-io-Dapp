"use client"

import { useState } from "react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface WalletConnectButtonProps {
  className?: string
}

export function WalletConnectButton({ className = "" }: WalletConnectButtonProps) {
  const { connect, connecting, isPhantomInstalled, isSolflareInstalled } = useSolanaWallet()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleConnect = async (walletType: "phantom" | "solflare") => {
    setIsDropdownOpen(false)
    await connect(walletType)
  }

  if (connecting) {
    return (
      <Button disabled className={`bg-yellow-500 hover:bg-yellow-600 text-black ${className}`}>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    )
  }

  // If only one wallet is installed, show a direct connect button
  if (isPhantomInstalled && !isSolflareInstalled) {
    return (
      <Button
        onClick={() => handleConnect("phantom")}
        className={`bg-yellow-500 hover:bg-yellow-600 text-black ${className}`}
      >
        Connect Phantom
      </Button>
    )
  }

  if (!isPhantomInstalled && isSolflareInstalled) {
    return (
      <Button
        onClick={() => handleConnect("solflare")}
        className={`bg-yellow-500 hover:bg-yellow-600 text-black ${className}`}
      >
        Connect Solflare
      </Button>
    )
  }

  // If multiple wallets are installed, show a dropdown
  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button className={`bg-yellow-500 hover:bg-yellow-600 text-black ${className}`}>Connect Wallet</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black/90 border border-yellow-500/30 text-white">
        {isPhantomInstalled && (
          <DropdownMenuItem
            className="flex items-center cursor-pointer hover:bg-yellow-500/10"
            onClick={() => handleConnect("phantom")}
          >
            <img src="/phantom-icon.png" alt="Phantom" className="h-5 w-5 mr-2" />
            Phantom
          </DropdownMenuItem>
        )}
        {isSolflareInstalled && (
          <DropdownMenuItem
            className="flex items-center cursor-pointer hover:bg-yellow-500/10"
            onClick={() => handleConnect("solflare")}
          >
            <img src="/solflare-icon.png" alt="Solflare" className="h-5 w-5 mr-2" />
            Solflare
          </DropdownMenuItem>
        )}
        {!isPhantomInstalled && !isSolflareInstalled && (
          <DropdownMenuItem className="text-gray-400">No wallets installed</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
