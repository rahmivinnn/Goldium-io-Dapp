"use client"

import { Orbitron } from "next/font/google"

const orbitron = Orbitron({ subsets: ["latin"] })

export default function MarketplaceHeader() {
  return (
    <div className="mb-8 text-center">
      <h1
        className={`text-4xl md:text-5xl font-bold ${orbitron.className} tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600`}
      >
        NFT Marketplace
      </h1>
      <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
        Discover, collect, and trade unique digital assets from the Goldium universe
      </p>
    </div>
  )
}
