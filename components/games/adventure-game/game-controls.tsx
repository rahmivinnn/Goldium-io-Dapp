"use client"

import { useState, useEffect } from "react"
import { useMobile } from "@/hooks/use-mobile"

export default function GameControls() {
  const isMobile = useMobile()
  const [touchControls, setTouchControls] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  })

  // Simulate key presses for mobile controls
  useEffect(() => {
    if (!isMobile) return

    const simulateKeyEvent = (key: string, isDown: boolean) => {
      const event = new KeyboardEvent(isDown ? "keydown" : "keyup", {
        code: key,
        bubbles: true,
      })
      window.dispatchEvent(event)
    }

    if (touchControls.forward) simulateKeyEvent("ArrowUp", true)
    else simulateKeyEvent("ArrowUp", false)

    if (touchControls.backward) simulateKeyEvent("ArrowDown", true)
    else simulateKeyEvent("ArrowDown", false)

    if (touchControls.left) simulateKeyEvent("ArrowLeft", true)
    else simulateKeyEvent("ArrowLeft", false)

    if (touchControls.right) simulateKeyEvent("ArrowRight", true)
    else simulateKeyEvent("ArrowRight", false)

    if (touchControls.jump) simulateKeyEvent("Space", true)
    else simulateKeyEvent("Space", false)
  }, [touchControls, isMobile])

  if (!isMobile) return null

  return (
    <div className="absolute bottom-20 left-0 w-full flex justify-center items-center">
      <div className="relative w-40 h-40">
        {/* Up button */}
        <button
          className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full border border-gold/30 flex items-center justify-center"
          onTouchStart={() => setTouchControls((prev) => ({ ...prev, forward: true }))}
          onTouchEnd={() => setTouchControls((prev) => ({ ...prev, forward: false }))}
        >
          <span className="text-white">↑</span>
        </button>

        {/* Down button */}
        <button
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full border border-gold/30 flex items-center justify-center"
          onTouchStart={() => setTouchControls((prev) => ({ ...prev, backward: true }))}
          onTouchEnd={() => setTouchControls((prev) => ({ ...prev, backward: false }))}
        >
          <span className="text-white">↓</span>
        </button>

        {/* Left button */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full border border-gold/30 flex items-center justify-center"
          onTouchStart={() => setTouchControls((prev) => ({ ...prev, left: true }))}
          onTouchEnd={() => setTouchControls((prev) => ({ ...prev, left: false }))}
        >
          <span className="text-white">←</span>
        </button>

        {/* Right button */}
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full border border-gold/30 flex items-center justify-center"
          onTouchStart={() => setTouchControls((prev) => ({ ...prev, right: true }))}
          onTouchEnd={() => setTouchControls((prev) => ({ ...prev, right: false }))}
        >
          <span className="text-white">→</span>
        </button>
      </div>

      {/* Jump button */}
      <button
        className="absolute bottom-4 right-4 w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full border border-gold/30 flex items-center justify-center"
        onTouchStart={() => setTouchControls((prev) => ({ ...prev, jump: true }))}
        onTouchEnd={() => setTouchControls((prev) => ({ ...prev, jump: false }))}
      >
        <span className="text-white">JUMP</span>
      </button>
    </div>
  )
}
