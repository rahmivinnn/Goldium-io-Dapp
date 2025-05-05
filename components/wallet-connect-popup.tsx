"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PhantomLogo } from "./phantom-logo"
import { useToast } from "@/hooks/use-toast"
import { Copy, Check } from "lucide-react"

interface WalletConnectPopupProps {
  onClose: () => void
}

export function WalletConnectPopup({ onClose }: WalletConnectPopupProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const contractAddress = "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Address Copied",
      description: "Token contract address copied to clipboard",
    })
  }

  const connectWallet = () => {
    // Connect wallet logic would go here
    toast({
      title: "Connecting Wallet",
      description: "Attempting to connect to Phantom wallet...",
    })

    // Simulate connection
    setTimeout(() => {
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black border-2 border-yellow-500/30">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-gray-400 hover:text-white hover:bg-transparent"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          <CardTitle className="text-2xl text-yellow-500 text-center">Connect to Goldium.io</CardTitle>
          <CardDescription className="text-center text-gray-300">
            Connect your Phantom wallet to access all features of Goldium.io and interact with the GOLD token
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-purple-700 flex items-center justify-center">
            <PhantomLogo size={48} />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold text-white">Phantom Wallet</h3>
            <p className="text-gray-400 text-sm">The most popular Solana wallet</p>
          </div>

          <div className="w-full">
            <p className="text-sm text-gray-400 mb-1">Token Contract Address:</p>
            <div className="flex items-center justify-between bg-black/70 rounded-md p-2 border border-yellow-500/20">
              <code className="text-yellow-500 font-mono text-sm overflow-x-auto scrollbar-hide">
                {contractAddress}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-yellow-500 hover:bg-yellow-500/10"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button className="w-full bg-purple-700 hover:bg-purple-800 text-white font-medium" onClick={connectWallet}>
            Connect Phantom Wallet
          </Button>
          <Button
            variant="ghost"
            className="w-full text-gray-400 hover:text-white hover:bg-transparent"
            onClick={onClose}
          >
            I'll do this later
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
