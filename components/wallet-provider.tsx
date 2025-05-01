"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { useNetwork } from "@/contexts/network-context"

// Define token types
export interface Token {
  symbol: string
  name: string
  mint: string
  decimals: number
  balance: number
  price: number
  icon: string
}

interface WalletContextType {
  connected: boolean
  connecting: boolean
  address: string | null
  balance: number
  solBalance: number
  goldBalance: number
  tokens: Token[]
  connect: () => Promise<void | boolean>
  disconnect: () => void
  refreshBalance: () => Promise<void>
}

// GOLD token addresses for different networks
const GOLD_TOKEN_ADDRESSES = {
  mainnet: "GLD1aose7SawAYZ5DLZKLmZU9UpEDGxwgQhvmSvczXr", // Example mainnet address
  testnet: "GLD7aose7SawAYZ5DLZKLmZU9UpEDGxwgQhvmSvczXr", // Example testnet address
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  connecting: false,
  address: null,
  balance: 0,
  solBalance: 0,
  goldBalance: 0,
  tokens: [],
  connect: async () => {},
  disconnect: () => {},
  refreshBalance: async () => {},
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const { network, endpoint } = useNetwork()
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [solBalance, setSolBalance] = useState(0)
  const [goldBalance, setGoldBalance] = useState(0)
  const [tokens, setTokens] = useState<Token[]>([])
  const { toast } = useToast()

  // Check for existing connection on mount
  useEffect(() => {
    try {
      const savedAddress = localStorage.getItem("walletAddress")
      if (savedAddress) {
        setAddress(savedAddress)
        setConnected(true)
        refreshBalance()
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error)
    }
  }, [])

  // Refresh balances when network changes
  useEffect(() => {
    if (connected) {
      refreshBalance()
    }
  }, [network, connected])

  const refreshBalance = async () => {
    if (!connected) return

    try {
      // In a real implementation, this would fetch actual balances from the blockchain
      // For now, we'll simulate different balances for testnet and mainnet

      const isMainnet = network === "mainnet"

      // Simulate SOL balance
      const mockSolBalance = isMainnet ? 2.45 : 100.75
      setSolBalance(mockSolBalance)

      // Simulate GOLD balance
      const mockGoldBalance = isMainnet ? 1250.5 : 5000.25
      setGoldBalance(mockGoldBalance)

      // Set total balance (in this case, just GOLD)
      setBalance(mockGoldBalance)

      // Create token list with only SOL and GOLD
      const tokenList: Token[] = [
        {
          symbol: "SOL",
          name: "Solana",
          mint: "So11111111111111111111111111111111111111112",
          decimals: 9,
          balance: mockSolBalance,
          price: isMainnet ? 150.25 : 150.25, // Same price for both networks
          icon: "/ethereum-crystal.png", // Using existing icon as placeholder
        },
        {
          symbol: "GOLD",
          name: "Goldium",
          mint: GOLD_TOKEN_ADDRESSES[network],
          decimals: 9,
          balance: mockGoldBalance,
          price: isMainnet ? 2.34 : 2.34, // Same price for both networks
          icon: "/gold-logo.png",
        },
      ]

      setTokens(tokenList)
    } catch (error) {
      console.error("Error refreshing balance:", error)
    }
  }

  const connect = async () => {
    try {
      setConnecting(true)

      // Simulate wallet connection delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real implementation, this would connect to Phantom
      // For now, we'll generate a random wallet address
      const randomAddress = `${network === "mainnet" ? "Main" : "Test"}${Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join("")}`

      setAddress(randomAddress)
      setConnected(true)

      // Refresh balance after connecting
      await refreshBalance()

      // Save to localStorage for session persistence
      try {
        localStorage.setItem("walletAddress", randomAddress)
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }

      toast({
        title: "Wallet Connected",
        description: `Connected to ${randomAddress.slice(0, 6)}...${randomAddress.slice(-4)}`,
      })

      return true
    } catch (error) {
      console.error("Wallet connection error:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = () => {
    setConnected(false)
    setAddress(null)
    setBalance(0)
    setSolBalance(0)
    setGoldBalance(0)
    setTokens([])

    try {
      localStorage.removeItem("walletAddress")
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  return (
    <WalletContext.Provider
      value={{
        connected,
        connecting,
        address,
        balance,
        solBalance,
        goldBalance,
        tokens,
        connect,
        disconnect,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)
