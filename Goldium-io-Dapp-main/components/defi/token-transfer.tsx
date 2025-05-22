"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { useToast } from "@/hooks/use-toast"
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import {
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token"
import { TokenCAService } from "@/services/token-ca-service"

export function TokenTransfer() {
  const { toast } = useToast()
  const { connected, publicKey, sendTransaction, connection, refreshBalance, solBalance, goldBalance } =
    useSolanaWallet()
  const { network, goldTokenAddress } = useNetwork()

  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null)
  const [isValidAddress, setIsValidAddress] = useState(false)
  const [tokenType, setTokenType] = useState<"GOLD" | "SOL">("GOLD")

  // Validate recipient address
  useEffect(() => {
    try {
      if (recipient.trim()) {
        new PublicKey(recipient)
        setIsValidAddress(true)
      } else {
        setIsValidAddress(false)
      }
    } catch (error) {
      setIsValidAddress(false)
    }
  }, [recipient])

  // Reset transaction status when changing inputs
  useEffect(() => {
    if (transactionStatus !== "idle") {
      setTransactionStatus("idle")
      setTransactionSignature(null)
    }
  }, [recipient, amount, tokenType, tokenCA])

  // No need for token CA validation anymore

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and a single decimal point
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const handleMaxClick = () => {
    if (tokenType === "GOLD") {
      setAmount(goldBalance.toString())
    } else if (tokenType === "SOL") {
      // Leave some SOL for transaction fees
      const maxSol = Math.max(0, solBalance - 0.01)
      setAmount(maxSol > 0 ? maxSol.toString() : "0")
    } else if (tokenType === "CA" && tokenBalance !== null) {
      setAmount(tokenBalance.toString())
    }
  }

  const handleTransfer = async () => {
    if (!connected || !publicKey || !connection) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to transfer tokens",
        variant: "destructive",
      })
      return
    }

    if (!isValidAddress) {
      toast({
        title: "Invalid recipient address",
        description: "Please enter a valid Solana address",
        variant: "destructive",
      })
      return
    }

    const amountValue = Number.parseFloat(amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      })
      return
    }

    if (tokenType === "GOLD" && amountValue > goldBalance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough GOLD tokens",
        variant: "destructive",
      })
      return
    }

    if (tokenType === "SOL" && amountValue > solBalance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough SOL",
        variant: "destructive",
      })
      return
    }

    if (tokenType === "CA") {
      if (!isValidCA) {
        toast({
          title: "Invalid token address",
          description: "Please enter a valid token contract address",
          variant: "destructive",
        })
        return
      }
      if (tokenBalance === null || amountValue > tokenBalance) {
        toast({
          title: "Insufficient balance",
          description: "You don't have enough tokens",
          variant: "destructive",
        })
        return
      }
    }

    try {
      setIsLoading(true)
      setTransactionStatus("pending")

      const recipientPubkey = new PublicKey(recipient)
      const transaction = new Transaction()

      if (tokenType === "SOL") {
        // Transfer SOL
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recipientPubkey,
            lamports: amountValue * LAMPORTS_PER_SOL,
          }),
        )
      } else {
        const tokenService = new TokenCAService(connection)
        const tokenAddress = tokenType === "GOLD" ? goldTokenAddress : tokenCA
        const decimals = tokenType === "GOLD" ? 9 : tokenDecimals

        // Get transfer instructions
        const instructions = await tokenService.prepareTokenTransfer(
          tokenAddress,
          publicKey,
          recipient,
          amountValue,
          decimals
        )

        // Add all instructions to transaction
        transaction.add(...instructions)
      }

      // Send transaction
      const signature = await sendTransaction(transaction)
      setTransactionSignature(signature)

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, "confirmed")

      if (confirmation.value.err) {
        throw new Error("Transaction failed to confirm")
      }

      setTransactionStatus("success")
      toast({
        title: "Transfer successful",
        description: `${amount} ${tokenType} transferred successfully`,
      })

      // Refresh balances
      refreshBalance()

      // Reset form after successful transfer
      setAmount("")
      setRecipient("")
    } catch (error: any) {
      console.error("Transfer error:", error)
      setTransactionStatus("error")
      toast({
        title: "Transfer failed",
        description: error.message || "An error occurred during the transfer",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getExplorerLink = () => {
    if (!transactionSignature) return "#"

    const baseUrl =
      network === "mainnet" ? "https://explorer.solana.com" : "https://explorer.solana.com/?cluster=devnet"

    return `${baseUrl}/tx/${transactionSignature}`
  }

  return (
    <Card className="border-gold bg-slate-900/80 backdrop-blur-sm w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl gold-gradient">Transfer Tokens</CardTitle>
        <CardDescription>Send GOLD tokens or SOL to another wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token-type">Token</Label>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={tokenType === "GOLD" ? "default" : "outline"}
                className={tokenType === "GOLD" ? "gold-button" : "border-gold text-gold hover:bg-gold/10"}
                onClick={() => setTokenType("GOLD")}
              >
                GOLD
              </Button>
              <Button
                type="button"
                variant={tokenType === "SOL" ? "default" : "outline"}
                className={tokenType === "SOL" ? "gold-button" : "border-gold text-gold hover:bg-gold/10"}
                onClick={() => setTokenType("SOL")}
              >
                SOL
              </Button>
          </div>
          <div className="text-sm text-gray-400">
            Balance: {tokenType === "GOLD" ? goldBalance.toFixed(4) : solBalance.toFixed(4)} {tokenType}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="recipient">Recipient Address</Label>
          <Input
            id="recipient"
            placeholder="Enter Solana address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className={`bg-slate-800 border-gold/30 focus:border-gold ${
              recipient && !isValidAddress ? "border-red-500" : ""
            }`}
          />
          {recipient && !isValidAddress && <p className="text-red-500 text-sm">Please enter a valid Solana address</p>}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="amount">Amount</Label>
            <button type="button" onClick={handleMaxClick} className="text-xs text-gold hover:underline">
              MAX
            </button>
          </div>
          <Input
            id="amount"
            placeholder={`Enter amount in ${tokenType}`}
            value={amount}
            onChange={handleAmountChange}
            className="bg-slate-800 border-gold/30 focus:border-gold"
          />
        </div>

        {transactionStatus === "success" && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-md p-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <p className="text-green-500 font-medium">Transfer successful!</p>
              <a
                href={getExplorerLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-400 hover:underline"
              >
                View on Solana Explorer
              </a>
            </div>
          </div>
        )}

        {transactionStatus === "error" && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-md p-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-500">Transfer failed. Please try again.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleTransfer}
          disabled={!connected || isLoading || !isValidAddress || !amount || Number.parseFloat(amount) <= 0}
          className="gold-button w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Transfer {tokenType} <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
