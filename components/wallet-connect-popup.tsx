"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import Image from "next/image"
import { useNetwork } from "@/contexts/network-context"
import { Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function WalletConnectPopup({ onClose }: { onClose?: () => void }) {
  const [isOpen, setIsOpen] = useState(true) // Always start as open
  const { connected, connecting, connect, isPhantomInstalled } = useSolanaWallet()
  const { goldTokenAddress } = useNetwork()
  const { toast } = useToast()

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
      await connect()
      // Don't close the popup here - let the connected state change trigger it
    } catch (error) {
      console.error("Connection error:", error)
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
      <DialogContent className="sm:max-w-md border-yellow-500 bg-black text-white">
        <DialogHeader>
          <DialogTitle className="text-yellow-500 text-center text-2xl font-bold">Connect to Goldium.io</DialogTitle>
          <DialogDescription className="text-center">
            Connect your Phantom wallet to access all features of Goldium.io and interact with the GOLD token
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-900/20 p-2">
            <Image
              src="/images/phantom-logo.png"
              alt="Phantom Wallet"
              width={60}
              height={60}
              className="rounded-full"
            />
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
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-medium"
            >
              {connecting ? "Connecting..." : "Connect Phantom Wallet"}
            </Button>
          ) : (
            <div className="space-y-4 w-full">
              <Button
                onClick={openPhantomWebsite}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
              >
                Install Phantom Wallet <ExternalLink className="ml-2 h-4 w-4" />
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
