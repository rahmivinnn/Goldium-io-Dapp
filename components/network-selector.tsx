"use client"

import { useState, useEffect } from "react"
import { useNetwork, type NetworkType } from "@/contexts/network-context"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function NetworkSelector() {
  const { network, setNetwork } = useNetwork()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="h-8 border-yellow-500/30 bg-black/50 text-white">
        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
        Loading...
      </Button>
    )
  }

  const handleNetworkChange = (newNetwork: NetworkType) => {
    setNetwork(newNetwork)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-yellow-500/30 bg-black/50 text-white">
          <span
            className={`h-2 w-2 rounded-full ${network === "mainnet" ? "bg-green-500" : "bg-yellow-500"} mr-2`}
          ></span>
          {network === "mainnet" ? "Mainnet" : "Devnet"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black/90 border border-yellow-500/30 text-white">
        <DropdownMenuItem
          className="flex items-center cursor-pointer hover:bg-yellow-500/10"
          onClick={() => handleNetworkChange("mainnet")}
        >
          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
          Mainnet
          {network === "mainnet" && <Check className="ml-2 h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center cursor-pointer hover:bg-yellow-500/10"
          onClick={() => handleNetworkChange("devnet")}
        >
          <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
          Devnet
          {network === "devnet" && <Check className="ml-2 h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
