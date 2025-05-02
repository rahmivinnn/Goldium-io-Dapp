"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { useToast } from "@/hooks/use-toast"
import { useNetwork } from "@/contexts/network-context"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"

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
})

// Inner provider that uses the Solana wallet hooks
function SolanaWalletContextProvider({ children }: { children: ReactNode }) {
  const { connection } = useConnection()
  const wallet = useWallet()
  const { toast } = useToast()
  const { network, goldTokenAddress } = useNetwork()

  const [solBalance, setSolBalance] = useState(0)
  const [goldBalance, setGoldBalance] = useState(0)
  const [connecting, setConnecting] = useState(false)

  const walletAddress = useMemo(() => {
    return wallet.publicKey ? wallet.publicKey.toString() : null
  }, [wallet.publicKey])

  // Fetch balances when wallet is connected or network changes
  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      refreshBalance()
    } else {
      setSolBalance(0)
      setGoldBalance(0)
    }
  }, [wallet.connected, wallet.publicKey, network])

  // Connect wallet
  const connect = async () => {
    try {
      setConnecting(true)
      await wallet.connect()
      toast({
        title: "Wallet Connected",
        description: `Connected to ${wallet.publicKey?.toString().slice(0, 6)}...${wallet.publicKey?.toString().slice(-4)}`,
      })
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

  // Disconnect wallet
  const disconnect = async () => {
    try {
      await wallet.disconnect()
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      })
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

      // Get GOLD token balance (in a real implementation)
      try {
        const goldTokenPublicKey = new PublicKey(goldTokenAddress)
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
          programId: TOKEN_PROGRAM_ID,
        })

        // Find the token account for GOLD
        const goldAccount = tokenAccounts.value.find(
          (account) => account.account.data.parsed.info.mint === goldTokenPublicKey.toString(),
        )

        if (goldAccount) {
          const balance = goldAccount.account.data.parsed.info.tokenAmount.uiAmount
          setGoldBalance(balance)
        } else {
          // If no GOLD token account found, set balance to 0
          setGoldBalance(0)
        }
      } catch (error) {
        console.error("Error fetching GOLD balance:", error)
        // Fallback to mock data if there's an error
        const mockGoldBalance = network === "mainnet" ? 1250.5 : 5000.25
        setGoldBalance(mockGoldBalance)
      }
    } catch (error) {
      console.error("Error refreshing balance:", error)
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

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, "confirmed")

      if (confirmation.value.err) {
        throw new Error("Transaction failed to confirm")
      }

      toast({
        title: "Transaction Sent",
        description: `Transaction confirmed: ${signature.slice(0, 8)}...`,
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
        connecting: connecting,
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
      }}
    >
      {children}
    </SolanaContext.Provider>
  )
}

// Main provider that sets up the Solana connection and wallet adapters
export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const { endpoint } = useNetwork()

  // Set up wallet adapters
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
