"use client"

import { useEffect, useState } from "react"
import { useNetwork } from "@/contexts/network-context"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export function NetworkDetector() {
  const { network, setNetwork } = useNetwork()
  const { connected, walletType } = useSolanaWallet()
  const [showAlert, setShowAlert] = useState(false)
  const [detectedNetwork, setDetectedNetwork] = useState<string | null>(null)
  const { toast } = useToast()

  // Check if the wallet is connected to the correct network
  useEffect(() => {
    if (!connected || !walletType) return

    const checkNetwork = async () => {
      try {
        let detectedNet: string | null = null

        // Check network based on wallet type
        if (walletType === "phantom" && window.solana) {
          // For Phantom wallet
          const resp = await window.solana.request({ method: "getGenesisHash" })
          
          // Testnet genesis hash
          if (resp === "4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY") {
            detectedNet = "testnet"
          } 
          // Mainnet genesis hash
          else if (resp === "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d") {
            detectedNet = "mainnet"
          }
        } else if (walletType === "solflare" && window.solflare) {
          // For Solflare wallet
          const resp = await window.solflare.request({ method: "getGenesisHash" })
          
          // Testnet genesis hash
          if (resp === "4uhcVJyU9pJkvQyS88uRDiswHXSCkY3zQawwpjk2NsNY") {
            detectedNet = "testnet"
          } 
          // Mainnet genesis hash
          else if (resp === "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d") {
            detectedNet = "mainnet"
          }
        }

        setDetectedNetwork(detectedNet)

        // If detected network doesn't match the app's network, show alert
        if (detectedNet && detectedNet !== network) {
          setShowAlert(true)
        }
      } catch (error) {
        console.error("Error detecting network:", error)
      }
    }

    checkNetwork()
  }, [connected, walletType, network])

  const handleSwitchNetwork = async () => {
    if (!detectedNetwork) return

    // Update the app's network to match the wallet's network
    setNetwork(detectedNetwork as any)
    setShowAlert(false)

    toast({
      title: "Network Updated",
      description: `Switched to ${detectedNetwork.charAt(0).toUpperCase() + detectedNetwork.slice(1)}`,
    })
  }

  const handleKeepCurrent = () => {
    setShowAlert(false)
    
    toast({
      title: "Network Mismatch",
      description: "Your wallet is connected to a different network than the app",
      variant: "destructive",
    })
  }

  if (!showAlert) return null

  return (
    <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Network Mismatch Detected
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your wallet is connected to <strong>{detectedNetwork}</strong> but the app is configured for <strong>{network}</strong>.
            Would you like to switch the app to match your wallet's network?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleKeepCurrent}>Keep Current</AlertDialogCancel>
          <AlertDialogAction onClick={handleSwitchNetwork}>
            Switch to {detectedNetwork}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
