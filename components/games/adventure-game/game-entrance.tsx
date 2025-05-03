"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Coins, Trophy, Users, Info, ArrowRight } from "lucide-react"

interface GameEntranceProps {
  goldBalance: number
  onStart: (stakeAmount: number) => void
}

export default function GameEntrance({ goldBalance, onStart }: GameEntranceProps) {
  const [stakeAmount, setStakeAmount] = useState(10)
  const [isStaking, setIsStaking] = useState(false)

  const handleStart = async () => {
    setIsStaking(true)
    // Simulate transaction delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsStaking(false)
    onStart(stakeAmount)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-sm p-8 rounded-xl border border-gold/30">
        <h2 className="text-2xl font-bold mb-4 gold-gradient">Goldium 3D Adventure</h2>
        <p className="text-gray-300 mb-6">
          Stake your GOLD tokens to embark on an epic adventure and earn rewards. The more you stake, the higher your
          potential rewards!
        </p>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Your GOLD Balance:</span>
            <span className="font-medium text-gold">{goldBalance.toLocaleString()} GOLD</span>
          </div>

          <div className="space-y-2">
            <label htmlFor="stake-amount" className="text-sm text-gray-400">
              Stake Amount:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                id="stake-amount"
                min="10"
                max="100"
                step="10"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
                className="flex-1"
              />
              <span className="w-16 text-center font-medium text-gold">{stakeAmount} GOLD</span>
            </div>
          </div>

          <div className="bg-gold/10 rounded-lg p-3">
            <div className="flex items-center text-sm text-gray-300 mb-2">
              <Info className="h-4 w-4 mr-2 text-gold" />
              <span>Potential Rewards</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <Coins className="h-3 w-3 mr-1 text-gold" />
                <span>Up to {stakeAmount * 3} GOLD</span>
              </div>
              <div className="flex items-center">
                <Trophy className="h-3 w-3 mr-1 text-gold" />
                <span>Rare NFT chance</span>
              </div>
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1 text-gold" />
                <span>Leaderboard points</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button
            className="w-full py-3 px-4 bg-gold text-black font-bold rounded-lg hover:bg-gold/80 transition-all"
            onClick={handleStart}
            disabled={isStaking || goldBalance < stakeAmount}
          >
            {isStaking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Staking...
              </>
            ) : (
              <>
                Start Adventure <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
