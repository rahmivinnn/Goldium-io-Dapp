"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { useLocalStorage } from "./use-local-storage"

// Network types
export type NetworkType = "mainnet" | "devnet"

// Network configuration
export interface NetworkConfig {
  network: NetworkType
  endpoint: string
  setNetwork: (network: NetworkType) => void
}

// Default network
const DEFAULT_NETWORK: NetworkType = "devnet"

// Network endpoints
const NETWORK_ENDPOINTS = {
  mainnet: "https://api.mainnet-beta.solana.com",
  devnet: "https://api.devnet.solana.com",
}

// Create context
const NetworkConfigContext = createContext<NetworkConfig | undefined>(undefined)

// Provider component
export function NetworkConfigProvider({ children }: { children: ReactNode }) {
  const [storedNetwork, setStoredNetwork] = useLocalStorage<NetworkType>("goldium-network", DEFAULT_NETWORK)
  const [network, setNetwork] = useState<NetworkType>(DEFAULT_NETWORK)
  const [endpoint, setEndpoint] = useState<string>(NETWORK_ENDPOINTS[DEFAULT_NETWORK])
  const [mounted, setMounted] = useState(false)

  // Initialize from localStorage
  useEffect(() => {
    setMounted(true)
    if (storedNetwork) {
      setNetwork(storedNetwork)
      setEndpoint(NETWORK_ENDPOINTS[storedNetwork])
    }
  }, [storedNetwork])

  // Update network
  const updateNetwork = (newNetwork: NetworkType) => {
    setNetwork(newNetwork)
    setEndpoint(NETWORK_ENDPOINTS[newNetwork])
    setStoredNetwork(newNetwork)
  }

  // Skip rendering during SSR
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <NetworkConfigContext.Provider value={{ network, endpoint, setNetwork: updateNetwork }}>
      {children}
    </NetworkConfigContext.Provider>
  )
}

// Hook to use network config
export function useNetworkConfig() {
  const context = useContext(NetworkConfigContext)
  if (context === undefined) {
    throw new Error("useNetworkConfig must be used within a NetworkConfigProvider")
  }
  return context
}
