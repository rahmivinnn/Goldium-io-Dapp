"use client"

import { useRef, type ReactNode, useMemo } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

type ParallaxScrollProps = {
  children: ReactNode
  speed?: number
  direction?: "up" | "down" | "left" | "right"
  className?: string
}

export function ParallaxScroll({ children, speed = 0.5, direction = "up", className = "" }: ParallaxScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const inputValue = useMemo(() => {
    switch (direction) {
      case "up":
        return ["0%", `${-speed * 100}%`]
      case "down":
        return ["0%", `${speed * 100}%`]
      case "left":
        return ["0%", `${-speed * 100}%`]
      case "right":
        return ["0%", `${speed * 100}%`]
      default:
        return ["0%", `${-speed * 100}%`]
    }
  }, [direction, speed])

  const transformValue = useTransform(scrollYProgress, [0, 1], inputValue)

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{
          [direction === "up" || direction === "down" ? "y" : "x"]: transformValue,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
