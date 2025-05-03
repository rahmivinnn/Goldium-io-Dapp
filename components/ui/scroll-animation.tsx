"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

type AnimationType =
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "rotate"
  | "gold-reveal"

type ScrollAnimationProps = {
  children: ReactNode
  type?: AnimationType
  delay?: number
  duration?: number
  threshold?: number
  className?: string
  rootMargin?: string
  triggerOnce?: boolean
}

export function ScrollAnimation({
  children,
  type = "fade",
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  className = "",
  rootMargin = "0px",
  triggerOnce = true,
}: ScrollAnimationProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold, rootMargin, triggerOnce })

  const getAnimationVariants = () => {
    switch (type) {
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }
      case "slide-up":
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }
      case "slide-down":
        return {
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0 },
        }
      case "slide-left":
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 },
        }
      case "slide-right":
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
        }
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        }
      case "rotate":
        return {
          hidden: { opacity: 0, rotate: -10 },
          visible: { opacity: 1, rotate: 0 },
        }
      case "gold-reveal":
        return {
          hidden: { opacity: 0, scale: 0.9, filter: "brightness(0.5)" },
          visible: {
            opacity: 1,
            scale: 1,
            filter: "brightness(1.2)",
            transition: {
              duration: duration,
              delay: delay,
              filter: { duration: duration * 1.5, delay: delay + duration * 0.5 },
            },
          },
        }
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }
    }
  }

  return (
    <motion.div
      ref={ref as any}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={getAnimationVariants()}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Staggered container for multiple animations
export function ScrollStaggerContainer({
  children,
  staggerDelay = 0.1,
  className = "",
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
}: {
  children: ReactNode
  staggerDelay?: number
  className?: string
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold, rootMargin, triggerOnce })

  return (
    <motion.div
      ref={ref as any}
      className={className}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// Staggered item for use within ScrollStaggerContainer
export function ScrollStaggerItem({
  children,
  type = "fade",
  className = "",
}: {
  children: ReactNode
  type?: AnimationType
  className?: string
}) {
  const getAnimationVariants = () => {
    switch (type) {
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }
      case "slide-up":
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 },
        }
      case "slide-down":
        return {
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0 },
        }
      case "slide-left":
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 },
        }
      case "slide-right":
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 },
        }
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
        }
      case "rotate":
        return {
          hidden: { opacity: 0, rotate: -10 },
          visible: { opacity: 1, rotate: 0 },
        }
      case "gold-reveal":
        return {
          hidden: { opacity: 0, scale: 0.9, filter: "brightness(0.5)" },
          visible: {
            opacity: 1,
            scale: 1,
            filter: "brightness(1.2)",
            transition: {
              filter: { duration: 0.8, delay: 0.2 },
            },
          },
        }
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }
    }
  }

  return (
    <motion.div variants={getAnimationVariants()} className={className} transition={{ duration: 0.5, ease: "easeOut" }}>
      {children}
    </motion.div>
  )
}
