"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { throttle } from "@/lib/utils"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMobile = useMobile()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
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
      ],
      lightGold: [
        "rgba(255, 236, 139, 0.7)", // Light Yellow
        "rgba(255, 215, 0, 0.5)", // Gold (lighter)
        "rgba(250, 250, 210, 0.7)", // Light Goldenrod
      ],
    }
  }, [])

  // Throttled mouse move handler to improve performance
  const handleMouseMove = useMemo(
    () =>
      throttle((e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY })
        setIsHovering(true)
        // Auto reset hover state after 1 second
        setTimeout(() => setIsHovering(false), 1000)
      }, 50), // Throttle more aggressively
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
    window.addEventListener("mousemove", handleMouseMove)

    // Simplified Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5 // Smaller particles
        this.speedX = (Math.random() * 0.6 - 0.3) * 0.3 // Slower movement
        this.speedY = (Math.random() * 0.6 - 0.3) * 0.3

        // Simplified color selection
        const colorSet = Math.random() > 0.5 ? colors.gold : colors.lightGold
        this.color = colorSet[Math.floor(Math.random() * colorSet.length)]
        this.opacity = Math.random() * 0.5 + 0.3
      }

      update(deltaTime: number) {
        // Time-based movement for consistent speed regardless of framerate
        const timeScale = deltaTime / 16.67 // Normalize to ~60fps

        // Update position
        this.x += this.speedX * timeScale
        this.y += this.speedY * timeScale

        // Simplified edge handling
        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height

        // Simplified mouse interaction
        if (isHovering) {
          const dx = mousePosition.x - this.x
          const dy = mousePosition.y - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 100

          if (distance < maxDistance) {
            const force = (1 - distance / maxDistance) * 0.02 * timeScale
            this.speedX += (dx / distance) * force
            this.speedY += (dy / distance) * force
          }
        }
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color.replace(/[\d.]+\)$/, `${this.opacity})`)
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create fewer particles
    const particleCount = isMobile
      ? Math.min(20, Math.floor((canvas.width * canvas.height) / 50000))
      : Math.min(40, Math.floor((canvas.width * canvas.height) / 25000))

    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Simplified connection function
    function connectParticles() {
      if (!ctx) return
      const maxDistance = isMobile ? 70 : 100
      const checkEvery = isMobile ? 3 : 2 // Check fewer connections

      for (let i = 0; i < particles.length; i += checkEvery) {
        for (let j = i + 1; j < particles.length; j += checkEvery) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 215, 0, ${0.05 * (1 - distance / maxDistance)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    // Optimized animation loop
    function animate(timestamp: number) {
      if (!ctx || !canvas) return

      // Calculate delta time for smooth animation regardless of framerate
      const deltaTime = timestamp - (lastUpdateTimeRef.current || timestamp)
      lastUpdateTimeRef.current = timestamp

      // Clear canvas with black background
      ctx.fillStyle = "rgb(15, 15, 15)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(deltaTime)
        particles[i].draw()
      }

      // Only connect particles if not on mobile
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

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isMobile, isHovering, colors, handleMouseMove])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" style={{ pointerEvents: "auto" }} />
}
