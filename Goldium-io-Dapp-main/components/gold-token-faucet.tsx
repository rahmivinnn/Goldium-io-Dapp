"use client"

import { useState, useEffect } from "react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Coins } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import confetti from "canvas-confetti"

// Sound effect for successful claim
const successSound = typeof window !== "undefined" ? new Audio("/sounds/coin-collect.mp3") : null

export function GoldTokenFaucet() {
  const { connected, address, refreshBalance, walletType } = useSolanaWallet()
  const { networkConfig, network } = useNetwork()
  const { toast } = useToast()
  const [isClaiming, setIsClaiming] = useState(false)
  const [lastClaimed, setLastClaimed] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Constants
  const CLAIM_AMOUNT = 100 // Amount of GOLD tokens to claim
  const CLAIM_COOLDOWN = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  const FAUCET_ACCOUNT = "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump" // Faucet account address

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
    
    // Load last claimed time from localStorage
    const storedLastClaimed = localStorage.getItem("goldium_last_claimed")
    if (storedLastClaimed) {
      setLastClaimed(parseInt(storedLastClaimed))
    }
  }, [])

  // Update time remaining
  useEffect(() => {
    if (!lastClaimed) return
    
    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = now - lastClaimed
      const remaining = CLAIM_COOLDOWN - elapsed
      
      if (remaining <= 0) {
        setTimeRemaining(null)
        clearInterval(interval)
      } else {
        setTimeRemaining(remaining)
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [lastClaimed])

  // Format time remaining
  const formatTimeRemaining = () => {
    if (!timeRemaining) return ""
    
    const hours = Math.floor(timeRemaining / (60 * 60 * 1000))
    const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000))
    const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000)
    
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
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

  // Handle claim
  const handleClaim = async () => {
    if (!connected || !address || network !== "testnet") return
    
    setIsClaiming(true)
    
    try {
      // In a real implementation, this would call a server endpoint to mint tokens
      // For this demo, we'll simulate a successful claim
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update last claimed time
      const now = Date.now()
      setLastClaimed(now)
      localStorage.setItem("goldium_last_claimed", now.toString())
      
      // Refresh balance
      await refreshBalance()
      
      // Show success toast
      toast({
        title: "GOLD Tokens Claimed!",
        description: `${CLAIM_AMOUNT} GOLD tokens have been added to your wallet.`,
      })
      
      // Play success effects
      playSuccessEffects()
    } catch (error) {
      console.error("Error claiming GOLD tokens:", error)
      
      toast({
        title: "Claim Failed",
        description: "Failed to claim GOLD tokens. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsClaiming(false)
    }
  }

  // Check if claim is available
  const isClaimAvailable = () => {
    if (!lastClaimed) return true
    
    const now = Date.now()
    const elapsed = now - lastClaimed
    return elapsed >= CLAIM_COOLDOWN
  }

  if (!isClient) {
    return null
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-yellow-500" />
          GOLD Token Faucet
        </CardTitle>
        <CardDescription>
          Claim free GOLD tokens once every 24 hours
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <div className="text-4xl font-bold text-yellow-500">{CLAIM_AMOUNT}</div>
          <div className="text-sm text-muted-foreground">GOLD Tokens</div>
          
          {timeRemaining !== null && (
            <div className="mt-4 text-center">
              <div className="text-sm text-muted-foreground">Next claim available in</div>
              <div className="text-xl font-mono mt-1">{formatTimeRemaining()}</div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-300 text-black hover:from-amber-600 hover:to-yellow-400"
          onClick={handleClaim}
          disabled={!connected || isClaiming || !isClaimAvailable() || network !== "testnet"}
        >
          {isClaiming ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Claiming...
            </>
          ) : !connected ? (
            "Connect Wallet First"
          ) : network !== "testnet" ? (
            "Only Available on Testnet"
          ) : !isClaimAvailable() ? (
            "Claim Period Cooling Down"
          ) : (
            "Claim GOLD Tokens"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
