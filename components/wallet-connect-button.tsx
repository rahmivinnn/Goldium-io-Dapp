"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface WalletConnectButtonProps {
  className?: string
  children?: React.ReactNode
}

export function WalletConnectButton({ className = "", children }: WalletConnectButtonProps) {
  const [mounted, setMounted] = useState(false)
  const { connected, connecting, connect, isPhantomInstalled } = useSolanaWallet()
  const { toast } = useToast()
  const [imageLoaded, setImageLoaded] = useState(false)

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
      const result = await connect()

      // Handle user rejection without showing an error
      if (!result.success && result.rejected) {
        console.log("User rejected the connection request")
        // No need to show any toast or error message
      }

      // Success is handled by the context's event listener
    } catch (error) {
      // This should not happen as errors are handled in the context
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
          <span className="mr-2">Connecting...</span>
          <div className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></div>
        </>
      ) : connected ? (
        "Connected"
      ) : (
        <>
          <span className="mr-2">Connect Wallet</span>
          {isPhantomInstalled && (
            <div className="relative w-5 h-5">
              <Image
                src="/images/phantom-logo.png"
                alt="Phantom"
                width={20}
                height={20}
                className="rounded-full"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(false)}
                style={{ display: imageLoaded ? "block" : "none" }}
              />
              {!imageLoaded && (
                <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  P
                </div>
              )}
            </div>
          )}
        </>
      )}
    </Button>
  )
}
