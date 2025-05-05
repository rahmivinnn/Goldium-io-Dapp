"use client"

import { useState } from "react"
import Image from "next/image"

interface PhantomLogoProps {
  size?: number
  className?: string
}

export function PhantomLogo({ size = 20, className = "" }: PhantomLogoProps) {
  const [imageError, setImageError] = useState(false)

  // Simple ghost icon as fallback
  const renderGhostIcon = () => (
    <div
      className={`rounded-full bg-purple-600 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" style={{ width: size * 0.6, height: size * 0.6 }} className="text-white">
        <path
          fill="currentColor"
          d="M12 2C7.03 2 3 6.03 3 11V22L6 19L9 22L12 19L15 22L18 19L21 22V11C21 6.03 16.97 2 12 2M12 4C15.86 4 19 7.14 19 11V17.17L18 16.17L15 19.17L12 16.17L9 19.17L6 16.17L5 17.17V11C5 7.14 8.14 4 12 4M8 10C7.45 10 7 9.55 7 9S7.45 8 8 8 9 8.45 9 9 8.55 10 8 10M16 10C15.45 10 15 9.55 15 9S15.45 8 16 8 17 8.45 17 9 16.55 10 16 10Z"
        />
      </svg>
    </div>
  )

  // If we've already encountered an error, just show the ghost icon
  if (imageError) {
    return renderGhostIcon()
  }

  // Try to load the image, fall back to ghost icon on error
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src="/phantom-logo.png"
        alt="Phantom"
        width={size}
        height={size}
        className="rounded-full"
        onError={() => setImageError(true)}
      />
    </div>
  )
}
