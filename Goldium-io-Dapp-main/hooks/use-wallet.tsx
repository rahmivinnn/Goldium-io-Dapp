"use client"

import { useState, useEffect } from "react"

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      try {
        // This is a mock implementation
        const connected = localStorage.getItem("wallet_connected") === "true"
        if (connected) {
          setIsConnected(true)
          setWalletAddress(localStorage.getItem("wallet_address") || null)
          setBalance(localStorage.getItem("wallet_balance") || null)
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }

    checkConnection()

    // Listen for wallet connection events
    const handleConnect = () => {
      setIsConnected(true)
      const mockAddress = "7Xf3bGGdT5zFQGAqJdUNJGBKMUaJeGXKA5FeHkj8kP"
      const mockBalance = "100.5"
      setWalletAddress(mockAddress)
      setBalance(mockBalance)
      localStorage.setItem("wallet_connected", "true")
      localStorage.setItem("wallet_address", mockAddress)
      localStorage.setItem("wallet_balance", mockBalance)
    }

    const handleDisconnect = () => {
      setIsConnected(false)
      setWalletAddress(null)
      setBalance(null)
      localStorage.removeItem("wallet_connected")
      localStorage.removeItem("wallet_address")
      localStorage.removeItem("wallet_balance")
    }

    window.addEventListener("wallet-connected", handleConnect)
    window.addEventListener("wallet-disconnected", handleDisconnect)
    window.addEventListener("connect-wallet-requested", () => {
      // Simulate wallet connection
      setTimeout(() => {
        window.dispatchEvent(new Event("wallet-connected"))
      }, 1000)
    })

    return () => {
      window.removeEventListener("wallet-connected", handleConnect)
      window.removeEventListener("wallet-disconnected", handleDisconnect)
      window.removeEventListener("connect-wallet-requested", () => {})
    }
  }, [])

  const connect = () => {
    window.dispatchEvent(new Event("connect-wallet-requested"))
  }

  const disconnect = () => {
    window.dispatchEvent(new Event("wallet-disconnected"))
  }

  return {
    isConnected,
    walletAddress,
    balance,
    connect,
    disconnect,
  }
}

export default useWallet
