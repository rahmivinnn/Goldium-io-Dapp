"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"
import { isSoundEnabled, setSoundEnabled, playUISound } from "@/services/sound-effects-service"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SoundToggleProps {
  className?: string
}

export function SoundToggle({ className = "" }: SoundToggleProps) {
  const [soundOn, setSoundOn] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Initialize state from localStorage on mount
  useEffect(() => {
    setMounted(true)
    setSoundOn(isSoundEnabled())
  }, [])

  // Handle toggle
  const handleToggle = () => {
    const newState = !soundOn
    setSoundOn(newState)
    setSoundEnabled(newState)
    
    // Play sound if turning on
    if (newState) {
      playUISound("click")
    }
  }

  // Don't render anything during SSR
  if (!mounted) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className={`h-8 w-8 ${className}`}
            aria-label={soundOn ? "Mute sounds" : "Unmute sounds"}
          >
            {soundOn ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{soundOn ? "Mute sounds" : "Unmute sounds"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
