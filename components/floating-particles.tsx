"use client"

import { useEffect, useRef } from "react"

interface ParticleProps {
  count?: number
  speed?: number
  className?: string
}

export default function FloatingParticles({ count = 30, speed = 1, className = "" }: ParticleProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create particles
    const particles: HTMLDivElement[] = []

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div")

      // Random size between 3px and 8px
      const size = Math.random() * 5 + 3

      // Style the particle
      particle.style.position = "absolute"
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.borderRadius = "50%"
      particle.style.opacity = `${Math.random() * 0.6 + 0.2}`

      // Gold colors with different opacities
      const goldColors = [
        "rgba(255, 215, 0, 0.7)",
        "rgba(218, 165, 32, 0.6)",
        "rgba(255, 223, 0, 0.5)",
        "rgba(207, 181, 59, 0.6)",
      ]

      particle.style.backgroundColor = goldColors[Math.floor(Math.random() * goldColors.length)]

      // Random starting position
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`

      // Add to container and array
      container.appendChild(particle)
      particles.push(particle)

      // Add box shadow for glow effect
      particle.style.boxShadow = "0 0 10px rgba(255, 215, 0, 0.5)"

      // Random animation duration
      const duration = (Math.random() * 20 + 10) / speed

      // Apply floating animation
      particle.style.animation = `floatingParticle ${duration}s infinite ease-in-out`

      // Random delay
      particle.style.animationDelay = `${Math.random() * duration}s`
    }

    // Add keyframes for floating animation
    const styleSheet = document.createElement("style")
    styleSheet.textContent = `
      @keyframes floatingParticle {
        0%, 100% {
          transform: translate(0, 0);
        }
        25% {
          transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px);
        }
        50% {
          transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px);
        }
        75% {
          transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px);
        }
      }
    `
    document.head.appendChild(styleSheet)

    // Clean up
    return () => {
      particles.forEach((particle) => {
        if (container.contains(particle)) {
          container.removeChild(particle)
        }
      })
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet)
      }
    }
  }, [count, speed])

  return <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} />
}
