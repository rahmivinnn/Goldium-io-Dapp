"use client"

import { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Sky, Cloud, PerspectiveCamera, Text, Float, Trail, Stars, Sparkles } from "@react-three/drei"
import { Physics, RigidBody } from "@react-three/rapier"
import * as THREE from "three"
import { useGameContext, type CharacterType, type PowerUpType } from "./game-context"
import { Howl } from "howler"
import BossBattle from "./boss-battle"

// Sound effects
const SOUNDS = {
  goldCollect: new Howl({ src: ["/sounds/coin-collect.mp3"], volume: 0.5 }),
  jump: new Howl({ src: ["/sounds/jump.mp3"], volume: 0.3 }),
  powerUp: new Howl({ src: ["/sounds/powerup.mp3"], volume: 0.4 }),
  damage: new Howl({ src: ["/sounds/damage.mp3"], volume: 0.4 }),
  ambient: new Howl({
    src: ["/sounds/fantasy-ambient.mp3"],
    volume: 0.2,
    loop: true,
  }),
  portalHum: new Howl({
    src: ["/sounds/portal-hum.mp3"],
    volume: 0.3,
    loop: true,
  }),
  bossAlert: new Howl({ src: ["/sounds/boss-alert.mp3"], volume: 0.6 }),
}

interface FantasyGameSceneProps {
  isMobile: boolean
  dispatchGameEvent: (type: string, value: number) => void
}

export default function FantasyGameScene({ isMobile, dispatchGameEvent }: FantasyGameSceneProps) {
  const {
    addScore,
    collectGold,
    takeDamage,
    character,
    characterStats,
    activeEffects,
    addPowerUp,
    health,
    isBossBattle,
    currentBossId,
    startBossBattle,
  } = useGameContext()

  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 1, 0))
  const [playerRotation, setPlayerRotation] = useState(0)
  const [playerVelocity, setPlayerVelocity] = useState(new THREE.Vector3(0, 0, 0))
  const [isJumping, setIsJumping] = useState(false)
  const [isAttacking, setIsAttacking] = useState(false)
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    attack: false,
    special: false,
  })

  const playerRef = useRef<THREE.Group>(null)
  const [daytime, setDaytime] = useState(true)
  const [timeOfDay, setTimeOfDay] = useState(0.3) // 0-1 range, 0.3 is morning

  // Island sections
  const [islands] = useState([
    // Main island
    {
      id: 1,
      position: new THREE.Vector3(0, -2, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(30, 2, 30),
      type: "main",
      name: "Emerald Haven",
      bossId: "forest-guardian",
      isCompleted: false,
    },
    // Floating islands
    {
      id: 2,
      position: new THREE.Vector3(40, 5, 20),
      rotation: new THREE.Euler(0, Math.PI / 6, Math.PI / 24),
      scale: new THREE.Vector3(15, 2, 15),
      type: "floating",
      name: "Crystal Peaks",
      bossId: "frost-titan",
      isCompleted: false,
    },
    {
      id: 3,
      position: new THREE.Vector3(-30, 8, -25),
      rotation: new THREE.Euler(0, -Math.PI / 8, Math.PI / 16),
      scale: new THREE.Vector3(12, 2, 12),
      type: "floating",
      name: "Ember Isle",
      bossId: "flame-lord",
      isCompleted: false,
    },
    {
      id: 4,
      position: new THREE.Vector3(10, 12, -40),
      rotation: new THREE.Euler(0, Math.PI / 4, -Math.PI / 20),
      scale: new THREE.Vector3(10, 2, 10),
      type: "floating",
      name: "Shadow Realm",
      bossId: "void-monarch",
      isCompleted: false,
    },
    // Small floating rocks
    ...Array.from({ length: 15 }, (_, i) => ({
      id: 5 + i,
      position: new THREE.Vector3((Math.random() - 0.5) * 80, Math.random() * 15 + 2, (Math.random() - 0.5) * 80),
      rotation: new THREE.Euler((Math.random() - 0.5) * 0.2, Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.2),
      scale: new THREE.Vector3(Math.random() * 3 + 1, Math.random() + 0.5, Math.random() * 3 + 1),
      type: "rock",
      name: `Rock Formation ${i + 1}`,
      bossId: null,
      isCompleted: false,
    })),
  ])

  // Add state for boss portals
  const [bossPortals] = useState(
    islands
      .filter((island) => island.bossId) // Only create portals for islands with bosses
      .map((island) => ({
        id: island.id,
        position: new THREE.Vector3(
          island.id === 1 ? 0 : island.id === 2 ? 40 : island.id === 3 ? -30 : 10,
          island.id === 1 ? 0 : island.id === 2 ? 6 : island.id === 3 ? 9 : island.id === 4 ? 13 : 13,
          island.id === 1 ? -22 : island.id === 2 ? 17 : island.id === 3 ? -22 : island.id === 4 ? -37 : -37,
        ),
        isActive: !island.isCompleted,
        bossId: island.bossId,
        name: island.name,
      })),
  )

  // Gold tokens
  const [goldTokens, setGoldTokens] = useState(
    Array.from({ length: 50 }, () => ({
      position: new THREE.Vector3((Math.random() - 0.5) * 60, Math.random() * 10 + 1, (Math.random() - 0.5) * 60),
      rotation: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.3 + 0.7,
      collected: false,
      id: Math.random().toString(36).substring(7),
    })),
  )

  // Power-ups
  const [powerUps, setPowerUps] = useState(
    Array.from({ length: 8 }, () => {
      const types: PowerUpType[] = ["speed", "jump", "attack", "defense", "magnet"]
      return {
        position: new THREE.Vector3((Math.random() - 0.5) * 60, Math.random() * 10 + 1, (Math.random() - 0.5) * 60),
        rotation: Math.random() * Math.PI * 2,
        scale: Math.random() * 0.3 + 0.7,
        collected: false,
        id: Math.random().toString(36).substring(7),
        type: types[Math.floor(Math.random() * types.length)],
      }
    }),
  )

  // Enemies
  const [enemies, setEnemies] = useState(
    Array.from({ length: 12 }, () => ({
      position: new THREE.Vector3((Math.random() - 0.5) * 60, 0, (Math.random() - 0.5) * 60),
      rotation: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.5 + 0.8,
      health: 100,
      id: Math.random().toString(36).substring(7),
      type: Math.random() > 0.5 ? "slime" : "goblin",
      patrolCenter: new THREE.Vector3((Math.random() - 0.5) * 60, 0, (Math.random() - 0.5) * 60),
      patrolRadius: Math.random() * 5 + 3,
    })),
  )

  // Environment objects
  const [trees] = useState(
    Array.from({ length: 40 }, () => ({
      position: new THREE.Vector3((Math.random() - 0.5) * 60, -2, (Math.random() - 0.5) * 60),
      rotation: Math.random() * Math.PI * 2,
      scale: Math.random() * 1 + 0.8,
      type: Math.random() > 0.3 ? "normal" : "sakura",
    })),
  )

  const [rocks] = useState(
    Array.from({ length: 25 }, () => ({
      position: new THREE.Vector3((Math.random() - 0.5) * 60, -2, (Math.random() - 0.5) * 60),
      rotation: Math.random() * Math.PI * 2,
      scale: Math.random() * 1 + 0.5,
      type: Math.random() > 0.5 ? "normal" : "crystal",
    })),
  )

  const [flowers] = useState(
    Array.from({ length: 80 }, () => ({
      position: new THREE.Vector3((Math.random() - 0.5) * 60, -1.8, (Math.random() - 0.5) * 60),
      rotation: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.5 + 0.5,
      type: Math.floor(Math.random() * 4),
    })),
  )

  // Day/night cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay((prev) => {
        const newTime = (prev + 0.001) % 1
        setDaytime(newTime > 0.25 && newTime < 0.75)
        return newTime
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Play ambient sound
  useEffect(() => {
    SOUNDS.ambient.play()
    return () => {
      SOUNDS.ambient.stop()
    }
  }, [])

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyW" || e.code === "ArrowUp") setKeys((prev) => ({ ...prev, forward: true }))
      if (e.code === "KeyS" || e.code === "ArrowDown") setKeys((prev) => ({ ...prev, backward: true }))
      if (e.code === "KeyA" || e.code === "ArrowLeft") setKeys((prev) => ({ ...prev, left: true }))
      if (e.code === "KeyD" || e.code === "ArrowRight") setKeys((prev) => ({ ...prev, right: true }))
      if (e.code === "Space") {
        setKeys((prev) => ({ ...prev, jump: true }))
        if (!isJumping) {
          SOUNDS.jump.play()
          setIsJumping(true)
        }
      }
      if (e.code === "KeyE" || e.code === "Mouse0") {
        setKeys((prev) => ({ ...prev, attack: true }))
        setIsAttacking(true)
        setTimeout(() => setIsAttacking(false), 500)
      }
      if (e.code === "KeyQ" || e.code === "KeyF") {
        setKeys((prev) => ({ ...prev, special: true }))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "KeyW" || e.code === "ArrowUp") setKeys((prev) => ({ ...prev, forward: false }))
      if (e.code === "KeyS" || e.code === "ArrowDown") setKeys((prev) => ({ ...prev, backward: false }))
      if (e.code === "KeyA" || e.code === "ArrowLeft") setKeys((prev) => ({ ...prev, left: true }))
      if (e.code === "KeyD" || e.code === "ArrowRight") setKeys((prev) => ({ ...prev, right: false }))
      if (e.code === "Space") {
        setKeys((prev) => ({ ...prev, jump: false }))
        setTimeout(() => setIsJumping(false), 300)
      }
      if (e.code === "KeyE" || e.code === "Mouse0") setKeys((prev) => ({ ...prev, attack: false }))
      if (e.code === "KeyQ" || e.code === "KeyF") setKeys((prev) => ({ ...prev, special: false }))
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [isJumping])

  // Add boss portal interaction
  useEffect(() => {
    bossPortals.forEach((portal) => {
      if (portal.isActive && playerPosition.distanceTo(portal.position) < 3) {
        // Start boss battle
        if (portal.bossId) {
          SOUNDS.bossAlert.play()
          startBossBattle(portal.bossId)
        }
      }
    })
  }, [playerPosition, bossPortals, startBossBattle])

  // Game loop
  useFrame((state, delta) => {
    // Skip movement processing if in boss battle
    if (isBossBattle) return

    // Calculate movement speed based on character stats and power-ups
    const baseSpeed = characterStats.speed * 0.5
    const speedBoost = activeEffects.includes("speed") ? 1.5 : 1
    const moveSpeed = baseSpeed * speedBoost * delta

    // Calculate jump force based on character stats and power-ups
    const baseJumpForce = characterStats.jump * 0.3
    const jumpBoost = activeEffects.includes("jump") ? 1.5 : 1
    const jumpForce = baseJumpForce * jumpBoost

    // Movement direction
    const direction = new THREE.Vector3()
    if (keys.forward) direction.z -= 1
    if (keys.backward) direction.z += 1
    if (keys.left) direction.x -= 1
    if (keys.right) direction.x += 1

    // Normalize direction vector
    if (direction.length() > 0) {
      direction.normalize()

      // Calculate new velocity
      const newVelocity = playerVelocity.clone()
      newVelocity.x = direction.x * moveSpeed
      newVelocity.z = direction.z * moveSpeed

      // Apply gravity
      newVelocity.y -= 9.8 * delta

      // Apply jump if on ground and jump key pressed
      if (keys.jump && Math.abs(playerPosition.y - 1) < 0.1) {
        newVelocity.y = jumpForce
      }

      // Update velocity
      setPlayerVelocity(newVelocity)

      // Update position
      const newPosition = playerPosition.clone()
      newPosition.add(newVelocity)

      // Keep player above ground
      if (newPosition.y < 1) {
        newPosition.y = 1
        newVelocity.y = 0
      }

      // Update player position
      setPlayerPosition(newPosition)

      // Update player rotation to face movement direction
      if (direction.x !== 0 || direction.z !== 0) {
        const angle = Math.atan2(direction.x, direction.z)
        setPlayerRotation(angle)
      }
    } else {
      // Apply gravity when not moving horizontally
      const newVelocity = playerVelocity.clone()
      newVelocity.x *= 0.9 // Friction
      newVelocity.z *= 0.9 // Friction
      newVelocity.y -= 9.8 * delta

      // Apply jump if on ground and jump key pressed
      if (keys.jump && Math.abs(playerPosition.y - 1) < 0.1) {
        newVelocity.y = jumpForce
      }

      // Update velocity
      setPlayerVelocity(newVelocity)

      // Update position
      const newPosition = playerPosition.clone()
      newPosition.add(newVelocity)

      // Keep player above ground
      if (newPosition.y < 1) {
        newPosition.y = 1
        newVelocity.y = 0
      }

      // Update player position
      setPlayerPosition(newPosition)
    }

    // Update player model position
    if (playerRef.current) {
      playerRef.current.position.copy(playerPosition)
      playerRef.current.rotation.y = playerRotation
    }

    // Gold magnet effect
    if (activeEffects.includes("magnet")) {
      const magnetRadius = 10
      goldTokens.forEach((gold, index) => {
        if (!gold.collected && playerPosition.distanceTo(gold.position) < magnetRadius) {
          // Move gold towards player
          const direction = new THREE.Vector3().subVectors(playerPosition, gold.position).normalize()
          gold.position.add(direction.multiplyScalar(0.3))
        }
      })
    }

    // Check for gold collection
    goldTokens.forEach((gold, index) => {
      if (!gold.collected && playerPosition.distanceTo(gold.position) < 1.5) {
        // Mark as collected
        goldTokens[index].collected = true

        // Play sound
        SOUNDS.goldCollect.play()

        // Update game state
        collectGold(10)
        addScore(50)

        // Dispatch events to parent
        dispatchGameEvent("gold", 10)
        dispatchGameEvent("score", 50)
      }
    })

    // Check for power-up collection
    powerUps.forEach((powerUp, index) => {
      if (!powerUp.collected && playerPosition.distanceTo(powerUp.position) < 1.5) {
        // Mark as collected
        powerUps[index].collected = true

        // Play sound
        SOUNDS.powerUp.play()

        // Apply power-up effect
        addPowerUp(powerUp.type, 15) // 15 seconds duration

        // Add score
        addScore(100)
        dispatchGameEvent("score", 100)
      }
    })

    // Check for enemy collisions
    enemies.forEach((enemy, index) => {
      const distanceToEnemy = playerPosition.distanceTo(enemy.position)

      // Attack enemies
      if (isAttacking && distanceToEnemy < 2) {
        // Calculate attack damage based on character stats
        const attackPower = characterStats.attack * (activeEffects.includes("attack") ? 1.5 : 1)

        // Update enemy health
        enemies[index].health -= attackPower

        // Check if enemy is defeated
        if (enemies[index].health <= 0) {
          // Remove enemy
          setEnemies((prev) => prev.filter((_, i) => i !== index))

          // Add score
          addScore(200)
          dispatchGameEvent("score", 200)
        }
      }

      // Take damage from enemies
      if (distanceToEnemy < 1.5 && health > 0) {
        // Calculate damage
        const damage = 5 * delta * 10 // 5 damage per second

        // Take damage
        takeDamage(damage)
        dispatchGameEvent("health", -damage)

        // Play damage sound occasionally
        if (Math.random() < 0.05) {
          SOUNDS.damage.play()
        }
      }
    })
  })

  // Update enemy positions
  useEffect(() => {
    const interval = setInterval(() => {
      setEnemies((prev) =>
        prev.map((enemy) => {
          // Calculate new position based on patrol pattern
          const angle = (Date.now() * 0.001) % (Math.PI * 2)
          const newPosition = new THREE.Vector3(
            enemy.patrolCenter.x + Math.cos(angle) * enemy.patrolRadius,
            enemy.position.y,
            enemy.patrolCenter.z + Math.sin(angle) * enemy.patrolRadius,
          )

          // Calculate rotation to face movement direction
          const direction = new THREE.Vector3().subVectors(newPosition, enemy.position)
          const rotation = Math.atan2(direction.x, direction.z)

          return {
            ...enemy,
            position: newPosition,
            rotation,
          }
        }),
      )
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Environment */}
      <color attach="background" args={[daytime ? "#87CEEB" : "#0a1128"]} />

      {/* Sky and atmosphere */}
      <Sky
        distance={450000}
        sunPosition={[Math.cos(timeOfDay * Math.PI * 2) * 100, Math.sin(timeOfDay * Math.PI * 2) * 100, 0]}
        inclination={0.5}
        azimuth={0.25}
      />

      {/* Clouds */}
      <Cloud position={[20, 40, -40]} speed={0.2} opacity={0.7} />
      <Cloud position={[-30, 30, -20]} speed={0.1} opacity={0.5} />
      <Cloud position={[0, 35, 30]} speed={0.3} opacity={0.6} />

      {/* Stars (visible at night) */}
      {!daytime && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}

      {/* Ambient light */}
      <ambientLight intensity={daytime ? 0.5 : 0.2} />

      {/* Directional light (sun/moon) */}
      <directionalLight
        position={[Math.cos(timeOfDay * Math.PI * 2) * 100, Math.sin(timeOfDay * Math.PI * 2) * 100, 0]}
        intensity={daytime ? 1 : 0.2}
        castShadow
        shadow-mapSize={1024}
      />

      {/* Islands */}
      <Physics>
        {islands.map((island, index) => (
          <RigidBody type="fixed" key={`island-${index}`}>
            <Island position={island.position} rotation={island.rotation} scale={island.scale} type={island.type} />
          </RigidBody>
        ))}

        {/* Gold tokens */}
        {goldTokens.map(
          (gold) =>
            !gold.collected && (
              <GoldToken key={gold.id} position={gold.position} rotation={gold.rotation} scale={gold.scale} />
            ),
        )}

        {/* Power-ups */}
        {powerUps.map(
          (powerUp) =>
            !powerUp.collected && (
              <PowerUp
                key={powerUp.id}
                position={powerUp.position}
                rotation={powerUp.rotation}
                scale={powerUp.scale}
                type={powerUp.type}
              />
            ),
        )}

        {/* Enemies */}
        {enemies.map((enemy) => (
          <Enemy
            key={enemy.id}
            position={enemy.position}
            rotation={enemy.rotation}
            scale={enemy.scale}
            type={enemy.type}
            health={enemy.health}
          />
        ))}

        {/* Trees */}
        {trees.map((tree, index) => (
          <Tree
            key={`tree-${index}`}
            position={tree.position}
            rotation={tree.rotation}
            scale={tree.scale}
            type={tree.type}
          />
        ))}

        {/* Rocks */}
        {rocks.map((rock, index) => (
          <Rock
            key={`rock-${index}`}
            position={rock.position}
            rotation={rock.rotation}
            scale={rock.scale}
            type={rock.type}
          />
        ))}

        {/* Flowers */}
        {flowers.map((flower, index) => (
          <Flower
            key={`flower-${index}`}
            position={flower.position}
            rotation={flower.rotation}
            scale={flower.scale}
            type={flower.type}
          />
        ))}

        {/* Player Character */}
        <group ref={playerRef} position={playerPosition.toArray()} rotation={[0, playerRotation, 0]}>
          <PlayerCharacter
            character={character}
            isJumping={isJumping}
            isAttacking={isAttacking}
            activeEffects={activeEffects}
          />
        </group>
      </Physics>

      {/* Boss Battles */}
      {isBossBattle && currentBossId && (
        <BossBattle
          bossId={currentBossId}
          playerPosition={playerPosition}
          playerRotation={playerRotation}
          isAttacking={isAttacking}
          onDamagePlayer={(amount) => {
            takeDamage(amount)
            dispatchGameEvent("health", -amount)
          }}
        />
      )}

      {/* Boss Portals */}
      {bossPortals
        .filter((portal) => portal.isActive)
        .map((portal) => (
          <BossPortal
            key={`boss-portal-${portal.id}`}
            position={portal.position}
            islandId={portal.id}
            name={portal.name}
          />
        ))}

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 10, 15]} />
      <CameraFollowPlayer target={playerPosition} />
    </>
  )
}

// Island component
function Island({
  position,
  rotation,
  scale,
  type,
}: {
  position: THREE.Vector3
  rotation: THREE.Euler
  scale: THREE.Vector3
  type: string
}) {
  return (
    <group position={position.toArray()} rotation={rotation.toArray()} scale={scale.toArray()}>
      {/* Island base */}
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[1, 1.2, 1, 16]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.8} />
      </mesh>

      {/* Top surface */}
      <mesh receiveShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 16]} />
        <meshStandardMaterial color="#4a8" roughness={0.7} />
      </mesh>

      {/* Bottom rocks */}
      <group position={[0, -0.5, 0]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh
            key={i}
            castShadow
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 0.8,
              Math.random() * 0.3 - 0.5,
              Math.sin((i / 8) * Math.PI * 2) * 0.8,
            ]}
          >
            <coneGeometry args={[0.3, 0.6, 4]} />
            <meshStandardMaterial color="#6d6552" roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Crystal formations for floating islands */}
      {type === "floating" && (
        <group position={[0, -0.7, 0]}>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh
              key={i}
              castShadow
              position={[
                Math.cos((i / 5) * Math.PI * 2) * 0.5,
                Math.random() * 0.2 - 0.3,
                Math.sin((i / 5) * Math.PI * 2) * 0.5,
              ]}
            >
              <coneGeometry args={[0.2, 0.8, 5]} />
              <meshStandardMaterial
                color="#64c5eb"
                emissive="#3a7d9e"
                emissiveIntensity={0.5}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
          ))}
          <pointLight position={[0, -0.5, 0]} intensity={0.5} color="#64c5eb" distance={3} />
        </group>
      )}

      {/* Small rocks for rock islands */}
      {type === "rock" && (
        <group>
          {Array.from({ length: 3 }).map((_, i) => (
            <mesh
              key={i}
              castShadow
              position={[Math.random() * 0.6 - 0.3, 0.5 + Math.random() * 0.2, Math.random() * 0.6 - 0.3]}
            >
              <dodecahedronGeometry args={[0.3, 0]} />
              <meshStandardMaterial color="#6d6552" roughness={0.9} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}

// Gold Token component
function GoldToken({
  position,
  rotation,
  scale,
}: {
  position: THREE.Vector3
  rotation: number
  scale: number
}) {
  const coinRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (coinRef.current) {
      coinRef.current.rotation.y += 0.02
      coinRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
      <group position={position.toArray()} scale={scale}>
        <mesh ref={coinRef} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
          <meshStandardMaterial
            color="#ffd700"
            metalness={0.8}
            roughness={0.2}
            emissive="#ffa500"
            emissiveIntensity={0.3}
          />
        </mesh>
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.3}
          color="#b38600"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Roboto-Bold.ttf"
        >
          G
        </Text>
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#ffd700" distance={2} />
        <Sparkles count={5} scale={0.5} size={0.5} speed={0.3} color="#ffd700" />
      </group>
    </Float>
  )
}

// Power-up component
function PowerUp({
  position,
  rotation,
  scale,
  type,
}: {
  position: THREE.Vector3
  rotation: number
  scale: number
  type: PowerUpType
}) {
  const powerUpRef = useRef<THREE.Mesh>(null)

  // Define colors and icons for different power-up types
  const powerUpStyles = {
    speed: { color: "#00ffff", emissive: "#00aaff", icon: "S" },
    jump: { color: "#00ff00", emissive: "#00aa00", icon: "J" },
    attack: { color: "#ff0000", emissive: "#aa0000", icon: "A" },
    defense: { color: "#ffff00", emissive: "#aaaa00", icon: "D" },
    magnet: { color: "#ff00ff", emissive: "#aa00aa", icon: "M" },
  }

  const style = powerUpStyles[type]

  useFrame((state) => {
    if (powerUpRef.current) {
      powerUpRef.current.rotation.y += 0.03
      powerUpRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 1.5) * 0.3
    }
  })

  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={0.7}>
      <group position={position.toArray()} scale={scale}>
        <mesh ref={powerUpRef} castShadow>
          <dodecahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color={style.color}
            metalness={0.6}
            roughness={0.3}
            emissive={style.emissive}
            emissiveIntensity={0.5}
          />
        </mesh>
        <Text
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Roboto-Bold.ttf"
        >
          {style.icon}
        </Text>
        <pointLight position={[0, 0, 0]} intensity={0.7} color={style.color} distance={3} />
        <Sparkles count={10} scale={1} size={0.6} speed={0.4} color={style.color} />
      </group>
    </Float>
  )
}

// Enemy component
function Enemy({
  position,
  rotation,
  scale,
  type,
  health,
}: {
  position: THREE.Vector3
  rotation: number
  scale: number
  type: string
  health: number
}) {
  const healthPercent = health / 100

  return (
    <group position={position.toArray()} rotation={[0, rotation, 0]} scale={scale}>
      {type === "slime" ? (
        // Slime enemy
        <group>
          <mesh castShadow>
            <sphereGeometry args={[0.8, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <meshStandardMaterial color="#4CAF50" transparent opacity={0.8} />
          </mesh>
          <mesh position={[0.3, 0.5, 0.5]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[-0.3, 0.5, 0.5]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        </group>
      ) : (
        // Goblin enemy
        <group>
          <mesh castShadow>
            <capsuleGeometry args={[0.5, 1, 4, 8]} />
            <meshStandardMaterial color="#8D6E63" />
          </mesh>
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial color="#A1887F" />
          </mesh>
          <mesh position={[0.2, 0.9, 0.3]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#FF5722" />
          </mesh>
          <mesh position={[-0.2, 0.9, 0.3]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#FF5722" />
          </mesh>
          <mesh position={[0, 0.7, 0.4]}>
            <coneGeometry args={[0.1, 0.3, 8]} />
            <meshStandardMaterial color="#795548" />
          </mesh>
          <mesh position={[0.3, 1.2, 0]}>
            <coneGeometry args={[0.1, 0.4, 8]} />
            <meshStandardMaterial color="#8D6E63" />
          </mesh>
          <mesh position={[-0.3, 1.2, 0]}>
            <coneGeometry args={[0.1, 0.4, 8]} />
            <meshStandardMaterial color="#8D6E63" />
          </mesh>
        </group>
      )}

      {/* Health bar */}
      <group position={[0, 1.5, 0]}>
        <mesh>
          <boxGeometry args={[1, 0.1, 0.1]} />
          <meshBasicMaterial color="#333" />
        </mesh>
        <mesh position={[(healthPercent - 1) / 2, 0, 0]}>
          <boxGeometry args={[healthPercent, 0.1, 0.1]} />
          <meshBasicMaterial color={healthPercent > 0.5 ? "#4CAF50" : healthPercent > 0.2 ? "#FFC107" : "#F44336"} />
        </mesh>
      </group>
    </group>
  )
}

// Tree component
function Tree({
  position,
  rotation,
  scale,
  type,
}: {
  position: THREE.Vector3
  rotation: number
  scale: number
  type: string
}) {
  return (
    <group position={position.toArray()} rotation={[0, rotation, 0]} scale={scale}>
      {/* Trunk */}
      <mesh castShadow receiveShadow position={[0, 2, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 4, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>

      {type === "normal" ? (
        // Normal tree
        <group>
          <mesh castShadow position={[0, 4, 0]}>
            <coneGeometry args={[2, 4, 8]} />
            <meshStandardMaterial color="#2E7D32" roughness={0.8} />
          </mesh>
          <mesh castShadow position={[0, 5.5, 0]}>
            <coneGeometry args={[1.5, 3, 8]} />
            <meshStandardMaterial color="#2E7D32" roughness={0.8} />
          </mesh>
          <mesh castShadow position={[0, 6.5, 0]}>
            <coneGeometry args={[1, 2, 8]} />
            <meshStandardMaterial color="#2E7D32" roughness={0.8} />
          </mesh>
        </group>
      ) : (
        // Sakura tree
        <group>
          <mesh castShadow position={[0, 4, 0]}>
            <sphereGeometry args={[2, 16, 16]} />
            <meshStandardMaterial color="#F8BBD0" roughness={0.7} />
          </mesh>
          <Sparkles count={20} scale={3} size={0.1} speed={0.2} color="#F8BBD0" position={[0, 4, 0]} />
        </group>
      )}
    </group>
  )
}

// Rock component
function Rock({
  position,
  rotation,
  scale,
  type,
}: {
  position: THREE.Vector3
  rotation: number
  scale: number
  type: string
}) {
  return (
    <group position={position.toArray()} rotation={[0, rotation, 0]} scale={scale}>
      {type === "normal" ? (
        // Normal rock
        <mesh castShadow receiveShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#757575" roughness={0.9} />
        </mesh>
      ) : (
        // Crystal rock
        <group>
          <mesh castShadow receiveShadow>
            <dodecahedronGeometry args={[0.7, 0]} />
            <meshStandardMaterial color="#424242" roughness={0.8} />
          </mesh>
          {Array.from({ length: 5 }).map((_, i) => (
            <mesh
              key={i}
              castShadow
              position={[Math.cos((i / 5) * Math.PI * 2) * 0.5, Math.sin((i / 5) * Math.PI * 2) * 0.5, 0]}
            >
              <coneGeometry args={[0.2, 0.8, 5]} />
              <meshStandardMaterial
                color="#64B5F6"
                emissive="#2196F3"
                emissiveIntensity={0.5}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
          ))}
          <pointLight position={[0, 0, 0]} intensity={0.5} color="#64B5F6" distance={3} />
        </group>
      )}
    </group>
  )
}

// Flower component
function Flower({
  position,
  rotation,
  scale,
  type,
}: {
  position: THREE.Vector3
  rotation: number
  scale: number
  type: number
}) {
  const colors = ["#F44336", "#FFEB3B", "#E91E63", "#9C27B0"]

  return (
    <group position={position.toArray()} rotation={[0, rotation, 0]} scale={scale}>
      {/* Stem */}
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>

      {/* Flower */}
      <group position={[0, 0.3, 0]}>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh
            key={i}
            castShadow
            position={[Math.cos((i / 5) * Math.PI * 2) * 0.15, 0, Math.sin((i / 5) * Math.PI * 2) * 0.15]}
          >
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color={colors[type]} />
          </mesh>
        ))}
        <mesh castShadow>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#FFC107" />
        </mesh>
      </group>
    </group>
  )
}

// Player Character component
function PlayerCharacter({
  character,
  isJumping,
  isAttacking,
  activeEffects,
}: {
  character: CharacterType
  isJumping: boolean
  isAttacking: boolean
  activeEffects: PowerUpType[]
}) {
  return (
    <group>
      {character === "egg" ? (
        // Golden Egg character
        <group>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh castShadow>
              <sphereGeometry args={[0.8, 32, 32]} />
              <meshStandardMaterial
                color="#FFD700"
                metalness={0.8}
                roughness={0.2}
                emissive="#FFA500"
                emissiveIntensity={0.3}
              />
            </mesh>
            <mesh position={[0.3, 0.3, 0.6]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[-0.3, 0.3, 0.6]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#111" />
            </mesh>
            <Sparkles count={20} scale={2} size={0.3} speed={0.5} color="#FFD700" />
          </Float>

          {/* Power-up effects */}
          {activeEffects.includes("speed") && (
            <Trail width={1} color="#00ffff" length={5} decay={1} attenuation={(width) => width}>
              <mesh visible={false} position={[0, 0, -1]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshBasicMaterial color="#00ffff" />
              </mesh>
            </Trail>
          )}

          {activeEffects.includes("jump") && (
            <Sparkles count={10} scale={1} size={0.5} speed={0.5} color="#00ff00" position={[0, -0.5, 0]} />
          )}

          {activeEffects.includes("attack") && (
            <pointLight position={[0, 0, 0]} intensity={1} color="#ff0000" distance={3} />
          )}

          {activeEffects.includes("defense") && (
            <mesh>
              <sphereGeometry args={[1.2, 32, 32]} />
              <meshBasicMaterial color="#ffff00" transparent opacity={0.2} />
            </mesh>
          )}

          {activeEffects.includes("magnet") && (
            <group>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[1.5, 0.1, 16, 32, Math.PI]} />
                <meshBasicMaterial color="#ff00ff" transparent opacity={0.5} />
              </mesh>
              <mesh rotation={[0, Math.PI / 2, Math.PI / 2]}>
                <torusGeometry args={[1.5, 0.1, 16, 32, Math.PI]} />
                <meshBasicMaterial color="#ff00ff" transparent opacity={0.5} />
              </mesh>
            </group>
          )}
        </group>
      ) : character === "cat" ? (
        // Cat Warrior character
        <group>
          {/* Body */}
          <mesh castShadow position={[0, 0.5, 0]}>
            <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
            <meshStandardMaterial color="#f5a742" />
          </mesh>

          {/* Head */}
          <mesh castShadow position={[0, 1.2, 0]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#f5a742" />

            {/* Eyes */}
            <mesh position={[0.2, 0.1, 0.4]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#000" />
            </mesh>
            <mesh position={[-0.2, 0.1, 0.4]}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="#000" />
            </mesh>

            {/* Nose */}
            <mesh position={[0, -0.1, 0.5]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshStandardMaterial color="#ff9494" />
            </mesh>

            {/* Ears */}
            <mesh position={[0.3, 0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
              <coneGeometry args={[0.2, 0.4, 16]} />
              <meshStandardMaterial color="#f5a742" />
            </mesh>
            <mesh position={[-0.3, 0.4, 0]} rotation={[0, 0, -Math.PI / 4]}>
              <coneGeometry args={[0.2, 0.4, 16]} />
              <meshStandardMaterial color="#f5a742" />
            </mesh>
          </mesh>

          {/* Tail */}
          <mesh castShadow position={[0, 0.5, -0.8]} rotation={[Math.PI / 4, 0, 0]}>
            <capsuleGeometry args={[0.1, 0.8, 8, 8]} />
            <meshStandardMaterial color="#f5a742" />
          </mesh>

          {/* Legs */}
          <mesh castShadow position={[0.3, 0.2, 0.3]}>
            <capsuleGeometry args={[0.1, 0.4, 8, 8]} />
            <meshStandardMaterial color="#f5a742" />
          </mesh>
          <mesh castShadow position={[-0.3, 0.2, 0.3]}>
            <capsuleGeometry args={[0.1, 0.4, 8, 8]} />
            <meshStandardMaterial color="#f5a742" />
          </mesh>
          <mesh castShadow position={[0.3, 0.2, -0.3]}>
            <capsuleGeometry args={[0.1, 0.4, 8, 8]} />
            <meshStandardMaterial color="#f5a742" />
          </mesh>
          <mesh castShadow position={[-0.3, 0.2, -0.3]}>
            <capsuleGeometry args={[0.1, 0.4, 8, 8]} />
            <meshStandardMaterial color="#f5a742" />
          </mesh>

          {/* Sword (when attacking) */}
          {isAttacking && (
            <group position={[0.8, 0.8, 0]} rotation={[0, 0, -Math.PI / 4]}>
              <mesh castShadow>
                <boxGeometry args={[0.1, 0.8, 0.05]} />
                <meshStandardMaterial color="#B0BEC5" metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh castShadow position={[0, -0.5, 0]}>
                <boxGeometry args={[0.2, 0.2, 0.1]} />
                <meshStandardMaterial color="#795548" />
              </mesh>
              <Trail width={0.5} color="#FFC107" length={5} decay={1} attenuation={(width) => width}>
                <mesh visible={false} position={[0, 0.5, 0]}>
                  <sphereGeometry args={[0.05, 8, 8]} />
                  <meshBasicMaterial color="#FFC107" />
                </mesh>
              </Trail>
            </group>
          )}

          {/* Power-up effects */}
          {activeEffects.includes("speed") && (
            <Trail width={1} color="#00ffff" length={5} decay={1} attenuation={(width) => width}>
              <mesh visible={false} position={[0, 0, -1]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshBasicMaterial color="#00ffff" />
              </mesh>
            </Trail>
          )}

          {activeEffects.includes("jump") && (
            <Sparkles count={10} scale={1} size={0.5} speed={0.5} color="#00ff00" position={[0, -0.5, 0]} />
          )}

          {activeEffects.includes("attack") && (
            <pointLight position={[0, 0, 0]} intensity={1} color="#ff0000" distance={3} />
          )}

          {activeEffects.includes("defense") && (
            <mesh>
              <sphereGeometry args={[1.2, 32, 32]} />
              <meshBasicMaterial color="#ffff00" transparent opacity={0.2} />
            </mesh>
          )}
        </group>
      ) : (
        // Wolf Guardian character
        <group>
          {/* Body */}
          <mesh castShadow position={[0, 0.5, 0]}>
            <capsuleGeometry args={[0.5, 1, 8, 16]} />
            <meshStandardMaterial color="#607D8B" />
          </mesh>

          {/* Head */}
          <mesh castShadow position={[0, 1.3, 0.3]}>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="#546E7A" />
          </mesh>

          {/* Snout */}
          <mesh castShadow position={[0, 1.1, 0.7]}>
            <coneGeometry args={[0.3, 0.6, 8]} />
            <meshStandardMaterial color="#546E7A" />
          </mesh>

          {/* Eyes */}
          <mesh position={[0.2, 1.4, 0.6]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#29B6F6" emissive="#0288D1" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[-0.2, 1.4, 0.6]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#29B6F6" emissive="#0288D1" emissiveIntensity={0.5} />
          </mesh>

          {/* Ears */}
          <mesh position={[0.3, 1.7, 0.1]} rotation={[0, 0, Math.PI / 4]}>
            <coneGeometry args={[0.2, 0.4, 16]} />
            <meshStandardMaterial color="#455A64" />
          </mesh>
          <mesh position={[-0.3, 1.7, 0.1]} rotation={[0, 0, -Math.PI / 4]}>
            <coneGeometry args={[0.2, 0.4, 16]} />
            <meshStandardMaterial color="#455A64" />
          </mesh>

          {/* Tail */}
          <mesh castShadow position={[0, 0.5, -0.8]} rotation={[Math.PI / 4, 0, 0]}>
            <capsuleGeometry args={[0.15, 1, 8, 8]} />
            <meshStandardMaterial color="#546E7A" />
          </mesh>

          {/* Legs */}
          <mesh castShadow position={[0.3, 0.2, 0.3]}>
            <capsuleGeometry args={[0.15, 0.5, 8, 8]} />
            <meshStandardMaterial color="#546E7A" />
          </mesh>
          <mesh castShadow position={[-0.3, 0.2, 0.3]}>
            <capsuleGeometry args={[0.15, 0.5, 8, 8]} />
            <meshStandardMaterial color="#546E7A" />
          </mesh>
          <mesh castShadow position={[0.3, 0.2, -0.3]}>
            <capsuleGeometry args={[0.15, 0.5, 8, 8]} />
            <meshStandardMaterial color="#546E7A" />
          </mesh>
          <mesh castShadow position={[-0.3, 0.2, -0.3]}>
            <capsuleGeometry args={[0.15, 0.5, 8, 8]} />
            <meshStandardMaterial color="#546E7A" />
          </mesh>

          {/* Special attack effect (wind aura) */}
          {isAttacking && (
            <group>
              <mesh>
                <torusGeometry args={[1.5, 0.2, 16, 32]} />
                <meshBasicMaterial color="#90CAF9" transparent opacity={0.3} />
              </mesh>
              <Sparkles count={30} scale={3} size={0.3} speed={1} color="#90CAF9" />
            </group>
          )}

          {/* Power-up effects */}
          {activeEffects.includes("speed") && (
            <Trail width={1} color="#00ffff" length={5} decay={1} attenuation={(width) => width}>
              <mesh visible={false} position={[0, 0, -1]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshBasicMaterial color="#00ffff" />
              </mesh>
            </Trail>
          )}

          {activeEffects.includes("jump") && (
            <Sparkles count={10} scale={1} size={0.5} speed={0.5} color="#00ff00" position={[0, -0.5, 0]} />
          )}

          {activeEffects.includes("attack") && (
            <pointLight position={[0, 0, 0]} intensity={1} color="#ff0000" distance={3} />
          )}

          {activeEffects.includes("defense") && (
            <mesh>
              <sphereGeometry args={[1.2, 32, 32]} />
              <meshBasicMaterial color="#ffff00" transparent opacity={0.2} />
            </mesh>
          )}
        </group>
      )}
    </group>
  )
}

// Camera that follows the player
function CameraFollowPlayer({ target }: { target: THREE.Vector3 }) {
  const { camera } = useThree()

  useEffect(() => {
    const updateCamera = () => {
      // Position camera behind and above player
      camera.position.x = target.x - Math.sin(Math.PI / 4) * 10
      camera.position.y = target.y + 5
      camera.position.z = target.z + Math.cos(Math.PI / 4) * 10
      camera.lookAt(target.x, target.y, target.z)
    }

    updateCamera()

    // Update camera position on animation frame
    const animationId = requestAnimationFrame(updateCamera)
    return () => cancelAnimationFrame(animationId)
  }, [camera, target])

  return null
}

// Add a new component for the boss portal
function BossPortal({ position, islandId, name }: { position: THREE.Vector3; islandId: number; name: string }) {
  const portalRef = useRef<THREE.Group>(null)
  const [hover, setHover] = useState(false)

  // Colors based on island
  const colors = {
    1: "#4CAF50", // Green for main island
    2: "#2196F3", // Blue for crystal peaks
    3: "#FF5722", // Orange for ember isle
    4: "#9C27B0", // Purple for shadow realm
  }

  const portalColor = colors[islandId as keyof typeof colors] || "#E91E63"

  // Animate the portal
  useFrame((state) => {
    if (portalRef.current) {
      portalRef.current.rotation.y += 0.01
      portalRef.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <group position={position.toArray()}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={portalRef}>
          {/* Portal ring */}
          <mesh castShadow>
            <torusGeometry args={[2, 0.3, 16, 32]} />
            <meshStandardMaterial
              color={portalColor}
              emissive={portalColor}
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>

          {/* Portal center */}
          <mesh>
            <circleGeometry args={[1.7, 32]} />
            <meshBasicMaterial color={portalColor} transparent opacity={0.5} />
          </mesh>

          {/* Portal text */}
          <Text
            position={[0, 3, 0]}
            fontSize={0.5}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Roboto-Bold.ttf"
          >
            {name} Boss
          </Text>

          {/* Portal effects */}
          <Sparkles count={50} scale={4} size={0.4} speed={0.8} color={portalColor} />
          <pointLight position={[0, 0, 0]} intensity={1} color={portalColor} distance={10} />
        </group>
      </Float>
    </group>
  )
}
