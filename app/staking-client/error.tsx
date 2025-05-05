"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function StakingClientError({
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
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong!</h2>
        <p className="text-gray-300 mb-6">There was an error loading the staking interface. Please try again later.</p>
        <div className="flex justify-center gap-4">
          <Button onClick={reset} className="bg-yellow-500 hover:bg-yellow-600 text-black">
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20"
          >
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
