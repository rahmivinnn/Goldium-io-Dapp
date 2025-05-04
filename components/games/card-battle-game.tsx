"use client"

import { useState, useEffect, useRef } from "react"
import { Shield, Zap, Heart, Sword, FastForward, Pizza, Moon, SkipForward, FileText, Trophy, Star, Flame, Lightning, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

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

// Helper function for visual effects
const createBattleEffect = (type: string) => {
  // Visual effects are handled by CSS animations
  console.log(`Battle effect: ${type}`);
};

export default function CardBattleGame() {
  // Game state
  const [turn, setTurn] = useState(1)
  const [energy, setEnergy] = useState(3)
  const [maxEnergy, setMaxEnergy] = useState(10)
  const [combo, setCombo] = useState(0)
  const [gold, setGold] = useState(1000)
  const [battleLog, setBattleLog] = useState<string[]>([])

  // Animation and visual effects
  const [showActionPopup, setShowActionPopup] = useState(false)
  const [actionPopupText, setActionPopupText] = useState("")
  const [actionPopupType, setActionPopupType] = useState<"attack" | "heal" | "special" | "shield" | "victory" | "defeat" | "">("")
  const [showPlayerAnimation, setShowPlayerAnimation] = useState(false)
  const [showOpponentAnimation, setShowOpponentAnimation] = useState(false)
  const [playerAnimationType, setPlayerAnimationType] = useState<"attack" | "heal" | "special" | "shield" | "damage" | "">("")
  const [opponentAnimationType, setOpponentAnimationType] = useState<"attack" | "damage" | "">("")
  const [showVictory, setShowVictory] = useState(false)
  const [showDefeat, setShowDefeat] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [rewardAmount, setRewardAmount] = useState(0)

  // Refs for animations
  const playerCardRef = useRef<HTMLDivElement>(null)
  const opponentCardRef = useRef<HTMLDivElement>(null)

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

  // Show action popup with animation
  const showActionEffect = (text: string, type: "attack" | "heal" | "special" | "shield" | "victory" | "defeat") => {
    setActionPopupText(text)
    setActionPopupType(type)
    setShowActionPopup(true)

    // Create visual effect
    createBattleEffect(type)

    // Hide popup after 2 seconds
    setTimeout(() => {
      setShowActionPopup(false)
      setActionPopupText("")
      setActionPopupType("")
    }, 2000)
  }

  // Show player animation
  const showPlayerAction = (type: "attack" | "heal" | "special" | "shield" | "damage") => {
    setPlayerAnimationType(type)
    setShowPlayerAnimation(true)

    // Hide animation after 1 second
    setTimeout(() => {
      setShowPlayerAnimation(false)
      setPlayerAnimationType("")
    }, 1000)
  }

  // Show opponent animation
  const showOpponentAction = (type: "attack" | "damage") => {
    setOpponentAnimationType(type)
    setShowOpponentAnimation(true)

    // Hide animation after 1 second
    setTimeout(() => {
      setShowOpponentAnimation(false)
      setOpponentAnimationType("")
    }, 1000)
  }

  const performAction = (action: string, manaCost: number, goldCost = 0) => {
    if (energy < manaCost) {
      addToBattleLog("Not enough energy!")
      showActionEffect("Not enough energy!", "defeat")
      return
    }

    if (gold < goldCost) {
      addToBattleLog("Not enough gold!")
      showActionEffect("Not enough gold!", "defeat")
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

        // Show attack animation and effect
        showPlayerAction("attack")
        showOpponentAction("damage")
        showActionEffect(`${damage} DAMAGE!`, "attack")
        break

      case "heal":
        const healAmount = 15
        setPlayerCard((prev) => ({
          ...prev,
          health: Math.min(100, prev.health + healAmount),
        }))
        addToBattleLog(`You healed for ${healAmount} health!`)

        // Show heal animation and effect
        showPlayerAction("heal")
        showActionEffect(`+${healAmount} HEALTH!`, "heal")
        break

      case "special":
        const specialDamage = Math.round(playerCard.attack * 1.5)
        setOpponentCard((prev) => ({
          ...prev,
          health: Math.max(0, prev.health - specialDamage),
        }))
        addToBattleLog(`Special attack dealt ${specialDamage} damage!`)
        setCombo((prev) => prev + 2)

        // Show special attack animation and effect
        showPlayerAction("special")
        showOpponentAction("damage")
        showActionEffect(`${specialDamage} CRITICAL!`, "special")
        break

      case "charge":
        const energyGain = 2
        setEnergy((prev) => Math.min(maxEnergy, prev + energyGain))
        addToBattleLog(`Charged ${energyGain} energy!`)

        // Show charge animation and effect
        showPlayerAction("special")
        showActionEffect(`+${energyGain} ENERGY!`, "special")
        break

      case "shield":
        const defenseGain = 2
        setPlayerCard((prev) => ({
          ...prev,
          defense: prev.defense + defenseGain,
        }))
        addToBattleLog(`Defense increased by ${defenseGain}!`)

        // Show shield animation and effect
        showPlayerAction("shield")
        showActionEffect(`+${defenseGain} DEFENSE!`, "shield")
        break

      case "lazy_attack":
        const lazyDamage = Math.max(1, Math.round(playerCard.attack / 2))
        setOpponentCard((prev) => ({
          ...prev,
          health: Math.max(0, prev.health - lazyDamage),
        }))
        addToBattleLog(`Lazy attack dealt ${lazyDamage} damage!`)

        // Show lazy attack animation and effect
        showPlayerAction("attack")
        showOpponentAction("damage")
        showActionEffect(`${lazyDamage} LAZY DAMAGE!`, "attack")
        break

      case "cat_nap":
        const napHealth = 10
        const napMana = 2
        setPlayerCard((prev) => ({
          ...prev,
          health: Math.min(100, prev.health + napHealth),
          mana: Math.min(10, prev.mana + napMana),
        }))
        addToBattleLog(`Cat nap restored ${napHealth} health and ${napMana} mana!`)

        // Show cat nap animation and effect
        showPlayerAction("heal")
        showActionEffect(`CAT NAP! +${napHealth} HP, +${napMana} MP`, "heal")
        break

      case "pizza_power":
        const pizzaAttack = 3
        const pizzaHealth = 20
        setPlayerCard((prev) => ({
          ...prev,
          attack: prev.attack + pizzaAttack,
          health: Math.min(100, prev.health + pizzaHealth),
        }))
        addToBattleLog(`Pizza power increased attack by ${pizzaAttack} and restored ${pizzaHealth} health!`)

        // Show pizza power animation and effect
        showPlayerAction("special")
        showActionEffect(`PIZZA POWER! +${pizzaAttack} ATK, +${pizzaHealth} HP`, "special")
        break

      case "pass":
        endTurn()
        break

      case "clear":
        setBattleLog([])
        break
    }

    // Check if opponent is defeated
    if (action !== "clear" && action !== "pass" && opponentCard.health <= 0) {
      const reward = 200 + combo * 50

      // Show victory animation and effect
      setTimeout(() => {
        setShowVictory(true)
        setRewardAmount(reward)
        setShowReward(true)
        showActionEffect("VICTORY!", "victory")
        addToBattleLog("Victory! You defeated your opponent!")
        addToBattleLog(`You earned ${reward} GOLD!`)
        setGold((prev) => prev + reward)

        // Reset game after 3 seconds
        setTimeout(() => {
          setShowVictory(false)
          setShowReward(false)
          resetGame()
        }, 3000)
      }, 500)
    }
  }

  const endTurn = () => {
    // Opponent's turn logic
    if (opponentCard.health > 0) {
      // Add a slight delay before opponent's attack
      setTimeout(() => {
        const opponentDamage = Math.max(1, opponentCard.attack - playerCard.defense / 2)
        setPlayerCard((prev) => ({
          ...prev,
          health: Math.max(0, prev.health - opponentDamage),
        }))
        addToBattleLog(`Opponent attacked for ${opponentDamage} damage!`)

        // Show opponent attack animation and effect
        showOpponentAction("attack")
        showPlayerAction("damage")
        showActionEffect(`${opponentDamage} DAMAGE!`, "attack")

        // Check if player is defeated
        if (playerCard.health - opponentDamage <= 0) {
          // Show defeat animation and effect after a delay
          setTimeout(() => {
            setShowDefeat(true)
            showActionEffect("DEFEAT!", "defeat")
            addToBattleLog("Defeat! Your card was destroyed!")

            // Reset game after 3 seconds
            setTimeout(() => {
              setShowDefeat(false)
              resetGame()
            }, 3000)
          }, 500)
        } else {
          // Next turn if not defeated
          setTurn((prev) => prev + 1)
          setEnergy(Math.min(maxEnergy, energy + 3))
          setCombo(0)

          // Show turn change popup
          setTimeout(() => {
            showActionEffect(`TURN ${turn + 1}!`, "special")
          }, 500)
        }
      }, 500)
    } else {
      // Next turn if opponent is already defeated
      setTurn((prev) => prev + 1)
      setEnergy(Math.min(maxEnergy, energy + 3))
      setCombo(0)
    }
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
    <div className="w-full text-white relative">
      {/* Action Popup */}
      <AnimatePresence>
        {showActionPopup && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className={`px-8 py-4 rounded-lg text-center text-white font-bold text-3xl ${
              actionPopupType === "attack" ? "bg-red-600/80" :
              actionPopupType === "heal" ? "bg-green-600/80" :
              actionPopupType === "special" ? "bg-purple-600/80" :
              actionPopupType === "shield" ? "bg-yellow-600/80" :
              actionPopupType === "victory" ? "bg-gradient-to-r from-yellow-500 via-gold to-yellow-500" :
              actionPopupType === "defeat" ? "bg-red-800/80" : "bg-blue-600/80"
            } shadow-lg`}>
              {actionPopupText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Victory Overlay */}
      <AnimatePresence>
        {showVictory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-40 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.5, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-gold to-yellow-500 mb-8"
            >
              VICTORY!
            </motion.div>

            {showReward && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-bold text-center"
              >
                <span className="text-gold">+{rewardAmount}</span> GOLD
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Defeat Overlay */}
      <AnimatePresence>
        {showDefeat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.5, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700"
            >
              DEFEAT!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-black/40 border border-gold/20 px-4 py-2 rounded-md">
            <span className="font-medium">Turn</span> <span className="text-gold">{turn}</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 border border-gold/20 px-4 py-2 rounded-md">
            <Zap className="h-5 w-5 text-gold" />
            <span className="font-medium">Energy:</span> <span className="text-gold">{energy}/{maxEnergy}</span>
          </div>
          <div className="bg-black/40 border border-gold/20 px-4 py-2 rounded-md">
            <span className="font-medium">Combo:</span> <span className={`${combo > 0 ? 'text-orange-400 font-bold' : 'text-gold'}`}>x{combo}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-black/40 border border-gold/20 px-4 py-2 rounded-md">
          <span className="text-gold">🪙</span> <span className="font-bold text-gold">{gold} GOLD</span>
        </div>
      </div>

      {/* Game Title */}
      <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
        Battle Arena
      </h2>

      {/* Card Battle Area */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-16 mb-8">
        {/* Player Card */}
        <motion.div
          ref={playerCardRef}
          animate={
            showPlayerAnimation
              ? playerAnimationType === "attack"
                ? { x: [0, 30, 0], rotate: [0, 5, 0] }
                : playerAnimationType === "heal"
                  ? { scale: [1, 1.05, 1], boxShadow: ["0 0 0 rgba(0,255,0,0)", "0 0 20px rgba(0,255,0,0.5)", "0 0 0 rgba(0,255,0,0)"] }
                  : playerAnimationType === "special"
                    ? { rotate: [0, -5, 5, -5, 0], scale: [1, 1.1, 1] }
                    : playerAnimationType === "shield"
                      ? { scale: [1, 1.05, 1], boxShadow: ["0 0 0 rgba(255,255,0,0)", "0 0 20px rgba(255,255,0,0.5)", "0 0 0 rgba(255,255,0,0)"] }
                      : playerAnimationType === "damage"
                        ? { x: [0, -10, 10, -10, 0], y: [0, -5, 5, -5, 0] }
                        : {}
              : {}
          }
          transition={{ duration: 0.5 }}
          className={`relative w-64 h-96 rounded-xl overflow-hidden border-2 border-gold shadow-lg shadow-gold/20 transition-all hover:shadow-gold/30 hover:scale-105`}
        >
          {/* Health bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
              style={{ width: `${(playerCard.health / 100) * 100}%` }}
            ></div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-yellow-600/20 to-yellow-900/20"></div>

          {/* Animation overlays */}
          {showPlayerAnimation && playerAnimationType === "heal" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0] }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-green-500/30 z-10"
            >
              <div className="h-full w-full flex items-center justify-center">
                <Heart className="h-20 w-20 text-green-500 fill-green-500 animate-pulse" />
              </div>
            </motion.div>
          )}

          {showPlayerAnimation && playerAnimationType === "shield" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0] }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-yellow-500/30 z-10"
            >
              <div className="h-full w-full flex items-center justify-center">
                <Shield className="h-20 w-20 text-yellow-500 animate-pulse" />
              </div>
            </motion.div>
          )}

          {showPlayerAnimation && playerAnimationType === "special" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0] }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-purple-500/30 z-10"
            >
              <div className="h-full w-full flex items-center justify-center">
                <Sparkles className="h-20 w-20 text-purple-500 animate-pulse" />
              </div>
            </motion.div>
          )}

          {showPlayerAnimation && playerAnimationType === "damage" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0] }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-red-500/50 z-10"
            />
          )}

          <div className="absolute top-0 left-0 w-full h-full p-4 flex flex-col">
            <div className="flex justify-center mb-2">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-black/60 border-2 border-gold p-0.5">
                <div className="w-full h-full rounded-full bg-black/60 flex items-center justify-center overflow-hidden">
                  <img
                    src={playerCard.image || "/placeholder.svg"}
                    alt={playerCard.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-center text-lg font-bold text-gold mb-2">{playerCard.name}</h3>

            <div className="mt-2 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/40 rounded-md p-2 flex items-center gap-2">
                  <Sword className="h-5 w-5 text-red-500" />
                  <span>ATK: <span className="text-red-400 font-bold">{playerCard.attack}</span></span>
                </div>
                <div className="bg-black/40 rounded-md p-2 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <span>DEF: <span className="text-blue-400 font-bold">{playerCard.defense}</span></span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/40 rounded-md p-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  <span>HP: <span className="text-red-400 font-bold">{playerCard.health}</span></span>
                </div>
                <div className="bg-black/40 rounded-md p-2 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-gold" />
                  <span>MP: <span className="text-gold font-bold">{playerCard.mana}</span></span>
                </div>
              </div>

              <div className="bg-black/40 rounded-md p-2">
                <p className="font-semibold text-sm text-gold mb-1">Special Abilities:</p>
                <ul className="pl-2 text-xs space-y-1">
                  {playerCard.abilities.map((ability, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <span className="text-gold">•</span> {ability}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* VS Badge */}
        <motion.div
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="flex flex-col items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            VS
          </div>
        </motion.div>

        {/* Opponent Card */}
        <motion.div
          ref={opponentCardRef}
          animate={
            showOpponentAnimation
              ? opponentAnimationType === "attack"
                ? { x: [0, -30, 0], rotate: [0, -5, 0] }
                : opponentAnimationType === "damage"
                  ? { x: [0, 10, -10, 10, 0], y: [0, -5, 5, -5, 0] }
                  : {}
              : {}
          }
          transition={{ duration: 0.5 }}
          className={`relative w-64 h-96 rounded-xl overflow-hidden border-2 border-gray-400 shadow-lg shadow-gray-500/20 transition-all hover:shadow-gray-400/30 hover:scale-105`}
        >
          {/* Health bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-800">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
              style={{ width: `${(opponentCard.health / 100) * 100}%` }}
            ></div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-gray-600/20 to-gray-900/20"></div>

          {/* Animation overlays */}
          {showOpponentAnimation && opponentAnimationType === "damage" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0] }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-red-500/50 z-10"
            />
          )}

          <div className="absolute top-0 left-0 w-full h-full p-4 flex flex-col">
            <div className="flex justify-center mb-2">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-black/60 border-2 border-gray-400 p-0.5">
                <div className="w-full h-full rounded-full bg-black/60 flex items-center justify-center overflow-hidden">
                  <img
                    src={opponentCard.image || "/placeholder.svg"}
                    alt={opponentCard.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-center text-lg font-bold text-gray-300 mb-2">{opponentCard.name}</h3>

            <div className="mt-2 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/40 rounded-md p-2 flex items-center gap-2">
                  <Sword className="h-5 w-5 text-red-500" />
                  <span>ATK: <span className="text-red-400 font-bold">{opponentCard.attack}</span></span>
                </div>
                <div className="bg-black/40 rounded-md p-2 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  <span>DEF: <span className="text-blue-400 font-bold">{opponentCard.defense}</span></span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/40 rounded-md p-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  <span>HP: <span className="text-red-400 font-bold">{opponentCard.health}</span></span>
                </div>
                <div className="bg-black/40 rounded-md p-2 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-gold" />
                  <span>MP: <span className="text-gold font-bold">{opponentCard.mana}</span></span>
                </div>
              </div>

              <div className="bg-black/40 rounded-md p-2">
                <p className="font-semibold text-sm text-gray-300 mb-1">Special Abilities:</p>
                <ul className="pl-2 text-xs space-y-1">
                  {opponentCard.abilities.map((ability, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <span className="text-blue-400">•</span> {ability}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-3 text-gold">Basic Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
          <button
            onClick={() => performAction("attack", 2)}
            className="bg-black/40 border border-red-500/50 hover:bg-red-500/20 text-white py-3 px-4 rounded-md flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
            disabled={energy < 2}
          >
            <Sword className="h-6 w-6 text-red-500" />
            <span className="font-bold">Attack</span>
            <span className="text-xs flex items-center"><Zap className="h-3 w-3 text-gold mr-1" /> 2</span>
          </button>

          <button
            onClick={() => performAction("heal", 3)}
            className="bg-black/40 border border-green-500/50 hover:bg-green-500/20 text-white py-3 px-4 rounded-md flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
            disabled={energy < 3}
          >
            <Heart className="h-6 w-6 text-green-500" />
            <span className="font-bold">Heal</span>
            <span className="text-xs flex items-center"><Zap className="h-3 w-3 text-gold mr-1" /> 3</span>
          </button>

          <button
            onClick={() => performAction("special", 5)}
            className="bg-black/40 border border-purple-500/50 hover:bg-purple-500/20 text-white py-3 px-4 rounded-md flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
            disabled={energy < 5}
          >
            <Zap className="h-6 w-6 text-purple-500" />
            <span className="font-bold">Special</span>
            <span className="text-xs flex items-center"><Zap className="h-3 w-3 text-gold mr-1" /> 5</span>
          </button>

          <button
            onClick={() => performAction("charge", 0)}
            className="bg-black/40 border border-blue-500/50 hover:bg-blue-500/20 text-white py-3 px-4 rounded-md flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
          >
            <Zap className="h-6 w-6 text-blue-500" />
            <span className="font-bold">Charge</span>
            <span className="text-xs flex items-center"><Zap className="h-3 w-3 text-gold mr-1" /> 0</span>
          </button>

          <button
            onClick={() => performAction("shield", 4)}
            className="bg-black/40 border border-yellow-500/50 hover:bg-yellow-500/20 text-white py-3 px-4 rounded-md flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
            disabled={energy < 4}
          >
            <Shield className="h-6 w-6 text-yellow-500" />
            <span className="font-bold">Shield</span>
            <span className="text-xs flex items-center"><Zap className="h-3 w-3 text-gold mr-1" /> 4</span>
          </button>
        </div>

        <h3 className="text-xl font-bold mb-3 text-gold">Special Abilities</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
          <button
            onClick={() => performAction("lazy_attack", 2, 30)}
            className="bg-black/40 border border-orange-500/50 hover:bg-orange-500/20 text-white py-3 px-4 rounded-md flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
            disabled={energy < 2 || gold < 30}
          >
            <FastForward className="h-6 w-6 text-orange-500" />
            <span className="font-bold">Lazy Attack</span>
            <div className="flex items-center text-xs gap-2">
              <span className="flex items-center"><Zap className="h-3 w-3 text-gold mr-1" /> 2</span>
              <span className="flex items-center">🪙 30</span>
            </div>
          </button>

          <button
            onClick={() => performAction("cat_nap", 4, 80)}
            className="bg-black/40 border border-teal-500/50 hover:bg-teal-500/20 text-white py-3 px-4 rounded-md flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
            disabled={energy < 4 || gold < 80}
          >
            <Moon className="h-6 w-6 text-teal-500" />
            <span className="font-bold">Cat Nap</span>
            <div className="flex items-center text-xs gap-2">
              <span className="flex items-center"><Zap className="h-3 w-3 text-gold mr-1" /> 4</span>
              <span className="flex items-center">🪙 80</span>
            </div>
          </button>

          <button
            onClick={() => performAction("pizza_power", 6, 150)}
            className="bg-black/40 border border-pink-500/50 hover:bg-pink-500/20 text-white py-3 px-4 rounded-md flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
            disabled={energy < 6 || gold < 150}
          >
            <Pizza className="h-6 w-6 text-pink-500" />
            <span className="font-bold">Pizza Power</span>
            <div className="flex items-center text-xs gap-2">
              <span className="flex items-center"><Zap className="h-3 w-3 text-gold mr-1" /> 6</span>
              <span className="flex items-center">🪙 150</span>
            </div>
          </button>

          <button
            onClick={() => performAction("pass", 0)}
            className="bg-black/40 border border-indigo-500/50 hover:bg-indigo-500/20 text-white py-3 px-4 rounded-md flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
          >
            <SkipForward className="h-6 w-6 text-indigo-500" />
            <span className="font-bold">Pass Turn</span>
            <span className="text-xs">End your turn</span>
          </button>

          <button
            onClick={() => performAction("clear", 0)}
            className="bg-black/40 border border-gray-500/50 hover:bg-gray-500/20 text-white py-3 px-4 rounded-md flex flex-col items-center justify-center gap-1 transition-all hover:scale-105"
          >
            <FileText className="h-6 w-6 text-gray-400" />
            <span className="font-bold">Clear Log</span>
            <span className="text-xs">Clear battle log</span>
          </button>
        </div>
      </div>

      {/* Battle Log */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-3 text-gold flex items-center">
          <FileText className="h-5 w-5 mr-2" /> Battle Log
        </h3>
        <div className="bg-black/40 border border-gold/20 p-4 rounded-md h-40 overflow-y-auto">
          {battleLog.length > 0 ? (
            battleLog.map((log, index) => (
              <p
                key={index}
                className={cn(
                  "mb-1 px-2 py-1 rounded",
                  log.includes("Victory") && "text-green-400 font-bold bg-green-900/20",
                  log.includes("Defeat") && "text-red-400 font-bold bg-red-900/20",
                  log.includes("earned") && "text-yellow-400 bg-yellow-900/20",
                  log.includes("attacked") && "text-red-300",
                  log.includes("healed") && "text-green-300",
                  log.includes("energy") && "text-blue-300",
                  log.includes("Special") && "text-purple-300",
                  log.includes("Not enough") && "text-gray-400 italic",
                )}
              >
                {log}
              </p>
            ))
          ) : (
            <p className="text-gray-400 italic">No battle logs yet. Start the battle!</p>
          )}
        </div>
      </div>
    </div>
  )
}
