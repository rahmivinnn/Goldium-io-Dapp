"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">
        Goldium DeFi Hub
      </h1>

      <div className="border border-amber-200/20 bg-black/60 backdrop-blur-sm rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="mb-6">We encountered an error while loading the DeFi Hub.</p>
        <div className="flex justify-center gap-4">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button onClick={() => (window.location.href = "/dashboard")} variant="outline">
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
