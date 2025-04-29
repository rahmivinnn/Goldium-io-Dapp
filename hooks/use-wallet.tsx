"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface WalletContextType {
  connected: boolean
  connecting: boolean
  address: string | null
  balance: number
  connect: () => Promise<void | boolean>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  connected: false,
  connecting: false,
  address: null,
  balance: 0,
  connect: async () => {},
  disconnect: () => {},
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const { toast } = useToast()

  // Check for existing connection on mount
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress")
    if (savedAddress) {
      setAddress(savedAddress)
      setConnected(true)
      setBalance(Math.floor(Math.random() * 2000) + 500) // Simulate balance
    }
  }, [])

  const connect = async () => {
    try {
      setConnecting(true)

      // Simulate wallet connection delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a random wallet address
      const randomAddress = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(
        "",
      )}`

      setAddress(randomAddress)
      setConnected(true)
      setBalance(Math.floor(Math.random() * 2000) + 500) // Simulate balance

      // Save to localStorage for session persistence
      localStorage.setItem("walletAddress", randomAddress)

      toast({
        title: "Wallet Connected",
        description: `Connected to ${randomAddress.slice(0, 6)}...${randomAddress.slice(-4)}`,
      })

      return true
    } catch (error) {
      console.error("Wallet connection error:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = () => {
    setConnected(false)
    setAddress(null)
    setBalance(0)
    localStorage.removeItem("walletAddress")

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
        balance,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)
