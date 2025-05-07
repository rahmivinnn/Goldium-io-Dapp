"use client"

import { useState } from "react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Send, AlertCircle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Connection, PublicKey, Transaction } from "@solana/web3.js"
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import confetti from "canvas-confetti"
import { isValidSolanaAddress } from "@/lib/utils"

// Sound effect for successful transfer
const successSound = typeof window !== "undefined" ? new Audio("/sounds/transfer-complete.mp3") : null

export function TokenTransfer() {
  const { connected, address, goldBalance, refreshBalance, walletType } = useSolanaWallet()
  const { networkConfig, network } = useNetwork()
  const { toast } = useToast()
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [isTransferring, setIsTransferring] = useState(false)
  const [transferStatus, setTransferStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null)

  // Validate form
  const isFormValid = () => {
    if (!recipient || !amount) return false
    if (!isValidSolanaAddress(recipient)) return false
    
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) return false
    if (goldBalance !== null && amountNum > goldBalance) return false
    
    return true
  }

  // Play success animation and sound
  const playSuccessEffects = () => {
    // Play confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    
    // Play sound
    if (successSound) {
      successSound.currentTime = 0
      successSound.play().catch(e => console.error("Error playing sound:", e))
    }
  }

  // Handle transfer
  const handleTransfer = async () => {
    if (!connected || !address || !isFormValid()) return
    
    setIsTransferring(true)
    setTransferStatus("loading")
    
    try {
      // In a real implementation, this would create and send a token transfer transaction
      // For this demo, we'll simulate a successful transfer
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Generate a fake transaction signature
      const fakeSignature = Array.from({ length: 64 }, () => 
        "0123456789abcdef"[Math.floor(Math.random() * 16)]
      ).join("")
      
      setTransactionSignature(fakeSignature)
      setTransferStatus("success")
      
      // Refresh balance
      await refreshBalance()
      
      // Show success toast
      toast({
        title: "Transfer Successful",
        description: `${amount} GOLD tokens have been sent to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
      })
      
      // Play success effects
      playSuccessEffects()
      
      // Reset form after a delay
      setTimeout(() => {
        setRecipient("")
        setAmount("")
        setTransferStatus("idle")
        setTransactionSignature(null)
      }, 5000)
    } catch (error) {
      console.error("Error transferring GOLD tokens:", error)
      
      setTransferStatus("error")
      
      toast({
        title: "Transfer Failed",
        description: "Failed to transfer GOLD tokens. Please try again later.",
        variant: "destructive",
      })
      
      // Reset status after a delay
      setTimeout(() => {
        setTransferStatus("idle")
      }, 3000)
    } finally {
      setIsTransferring(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          Transfer GOLD Tokens
        </CardTitle>
        <CardDescription>
          Send GOLD tokens to another wallet address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="Enter Solana wallet address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isTransferring || transferStatus === "success"}
              className={
                recipient && !isValidSolanaAddress(recipient)
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {recipient && !isValidSolanaAddress(recipient) && (
              <p className="text-xs text-red-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                Invalid Solana address
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="amount">Amount</Label>
              {goldBalance !== null && (
                <span className="text-xs text-muted-foreground">
                  Balance: {goldBalance.toLocaleString()} GOLD
                </span>
              )}
            </div>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount to send"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isTransferring || transferStatus === "success"}
              min="0"
              step="0.01"
              className={
                amount && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0 || (goldBalance !== null && parseFloat(amount) > goldBalance))
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
              }
            />
            {amount && (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) && (
              <p className="text-xs text-red-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                Amount must be greater than 0
              </p>
            )}
            {amount && goldBalance !== null && parseFloat(amount) > goldBalance && (
              <p className="text-xs text-red-500 flex items-center mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                Insufficient balance
              </p>
            )}
          </div>
          
          {transferStatus === "success" && transactionSignature && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
              <div className="flex items-center text-green-600 dark:text-green-400 mb-1">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Transfer Successful</span>
              </div>
              <a
                href={`${networkConfig.explorerUrl}/tx/${transactionSignature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline break-all"
              >
                View on Solana Explorer
              </a>
            </div>
          )}
          
          {transferStatus === "error" && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
              <div className="flex items-center text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Transfer Failed</span>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Please check your inputs and try again.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={handleTransfer}
          disabled={!connected || isTransferring || !isFormValid() || transferStatus === "success"}
        >
          {isTransferring ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Transferring...
            </>
          ) : transferStatus === "success" ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Transfer Complete
            </>
          ) : !connected ? (
            "Connect Wallet First"
          ) : (
            "Send GOLD Tokens"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
