"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface WalletConnectButtonProps {
  className?: string
  children?: React.ReactNode
}

export function WalletConnectButton({ className = "", children }: WalletConnectButtonProps) {
  const [mounted, setMounted] = useState(false)
  const { connected, connecting, connect, isPhantomInstalled } = useSolanaWallet()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleConnect = async () => {
    if (!mounted || connecting) return

    try {
      if (!isPhantomInstalled) {
        toast({
          title: "Wallet Not Found",
          description: "Please install Phantom wallet to connect",
          variant: "destructive",
        })
        window.open("https://phantom.app/", "_blank")
        return
      }

      // This will directly trigger the Phantom wallet popup
      await connect()
    } catch (error) {
      console.log("Unexpected error in connect button:", error)
    }
  }

  if (!mounted) {
    return (
      <Button className={`bg-yellow-500 hover:bg-yellow-600 text-black font-medium ${className}`} disabled>
        Loading...
      </Button>
    )
  }

  return (
    <Button
      className={`bg-yellow-500 hover:bg-yellow-600 text-black font-medium ${className}`}
      onClick={handleConnect}
      disabled={connecting || connected}
    >
      {connecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Connecting...</span>
        </>
      ) : connected ? (
        "Connected"
      ) : (
        <>
          <span className="mr-2">Connect Wallet</span>
          {isPhantomInstalled && (
            <div className="relative w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
          )}
        </>
      )}
    </Button>
  )
}
