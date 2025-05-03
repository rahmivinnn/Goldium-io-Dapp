"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { motion } from "framer-motion"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useEffect, useState } from "react"

interface WalletConnectOverlayProps {
  message?: string
  showOnlyButton?: boolean
  className?: string
}

export function WalletConnectOverlay({
  message = "Connect your wallet to interact",
  showOnlyButton = false,
  className = "",
}: WalletConnectOverlayProps) {
  const { connected } = useSolanaWallet()
  const [isClient, setIsClient] = useState(false)

  // Prevent hydration errors by only rendering client-side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // If not client-side yet, return null to prevent hydration mismatch
  if (!isClient) {
    return null
  }

  // If wallet is connected, don't show the overlay
  if (connected) {
    return null
  }

  if (showOnlyButton) {
    return <ConnectWalletButton variant="outline" size="sm" className="gold-button-sm" />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex justify-center items-center p-4 ${className}`}
    >
      <Card className="border-gold bg-black/80 backdrop-blur-sm w-full max-w-md mx-auto">
        <CardContent className="pt-6 text-center">
          <p className="mb-4 text-gray-300">{message}</p>
          <ConnectWalletButton className="gold-button" />
        </CardContent>
      </Card>
    </motion.div>
  )
}
