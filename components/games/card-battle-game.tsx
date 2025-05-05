"use client"

import { useState, useEffect } from "react"
import { Shield, Zap, Heart, Sword, FastForward, Pizza, Moon, SkipForward, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface CardStats {
  id: string
  name: string
  attack: number
  defense: number
  health: number
  mana: number
  color: string
  abilities: string[]
  image: string
}

export default function CardBattleGame() {
  const [turn, setTurn] = useState(1)
  const [energy, setEnergy] = useState(3)
  const [maxEnergy, setMaxEnergy] = useState(10)
  const [combo, setCombo] = useState(0)
  const [gold, setGold] = useState(1000)
  const [battleLog, setBattleLog] = useState<string[]>([])

  const [playerCard, setPlayerCard] = useState<CardStats>({
    id: "player1",
    name: "Golden Guardian",
    attack: 8,
    defense: 6,
    health: 100,
    mana: 10,
    color: "gold",
    abilities: ["Food Heal", "Monday Rage", "Lazy Attack", "Cat Nap"],
    image: "/dragon-breath-blade.png",
  })

  const [opponentCard, setOpponentCard] = useState<CardStats>({
    id: "opponent1",
    name: "Silver Sentinel",
    attack: 5,
    defense: 8,
    health: 100,
    mana: 4,
    color: "silver",
    abilities: ["Happy Bark", "Tail Spin", "Puppy Eyes", "Paw Attack"],
    image: "/shimmering-aegis.png",
  })

  const performAction = (action: string, manaCost: number, goldCost = 0) => {
    if (energy < manaCost) {
      addToBattleLog("Not enough energy!")
      return
    }

    if (gold < goldCost) {
      addToBattleLog("Not enough gold!")
      return
    }

    setEnergy((prev) => prev - manaCost)
    if (goldCost > 0) {
      setGold((prev) => prev - goldCost)
    }

    switch (action) {
      case "attack":
        const damage = Math.max(1, playerCard.attack - opponentCard.defense / 2)
        setOpponentCard((prev) => ({
          ...prev,
          health: Math.max(0, prev.health - damage),
        }))
        addToBattleLog(`You attacked for ${damage} damage!`)
        setCombo((prev) => prev + 1)
        break
      case "heal":
        const healAmount = 15
        setPlayerCard((prev) => ({
          ...prev,
          health: Math.min(100, prev.health + healAmount),
        }))
        addToBattleLog(`You healed for ${healAmount} health!`)
        break
      case "special":
        const specialDamage = playerCard.attack * 1.5
        setOpponentCard((prev) => ({
          ...prev,
          health: Math.max(0, prev.health - specialDamage),
        }))
        addToBattleLog(`Special attack dealt ${specialDamage} damage!`)
        setCombo((prev) => prev + 2)
        break
      case "charge":
        const energyGain = 2
        setEnergy((prev) => Math.min(maxEnergy, prev + energyGain))
        addToBattleLog(`Charged ${energyGain} energy!`)
        break
      case "shield":
        setPlayerCard((prev) => ({
          ...prev,
          defense: prev.defense + 2,
        }))
        addToBattleLog("Defense increased by 2!")
        break
      case "lazy_attack":
        const lazyDamage = Math.max(1, playerCard.attack / 2)
        setOpponentCard((prev) => ({
          ...prev,
          health: Math.max(0, prev.health - lazyDamage),
        }))
        addToBattleLog(`Lazy attack dealt ${lazyDamage} damage!`)
        break
      case "cat_nap":
        setPlayerCard((prev) => ({
          ...prev,
          health: Math.min(100, prev.health + 10),
          mana: Math.min(10, prev.mana + 2),
        }))
        addToBattleLog("Cat nap restored 10 health and 2 mana!")
        break
      case "pizza_power":
        setPlayerCard((prev) => ({
          ...prev,
          attack: prev.attack + 3,
          health: Math.min(100, prev.health + 20),
        }))
        addToBattleLog("Pizza power increased attack by 3 and restored 20 health!")
        break
      case "pass":
        endTurn()
        break
      case "clear":
        setBattleLog([])
        break
    }

    // Check if opponent is defeated
    if (opponentCard.health <= 0) {
      addToBattleLog("Victory! You defeated your opponent!")
      const reward = 200 + combo * 50
      setGold((prev) => prev + reward)
      addToBattleLog(`You earned ${reward} GOLD!`)
      setTimeout(() => {
        resetGame()
      }, 2000)
    }
  }

  const endTurn = () => {
    // Opponent's turn logic
    if (opponentCard.health > 0) {
      const opponentDamage = Math.max(1, opponentCard.attack - playerCard.defense / 2)
      setPlayerCard((prev) => ({
        ...prev,
        health: Math.max(0, prev.health - opponentDamage),
      }))
      addToBattleLog(`Opponent attacked for ${opponentDamage} damage!`)

      // Check if player is defeated
      if (playerCard.health - opponentDamage <= 0) {
        addToBattleLog("Defeat! Your card was destroyed!")
        setTimeout(() => {
          resetGame()
        }, 2000)
      }
    }

    // Next turn
    setTurn((prev) => prev + 1)
    setEnergy(Math.min(maxEnergy, energy + 3))
    setCombo(0)
  }

  const resetGame = () => {
    setTurn(1)
    setEnergy(3)
    setCombo(0)
    setPlayerCard((prev) => ({
      ...prev,
      health: 100,
      mana: 10,
      defense: 6,
    }))
    setOpponentCard((prev) => ({
      ...prev,
      health: 100,
      mana: 4,
      defense: 8,
    }))
    setBattleLog(["New battle started!"])
  }

  const addToBattleLog = (message: string) => {
    setBattleLog((prev) => [...prev, message])
  }

  useEffect(() => {
    setBattleLog(["Battle started! Defeat your opponent!"])
  }, [])

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-indigo-950 to-purple-900 text-white p-4">
      {/* Game Header */}
      <div className="flex justify-between items-center mb-8 mt-6 px-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-900 px-4 py-2 rounded-md">Turn {turn}</div>
          <div className="flex items-center gap-2 bg-blue-900 px-4 py-2 rounded-md">
            <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            Energy: {energy}/{maxEnergy}
          </div>
          <div className="bg-blue-900 px-4 py-2 rounded-md">Combo: x{combo}</div>
        </div>
        <div className="flex items-center gap-2 bg-blue-900 px-4 py-2 rounded-md">
          <span className="text-yellow-400">🪙</span> {gold} GOLD
        </div>
      </div>

      {/* Game Title */}
      <h1 className="text-5xl font-bold text-center mb-10 font-['Orbitron',sans-serif] tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
        Battle Arena
      </h1>

      {/* Card Battle Area */}
      <div className="flex justify-center gap-16 mb-8">
        {/* Player Card */}
        <div className={`relative w-64 h-96 rounded-xl overflow-hidden border-4 border-yellow-500`}>
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-600/30 to-yellow-900/30"></div>
          <div className="absolute top-0 left-0 w-full h-full p-4 flex flex-col">
            <div className="flex justify-center mb-2">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-yellow-100 border-2 border-yellow-500">
                <img
                  src={playerCard.image || "/placeholder.svg"}
                  alt={playerCard.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Sword className="h-5 w-5 text-red-500" />
                <span>ATK: {playerCard.attack}</span>
                <Shield className="h-5 w-5 ml-4 text-blue-400" />
                <span>DEF: {playerCard.defense}</span>
              </div>

              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                <span>HP: {playerCard.health}</span>
                <Zap className="h-5 w-5 ml-4 text-yellow-400 fill-yellow-400" />
                <span>MP: {playerCard.mana}</span>
              </div>

              <div className="mt-4">
                <p className="font-semibold">Special Abilities:</p>
                <ul className="pl-2">
                  {playerCard.abilities.map((ability, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <span className="text-yellow-400">•</span> {ability}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Opponent Card */}
        <div className={`relative w-64 h-96 rounded-xl overflow-hidden border-4 border-gray-400`}>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-600/30 to-gray-900/30"></div>
          <div className="absolute top-0 left-0 w-full h-full p-4 flex flex-col">
            <div className="flex justify-center mb-2">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-400">
                <img
                  src={opponentCard.image || "/placeholder.svg"}
                  alt={opponentCard.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <Sword className="h-5 w-5 text-red-500" />
                <span>ATK: {opponentCard.attack}</span>
                <Shield className="h-5 w-5 ml-4 text-blue-400" />
                <span>DEF: {opponentCard.defense}</span>
              </div>

              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                <span>HP: {opponentCard.health}</span>
                <Zap className="h-5 w-5 ml-4 text-yellow-400 fill-yellow-400" />
                <span>MP: {opponentCard.mana}</span>
              </div>

              <div className="mt-4">
                <p className="font-semibold">Special Abilities:</p>
                <ul className="pl-2">
                  {opponentCard.abilities.map((ability, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <span className="text-blue-400">•</span> {ability}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - First Row */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        <button
          onClick={() => performAction("attack", 2)}
          className="bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <Sword className="h-5 w-5" /> Attack (2 Mana)
        </button>

        <button
          onClick={() => performAction("heal", 3)}
          className="bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <Heart className="h-5 w-5" /> Heal (3 Mana)
        </button>

        <button
          onClick={() => performAction("special", 5)}
          className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <Zap className="h-5 w-5" /> Special (5 Mana)
        </button>

        <button
          onClick={() => performAction("charge", 0)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <Zap className="h-5 w-5" /> Charge Mana
        </button>

        <button
          onClick={() => performAction("shield", 4)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <Shield className="h-5 w-5" /> Shield (4 Mana)
        </button>
      </div>

      {/* Action Buttons - Second Row */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <button
          onClick={() => performAction("lazy_attack", 2, 30)}
          className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <FastForward className="h-5 w-5" /> Lazy Attack (2 Mana, 30 GOLD)
        </button>

        <button
          onClick={() => performAction("cat_nap", 4, 80)}
          className="bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <Moon className="h-5 w-5" /> Cat Nap (4 Mana, 80 GOLD)
        </button>

        <button
          onClick={() => performAction("pizza_power", 6, 150)}
          className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <Pizza className="h-5 w-5" /> Pizza Power (6 Mana, 150 GOLD)
        </button>

        <button
          onClick={() => performAction("pass", 0)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <SkipForward className="h-5 w-5" /> Pass Turn
        </button>

        <button
          onClick={() => performAction("clear", 0)}
          className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
        >
          <FileText className="h-5 w-5" /> Clear Log
        </button>
      </div>

      {/* Battle Log */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Battle Log:</h3>
        <div className="bg-gray-900/50 p-4 rounded-md h-32 overflow-y-auto">
          {battleLog.map((log, index) => (
            <p
              key={index}
              className={cn(
                "mb-1",
                log.includes("Victory") && "text-green-400 font-bold",
                log.includes("Defeat") && "text-red-400 font-bold",
                log.includes("earned") && "text-yellow-400",
              )}
            >
              {log}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
