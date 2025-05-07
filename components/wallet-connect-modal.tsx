"use client"

import { useState } from "react"
import { useSolanaWallet, type WalletType } from "@/contexts/solana-wallet-context"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface WalletConnectModalProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function WalletConnectModal({ trigger, onSuccess }: WalletConnectModalProps) {
  const { connect, isPhantomInstalled, isSolflareInstalled, isMetaMaskInstalled } = useSolanaWallet()
  const [isOpen, setIsOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState<WalletType | null>(null)
  const { toast } = useToast()

  const handleConnect = async (walletType: WalletType) => {
    setIsConnecting(walletType)
    
    try {
      const result = await connect(walletType)
      
      if (result.success) {
        setIsOpen(false)
        if (onSuccess) onSuccess()
      } else if (result.rejected) {
        toast({
          title: "Connection Cancelled",
          description: "You cancelled the connection request",
        })
      }
    } catch (error) {
      console.error(`Error connecting to ${walletType}:`, error)
      toast({
        title: "Connection Error",
        description: `Failed to connect to ${walletType}`,
        variant: "destructive",
      })
    } finally {
      setIsConnecting(null)
    }
  }

  const openWalletWebsite = (walletType: WalletType) => {
    let url = ""
    
    switch (walletType) {
      case "phantom":
        url = "https://phantom.app/"
        break
      case "solflare":
        url = "https://solflare.com/"
        break
      case "metamask":
        url = "https://metamask.io/"
        break
    }
    
    window.open(url, "_blank")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" className="bg-gradient-to-r from-amber-500 to-yellow-300 text-black hover:from-amber-600 hover:to-yellow-400">
            Connect Wallet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to the Goldium.io dApp
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            className="flex justify-between items-center h-16 px-4 py-2"
            onClick={() => handleConnect("phantom")}
            disabled={!isPhantomInstalled || isConnecting !== null}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 mr-4 relative">
                <Image
                  src="/images/phantom-icon.png"
                  alt="Phantom"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <span className="font-medium">Phantom</span>
            </div>
            {isConnecting === "phantom" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : !isPhantomInstalled ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  openWalletWebsite("phantom")
                }}
              >
                Install
              </Button>
            ) : null}
          </Button>

          <Button
            variant="outline"
            className="flex justify-between items-center h-16 px-4 py-2"
            onClick={() => handleConnect("solflare")}
            disabled={!isSolflareInstalled || isConnecting !== null}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 mr-4 relative">
                <Image
                  src="/images/solflare-icon.png"
                  alt="Solflare"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <span className="font-medium">Solflare</span>
            </div>
            {isConnecting === "solflare" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : !isSolflareInstalled ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  openWalletWebsite("solflare")
                }}
              >
                Install
              </Button>
            ) : null}
          </Button>

          <Button
            variant="outline"
            className="flex justify-between items-center h-16 px-4 py-2"
            onClick={() => handleConnect("metamask")}
            disabled={!isMetaMaskInstalled || isConnecting !== null}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 mr-4 relative">
                <Image
                  src="/images/metamask-icon.png"
                  alt="MetaMask"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <span className="font-medium">MetaMask (Solana Snap)</span>
            </div>
            {isConnecting === "metamask" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : !isMetaMaskInstalled ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  openWalletWebsite("metamask")
                }}
              >
                Install
              </Button>
            ) : null}
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogDescription className="text-xs text-muted-foreground">
            By connecting your wallet, you agree to the Goldium.io Terms of Service and Privacy Policy.
          </DialogDescription>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
