"use client"

import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Check, QrCode } from "lucide-react"
import { useState, useEffect } from "react"
import FloatingParticles from "@/components/floating-particles"
import Link from "next/link"
import { AutoWalletPopup } from "@/components/auto-wallet-popup"
import { useNetwork } from "@/contexts/network-context"
import { QRCode } from "@/components/qr-code"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showGoldQR, setShowGoldQR] = useState(false)
  const [showManaQR, setShowManaQR] = useState(false)

  // Safe default values that won't cause errors during SSR
  const contractAddress = "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump"
  const manaContractAddress = "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey"

  // Only access context after component is mounted
  const { goldTokenAddress } = useNetwork()

  useEffect(() => {
    setMounted(true)
  }, [])

  const copyToClipboard = (address: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      {mounted && <AutoWalletPopup />}
      <main className="flex min-h-screen flex-col items-center justify-between relative overflow-hidden">
        <FloatingParticles />

        {/* Hero Section */}
        <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center text-yellow-500 mb-6 leading-tight">
            EXPERIENCE THE FUTURE OF
            <br />
            DECENTRALIZED FINANCE
          </h1>

          <p className="text-white text-center max-w-3xl mb-12 text-lg">
            Join Goldium.io for NFT trading, staking, and seamless crypto payments
            <br />
            powered by GOLD token.
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-12 w-full max-w-md">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-md w-full">
              Get Started
            </Button>

            <Button
              variant="outline"
              className="border-yellow-500/50 text-white hover:bg-yellow-500/10 font-medium py-3 px-6 rounded-md flex items-center justify-center gap-2 w-full"
              onClick={() => copyToClipboard(contractAddress)}
            >
              {contractAddress.substring(0, 8)}...{contractAddress.substring(contractAddress.length - 4)}
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 text-yellow-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>

          <p className="text-gray-400 text-sm uppercase tracking-wider">RATED 5 STARS BY USERS</p>

          {/* Token Contract Cards */}
          <div className="mt-12 w-full max-w-2xl space-y-4">
            {/* GOLD Token Card */}
            <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                  <span className="font-bold text-black">G</span>
                </div>
                <h3 className="text-yellow-500 font-bold">GOLD Token Contract Address</h3>
              </div>

              {!showGoldQR ? (
                <div className="flex items-center justify-between bg-black/70 rounded-md p-3 border border-yellow-500/20">
                  <code className="text-yellow-500 font-mono text-sm sm:text-base overflow-x-auto scrollbar-hide">
                    {contractAddress}
                  </code>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-yellow-500 hover:bg-yellow-500/10"
                      onClick={() => copyToClipboard(contractAddress)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-yellow-500 hover:bg-yellow-500/10"
                      onClick={() => window.open(`https://explorer.solana.com/address/${contractAddress}`, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-yellow-500 hover:bg-yellow-500/10"
                      onClick={() => setShowGoldQR(true)}
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center p-4">
                  {mounted && <QRCode value={contractAddress} tokenName="GOLD" color="#F59E0B" />}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-yellow-500/50 text-yellow-500"
                    onClick={() => setShowGoldQR(false)}
                  >
                    Show Address
                  </Button>
                </div>
              )}
            </div>

            {/* MANA Token Card */}
            <div className="bg-black/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="font-bold text-black">M</span>
                </div>
                <h3 className="text-blue-500 font-bold">MANA Token Contract Address</h3>
              </div>

              {!showManaQR ? (
                <div className="flex items-center justify-between bg-black/70 rounded-md p-3 border border-blue-500/20">
                  <code className="text-blue-500 font-mono text-sm sm:text-base overflow-x-auto scrollbar-hide">
                    {manaContractAddress}
                  </code>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:bg-blue-500/10"
                      onClick={() => copyToClipboard(manaContractAddress)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:bg-blue-500/10"
                      onClick={() =>
                        window.open(`https://explorer.solana.com/address/${manaContractAddress}`, "_blank")
                      }
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-500 hover:bg-blue-500/10"
                      onClick={() => setShowManaQR(true)}
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center p-4">
                  {mounted && <QRCode value={manaContractAddress} tokenName="MANA" color="#3B82F6" />}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 border-blue-500/50 text-blue-500"
                    onClick={() => setShowManaQR(false)}
                  >
                    Show Address
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Follow Updates Section */}
        <div className="w-full py-16 bg-black/50 backdrop-blur-sm relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-yellow-500 mb-8">FOLLOW OUR LATEST UPDATES</h2>

          <div className="flex justify-center space-x-6">
            <Link href="#" className="text-white hover:text-yellow-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </Link>
            <Link href="#" className="text-white hover:text-yellow-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>
            <Link href="#" className="text-white hover:text-yellow-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>
            <Link href="#" className="text-white hover:text-yellow-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </Link>
            <Link href="#" className="text-white hover:text-yellow-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
