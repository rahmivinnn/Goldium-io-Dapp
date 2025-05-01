"use client"
import { useNetwork } from "@/contexts/network-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function NetworkSwitcher() {
  const { network, setNetwork, isMainnet } = useNetwork()

  const toggleNetwork = () => {
    setNetwork(isMainnet ? "testnet" : "mainnet")
  }

  return (
    <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={toggleNetwork}>
      <Globe className="h-4 w-4" />
      <span>{isMainnet ? "Mainnet" : "Testnet"}</span>
      <div className={`h-2 w-2 rounded-full ${isMainnet ? "bg-green-500" : "bg-blue-500"}`} />
    </Button>
  )
}
