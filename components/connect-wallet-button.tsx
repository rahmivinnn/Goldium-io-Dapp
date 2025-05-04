"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { WalletIdentityCard } from "@/components/wallet-identity-card"

interface ConnectWalletButtonProps {
  showIdentityCard?: boolean
}

export function ConnectWalletButton({ showIdentityCard = true }: ConnectWalletButtonProps) {
  const [mounted, setMounted] = useState(false)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [showIdentity, setShowIdentity] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if wallet is connected
    if (typeof window !== "undefined" && window.solana && window.solana.isConnected) {
      setConnected(true)
    }

    // Listen for wallet connection changes
    if (typeof window !== "undefined" && window.solana) {
      window.solana.on("connect", () => setConnected(true))
      window.solana.on("disconnect", () => setConnected(false))
    }

    return () => {
      // Cleanup listeners
      if (typeof window !== "undefined" && window.solana) {
        window.solana.removeAllListeners?.("connect")
        window.solana.removeAllListeners?.("disconnect")
      }
    }
  }, [])

  const handleConnect = async () => {
    if (!mounted || connecting) return

    setConnecting(true)
    try {
      if (typeof window !== "undefined" && window.solana) {
        if (!window.solana.isConnected) {
          await window.solana.connect()
        }
        setConnected(true)
      } else {
        console.error("Phantom wallet not found")
        // Show a message to install Phantom wallet
        alert("Please install Phantom wallet to connect")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!mounted) return

    try {
      if (typeof window !== "undefined" && window.solana) {
        await window.solana.disconnect()
        setConnected(false)
        setShowIdentity(false)
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  const toggleIdentityCard = () => {
    if (showIdentityCard) {
      setShowIdentity(!showIdentity)
    }
  }

  if (!mounted) {
    return (
      <Button className="bg-gold hover:bg-gold/80 text-black font-medium" disabled>
        Loading...
      </Button>
    )
  }

  if (!connected) {
    return (
      <Button className="bg-gold hover:bg-gold/80 text-black font-medium" onClick={handleConnect} disabled={connecting}>
        {connecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button variant="outline" className="border-gold text-gold hover:bg-gold/10" onClick={toggleIdentityCard}>
        {showIdentity ? "Hide Wallet" : "Connected"}
      </Button>

      {showIdentity && showIdentityCard && (
        <div className="absolute right-0 mt-2 z-50">
          <WalletIdentityCard onDisconnect={handleDisconnect} />
        </div>
      )}
    </div>
  )
}
