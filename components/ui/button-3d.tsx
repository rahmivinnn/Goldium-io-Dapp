"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "default" | "gold" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  intensity?: number
  className?: string
}

export function Button3D({
  children,
  variant = "default",
  size = "md",
  intensity = 5,
  className,
  ...props
}: Button3DProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isPressed, setIsPressed] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setPosition({ x, y })
  }

  // Apply CSS variables for shine effect
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.style.setProperty("--x", `${position.x}%`)
      buttonRef.current.style.setProperty("--y", `${position.y}%`)
    }
  }, [position])

  const getVariantClasses = () => {
    switch (variant) {
      case "gold":
        return "bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-600 hover:to-yellow-600"
      case "outline":
        return "bg-transparent border border-gold-500 text-gold-500 hover:bg-gold-500/10"
      case "ghost":
        return "bg-transparent text-white hover:bg-white/10"
      default:
        return "bg-slate-800 text-white hover:bg-slate-700"
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-3 py-1.5"
      case "lg":
        return "text-base px-6 py-3"
      default:
        return "text-sm px-4 py-2"
    }
  }

  return (
    <button
      ref={buttonRef}
      className={cn(
        "relative rounded-md font-medium transition-all duration-200 transform-gpu",
        "button-3d overflow-hidden",
        getVariantClasses(),
        getSizeClasses(),
        isPressed ? "scale-95" : "scale-100",
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {children}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-md opacity-0 transition-opacity group-hover:opacity-100">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{
            left: `calc(${position.x}% - 200px)`,
            top: 0,
            height: "100%",
            width: "400px",
            transform: "skewX(-20deg)",
            opacity: 0.6,
          }}
        />
      </div>
    </button>
  )
}
