"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface CharacterSelectionProps {
  onSelect: (character: string) => void
  onBack: () => void
}

const characters = [
  {
    id: "cat",
    name: "Neko",
    description: "Agile and quick, perfect for collecting tokens in hard-to-reach places.",
    abilities: ["Double Jump", "Night Vision", "Quick Dash"],
    imageUrl: "/placeholder.svg?key=7rpjd",
  },
  {
    id: "gorilla",
    name: "Kong",
    description: "Strong and powerful, can smash obstacles and defeat enemies easily.",
    abilities: ["Super Strength", "Ground Pound", "Intimidate"],
    imageUrl: "/placeholder.svg?key=wkctx",
  },
  {
    id: "coin",
    name: "Goldie",
    description: "Magnetic to other coins, attracts GOLD tokens from a distance.",
    abilities: ["Gold Magnet", "Coin Sense", "Lucky Bounce"],
    imageUrl: "/placeholder.svg?key=3v22e",
  },
]

export default function CharacterSelection({ onSelect, onBack }: CharacterSelectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedCharacter = characters[selectedIndex]

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? characters.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === characters.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 gold-gradient">Choose Your Character</h1>
          <p className="text-gray-300">Each character has unique abilities to help you collect GOLD tokens</p>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 border-gold/30 text-gold hover:bg-gold/20"
            onClick={handlePrevious}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-12">
            {characters.map((character, index) => {
              const isSelected = index === selectedIndex
              return (
                <Card
                  key={character.id}
                  className={`
                    transition-all duration-300 transform cursor-pointer
                    ${isSelected ? "scale-105 border-gold bg-slate-900/90" : "scale-95 opacity-50 bg-slate-900/50 border-gray-700"}
                  `}
                  onClick={() => setSelectedIndex(index)}
                >
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="w-full h-64 mb-4 overflow-hidden rounded-lg">
                      <img
                        src={character.imageUrl || "/placeholder.svg"}
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className={`text-xl font-bold mb-1 ${isSelected ? "gold-gradient" : "text-white"}`}>
                      {character.name}
                    </h3>
                    <p className="text-sm text-gray-400 text-center mb-4">{character.description}</p>
                    {isSelected && (
                      <div className="w-full">
                        <div className="text-sm font-medium mb-2 text-gold">Abilities:</div>
                        <ul className="text-sm text-gray-300">
                          {character.abilities.map((ability) => (
                            <li key={ability} className="mb-1 flex items-center">
                              <span className="w-2 h-2 bg-gold rounded-full mr-2"></span>
                              {ability}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 border-gold/30 text-gold hover:bg-gold/20"
            onClick={handleNext}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex justify-center mt-8 space-x-4">
          <Button variant="outline" className="border-gold/30 text-white hover:bg-slate-800" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            className="bg-gold hover:bg-gold/80 text-black font-bold"
            onClick={() => onSelect(selectedCharacter.id)}
          >
            Select {selectedCharacter.name} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
