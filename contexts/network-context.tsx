"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

export type NetworkType = "mainnet" | "testnet"

export const DEFAULT_NETWORK: NetworkType = "testnet"

export const NETWORKS = {
  mainnet: {
    name: "Mainnet",
    endpoint: "https://api.mainnet-beta.solana.com",
    goldTokenAddress: "GLD1aose7SawAYZ5DLZKLmZU9UpEDGxwgQhvmSvczXr", // Example mainnet address
  },
  testnet: {
    name: "Testnet",
    endpoint: "https://api.testnet.solana.com",
    goldTokenAddress: "GLD7aose7SawAYZ5DLZKLmZU9UpEDGxwgQhvmSvczXr", // Example testnet address
  },
}

interface NetworkContextType {
  network: NetworkType
  setNetwork: (network: NetworkType) => void
  endpoint: string
  goldTokenAddress: string
  isMainnet: boolean
  isTestnet: boolean
}

const NetworkContext = createContext<NetworkContextType>({
  network: DEFAULT_NETWORK,
  setNetwork: () => {},
  endpoint: NETWORKS[DEFAULT_NETWORK].endpoint,
  goldTokenAddress: NETWORKS[DEFAULT_NETWORK].goldTokenAddress,
  isMainnet: DEFAULT_NETWORK === "mainnet",
  isTestnet: DEFAULT_NETWORK === "testnet",
})

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<NetworkType>(DEFAULT_NETWORK)
  const { toast } = useToast()

  // Load network preference from localStorage if available
  useEffect(() => {
    try {
      const savedNetwork = localStorage.getItem("goldium-network")
      if (savedNetwork && (savedNetwork === "mainnet" || savedNetwork === "testnet")) {
        setNetwork(savedNetwork as NetworkType)
      }
    } catch (error) {
      console.error("Error loading network from localStorage:", error)
    }
  }, [])

  // Save network preference to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("goldium-network", network)
    } catch (error) {
      console.error("Error saving network to localStorage:", error)
    }
  }, [network])

  const handleNetworkChange = (newNetwork: NetworkType) => {
    setNetwork(newNetwork)
    toast({
      title: "Network Changed",
      description: `Switched to ${NETWORKS[newNetwork].name}`,
      duration: 3000,
    })
  }

  const value = {
    network,
    setNetwork: handleNetworkChange,
    endpoint: NETWORKS[network].endpoint,
    goldTokenAddress: NETWORKS[network].goldTokenAddress,
    isMainnet: network === "mainnet",
    isTestnet: network === "testnet",
  }

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
}

export function useNetwork() {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider")
  }
  return context
}
