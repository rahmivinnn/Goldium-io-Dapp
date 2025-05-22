import type { Metadata } from "next"
import Game3DWorld from "@/components/games/adventure-game/game-3d-world"
import FloatingParticles from "@/components/floating-particles"
import { Orbitron } from "next/font/google"

const orbitron = Orbitron({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Goldium 3D Adventure Game",
  description: "Play-to-earn 3D adventure game in the Goldium ecosystem",
}

export default function AdventureGamePage() {
  return (
    <div className="min-h-screen pt-20 relative">
      <FloatingParticles count={30} speed={0.5} />
      <main className="container mx-auto px-4 py-8 mt-8">
        <h1
          className={`text-4xl md:text-5xl font-bold mb-10 text-center ${orbitron.className} tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600`}
        >
          Goldium 3D Adventure
        </h1>
        <Game3DWorld />
      </main>
    </div>
  )
}
