"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronDownIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface NetworkSelectorProps {
  network: string
  onNetworkChange: (network: string) => void
  excludeNetwork?: string
}

const networks = [
  { id: "ethereum", name: "Ethereum", icon: "/images/ethereum-logo.png" },
  { id: "solana", name: "Solana", icon: "/images/solana-logo.png" },
  { id: "binance", name: "Binance Smart Chain", icon: "/images/binance-logo.png" },
  { id: "polygon", name: "Polygon", icon: "/images/polygon-logo.png" },
  { id: "avalanche", name: "Avalanche", icon: "/images/avalanche-logo.png" },
]

export default function NetworkSelector({ network, onNetworkChange, excludeNetwork }: NetworkSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedNetwork = networks.find((n) => n.id === network) || networks[0]
  const availableNetworks = networks.filter((n) => n.id !== excludeNetwork)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors">
          <div className="flex items-center">
            <div className="w-8 h-8 relative mr-2 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
              <Image
                src={selectedNetwork.icon || "/placeholder.svg"}
                alt={selectedNetwork.name}
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <span className="text-white">{selectedNetwork.name}</span>
          </div>
          <ChevronDownIcon className="h-5 w-5 text-gray-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[240px] bg-gray-900 border border-gray-700">
        {availableNetworks.map((n) => (
          <DropdownMenuItem
            key={n.id}
            className={`flex items-center px-3 py-2 hover:bg-gray-800 cursor-pointer ${
              n.id === network ? "bg-amber-500/10 text-amber-500" : "text-white"
            }`}
            onClick={() => {
              onNetworkChange(n.id)
              setIsOpen(false)
            }}
          >
            <div className="w-6 h-6 relative mr-2 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
              <Image
                src={n.icon || "/placeholder.svg"}
                alt={n.name}
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <span>{n.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
