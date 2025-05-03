"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Physics, RigidBody } from "@react-three/rapier"
import { Sky, Environment, PerspectiveCamera, Text } from "@react-three/drei"
import { Suspense } from "react"
import * as THREE from "three"
import { useGameContext } from "./game-context"
import GameHUD from "./game-hud"
import GameControls from "./game-controls"

interface GameEngineProps {
  character: string
  stakedAmount: number
  onGameOver: (score: number) => void
}

export default function GameEngine({ character, stakedAmount, onGameOver }: GameEngineProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gold">Loading Goldium Adventure...</p>
      </div>
    )
  }

  return (
    <div className="w-full h-screen relative">
      <Canvas shadows>
        <Suspense fallback={null}>
          <Physics>
            <GameScene character={character} stakedAmount={stakedAmount} onGameOver={onGameOver} />
          </Physics>
        </Suspense>
      </Canvas>
      <GameHUD />
      <GameControls />
    </div>
  )
}

function GameScene({ character, stakedAmount, onGameOver }: GameEngineProps) {
  const { addScore, collectGold, takeDamage } = useGameContext()
  const playerRef = useRef<THREE.Group>(null)
  const [playerPosition, setPlayerPosition] = useState(new THREE.Vector3(0, 1, 0))
  const [playerVelocity, setPlayerVelocity] = useState(new THREE.Vector3())
  const [playerDirection, setPlayerDirection] = useState(new THREE.Vector3())
  const [keys, setKeys] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  })

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyW" || e.code === "ArrowUp") setKeys((prev) => ({ ...prev, forward: true }))
      if (e.code === "KeyS" || e.code === "ArrowDown") setKeys((prev) => ({ ...prev, backward: true }))
      if (e.code === "KeyA" || e.code === "ArrowLeft") setKeys((prev) => ({ ...prev, left: true }))
      if (e.code === "KeyD" || e.code === "ArrowRight") setKeys((prev) => ({ ...prev, right: true }))
      if (e.code === "Space") setKeys((prev) => ({ ...prev, jump: true }))
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "KeyW" || e.code === "ArrowUp") setKeys((prev) => ({ ...prev, forward: false }))
      if (e.code === "KeyS" || e.code === "ArrowDown") setKeys((prev) => ({ ...prev, backward: false }))
      if (e.code === "KeyA" || e.code === "ArrowLeft") setKeys((prev) => ({ ...prev, left: false }))
      if (e.code === "KeyD" || e.code === "ArrowRight") setKeys((prev) => ({ ...prev, right: false }))
      if (e.code === "Space") setKeys((prev) => ({ ...prev, jump: false }))
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  // Game loop
  useFrame((state, delta) => {
    // Update player position based on controls
    const speed = 5
    const direction = new THREE.Vector3()

    if (keys.forward) direction.z -= 1
    if (keys.backward) direction.z += 1
    if (keys.left) direction.x -= 1
    if (keys.right) direction.x += 1

    if (direction.length() > 0) {
      direction.normalize()
      setPlayerDirection(direction)
    }

    // Apply movement
    const movement = direction.clone().multiplyScalar(speed * delta)
    setPlayerPosition((prev) => prev.clone().add(movement))

    // Update player model position
    if (playerRef.current) {
      playerRef.current.position.copy(playerPosition)

      // Rotate player to face movement direction
      if (direction.length() > 0) {
        const targetRotation = Math.atan2(direction.x, direction.z)
        playerRef.current.rotation.y = targetRotation
      }
    }

    // Collect gold tokens (simplified collision detection)
    // In a real game, you would use proper collision detection
    goldTokensPositions.forEach((pos, index) => {
      if (playerPosition.distanceTo(pos) < 1.5) {
        collectGold(10)
        addScore(50)
        // Remove collected token (in a real game, you would handle this better)
        goldTokensPositions.splice(index, 1)
      }
    })

    // Check for enemy collisions (simplified)
    enemyPositions.forEach((pos) => {
      if (playerPosition.distanceTo(pos) < 1.5) {
        takeDamage(10)
      }
    })
  })

  // Placeholder positions for gold tokens
  const goldTokensPositions = [
    new THREE.Vector3(5, 1, 5),
    new THREE.Vector3(-5, 1, -5),
    new THREE.Vector3(10, 1, -3),
    new THREE.Vector3(-8, 1, 7),
    new THREE.Vector3(0, 1, 12),
  ]

  // Placeholder positions for enemies
  const enemyPositions = [new THREE.Vector3(8, 1, 8), new THREE.Vector3(-7, 1, -2), new THREE.Vector3(12, 1, -5)]

  return (
    <>
      {/* Environment */}
      <Sky sunPosition={[100, 10, 100]} />
      <Environment preset="forest" />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} castShadow />

      {/* Ground */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#4a8" />
        </mesh>
      </RigidBody>

      {/* Player Character */}
      <group ref={playerRef} position={playerPosition.toArray()}>
        {character === "cat" && <CatCharacter />}
        {character === "gorilla" && <GorillaCharacter />}
        {character === "coin" && <CoinCharacter />}
      </group>

      {/* Gold Tokens */}
      {goldTokensPositions.map((position, index) => (
        <GoldToken key={index} position={position} />
      ))}

      {/* Enemies */}
      {enemyPositions.map((position, index) => (
        <Enemy key={index} position={position} />
      ))}

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 10, 15]} />
      <CameraFollowPlayer target={playerPosition} />
    </>
  )
}

function CatCharacter() {
  // In a real game, you would load a proper 3D model
  return (
    <mesh castShadow>
      <capsuleGeometry args={[0.5, 1, 4, 8]} />
      <meshStandardMaterial color="#f5a742" />
      <mesh position={[0, 0.9, 0.4]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#f5a742" />
      </mesh>
      <mesh position={[0.25, 1.2, 0.5]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[-0.25, 1.2, 0.5]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0.3, 1.4, 0.2]}>
        <coneGeometry args={[0.2, 0.5, 16]} />
        <meshStandardMaterial color="#f5a742" />
      </mesh>
      <mesh position={[-0.3, 1.4, 0.2]}>
        <coneGeometry args={[0.2, 0.5, 16]} />
        <meshStandardMaterial color="#f5a742" />
      </mesh>
    </mesh>
  )
}

function GorillaCharacter() {
  // In a real game, you would load a proper 3D model
  return (
    <mesh castShadow>
      <boxGeometry args={[1.2, 1.2, 0.8]} />
      <meshStandardMaterial color="#555" />
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#444" />
      </mesh>
      <mesh position={[0.2, 0.9, 0.5]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[-0.2, 0.9, 0.5]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0.7, -0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.4, 1.2, 0.4]} />
        <meshStandardMaterial color="#555" />
      </mesh>
      <mesh position={[-0.7, -0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.4, 1.2, 0.4]} />
        <meshStandardMaterial color="#555" />
      </mesh>
    </mesh>
  )
}

function CoinCharacter() {
  // In a real game, you would load a proper 3D model
  return (
    <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
      <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      <mesh position={[0, 0, 0.15]}>
        <Text
          position={[0, 0, 0.11]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.5}
          color="#b38600"
          anchorX="center"
          anchorY="middle"
        >
          G
        </Text>
      </mesh>
      <mesh position={[0, 0, -0.15]}>
        <Text position={[0, 0, 0.11]} fontSize={0.5} color="#b38600" anchorX="center" anchorY="middle">
          G
        </Text>
      </mesh>
    </mesh>
  )
}

function GoldToken({ position }: { position: THREE.Vector3 }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.02
      ref.current.position.y = position.y + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <mesh ref={ref} position={position.toArray()} castShadow>
      <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
      <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      <Text position={[0, 0, 0.06]} fontSize={0.3} color="#b38600" anchorX="center" anchorY="middle">
        G
      </Text>
    </mesh>
  )
}

function Enemy({ position }: { position: THREE.Vector3 }) {
  const ref = useRef<THREE.Mesh>(null)
  const startPosition = position.clone()

  useFrame((state) => {
    if (ref.current) {
      // Simple enemy movement - circular patrol
      const angle = state.clock.elapsedTime * 0.5
      ref.current.position.x = startPosition.x + Math.sin(angle) * 3
      ref.current.position.z = startPosition.z + Math.cos(angle) * 3
      ref.current.rotation.y = angle + Math.PI
    }
  })

  return (
    <mesh ref={ref} position={position.toArray()} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#f00" />
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#c00" />
      </mesh>
      <mesh position={[0.2, 0.7, 0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[-0.2, 0.7, 0.4]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000" />
      </mesh>
    </mesh>
  )
}

function CameraFollowPlayer({ target }: { target: THREE.Vector3 }) {
  const { camera } = useThree()

  useFrame(() => {
    // Camera follows player with offset
    camera.position.x = target.x
    camera.position.z = target.z + 10
    camera.position.y = target.y + 8
    camera.lookAt(target)
  })

  return null
}
