"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useGameContext, type BossAttackType } from "./game-context"
import { Howl } from "howler"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Shield, Sword, Zap, Heart, Award } from "lucide-react"
import confetti from "canvas-confetti"

// Sound effects
const BOSS_SOUNDS = {
  attack: new Howl({ src: ["/sounds/boss-attack.mp3"], volume: 0.5 }),
  hit: new Howl({ src: ["/sounds/boss-hit.mp3"], volume: 0.4 }),
  death: new Howl({ src: ["/sounds/boss-death.mp3"], volume: 0.7 }),
  special: new Howl({ src: ["/sounds/boss-special.mp3"], volume: 0.6 }),
}

// Define boss types with their properties
const BOSSES = {
  "Emerald Isle": {
    name: "Ancient Guardian",
    health: 1000,
    damage: 25,
    defense: 15,
    image: "/bosses/ancient-guardian.png",
    abilities: [
      { name: "Earthen Slam", damage: 40, cooldown: 3 },
      { name: "Stone Shield", effect: "defense+20", cooldown: 4 },
      { name: "Root Entangle", effect: "stun", cooldown: 5 },
    ],
    rewards: {
      gold: 500,
      experience: 1000,
      item: { name: "Guardian's Heart Stone", rarity: "Epic", image: "/items/heart-stone.png" },
    },
  },
  "Crystal Caverns": {
    name: "Crystal Colossus",
    health: 1200,
    damage: 30,
    defense: 20,
    image: "/bosses/crystal-colossus.png",
    abilities: [
      { name: "Prismatic Beam", damage: 50, cooldown: 4 },
      { name: "Crystal Armor", effect: "defense+25", cooldown: 5 },
      { name: "Shatter Burst", damage: 35, aoe: true, cooldown: 6 },
    ],
    rewards: {
      gold: 750,
      experience: 1500,
      item: { name: "Prismatic Core", rarity: "Legendary", image: "/items/prismatic-core.png" },
    },
  },
  "Volcanic Summit": {
    name: "Inferno Dragon",
    health: 1500,
    damage: 40,
    defense: 15,
    image: "/bosses/inferno-dragon.png",
    abilities: [
      { name: "Dragon Breath", damage: 60, cooldown: 4 },
      { name: "Molten Scales", effect: "defense+15,reflect:10", cooldown: 5 },
      { name: "Volcanic Eruption", damage: 45, aoe: true, cooldown: 7 },
    ],
    rewards: {
      gold: 1000,
      experience: 2000,
      item: { name: "Dragon's Heart Ember", rarity: "Mythic", image: "/items/dragon-ember.png" },
    },
  },
}

// Generate a placeholder image for bosses
const getBossImageUrl = (bossName: string) => {
  return `/placeholder.svg?height=400&width=400&query=fantasy game boss ${bossName}`
}

// Generate a placeholder image for items
const getItemImageUrl = (itemName: string) => {
  return `/placeholder.svg?height=200&width=200&query=fantasy game item ${itemName}`
}

interface BossBattleProps {
  bossId?: string
  playerPosition?: THREE.Vector3
  playerRotation?: number
  isAttacking?: boolean
  onDamagePlayer?: (amount: number) => void
  onComplete?: () => void
}

export default function BossBattle({
  bossId,
  playerPosition,
  playerRotation,
  isAttacking,
  onDamagePlayer,
  onComplete,
}: BossBattleProps) {
  const {
    dealDamageToBoss,
    getBossById,
    endBossBattle,
    currentIsland,
    character,
    updateCharacterStats,
    addInventoryItem,
  } = useGameContext()

  const [bossState, setBossState] = useState(() => {
    const boss = BOSSES[currentIsland as keyof typeof BOSSES]
    return {
      ...boss,
      currentHealth: boss.health,
      abilities: boss.abilities.map((ability) => ({ ...ability, cooldown: 0 })),
      image: getBossImageUrl(boss.name),
    }
  })

  const [playerState, setPlayerState] = useState({
    health: character.health,
    maxHealth: character.maxHealth,
    mana: character.mana,
    maxMana: character.maxMana,
    defense: character.defense,
    stunned: false,
    buffs: [],
  })

  const [battleLog, setBattleLog] = useState<string[]>([`The ${bossState.name} appears before you!`])
  const [showRewards, setShowRewards] = useState(false)
  const [currentTurn, setCurrentTurn] = useState<"player" | "boss">("player")
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [actionCooldowns, setActionCooldowns] = useState<Record<string, number>>({
    "Heavy Attack": 0,
    "Defensive Stance": 0,
    "Special Ability": 0,
  })

  const logEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of battle log when it updates
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [battleLog])

  // Handle boss defeat
  useEffect(() => {
    if (bossState.currentHealth <= 0) {
      setBattleLog((prev) => [...prev, `You have defeated the ${bossState.name}!`])
      setTimeout(() => {
        setShowRewards(true)
        // Trigger confetti effect
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      }, 1500)
    }
  }, [bossState.currentHealth, bossState.name])

  // Handle player defeat
  useEffect(() => {
    if (playerState.health <= 0) {
      setBattleLog((prev) => [...prev, "You have been defeated! Try again..."])
      setTimeout(() => {
        // Reset the battle
        setBossState((prev) => ({ ...prev, currentHealth: prev.health }))
        setPlayerState((prev) => ({
          ...prev,
          health: character.maxHealth,
          mana: character.maxMana,
          stunned: false,
          buffs: [],
        }))
        setBattleLog([`The ${bossState.name} appears before you!`])
        setCurrentTurn("player")
      }, 3000)
    }
  }, [playerState.health, bossState.name, character.maxHealth, character.maxMana])

  // Handle boss turn
  useEffect(() => {
    if (currentTurn === "boss" && bossState.currentHealth > 0 && playerState.health > 0) {
      const bossAction = setTimeout(() => {
        // Choose a random ability or basic attack
        const availableAbilities = bossState.abilities.filter((ability) => ability.cooldown === 0)

        if (availableAbilities.length > 0 && Math.random() > 0.4) {
          // Use a special ability
          const abilityIndex = Math.floor(Math.random() * availableAbilities.length)
          const ability = availableAbilities[abilityIndex]

          // Update ability cooldowns
          setBossState((prev) => ({
            ...prev,
            abilities: prev.abilities.map((a) => (a.name === ability.name ? { ...a, cooldown: a.cooldown } : a)),
          }))

          // Apply ability effects
          if (ability.damage) {
            // Calculate damage after defense reduction
            const damageReduction = playerState.defense / 100
            const actualDamage = Math.max(1, Math.floor(ability.damage * (1 - damageReduction)))

            setPlayerState((prev) => ({
              ...prev,
              health: Math.max(0, prev.health - actualDamage),
            }))

            setBattleLog((prev) => [...prev, `${bossState.name} uses ${ability.name} for ${actualDamage} damage!`])
          } else if (ability.effect) {
            if (ability.effect === "stun") {
              setPlayerState((prev) => ({ ...prev, stunned: true }))
              setBattleLog((prev) => [...prev, `${bossState.name} uses ${ability.name}. You are stunned for 1 turn!`])
            } else if (ability.effect.includes("defense")) {
              const defenseBoost = Number.parseInt(ability.effect.split("+")[1])
              setBossState((prev) => ({ ...prev, defense: prev.defense + defenseBoost }))
              setBattleLog((prev) => [
                ...prev,
                `${bossState.name} uses ${ability.name}, increasing its defense by ${defenseBoost}!`,
              ])
            }
          }
        } else {
          // Basic attack
          const damageReduction = playerState.defense / 100
          const actualDamage = Math.max(1, Math.floor(bossState.damage * (1 - damageReduction)))

          setPlayerState((prev) => ({
            ...prev,
            health: Math.max(0, prev.health - actualDamage),
          }))

          setBattleLog((prev) => [...prev, `${bossState.name} attacks for ${actualDamage} damage!`])
        }

        // Reduce cooldowns for all abilities
        setBossState((prev) => ({
          ...prev,
          abilities: prev.abilities.map((ability) => ({
            ...ability,
            cooldown: Math.max(0, ability.cooldown - 1),
          })),
        }))

        // Check if player is still stunned
        if (playerState.stunned) {
          setPlayerState((prev) => ({ ...prev, stunned: false }))
          setBattleLog((prev) => [...prev, "You are no longer stunned."])
        }

        // End boss turn
        setCurrentTurn("player")

        // Reduce player action cooldowns
        setActionCooldowns((prev) => {
          const newCooldowns = { ...prev }
          Object.keys(newCooldowns).forEach((key) => {
            newCooldowns[key] = Math.max(0, newCooldowns[key] - 1)
          })
          return newCooldowns
        })
      }, 1500) // Delay for boss action

      return () => clearTimeout(bossAction)
    }
  }, [currentTurn, bossState, playerState])

  // Player actions
  const performAction = (actionType: string) => {
    if (currentTurn !== "player" || playerState.stunned || actionCooldowns[actionType] > 0) return

    setSelectedAction(actionType)

    switch (actionType) {
      case "Basic Attack":
        // Calculate damage based on character stats
        const baseDamage = character.attack
        const damageVariation = Math.floor(baseDamage * 0.2) // 20% variation
        const actualDamage = baseDamage + Math.floor(Math.random() * damageVariation)

        // Apply damage to boss
        setBossState((prev) => ({
          ...prev,
          currentHealth: Math.max(0, prev.currentHealth - actualDamage),
        }))

        setBattleLog((prev) => [...prev, `You attack the ${bossState.name} for ${actualDamage} damage!`])
        break

      case "Heavy Attack":
        // Heavy attack does more damage but has a cooldown
        const heavyDamage = Math.floor(character.attack * 1.8)

        // Apply damage to boss
        setBossState((prev) => ({
          ...prev,
          currentHealth: Math.max(0, prev.currentHealth - heavyDamage),
        }))

        setBattleLog((prev) => [
          ...prev,
          `You perform a Heavy Attack on the ${bossState.name} for ${heavyDamage} damage!`,
        ])

        // Set cooldown
        setActionCooldowns((prev) => ({ ...prev, "Heavy Attack": 2 }))
        break

      case "Defensive Stance":
        // Increase defense temporarily
        const defenseBoost = Math.floor(character.defense * 0.5)

        setPlayerState((prev) => ({
          ...prev,
          defense: prev.defense + defenseBoost,
          buffs: [...prev.buffs, { type: "defense", value: defenseBoost, duration: 2 }],
        }))

        setBattleLog((prev) => [
          ...prev,
          `You take a Defensive Stance, increasing your defense by ${defenseBoost} for 2 turns!`,
        ])

        // Set cooldown
        setActionCooldowns((prev) => ({ ...prev, "Defensive Stance": 3 }))
        break

      case "Special Ability":
        // Special ability based on character class
        let abilityDescription = ""
        const manaCost = 30

        if (playerState.mana < manaCost) {
          setBattleLog((prev) => [...prev, "Not enough mana for Special Ability!"])
          setSelectedAction(null)
          return
        }

        if (character.class === "Warrior") {
          // Warrior: Whirlwind attack (AoE damage)
          const whirlwindDamage = Math.floor(character.attack * 1.5)
          setBossState((prev) => ({
            ...prev,
            currentHealth: Math.max(0, prev.currentHealth - whirlwindDamage),
          }))
          abilityDescription = `You perform a Whirlwind Attack on the ${bossState.name} for ${whirlwindDamage} damage!`
        } else if (character.class === "Mage") {
          // Mage: Arcane Blast (high damage)
          const arcaneDamage = Math.floor(character.attack * 2.2)
          setBossState((prev) => ({
            ...prev,
            currentHealth: Math.max(0, prev.currentHealth - arcaneDamage),
          }))
          abilityDescription = `You cast Arcane Blast on the ${bossState.name} for ${arcaneDamage} damage!`
        } else if (character.class === "Rogue") {
          // Rogue: Backstab (critical hit)
          const backstabDamage = Math.floor(character.attack * 2.5)
          setBossState((prev) => ({
            ...prev,
            currentHealth: Math.max(0, prev.currentHealth - backstabDamage),
          }))
          abilityDescription = `You perform a Backstab on the ${bossState.name} for ${backstabDamage} critical damage!`
        }

        // Consume mana
        setPlayerState((prev) => ({
          ...prev,
          mana: Math.max(0, prev.mana - manaCost),
        }))

        setBattleLog((prev) => [...prev, abilityDescription])

        // Set cooldown
        setActionCooldowns((prev) => ({ ...prev, "Special Ability": 4 }))
        break

      case "Heal":
        // Heal if mana is available
        const manaCostHeal = 20
        const healAmount = Math.floor(character.maxHealth * 0.3)

        if (playerState.mana < manaCostHeal) {
          setBattleLog((prev) => [...prev, "Not enough mana to Heal!"])
          setSelectedAction(null)
          return
        }

        setPlayerState((prev) => ({
          ...prev,
          health: Math.min(character.maxHealth, prev.health + healAmount),
          mana: prev.mana - manaCostHeal,
        }))

        setBattleLog((prev) => [...prev, `You use a healing spell, restoring ${healAmount} health!`])
        break

      default:
        break
    }

    // End player turn after a delay
    setTimeout(() => {
      setSelectedAction(null)
      setCurrentTurn("boss")
    }, 1000)
  }

  // Claim rewards and complete the boss battle
  const claimRewards = () => {
    const boss = BOSSES[currentIsland as keyof typeof BOSSES]

    // Update character stats
    updateCharacterStats({
      gold: character.gold + boss.rewards.gold,
      experience: character.experience + boss.rewards.experience,
    })

    // Add reward item to inventory
    addInventoryItem({
      id: `boss-reward-${Date.now()}`,
      name: boss.rewards.item.name,
      type: "equipment",
      rarity: boss.rewards.item.rarity,
      image: getItemImageUrl(boss.rewards.item.name),
    })

    // Complete the boss battle
    if (onComplete) onComplete()
  }

  // Calculate boss health percentage
  const bossHealthPercentage = (bossState.currentHealth / bossState.health) * 100

  // Calculate player health percentage
  const playerHealthPercentage = (playerState.health / character.maxHealth) * 100

  // Calculate player mana percentage
  const playerManaPercentage = (playerState.mana / character.maxMana) * 100

  const [bossPosition, setBossPosition] = useState(() => new THREE.Vector3(0, 0, 0))
  const [bossRotation, setBossRotation] = useState(0)
  const [bossState3D, setBossState3D] = useState<"idle" | "attacking" | "damaged" | "charging" | "defeated">("idle")
  const [attackCooldown, setAttackCooldown] = useState(0)
  const [currentAttack, setCurrentAttack] = useState<BossAttackType | null>(null)
  const [attackTelegraph, setAttackTelegraph] = useState<{
    type: BossAttackType
    position: THREE.Vector3
    direction?: THREE.Vector3
    radius?: number
  } | null>(null)
  const [specialActive, setSpecialActive] = useState(false)
  const [projectiles, setProjectiles] = useState<
    {
      id: string
      position: THREE.Vector3
      direction: THREE.Vector3
      speed: number
      damage: number
      size: number
      color: string
      lifeTime: number
    }[]
  >([])

  // Boss mesh ref
  const bossRef = useRef<THREE.Group>(null)

  // Update boss rotation to face player
  useEffect(() => {
    if (!playerPosition) return
    const updateBossRotation = () => {
      const dx = playerPosition.x - bossPosition.x
      const dz = playerPosition.z - bossPosition.z
      setBossRotation(Math.atan2(dx, dz))
    }
    updateBossRotation()

    // Update periodically
    const interval = setInterval(updateBossRotation, 100)
    return () => clearInterval(interval)
  }, [playerPosition, bossPosition])

  // Handle player attack collision
  useEffect(() => {
    if (!isAttacking || !playerPosition) return
    // Check distance between player and boss
    const distance = playerPosition.distanceTo(bossPosition)
    if (distance < 3) {
      // Melee attack range
      // Calculate damage based on player stats (handled in the dealDamageToBoss function)
      const baseDamage = 20 // Base damage, will be modified by player stats
      if (dealDamageToBoss && bossId) {
        dealDamageToBoss(bossId, baseDamage)
      }
      setBossState3D("damaged")
      BOSS_SOUNDS.hit.play()

      // Reset state after hit animation
      setTimeout(() => {
        setBossState3D("idle")
      }, 500)
    }
  }, [isAttacking, playerPosition, bossPosition, bossId, dealDamageToBoss])

  // Boss AI system
  useFrame((state, delta) => {
    // Attack cooldown
    if (attackCooldown > 0) {
      setAttackCooldown((prev) => prev - delta)
    }

    // Update projectiles
    if (projectiles.length > 0) {
      setProjectiles((prev) =>
        prev
          .map((proj) => ({
            ...proj,
            position: proj.position.clone().add(proj.direction.clone().multiplyScalar(proj.speed * delta)),
            lifeTime: proj.lifeTime - delta,
          }))
          .filter((proj) => {
            if (!playerPosition) return false
            // Check if hit player
            const distToPlayer = proj.position.distanceTo(playerPosition)
            if (distToPlayer < 1.5) {
              if (onDamagePlayer) onDamagePlayer(proj.damage)
              return false
            }
            // Remove if lifetime is over
            return proj.lifeTime > 0
          }),
      )
    }
  })

  return (
    <div className="w-full h-full flex flex-col">
      {/* Boss battle UI */}
      <AnimatePresence>
        {!showRewards ? (
          <motion.div
            className="flex flex-col h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Boss info */}
            <div className="bg-black/70 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-red-500">{bossState.name}</h2>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400">{bossState.defense}</span>
                </div>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-4 mb-2">
                <div
                  className="bg-gradient-to-r from-red-700 to-red-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${bossHealthPercentage}%` }}
                ></div>
              </div>
              <div className="text-right text-sm text-red-400">
                {bossState.currentHealth} / {bossState.health} HP
              </div>
            </div>

            {/* Battle visualization */}
            <div className="flex-1 flex items-center justify-center my-4 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={bossState.image || "/placeholder.svg?height=400&width=400&query=fantasy boss"}
                  alt={bossState.name}
                  className="max-h-64 object-contain"
                />
              </div>

              {/* Attack animations */}
              <AnimatePresence>
                {selectedAction && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {selectedAction === "Basic Attack" && (
                      <motion.div
                        className="w-16 h-16 bg-yellow-500 rounded-full"
                        initial={{ scale: 0, x: -100, y: 50 }}
                        animate={{ scale: 1.5, x: 0, y: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                    {selectedAction === "Heavy Attack" && (
                      <motion.div
                        className="w-24 h-24 bg-orange-600 rounded-full"
                        initial={{ scale: 0, x: -100, y: 50 }}
                        animate={{ scale: 2, x: 0, y: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                    {selectedAction === "Special Ability" && (
                      <motion.div
                        className="w-32 h-32 bg-purple-600 rounded-full"
                        initial={{ scale: 0, opacity: 0.8 }}
                        animate={{ scale: 2, opacity: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.7, repeat: 1 }}
                      />
                    )}
                    {selectedAction === "Heal" && (
                      <motion.div
                        className="w-32 h-32 bg-green-500 rounded-full"
                        initial={{ scale: 0, opacity: 0.8 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.7, repeat: 1 }}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Battle log */}
            <div className="bg-black/70 p-2 rounded-lg mb-4 h-24 overflow-y-auto">
              {battleLog.map((log, index) => (
                <p key={index} className="text-sm text-gray-300">
                  {log}
                </p>
              ))}
              <div ref={logEndRef} />
            </div>

            {/* Player info */}
            <div className="bg-black/70 p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-green-500">{character.name}</h3>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-400">{playerState.defense}</span>
                </div>
              </div>

              {/* Health bar */}
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-red-500" />
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-red-600 to-red-400 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${playerHealthPercentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-red-400">
                  {playerState.health}/{character.maxHealth}
                </span>
              </div>

              {/* Mana bar */}
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${playerManaPercentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-blue-400">
                  {playerState.mana}/{character.maxMana}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 mt-auto">
              <Button
                variant="default"
                onClick={() => performAction("Basic Attack")}
                disabled={currentTurn !== "player" || playerState.stunned}
                className="bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500"
              >
                <Sword className="mr-2 h-4 w-4" /> Basic Attack
              </Button>

              <Button
                variant="default"
                onClick={() => performAction("Heavy Attack")}
                disabled={currentTurn !== "player" || playerState.stunned || actionCooldowns["Heavy Attack"] > 0}
                className="bg-gradient-to-r from-orange-700 to-orange-600 hover:from-orange-600 hover:to-orange-500 relative"
              >
                <Sword className="mr-2 h-5 w-5" /> Heavy Attack
                {actionCooldowns["Heavy Attack"] > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {actionCooldowns["Heavy Attack"]}
                  </span>
                )}
              </Button>

              <Button
                variant="default"
                onClick={() => performAction("Defensive Stance")}
                disabled={currentTurn !== "player" || playerState.stunned || actionCooldowns["Defensive Stance"] > 0}
                className="bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 relative"
              >
                <Shield className="mr-2 h-4 w-4" /> Defensive Stance
                {actionCooldowns["Defensive Stance"] > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {actionCooldowns["Defensive Stance"]}
                  </span>
                )}
              </Button>

              <Button
                variant="default"
                onClick={() => performAction("Special Ability")}
                disabled={
                  currentTurn !== "player" ||
                  playerState.stunned ||
                  actionCooldowns["Special Ability"] > 0 ||
                  playerState.mana < 30
                }
                className="bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 relative"
              >
                <Zap className="mr-2 h-4 w-4" /> Special Ability
                {actionCooldowns["Special Ability"] > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {actionCooldowns["Special Ability"]}
                  </span>
                )}
              </Button>

              <Button
                variant="default"
                onClick={() => performAction("Heal")}
                disabled={
                  currentTurn !== "player" ||
                  playerState.stunned ||
                  playerState.mana < 20 ||
                  playerState.health === character.maxHealth
                }
                className="col-span-2 bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500"
              >
                <Heart className="mr-2 h-4 w-4" /> Heal (20 Mana)
              </Button>
            </div>

            {/* Turn indicator */}
            {currentTurn === "boss" && (
              <div className="absolute inset-0 bg-red-900/20 flex items-center justify-center pointer-events-none">
                <motion.div
                  className="text-2xl font-bold text-red-500 bg-black/50 px-6 py-2 rounded-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", duration: 0.5 }}
                >
                  BOSS TURN
                </motion.div>
              </div>
            )}

            {/* Stunned indicator */}
            {playerState.stunned && (
              <div className="absolute inset-0 bg-yellow-900/20 flex items-center justify-center pointer-events-none">
                <motion.div
                  className="text-2xl font-bold text-yellow-500 bg-black/50 px-6 py-2 rounded-lg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", duration: 0.5 }}
                >
                  STUNNED
                </motion.div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center h-full p-6 bg-black/80 rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <Award className="h-16 w-16 text-yellow-500 mb-4" />
            </motion.div>

            <motion.h2
              className="text-3xl font-bold text-yellow-500 mb-6 text-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Victory!
            </motion.h2>

            <motion.div
              className="bg-gray-900/80 p-6 rounded-lg mb-6 w-full max-w-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-xl font-bold text-white mb-4 text-center">Rewards</h3>

              <div className="flex justify-between items-center mb-4">
                <span className="text-yellow-500 font-bold">Gold:</span>
                <span className="text-yellow-500 font-bold">
                  +{BOSSES[currentIsland as keyof typeof BOSSES].rewards.gold}
                </span>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-blue-400 font-bold">Experience:</span>
                <span className="text-blue-400 font-bold">
                  +{BOSSES[currentIsland as keyof typeof BOSSES].rewards.experience}
                </span>
              </div>

              <div className="bg-gray-800/80 p-4 rounded-lg flex items-center">
                <img
                  src={
                    getItemImageUrl(BOSSES[currentIsland as keyof typeof BOSSES].rewards.item.name) ||
                    "/placeholder.svg?height=200&width=200&query=fantasy item" ||
                    "/placeholder.svg"
                  }
                  alt={BOSSES[currentIsland as keyof typeof BOSSES].rewards.item.name}
                  className="w-16 h-16 object-contain mr-4"
                />
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {BOSSES[currentIsland as keyof typeof BOSSES].rewards.item.name}
                  </h4>
                  <p className="text-sm text-gray-400">
                    Rarity: {BOSSES[currentIsland as keyof typeof BOSSES].rewards.item.rarity}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.Button
              variant="secondary"
              onClick={claimRewards}
              className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-700 hover:to-green-900 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Claim Rewards
            </motion.Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
