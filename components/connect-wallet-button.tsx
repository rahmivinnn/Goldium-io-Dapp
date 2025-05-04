"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { WalletIdentityCard } from "@/components/wallet-identity-card"
import { WalletConnectPopup } from "@/components/wallet-connect-popup"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { PhantomLogo } from "./phantom-logo"

interface ConnectWalletButtonProps {
  showIdentityCard?: boolean
  className?: string
}

export function ConnectWalletButton({ showIdentityCard = true, className = "" }: ConnectWalletButtonProps) {
  const [mounted, setMounted] = useState(false)
  const [showIdentity, setShowIdentity] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const { connected, connecting, connect, disconnect } = useSolanaWallet()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnect = async () => {
    if (!mounted || connecting) return
    setShowPopup(true)
  }

  const handleDisconnect = async () => {
    if (!mounted) return
    try {
      await disconnect()
      setShowIdentity(false)
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  const toggleIdentityCard = () => {
    if (showIdentityCard) {
      setShowIdentity(!showIdentity)
    }
  }

  const handlePopupClose = () => {
    setShowPopup(false)
  }

  if (!mounted) {
    return (
      <Button className={`bg-yellow-500 hover:bg-yellow-600 text-black font-medium ${className}`} disabled>
        Loading...
      </Button>
    )
  }

  if (!connected) {
    return (
      <>
        <Button
          className={`bg-yellow-500 hover:bg-yellow-600 text-black font-medium ${className}`}
          onClick={handleConnect}
          disabled={connecting}
        >
          <div className="flex items-center gap-2">
            <PhantomLogo size={20} className="mr-1" />
            {connecting ? "Connecting..." : "Connect Wallet"}
          </div>
        </Button>
        {showPopup && <WalletConnectPopup onClose={handlePopupClose} />}
      </>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        className={`border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 ${className}`}
        onClick={toggleIdentityCard}
      >
        <div className="flex items-center gap-2">
          <PhantomLogo size={16} className="mr-1" />
          {showIdentity ? "Hide Wallet" : "Connected"}
        </div>
      </Button>

      {showIdentity && showIdentityCard && (
        <div className="absolute right-0 mt-2 z-50">
          <WalletIdentityCard onDisconnect={handleDisconnect} />
        </div>
      )}
    </div>
  )
}
