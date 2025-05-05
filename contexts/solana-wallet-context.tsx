"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Connection, PublicKey } from "@solana/web3.js"
import { useToast } from "@/hooks/use-toast"

// Define the context type
interface SolanaWalletContextType {
  connected: boolean
  connecting: boolean
  address: string | null
  solBalance: number | null
  goldBalance: number | null
  isBalanceLoading: boolean
  lastUpdated: number | null
  connect: () => Promise<{ success: boolean; rejected?: boolean }>
  disconnect: () => Promise<void>
  refreshBalance: () => Promise<void>
  isPhantomInstalled: boolean
}

// Create the context with default values
const SolanaWalletContext = createContext<SolanaWalletContextType>({
  connected: false,
  connecting: false,
  address: null,
  solBalance: null,
  goldBalance: null,
  isBalanceLoading: false,
  lastUpdated: null,
  connect: async () => ({ success: false }),
  disconnect: async () => {},
  refreshBalance: async () => {},
  isPhantomInstalled: false,
})

// Custom hook to use the context
export const useSolanaWallet = () => useContext(SolanaWalletContext)

// Provider component
export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [solBalance, setSolBalance] = useState<number | null>(null)
  const [goldBalance, setGoldBalance] = useState<number | null>(null)
  const [isBalanceLoading, setIsBalanceLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const [connection, setConnection] = useState<Connection | null>(null)
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false)
  const { toast } = useToast()

  // Initialize connection and check for existing connection
  useEffect(() => {
    const conn = new Connection("https://api.mainnet-beta.solana.com", "confirmed")
    setConnection(conn)

    // Check if Phantom is installed
    const checkPhantomInstalled = () => {
      const phantom = window?.solana?.isPhantom
      setIsPhantomInstalled(!!phantom)
      return !!phantom
    }

    // Check if we have a stored connection
    const checkStoredConnection = async () => {
      const storedAddress = localStorage.getItem("phantom_wallet_address")
      if (storedAddress && checkPhantomInstalled()) {
        try {
          // Try to reconnect with Phantom
          if (window.solana && window.solana.isConnected) {
            const publicKey = window.solana.publicKey?.toString()
            if (publicKey) {
              setAddress(publicKey)
              setConnected(true)
              await refreshBalanceForAddress(publicKey, conn)
            }
          }
        } catch (error) {
          console.error("Error reconnecting to stored wallet:", error)
          // Clear stored address if reconnection fails
          localStorage.removeItem("phantom_wallet_address")
        }
      }
    }

    checkPhantomInstalled()
    checkStoredConnection()

    // Setup Phantom wallet event listeners
    const setupPhantomListeners = () => {
      if (window.solana) {
        window.solana.on("connect", (publicKey: any) => {
          const publicKeyString = publicKey.toString()
          console.log("Phantom wallet connected:", publicKeyString)
          handleWalletConnected(publicKeyString)
        })

        window.solana.on("disconnect", () => {
          console.log("Phantom wallet disconnected")
          handleWalletDisconnected()
        })

        window.solana.on("accountChanged", (publicKey: any) => {
          if (publicKey) {
            const publicKeyString = publicKey.toString()
            console.log("Phantom wallet account changed:", publicKeyString)
            handleWalletConnected(publicKeyString)
          } else {
            handleWalletDisconnected()
          }
        })
      }
    }

    // Setup listeners after a short delay to ensure window.solana is available
    setTimeout(setupPhantomListeners, 500)

    return () => {
      // Remove event listeners
      if (window.solana) {
        window.solana.removeAllListeners()
      }
    }
  }, [])

  // Handle wallet connected
  const handleWalletConnected = async (publicKeyString: string) => {
    setAddress(publicKeyString)
    setConnected(true)
    setConnecting(false)
    localStorage.setItem("phantom_wallet_address", publicKeyString)

    // Show toast notification
    toast({
      title: "Wallet Connected",
      description: `Connected to ${publicKeyString.slice(0, 6)}...${publicKeyString.slice(-4)}`,
    })

    // Fetch balances
    if (connection) {
      await refreshBalanceForAddress(publicKeyString, connection)
    }
  }

  // Handle wallet disconnected
  const handleWalletDisconnected = () => {
    setAddress(null)
    setConnected(false)
    setSolBalance(null)
    setGoldBalance(null)
    localStorage.removeItem("phantom_wallet_address")

    // Show toast notification
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  // Connect wallet
  const connect = async () => {
    try {
      setConnecting(true)

      // Check if Phantom is installed
      if (!window.solana || !window.solana.isPhantom) {
        toast({
          title: "Phantom Not Installed",
          description: "Please install Phantom wallet extension",
          variant: "destructive",
        })
        setConnecting(false)
        return { success: false }
      }

      // Request connection - this will trigger the Phantom popup
      const response = await window.solana.connect()
      const publicKey = response.publicKey.toString()

      // Connection is handled by the event listeners
      console.log("Wallet connected via connect method:", publicKey)
      return { success: true }
    } catch (error: any) {
      console.error("Error connecting wallet:", error)

      // Check if user rejected the connection
      const isUserRejection =
        error.message &&
        (error.message.includes("User rejected") ||
          error.message.includes("cancelled") ||
          error.message.includes("rejected"))

      if (!isUserRejection) {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to Phantom wallet",
          variant: "destructive",
        })
      }

      setConnecting(false)
      return { success: false, rejected: isUserRejection }
    }
  }

  // Disconnect wallet
  const disconnect = async () => {
    try {
      if (window.solana && window.solana.isPhantom) {
        await window.solana.disconnect()
      }

      // Disconnection is handled by the event listeners
    } catch (error) {
      console.error("Error disconnecting wallet:", error)

      // Force disconnect even if there's an error
      handleWalletDisconnected()
    }
  }

  // Refresh balance for a specific address
  const refreshBalanceForAddress = async (publicKeyString: string, conn: Connection) => {
    try {
      setIsBalanceLoading(true)

      // Get SOL balance
      const publicKey = new PublicKey(publicKeyString)
      const lamports = await conn.getBalance(publicKey)
      const sol = lamports / 1e9

      // Get GOLD token balance (using fixed value for testing)
      setSolBalance(0.01667)
      setGoldBalance(100)
      setLastUpdated(Date.now())
    } catch (error) {
      console.error("Error refreshing balance:", error)
    } finally {
      setIsBalanceLoading(false)
    }
  }

  // Refresh balance
  const refreshBalance = async () => {
    if (!connected || !address || !connection) return
    await refreshBalanceForAddress(address, connection)
  }

  // Context value
  const value = {
    connected,
    connecting,
    address,
    solBalance,
    goldBalance,
    isBalanceLoading,
    lastUpdated,
    connect,
    disconnect,
    refreshBalance,
    isPhantomInstalled,
  }

  return <SolanaWalletContext.Provider value={value}>{children}</SolanaWalletContext.Provider>
}
