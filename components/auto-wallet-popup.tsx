"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { X } from "lucide-react"

export function AutoWalletPopup() {
  const [mounted, setMounted] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [phantomDetected, setPhantomDetected] = useState(false)

  // Safe default for server-side rendering
  const connected = false

  // Initialize Solana wallet context
  const solanaWallet = useSolanaWallet()
  const { connected: walletConnected, connect } = solanaWallet

  const checkPhantom = useCallback(() => {
    if (typeof window !== "undefined" && window.phantomDetected) {
      setPhantomDetected(true)
    }
  }, [])

  useEffect(() => {
    setMounted(true)

    // Check if Phantom is detected

    // Check on mount
    checkPhantom()

    // Also listen for the custom event
    const handlePhantomDetected = () => {
      setPhantomDetected(true)
    }

    window.addEventListener("phantomDetected", handlePhantomDetected)

    // Show popup after a delay if Phantom is detected but not connected
    const timer = setTimeout(() => {
      if (phantomDetected && !walletConnected) {
        setShowPopup(true)
      }
    }, 3000)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("phantomDetected", handlePhantomDetected)
    }
  }, [phantomDetected, walletConnected, checkPhantom])

  if (!mounted || !showPopup || walletConnected) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 backdrop-blur-md border border-yellow-500/30 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-yellow-500 font-bold">Connect Your Wallet</h3>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400" onClick={() => setShowPopup(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-gray-300 mb-4">
        We detected that you have Phantom wallet installed. Connect now to access all features of Goldium.io!
      </p>
      <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" onClick={connect}>
        Connect Phantom
      </Button>
    </div>
  )
}
