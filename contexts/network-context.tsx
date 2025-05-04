"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { clusterApiUrl } from "@solana/web3.js"

export type NetworkType = "mainnet" | "testnet" | "devnet"

interface NetworkContextType {
  network: NetworkType
  setNetwork: (network: NetworkType) => void
  endpoint: string
  explorerUrl: string
  goldTokenAddress: string
  isTestnet: boolean
}

const defaultGoldTokenAddress = "GLD1ay7AxNJ349gKYUPRY8Vs2dqXCuMFhz1qhvNLT2Ph" // Example address

export const NETWORKS = {
  mainnet: {
    name: "Mainnet",
    endpoint: clusterApiUrl("mainnet-beta"),
    explorerUrl: "https://explorer.solana.com",
    goldTokenAddress: "GLD1ay7AxNJ349gKYUPRY8Vs2dqXCuMFhz1qhvNLT2Ph",
  },
  testnet: {
    name: "Testnet",
    endpoint: clusterApiUrl("testnet"),
    explorerUrl: "https://explorer.solana.com/?cluster=testnet",
    goldTokenAddress: "GLD1ay7AxNJ349gKYUPRY8Vs2dqXCuMFhz1qhvNLT2Ph",
  },
  devnet: {
    name: "Devnet",
    endpoint: clusterApiUrl("devnet"),
    explorerUrl: "https://explorer.solana.com/?cluster=devnet",
    goldTokenAddress: "GLD1ay7AxNJ349gKYUPRY8Vs2dqXCuMFhz1qhvNLT2Ph",
  },
}

const NetworkContext = createContext<NetworkContextType>({
  network: "devnet",
  setNetwork: () => {},
  endpoint: NETWORKS.devnet.endpoint,
  explorerUrl: NETWORKS.devnet.explorerUrl,
  goldTokenAddress: defaultGoldTokenAddress,
  isTestnet: true,
})

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [network, setNetwork] = useState<NetworkType>("devnet")
  const [endpoint, setEndpoint] = useState(NETWORKS.devnet.endpoint)
  const [explorerUrl, setExplorerUrl] = useState(NETWORKS.devnet.explorerUrl)
  const [goldTokenAddress, setGoldTokenAddress] = useState(defaultGoldTokenAddress)
  const [isTestnet, setIsTestnet] = useState(true)

  useEffect(() => {
    // Update endpoint based on network
    switch (network) {
      case "mainnet":
        setEndpoint(NETWORKS.mainnet.endpoint)
        setExplorerUrl(NETWORKS.mainnet.explorerUrl)
        setGoldTokenAddress(NETWORKS.mainnet.goldTokenAddress)
        setIsTestnet(false)
        break
      case "testnet":
        setEndpoint(NETWORKS.testnet.endpoint)
        setExplorerUrl(NETWORKS.testnet.explorerUrl)
        setGoldTokenAddress(NETWORKS.testnet.goldTokenAddress)
        setIsTestnet(true)
        break
      case "devnet":
      default:
        setNetwork("devnet")
        setEndpoint(NETWORKS.devnet.endpoint)
        setExplorerUrl(NETWORKS.devnet.explorerUrl)
        setGoldTokenAddress(NETWORKS.devnet.goldTokenAddress)
        setIsTestnet(true)
        break
    }
  }, [network])

  return (
    <NetworkContext.Provider
      value={{
        network,
        setNetwork,
        endpoint,
        explorerUrl,
        goldTokenAddress,
        isTestnet,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}

export const useNetwork = () => useContext(NetworkContext)
