"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { PhantomLogo } from "./phantom-logo"
import { useNetwork } from "@/contexts/network-context"
import { Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export function WalletConnectPopup({ onClose }: { onClose?: () => void }) {
  const [isOpen, setIsOpen] = useState(true) // Always start as open
  const { connected, connecting, connect, isPhantomInstalled } = useSolanaWallet()
  const { goldTokenAddress } = useNetwork()
  const { toast } = useToast()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Force the popup to appear if not connected
  useEffect(() => {
    if (connected) {
      setIsOpen(false)
      if (onClose) onClose()
    } else {
      setIsOpen(true)
    }
  }, [connected, onClose])

  const handleConnect = async () => {
    try {
      console.log("Connecting from popup...")
      const result = await connect()

      // Handle user rejection without showing an error
      if (!result?.success && result?.rejected) {
        console.log("User rejected the connection request from popup")
        // No need to show any toast or error message
      }

      // Success is handled by the context's event listener
    } catch (error) {
      // This should not happen as errors are handled in the context
      console.log("Unexpected error in connect popup:", error)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    if (onClose) onClose()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Token address copied to clipboard",
    })
  }

  const openPhantomWebsite = () => {
    window.open("https://phantom.app/", "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md border-yellow-500/30 bg-black text-white">
        <DialogHeader>
          <DialogTitle className="text-yellow-500 text-center text-2xl font-bold">Connect to Goldium.io</DialogTitle>
          <DialogDescription className="text-center">
            Connect your Phantom wallet to access all features of Goldium.io and interact with the GOLD token
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          {/* Phantom Logo - Large Ghost Icon */}
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-800 to-purple-900 p-2">
            {!imageError ? (
              <Image
                src="/phantom-logo.png"
                alt="Phantom Wallet"
                width={80}
                height={80}
                className="rounded-full"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  console.log("Phantom logo failed to load in popup")
                  setImageError(true)
                }}
                priority
              />
            ) : (
              <svg viewBox="0 0 24 24" width="60" height="60" className="text-white">
                {/* Ghost icon SVG path */}
                <path
                  fill="currentColor"
                  d="M12 2C7.03 2 3 6.03 3 11V22L6 19L9 22L12 19L15 22L18 19L21 22V11C21 6.03 16.97 2 12 2M12 4C15.86 4 19 7.14 19 11V17.17L18 16.17L15 19.17L12 16.17L9 19.17L6 16.17L5 17.17V11C5 7.14 8.14 4 12 4M8 10C7.45 10 7 9.55 7 9S7.45 8 8 8 9 8.45 9 9 8.55 10 8 10M16 10C15.45 10 15 9.55 15 9S15.45 8 16 8 17 8.45 17 9 16.55 10 16 10Z"
                />
              </svg>
            )}
          </div>

          <div className="text-center space-y-2">
            <h3 className="font-medium">Phantom Wallet</h3>
            <p className="text-sm text-gray-400">The most popular Solana wallet</p>
          </div>

          <div className="bg-gray-800/50 p-3 rounded-md w-full">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm">Token Contract Address:</p>
              <button
                onClick={() => copyToClipboard(goldTokenAddress || "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump")}
                className="text-yellow-500 hover:text-yellow-400"
              >
                <Copy size={14} />
              </button>
            </div>
            <p className="text-yellow-500 font-mono text-xs break-all">
              {goldTokenAddress || "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump"}
            </p>
          </div>

          {isPhantomInstalled ? (
            <Button
              onClick={handleConnect}
              disabled={connecting}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium"
            >
              {connecting ? (
                <>
                  <span className="mr-2">Connecting...</span>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                </>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <PhantomLogo size={20} />
                  <span>Connect Phantom Wallet</span>
                </div>
              )}
            </Button>
          ) : (
            <div className="space-y-4 w-full">
              <Button
                onClick={openPhantomWebsite}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
              >
                <div className="flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" width="20" height="20" className="text-white">
                    <path
                      fill="currentColor"
                      d="M12 2C7.03 2 3 6.03 3 11V22L6 19L9 22L12 19L15 22L18 19L21 22V11C21 6.03 16.97 2 12 2M12 4C15.86 4 19 7.14 19 11V17.17L18 16.17L15 19.17L12 16.17L9 19.17L6 16.17L5 17.17V11C5 7.14 8.14 4 12 4M8 10C7.45 10 7 9.55 7 9S7.45 8 8 8 9 8.45 9 9 8.55 10 8 10M16 10C15.45 10 15 9.55 15 9S15.45 8 16 8 17 8.45 17 9 16.55 10 16 10Z"
                    />
                  </svg>
                  <span>Install Phantom Wallet</span>
                </div>
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-xs text-center text-gray-400">
                Phantom Wallet is not installed. Click above to install it first.
              </p>
            </div>
          )}

          <Button variant="ghost" onClick={handleClose} className="text-gray-400">
            I'll do this later
          </Button>
        </div>

        <div className="text-xs text-center text-gray-500 mt-2">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  )
}
