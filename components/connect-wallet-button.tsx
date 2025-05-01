"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Wallet } from "lucide-react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"

export function ConnectWalletButton() {
  const { connected, connecting, walletAddress, connect, disconnect } = useSolanaWallet()
  const [isHovering, setIsHovering] = useState(false)

  // Initialize walletModal outside the try-catch block
  let walletModal
  try {
    walletModal = useWalletModal()
  } catch (error) {
    console.warn("WalletModalContext not available, using direct connect method")
    walletModal = { setVisible: () => {} }
  }

  const handleConnect = () => {
    try {
      // Try to use the modal first
      walletModal.setVisible(true)
    } catch (error) {
      // Fall back to direct connect method if modal fails
      connect()
    }
  }

  if (connected && walletAddress) {
    return (
      <Button
        variant="outline"
        className="border-gold-500/50 text-gold-500 hover:bg-gold-500/10"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={disconnect}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isHovering ? "Disconnect" : `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      className="border-gold-500/50 text-gold-500 hover:bg-gold-500/10"
      onClick={handleConnect}
      disabled={connecting}
    >
      {connecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wallet className="mr-2 h-4 w-4" />}
      {connecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
