"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { ArrowRight, Info, Coins } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface GameEntranceProps {
  goldBalance: number
  onStart: (stakedAmount: number) => void
}

export default function GameEntrance({ goldBalance, onStart }: GameEntranceProps) {
  const [stakedAmount, setStakedAmount] = useState(10) // Default stake amount
  const minStake = 10
  const maxStake = Math.min(500, goldBalance)

  // Calculate potential rewards based on stake
  const potentialReward = Math.floor(stakedAmount * 2.5)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gold-gradient">Goldium Adventure</h1>
            <p className="text-xl text-gray-300 mb-6">
              Hunt for GOLD tokens in this immersive 3D world. Stake your GOLD to play and earn even more!
            </p>
            <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Info className="w-5 h-5 mr-2 text-gold" />
                How to Play
              </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Stake GOLD tokens to enter the game</li>
                <li>Choose your character: Cat, Gorilla, or Gold Coin</li>
                <li>Explore the 3D world and collect GOLD tokens</li>
                <li>Avoid obstacles and enemies</li>
                <li>Complete the level to earn rewards</li>
              </ul>
            </div>
          </div>

          <Card className="bg-slate-900/80 backdrop-blur-sm border-gold/30">
            <CardHeader>
              <CardTitle>Stake GOLD to Play</CardTitle>
              <CardDescription>Higher stakes mean greater rewards!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Your Balance</span>
                  <span className="text-sm font-medium flex items-center">
                    <Coins className="w-4 h-4 mr-1 text-gold" />
                    {goldBalance.toLocaleString()} GOLD
                  </span>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Stake Amount</span>
                    <span className="text-lg font-bold text-gold">{stakedAmount} GOLD</span>
                  </div>

                  <Slider
                    value={[stakedAmount]}
                    min={minStake}
                    max={maxStake}
                    step={10}
                    onValueChange={(value) => setStakedAmount(value[0])}
                    disabled={goldBalance < minStake}
                    className="my-6"
                  />

                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{minStake} GOLD</span>
                    <span>{maxStake} GOLD</span>
                  </div>
                </div>

                <div className="bg-gold/10 p-4 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Potential Reward</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help flex items-center">
                            <Info className="w-4 h-4 mr-1 text-gray-400" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-64 text-xs">
                            Potential rewards are calculated based on your stake amount and game performance. The actual
                            reward may vary depending on your in-game achievements.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-2xl font-bold text-gold">{potentialReward} GOLD</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gold hover:bg-gold/80 text-black font-bold"
                disabled={goldBalance < minStake}
                onClick={() => onStart(stakedAmount)}
              >
                Start Adventure <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Total Distribution",
              value: "1,000,000 GOLD",
              description: "Total GOLD tokens allocated for game rewards",
            },
            {
              title: "Players Online",
              value: "1,248",
              description: "Join other players in the Goldium world",
            },
            {
              title: "Highest Reward",
              value: "12,540 GOLD",
              description: "Highest single game reward earned",
            },
          ].map((stat, index) => (
            <Card key={index} className="bg-slate-900/60 backdrop-blur-sm border-gold/20">
              <CardContent className="pt-6">
                <div className="text-sm text-gray-400">{stat.title}</div>
                <div className="text-2xl font-bold gold-gradient">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
