"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { WalletModalProvider, useWalletModal } from "@solana/wallet-adapter-react-ui"
import { PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram } from "@solana/web3.js"
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccount,
  createTransferInstruction,
} from "@solana/spl-token"
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
  goldTokenAddress: string | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  refreshBalance: () => Promise<void>
  signMessage: (message: Uint8Array) => Promise<Uint8Array | undefined>
  signTransaction: (transaction: any) => Promise<any>
  sendTransaction: (transaction: any) => Promise<string>
  transferSOL: (recipient: string, amount: number) => Promise<string | null>
  transferGOLD: (recipient: string, amount: number) => Promise<string | null>
  network: string
  openWalletModal: () => void
  isTransacting: boolean
  walletProviderName: string | null
}

// Create the context
const SolanaContext = createContext<SolanaContextType>({
  connected: false,
  connecting: false,
  publicKey: null,
  walletAddress: null,
  solBalance: 0,
  goldBalance: 0,
  goldTokenAddress: null,
  connect: async () => {},
  disconnect: async () => {},
  refreshBalance: async () => {},
  signMessage: async () => undefined,
  signTransaction: async (transaction) => transaction,
  sendTransaction: async () => "",
  transferSOL: async () => null,
  transferGOLD: async () => null,
  network: "testnet",
  openWalletModal: () => {},
  isTransacting: false,
  walletProviderName: null,
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
  const [isTransacting, setIsTransacting] = useState(false)
  const [modalOpenedRef] = useState(false)

  const walletAddress = useMemo(() => {
    const address = wallet.publicKey ? wallet.publicKey.toString() : null
    console.log("walletAddress updated:", address)
    return address
  }, [wallet.publicKey])

  const walletProviderName = useMemo(() => {
    return wallet.wallet?.adapter.name || null
  }, [wallet.wallet])

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
      console.log("Wallet connected with address:", wallet.publicKey.toString())
      console.log("Current walletAddress state:", walletAddress)
      refreshBalance()

      // Show a success toast when connected
      toast({
        title: "Wallet Connected",
        description: `Connected to ${wallet.publicKey.toString().slice(0, 6)}...${wallet.publicKey.toString().slice(-4)}`,
      })

      // Reset modal opened flag when connected
    } else {
      setSolBalance(0)
      setGoldBalance(0)
    }
  }, [wallet.connected, wallet.publicKey, network, walletAddress])

  // Tambahkan useEffect khusus untuk memantau perubahan publicKey:
  useEffect(() => {
    if (wallet.publicKey) {
      console.log("Public key updated:", wallet.publicKey.toString())
    }
  }, [wallet.publicKey])

  // Connect wallet - now directly uses the wallet adapter's select method
  const connectDirectlyToPhantom = async () => {
    try {
      setConnecting(true)

      // Coba gunakan API Phantom baru
      if (window.phantom?.solana) {
        const resp = await window.phantom.solana.connect()
        console.log("Connected with Phantom new API:", resp)
        return true
      }
      // Coba gunakan API Phantom lama
      else if (window.solana?.isPhantom) {
        const resp = await window.solana.connect()
        console.log("Connected with Phantom old API:", resp)
        return true
      }

      return false
    } catch (error) {
      console.error("Error connecting directly to Phantom:", error)
      return false
    } finally {
      setConnecting(false)
    }
  }

  // Connect wallet - mencoba terhubung langsung ke Phantom terlebih dahulu
  const connect = async () => {
    try {
      setConnecting(true)

      // Coba terhubung langsung ke Phantom
      const phantomConnected = await connectDirectlyToPhantom()

      // Jika gagal, buka wallet adapter modal
      if (!phantomConnected) {
        openWalletModal()
      }
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
    if (modalOpenedRef || connecting || wallet.connecting) {
      console.log("Modal already opened or connecting in progress, ignoring request")
      return
    }

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

      // Get GOLD token balance if goldTokenAddress is available
      if (goldTokenAddress) {
        try {
          const goldTokenPublicKey = new PublicKey(goldTokenAddress)
          const tokenAccountAddress = await getAssociatedTokenAddress(goldTokenPublicKey, wallet.publicKey)

          try {
            const tokenAccount = await getAccount(connection, tokenAccountAddress)
            setGoldBalance(Number(tokenAccount.amount) / Math.pow(10, 9)) // Assuming 9 decimals
          } catch (error) {
            // Token account doesn't exist yet, which means balance is 0
            setGoldBalance(0)
          }
        } catch (error) {
          console.error("Error fetching GOLD balance:", error)

          // For development, set a mock balance
          if (process.env.NODE_ENV === "development") {
            setGoldBalance(5000)
          } else {
            setGoldBalance(0)
          }
        }
      } else {
        // For development, set a mock balance
        if (process.env.NODE_ENV === "development") {
          setGoldBalance(5000)
        } else {
          setGoldBalance(0)
        }
      }
    } catch (error) {
      console.error("Error refreshing balance:", error)
      // Set fallback values if there's an error
      setSolBalance(0)

      // For development, set a mock balance
      if (process.env.NODE_ENV === "development") {
        setGoldBalance(5000)
      } else {
        setGoldBalance(0)
      }
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
  const signTransaction = async (transaction: Transaction) => {
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
  const sendTransaction = async (transaction: Transaction) => {
    if (!wallet.sendTransaction) {
      toast({
        title: "Wallet Error",
        description: "Your wallet doesn't support sending transactions",
        variant: "destructive",
      })
      throw new Error("Wallet doesn't support sending transactions")
    }

    try {
      setIsTransacting(true)
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
    } finally {
      setIsTransacting(false)
    }
  }

  // Transfer SOL to another wallet
  const transferSOL = async (recipient: string, amount: number): Promise<string | null> => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to transfer SOL",
        variant: "destructive",
      })
      return null
    }

    try {
      setIsTransacting(true)
      const recipientPublicKey = new PublicKey(recipient)
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: recipientPublicKey,
          lamports: amount * LAMPORTS_PER_SOL,
        }),
      )

      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = wallet.publicKey

      // Sign and send the transaction
      const signature = await sendTransaction(transaction)

      // Wait for confirmation
      await connection.confirmTransaction(signature)

      // Refresh balance after transfer
      await refreshBalance()

      toast({
        title: "Transfer Successful",
        description: `Successfully transferred ${amount} SOL to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
      })

      return signature
    } catch (error: any) {
      console.error("Error transferring SOL:", error)
      toast({
        title: "Transfer Failed",
        description: error?.message || "Failed to transfer SOL",
        variant: "destructive",
      })
      return null
    } finally {
      setIsTransacting(false)
    }
  }

  // Transfer GOLD tokens to another wallet
  const transferGOLD = async (recipient: string, amount: number): Promise<string | null> => {
    if (!wallet.publicKey || !wallet.signTransaction || !goldTokenAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to transfer GOLD tokens",
        variant: "destructive",
      })
      return null
    }

    try {
      setIsTransacting(true)
      const recipientPublicKey = new PublicKey(recipient)
      const goldTokenPublicKey = new PublicKey(goldTokenAddress)

      // Get the sender's token account
      const senderTokenAccount = await getAssociatedTokenAddress(goldTokenPublicKey, wallet.publicKey)

      // Get or create the recipient's token account
      const recipientTokenAccount = await getAssociatedTokenAddress(goldTokenPublicKey, recipientPublicKey)

      // Check if recipient token account exists
      const transaction = new Transaction()

      try {
        await getAccount(connection, recipientTokenAccount)
      } catch (error) {
        // If the account doesn't exist, create it
        transaction.add(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey, // payer
            recipientTokenAccount, // associated token account address
            recipientPublicKey, // owner
            goldTokenPublicKey, // mint
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID,
          ),
        )
      }

      // Add transfer instruction
      transaction.add(
        createTransferInstruction(
          senderTokenAccount, // source
          recipientTokenAccount, // destination
          wallet.publicKey, // owner
          amount * Math.pow(10, 9), // amount, assuming 9 decimals
          [],
          TOKEN_PROGRAM_ID,
        ),
      )

      // Get the latest blockhash
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = wallet.publicKey

      // Sign and send the transaction
      const signature = await sendTransaction(transaction)

      // Wait for confirmation
      await connection.confirmTransaction(signature)

      // Refresh balance after transfer
      await refreshBalance()

      toast({
        title: "Transfer Successful",
        description: `Successfully transferred ${amount} GOLD to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
      })

      return signature
    } catch (error: any) {
      console.error("Error transferring GOLD:", error)
      toast({
        title: "Transfer Failed",
        description: error?.message || "Failed to transfer GOLD tokens",
        variant: "destructive",
      })
      return null
    } finally {
      setIsTransacting(false)
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
        goldTokenAddress,
        connect,
        disconnect,
        refreshBalance,
        signMessage,
        signTransaction,
        sendTransaction,
        transferSOL,
        transferGOLD,
        network,
        openWalletModal,
        isTransacting,
        walletProviderName,
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
