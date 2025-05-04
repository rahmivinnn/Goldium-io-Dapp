"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Flame, CheckCircle, AlertCircle, Info } from "lucide-react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { useToast } from "@/hooks/use-toast"
import { PublicKey, Transaction } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID, createBurnInstruction, getAssociatedTokenAddress } from "@solana/spl-token"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getBurnedTokens, recordBurnEvent } from "@/services/token-service"

export function TokenBurn() {
  const { toast } = useToast()
  const { connected, publicKey, sendTransaction, connection, refreshBalance, goldBalance } = useSolanaWallet()
  const { network, goldTokenAddress } = useNetwork()

  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [burnedTokens, setBurnedTokens] = useState({
    total: 0,
    recent: [] as { amount: number; date: string; txSignature: string }[],
  })

  // Fetch burned tokens data
  useEffect(() => {
    const fetchBurnedTokens = async () => {
      const data = await getBurnedTokens(network)
      setBurnedTokens(data)
    }

    fetchBurnedTokens()
  }, [network])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and a single decimal point
    const value = e.target.value
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  const handleMaxClick = () => {
    setAmount(goldBalance.toString())
  }

  const openConfirmDialog = () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to burn tokens",
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

    if (amountValue > goldBalance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough GOLD tokens",
        variant: "destructive",
      })
      return
    }

    setConfirmDialogOpen(true)
  }

  const handleBurn = async () => {
    if (!connected || !publicKey || !connection) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to burn tokens",
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

    if (amountValue > goldBalance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough GOLD tokens",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      setTransactionStatus("pending")
      setConfirmDialogOpen(false)

      // Simulate transaction progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval)
            return prev
          }
          return prev + 10
        })
      }, 500)

      const mintPubkey = new PublicKey(goldTokenAddress)
      const transaction = new Transaction()

      // Get the associated token account for the user
      const tokenAccount = await getAssociatedTokenAddress(mintPubkey, publicKey)

      // Add burn instruction
      transaction.add(
        createBurnInstruction(
          tokenAccount,
          mintPubkey,
          publicKey,
          amountValue * Math.pow(10, 9), // Assuming 9 decimals for GOLD token
          [],
          TOKEN_PROGRAM_ID,
        ),
      )

      // Send transaction
      const signature = await sendTransaction(transaction)
      setTransactionSignature(signature)

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, "confirmed")

      if (confirmation.value.err) {
        throw new Error("Transaction failed to confirm")
      }

      clearInterval(interval)
      setProgress(100)
      setTransactionStatus("success")

      // Record burn event
      await recordBurnEvent(network, amountValue, signature)

      // Refresh burned tokens data
      const data = await getBurnedTokens(network)
      setBurnedTokens(data)

      toast({
        title: "Tokens Burned Successfully",
        description: `${amount} GOLD tokens have been permanently removed from circulation`,
      })

      // Refresh balances
      refreshBalance()

      // Reset form after successful burn
      setAmount("")
    } catch (error: any) {
      console.error("Burn error:", error)
      setTransactionStatus("error")
      toast({
        title: "Burn failed",
        description: error.message || "An error occurred during the burn transaction",
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

  const renderTransactionStatus = () => {
    switch (transactionStatus) {
      case "pending":
        return (
          <div className="flex flex-col items-center gap-4 py-4">
            <Loader2 className="h-12 w-12 animate-spin text-gold" />
            <h3 className="text-lg font-medium">Burning Tokens</h3>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500">Please wait while your tokens are being burned...</p>
          </div>
        )

      case "success":
        return (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-medium">Tokens Burned Successfully</h3>
            <p className="text-sm text-gray-500 text-center">
              {amount} GOLD tokens have been permanently removed from circulation.
            </p>
            <a
              href={getExplorerLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline text-sm"
            >
              View on Solana Explorer
            </a>
            <Button className="mt-2 gold-button" onClick={() => setConfirmDialogOpen(false)}>
              Close
            </Button>
          </div>
        )

      case "error":
        return (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium">Transaction Failed</h3>
            <p className="text-sm text-red-500 text-center">Failed to burn tokens. Please try again.</p>
            <div className="flex gap-3 mt-2">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmDialogOpen(false)}>
                Close
              </Button>
              <Button className="flex-1 gold-button" onClick={handleBurn}>
                Try Again
              </Button>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex flex-col gap-4">
            <p className="text-center">
              You are about to burn <span className="font-bold text-gold">{amount} GOLD</span> tokens.
            </p>
            <Alert variant="destructive" className="bg-red-900/20 border-red-500/30">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This action is irreversible. Burned tokens are permanently removed from circulation.
              </AlertDescription>
            </Alert>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleBurn}>
                <Flame className="mr-2 h-4 w-4" />
                Burn Tokens
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <>
      <Card className="border-gold bg-slate-900/80 backdrop-blur-sm w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl gold-gradient flex items-center gap-2">
            <Flame className="h-6 w-6 text-red-500" />
            Burn GOLD Tokens
          </CardTitle>
          <CardDescription>Permanently remove GOLD tokens from circulation to increase scarcity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-black/40 rounded-lg p-4 border border-gold/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Total Burned</span>
              <span className="font-bold text-red-500">{burnedTokens.total.toLocaleString()} GOLD</span>
            </div>
            <Progress value={(burnedTokens.total / 1000000) * 100} className="h-2 bg-gray-700" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>1,000,000 (Total Supply)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="amount">Amount to Burn</Label>
              <button type="button" onClick={handleMaxClick} className="text-xs text-gold hover:underline">
                MAX
              </button>
            </div>
            <div className="relative">
              <Input
                id="amount"
                placeholder="Enter amount to burn"
                value={amount}
                onChange={handleAmountChange}
                className="bg-slate-800 border-gold/30 focus:border-gold pr-16"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-400">GOLD</span>
              </div>
            </div>
            <div className="text-sm text-gray-400 flex justify-between">
              <span>Balance: {goldBalance.toFixed(4)} GOLD</span>
              {amount && (
                <span>
                  New supply after burn:{" "}
                  <span className="text-gold">
                    {(1000000 - burnedTokens.total - Number(amount || 0)).toLocaleString()}
                  </span>
                </span>
              )}
            </div>
          </div>

          <Alert className="bg-amber-900/20 border-amber-500/30">
            <Info className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-500">Why burn tokens?</AlertTitle>
            <AlertDescription className="text-sm text-gray-300">
              Burning tokens reduces the total supply, potentially increasing the value of remaining tokens. This is a
              deflationary mechanism used in many tokenomics models.
            </AlertDescription>
          </Alert>

          {burnedTokens.recent.length > 0 && (
            <div className="space-y-2">
              <Label>Recent Burns</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                {burnedTokens.recent.map((burn, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm bg-black/30 p-2 rounded border border-red-500/20"
                  >
                    <div className="flex items-center gap-1">
                      <Flame className="h-3 w-3 text-red-500" />
                      <span>{burn.amount.toLocaleString()} GOLD</span>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-xs text-gray-500">{burn.date}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <a
                            href={`${
                              network === "mainnet"
                                ? "https://explorer.solana.com"
                                : "https://explorer.solana.com/?cluster=devnet"
                            }/tx/${burn.txSignature}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs"
                          >
                            View transaction
                          </a>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={openConfirmDialog}
            disabled={!connected || isLoading || !amount || Number.parseFloat(amount) <= 0}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Flame className="mr-2 h-4 w-4" />
                Burn GOLD Tokens
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {transactionStatus === "idle" && "Confirm Token Burn"}
              {transactionStatus === "pending" && "Burning Tokens"}
              {transactionStatus === "success" && "Tokens Burned Successfully"}
              {transactionStatus === "error" && "Burn Failed"}
            </DialogTitle>
            <DialogDescription>
              {transactionStatus === "idle" &&
                "This action is irreversible. Burned tokens will be permanently removed from circulation."}
            </DialogDescription>
          </DialogHeader>
          {renderTransactionStatus()}
        </DialogContent>
      </Dialog>
    </>
  )
}
