"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import all components with no SSR
const DynamicDefiContent = dynamic(() => import("./defi-content"), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center">
      <p>Loading DeFi content...</p>
    </div>
  ),
})

export default function DefiClient() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <DynamicDefiContent />
}
