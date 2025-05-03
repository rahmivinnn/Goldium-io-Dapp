import AdventureGameClient from "@/components/games/adventure-game/client"
import { Suspense } from "react"

export const metadata = {
  title: "Goldium Adventure - 3D Game",
  description: "Hunt for GOLD tokens in this immersive 3D adventure game",
}

export default function AdventureGamePage() {
  return (
    <div className="min-h-screen w-full">
      <Suspense fallback={<GameLoadingScreen />}>
        <AdventureGameClient />
      </Suspense>
    </div>
  )
}

function GameLoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="w-64 h-64 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <img src="/gold-logo.png" alt="Goldium" className="w-32 h-32 animate-pulse" />
        </div>
        <div className="absolute inset-0 border-t-4 border-gold rounded-full animate-spin"></div>
      </div>
      <h2 className="text-2xl font-bold mt-8 gold-gradient">Loading Adventure Game...</h2>
      <p className="text-gray-400 mt-2">Preparing your adventure in the Goldium world</p>
    </div>
  )
}
