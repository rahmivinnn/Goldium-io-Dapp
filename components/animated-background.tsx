"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { useTheme } from "next-themes"
import { useMobile } from "@/hooks/use-mobile"
import { throttle } from "@/lib/utils"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isMobile = useMobile()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mouseTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number>(0)
  const lastUpdateTimeRef = useRef<number>(0)

  // Memoize colors to avoid recreating them on every render
  const colors = useMemo(() => {
    return {
      // Hanya menggunakan variasi warna kuning/emas
      gold: [
        "rgba(255, 215, 0, 0.7)", // Gold
        "rgba(255, 223, 0, 0.7)", // Yellow Gold
        "rgba(255, 185, 15, 0.7)", // Golden Yellow
        "rgba(255, 165, 0, 0.7)", // Orange Gold
        "rgba(255, 140, 0, 0.7)", // Dark Orange Gold
        "rgba(255, 200, 61, 0.7)", // Light Gold
      ],
      lightGold: [
        "rgba(255, 236, 139, 0.7)", // Light Yellow
        "rgba(255, 215, 0, 0.5)", // Gold (lighter)
        "rgba(250, 250, 210, 0.7)", // Light Goldenrod
        "rgba(255, 248, 220, 0.7)", // Cornsilk
        "rgba(255, 222, 173, 0.7)", // Navajo White
        "rgba(255, 228, 181, 0.7)", // Moccasin
      ],
      amber: [
        "rgba(255, 191, 0, 0.7)", // Amber
        "rgba(255, 204, 0, 0.7)", // Selective Yellow
        "rgba(255, 214, 0, 0.7)", // School Bus Yellow
        "rgba(255, 207, 64, 0.7)", // Maximum Yellow Red
        "rgba(255, 196, 0, 0.7)", // Golden Yellow
        "rgba(255, 177, 0, 0.7)", // Chrome Yellow
      ],
    }
  }, [])

  // Throttled mouse move handler to improve performance
  const handleMouseMove = useMemo(
    () =>
      throttle((e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY })
        setIsHovering(true)

        // Reset hover state after 2 seconds of no movement
        if (mouseTimeoutRef.current) {
          clearTimeout(mouseTimeoutRef.current)
        }
        mouseTimeoutRef.current = setTimeout(() => setIsHovering(false), 2000)
      }, 16), // ~60fps
    [],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    // Set canvas to full screen with device pixel ratio for sharpness
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Handle mouse click for interactive effects
    const handleMouseClick = (e: MouseEvent) => {
      setIsClicked(true)
      createExplosion(e.clientX, e.clientY)

      // Reset click state after animation
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
      clickTimeoutRef.current = setTimeout(() => setIsClicked(false), 1000)
    }

    // Handle touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        setMousePosition({ x: touch.clientX, y: touch.clientY })
        setIsClicked(true)
        createExplosion(touch.clientX, touch.clientY)

        // Reset click state after animation
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current)
        }
        clickTimeoutRef.current = setTimeout(() => setIsClicked(false), 1000)
      }
    }

    const handleTouchMove = throttle((e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        setMousePosition({ x: touch.clientX, y: touch.clientY })
        setIsHovering(true)

        // Reset hover state after touch ends
        if (mouseTimeoutRef.current) {
          clearTimeout(mouseTimeoutRef.current)
        }
        mouseTimeoutRef.current = setTimeout(() => setIsHovering(false), 2000)
      }
    }, 32) // ~30fps for touch events to save battery

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("click", handleMouseClick)
    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove)

    // Particle class with enhanced properties
    class Particle {
      x: number
      y: number
      size: number
      baseSize: number
      speedX: number
      speedY: number
      color: string
      opacity: number
      glowing: boolean
      pulseSpeed: number
      pulseDirection: number
      originalSpeedX: number
      originalSpeedY: number
      angle: number
      rotationSpeed: number
      life: number
      maxLife: number
      isExplosion: boolean
      colorSet: string[]

      constructor(x = -1, y = -1, isExplosion = false) {
        this.isExplosion = isExplosion

        // Choose a random color set from gold variations
        const colorSets = [colors.gold, colors.lightGold, colors.amber]
        this.colorSet = colorSets[Math.floor(Math.random() * colorSets.length)]

        if (isExplosion) {
          // Explosion particle
          this.x = x
          this.y = y
          this.baseSize = Math.random() * 4 + 1
          this.size = this.baseSize
          const speed = Math.random() * 5 + 1
          const angle = Math.random() * Math.PI * 2
          this.speedX = Math.cos(angle) * speed
          this.speedY = Math.sin(angle) * speed
          this.life = 100
          this.maxLife = 100
          this.color = this.colorSet[Math.floor(Math.random() * this.colorSet.length)]
        } else {
          // Regular particle
          this.x = x === -1 ? Math.random() * canvas.width : x
          this.y = y === -1 ? Math.random() * canvas.height : y
          this.baseSize = Math.random() * 3 + 0.5 // Smaller base size for better performance
          this.size = this.baseSize
          this.speedX = (Math.random() * 0.8 - 0.4) * 0.5 // Slower for better performance
          this.speedY = (Math.random() * 0.8 - 0.4) * 0.5
          this.life = -1 // -1 means infinite life
          this.maxLife = -1
          this.color = this.colorSet[Math.floor(Math.random() * this.colorSet.length)]
        }

        this.originalSpeedX = this.speedX
        this.originalSpeedY = this.speedY
        this.opacity = Math.random() * 0.5 + 0.3
        this.glowing = Math.random() > 0.7
        this.pulseSpeed = Math.random() * 0.02 + 0.01
        this.pulseDirection = 1
        this.angle = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() * 0.02 - 0.01) * 0.5
      }

      update(deltaTime: number) {
        // Time-based movement for consistent speed regardless of framerate
        const timeScale = deltaTime / 16.67 // Normalize to ~60fps

        // Update position
        this.x += this.speedX * timeScale
        this.y += this.speedY * timeScale
        this.angle += this.rotationSpeed * timeScale

        // Update life for explosion particles
        if (this.isExplosion) {
          this.life -= 2 * timeScale
          this.opacity = (this.life / this.maxLife) * 0.8

          // Add gravity effect for explosion particles
          this.speedY += 0.05 * timeScale

          // Slow down over time
          this.speedX *= 0.98
          this.speedY *= 0.98
        }

        // Pulse size for glowing particles
        if (this.glowing) {
          this.size += this.pulseDirection * this.pulseSpeed * timeScale
          if (this.size > this.baseSize * 1.5 || this.size < this.baseSize * 0.5) {
            this.pulseDirection *= -1
          }
        }

        // Bounce off edges with slight randomization
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX * (0.9 + Math.random() * 0.2)
          if (this.x > canvas.width) this.x = canvas.width
          if (this.x < 0) this.x = 0
        }

        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY * (0.9 + Math.random() * 0.2)
          if (this.y > canvas.height) this.y = canvas.height
          if (this.y < 0) this.y = 0
        }

        // Interactive effect: particles are attracted to mouse when hovering
        if (isHovering && !this.isExplosion) {
          const dx = mousePosition.x - this.x
          const dy = mousePosition.y - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 150

          if (distance < maxDistance) {
            const force = (1 - distance / maxDistance) * 0.03 * timeScale
            this.speedX += (dx / distance) * force
            this.speedY += (dy / distance) * force
          }
        } else if (!this.isExplosion) {
          // Gradually return to original speed when not hovering
          this.speedX = this.speedX * 0.98 + this.originalSpeedX * 0.02
          this.speedY = this.speedY * 0.98 + this.originalSpeedY * 0.02
        }

        // Apply some drag to prevent excessive speed for regular particles
        if (!this.isExplosion) {
          this.speedX *= 0.99
          this.speedY *= 0.99
        }

        // Return true if particle is still alive
        return this.life === -1 || this.life > 0
      }

      draw() {
        if (!ctx) return

        // Save context state
        ctx.save()

        // Translate to particle position
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)

        // Draw particle with glow effect for some particles
        if (this.glowing && !this.isExplosion) {
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2)
          gradient.addColorStop(0, this.color.replace(/[\d.]+\)$/, `${this.opacity})`))
          gradient.addColorStop(1, this.color.replace(/[\d.]+\)$/, "0)"))

          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(0, 0, this.size * 2, 0, Math.PI * 2)
          ctx.fill()
        }

        // Draw the main particle
        ctx.fillStyle = this.isExplosion
          ? this.color.replace(/[\d.]+\)$/, `${this.opacity})`)
          : this.color.replace(/[\d.]+\)$/, `${this.opacity})`)

        ctx.beginPath()

        // Randomly shaped particles: circles, diamonds, and triangles
        const shapeType = this.isExplosion ? 0 : Math.floor(this.x * this.y) % 3

        if (shapeType === 0) {
          // Circle
          ctx.arc(0, 0, this.size, 0, Math.PI * 2)
        } else if (shapeType === 1) {
          // Diamond
          ctx.moveTo(0, -this.size)
          ctx.lineTo(this.size, 0)
          ctx.lineTo(0, this.size)
          ctx.lineTo(-this.size, 0)
          ctx.closePath()
        } else {
          // Triangle
          ctx.moveTo(0, -this.size)
          ctx.lineTo(this.size, this.size)
          ctx.lineTo(-this.size, this.size)
          ctx.closePath()
        }

        ctx.fill()

        // Restore context state
        ctx.restore()
      }
    }

    // Wave class for flowing background effect - simplified for performance
    class Wave {
      amplitude: number
      period: number
      phase: number
      color: string
      lineWidth: number
      yOffset: number
      colorSet: string[]

      constructor(yOffsetPercent = 0.5) {
        // Choose a random color set from gold variations
        const colorSets = [colors.gold, colors.lightGold, colors.amber]
        this.colorSet = colorSets[Math.floor(Math.random() * colorSets.length)]

        this.amplitude = Math.random() * 15 + 5
        this.period = Math.random() * 200 + 100
        this.phase = Math.random() * Math.PI * 2
        const color = this.colorSet[Math.floor(Math.random() * this.colorSet.length)]
        this.color = color.replace(/[\d.]+\)$/, "0.1)")
        this.lineWidth = Math.random() * 1.5 + 0.5
        this.yOffset = canvas.height * yOffsetPercent
      }

      draw(deltaTime: number) {
        if (!ctx) return

        ctx.beginPath()
        ctx.lineWidth = this.lineWidth
        ctx.strokeStyle = this.color

        // Optimize by drawing fewer points
        const step = isMobile ? 10 : 5
        for (let x = 0; x < canvas.width; x += step) {
          const y = this.yOffset + Math.sin(x / this.period + this.phase) * this.amplitude

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.stroke()

        // Update phase for animation - time-based
        this.phase += 0.01 * (deltaTime / 16.67)

        // Make waves react to mouse movement
        if (isHovering) {
          const distanceFromMouse = Math.abs(mousePosition.y - this.yOffset)
          if (distanceFromMouse < 100) {
            this.amplitude = 15 + (100 - distanceFromMouse) / 5
          } else {
            this.amplitude = Math.max(5, this.amplitude * 0.98)
          }
        } else {
          this.amplitude = Math.max(5, this.amplitude * 0.98)
        }
      }
    }

    // Create particles - fewer for better performance
    const particleCount = isMobile
      ? Math.min(30, Math.floor((canvas.width * canvas.height) / 30000))
      : Math.min(80, Math.floor((canvas.width * canvas.height) / 15000))

    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Create explosion particles array
    const explosionParticles: Particle[] = []

    // Function to create explosion effect
    function createExplosion(x: number, y: number) {
      const particleCount = isMobile ? 15 : 30
      for (let i = 0; i < particleCount; i++) {
        explosionParticles.push(new Particle(x, y, true))
      }
    }

    // Create waves at different heights - fewer for better performance
    const waveCount = isMobile ? 2 : 3
    const waves: Wave[] = []
    for (let i = 0; i < waveCount; i++) {
      // Distribute waves across the screen height
      const yOffsetPercent = (i + 1) / (waveCount + 1)
      waves.push(new Wave(yOffsetPercent))
    }

    // Connect particles with lines - optimized
    function connectParticles() {
      if (!ctx) return
      const maxDistance = isMobile ? 80 : 120

      // Only check connections for a subset of particles to improve performance
      const checkEvery = isMobile ? 2 : 1
      for (let i = 0; i < particles.length; i += checkEvery) {
        for (let j = i + 1; j < particles.length; j += checkEvery) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            // Gunakan warna kuning/emas untuk koneksi
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 215, 0, ${0.1 * (1 - distance / maxDistance)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Animation loop with time-based animation
    function animate(timestamp: number) {
      if (!ctx || !canvas) return

      // Calculate delta time for smooth animation regardless of framerate
      const deltaTime = timestamp - (lastUpdateTimeRef.current || timestamp)
      lastUpdateTimeRef.current = timestamp

      // Clear canvas completely for better performance
      ctx.fillStyle = theme === "dark" ? "rgb(15, 23, 42)" : "rgb(15, 23, 42)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw waves
      waves.forEach((wave) => wave.draw(deltaTime))

      // Update and draw regular particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(deltaTime)
        particles[i].draw()
      }

      // Update and draw explosion particles
      for (let i = explosionParticles.length - 1; i >= 0; i--) {
        const isAlive = explosionParticles[i].update(deltaTime)
        if (!isAlive) {
          explosionParticles.splice(i, 1)
        } else {
          explosionParticles[i].draw()
        }
      }

      // Only connect particles if not on mobile for better performance
      if (!isMobile) {
        connectParticles()
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    // Clean up
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleMouseClick)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)

      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current)
      }

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [theme, isMobile, isHovering, isClicked, colors, handleMouseMove])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" style={{ pointerEvents: "auto" }} />
}
