"use client"

import { useGameContext } from "./game-context"

export default function GameHUD() {
  const { score, goldCollected, health, level, experience } = useGameContext()

  return (
    <div className="absolute top-0 left-0 w-full p-4 pointer-events-none">
      <div className="flex justify-between items-start max-w-7xl mx-auto">
        {/* Player Stats */}
        <div className="bg-black/50 backdrop-blur-sm p-3 rounded-lg border border-gold/30">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-xs text-gray-300">LEVEL</p>
              <p className="text-xl font-bold text-white">{level}</p>
            </div>

            <div>
              <p className="text-xs text-gray-300">HEALTH</p>
              <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${health}%` }} />
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-300">XP</p>
              <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${(experience / (level * 100)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Score and Gold */}
        <div className="bg-black/50 backdrop-blur-sm p-3 rounded-lg border border-gold/30">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-xs text-gray-300">SCORE</p>
              <p className="text-xl font-bold text-white">{score.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-xs text-gray-300">GOLD</p>
              <p className="text-xl font-bold gold-gradient">{goldCollected.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Game Controls Help */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm p-3 rounded-lg border border-gold/30">
        <p className="text-xs text-gray-300 mb-1">CONTROLS</p>
        <p className="text-xs text-white">WASD or Arrow Keys - Move</p>
        <p className="text-xs text-white">Space - Jump</p>
      </div>
    </div>
  )
}
