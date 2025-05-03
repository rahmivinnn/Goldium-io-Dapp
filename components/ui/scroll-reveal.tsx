"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

type RevealDirection = "up" | "down" | "left" | "right" | "none"

type ScrollRevealProps = {
  children: ReactNode
  direction?: RevealDirection
  delay?: number
  duration?: number
  threshold?: number
  className?: string
  rootMargin?: string
  triggerOnce?: boolean
}

export function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  className = "",
  rootMargin = "0px",
  triggerOnce = true,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, rootMargin, triggerOnce })

  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: 50 }
      case "down":
        return { y: -50 }
      case "left":
        return { x: 50 }
      case "right":
        return { x: -50 }
      case "none":
        return {}
      default:
        return { y: 50 }
    }
  }

  return (
    <motion.div
      ref={ref as any}
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={isVisible ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...getInitialPosition() }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function GoldReveal({
  children,
  delay = 0,
  duration = 0.7,
  threshold = 0.1,
  className = "",
  rootMargin = "0px",
  triggerOnce = true,
}: Omit<ScrollRevealProps, "direction">) {
  const { ref, isVisible } = useScrollAnimation({ threshold, rootMargin, triggerOnce })

  return (
    <motion.div
      ref={ref as any}
      initial={{ opacity: 0, scale: 0.95, filter: "brightness(0.5)" }}
      animate={
        isVisible
          ? {
              opacity: 1,
              scale: 1,
              filter: "brightness(1.2)",
            }
          : {
              opacity: 0,
              scale: 0.95,
              filter: "brightness(0.5)",
            }
      }
      transition={{
        duration,
        delay,
        ease: "easeOut",
        filter: { duration: duration * 1.5, delay: delay + duration * 0.5 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
