"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWallet } from "@/components/wallet-provider"

interface GameContextType {
  score: number
  goldCollected: number
  health: number
  level: number
  experience: number
  inventory: GameItem[]
  addScore: (points: number) => void
  collectGold: (amount: number) => void
  takeDamage: (amount: number) => void
  addToInventory: (item: GameItem) => void
  useItem: (itemId: string) => void
  levelUp: () => void
  addExperience: (amount: number) => void
}

interface GameItem {
  id: string
  name: string
  description: string
  type: "weapon" | "potion" | "artifact" | "key"
  value: number
  imageUrl: string
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const { goldBalance } = useWallet()
  const [score, setScore] = useState(0)
  const [goldCollected, setGoldCollected] = useState(0)
  const [health, setHealth] = useState(100)
  const [level, setLevel] = useState(1)
  const [experience, setExperience] = useState(0)
  const [inventory, setInventory] = useState<GameItem[]>([])

  const addScore = (points: number) => {
    setScore((prev) => prev + points)
  }

  const collectGold = (amount: number) => {
    setGoldCollected((prev) => prev + amount)
  }

  const takeDamage = (amount: number) => {
    setHealth((prev) => Math.max(0, prev - amount))
  }

  const addToInventory = (item: GameItem) => {
    setInventory((prev) => [...prev, item])
  }

  const useItem = (itemId: string) => {
    const item = inventory.find((i) => i.id === itemId)
    if (!item) return

    // Apply item effects based on type
    if (item.type === "potion") {
      setHealth((prev) => Math.min(100, prev + item.value))
    }

    // Remove item from inventory
    setInventory((prev) => prev.filter((i) => i.id !== itemId))
  }

  const levelUp = () => {
    setLevel((prev) => prev + 1)
    setHealth(100) // Restore health on level up
  }

  const addExperience = (amount: number) => {
    const newExperience = experience + amount
    const experienceNeeded = level * 100 // Simple formula: level * 100 XP needed to level up

    if (newExperience >= experienceNeeded) {
      // Level up and carry over excess XP
      setExperience(newExperience - experienceNeeded)
      levelUp()
    } else {
      setExperience(newExperience)
    }
  }

  // Game over condition
  useEffect(() => {
    if (health <= 0) {
      // Handle game over logic
      console.log("Game over!")
    }
  }, [health])

  return (
    <GameContext.Provider
      value={{
        score,
        goldCollected,
        health,
        level,
        experience,
        inventory,
        addScore,
        collectGold,
        takeDamage,
        addToInventory,
        useItem,
        levelUp,
        addExperience,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
