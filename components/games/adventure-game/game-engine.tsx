"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { useGame } from "./game-context"
import { useWallet } from "@/components/wallet-provider"
import GameHUD from "./game-hud"
import GameControls from "./game-controls"
import { Button } from "@/components/ui/button"
import { Pause, Play, Home } from "lucide-react"

interface GameEngineProps {
  character: string
  stakedAmount: number
  onGameOver: (score: number) => void
}

export default function GameEngine({ character, stakedAmount, onGameOver }: GameEngineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const gameRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    clock: THREE.Clock
    player: THREE.Group
    goldTokens: THREE.Group[]
    enemies: THREE.Group[]
    animationFrameId: number
  } | null>(null)

  const { addScore, collectGold, takeDamage, health } = useGame()
  const { goldBalance } = useWallet()

  // Initialize game
  useEffect(() => {
    if (!containerRef.current) return

    // Set loading state
    setIsLoading(true)

    // Create scene, camera, renderer
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 5, 10)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true

    containerRef.current.innerHTML = ""
    containerRef.current.appendChild(renderer.domElement)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 10, 7)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Add ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100)
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a2e44,
      roughness: 0.8,
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // Create player based on selected character
    const player = new THREE.Group()

    // Temporary player mesh until models are loaded
    let playerGeometry
    let playerMaterial

    switch (character) {
      case "cat":
        playerGeometry = new THREE.SphereGeometry(1, 32, 32)
        playerMaterial = new THREE.MeshStandardMaterial({ color: 0xf5a623 })
        break
      case "gorilla":
        playerGeometry = new THREE.BoxGeometry(1.5, 2, 1.5)
        playerMaterial = new THREE.MeshStandardMaterial({ color: 0x8b572a })
        break
      case "coin":
        playerGeometry = new THREE.CylinderGeometry(1, 1, 0.2, 32)
        playerMaterial = new THREE.MeshStandardMaterial({ color: 0xf8e71c })
        break
      default:
        playerGeometry = new THREE.SphereGeometry(1, 32, 32)
        playerMaterial = new THREE.MeshStandardMaterial({ color: 0xf5a623 })
    }

    const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial)
    playerMesh.castShadow = true
    player.add(playerMesh)
    player.position.y = 1
    scene.add(player)

    // Add gold tokens to collect
    const goldTokens: THREE.Group[] = []
    const tokenGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32)
    const tokenMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 1,
      roughness: 0.3,
    })

    // Create 50 random tokens
    for (let i = 0; i < 50; i++) {
      const token = new THREE.Group()
      const tokenMesh = new THREE.Mesh(tokenGeometry, tokenMaterial)
      tokenMesh.castShadow = true
      token.add(tokenMesh)

      // Random position
      token.position.x = Math.random() * 80 - 40
      token.position.z = Math.random() * 80 - 40
      token.position.y = 0.5

      scene.add(token)
      goldTokens.push(token)
    }

    // Add enemies
    const enemies: THREE.Group[] = []
    const enemyGeometry = new THREE.SphereGeometry(0.8, 16, 16)
    const enemyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })

    // Create 20 random enemies
    for (let i = 0; i < 20; i++) {
      const enemy = new THREE.Group()
      const enemyMesh = new THREE.Mesh(enemyGeometry, enemyMaterial)
      enemyMesh.castShadow = true
      enemy.add(enemyMesh)

      // Random position
      enemy.position.x = Math.random() * 80 - 40
      enemy.position.z = Math.random() * 80 - 40
      enemy.position.y = 0.8

      // Add random speed
      enemy.userData = {
        speed: Math.random() * 0.05 + 0.02,
        direction: new THREE.Vector3(Math.random() * 2 - 1, 0, Math.random() * 2 - 1).normalize(),
      }

      scene.add(enemy)
      enemies.push(enemy)
    }

    // Add obstacles
    for (let i = 0; i < 30; i++) {
      const size = Math.random() * 3 + 1
      const obstacleGeometry = new THREE.BoxGeometry(size, size * 2, size)
      const obstacleMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a4a4a,
        roughness: 0.7,
      })

      const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial)
      obstacle.position.x = Math.random() * 80 - 40
      obstacle.position.z = Math.random() * 80 - 40
      obstacle.position.y = size
      obstacle.castShadow = true
      obstacle.receiveShadow = true
      scene.add(obstacle)
    }

    // Setup clock for animation
    const clock = new THREE.Clock()

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return

      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Game state
    const keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
    }

    // Keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyW" || e.code === "ArrowUp") keys.forward = true
      if (e.code === "KeyS" || e.code === "ArrowDown") keys.backward = true
      if (e.code === "KeyA" || e.code === "ArrowLeft") keys.left = true
      if (e.code === "KeyD" || e.code === "ArrowRight") keys.right = true
      if (e.code === "Space") keys.jump = true
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "KeyW" || e.code === "ArrowUp") keys.forward = false
      if (e.code === "KeyS" || e.code === "ArrowDown") keys.backward = false
      if (e.code === "KeyA" || e.code === "ArrowLeft") keys.left = false
      if (e.code === "KeyD" || e.code === "ArrowRight") keys.right = false
      if (e.code === "Space") keys.jump = false
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    // Player physics
    const playerVelocity = new THREE.Vector3()
    const playerDirection = new THREE.Vector3()
    let playerOnGround = true
    const gravity = 0.2
    const jumpForce = 0.5

    // Animation loop
    const animate = () => {
      if (isPaused) return

      const delta = clock.getDelta()

      // Player movement
      const speed = 0.1
      playerDirection.set(0, 0, 0)

      if (keys.forward) playerDirection.z = -1
      if (keys.backward) playerDirection.z = 1
      if (keys.left) playerDirection.x = -1
      if (keys.right) playerDirection.x = 1

      if (playerDirection.length() > 0) {
        playerDirection.normalize()
        playerDirection.multiplyScalar(speed)
      }

      // Apply gravity
      if (!playerOnGround) {
        playerVelocity.y -= gravity * delta * 60
      }

      // Jump
      if (keys.jump && playerOnGround) {
        playerVelocity.y = jumpForce
        playerOnGround = false
      }

      // Update player position
      player.position.x += playerDirection.x
      player.position.z += playerDirection.z
      player.position.y += playerVelocity.y

      // Ground collision
      if (player.position.y < 1) {
        player.position.y = 1
        playerVelocity.y = 0
        playerOnGround = true
      }

      // Boundary check
      if (player.position.x < -50) player.position.x = -50
      if (player.position.x > 50) player.position.x = 50
      if (player.position.z < -50) player.position.z = -50
      if (player.position.z > 50) player.position.z = 50

      // Update camera position to follow player
      camera.position.x = player.position.x
      camera.position.z = player.position.z + 10
      camera.position.y = player.position.y + 5
      camera.lookAt(player.position)

      // Rotate tokens for visual effect
      goldTokens.forEach((token) => {
        token.rotation.y += 0.02
      })

      // Check for token collection
      const tokenCollectionDistance = 2
      for (let i = goldTokens.length - 1; i >= 0; i--) {
        const token = goldTokens[i]
        const distance = player.position.distanceTo(token.position)

        if (distance < tokenCollectionDistance) {
          // Collect token
          scene.remove(token)
          goldTokens.splice(i, 1)
          collectGold(10)
          addScore(50)
        }
      }

      // Move enemies
      enemies.forEach((enemy) => {
        const { speed, direction } = enemy.userData

        // Move in current direction
        enemy.position.x += direction.x * speed
        enemy.position.z += direction.z * speed

        // Boundary check and direction change
        if (enemy.position.x < -50 || enemy.position.x > 50 || enemy.position.z < -50 || enemy.position.z > 50) {
          direction.x *= -1
          direction.z *= -1
        }

        // Random direction change occasionally
        if (Math.random() < 0.01) {
          direction.set(Math.random() * 2 - 1, 0, Math.random() * 2 - 1).normalize()
        }

        // Check for collision with player
        const distance = player.position.distanceTo(enemy.position)
        if (distance < 1.5) {
          takeDamage(10)
        }
      })

      // Render scene
      renderer.render(scene, camera)

      // Request next frame
      gameRef.current!.animationFrameId = requestAnimationFrame(animate)
    }

    // Store game objects in ref
    gameRef.current = {
      scene,
      camera,
      renderer,
      clock,
      player,
      goldTokens,
      enemies,
      animationFrameId: 0,
    }

    // Simulate loading progress
    const loadingInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + Math.random() * 10
        if (newProgress >= 100) {
          clearInterval(loadingInterval)
          setIsLoading(false)
          // Start animation loop
          gameRef.current!.animationFrameId = requestAnimationFrame(animate)
          return 100
        }
        return newProgress
      })
    }, 200)

    // Cleanup function
    return () => {
      if (gameRef.current) {
        cancelAnimationFrame(gameRef.current.animationFrameId)
      }
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      clearInterval(loadingInterval)

      // Dispose geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })

      renderer.dispose()
    }
  }, [character, addScore, collectGold, takeDamage, isPaused])

  // Check for game over
  useEffect(() => {
    if (health <= 0) {
      onGameOver(0) // Pass score or other stats
    }
  }, [health, onGameOver])

  return (
    <div className="relative w-full h-screen">
      {isLoading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
          <div className="w-64 h-4 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gold" style={{ width: `${loadingProgress}%` }}></div>
          </div>
          <p className="mt-4 text-gold">Loading Game Assets: {Math.round(loadingProgress)}%</p>
        </div>
      ) : (
        <>
          <div ref={containerRef} className="w-full h-full" />

          <GameHUD />

          <div className="absolute top-4 right-4 flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-black/50 border-gold/30 text-gold hover:bg-gold/20"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-black/50 border-gold/30 text-gold hover:bg-gold/20"
              onClick={() => onGameOver(0)}
            >
              <Home className="h-4 w-4" />
            </Button>
          </div>

          {isPaused && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
              <div className="bg-slate-900 p-8 rounded-xl border border-gold/30 max-w-md">
                <h2 className="text-2xl font-bold mb-4 gold-gradient">Game Paused</h2>
                <p className="text-gray-300 mb-6">
                  Take a break and resume when you're ready to continue your adventure.
                </p>
                <div className="flex space-x-4">
                  <Button
                    className="flex-1 bg-gold hover:bg-gold/80 text-black font-bold"
                    onClick={() => setIsPaused(false)}
                  >
                    Resume Game
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-gold/30 text-white hover:bg-slate-800"
                    onClick={() => onGameOver(0)}
                  >
                    Quit Game
                  </Button>
                </div>
              </div>
            </div>
          )}

          <GameControls />
        </>
      )}
    </div>
  )
}
