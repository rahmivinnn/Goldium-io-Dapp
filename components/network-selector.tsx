"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { ChevronDown } from "lucide-react"

// Network definitions
const NETWORKS = [
  {
    id: "ethereum",
    name: "Ethereum",
    icon: "🔷",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    borderColor: "border-blue-500/50",
    hoverColor: "hover:bg-blue-500/10",
    explorerUrl: "https://etherscan.io",
    chainId: "1",
    currency: "ETH",
    rpcUrl: "https://mainnet.infura.io/v3/your-api-key",
  },
  {
    id: "solana",
    name: "Solana",
    icon: "🟣",
    color: "bg-purple-500",
    textColor: "text-purple-500",
    borderColor: "border-purple-500/50",
    hoverColor: "hover:bg-purple-500/10",
    explorerUrl: "https://solscan.io",
    chainId: "mainnet-beta",
    currency: "SOL",
    rpcUrl: "https://api.mainnet-beta.solana.com",
  },
  {
    id: "bsc",
    name: "BSC",
    icon: "🟡",
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500/50",
    hoverColor: "hover:bg-yellow-500/10",
    explorerUrl: "https://bscscan.com",
    chainId: "56",
    currency: "BNB",
    rpcUrl: "https://bsc-dataseed.binance.org",
  },
  {
    id: "polygon",
    name: "Polygon",
    icon: "🟪",
    color: "bg-indigo-500",
    textColor: "text-indigo-500",
    borderColor: "border-indigo-500/50",
    hoverColor: "hover:bg-indigo-500/10",
    explorerUrl: "https://polygonscan.com",
    chainId: "137",
    currency: "MATIC",
    rpcUrl: "https://polygon-rpc.com",
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    icon: "🔵",
    color: "bg-blue-600",
    textColor: "text-blue-600",
    borderColor: "border-blue-600/50",
    hoverColor: "hover:bg-blue-600/10",
    explorerUrl: "https://arbiscan.io",
    chainId: "42161",
    currency: "ETH",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
  },
]

interface NetworkSelectorProps {
  onNetworkChange?: (networkId: string) => void
  size?: "default" | "sm" | "lg"
  variant?: "default" | "minimal" | "button"
  initialNetwork?: string
  className?: string
}

export function NetworkSelector({
  onNetworkChange,
  size = "default",
  variant = "default",
  initialNetwork = "ethereum",
  className = "",
}: NetworkSelectorProps) {
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS.find((n) => n.id === initialNetwork) || NETWORKS[0])
  const { toast } = useToast()

  const handleNetworkChange = (networkId: string) => {
    const network = NETWORKS.find((n) => n.id === networkId)
    if (!network) return

    setSelectedNetwork(network)

    toast({
      title: "Network Changed",
      description: `Switched to ${network.name} network`,
    })

    if (onNetworkChange) {
      onNetworkChange(networkId)
    }
  }

  // Minimal variant (icon + name only)
  if (variant === "minimal") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={size} className={`flex items-center ${selectedNetwork.textColor} ${className}`}>
            <span className="mr-1">{selectedNetwork.icon}</span>
            <span className="mr-1">{selectedNetwork.name}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-black border-gold/30">
          {NETWORKS.map((network) => (
            <DropdownMenuItem
              key={network.id}
              className={`cursor-pointer ${network.id === selectedNetwork.id ? "bg-gold/10" : ""}`}
              onClick={() => handleNetworkChange(network.id)}
            >
              <span className="mr-2">{network.icon}</span>
              <span>{network.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Button variant (colored button)
  if (variant === "button") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size={size}
            className={`border-${selectedNetwork.id === "ethereum" ? "blue" : selectedNetwork.id === "solana" ? "purple" : selectedNetwork.id === "bsc" ? "yellow" : "indigo"}-500/50 ${selectedNetwork.textColor} ${selectedNetwork.hoverColor} ${className}`}
          >
            <span className="mr-2">{selectedNetwork.icon}</span>
            <span>{selectedNetwork.name}</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-black border-gold/30">
          {NETWORKS.map((network) => (
            <DropdownMenuItem
              key={network.id}
              className={`cursor-pointer ${network.id === selectedNetwork.id ? "bg-gold/10" : ""}`}
              onClick={() => handleNetworkChange(network.id)}
            >
              <span className="mr-2">{network.icon}</span>
              <span>{network.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Default variant (full featured)
  return (
    <div className={`${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size={size}
            className={`${selectedNetwork.borderColor} ${selectedNetwork.textColor} ${selectedNetwork.hoverColor}`}
          >
            <div className="flex items-center">
              <span className="mr-2">{selectedNetwork.icon}</span>
              <span>{selectedNetwork.name}</span>
              <div className={`ml-2 w-2 h-2 rounded-full ${selectedNetwork.color}`}></div>
              <ChevronDown className="ml-2 h-4 w-4" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-black border-gold/30 w-[200px]">
          {NETWORKS.map((network) => (
            <DropdownMenuItem
              key={network.id}
              className={`cursor-pointer ${network.id === selectedNetwork.id ? "bg-gold/10" : ""}`}
              onClick={() => handleNetworkChange(network.id)}
            >
              <div className="flex items-center w-full">
                <span className="mr-2">{network.icon}</span>
                <span>{network.name}</span>
                <div className={`ml-auto w-2 h-2 rounded-full ${network.color}`}></div>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
        <span>Chain ID: {selectedNetwork.chainId}</span>
        <a
          href={selectedNetwork.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold hover:underline"
        >
          Explorer
        </a>
      </div>
    </div>
  )
}
