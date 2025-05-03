"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  intensity?: number
  border?: boolean
  shine?: boolean
  shadow?: boolean
  className?: string
}

export function Card3D({
  children,
  intensity = 10,
  border = true,
  shine = true,
  shadow = true,
  className,
  ...props
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const posX = e.clientX - centerX
    const posY = e.clientY - centerY

    // Calculate rotation based on mouse position
    const rotateX = (posY / (rect.height / 2)) * -intensity
    const rotateY = (posX / (rect.width / 2)) * intensity

    // Calculate position for shine effect
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setRotation({ x: rotateX, y: rotateY })
    setPosition({ x, y })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    // Reset rotation when mouse leaves
    setRotation({ x: 0, y: 0 })
  }

  // Apply CSS variables for shine effect
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.setProperty("--x", `${position.x}%`)
      cardRef.current.style.setProperty("--y", `${position.y}%`)
    }
  }, [position])

  return (
    <div
      ref={cardRef}
      className={cn(
        "card-3d relative overflow-hidden rounded-lg",
        border && "border border-gold-500/20",
        shadow && "shadow-lg",
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg)",
        transition: isHovered ? "none" : "transform 0.5s ease-out",
      }}
      {...props}
    >
      <div className="card-3d-content relative z-10">{children}</div>
      {shine && <div className="card-3d-shine"></div>}
    </div>
  )
}
