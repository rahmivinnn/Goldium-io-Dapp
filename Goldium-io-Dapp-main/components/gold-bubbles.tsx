"use client"

import { useEffect, useRef } from "react"

interface GoldBubblesProps {
  count?: number
  minSize?: number
  maxSize?: number
  className?: string
}

export default function GoldBubbles({ count = 20, minSize = 10, maxSize = 40, className = "" }: GoldBubblesProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create bubbles
    const bubbles: HTMLDivElement[] = []

    for (let i = 0; i < count; i++) {
      const bubble = document.createElement("div")

      // Random size between minSize and maxSize
      const size = Math.random() * (maxSize - minSize) + minSize

      // Style the bubble
      bubble.style.position = "absolute"
      bubble.style.width = `${size}px`
      bubble.style.height = `${size}px`
      bubble.style.borderRadius = "50%"
      bubble.style.opacity = `${Math.random() * 0.3 + 0.1}`

      // Gold gradient with different opacities
      const opacity = Math.random() * 0.3 + 0.1
      bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(255, 215, 0, ${opacity}), rgba(218, 165, 32, ${opacity * 0.8}))`

      // Random starting position
      bubble.style.left = `${Math.random() * 100}%`
      bubble.style.bottom = `-${size}px`

      // Add to container and array
      container.appendChild(bubble)
      bubbles.push(bubble)

      // Add box shadow for glow effect
      bubble.style.boxShadow = "0 0 10px rgba(255, 215, 0, 0.3)"

      // Random animation duration between 5 and 15 seconds
      const duration = Math.random() * 10 + 5

      // Apply rising animation
      bubble.style.animation = `riseBubble ${duration}s infinite ease-in-out`

      // Random delay
      bubble.style.animationDelay = `${Math.random() * duration}s`
    }

    // Add keyframes for rising animation
    const styleSheet = document.createElement("style")
    styleSheet.textContent = `
      @keyframes riseBubble {
        0% {
          transform: translateY(0) rotate(0);
          opacity: 0;
        }
        10% {
          opacity: 0.2;
        }
        90% {
          opacity: 0.2;
        }
        100% {
          transform: translateY(-${container.clientHeight}px) rotate(${Math.random() * 360}deg);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(styleSheet)

    // Clean up
    return () => {
      bubbles.forEach((bubble) => {
        if (container.contains(bubble)) {
          container.removeChild(bubble)
        }
      })
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet)
      }
    }
  }, [count, minSize, maxSize])

  return <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} />
}
