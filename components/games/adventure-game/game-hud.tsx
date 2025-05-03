"use client"

import { useGame } from "./game-context"
import { Heart, Coins, Trophy, Zap } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function GameHUD() {
  const { health, goldCollected, score, level, experience } = useGame()

  // Calculate XP needed for next level
  const experienceNeeded = level * 100
  const experiencePercentage = (experience / experienceNeeded) * 100

  return (
    <div className="absolute top-0 left-0 w-full p-4 pointer-events-none">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {/* Health */}
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 flex items-center">
            <Heart className={`w-5 h-5 mr-2 ${health > 50 ? "text-red-500" : "text-red-300"}`} />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-300">Health</span>
                <span className="text-xs font-medium">{health}/100</span>
              </div>
              <Progress value={health} className="h-2" indicatorClassName="bg-red-500" />
            </div>
          </div>

          {/* Gold */}
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 flex items-center">
            <Coins className="w-5 h-5 mr-2 text-gold" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">GOLD</span>
                <span className="text-sm font-medium text-gold">{goldCollected}</span>
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-amber-400" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300">Score</span>
                <span className="text-sm font-medium text-amber-400">{score}</span>
              </div>
            </div>
          </div>

          {/* Level */}
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-400" />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-300">Level {level}</span>
                <span className="text-xs font-medium">
                  {experience}/{experienceNeeded} XP
                </span>
              </div>
              <Progress value={experiencePercentage} className="h-2" indicatorClassName="bg-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
