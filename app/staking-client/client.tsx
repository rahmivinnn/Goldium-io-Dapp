"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Import the staking interface with no SSR
const StakingInterface = dynamic(() => import("@/components/defi/staking-interface"), {
  ssr: false,
  loading: () => <StakingInterfaceSkeleton />,
})

function StakingInterfaceSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto p-8 border border-yellow-500/20 rounded-lg bg-black/40 backdrop-blur-sm">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-yellow-500/20 rounded w-3/4 mx-auto"></div>
        <div className="h-4 bg-yellow-500/20 rounded w-1/2 mx-auto"></div>
        <div className="space-y-2">
          <div className="h-24 bg-yellow-500/10 rounded"></div>
          <div className="h-10 bg-yellow-500/10 rounded"></div>
          <div className="h-10 bg-yellow-500/10 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export function StakingClient() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <StakingInterfaceSkeleton />
  }

  return <StakingInterface />
}
