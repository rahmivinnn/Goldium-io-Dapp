"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { WalletIdentityCard } from "./wallet-identity-card"
import { PhantomLogo } from "./phantom-logo"
import { Loader2 } from "lucide-react"

interface WalletConnectPopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WalletConnectPopup({ open, onOpenChange }: WalletConnectPopupProps) {
  const { connected, connecting, connect, disconnect, isPhantomInstalled, solBalance } = useSolanaWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [showBalance, setShowBalance] = useState(false)

  // Handle connect button click
  const handleConnect = async () => {
    setIsLoading(true)
    try {
      const result = await connect()
      if (result.success) {
        // Connection successful, balance will be fetched automatically
        console.log("Connection successful")
        setShowBalance(true)
      } else if (result.rejected) {
        console.log("Connection rejected by user")
      } else {
        console.log("Connection failed")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle disconnect button click
  const handleDisconnect = async () => {
    try {
      await disconnect()
      setShowBalance(false)
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  // Reset loading state when popup closes
  useEffect(() => {
    if (!open) {
      setIsLoading(false)
    }
  }, [open])

  // Show balance after a successful connection
  useEffect(() => {
    if (connected && solBalance > 0) {
      setShowBalance(true)
    }
  }, [connected, solBalance])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-black/90 border border-yellow-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
            Connect to Goldium.io
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center p-4 space-y-6">
          {connected ? (
            <WalletIdentityCard onDisconnect={handleDisconnect} />
          ) : (
            <>
              <div className="text-center mb-4">
                <p className="text-gray-300">Connect your wallet to access Goldium.io features</p>
              </div>

              <Button
                onClick={handleConnect}
                disabled={connecting || isLoading || !isPhantomInstalled}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-black font-bold py-2 px-4 rounded flex items-center justify-center space-x-2"
              >
                {connecting || isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <PhantomLogo size={20} />
                    <span>Connect Phantom Wallet</span>
                  </>
                )}
              </Button>

              {!isPhantomInstalled && (
                <div className="text-center mt-2">
                  <p className="text-red-400 text-sm">Phantom wallet not detected</p>
                  <a
                    href="https://phantom.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-500 hover:text-yellow-400 text-sm underline mt-1 inline-block"
                  >
                    Install Phantom
                  </a>
                </div>
              )}
            </>
          )}

          <div className="w-full border-t border-gray-800 pt-4 text-center">
            <p className="text-xs text-gray-400">
              By connecting your wallet, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
