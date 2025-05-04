"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useMobile } from "@/hooks/use-mobile"

export default function FloatingGoldCoins() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isMobile = useMobile()

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

    // Coin class
    class Coin {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      rotation: number
      rotationSpeed: number
      opacity: number

      constructor() {
        this.size = Math.random() * 20 + 10
        this.x = Math.random() * (canvas.width - this.size * 2) + this.size
        this.y = Math.random() * (canvas.height - this.size * 2) + this.size
        this.speedX = (Math.random() - 0.5) * 1
        this.speedY = (Math.random() - 0.5) * 1
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.05
        this.opacity = Math.random() * 0.5 + 0.3
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.rotation += this.rotationSpeed

        // Bounce off edges
        if (this.x <= this.size || this.x >= canvas.width - this.size) {
          this.speedX = -this.speedX * 0.8
        }

        if (this.y <= this.size || this.y >= canvas.height - this.size) {
          this.speedY = -this.speedY * 0.8
        }

        // Apply some drag
        this.speedX *= 0.99
        this.speedY *= 0.99

        // Add some random movement
        this.speedX += (Math.random() - 0.5) * 0.05
        this.speedY += (Math.random() - 0.5) * 0.05
      }

      draw() {
        if (!ctx) return

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)

        // Draw coin
        ctx.beginPath()
        ctx.arc(0, 0, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`
        ctx.fill()

        // Draw coin details
        ctx.beginPath()
        ctx.arc(0, 0, this.size * 0.8, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(218, 165, 32, ${this.opacity})`
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw "G" letter in the center
        ctx.fillStyle = `rgba(218, 165, 32, ${this.opacity})`
        ctx.font = `bold ${this.size}px Arial`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("G", 0, 0)

        ctx.restore()
      }
    }

    // Create coins - fewer on mobile for performance
    const coinCount = isMobile ? 10 : 20
    const coins: Coin[] = []

    for (let i = 0; i < coinCount; i++) {
      coins.push(new Coin())
    }

    // Animation loop
    function animate() {
      if (!ctx || !canvas) return

      // Clear canvas with transparency for trail effect
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw coins
      for (let i = 0; i < coins.length; i++) {
        coins[i].update()
        coins[i].draw()
      }

      requestAnimationFrame(animate)
    }

    animate()

    // Clean up
    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [theme, isMobile])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />
}
