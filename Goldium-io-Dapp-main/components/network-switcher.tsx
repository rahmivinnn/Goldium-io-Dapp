"use client"

import { useNetwork } from "@/contexts/network-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useToast } from "@/hooks/use-toast"

export function NetworkSwitcher() {
  const { network, setNetwork, isMainnet } = useNetwork()
  const { connected, disconnect } = useSolanaWallet()
  const { toast } = useToast()

  const handleNetworkChange = async (newNetwork: "mainnet" | "testnet") => {
    if (connected) {
      // Disconnect wallet when changing networks to avoid confusion
      await disconnect()
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected due to network change.",
      })
    }

    setNetwork(newNetwork)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>{isMainnet ? "Mainnet" : "Devnet"}</span>
          <div className={`h-2 w-2 rounded-full ${isMainnet ? "bg-green-500" : "bg-blue-500"}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleNetworkChange("mainnet")} className={isMainnet ? "bg-secondary/50" : ""}>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>Mainnet</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleNetworkChange("testnet")}
          className={!isMainnet ? "bg-secondary/50" : ""}
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span>Devnet</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
