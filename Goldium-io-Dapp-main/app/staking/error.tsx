"use client"

import { useEffect } from "react"

export default function StakingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-black/50 border border-red-500/30 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong!</h2>
        <p className="mb-6 text-gray-300">
          We encountered an error while loading the staking page. Please try again later.
        </p>
        <button onClick={reset} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
          Try again
        </button>
      </div>
    </div>
  )
}
