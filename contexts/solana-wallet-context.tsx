"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Connection, PublicKey } from "@solana/web3.js"
import { useToast } from "@/hooks/use-toast"
import { useNetwork } from "./network-context"

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
  isSolflareInstalled: boolean
  walletType: "phantom" | "solflare" | null
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
  isSolflareInstalled: false,
  walletType: null,
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
  const [isSolflareInstalled, setIsSolflareInstalled] = useState(false)
  const [walletType, setWalletType] = useState<"phantom" | "solflare" | null>(null)
  const { toast } = useToast()
  const { endpoint, network } = useNetwork()

  // Initialize connection and check for existing connection
  useEffect(() => {
    const conn = new Connection(endpoint, "confirmed")
    setConnection(conn)

    // Check if wallets are installed
    const checkWalletsInstalled = () => {
      const phantom = window?.solana?.isPhantom
      const solflare = window?.solflare?.isSolflare
      setIsPhantomInstalled(!!phantom)
      setIsSolflareInstalled(!!solflare)
      return { phantom: !!phantom, solflare: !!solflare }
    }

    // Check if we have a stored connection
    const checkStoredConnection = async () => {
      const storedWalletType = localStorage.getItem("goldium_wallet_type")
      const storedAddress = localStorage.getItem("goldium_wallet_address")

      if (storedAddress && storedWalletType) {
        const { phantom, solflare } = checkWalletsInstalled()

        try {
          // Try to reconnect with the stored wallet
          if (storedWalletType === "phantom" && phantom && window.solana) {
            if (window.solana.isConnected) {
              const publicKey = window.solana.publicKey?.toString()
              if (publicKey) {
                setAddress(publicKey)
                setConnected(true)
                setWalletType("phantom")
                await refreshBalanceForAddress(publicKey, conn)
              }
            }
          } else if (storedWalletType === "solflare" && solflare && window.solflare) {
            if (window.solflare.isConnected) {
              const publicKey = window.solflare.publicKey?.toString()
              if (publicKey) {
                setAddress(publicKey)
                setConnected(true)
                setWalletType("solflare")
                await refreshBalanceForAddress(publicKey, conn)
              }
            }
          }
        } catch (error) {
          console.error("Error reconnecting to stored wallet:", error)
          // Clear stored data if reconnection fails
          localStorage.removeItem("goldium_wallet_address")
          localStorage.removeItem("goldium_wallet_type")
        }
      }
    }

    checkWalletsInstalled()
    checkStoredConnection()

    // Setup wallet event listeners
    const setupWalletListeners = () => {
      // Phantom listeners
      if (window.solana) {
        window.solana.on("connect", (publicKey: any) => {
          const publicKeyString = publicKey.toString()
          console.log("Phantom wallet connected:", publicKeyString)
          handleWalletConnected(publicKeyString, "phantom")
        })

        window.solana.on("disconnect", () => {
          console.log("Phantom wallet disconnected")
          handleWalletDisconnected()
        })

        window.solana.on("accountChanged", (publicKey: any) => {
          if (publicKey) {
            const publicKeyString = publicKey.toString()
            console.log("Phantom wallet account changed:", publicKeyString)
            handleWalletConnected(publicKeyString, "phantom")
          } else {
            handleWalletDisconnected()
          }
        })
      }

      // Solflare listeners
      if (window.solflare) {
        window.solflare.on("connect", (publicKey: any) => {
          const publicKeyString = publicKey.toString()
          console.log("Solflare wallet connected:", publicKeyString)
          handleWalletConnected(publicKeyString, "solflare")
        })

        window.solflare.on("disconnect", () => {
          console.log("Solflare wallet disconnected")
          handleWalletDisconnected()
        })

        window.solflare.on("accountChanged", (publicKey: any) => {
          if (publicKey) {
            const publicKeyString = publicKey.toString()
            console.log("Solflare wallet account changed:", publicKeyString)
            handleWalletConnected(publicKeyString, "solflare")
          } else {
            handleWalletDisconnected()
          }
        })
      }
    }

    // Setup listeners after a short delay to ensure window.solana/window.solflare is available
    setTimeout(setupWalletListeners, 500)

    return () => {
      // Remove event listeners
      if (window.solana) {
        window.solana.removeAllListeners()
      }
      if (window.solflare) {
        window.solflare.removeAllListeners()
      }
    }
  }, [endpoint])

  // Handle wallet connected
  const handleWalletConnected = async (publicKeyString: string, type: "phantom" | "solflare") => {
    setAddress(publicKeyString)
    setConnected(true)
    setConnecting(false)
    setWalletType(type)
    localStorage.setItem("goldium_wallet_address", publicKeyString)
    localStorage.setItem("goldium_wallet_type", type)

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
    setWalletType(null)
    localStorage.removeItem("goldium_wallet_address")
    localStorage.removeItem("goldium_wallet_type")

    // Show toast notification
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  // Connect wallet
  const connect = async (walletType: "phantom" | "solflare" = "phantom") => {
    try {
      setConnecting(true)

      if (walletType === "phantom") {
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
      } else if (walletType === "solflare") {
        // Check if Solflare is installed
        if (!window.solflare || !window.solflare.isSolflare) {
          toast({
            title: "Solflare Not Installed",
            description: "Please install Solflare wallet extension",
            variant: "destructive",
          })
          setConnecting(false)
          return { success: false }
        }

        // Request connection - this will trigger the Solflare popup
        const response = await window.solflare.connect()
        const publicKey = response.publicKey.toString()

        // Connection is handled by the event listeners
        console.log("Wallet connected via connect method:", publicKey)
        return { success: true }
      }

      setConnecting(false)
      return { success: false }
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
          description: `Failed to connect to ${walletType === "phantom" ? "Phantom" : "Solflare"} wallet`,
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
      if (walletType === "phantom" && window.solana && window.solana.isPhantom) {
        await window.solana.disconnect()
      } else if (walletType === "solflare" && window.solflare && window.solflare.isSolflare) {
        await window.solflare.disconnect()
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

      // Get GOLD token balance
      // In a real implementation, this would fetch the actual token balance
      // For demo purposes, we're using a fixed value
      setSolBalance(sol)
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
    isSolflareInstalled,
    walletType,
  }

  return <SolanaWalletContext.Provider value={value}>{children}</SolanaWalletContext.Provider>
}
