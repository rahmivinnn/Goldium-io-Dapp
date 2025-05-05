"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Network configuration
export type NetworkType = "mainnet" | "devnet"

export const DEFAULT_NETWORK: NetworkType = "devnet"

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

// Use placeholder addresses for client-side that will be replaced with actual addresses from server actions
export const NETWORKS = {
  mainnet: {
    name: "Mainnet",
    endpoint: process.env.NEXT_PUBLIC_SOLANA_RPC_MAINNET || "https://api.mainnet-beta.solana.com",
    goldTokenAddress: "placeholder-address-to-be-fetched-from-server", // Will be fetched from server
    explorerUrl: "https://explorer.solana.com",
  },
  devnet: {
    name: "Devnet",
    endpoint: process.env.NEXT_PUBLIC_SOLANA_RPC_DEVNET || "https://api.devnet.solana.com",
    goldTokenAddress: "placeholder-address-to-be-fetched-from-server", // Will be fetched from server
    explorerUrl: "https://explorer.solana.com/?cluster=devnet",
  },
}

// Faucet configuration
export const FAUCET_CONFIG = {
  cooldown: Number(process.env.NEXT_PUBLIC_FAUCET_COOLDOWN_MINUTES) || 5, // minutes
  amount: Number(process.env.NEXT_PUBLIC_FAUCET_AMOUNT) || 1, // GOLD tokens
  maxClaimsPerDay: 12, // Maximum claims per day
}

interface NetworkContextType {
  network: NetworkType
  setNetwork: (network: NetworkType) => void
  goldTokenAddress: string
  setGoldTokenAddress: (address: string) => void
  explorerUrl: string
  isMainnet: boolean
  endpoint: string
}

const NetworkContext = createContext<NetworkContextType>({
  network: DEFAULT_NETWORK,
  setNetwork: () => {},
  goldTokenAddress: "",
  setGoldTokenAddress: () => {},
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
  const [goldTokenAddress, setGoldTokenAddress] = useState<string>("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // Load network preference from localStorage if available
    const savedNetwork = localStorage.getItem("goldium_network")
    if (savedNetwork && (savedNetwork === "mainnet" || savedNetwork === "devnet")) {
      setNetwork(savedNetwork as NetworkType)
    }

    // Fetch the gold token address from the server
    fetchGoldTokenAddress((savedNetwork as NetworkType) || DEFAULT_NETWORK)
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("goldium_network", network)
      // Fetch the gold token address when network changes
      fetchGoldTokenAddress(network)
    }
  }, [network, isClient])

  // Function to fetch the gold token address from the server
  const fetchGoldTokenAddress = async (networkType: NetworkType) => {
    try {
      const response = await fetch(`/api/token-address?network=${networkType}`)
      if (response.ok) {
        const data = await response.json()
        setGoldTokenAddress(data.address)
      } else {
        console.error("Failed to fetch token address")
      }
    } catch (error) {
      console.error("Error fetching token address:", error)
    }
  }

  const explorerUrl = NETWORKS[network].explorerUrl
  const endpoint = NETWORKS[network].endpoint
  const isMainnet = network === "mainnet"

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork,
        goldTokenAddress,
        setGoldTokenAddress,
        explorerUrl,
        isMainnet,
        endpoint,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}
