"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { PhantomLogo } from "./phantom-logo"

interface WalletIdentityCardProps {
  onDisconnect: () => void
}

export function WalletIdentityCard({ onDisconnect }: WalletIdentityCardProps) {
  const [mounted, setMounted] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [solBalance, setSolBalance] = useState<number>(0)
  const [goldBalance, setGoldBalance] = useState<number>(0)
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)

    // Get wallet address if connected
    if (typeof window !== "undefined" && window.solana && window.solana.isConnected) {
      const publicKey = window.solana.publicKey?.toString()
      setAddress(publicKey || null)

      // Mock balances for demo
      setSolBalance(2.5)
      setGoldBalance(1000)
    }
  }, [])

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const openExplorer = () => {
    if (address) {
      window.open(`https://explorer.solana.com/address/${address}`, "_blank")
    }
  }

  if (!mounted || !address) {
    return null
  }

  // Format address for display
  const shortAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : ""

  return (
    <Card className="w-72 border-gold/30 bg-black/90 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PhantomLogo size={20} />
              <span className="text-sm font-medium">Phantom Wallet</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-mono">{shortAddress}</span>
              <button onClick={copyAddress} className="text-gold hover:text-gold/80">
                <Copy className="h-3.5 w-3.5" />
              </button>
              <button onClick={openExplorer} className="text-gold hover:text-gold/80">
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">SOL Balance</span>
              <span className="text-sm font-medium">{solBalance.toFixed(2)} SOL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">GOLD Balance</span>
              <span className="text-sm font-medium">{goldBalance.toFixed(2)} GOLD</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="outline"
          className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400"
          onClick={onDisconnect}
        >
          Disconnect
        </Button>
      </CardFooter>
    </Card>
  )
}
