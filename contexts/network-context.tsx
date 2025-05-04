"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { Connection } from "@solana/web3.js"

// Network configuration
export type NetworkType = "mainnet" | "testnet"

export const DEFAULT_NETWORK: NetworkType = "testnet"

// Token metadata
const GOLD_TOKEN_METADATA = {
  symbol: "GOLD",
  name: "Goldium Token",
  decimals: 9,
  logoURI: "/gold_icon-removebg-preview.png",
}

const SOL_TOKEN_METADATA = {
  symbol: "SOL",
  name: "Solana",
  decimals: 9,
  logoURI: "/images/solana-logo.png",
}

export const NETWORKS = {
  mainnet: {
    name: "Mainnet",
    endpoint: "https://api.mainnet-beta.solana.com",
    goldTokenAddress: "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // Real GOLD token address on mainnet
    explorerUrl: "https://explorer.solana.com",
  },
  testnet: {
    name: "Testnet",
    endpoint: "https://api.testnet.solana.com",
    goldTokenAddress: "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // Using same address for demo, would be different in real scenario
    explorerUrl: "https://explorer.solana.com/?cluster=testnet",
  },
}

interface NetworkContextType {
  network: NetworkType
  setNetwork: (network: NetworkType) => void
  endpoint: string
  connection: Connection
  goldTokenAddress: string
  explorerUrl: string
  isMainnet: boolean
  isTestnet: boolean
}

const NetworkContext = createContext<NetworkContextType>({
  network: "testnet",
  setNetwork: () => {},
  endpoint: NETWORKS.testnet.endpoint,
  connection: new Connection(NETWORKS.testnet.endpoint),
  goldTokenAddress: NETWORKS.testnet.goldTokenAddress,
  explorerUrl: NETWORKS.testnet.explorerUrl,
  isMainnet: false,
  isTestnet: true,
})

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<NetworkType>("testnet")
  const [connection, setConnection] = useState<Connection>(new Connection(NETWORKS.testnet.endpoint))
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

  // Update connection when network changes
  useEffect(() => {
    const newEndpoint = NETWORKS[network].endpoint
    setConnection(new Connection(newEndpoint, "confirmed"))

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
    connection,
    goldTokenAddress: NETWORKS[network].goldTokenAddress,
    explorerUrl: NETWORKS[network].explorerUrl,
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
