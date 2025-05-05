"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { Connection, type PublicKey } from "@solana/web3.js"
import { useNetwork } from "@/contexts/network-context"
import { getGOLDBalance, getSOLBalance } from "@/services/token-service"

// Define the PhantomProvider interface
interface PhantomProvider {
  connect: () => Promise<{ publicKey: PublicKey }>
  disconnect: () => Promise<void>
  on: (event: string, callback: (...args: any[]) => void) => void
  isConnected: boolean
  publicKey: PublicKey | null
}

interface SolanaWalletContextType {
  connected: boolean
  connecting: boolean
  address: string | null
  publicKey: PublicKey | null
  solBalance: number
  goldBalance: number
  connection: Connection | null
  connect: () => Promise<{ success: boolean; rejected?: boolean }>
  disconnect: () => Promise<void>
  refreshBalance: () => Promise<void>
  sendTransaction: (transaction: any) => Promise<string>
  isPhantomInstalled: boolean
}

const SolanaWalletContext = createContext<SolanaWalletContextType>({
  connected: false,
  connecting: false,
  address: null,
  publicKey: null,
  solBalance: 0,
  goldBalance: 0,
  connection: null,
  connect: async () => ({ success: false }),
  disconnect: async () => {},
  refreshBalance: async () => {},
  sendTransaction: async () => "",
  isPhantomInstalled: false,
})

export const useSolanaWallet = () => useContext(SolanaWalletContext)

interface SolanaWalletProviderProps {
  children: ReactNode
}

export const SolanaWalletProvider = ({ children }: SolanaWalletProviderProps) => {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [solBalance, setSolBalance] = useState(0)
  const [goldBalance, setGoldBalance] = useState(0)
  const [connection, setConnection] = useState<Connection | null>(null)
  const [isPhantomInstalled, setIsPhantomInstalled] = useState(false)
  const { toast } = useToast()
  const { network, goldTokenAddress } = useNetwork()

  // Initialize connection and check for wallet
  useEffect(() => {
    // Skip if not in browser
    if (typeof window === "undefined") return

    const endpoint = network === "mainnet" ? "https://api.mainnet-beta.solana.com" : "https://api.devnet.solana.com"
    const conn = new Connection(endpoint, "confirmed")
    setConnection(conn)

    // Check if Phantom is installed
    const checkForPhantom = () => {
      console.log("Checking for Phantom wallet...")
      const isPhantomAvailable = window.solana && window.solana.isPhantom
      console.log("Phantom available:", isPhantomAvailable)
      setIsPhantomInstalled(isPhantomAvailable)

      if (isPhantomAvailable) {
        // Set up event listeners for Phantom
        console.log("Setting up Phantom event listeners")

        // Listen for connection events
        window.solana.on("connect", (publicKey: PublicKey) => {
          console.log("Phantom connected event received:", publicKey.toString())
          setPublicKey(publicKey)
          setAddress(publicKey.toString())
          setConnected(true)
          setConnecting(false)
          fetchBalances(conn, publicKey.toString())

          toast({
            title: "Wallet Connected",
            description: "Your wallet has been successfully connected.",
          })
        })

        // Listen for disconnect events
        window.solana.on("disconnect", () => {
          console.log("Phantom disconnected event received")
          setPublicKey(null)
          setAddress(null)
          setConnected(false)
          setSolBalance(0)
          setGoldBalance(0)

          toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected.",
          })
        })

        // Check if already connected
        if (window.solana.isConnected && window.solana.publicKey) {
          console.log("Phantom already connected:", window.solana.publicKey.toString())
          const publicKey = window.solana.publicKey
          setPublicKey(publicKey)
          setAddress(publicKey.toString())
          setConnected(true)
          fetchBalances(conn, publicKey.toString())
        }
      }
    }

    // Run the check with a slight delay to ensure window.solana is available
    setTimeout(checkForPhantom, 100)

    // Cleanup
    return () => {
      // No cleanup needed for event listeners as they're managed by Phantom
    }
  }, [network, goldTokenAddress, toast])

  // Fetch balances
  const fetchBalances = async (conn: Connection, walletAddress: string) => {
    try {
      console.log("Fetching SOL balance for address:", walletAddress)
      const solBal = await getSOLBalance(conn, walletAddress)
      console.log("SOL balance fetched:", solBal)
      setSolBalance(solBal)

      console.log("Fetching GOLD balance for address:", walletAddress)
      const goldBal = await getGOLDBalance(conn, walletAddress, network)
      console.log("GOLD balance fetched:", goldBal)
      setGoldBalance(goldBal)
    } catch (error) {
      console.error("Error fetching balances:", error)
      // Ensure we set balances to 0 on error
      setSolBalance(0)
      setGoldBalance(0)
    }
  }

  // Refresh balances
  const refreshBalance = async () => {
    if (connected && address && connection) {
      await fetchBalances(connection, address)
    }
  }

  // Connect wallet
  const connect = async () => {
    try {
      console.log("Connect function called in context")
      setConnecting(true)

      // Check if we're in a browser environment
      if (typeof window === "undefined") {
        setConnecting(false)
        return { success: false }
      }

      // Check if Phantom is installed
      if (!window.solana || !window.solana.isPhantom) {
        console.log("Phantom not installed")
        setConnecting(false)

        // Show a toast notification
        toast({
          title: "Wallet Not Found",
          description: "Please install Phantom wallet to connect",
          variant: "destructive",
        })

        // Open Phantom website in a new tab
        window.open("https://phantom.app/", "_blank")
        return { success: false }
      }

      console.log("Requesting connection from Phantom...")

      // Directly connect to Phantom
      const response = await window.solana.connect()
      console.log("Connection response:", response)

      // The actual connection will be handled by the event listener
      // but we can also update state here for faster UI response
      if (response && response.publicKey) {
        setPublicKey(response.publicKey)
        setAddress(response.publicKey.toString())
        setConnected(true)
        if (connection) {
          fetchBalances(connection, response.publicKey.toString())
        }
      }

      setConnecting(false)
      return { success: true }
    } catch (error: any) {
      console.error("Failed to connect wallet:", error)
      setConnecting(false)

      // Check if the error is due to user rejection
      if (
        error.message &&
        (error.message.includes("User rejected") ||
          error.message.includes("user rejected") ||
          error.message.includes("User canceled"))
      ) {
        console.log("User rejected wallet connection")
        // Don't show an error toast for user rejection
        return { success: false, rejected: true }
      }

      // Show error toast for other errors
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to wallet",
        variant: "destructive",
      })

      return { success: false }
    }
  }

  // Disconnect wallet
  const disconnect = async () => {
    try {
      if (window.solana) {
        await window.solana.disconnect()

        // Manually update state for immediate UI response
        setPublicKey(null)
        setAddress(null)
        setConnected(false)
        setSolBalance(0)
        setGoldBalance(0)
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
      toast({
        title: "Disconnect Failed",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Send transaction
  const sendTransaction = async (transaction: any) => {
    if (!connected) {
      throw new Error("Wallet not connected")
    }

    try {
      // Sign and send transaction
      const signature = await window.solana.signAndSendTransaction(transaction)
      return signature
    } catch (error: any) {
      console.error("Transaction error:", error)

      // Check if the error is due to user rejection
      if (
        error.message &&
        (error.message.includes("User rejected") ||
          error.message.includes("user rejected") ||
          error.message.includes("User canceled"))
      ) {
        throw new Error("Transaction was rejected by user")
      }

      throw new Error(error.message || "Failed to send transaction")
    }
  }

  const value = {
    connected,
    connecting,
    address,
    publicKey,
    solBalance,
    goldBalance,
    connection,
    connect,
    disconnect,
    refreshBalance,
    sendTransaction,
    isPhantomInstalled,
  }

  return <SolanaWalletContext.Provider value={value}>{children}</SolanaWalletContext.Provider>
}

// Add this to make TypeScript happy with the window.solana property
declare global {
  interface Window {
    solana?: any
  }
}
