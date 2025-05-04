"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Network configuration
export type NetworkType = "mainnet" | "testnet"

export const DEFAULT_NETWORK: NetworkType = "testnet"

// Token metadata
export const GOLD_TOKEN_METADATA = {
  symbol: "GOLD",
  name: "Goldium Token",
  decimals: 9,
  logoURI: "/gold_icon-removebg-preview.png",
  totalSupply: 1000000000, // 1 billion total supply
}

export const SOL_TOKEN_METADATA = {
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
  goldTokenAddress: string
  explorerUrl: string
  isMainnet: boolean
  endpoint: string
}

const NetworkContext = createContext<NetworkContextType>({
  network: DEFAULT_NETWORK,
  setNetwork: () => {},
  goldTokenAddress: NETWORKS[DEFAULT_NETWORK].goldTokenAddress,
  explorerUrl: NETWORKS[DEFAULT_NETWORK].explorerUrl,
  isMainnet: DEFAULT_NETWORK === "mainnet",
  endpoint: NETWORKS[DEFAULT_NETWORK].endpoint,
})

export const useNetwork = () => useContext(NetworkContext)

interface NetworkProviderProps {
  children: ReactNode
}

export const NetworkProvider = ({ children }: NetworkProviderProps) => {
  const [network, setNetwork] = useState<NetworkType>(DEFAULT_NETWORK)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("goldium_network", network)
    }
  }, [network, isClient])

  const goldTokenAddress = NETWORKS[network].goldTokenAddress
  const explorerUrl = NETWORKS[network].explorerUrl
  const endpoint = NETWORKS[network].endpoint
  const isMainnet = network === "mainnet"

  return (
    <NetworkContext.Provider value={{ network, setNetwork, goldTokenAddress, explorerUrl, isMainnet, endpoint }}>
      {children}
    </NetworkContext.Provider>
  )
}
