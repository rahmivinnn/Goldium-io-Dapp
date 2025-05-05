"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Connection, PublicKey } from "@solana/web3.js"
import { getTokenBalance } from "@/services/token-service"

// Define the context type
interface SolanaWalletContextType {
  connected: boolean
  address: string | null
  solBalance: number | null
  goldBalance: number | null
  isBalanceLoading: boolean
  lastUpdated: number | null
  connect: () => Promise<void>
  disconnect: () => void
  refreshBalance: () => Promise<void>
}

// Create the context with default values
const SolanaWalletContext = createContext<SolanaWalletContextType>({
  connected: false,
  address: null,
  solBalance: null,
  goldBalance: null,
  isBalanceLoading: false,
  lastUpdated: null,
  connect: async () => {},
  disconnect: () => {},
  refreshBalance: async () => {},
})

// Custom hook to use the context
export const useSolanaWallet = () => useContext(SolanaWalletContext)

// Mock Phantom wallet for development
const mockPhantomWallet = {
  isPhantom: true,
  connect: async () => ({
    publicKey: new PublicKey("7Xf3QEm2FTzJEpFGHNmMKk2oHgSgxnNxRNRUBZf7S8kP"),
  }),
  disconnect: async () => {},
  on: (event: string, callback: any) => {},
  removeListener: (event: string, callback: any) => {},
}

// Provider component
export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [solBalance, setSolBalance] = useState<number | null>(null)
  const [goldBalance, setGoldBalance] = useState<number | null>(null)
  const [isBalanceLoading, setIsBalanceLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const [connection, setConnection] = useState<Connection | null>(null)

  // Initialize connection
  useEffect(() => {
    const conn = new Connection("https://api.mainnet-beta.solana.com", "confirmed")
    setConnection(conn)
  }, [])

  // Connect wallet
  const connect = async () => {
    try {
      // Check if Phantom is installed
      const phantom = (window as any).solana || mockPhantomWallet

      if (phantom?.isPhantom) {
        const response = await phantom.connect()
        const publicKey = response.publicKey.toString()

        setAddress(publicKey)
        setConnected(true)

        // Fetch balances after connection
        await refreshBalance()
      } else {
        console.error("Phantom wallet not found")
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  // Disconnect wallet
  const disconnect = () => {
    try {
      const phantom = (window as any).solana || mockPhantomWallet

      if (phantom?.isPhantom) {
        phantom.disconnect()
      }

      setAddress(null)
      setConnected(false)
      setSolBalance(null)
      setGoldBalance(null)
      setLastUpdated(null)
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  // Refresh balance
  const refreshBalance = async () => {
    if (!connected || !address || !connection) return

    try {
      setIsBalanceLoading(true)

      // Get SOL balance
      const publicKey = new PublicKey(address)
      const lamports = await connection.getBalance(publicKey)
      const sol = lamports / 1e9

      // Get GOLD token balance
      const goldMintAddress = "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump" // Example GOLD token mint
      const gold = await getTokenBalance(connection, publicKey, new PublicKey(goldMintAddress))

      // Update state with fixed values for testing
      setSolBalance(0.01667) // Fixed value as requested
      setGoldBalance(100) // Fixed value as requested
      setLastUpdated(Date.now())
    } catch (error) {
      console.error("Error refreshing balance:", error)
    } finally {
      setIsBalanceLoading(false)
    }
  }

  // Context value
  const value = {
    connected,
    address,
    solBalance,
    goldBalance,
    isBalanceLoading,
    lastUpdated,
    connect,
    disconnect,
    refreshBalance,
  }

  return <SolanaWalletContext.Provider value={value}>{children}</SolanaWalletContext.Provider>
}
