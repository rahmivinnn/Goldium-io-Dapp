"use client"

import { useState, useEffect } from "react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { WalletConnectPopup } from "./wallet-connect-popup"

interface AutoWalletPopupProps {
  autoShow?: boolean
  delay?: number
}

export function AutoWalletPopup({ autoShow = true, delay = 1000 }: AutoWalletPopupProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [showPopup, setShowPopup] = useState(false)
  const { connected } = useSolanaWallet()

  useEffect(() => {
    if (autoShow && !connected) {
      const timer = setTimeout(() => {
        setShowPopup(true)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [autoShow, connected, delay])

  const handleClose = () => {
    setShowPopup(false)
  }

  if (!showPopup || connected) return null

  return <WalletConnectPopup onClose={handleClose} />
}
