"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"

// Import the client page with no SSR
const ClientPage = dynamic(() => import("./client-page"), {
  ssr: false,
  loading: () => <LoadingFallback />,
})

function LoadingFallback() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">
        Goldium DeFi Hub
      </h1>

      <div className="border border-amber-200/20 bg-black/60 backdrop-blur-sm rounded-lg p-8 text-center">
        <p className="mb-4">Loading DeFi Hub...</p>
      </div>
    </div>
  )
}

export default function ClientWrapper() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ClientPage />
    </Suspense>
  )
}
