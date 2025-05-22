"use client"

import { Button } from "@/components/ui/button"
import { Sword, Coins, CreditCard, Trophy, XCircle } from "lucide-react"

// Sample game history data
const GAME_HISTORY = [
  {
    id: "game1",
    type: "battle",
    result: "win",
    opponent: "CryptoWizard",
    reward: 120,
    timestamp: "2025-04-29T09:15:00Z",
  },
  {
    id: "game2",
    type: "coinflip",
    result: "win",
    bet: 50,
    reward: 100,
    timestamp: "2025-04-28T18:30:00Z",
  },
  {
    id: "game3",
    type: "cardflip",
    result: "loss",
    bet: 25,
    timestamp: "2025-04-28T14:45:00Z",
  },
  {
    id: "game4",
    type: "battle",
    result: "win",
    opponent: "TokenMaster",
    reward: 85,
    timestamp: "2025-04-27T20:20:00Z",
  },
  {
    id: "game5",
    type: "coinflip",
    result: "loss",
    bet: 75,
    timestamp: "2025-04-27T16:10:00Z",
  },
]

export default function GameHistoryPreview() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getGameIcon = (type: string) => {
    switch (type) {
      case "battle":
        return <Sword className="h-5 w-5 text-gold" />
      case "coinflip":
        return <Coins className="h-5 w-5 text-gold" />
      case "cardflip":
        return <CreditCard className="h-5 w-5 text-gold" />
      default:
        return null
    }
  }

  const getGameName = (type: string) => {
    switch (type) {
      case "battle":
        return "Card Battle"
      case "coinflip":
        return "Coin Flip"
      case "cardflip":
        return "Card Flip"
      default:
        return type
    }
  }

  return (
    <div>
      <div className="space-y-4">
        {GAME_HISTORY.slice(0, 5).map((game) => (
          <div
            key={game.id}
            className="flex items-center justify-between p-3 border border-gold/20 rounded-lg hover:bg-gold/5 transition-colors"
          >
            <div className="flex items-center">
              <div className="mr-3">{getGameIcon(game.type)}</div>
              <div>
                <div className="font-medium">{getGameName(game.type)}</div>
                <div className="text-xs text-gray-400">
                  {game.type === "battle" ? `vs ${game.opponent}` : `Bet: ${game.bet} GOLD`}
                </div>
                <div className="text-xs text-gray-400">{formatDate(game.timestamp)}</div>
              </div>
            </div>

            <div className="flex items-center">
              <div className="text-right">
                {game.result === "win" ? (
                  <>
                    <div className="font-bold text-green-500">+{game.reward} GOLD</div>
                    <div className="text-xs flex items-center justify-end text-green-500">
                      <Trophy className="h-3 w-3 mr-1" />
                      <span>Victory</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-bold text-red-500">-{game.bet} GOLD</div>
                    <div className="text-xs flex items-center justify-end text-red-500">
                      <XCircle className="h-3 w-3 mr-1" />
                      <span>Defeat</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-400">Showing 5 of 24 games</div>
        <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 text-sm">
          View All Games
        </Button>
      </div>
    </div>
  )
}
