"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { useNetwork } from "@/contexts/network-context"
import { GOLD_TOKEN_METADATA, MANA_TOKEN_METADATA } from "@/config/network-config"

interface WalletContextType {
  connected: boolean
  connecting: boolean
  address: string | null
  connect: () => Promise<void>
  disconnect: () => void
  tokens: Array<{
    symbol: string
    name: string
    balance: number
    price: number
    icon: string
  }>
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  connecting: false,
  address: null,
  connect: async () => {},
  disconnect: () => {},
  tokens: [],
})

export const useWallet = () => useContext(WalletContext)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const { toast } = useToast()
  const { network } = useNetwork()

  // Mock token data
  const [tokens, setTokens] = useState([
    {
      symbol: "SOL",
      name: "Solana",
      balance: 2.5,
      price: 150,
      icon: "/images/solana-logo.png",
    },
    {
      symbol: "GOLD",
      name: GOLD_TOKEN_METADATA.name,
      balance: 1000,
      price: 0.85,
      icon: GOLD_TOKEN_METADATA.logoURI,
    },
    {
      symbol: "MANA",
      name: MANA_TOKEN_METADATA.name,
      balance: 500,
      price: 0.45,
      icon: MANA_TOKEN_METADATA.logoURI,
    },
  ])

  // Check if wallet is connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // In a real app, this would check if the wallet is connected
        const isConnected = localStorage.getItem("walletConnected") === "true"
        if (isConnected) {
          setConnected(true)
          setAddress("8xGZsNVHbcJKPJALmDzsYtCKVXGBQMUyGJvuMsvBbEPmAb2KT7J2RPrKu1LwSUcQY")
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }

    checkConnection()
  }, [])

  // Connect wallet
  const connect = async () => {
    try {
      setConnecting(true)
      // In a real app, this would connect to the wallet
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setConnected(true)
      setAddress("8xGZsNVHbcJKPJALmDzsYtCKVXGBQMUyGJvuMsvBbEPmAb2KT7J2RPrKu1LwSUcQY")
      localStorage.setItem("walletConnected", "true")
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully.",
      })
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnect = () => {
    setConnected(false)
    setAddress(null)
    localStorage.removeItem("walletConnected")
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  return (
    <WalletContext.Provider
      value={{
        connected,
        connecting,
        address,
        connect,
        disconnect,
        tokens,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
