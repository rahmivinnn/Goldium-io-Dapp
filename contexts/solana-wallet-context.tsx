"use client"

import { createContext, useContext, useEffect, useMemo, useState, useRef, type ReactNode } from "react"
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { WalletModalProvider, useWalletModal } from "@solana/wallet-adapter-react-ui"
import { type PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { useToast } from "@/hooks/use-toast"
import { useNetwork } from "@/contexts/network-context"

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css"

// Define the context type
interface SolanaContextType {
  connected: boolean
  connecting: boolean
  publicKey: PublicKey | null
  walletAddress: string | null
  solBalance: number
  goldBalance: number
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  refreshBalance: () => Promise<void>
  signMessage: (message: Uint8Array) => Promise<Uint8Array | undefined>
  signTransaction: (transaction: any) => Promise<any>
  sendTransaction: (transaction: any) => Promise<string>
  network: string
  openWalletModal: () => void
}

// Create the context
const SolanaContext = createContext<SolanaContextType>({
  connected: false,
  connecting: false,
  publicKey: null,
  walletAddress: null,
  solBalance: 0,
  goldBalance: 0,
  connect: async () => {},
  disconnect: async () => {},
  refreshBalance: async () => {},
  signMessage: async () => undefined,
  signTransaction: async (transaction) => transaction,
  sendTransaction: async () => "",
  network: "testnet",
  openWalletModal: () => {},
})

// Inner provider that uses the Solana wallet hooks
function SolanaWalletContextProvider({ children }: { children: ReactNode }) {
  const { connection } = useConnection()
  const wallet = useWallet()
  const { setVisible } = useWalletModal()
  const { toast } = useToast()
  const { network, goldTokenAddress } = useNetwork()

  const [solBalance, setSolBalance] = useState(0)
  const [goldBalance, setGoldBalance] = useState(0)
  const [connecting, setConnecting] = useState(false)
  const modalOpenedRef = useRef(false)

  const walletAddress = useMemo(() => {
    return wallet.publicKey ? wallet.publicKey.toString() : null
  }, [wallet.publicKey])

  // Log wallet state for debugging
  useEffect(() => {
    console.log("Wallet state:", {
      connected: wallet.connected,
      connecting: wallet.connecting,
      publicKey: wallet.publicKey?.toString(),
      wallet: wallet.wallet?.adapter.name,
    })
  }, [wallet.connected, wallet.connecting, wallet.publicKey, wallet.wallet])

  // Fetch balances when wallet is connected or network changes
  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      refreshBalance()

      // Show a success toast when connected
      toast({
        title: "Wallet Connected",
        description: `Connected to ${wallet.publicKey.toString().slice(0, 6)}...${wallet.publicKey.toString().slice(-4)}`,
      })

      // Reset modal opened flag when connected
      modalOpenedRef.current = false
    } else {
      setSolBalance(0)
      setGoldBalance(0)
    }
  }, [wallet.connected, wallet.publicKey, network])

  // Connect wallet - now directly uses the wallet adapter's select method
  const connect = async () => {
    try {
      setConnecting(true)

      // This will open the wallet adapter modal
      if (wallet.wallets.length > 0) {
        wallet.select(wallet.wallets[0].adapter.name)
      } else {
        throw new Error("No wallets available")
      }

      // The actual connection happens through the wallet adapter
      // when user confirms in the wallet extension
    } catch (error: any) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: error?.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setConnecting(false)
    }
  }

  // Open wallet modal function - using the wallet adapter's modal
  const openWalletModal = () => {
    // Prevent opening the modal multiple times
    if (modalOpenedRef.current || connecting || wallet.connecting) {
      console.log("Modal already opened or connecting in progress, ignoring request")
      return
    }

    modalOpenedRef.current = true

    // Use the wallet modal directly
    setVisible(true)
  }

  // Disconnect wallet
  const disconnect = async () => {
    try {
      await wallet.disconnect()
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      })

      // Reset modal opened flag when disconnected
      modalOpenedRef.current = false
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
  }

  // Refresh balances
  const refreshBalance = async () => {
    if (!wallet.publicKey) return

    try {
      // Get SOL balance
      const solBalanceRaw = await connection.getBalance(wallet.publicKey)
      setSolBalance(solBalanceRaw / LAMPORTS_PER_SOL)

      // For demo purposes, set a mock GOLD balance
      // In a real implementation, you would fetch the actual token balance
      const mockGoldBalance = network === "mainnet" ? 1250.5 : 5000.25
      setGoldBalance(mockGoldBalance)
    } catch (error) {
      console.error("Error refreshing balance:", error)
      // Set fallback values if there's an error
      setSolBalance(0)
      setGoldBalance(5000) // Demo value
    }
  }

  // Sign message
  const signMessage = async (message: Uint8Array) => {
    if (!wallet.signMessage) {
      toast({
        title: "Wallet Error",
        description: "Your wallet doesn't support message signing",
        variant: "destructive",
      })
      return undefined
    }

    try {
      return await wallet.signMessage(message)
    } catch (error: any) {
      console.error("Error signing message:", error)
      toast({
        title: "Signing Failed",
        description: error?.message || "Failed to sign message",
        variant: "destructive",
      })
      return undefined
    }
  }

  // Sign transaction
  const signTransaction = async (transaction: any) => {
    if (!wallet.signTransaction) {
      toast({
        title: "Wallet Error",
        description: "Your wallet doesn't support transaction signing",
        variant: "destructive",
      })
      throw new Error("Wallet doesn't support transaction signing")
    }

    try {
      return await wallet.signTransaction(transaction)
    } catch (error: any) {
      console.error("Error signing transaction:", error)
      toast({
        title: "Signing Failed",
        description: error?.message || "Failed to sign transaction",
        variant: "destructive",
      })
      throw error
    }
  }

  // Send transaction
  const sendTransaction = async (transaction: any) => {
    if (!wallet.sendTransaction) {
      toast({
        title: "Wallet Error",
        description: "Your wallet doesn't support sending transactions",
        variant: "destructive",
      })
      throw new Error("Wallet doesn't support sending transactions")
    }

    try {
      const signature = await wallet.sendTransaction(transaction, connection)

      toast({
        title: "Transaction Sent",
        description: `Transaction sent: ${signature.slice(0, 8)}...`,
      })

      return signature
    } catch (error: any) {
      console.error("Error sending transaction:", error)
      toast({
        title: "Transaction Failed",
        description: error?.message || "Failed to send transaction",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <SolanaContext.Provider
      value={{
        connected: wallet.connected,
        connecting: connecting || wallet.connecting,
        publicKey: wallet.publicKey,
        walletAddress,
        solBalance,
        goldBalance,
        connect,
        disconnect,
        refreshBalance,
        signMessage,
        signTransaction,
        sendTransaction,
        network,
        openWalletModal,
      }}
    >
      {children}
    </SolanaContext.Provider>
  )
}

// Main provider that sets up the Solana connection and wallet adapters
export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const { endpoint } = useNetwork()

  // Set up wallet adapters - using only confirmed available adapters
  const wallets = useMemo(() => {
    return [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
  }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <SolanaWalletContextProvider>{children}</SolanaWalletContextProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

// Hook to use the Solana context
export const useSolanaWallet = () => useContext(SolanaContext)
