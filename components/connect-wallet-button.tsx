"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from 'lucide-react'
import { motion } from "framer-motion"

export function ConnectWalletButton() {
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState("")

  const connectWallet = () => {
    if (connected) {
      setConnected(false)
      setAddress("")
      return
    }

    // Simulate wallet connection
    setConnected(true)
    setAddress("0x71C7...F9E2")
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        onClick={connectWallet}
        className={connected ? "border-gold-500/50 text-gold-500" : "gold-button"}
        variant={connected ? "outline" : "default"}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {connected ? address : "Connect Wallet"}
      </Button>
    </motion.div>
  )
}
