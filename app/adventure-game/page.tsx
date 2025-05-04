import type { Metadata } from "next"
import Game3DWorld from "@/components/games/adventure-game/game-3d-world"

export const metadata: Metadata = {
  title: "Goldium 3D Adventure Game",
  description: "Play-to-earn 3D adventure game in the Goldium ecosystem",
}

export default function AdventureGamePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 mt-32 text-yellow-400">Goldium 3D Adventure</h1>
      <Game3DWorld />
    </main>
  )
}
