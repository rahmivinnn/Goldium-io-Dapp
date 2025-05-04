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
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  refreshBalance: () => Promise<void>
  sendTransaction: (transaction: any) => Promise<string>
}

const SolanaWalletContext = createContext<SolanaWalletContextType>({
  connected: false,
  connecting: false,
  address: null,
  publicKey: null,
  solBalance: 0,
  goldBalance: 0,
  connection: null,
  connect: async () => {},
  disconnect: async () => {},
  refreshBalance: async () => {},
  sendTransaction: async () => "",
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
  const [provider, setProvider] = useState<PhantomProvider | null>(null)
  const { toast } = useToast()
  const { network, goldTokenAddress } = useNetwork()

  // Initialize connection and check for wallet
  useEffect(() => {
    const endpoint = network === "mainnet" ? "https://api.mainnet-beta.solana.com" : "https://api.devnet.solana.com"

    const conn = new Connection(endpoint, "confirmed")
    setConnection(conn)

    const checkForPhantom = () => {
      if ("solana" in window && window.solana?.isPhantom) {
        const provider = window.solana as unknown as PhantomProvider
        setProvider(provider)

        // Check if already connected
        if (provider.isConnected && provider.publicKey) {
          const publicKey = provider.publicKey
          setPublicKey(publicKey)
          setAddress(publicKey.toString())
          setConnected(true)
          fetchBalances(conn, publicKey.toString())
        }

        // Listen for connection events
        provider.on("connect", (publicKey: PublicKey) => {
          setPublicKey(publicKey)
          setAddress(publicKey.toString())
          setConnected(true)
          fetchBalances(conn, publicKey.toString())
        })

        // Listen for disconnect events
        provider.on("disconnect", () => {
          setPublicKey(null)
          setAddress(null)
          setConnected(false)
          setSolBalance(0)
          setGoldBalance(0)
        })
      }
    }

    checkForPhantom()

    // Cleanup
    return () => {
      // No cleanup needed for event listeners as they're managed by Phantom
    }
  }, [network, goldTokenAddress])

  // Fetch balances
  const fetchBalances = async (conn: Connection, walletAddress: string) => {
    try {
      const solBal = await getSOLBalance(conn, walletAddress)
      setSolBalance(solBal)

      const goldBal = await getGOLDBalance(conn, walletAddress, network)
      setGoldBalance(goldBal)
    } catch (error) {
      console.error("Error fetching balances:", error)
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
      setConnecting(true)

      if (!provider) {
        window.open("https://phantom.app/", "_blank")
        toast({
          title: "Phantom Wallet Required",
          description: "Please install Phantom Wallet to connect.",
          variant: "destructive",
        })
        return
      }

      await provider.connect()

      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      })
    } catch (error: any) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnect = async () => {
    try {
      if (provider) {
        await provider.disconnect()
      }

      setConnected(false)
      setPublicKey(null)
      setAddress(null)
      setSolBalance(0)
      setGoldBalance(0)

      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      })
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
    if (!provider || !connected) {
      throw new Error("Wallet not connected")
    }

    try {
      // Sign and send transaction
      const signature = await window.solana.signAndSendTransaction(transaction)
      return signature
    } catch (error: any) {
      console.error("Transaction error:", error)
      throw new Error(error.message || "Failed to send transaction")
    }
  }

  return (
    <SolanaWalletContext.Provider
      value={{
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
      }}
    >
      {children}
    </SolanaWalletContext.Provider>
  )
}

// Add this to make TypeScript happy with the window.solana property
declare global {
  interface Window {
    solana?: any
  }
}
