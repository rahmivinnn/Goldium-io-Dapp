"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { useMobile } from "@/hooks/use-mobile"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isMobile = useMobile()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Track mouse position for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsHovering(true)
      // Reset hover state after 2 seconds of no movement
      clearTimeout(mouseTimeoutRef.current as NodeJS.Timeout)
      mouseTimeoutRef.current = setTimeout(() => setIsHovering(false), 2000)
    }

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

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        setMousePosition({ x: touch.clientX, y: touch.clientY })
        setIsHovering(true)

        // Reset hover state after touch ends
        clearTimeout(mouseTimeoutRef.current as NodeJS.Timeout)
        mouseTimeoutRef.current = setTimeout(() => setIsHovering(false), 2000)
      }
    }

    const mouseTimeoutRef = { current: setTimeout(() => {}, 0) }

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

      constructor(x = -1, y = -1, isExplosion = false) {
        this.isExplosion = isExplosion

        if (isExplosion) {
          // Explosion particle
          this.x = x
          this.y = y
          this.baseSize = Math.random() * 5 + 2
          this.size = this.baseSize
          const speed = Math.random() * 6 + 2
          const angle = Math.random() * Math.PI * 2
          this.speedX = Math.cos(angle) * speed
          this.speedY = Math.sin(angle) * speed
          this.life = 100
          this.maxLife = 100
        } else {
          // Regular particle
          this.x = x === -1 ? Math.random() * canvas.width : x
          this.y = y === -1 ? Math.random() * canvas.height : y
          this.baseSize = Math.random() * 4 + 1
          this.size = this.baseSize
          this.speedX = (Math.random() * 1 - 0.5) * 0.7
          this.speedY = (Math.random() * 1 - 0.5) * 0.7
          this.life = -1 // -1 means infinite life
          this.maxLife = -1
        }

        this.originalSpeedX = this.speedX
        this.originalSpeedY = this.speedY
        this.color = getParticleColor()
        this.opacity = Math.random() * 0.5 + 0.3
        this.glowing = Math.random() > 0.7
        this.pulseSpeed = Math.random() * 0.02 + 0.01
        this.pulseDirection = 1
        this.angle = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() * 0.02 - 0.01) * 0.5
      }

      update() {
        // Update position
        this.x += this.speedX
        this.y += this.speedY
        this.angle += this.rotationSpeed

        // Update life for explosion particles
        if (this.isExplosion) {
          this.life -= 2
          this.opacity = (this.life / this.maxLife) * 0.8

          // Add gravity effect for explosion particles
          this.speedY += 0.05

          // Slow down over time
          this.speedX *= 0.98
          this.speedY *= 0.98
        }

        // Pulse size for glowing particles
        if (this.glowing) {
          this.size += this.pulseDirection * this.pulseSpeed
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
          const maxDistance = 200

          if (distance < maxDistance) {
            const force = (1 - distance / maxDistance) * 0.05
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
          gradient.addColorStop(0, `rgba(255, 215, 0, ${this.opacity})`)
          gradient.addColorStop(1, "rgba(255, 215, 0, 0)")

          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(0, 0, this.size * 2, 0, Math.PI * 2)
          ctx.fill()
        }

        // Draw the main particle
        ctx.fillStyle = this.isExplosion ? `rgba(255, 215, 0, ${this.opacity})` : `rgba(255, 215, 0, ${this.opacity})`

        ctx.beginPath()

        // Randomly shaped particles: circles, squares, and stars
        const shapeType = this.isExplosion ? 0 : Math.floor(this.x * this.y) % 3

        if (shapeType === 0) {
          // Circle
          ctx.arc(0, 0, this.size, 0, Math.PI * 2)
        } else if (shapeType === 1) {
          // Square
          ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size)
        } else {
          // Star
          const spikes = 5
          const outerRadius = this.size
          const innerRadius = this.size / 2

          for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius
            const angle = (Math.PI * 2 * i) / (spikes * 2)
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius

            if (i === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          }
          ctx.closePath()
        }

        ctx.fill()

        // Restore context state
        ctx.restore()
      }
    }

    // Wave class for flowing background effect
    class Wave {
      amplitude: number
      period: number
      phase: number
      color: string
      lineWidth: number
      yOffset: number

      constructor(yOffsetPercent = 0.5) {
        this.amplitude = Math.random() * 20 + 10
        this.period = Math.random() * 200 + 100
        this.phase = Math.random() * Math.PI * 2
        this.color = `rgba(255, 215, 0, ${Math.random() * 0.1 + 0.05})`
        this.lineWidth = Math.random() * 2 + 1
        this.yOffset = canvas.height * yOffsetPercent
      }

      draw() {
        if (!ctx) return

        ctx.beginPath()
        ctx.lineWidth = this.lineWidth
        ctx.strokeStyle = this.color

        for (let x = 0; x < canvas.width; x += 5) {
          const y = this.yOffset + Math.sin(x / this.period + this.phase) * this.amplitude

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.stroke()

        // Update phase for animation
        this.phase += 0.01

        // Make waves react to mouse movement
        if (isHovering) {
          const distanceFromMouse = Math.abs(mousePosition.y - this.yOffset)
          if (distanceFromMouse < 100) {
            this.amplitude = 20 + (100 - distanceFromMouse) / 5
          } else {
            this.amplitude = Math.max(10, this.amplitude * 0.98)
          }
        } else {
          this.amplitude = Math.max(10, this.amplitude * 0.98)
        }
      }
    }

    // Get particle color based on theme
    function getParticleColor() {
      // Gold theme colors with more variety
      const colors = [
        "rgba(255, 215, 0, 0.7)", // Gold
        "rgba(218, 165, 32, 0.6)", // Golden rod
        "rgba(255, 223, 0, 0.5)", // Yellow gold
        "rgba(207, 181, 59, 0.6)", // Old gold
        "rgba(255, 185, 15, 0.5)", // Golden yellow
        "rgba(184, 134, 11, 0.6)", // Dark golden rod
        "rgba(212, 175, 55, 0.5)", // Metallic gold
      ]

      return colors[Math.floor(Math.random() * colors.length)]
    }

    // Create particles - fewer on mobile for performance
    const particleCount = isMobile
      ? Math.min(50, Math.floor((canvas.width * canvas.height) / 20000))
      : Math.min(150, Math.floor((canvas.width * canvas.height) / 10000))

    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Create explosion particles array
    const explosionParticles: Particle[] = []

    // Function to create explosion effect
    function createExplosion(x: number, y: number) {
      const particleCount = isMobile ? 30 : 60
      for (let i = 0; i < particleCount; i++) {
        explosionParticles.push(new Particle(x, y, true))
      }
    }

    // Create waves at different heights
    const waveCount = isMobile ? 3 : 5
    const waves: Wave[] = []
    for (let i = 0; i < waveCount; i++) {
      // Distribute waves across the screen height
      const yOffsetPercent = (i + 1) / (waveCount + 1)
      waves.push(new Wave(yOffsetPercent))
    }

    // Connect particles with lines
    function connectParticles() {
      if (!ctx) return
      const maxDistance = isMobile ? 100 : 150

      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 215, 0, ${0.15 * (1 - distance / maxDistance)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Create floating orbs that move slowly across the screen
    class FloatingOrb {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      targetX: number
      targetY: number
      moveSpeed: number

      constructor() {
        this.size = Math.random() * 100 + 50
        this.opacity = Math.random() * 0.1 + 0.05
        this.moveSpeed = Math.random() * 0.01 + 0.005

        // Start from edges
        const side = Math.floor(Math.random() * 4)
        if (side === 0) {
          // top
          this.x = Math.random() * canvas.width
          this.y = -this.size
          this.speedY = Math.random() * 0.2 + 0.1
          this.speedX = (Math.random() - 0.5) * 0.2
        } else if (side === 1) {
          // right
          this.x = canvas.width + this.size
          this.y = Math.random() * canvas.height
          this.speedX = -(Math.random() * 0.2 + 0.1)
          this.speedY = (Math.random() - 0.5) * 0.2
        } else if (side === 2) {
          // bottom
          this.x = Math.random() * canvas.width
          this.y = canvas.height + this.size
          this.speedY = -(Math.random() * 0.2 + 0.1)
          this.speedX = (Math.random() - 0.5) * 0.2
        } else {
          // left
          this.x = -this.size
          this.y = Math.random() * canvas.height
          this.speedX = Math.random() * 0.2 + 0.1
          this.speedY = (Math.random() - 0.5) * 0.2
        }

        // Set initial target position
        this.targetX = this.x
        this.targetY = this.y
        this.updateTarget()
      }

      updateTarget() {
        // Set a new target position
        this.targetX = Math.random() * canvas.width
        this.targetY = Math.random() * canvas.height
      }

      update() {
        // Move towards target with some inertia
        if (isHovering) {
          // When mouse is active, move away from mouse
          const dx = this.x - mousePosition.x
          const dy = this.y - mousePosition.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 300) {
            const repelForce = 0.5 * (1 - distance / 300)
            this.speedX += (dx / distance) * repelForce
            this.speedY += (dy / distance) * repelForce
          }
        }

        // Apply current speed
        this.x += this.speedX
        this.y += this.speedY

        // Apply drag
        this.speedX *= 0.99
        this.speedY *= 0.99

        // Occasionally update target
        if (Math.random() < 0.005) {
          this.updateTarget()
        }

        // Move towards target
        const dx = this.targetX - this.x
        const dy = this.targetY - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > 10) {
          this.speedX += (dx / distance) * this.moveSpeed
          this.speedY += (dy / distance) * this.moveSpeed
        }

        // Check if orb is off screen
        return !(
          this.x < -this.size * 2 ||
          this.x > canvas.width + this.size * 2 ||
          this.y < -this.size * 2 ||
          this.y > canvas.height + this.size * 2
        )
      }

      draw() {
        if (!ctx) return

        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)

        // Fixed: Use proper RGBA format with correct opacity values
        gradient.addColorStop(0, `rgba(255, 215, 0, ${this.opacity * 4})`)
        gradient.addColorStop(1, `rgba(255, 215, 0, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create initial orbs
    const orbs: FloatingOrb[] = []
    for (let i = 0; i < 3; i++) {
      orbs.push(new FloatingOrb())
    }

    // Add new orb occasionally
    setInterval(() => {
      if (orbs.length < 5) {
        orbs.push(new FloatingOrb())
      }
    }, 10000)

    // Animation loop
    function animate() {
      if (!ctx || !canvas) return

      // Clear with semi-transparent background for trail effect
      ctx.fillStyle = theme === "dark" ? "rgba(15, 23, 42, 0.2)" : "rgba(15, 23, 42, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw waves
      waves.forEach((wave) => wave.draw())

      // Update and draw orbs
      for (let i = orbs.length - 1; i >= 0; i--) {
        const isVisible = orbs[i].update()
        if (!isVisible) {
          orbs.splice(i, 1)
        } else {
          orbs[i].draw()
        }
      }

      // Update and draw regular particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }

      // Update and draw explosion particles
      for (let i = explosionParticles.length - 1; i >= 0; i--) {
        const isAlive = explosionParticles[i].update()
        if (!isAlive) {
          explosionParticles.splice(i, 1)
        } else {
          explosionParticles[i].draw()
        }
      }

      connectParticles()
      requestAnimationFrame(animate)
    }

    animate()

    // Clean up
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleMouseClick)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      clearTimeout(mouseTimeoutRef.current as NodeJS.Timeout)
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }
    }
  }, [theme, isMobile, isHovering, isClicked])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ pointerEvents: "auto", cursor: "none" }}
    />
  )
}
