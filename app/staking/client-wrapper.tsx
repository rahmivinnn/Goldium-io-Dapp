"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import the client component with no SSR
const StakingClient = dynamic(() => import("./client"), {
  ssr: false,
})

export default function ClientWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <StakingClient />
}
