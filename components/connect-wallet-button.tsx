"use client"

import { Button } from "@/components/ui/button"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useState } from "react"
import { WalletConnectPopup } from "./wallet-connect-popup"

interface ConnectWalletButtonProps {
  className?: string
}

export function ConnectWalletButton({ className = "" }: ConnectWalletButtonProps) {
  const { connected, publicKey, disconnect } = useSolanaWallet()
  const [showConnectPopup, setShowConnectPopup] = useState(false)

  const handleConnectClick = () => {
    setShowConnectPopup(true)
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <>
      {connected && publicKey ? (
        <Button
          onClick={handleDisconnect}
          className={`bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-full ${className}`}
        >
          {shortenAddress(publicKey)}
        </Button>
      ) : (
        <Button
          onClick={handleConnectClick}
          className={`bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded-full ${className}`}
        >
          Connect Wallet
        </Button>
      )}

      {showConnectPopup && <WalletConnectPopup onClose={() => setShowConnectPopup(false)} />}
    </>
  )
}
