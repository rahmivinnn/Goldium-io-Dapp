"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useNetwork } from "@/contexts/network-context"

const networks = [
  {
    id: "ethereum",
    name: "Ethereum",
    icon: "/ethereum-crystal.png",
    chainId: "1",
  },
  {
    id: "solana",
    name: "Solana",
    icon: "/images/solana-logo.png",
    chainId: "SOL",
  },
  {
    id: "binance",
    name: "Binance Smart Chain",
    icon: "/binance-logo.png",
    chainId: "56",
  },
  {
    id: "avalanche",
    name: "Avalanche",
    icon: "/avalanche-logo.png",
    chainId: "43114",
  },
]

export default function NetworkSelector() {
  const { network, setNetwork } = useNetwork()
  const [isOpen, setIsOpen] = useState(false)

  const currentNetwork = networks.find((n) => n.id === network) || networks[0]

  return (
    <div className="mt-12 pt-4">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center justify-between w-full border-amber-200/30 bg-black/50 hover:bg-black/70"
          >
            <div className="flex items-center">
              <div className="w-6 h-6 relative mr-2">
                <Image
                  src={currentNetwork.icon || "/placeholder.svg"}
                  alt={currentNetwork.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span>{currentNetwork.name}</span>
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full bg-black/90 backdrop-blur-md border-amber-200/30">
          {networks.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className={`flex items-center justify-between cursor-pointer ${
                item.id === network ? "bg-amber-500/20" : ""
              }`}
              onClick={() => {
                setNetwork(item.id)
                setIsOpen(false)
              }}
            >
              <div className="flex items-center">
                <div className="w-6 h-6 relative mr-2">
                  <Image src={item.icon || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                </div>
                <span>{item.name}</span>
              </div>
              {item.id === network && <Check className="h-4 w-4 text-amber-500" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
