"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function StakingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Staking page error:", error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">
        Goldium Staking & Yield
      </h1>

      <div className="max-w-md mx-auto p-6 bg-black/60 backdrop-blur-sm border border-red-500/50 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong!</h2>
        <p className="text-gray-300 mb-6">
          We encountered an error while loading the staking interface. Please try again.
        </p>
        <div className="flex justify-center space-x-4">
          <Button onClick={reset} className="bg-gold hover:bg-gold/80 text-black">
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="border-gold/50 text-gold hover:bg-gold/10"
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
