"use client"

import { useState } from "react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Gift, AlertCircle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { isValidSolanaAddress } from "@/lib/utils"
import { playTokenTransferSound, playUISound } from "@/services/sound-effects-service"
import confetti from "canvas-confetti"

interface GiftGoldModalProps {
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function GiftGoldModal({ trigger, onSuccess }: GiftGoldModalProps) {
  const { connected, address, goldBalance, refreshBalance } = useSolanaWallet()
  const { network } = useNetwork()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isGifting, setIsGifting] = useState(false)
  const [giftStatus, setGiftStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

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
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#FBBF24', '#FCD34D']
    })
    
    // Play sound
    playTokenTransferSound()
  }

  // Handle gift
  const handleGift = async () => {
    if (!connected || !address || !isFormValid()) return
    
    setIsGifting(true)
    setGiftStatus("loading")
    
    try {
      // In a real implementation, this would create and send a token transfer transaction
      // For this demo, we'll simulate a successful transfer
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setGiftStatus("success")
      
      // Refresh balance
      await refreshBalance()
      
      // Show success toast
      toast({
        title: "Gift Sent Successfully",
        description: `${amount} GOLD tokens have been sent to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
      })
      
      // Play success effects
      playSuccessEffects()
      
      // Call onSuccess callback if provided
      if (onSuccess) onSuccess()
      
      // Reset form after a delay
      setTimeout(() => {
        setRecipient("")
        setAmount("")
        setMessage("")
        setGiftStatus("idle")
        setIsOpen(false)
      }, 3000)
    } catch (error) {
      console.error("Error gifting GOLD tokens:", error)
      
      setGiftStatus("error")
      
      toast({
        title: "Gift Failed",
        description: "Failed to send GOLD tokens. Please try again later.",
        variant: "destructive",
      })
      
      // Play error sound
      playUISound("error")
      
      // Reset status after a delay
      setTimeout(() => {
        setGiftStatus("idle")
      }, 3000)
    } finally {
      setIsGifting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            <span>Gift GOLD</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-yellow-500" />
            Gift GOLD Tokens
          </DialogTitle>
          <DialogDescription>
            Send GOLD tokens as a gift to another wallet address
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="Enter Solana wallet address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isGifting || giftStatus === "success"}
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
              disabled={isGifting || giftStatus === "success"}
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
          
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isGifting || giftStatus === "success"}
              className="resize-none"
              rows={3}
            />
          </div>
          
          {giftStatus === "success" && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
              <div className="flex items-center text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                <span className="font-medium">Gift Sent Successfully!</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                Your gift of {amount} GOLD has been sent.
              </p>
            </div>
          )}
          
          {giftStatus === "error" && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
              <div className="flex items-center text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Gift Failed</span>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                Please check your inputs and try again.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isGifting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleGift}
            disabled={!connected || isGifting || !isFormValid() || giftStatus === "success"}
            className="bg-gradient-to-r from-amber-500 to-yellow-300 text-black hover:from-amber-600 hover:to-yellow-400"
          >
            {isGifting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Gift...
              </>
            ) : giftStatus === "success" ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Gift Sent
              </>
            ) : (
              <>
                <Gift className="mr-2 h-4 w-4" />
                Send Gift
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
