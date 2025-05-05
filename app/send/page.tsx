"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Connection, PublicKey, Transaction } from "@solana/web3.js"
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNetworkConfig } from "@/hooks/use-network-config"

// GOLD token mint address
const GOLD_TOKEN_MINT = new PublicKey("APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump")

export default function SendPage() {
  const { publicKey, signTransaction, connected } = useWallet()
  const { toast } = useToast()
  const { endpoint, network } = useNetworkConfig()

  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [goldBalance, setGoldBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [connection, setConnection] = useState<Connection | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<
    Array<{
      signature: string
      recipient: string
      amount: number
      timestamp: number
    }>
  >([])

  // Initialize connection and fetch data
  useEffect(() => {
    if (!connected || !publicKey) return

    const initConnection = async () => {
      try {
        setIsLoading(true)
        const conn = new Connection(endpoint, "confirmed")
        setConnection(conn)

        // Fetch GOLD balance
        await fetchGoldBalance(conn, publicKey)

        // Load recent transactions from localStorage
        loadRecentTransactions()

        setIsLoading(false)
      } catch (error) {
        console.error("Error initializing:", error)
        toast({
          title: "Connection Error",
          description: "Failed to connect to the Solana network",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    initConnection()
  }, [connected, publicKey, endpoint])

  // Fetch GOLD token balance
  const fetchGoldBalance = async (conn: Connection, walletPubkey: PublicKey) => {
    try {
      // Get associated token account
      const tokenAccount = await getAssociatedTokenAddress(GOLD_TOKEN_MINT, walletPubkey)

      try {
        // Fetch token account info
        const tokenAccountInfo = await conn.getAccountInfo(tokenAccount)

        if (tokenAccountInfo) {
          // Parse token account data
          const data = Buffer.from(tokenAccountInfo.data)
          // Amount is at offset 64, 8 bytes
          const amountRaw = data.readBigUint64LE(64)
          const amount = Number(amountRaw) / 1e9 // Convert from lamports to GOLD
          setGoldBalance(amount)
        } else {
          setGoldBalance(0)
        }
      } catch (error) {
        console.error("Error fetching token account:", error)
        setGoldBalance(0)
      }
    } catch (error) {
      console.error("Error fetching GOLD balance:", error)
      setGoldBalance(0)
    }
  }

  // Load recent transactions from localStorage
  const loadRecentTransactions = () => {
    try {
      const storedTransactions = localStorage.getItem("goldium_recent_transactions")
      if (storedTransactions) {
        setRecentTransactions(JSON.parse(storedTransactions))
      }
    } catch (error) {
      console.error("Error loading recent transactions:", error)
    }
  }

  // Save transaction to recent transactions
  const saveTransaction = (signature: string, recipient: string, amount: number) => {
    try {
      const newTransaction = {
        signature,
        recipient,
        amount,
        timestamp: Date.now(),
      }

      const updatedTransactions = [newTransaction, ...recentTransactions].slice(0, 5)
      setRecentTransactions(updatedTransactions)
      localStorage.setItem("goldium_recent_transactions", JSON.stringify(updatedTransactions))
    } catch (error) {
      console.error("Error saving transaction:", error)
    }
  }

  // Handle send
  const handleSend = async () => {
    if (!connected || !publicKey || !signTransaction || !connection) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to send GOLD tokens",
        variant: "destructive",
      })
      return
    }

    if (!recipient) {
      toast({
        title: "Invalid Recipient",
        description: "Please enter a valid recipient address",
        variant: "destructive",
      })
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to send",
        variant: "destructive",
      })
      return
    }

    if (Number.parseFloat(amount) > goldBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough GOLD tokens",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSending(true)

      // Parse recipient address
      let recipientPubkey: PublicKey
      try {
        recipientPubkey = new PublicKey(recipient)
      } catch (error) {
        toast({
          title: "Invalid Address",
          description: "The recipient address is not valid",
          variant: "destructive",
        })
        setIsSending(false)
        return
      }

      // Get source token account
      const sourceTokenAccount = await getAssociatedTokenAddress(GOLD_TOKEN_MINT, publicKey)

      // Get destination token account
      const destinationTokenAccount = await getAssociatedTokenAddress(GOLD_TOKEN_MINT, recipientPubkey)

      // Create transaction
      const transaction = new Transaction()

      // Check if destination token account exists
      const destinationAccountInfo = await connection.getAccountInfo(destinationTokenAccount)

      if (!destinationAccountInfo) {
        // Create associated token account for recipient
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey, // payer
            destinationTokenAccount, // associated token account
            recipientPubkey, // owner
            GOLD_TOKEN_MINT, // mint
          ),
        )
      }

      // Convert amount to lamports
      const amountLamports = BigInt(Math.floor(Number.parseFloat(amount) * 1e9))

      // Add transfer instruction
      transaction.add(
        createTransferInstruction(
          sourceTokenAccount, // source
          destinationTokenAccount, // destination
          publicKey, // owner
          amountLamports, // amount
        ),
      )

      // Set recent blockhash
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      transaction.feePayer = publicKey

      // Sign and send transaction
      const signedTransaction = await signTransaction(transaction)
      const signature = await connection.sendRawTransaction(signedTransaction.serialize())

      // Wait for confirmation
      await connection.confirmTransaction(signature, "confirmed")

      toast({
        title: "Transfer Successful",
        description: `Successfully sent ${amount} GOLD tokens to ${recipient.slice(0, 4)}...${recipient.slice(-4)}`,
      })

      // Save transaction
      saveTransaction(signature, recipient, Number.parseFloat(amount))

      // Refresh balance
      await fetchGoldBalance(connection, publicKey)

      // Reset form
      setRecipient("")
      setAmount("")
    } catch (error) {
      console.error("Error sending tokens:", error)
      toast({
        title: "Transfer Failed",
        description: "Failed to send GOLD tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  // Get explorer URL
  const getExplorerUrl = (signature: string) => {
    const baseUrl = network === "mainnet" ? "https://explorer.solana.com/tx/" : "https://explorer.solana.com/tx/"

    return `${baseUrl}${signature}?cluster=${network}`
  }

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto bg-black/50 border border-yellow-500/30 text-white">
          <CardHeader>
            <CardTitle className="text-center text-yellow-500">Wallet Connection Required</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Please connect your wallet to send GOLD tokens
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <WalletMultiButton />
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
          Send GOLD Tokens
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-black/50 border border-yellow-500/30 text-white">
            <CardHeader>
              <CardTitle className="text-yellow-500">Send Tokens</CardTitle>
              <CardDescription className="text-gray-300">Transfer GOLD tokens to another wallet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-400">Your GOLD Balance</p>
                    <p className="text-2xl font-bold">{goldBalance.toFixed(2)} GOLD</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input
                      id="recipient"
                      placeholder="Enter Solana wallet address"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="bg-black/30 border-yellow-500/30 text-white"
                      disabled={isSending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-black/30 border-yellow-500/30 text-white"
                        disabled={isSending}
                      />
                      <Button
                        variant="outline"
                        className="border-yellow-500/50 text-yellow-500"
                        onClick={() => setAmount(goldBalance.toString())}
                        disabled={isSending || goldBalance <= 0}
                      >
                        MAX
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSend}
                disabled={
                  isLoading ||
                  !recipient ||
                  !amount ||
                  Number.parseFloat(amount) <= 0 ||
                  Number.parseFloat(amount) > goldBalance ||
                  isSending
                }
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send GOLD
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-black/50 border border-yellow-500/30 text-white">
            <CardHeader>
              <CardTitle className="text-yellow-500">Recent Transactions</CardTitle>
              <CardDescription className="text-gray-300">Your recent GOLD token transfers</CardDescription>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No recent transactions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((tx, index) => (
                    <div key={index} className="border border-yellow-500/20 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">Sent {tx.amount.toFixed(2)} GOLD</p>
                          <p className="text-xs text-gray-400">
                            To: {tx.recipient.slice(0, 4)}...{tx.recipient.slice(-4)}
                          </p>
                          <p className="text-xs text-gray-400">{formatTimestamp(tx.timestamp)}</p>
                        </div>
                        <a
                          href={getExplorerUrl(tx.signature)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-yellow-500 hover:text-yellow-400 underline"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-black/50 border border-yellow-500/30 text-white">
          <CardHeader>
            <CardTitle className="text-yellow-500">About GOLD Token Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">How Transfers Work</h3>
                <p className="text-gray-300">
                  GOLD tokens are SPL tokens on the Solana blockchain. When you send tokens, they are transferred
                  directly to the recipient's wallet. Transactions are typically confirmed within seconds.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Transaction Fees</h3>
                <p className="text-gray-300">
                  Sending GOLD tokens requires a small amount of SOL to pay for the transaction fee. Make sure you have
                  some SOL in your wallet to cover these fees.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Security</h3>
                <p className="text-gray-300">
                  Always double-check the recipient address before sending tokens. Blockchain transactions are
                  irreversible, and sent tokens cannot be recovered if sent to the wrong address.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
