"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/components/wallet-provider"
import GameEntrance from "./game-entrance"
import GameEngine from "./game-engine"
import CharacterSelection from "./character-selection"
import { GameProvider } from "./game-context"

export default function AdventureGameClient() {
  const { connected, goldBalance } = useWallet()
  const [gameState, setGameState] = useState<"entrance" | "character-selection" | "playing" | "game-over">("entrance")
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [stakedAmount, setStakedAmount] = useState<number>(0)

  // Reset game state if wallet disconnects
  useEffect(() => {
    if (!connected && gameState !== "entrance") {
      setGameState("entrance")
    }
  }, [connected, gameState])

  if (!connected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
        <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-sm p-8 rounded-xl border border-gold/30">
          <h2 className="text-2xl font-bold mb-4 gold-gradient">Connect Wallet to Play</h2>
          <p className="text-gray-300 mb-6">
            Connect your wallet to start playing Goldium Adventure and hunt for GOLD tokens in this immersive 3D world.
          </p>
          <button
            className="w-full py-3 px-4 bg-gold text-black font-bold rounded-lg hover:bg-gold/80 transition-all"
            onClick={() => (window.location.href = "/auth")}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <GameProvider>
      {gameState === "entrance" && (
        <GameEntrance
          goldBalance={goldBalance}
          onStart={(amount) => {
            setStakedAmount(amount)
            setGameState("character-selection")
          }}
        />
      )}

      {gameState === "character-selection" && (
        <CharacterSelection
          onSelect={(character) => {
            setSelectedCharacter(character)
            setGameState("playing")
          }}
          onBack={() => setGameState("entrance")}
        />
      )}

      {gameState === "playing" && selectedCharacter && (
        <GameEngine
          character={selectedCharacter}
          stakedAmount={stakedAmount}
          onGameOver={(score) => setGameState("game-over")}
        />
      )}

      {gameState === "game-over" && (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black/80 p-4">
          <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-sm p-8 rounded-xl border border-gold/30">
            <h2 className="text-2xl font-bold mb-4 gold-gradient">Game Over</h2>
            <p className="text-gray-300 mb-6">
              Thanks for playing Goldium Adventure! Your rewards have been sent to your wallet.
            </p>
            <div className="flex space-x-4">
              <button
                className="flex-1 py-3 px-4 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition-all"
                onClick={() => setGameState("entrance")}
              >
                Play Again
              </button>
              <button
                className="flex-1 py-3 px-4 bg-gold text-black font-bold rounded-lg hover:bg-gold/80 transition-all"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </GameProvider>
  )
}
