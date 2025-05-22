"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useMobile } from "@/hooks/use-mobile"

export default function GoldRain() {
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

    // Raindrop class
    class Raindrop {
      x: number
      y: number
      length: number
      speed: number
      thickness: number
      opacity: number
      hasGlow: boolean

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height - canvas.height
        this.length = Math.random() * 10 + 5
        this.speed = Math.random() * 5 + 2
        this.thickness = Math.random() * 2 + 0.5
        this.opacity = Math.random() * 0.3 + 0.1
        this.hasGlow = Math.random() > 0.8
      }

      update() {
        this.y += this.speed

        // Reset raindrop when it goes off screen
        if (this.y > canvas.height) {
          this.y = -this.length * 2
          this.x = Math.random() * canvas.width
        }
      }

      draw() {
        if (!ctx) return

        // Draw glow effect for some raindrops
        if (this.hasGlow) {
          ctx.shadowColor = "rgba(255, 215, 0, 0.5)"
          ctx.shadowBlur = 10
        } else {
          ctx.shadowBlur = 0
        }

        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x, this.y + this.length)
        ctx.lineWidth = this.thickness
        ctx.strokeStyle = `rgba(255, 215, 0, ${this.opacity})`
        ctx.stroke()

        // Reset shadow
        ctx.shadowBlur = 0
      }
    }

    // Create raindrops - fewer on mobile for performance
    const raindropCount = isMobile ? 50 : 100
    const raindrops: Raindrop[] = []

    for (let i = 0; i < raindropCount; i++) {
      raindrops.push(new Raindrop())
    }

    // Animation loop
    function animate() {
      if (!ctx || !canvas) return

      // Clear canvas with transparency for trail effect
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw raindrops
      for (let i = 0; i < raindrops.length; i++) {
        raindrops[i].update()
        raindrops[i].draw()
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
