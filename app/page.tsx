"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import Link from "next/link"
import { WalletConnectPopup } from "@/components/wallet-connect-popup"
import { useNetwork } from "@/contexts/network-context"
import { Orbitron } from "next/font/google"

const orbitron = Orbitron({ subsets: ["latin"] })

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showGoldQR, setShowGoldQR] = useState(false)
  const [visibleText, setVisibleText] = useState(0)
  const [showPopup, setShowPopup] = useState(true)

  // Safe default values that won't cause errors during SSR
  const contractAddress = "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump"

  // Only access context after component is mounted
  const { goldTokenAddress } = useNetwork()

  useEffect(() => {
    setMounted(true)

    // Subtle text animation
    const interval = setInterval(() => {
      setVisibleText((prev) => (prev < 100 ? prev + 1 : prev))
    }, 30)

    return () => clearInterval(interval)
  }, [])

  const copyToClipboard = (address: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Subtle floating particles
  const particles = Array(15)
    .fill(0)
    .map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.3 + 0.1,
      speed: Math.random() * 0.5 + 0.2,
    }))

  return (
    <>
      {showPopup && <WalletConnectPopup onClose={() => setShowPopup(false)} />}
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold text-yellow-500 mb-8">Goldium.io</h1>
        <div className="flex flex-col gap-4">
          <Link href="/bridge">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6">Go to Bridge</Button>
          </Link>
        </div>
      </main>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </>
  )
}
