"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Wallet } from "lucide-react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"

interface ConnectWalletButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ConnectWalletButton({
  variant = "outline",
  size = "default",
  className = "",
}: ConnectWalletButtonProps) {
  const { connected, connecting, walletAddress, connect, disconnect, openWalletModal } = useSolanaWallet()
  const [isHovering, setIsHovering] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Prevent hydration errors by only rendering client-side
  useEffect(() => {
    setIsClient(true)

    // Log to console for debugging
    console.log("ConnectWalletButton mounted, wallet state:", { connected, connecting, walletAddress })
  }, [connected, connecting, walletAddress])

  // If not client-side yet, show loading
  if (!isClient) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  // If connected, show wallet address or disconnect button
  if (connected && walletAddress) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`border-gold-500/50 text-gold-500 hover:bg-gold-500/10 ${className}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={disconnect}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isHovering ? "Disconnect" : `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
      </Button>
    )
  }

  // If not connected, show connect button
  return (
    <Button
      variant={variant}
      size={size}
      className={`border-gold-500/50 text-gold-500 hover:bg-gold-500/10 ${className}`}
      onClick={openWalletModal} // Use openWalletModal instead of connect
      disabled={connecting}
    >
      {connecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </>
      )}
    </Button>
  )
}
