"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Check, Sparkles, Shield, Zap } from "lucide-react"
import type { CharacterType } from "./game-context"
import { motion } from "framer-motion"

interface CharacterSelectionProps {
  onSelect: (character: CharacterType) => void
  onBack: () => void
}

export default function CharacterSelection({ onSelect, onBack }: CharacterSelectionProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType | null>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  const characters = [
    {
      id: "egg" as CharacterType,
      name: "Golden Egg",
      description: "A magical egg that attracts gold and has high defense",
      stats: { strength: 3, speed: 5, magic: 8 },
      special: "Gold Magnet: Automatically attracts nearby gold tokens",
      color: "gold",
      emoji: "✨",
    },
    {
      id: "cat" as CharacterType,
      name: "Cat Warrior",
      description: "Swift and agile, can perform quick attacks",
      stats: { strength: 6, speed: 9, magic: 4 },
      special: "Swift Strike: Dash attack that damages enemies",
      color: "amber",
      emoji: "🐱",
    },
    {
      id: "wolf" as CharacterType,
      name: "Wolf Guardian",
      description: "Powerful and protective, with strong attacks",
      stats: { strength: 9, speed: 6, magic: 5 },
      special: "Howling Wind: Area attack that pushes enemies away",
      color: "blue",
      emoji: "🐺",
    },
  ]

  // Handle mouse move for 3D card effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    // Update rotation for the specific card
    setRotation({ x: rotateX, y: rotateY })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                opacity: Math.random() * 0.5 + 0.3,
                animation: `twinkle ${Math.random() * 5 + 3}s infinite ${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-5xl w-full bg-black/40 backdrop-blur-md p-8 rounded-xl border border-white/10 shadow-xl">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="mr-4 text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-gold-500">
            Choose Your Character
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {characters.map((character, index) => (
            <motion.div
              key={character.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Card
                className={`cursor-pointer transition-all overflow-hidden h-full ${
                  selectedCharacter === character.id
                    ? "border-gold bg-gradient-to-b from-gold/20 to-transparent"
                    : "border-white/10 hover:border-white/30 bg-black/30"
                }`}
                onClick={() => setSelectedCharacter(character.id)}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform:
                    selectedCharacter === character.id
                      ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                      : "none",
                  transition: "transform 0.1s ease-out",
                }}
              >
                <CardContent className="p-6 relative h-full">
                  {selectedCharacter === character.id && (
                    <div className="absolute -top-2 -right-2 bg-gold rounded-full p-1 z-10">
                      <Check className="h-4 w-4 text-black" />
                    </div>
                  )}

                  <div className="relative h-48 flex items-center justify-center mb-6 bg-gradient-to-b from-black/50 to-transparent rounded-lg overflow-hidden">
                    {/* Character visual */}
                    <div className="text-8xl animate-float-3d">{character.emoji}</div>

                    {/* Particle effects */}
                    <div className="absolute inset-0 pointer-events-none">
                      {selectedCharacter === character.id && (
                        <>
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-2 h-2 rounded-full bg-gold/60"
                              style={{
                                top: `${50 + Math.cos((i / 3) * Math.PI) * 30}%`,
                                left: `${50 + Math.sin((i / 3) * Math.PI) * 30}%`,
                                animation: `float ${2 + (i % 3)}s infinite ${i * 0.2}s ease-in-out`,
                              }}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-white">{character.name}</h3>
                  <p className="text-sm text-gray-300 mb-4">{character.description}</p>

                  <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                    <div>
                      <p className="text-gray-400 flex items-center">
                        <Shield className="h-3 w-3 mr-1 text-red-400" /> Strength
                      </p>
                      <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
                        <div
                          className="bg-red-500 h-full"
                          style={{ width: `${(character.stats.strength / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 flex items-center">
                        <Zap className="h-3 w-3 mr-1 text-green-400" /> Speed
                      </p>
                      <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
                        <div
                          className="bg-green-500 h-full"
                          style={{ width: `${(character.stats.speed / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 flex items-center">
                        <Sparkles className="h-3 w-3 mr-1 text-blue-400" /> Magic
                      </p>
                      <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full"
                          style={{ width: `${(character.stats.magic / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="bg-black/30 rounded-lg p-3 border border-white/10">
                      <p className="text-xs text-gold flex items-center">
                        <Sparkles className="h-3 w-3 mr-1" /> Special Ability
                      </p>
                      <p className="text-sm text-white">{character.special}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            className="bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-600 hover:to-amber-600 text-black font-bold px-8 py-6 text-lg rounded-lg shadow-lg"
            onClick={() => selectedCharacter && onSelect(selectedCharacter)}
            disabled={!selectedCharacter}
          >
            Begin Adventure
          </Button>
        </div>
      </div>
    </div>
  )
}
