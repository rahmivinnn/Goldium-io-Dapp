"use client"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"

export default function GameControls() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Only show mobile controls on mobile devices
  if (!isMobile) return null

  const simulateKeyEvent = (key: string, isDown: boolean) => {
    const event = new KeyboardEvent(isDown ? "keydown" : "keyup", {
      code: key,
      bubbles: true,
    })
    window.dispatchEvent(event)
  }

  return (
    <div className="absolute bottom-4 left-0 w-full px-4 pointer-events-none">
      <div className="flex justify-between">
        {/* Movement controls */}
        <div className="grid grid-cols-3 gap-2 pointer-events-auto">
          <div className="w-12 h-12"></div>
          <button
            className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center border border-gold/30 active:bg-gold/20"
            onTouchStart={() => simulateKeyEvent("ArrowUp", true)}
            onTouchEnd={() => simulateKeyEvent("ArrowUp", false)}
          >
            <ArrowUp className="w-6 h-6 text-gold" />
          </button>
          <div className="w-12 h-12"></div>

          <button
            className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center border border-gold/30 active:bg-gold/20"
            onTouchStart={() => simulateKeyEvent("ArrowLeft", true)}
            onTouchEnd={() => simulateKeyEvent("ArrowLeft", false)}
          >
            <ArrowLeft className="w-6 h-6 text-gold" />
          </button>
          <button
            className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center border border-gold/30 active:bg-gold/20"
            onTouchStart={() => simulateKeyEvent("ArrowDown", true)}
            onTouchEnd={() => simulateKeyEvent("ArrowDown", false)}
          >
            <ArrowDown className="w-6 h-6 text-gold" />
          </button>
          <button
            className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center border border-gold/30 active:bg-gold/20"
            onTouchStart={() => simulateKeyEvent("ArrowRight", true)}
            onTouchEnd={() => simulateKeyEvent("ArrowRight", false)}
          >
            <ArrowRight className="w-6 h-6 text-gold" />
          </button>
        </div>

        {/* Jump button */}
        <button
          className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center border border-gold/30 active:bg-gold/20 pointer-events-auto"
          onTouchStart={() => simulateKeyEvent("Space", true)}
          onTouchEnd={() => simulateKeyEvent("Space", false)}
        >
          <span className="text-gold font-bold">JUMP</span>
        </button>
      </div>
    </div>
  )
}
