"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useNetwork } from "@/contexts/network-context"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { getGOLDBalance, getSOLBalance } from "@/services/token-service"

export default function GoldBalance() {
  const { connection, network } = useNetwork()
  const { publicKey, connected } = useSolanaWallet()
  const [goldBalance, setGoldBalance] = useState<number | null>(null)
  const [solBalance, setSolBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBalances = async () => {
      if (connected && publicKey) {
        setLoading(true)
        try {
          const walletAddress = publicKey.toString()

          // Fetch balances in parallel
          const [goldBal, solBal] = await Promise.all([
            getGOLDBalance(connection, walletAddress, network),
            getSOLBalance(connection, walletAddress),
          ])

          setGoldBalance(goldBal)
          setSolBalance(solBal)
        } catch (error) {
          console.error("Error fetching balances:", error)
        } finally {
          setLoading(false)
        }
      } else {
        setGoldBalance(null)
        setSolBalance(null)
      }
    }

    fetchBalances()

    // Set up interval to refresh balances every 30 seconds
    const intervalId = setInterval(fetchBalances, 30000)

    return () => clearInterval(intervalId)
  }, [connected, publicKey, connection, network])

  if (!connected) {
    return (
      <Card className="border-gold/30 bg-black/40 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">Connect your wallet to view your balance</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gold/30 bg-black/40 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2 rounded-full bg-gold/20 flex items-center justify-center">
                <img src="/gold_icon-removebg-preview.png" alt="GOLD" className="w-5 h-5" />
              </div>
              <span>GOLD</span>
            </div>
            {loading || (connected && goldBalance === null) ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <span className="font-bold text-gold">{goldBalance !== null ? goldBalance.toLocaleString() : "—"}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-6 h-6 mr-2 rounded-full bg-purple-500/20 flex items-center justify-center">
                <img src="/images/solana-logo.png" alt="SOL" className="w-5 h-5" />
              </div>
              <span>SOL</span>
            </div>
            {loading || (connected && solBalance === null) ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <span className="font-bold text-purple-400">
                {solBalance !== null ? solBalance.toLocaleString() : "—"}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
