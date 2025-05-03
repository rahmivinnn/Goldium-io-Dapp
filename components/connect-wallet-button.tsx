"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Wallet, ExternalLink, Copy, Check } from "lucide-react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"

interface ConnectWalletButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showFullDetails?: boolean
}

export function ConnectWalletButton({
  variant = "outline",
  size = "default",
  className = "",
  showFullDetails = false,
}: ConnectWalletButtonProps) {
  const {
    connected,
    connecting,
    walletAddress,
    publicKey,
    solBalance,
    goldBalance,
    network,
    disconnect,
    openWalletModal,
  } = useSolanaWallet()
  const [isHovering, setIsHovering] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [copied, setCopied] = useState(false)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  // Prevent hydration errors by only rendering client-side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
    }
  }, [])

  // Handle connect button click with debounce
  const handleConnectClick = () => {
    if (isButtonDisabled || connecting) return

    // Disable button temporarily to prevent multiple clicks
    setIsButtonDisabled(true)

    // Call the openWalletModal function
    openWalletModal()

    // Re-enable button after a delay
    clickTimeoutRef.current = setTimeout(() => {
      setIsButtonDisabled(false)
    }, 2000) // 2 second debounce
  }

  // Copy address to clipboard
  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Alamat Disalin",
        description: "Alamat wallet berhasil disalin ke clipboard",
      })
    }
  }

  // Get explorer link based on network
  const getExplorerLink = () => {
    if (!walletAddress) return "#"

    switch (network) {
      case "mainnet":
        return `https://explorer.solana.com/address/${walletAddress}`
      case "testnet":
        return `https://explorer.solana.com/address/${walletAddress}?cluster=testnet`
      case "devnet":
        return `https://explorer.solana.com/address/${walletAddress}?cluster=devnet`
      default:
        return `https://explorer.solana.com/address/${walletAddress}`
    }
  }

  // If not client-side yet, show loading
  if (!isClient) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }

  // If connected, show wallet address or disconnect button
  if (connected && walletAddress) {
    // If showFullDetails is true, show a more detailed wallet info
    if (showFullDetails) {
      return (
        <div className="bg-black/80 border border-gold/30 rounded-lg p-4 w-full max-w-xs">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-gold font-medium">Wallet Terhubung</h3>
            <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Aktif</div>
          </div>

          <div className="space-y-3">
            <div className="bg-black/50 border border-gold/20 rounded p-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Alamat</span>
                <div className="flex space-x-1">
                  <button onClick={copyAddress} className="text-gray-400 hover:text-gold">
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                  <a
                    href={getExplorerLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gold"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
              <div className="font-mono text-sm mt-1 break-all">{walletAddress}</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-black/50 border border-gold/20 rounded p-2">
                <div className="text-sm text-gray-400">SOL Balance</div>
                <div className="font-medium">{solBalance.toFixed(4)} SOL</div>
              </div>
              <div className="bg-black/50 border border-gold/20 rounded p-2">
                <div className="text-sm text-gray-400">GOLD Balance</div>
                <div className="font-medium">{goldBalance.toFixed(2)} GOLD</div>
              </div>
            </div>

            <div className="bg-black/50 border border-gold/20 rounded p-2">
              <div className="text-sm text-gray-400">Network</div>
              <div className="font-medium capitalize">{network}</div>
            </div>

            <Button
              variant="outline"
              className="w-full mt-2 border-red-500/50 text-red-500 hover:bg-red-500/10"
              onClick={disconnect}
            >
              Disconnect Wallet
            </Button>
          </div>
        </div>
      )
    }

    // Default compact view with popover for details
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={`border-gold-500/50 text-gold-500 hover:bg-gold-500/10 ${className}`}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {`${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-black/95 border border-gold/30 p-0">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-gold font-medium">Wallet Terhubung</h3>
              <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Aktif</div>
            </div>

            <div className="space-y-3">
              <div className="bg-black/50 border border-gold/20 rounded p-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Alamat</span>
                  <div className="flex space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button onClick={copyAddress} className="text-gray-400 hover:text-gold">
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Salin alamat</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={getExplorerLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gold"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Lihat di Explorer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="font-mono text-sm mt-1 break-all">{walletAddress}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/50 border border-gold/20 rounded p-2">
                  <div className="text-sm text-gray-400">SOL Balance</div>
                  <div className="font-medium">{solBalance.toFixed(4)} SOL</div>
                </div>
                <div className="bg-black/50 border border-gold/20 rounded p-2">
                  <div className="text-sm text-gray-400">GOLD Balance</div>
                  <div className="font-medium">{goldBalance.toFixed(2)} GOLD</div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-2 border-red-500/50 text-red-500 hover:bg-red-500/10"
                onClick={disconnect}
              >
                Disconnect Wallet
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  // If not connected, show connect button
  return (
    <Button
      variant={variant}
      size={size}
      className={`border-gold-500/50 text-gold-500 hover:bg-gold-500/10 ${className}`}
      onClick={handleConnectClick}
      disabled={isButtonDisabled || connecting}
    >
      {connecting || isButtonDisabled ? (
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
