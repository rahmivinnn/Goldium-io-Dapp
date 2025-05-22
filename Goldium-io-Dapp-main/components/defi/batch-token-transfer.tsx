"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, ArrowRight, CheckCircle, AlertCircle, Plus, Trash2, Info } from "lucide-react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { useToast } from "@/hooks/use-toast"
import { PublicKey, Transaction } from "@solana/web3.js"
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

interface Recipient {
  address: string
  amount: string
  isValidAddress: boolean
}

export function BatchTokenTransfer() {
  const { toast } = useToast()
  const { connected, publicKey, sendTransaction, connection, refreshBalance, goldBalance } = useSolanaWallet()
  const { network, goldTokenAddress } = useNetwork()

  const [recipients, setRecipients] = useState<Recipient[]>([{ address: "", amount: "", isValidAddress: false }])
  const [isLoading, setIsLoading] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState<"idle" | "preparing" | "pending" | "success" | "error">(
    "idle",
  )
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)

  // Calculate total amount whenever recipients change
  useEffect(() => {
    const total = recipients.reduce((sum, recipient) => {
      const amount = Number.parseFloat(recipient.amount) || 0
      return sum + amount
    }, 0)
    setTotalAmount(total)
  }, [recipients])

  // Validate recipient addresses
  const validateAddress = (address: string): boolean => {
    try {
      if (address.trim()) {
        new PublicKey(address)
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  // Handle address change
  const handleAddressChange = (index: number, value: string) => {
    const newRecipients = [...recipients]
    newRecipients[index].address = value
    newRecipients[index].isValidAddress = validateAddress(value)
    setRecipients(newRecipients)
  }

  // Handle amount change
  const handleAmountChange = (index: number, value: string) => {
    // Only allow numbers and a single decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const newRecipients = [...recipients]
      newRecipients[index].amount = value
      setRecipients(newRecipients)
    }
  }

  // Add new recipient row
  const addRecipient = () => {
    setRecipients([...recipients, { address: "", amount: "", isValidAddress: false }])
  }

  // Remove recipient row
  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      const newRecipients = recipients.filter((_, i) => i !== index)
      setRecipients(newRecipients)
    }
  }

  // Distribute evenly
  const distributeEvenly = () => {
    if (recipients.length === 0 || goldBalance <= 0) return

    const evenAmount = (goldBalance / recipients.length).toFixed(4)
    const newRecipients = recipients.map((recipient) => ({
      ...recipient,
      amount: evenAmount,
    }))
    setRecipients(newRecipients)
  }

  // Set all to max
  const setAllToMax = () => {
    if (recipients.length === 0 || goldBalance <= 0) return

    // Calculate how much we can send to each recipient
    const maxPerRecipient = goldBalance
    const newRecipients = recipients.map((recipient, index) => ({
      ...recipient,
      amount: index === 0 ? maxPerRecipient.toString() : "0",
    }))
    setRecipients(newRecipients)
  }

  // Validate all inputs
  const validateInputs = (): string | null => {
    // Check if wallet is connected
    if (!connected || !publicKey || !connection) {
      return "Please connect your wallet to transfer tokens"
    }

    // Check if there are recipients
    if (recipients.length === 0) {
      return "Please add at least one recipient"
    }

    // Check if all addresses are valid
    const invalidAddresses = recipients.filter((r) => !r.isValidAddress && r.address.trim() !== "")
    if (invalidAddresses.length > 0) {
      return "One or more recipient addresses are invalid"
    }

    // Check if all amounts are valid
    const invalidAmounts = recipients.filter(
      (r) => r.address.trim() !== "" && (isNaN(Number.parseFloat(r.amount)) || Number.parseFloat(r.amount) <= 0),
    )
    if (invalidAmounts.length > 0) {
      return "One or more amounts are invalid"
    }

    // Check if total amount exceeds balance
    if (totalAmount > goldBalance) {
      return "Total amount exceeds your GOLD balance"
    }

    // Check if there are any empty rows (except the last one if it's completely empty)
    const emptyRows = recipients.filter(
      (r, i) =>
        (r.address.trim() === "" || r.amount.trim() === "") &&
        !(i === recipients.length - 1 && r.address.trim() === "" && r.amount.trim() === ""),
    )
    if (emptyRows.length > 0) {
      return "Please fill in all recipient details or remove empty rows"
    }

    return null
  }

  // Handle batch transfer
  const handleBatchTransfer = async () => {
    const validationError = validateInputs()
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      setTransactionStatus("preparing")
      setProcessingProgress(10)

      // Filter out empty rows
      const validRecipients = recipients.filter((r) => r.address.trim() !== "" && Number.parseFloat(r.amount) > 0)

      // Create a new transaction
      const transaction = new Transaction()
      const mintPubkey = new PublicKey(goldTokenAddress)

      // Get the sender's token account
      const senderTokenAccount = await getAssociatedTokenAddress(mintPubkey, publicKey!)

      // Process each recipient
      for (let i = 0; i < validRecipients.length; i++) {
        const recipient = validRecipients[i]
        const recipientPubkey = new PublicKey(recipient.address)
        const amount = Number.parseFloat(recipient.amount)

        // Update progress
        setProcessingProgress(10 + Math.floor((i / validRecipients.length) * 40))

        // Get the recipient's token account
        const recipientTokenAccount = await getAssociatedTokenAddress(mintPubkey, recipientPubkey)

        // Check if recipient has a token account, if not create one
        try {
          await connection.getTokenAccountBalance(recipientTokenAccount)
        } catch (error) {
          // Token account doesn't exist, create it
          transaction.add(
            createAssociatedTokenAccountInstruction(publicKey!, recipientTokenAccount, recipientPubkey, mintPubkey),
          )
        }

        // Add transfer instruction
        transaction.add(
          createTransferInstruction(
            senderTokenAccount,
            recipientTokenAccount,
            publicKey!,
            amount * Math.pow(10, 9), // Assuming 9 decimals for GOLD token
            [],
          ),
        )
      }

      setProcessingProgress(50)
      setTransactionStatus("pending")

      // Send transaction
      const signature = await sendTransaction(transaction)
      setTransactionSignature(signature)
      setProcessingProgress(75)

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, "confirmed")
      setProcessingProgress(90)

      if (confirmation.value.err) {
        throw new Error("Transaction failed to confirm")
      }

      setProcessingProgress(100)
      setTransactionStatus("success")
      toast({
        title: "Batch Transfer Successful",
        description: `Successfully sent GOLD to ${validRecipients.length} recipients`,
      })

      // Refresh balances
      refreshBalance()

      // Reset form after successful transfer
      setRecipients([{ address: "", amount: "", isValidAddress: false }])
    } catch (error: any) {
      console.error("Batch transfer error:", error)
      setTransactionStatus("error")
      toast({
        title: "Transfer Failed",
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
    <Card className="border-gold bg-slate-900/80 backdrop-blur-sm w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl gold-gradient">Batch Transfer</CardTitle>
        <CardDescription>Send GOLD tokens to multiple recipients at once</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <Label>Your GOLD Balance</Label>
            <div className="text-xl font-bold text-gold">{goldBalance.toFixed(4)} GOLD</div>
          </div>
          <div className="space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={distributeEvenly}
                    className="border-gold/30 text-gold hover:bg-gold/10"
                    disabled={isLoading || goldBalance <= 0}
                  >
                    Distribute Evenly
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Distribute your balance evenly among all recipients</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={setAllToMax}
                    className="border-gold/30 text-gold hover:bg-gold/10"
                    disabled={isLoading || goldBalance <= 0}
                  >
                    All to First
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send your entire balance to the first recipient</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-2 font-medium text-sm text-gray-400">
            <div className="col-span-6">Recipient Address</div>
            <div className="col-span-4">Amount (GOLD)</div>
            <div className="col-span-2">Actions</div>
          </div>

          {recipients.map((recipient, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6">
                <Input
                  placeholder="Enter Solana address"
                  value={recipient.address}
                  onChange={(e) => handleAddressChange(index, e.target.value)}
                  className={`bg-slate-800 border-gold/30 focus:border-gold ${
                    recipient.address && !recipient.isValidAddress ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                />
              </div>
              <div className="col-span-4">
                <Input
                  placeholder="Amount"
                  value={recipient.amount}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                  className="bg-slate-800 border-gold/30 focus:border-gold"
                  disabled={isLoading}
                />
              </div>
              <div className="col-span-2 flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRecipient(index)}
                  disabled={recipients.length === 1 || isLoading}
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={addRecipient}
            className="border-gold/30 text-gold hover:bg-gold/10"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Recipient
          </Button>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gold/20">
          <div className="flex items-center">
            <Info className="h-4 w-4 text-gold mr-2" />
            <span className="text-sm">
              Total Recipients: {recipients.filter((r) => r.address.trim() !== "").length}
            </span>
          </div>
          <div className="font-bold">
            Total: <span className="text-gold">{totalAmount.toFixed(4)} GOLD</span>
          </div>
        </div>

        {(transactionStatus === "preparing" || transactionStatus === "pending") && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{transactionStatus === "preparing" ? "Preparing Transaction" : "Processing Transaction"}...</span>
              <span>{processingProgress}%</span>
            </div>
            <Progress value={processingProgress} className="h-2 bg-slate-700" indicatorClassName="bg-gold" />
          </div>
        )}

        {transactionStatus === "success" && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-md p-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <p className="text-green-500 font-medium">Batch transfer successful!</p>
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
          onClick={handleBatchTransfer}
          disabled={
            !connected ||
            isLoading ||
            totalAmount <= 0 ||
            totalAmount > goldBalance ||
            recipients.filter((r) => r.address.trim() !== "" && r.isValidAddress).length === 0
          }
          className="gold-button w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Send Batch Transfer <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
