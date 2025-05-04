"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronDownIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface TokenSelectorProps {
  network: string
  token: string
  onTokenChange: (token: string) => void
}

// Token mapping by network
const tokensByNetwork: Record<string, Array<{ id: string; name: string; icon: string }>> = {
  ethereum: [
    { id: "ETH", name: "Ethereum", icon: "/images/ethereum-logo.png" },
    { id: "USDT", name: "Tether USD", icon: "/abstract-tether.png" },
    { id: "USDC", name: "USD Coin", icon: "/usdc-digital-currency.png" },
    { id: "GOLD", name: "Goldium", icon: "/gold_icon-removebg-preview.png" },
  ],
  solana: [
    { id: "SOL", name: "Solana", icon: "/images/solana-logo.png" },
    { id: "USDT", name: "Tether USD", icon: "/abstract-tether.png" },
    { id: "USDC", name: "USD Coin", icon: "/usdc-digital-currency.png" },
    { id: "GOLD", name: "Goldium", icon: "/gold_icon-removebg-preview.png" },
  ],
  binance: [
    { id: "BNB", name: "Binance Coin", icon: "/images/binance-logo.png" },
    { id: "USDT", name: "Tether USD", icon: "/abstract-tether.png" },
    { id: "USDC", name: "USD Coin", icon: "/usdc-digital-currency.png" },
    { id: "GOLD", name: "Goldium", icon: "/gold_icon-removebg-preview.png" },
  ],
  polygon: [
    { id: "MATIC", name: "Polygon", icon: "/images/polygon-logo.png" },
    { id: "USDT", name: "Tether USD", icon: "/abstract-tether.png" },
    { id: "USDC", name: "USD Coin", icon: "/usdc-digital-currency.png" },
    { id: "GOLD", name: "Goldium", icon: "/gold_icon-removebg-preview.png" },
  ],
  avalanche: [
    { id: "AVAX", name: "Avalanche", icon: "/images/avalanche-logo.png" },
    { id: "USDT", name: "Tether USD", icon: "/abstract-tether.png" },
    { id: "USDC", name: "USD Coin", icon: "/usdc-digital-currency.png" },
    { id: "GOLD", name: "Goldium", icon: "/gold_icon-removebg-preview.png" },
  ],
}

export default function TokenSelector({ network, token, onTokenChange }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [availableTokens, setAvailableTokens] = useState(tokensByNetwork.ethereum)

  useEffect(() => {
    if (tokensByNetwork[network]) {
      setAvailableTokens(tokensByNetwork[network])

      // If the current token doesn't exist in the new network, select the first available
      if (!tokensByNetwork[network].some((t) => t.id === token)) {
        onTokenChange(tokensByNetwork[network][0].id)
      }
    }
  }, [network, token, onTokenChange])

  const selectedToken = availableTokens.find((t) => t.id === token) || availableTokens[0]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
          <div className="flex items-center">
            <div className="w-6 h-6 relative mr-2 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
              <Image
                src={selectedToken.icon || "/placeholder.svg"}
                alt={selectedToken.name}
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <span className="text-white">{selectedToken.id}</span>
          </div>
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[200px] bg-gray-900 border border-gray-700">
        {availableTokens.map((t) => (
          <DropdownMenuItem
            key={t.id}
            className={`flex items-center px-3 py-2 hover:bg-gray-800 cursor-pointer ${
              t.id === token ? "bg-amber-500/10 text-amber-500" : "text-white"
            }`}
            onClick={() => {
              onTokenChange(t.id)
              setIsOpen(false)
            }}
          >
            <div className="w-6 h-6 relative mr-2 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
              <Image
                src={t.icon || "/placeholder.svg"}
                alt={t.name}
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span>{t.id}</span>
              <span className="text-xs text-gray-400">{t.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
