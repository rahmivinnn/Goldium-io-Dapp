"use client"

import { Button } from "@/components/ui/button"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { Loader2, Wallet } from "lucide-react"
import { WalletIdentityCard } from "./wallet-identity-card"
import { useEffect, useState } from "react"

interface ConnectWalletButtonProps {
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
  showIdentityCard?: boolean
  className?: string
}

export function ConnectWalletButton({
  variant = "default",
  size = "default",
  showIdentityCard = true,
  className = "",
}: ConnectWalletButtonProps) {
  const { connected, connecting, openWalletModal, walletAddress, disconnect } = useSolanaWallet()
  const [isClient, setIsClient] = useState(false)

  // Pastikan rendering hanya terjadi di client-side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fungsi untuk memeriksa apakah Phantom tersedia
  const checkIfPhantomInstalled = () => {
    if (typeof window === "undefined") return false
    const isPhantomInstalled = window.phantom?.solana || window.solana?.isPhantom
    return !!isPhantomInstalled
  }

  // Fungsi untuk membuka Phantom secara langsung
  const connectToPhantom = async () => {
    try {
      if (window.phantom?.solana) {
        // Gunakan API Phantom baru
        await window.phantom.solana.connect()
        return true
      } else if (window.solana?.isPhantom) {
        // Gunakan API Phantom lama
        await window.solana.connect()
        return true
      }
      return false
    } catch (error) {
      console.error("Error connecting to Phantom:", error)
      return false
    }
  }

  // Jika belum di client-side, tampilkan placeholder
  if (!isClient) {
    return (
      <Button variant={variant} size={size} className={`${className}`} disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  // Tambahkan log untuk debugging
  console.log("ConnectWalletButton render:", { connected, connecting, walletAddress })

  if (connected && walletAddress) {
    if (showIdentityCard) {
      return <WalletIdentityCard />
    } else {
      // Tampilkan alamat wallet dalam format pendek jika showIdentityCard false
      return (
        <div className="flex space-x-2">
          <Button variant={variant} size={size} className={`${className}`} onClick={openWalletModal}>
            <Wallet className="mr-2 h-4 w-4" />
            {walletAddress ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}` : "Connected"}
          </Button>
          <Button
            variant="outline"
            size={size}
            onClick={disconnect}
            className="border-gold-500 text-gold-500 hover:bg-gold-500/10"
          >
            Disconnect
          </Button>
        </div>
      )
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={async () => {
        // Coba buka Phantom secara langsung terlebih dahulu
        if (checkIfPhantomInstalled()) {
          const connected = await connectToPhantom()
          if (!connected) {
            // Jika gagal, gunakan wallet adapter
            openWalletModal()
          }
        } else {
          // Jika Phantom tidak terinstall, buka wallet adapter
          openWalletModal()
          // Tambahkan pesan untuk menginstall Phantom
          alert("Phantom wallet tidak terdeteksi. Silakan install Phantom wallet atau pilih wallet lain.")
        }
      }}
      disabled={connecting}
      className={`${className}`}
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
