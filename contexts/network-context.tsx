"use client"

import { createContext, useContext, type ReactNode, useState } from "react"
import { DEFAULT_NETWORK, NETWORKS } from "@/config/network-config"

export type NetworkType = "mainnet" | "testnet"

interface NetworkContextType {
  network: NetworkType
  setNetwork: (network: NetworkType) => void
  isMainnet: boolean
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined)

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<NetworkType>(DEFAULT_NETWORK)
  const isMainnet = network === "mainnet"

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork,
        isMainnet,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetwork() {
  const context = useContext(NetworkContext)
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider")
  }
  return context
}

export { NETWORKS }
