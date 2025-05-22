"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useToast } from "@/hooks/use-toast"

// Character types
export type CharacterType = "cat" | "wolf" | "coin"

// Character abilities and stats
export interface CharacterStats {
  speed: number
  jump: number
  attack: number
  defense: number
  special: string
}

// Power-up types
export type PowerUpType = "speed" | "jump" | "attack" | "defense" | "magnet"

// Boss types
export interface BossData {
  id: string
  name: string
  health: number
  maxHealth: number
  damage: number
  islandId: number
  isDefeated: boolean
  position: { x: number; y: number; z: number }
  attacks: BossAttackType[]
  dropItems: DropItemType[]
  lore: string
  specialAbility: string
}

export type BossAttackType = "melee" | "ranged" | "aoe" | "charge" | "summon" | "beam"

export interface DropItemType {
  id: string
  name: string
  type: "gold" | "equipment" | "powerup"
  value: number
  rarity: "common" | "rare" | "epic" | "legendary"
}

// Game state
interface GameContextType {
  // Game state
  score: number
  goldCollected: number
  health: number
  maxHealth: number
  level: number
  experience: number

  // Character state
  character: CharacterType
  characterStats: CharacterStats
  activeEffects: PowerUpType[]

  // Boss battle state
  bosses: BossData[]
  currentBossId: string | null
  isBossBattle: boolean
  bossDefeated: boolean

  // Islands state
  islands: {
    id: number
    name: string
    isCompleted: boolean
    bossId: string | null
  }[]
  currentIslandId: number

  // Game actions
  addScore: (points: number) => void
  collectGold: (amount: number) => void
  takeDamage: (amount: number) => void
  dealDamageToBoss: (bossId: string, amount: number) => void
  gainExperience: (amount: number) => void
  setCharacter: (character: CharacterType) => void
  addPowerUp: (type: PowerUpType, duration: number) => void
  removePowerUp: (type: PowerUpType) => void

  // Game progress
  islandProgress: number
  setIslandProgress: (progress: number) => void
  showCutscene: boolean
  setShowCutscene: (show: boolean) => void
  cutsceneId: string | null
  setCutsceneId: (id: string | null) => void

  // Boss battle actions
  startBossBattle: (bossId: string) => void
  endBossBattle: (wasSuccessful: boolean) => void
  getBossById: (bossId: string) => BossData | undefined
  setCurrentIsland: (islandId: number) => void

  // Web3 integration
  stakeTokens: (amount: number) => Promise<boolean>
  claimRewards: () => Promise<{ gold: number; nfts: string[] }>
  stakedAmount: number
  isStaking: boolean
  canClaimRewards: boolean
  lastRewardTime: number
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function useGameContext() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider")
  }
  return context
}

// Character base stats
const CHARACTER_STATS: Record<CharacterType, CharacterStats> = {
  cat: {
    speed: 8,
    jump: 6,
    attack: 6,
    defense: 5,
    special: "Swift Strike: Dash attack that damages enemies",
  },
  wolf: {
    speed: 6,
    jump: 5,
    attack: 8,
    defense: 7,
    special: "Howling Wind: Area attack that pushes enemies away",
  },
  coin: {
    speed: 5,
    jump: 4,
    attack: 4,
    defense: 9,
    special: "Gold Magnet: Automatically attracts nearby gold tokens",
  },
}

// Boss data
const BOSSES_DATA: BossData[] = [
  {
    id: "ancient-guardian",
    name: "Ancient Guardian",
    health: 1000,
    maxHealth: 1000,
    damage: 15,
    islandId: 1,
    isDefeated: false,
    position: { x: 0, y: 0, z: -25 },
    attacks: ["melee", "charge", "aoe"],
    dropItems: [
      {
        id: "guardian-essence",
        name: "Guardian Essence",
        type: "powerup",
        value: 100,
        rarity: "rare",
      },
      {
        id: "ancient-gold",
        name: "Ancient Gold",
        type: "gold",
        value: 500,
        rarity: "common",
      },
    ],
    lore: "A stone sentinel that has guarded the main island for centuries, animated by ancient magic.",
    specialAbility: "Stone Shield: Periodically becomes invulnerable for short periods",
  },
  {
    id: "crystal-dragon",
    name: "Crystal Dragon",
    health: 1500,
    maxHealth: 1500,
    damage: 20,
    islandId: 2,
    isDefeated: false,
    position: { x: 40, y: 8, z: 20 },
    attacks: ["ranged", "beam", "aoe"],
    dropItems: [
      {
        id: "dragon-scale",
        name: "Crystal Dragon Scale",
        type: "equipment",
        value: 200,
        rarity: "epic",
      },
      {
        id: "crystal-dust",
        name: "Crystal Dust",
        type: "gold",
        value: 800,
        rarity: "rare",
      },
    ],
    lore: "A majestic dragon made entirely of living crystal that feeds on magical energy.",
    specialAbility: "Crystal Beam: Fires a powerful beam that follows the player",
  },
  {
    id: "shadow-overlord",
    name: "Shadow Overlord",
    health: 2000,
    maxHealth: 2000,
    damage: 25,
    islandId: 3,
    isDefeated: false,
    position: { x: -30, y: 10, z: -25 },
    attacks: ["summon", "ranged", "melee"],
    dropItems: [
      {
        id: "shadow-essence",
        name: "Shadow Essence",
        type: "powerup",
        value: 300,
        rarity: "legendary",
      },
      {
        id: "shadow-gold",
        name: "Shadow Gold",
        type: "gold",
        value: 1200,
        rarity: "epic",
      },
    ],
    lore: "A being made of pure darkness, banished to this island eons ago by ancient wizards.",
    specialAbility: "Shadow Minions: Summons shadow creatures to attack the player",
  },
  {
    id: "celestial-phoenix",
    name: "Celestial Phoenix",
    health: 2500,
    maxHealth: 2500,
    damage: 30,
    islandId: 4,
    isDefeated: false,
    position: { x: 10, y: 14, z: -40 },
    attacks: ["ranged", "charge", "aoe", "beam"],
    dropItems: [
      {
        id: "phoenix-feather",
        name: "Phoenix Feather",
        type: "powerup",
        value: 500,
        rarity: "legendary",
      },
      {
        id: "celestial-gold",
        name: "Celestial Gold",
        type: "gold",
        value: 2000,
        rarity: "legendary",
      },
    ],
    lore: "The immortal guardian of the highest island, reborn from its ashes every thousand years.",
    specialAbility: "Rebirth: Recovers partial health once when defeated",
  },
]

// Island data
const ISLANDS_DATA = [
  {
    id: 1,
    name: "Emerald Valley",
    isCompleted: false,
    bossId: "ancient-guardian",
  },
  {
    id: 2,
    name: "Crystal Heights",
    isCompleted: false,
    bossId: "crystal-dragon",
  },
  {
    id: 3,
    name: "Shadow Peaks",
    isCompleted: false,
    bossId: "shadow-overlord",
  },
  {
    id: 4,
    name: "Celestial Summit",
    isCompleted: false,
    bossId: "celestial-phoenix",
  },
]

export function GameProvider({ children }: { children: React.ReactNode }) {
  // Web3 integration
  const { connected, walletAddress, goldBalance, sendTransaction } = useSolanaWallet()
  const { toast } = useToast()
  const [stakedAmount, setStakedAmount] = useState(0)
  const [isStaking, setIsStaking] = useState(false)
  const [canClaimRewards, setCanClaimRewards] = useState(false)
  const [lastRewardTime, setLastRewardTime] = useState(0)

  // Basic game stats
  const [score, setScore] = useState(0)
  const [goldCollected, setGoldCollected] = useState(0)
  const [health, setHealth] = useState(100)
  const [maxHealth, setMaxHealth] = useState(100)
  const [level, setLevel] = useState(1)
  const [experience, setExperience] = useState(0)

  // Character state
  const [character, setCharacterType] = useState<CharacterType>("cat")
  const [characterStats, setCharacterStats] = useState<CharacterStats>(CHARACTER_STATS.cat)
  const [activeEffects, setActiveEffects] = useState<PowerUpType[]>([])

  // Boss battle state
  const [bosses, setBosses] = useState<BossData[]>(BOSSES_DATA)
  const [currentBossId, setCurrentBossId] = useState<string | null>(null)
  const [isBossBattle, setIsBossBattle] = useState(false)
  const [bossDefeated, setBossDefeated] = useState(false)

  // Island state
  const [islands, setIslands] = useState(ISLANDS_DATA)
  const [currentIslandId, setCurrentIslandId] = useState(1)

  // Game progress
  const [islandProgress, setIslandProgress] = useState(0)
  const [showCutscene, setShowCutscene] = useState(false)
  const [cutsceneId, setCutsceneId] = useState<string | null>(null)

  // Update character stats when character changes
  useEffect(() => {
    setCharacterStats(CHARACTER_STATS[character])
    setHealth(100) // Reset health on character change
    setMaxHealth(100)
  }, [character])

  // Web3 integration: Check if user has staked tokens
  useEffect(() => {
    if (connected && walletAddress) {
      // Simulate fetching staked amount from blockchain
      const fetchStakedAmount = async () => {
        try {
          // In a real implementation, this would be a blockchain call
          // For now, we'll simulate it with a random amount
          const mockStakedAmount = Math.floor(Math.random() * 50) + 10
          setStakedAmount(mockStakedAmount)

          // Check if rewards are available (every 24 hours)
          const now = Date.now()
          const lastReward = localStorage.getItem(`lastReward_${walletAddress}`)
          const lastRewardTime = lastReward ? Number.parseInt(lastReward) : 0
          const canClaim = now - lastRewardTime > 24 * 60 * 60 * 1000 // 24 hours

          setCanClaimRewards(canClaim)
          setLastRewardTime(lastRewardTime)
        } catch (error) {
          console.error("Error fetching staked amount:", error)
        }
      }

      fetchStakedAmount()
    } else {
      setStakedAmount(0)
      setCanClaimRewards(false)
    }
  }, [connected, walletAddress])

  // Web3 integration: Stake tokens function
  const stakeTokens = async (amount: number): Promise<boolean> => {
    if (!connected || !walletAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to stake tokens",
        variant: "destructive",
      })
      return false
    }

    if (goldBalance < amount) {
      toast({
        title: "Insufficient balance",
        description: `You need at least ${amount} GOLD to stake`,
        variant: "destructive",
      })
      return false
    }

    setIsStaking(true)

    try {
      // In a real implementation, this would be a blockchain transaction
      // For now, we'll simulate it with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update staked amount
      setStakedAmount((prev) => prev + amount)

      toast({
        title: "Tokens staked successfully",
        description: `You have staked ${amount} GOLD tokens`,
      })

      setIsStaking(false)
      return true
    } catch (error) {
      console.error("Error staking tokens:", error)
      toast({
        title: "Staking failed",
        description: "There was an error staking your tokens",
        variant: "destructive",
      })
      setIsStaking(false)
      return false
    }
  }

  // Web3 integration: Claim rewards function
  const claimRewards = async (): Promise<{ gold: number; nfts: string[] }> => {
    if (!connected || !walletAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to claim rewards",
        variant: "destructive",
      })
      return { gold: 0, nfts: [] }
    }

    if (!canClaimRewards) {
      toast({
        title: "No rewards available",
        description: "You can claim rewards once every 24 hours",
        variant: "destructive",
      })
      return { gold: 0, nfts: [] }
    }

    try {
      // Calculate rewards based on staked amount
      const goldReward = Math.floor(stakedAmount * 0.1) // 10% daily return

      // Random chance to get NFT (5% chance per 10 GOLD staked)
      const nftChance = (stakedAmount / 10) * 0.05
      const gotNft = Math.random() < nftChance

      const nfts = gotNft ? ["Goldium Special NFT"] : []

      // In a real implementation, this would be a blockchain transaction
      // For now, we'll simulate it with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update last reward time
      const now = Date.now()
      localStorage.setItem(`lastReward_${walletAddress}`, now.toString())
      setLastRewardTime(now)
      setCanClaimRewards(false)

      toast({
        title: "Rewards claimed successfully",
        description: `You received ${goldReward} GOLD${nfts.length > 0 ? " and a special NFT!" : ""}`,
      })

      return { gold: goldReward, nfts }
    } catch (error) {
      console.error("Error claiming rewards:", error)
      toast({
        title: "Claiming failed",
        description: "There was an error claiming your rewards",
        variant: "destructive",
      })
      return { gold: 0, nfts: [] }
    }
  }

  const addScore = (points: number) => {
    setScore((prev) => prev + points)
  }

  const collectGold = (amount: number) => {
    setGoldCollected((prev) => prev + amount)
  }

  const takeDamage = (amount: number) => {
    // Apply defense stat to reduce damage
    const damageReduction = characterStats.defense / 20 // 5% damage reduction per point
    const reducedAmount = amount * (1 - damageReduction)
    setHealth((prev) => Math.max(0, prev - reducedAmount))
  }

  const dealDamageToBoss = (bossId: string, amount: number) => {
    setBosses((prevBosses) => {
      return prevBosses.map((boss) => {
        if (boss.id === bossId) {
          // Apply character attack bonus
          const attackBonus = characterStats.attack / 10 // 10% damage bonus per point
          const bonusAmount = amount * (1 + attackBonus)

          // Apply power-up bonus
          const powerUpBonus = activeEffects.includes("attack") ? 1.5 : 1
          const totalDamage = bonusAmount * powerUpBonus

          const newHealth = Math.max(0, boss.health - totalDamage)

          // Check if boss is defeated
          if (newHealth === 0 && boss.health > 0) {
            setBossDefeated(true)

            // Complete island
            setIslands((prevIslands) => {
              return prevIslands.map((island) => {
                if (island.id === boss.islandId) {
                  return { ...island, isCompleted: true }
                }
                return island
              })
            })
          }

          return { ...boss, health: newHealth, isDefeated: newHealth <= 0 }
        }
        return boss
      })
    })
  }

  const gainExperience = (amount: number) => {
    setExperience((prev) => {
      const newExp = prev + amount
      const expNeeded = level * 100
      if (newExp >= expNeeded) {
        setLevel((prevLevel) => {
          const newLevel = prevLevel + 1
          // Increase max health with level
          setMaxHealth(100 + (newLevel - 1) * 10)
          setHealth((prevHealth) => prevHealth + 10) // Heal on level up
          return newLevel
        })
        return newExp - expNeeded
      }
      return newExp
    })
  }

  const setCharacter = (newCharacter: CharacterType) => {
    setCharacterType(newCharacter)
  }

  const addPowerUp = (type: PowerUpType, duration: number) => {
    // Add power-up to active effects
    if (!activeEffects.includes(type)) {
      setActiveEffects((prev) => [...prev, type])

      // Remove after duration
      setTimeout(() => {
        removePowerUp(type)
      }, duration * 1000)
    }
  }

  const removePowerUp = (type: PowerUpType) => {
    setActiveEffects((prev) => prev.filter((effect) => effect !== type))
  }

  const startBossBattle = (bossId: string) => {
    setCurrentBossId(bossId)
    setIsBossBattle(true)
    setBossDefeated(false)

    // Find the boss data
    const bossData = bosses.find((boss) => boss.id === bossId)
    if (bossData) {
      // Show boss introduction cutscene
      setShowCutscene(true)
      setCutsceneId(`boss-intro-${bossId}`)

      // Hide cutscene after 5 seconds
      setTimeout(() => {
        setShowCutscene(false)
        setCutsceneId(null)
      }, 5000)
    }
  }

  const endBossBattle = (wasSuccessful: boolean) => {
    if (wasSuccessful && currentBossId) {
      // Find the boss
      const boss = bosses.find((b) => b.id === currentBossId)

      if (boss) {
        // Mark boss as defeated
        setBosses((prev) => prev.map((b) => (b.id === currentBossId ? { ...b, isDefeated: true } : b)))

        // Give rewards
        boss.dropItems.forEach((item) => {
          if (item.type === "gold") {
            collectGold(item.value)
          } else if (item.type === "powerup") {
            // Apply random powerup
            const powerups: PowerUpType[] = ["speed", "jump", "attack", "defense", "magnet"]
            addPowerUp(powerups[Math.floor(Math.random() * powerups.length)], 60)
          }
        })

        // Add score
        addScore(boss.maxHealth * 2)

        // Add experience
        gainExperience(boss.maxHealth / 2)

        // Show victory cutscene
        setShowCutscene(true)
        setCutsceneId(`boss-victory-${currentBossId}`)

        // Hide cutscene after 5 seconds
        setTimeout(() => {
          setShowCutscene(false)
          setCutsceneId(null)
        }, 5000)
      }
    }

    // End the boss battle
    setIsBossBattle(false)
    setCurrentBossId(null)
  }

  // Get boss by ID
  const getBossById = (bossId: string) => {
    return bosses.find((boss) => boss.id === bossId)
  }

  // Set current island
  const setCurrentIsland = (islandId: number) => {
    setCurrentIslandId(islandId)
  }

  // Check for game over
  useEffect(() => {
    if (health <= 0) {
      // Game over logic could be implemented here
      console.log("Game over!")
    }
  }, [health])

  const value = {
    score,
    goldCollected,
    health,
    maxHealth,
    level,
    experience,
    character,
    characterStats,
    activeEffects,
    bosses,
    currentBossId,
    isBossBattle,
    bossDefeated,
    islands,
    currentIslandId,
    addScore,
    collectGold,
    takeDamage,
    dealDamageToBoss,
    gainExperience,
    setCharacter,
    addPowerUp,
    removePowerUp,
    islandProgress,
    setIslandProgress,
    showCutscene,
    setShowCutscene,
    cutsceneId,
    setCutsceneId,
    startBossBattle,
    endBossBattle,
    getBossById,
    setCurrentIsland,
    // Web3 integration
    stakeTokens,
    claimRewards,
    stakedAmount,
    isStaking,
    canClaimRewards,
    lastRewardTime,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
