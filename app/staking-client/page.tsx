"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { Loader2 } from "lucide-react"

export default function StakingClientPage() {
  const { connected, address } = useSolanaWallet()
  const [amount, setAmount] = useState("")
  const [isStaking, setIsStaking] = useState(false)
  const [stakedAmount, setStakedAmount] = useState("0")
  const [rewards, setRewards] = useState("0")
  const [stakingPeriod, setStakingPeriod] = useState("0")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Simulate fetching staking data
    if (connected) {
      setStakedAmount("250")
      setRewards("12.5")
      setStakingPeriod("30")
    }
  }, [connected])

  const handleStake = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) return

    setIsStaking(true)

    // Simulate staking process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setStakedAmount((Number.parseFloat(stakedAmount) + Number.parseFloat(amount)).toString())
    setAmount("")
    setIsStaking(false)
  }

  const handleUnstake = async () => {
    if (Number.parseFloat(stakedAmount) <= 0) return

    setIsStaking(true)

    // Simulate unstaking process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setStakedAmount("0")
    setRewards("0")
    setIsStaking(false)
  }

  const handleClaimRewards = async () => {
    if (Number.parseFloat(rewards) <= 0) return

    setIsStaking(true)

    // Simulate claiming rewards
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setRewards("0")
    setIsStaking(false)
  }

  if (!mounted) return null

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto bg-black/50 border border-yellow-500/30 text-white">
          <CardHeader>
            <CardTitle className="text-center text-yellow-500">Wallet Connection Required</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Please connect your wallet to access the staking interface
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">Connect Wallet</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: "#FFD700" }}>
          GOLD Staking Interface
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-black/50 border border-yellow-500/30 text-white">
            <CardHeader>
              <CardTitle className="text-yellow-500">Your Staking Stats</CardTitle>
              <CardDescription className="text-gray-300">Current staking information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Staked Amount</p>
                  <p className="text-2xl font-bold">{stakedAmount} GOLD</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Pending Rewards</p>
                  <p className="text-2xl font-bold text-yellow-500">{rewards} GOLD</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Staking Period</p>
                  <p className="text-lg">{stakingPeriod} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">APY</p>
                  <p className="text-lg">18.5%</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                onClick={handleUnstake}
                disabled={Number.parseFloat(stakedAmount) <= 0 || isStaking}
                variant="outline"
                className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20"
              >
                {isStaking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Unstake All
              </Button>
              <Button
                onClick={handleClaimRewards}
                disabled={Number.parseFloat(rewards) <= 0 || isStaking}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {isStaking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Claim Rewards
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-black/50 border border-yellow-500/30 text-white">
            <CardHeader>
              <CardTitle className="text-yellow-500">Stake GOLD</CardTitle>
              <CardDescription className="text-gray-300">Stake your GOLD tokens to earn rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Amount to Stake</p>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-black/30 border-yellow-500/30 text-white"
                    />
                    <Button
                      variant="outline"
                      className="border-yellow-500/50 text-yellow-500"
                      onClick={() => setAmount("100")}
                    >
                      MAX
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Estimated APY</p>
                  <p className="text-lg">18.5%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Estimated Daily Rewards</p>
                  <p className="text-lg">
                    {amount ? ((Number.parseFloat(amount) * 0.185) / 365).toFixed(4) : "0.0000"} GOLD
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleStake}
                disabled={!amount || Number.parseFloat(amount) <= 0 || isStaking}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {isStaking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Stake GOLD
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card className="bg-black/50 border border-yellow-500/30 text-white">
          <CardHeader>
            <CardTitle className="text-yellow-500">Staking Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">How Staking Works</h3>
                <p className="text-gray-300">
                  Staking your GOLD tokens allows you to earn passive income while supporting the Goldium ecosystem.
                  When you stake your tokens, they are locked in a smart contract, and you earn rewards based on the
                  current APY rate.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Rewards Distribution</h3>
                <p className="text-gray-300">
                  Rewards are calculated daily and can be claimed at any time. The APY rate may fluctuate based on the
                  total amount of GOLD staked in the protocol.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Unstaking</h3>
                <p className="text-gray-300">
                  You can unstake your GOLD tokens at any time without any penalty. However, any unclaimed rewards must
                  be claimed separately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
