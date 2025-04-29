"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"
import NFTCard from "@/components/nft-card"

// Sample NFT data
const FEATURED_NFTS = [
  {
    id: "1",
    name: "Dragon's Breath Sword",
    image: "/flame-forged-blade.png",
    price: 1250,
    rarity: "legendary",
    category: "weapons",
    owner: "0x1234...5678",
  },
  {
    id: "2",
    name: "Ethereal Shield",
    image: "/arcane-aegis.png",
    price: 850,
    rarity: "epic",
    category: "armor",
    owner: "0x8765...4321",
  },
  {
    id: "3",
    name: "Arcane Fireball",
    image: "/arcane-inferno.png",
    price: 550,
    rarity: "rare",
    category: "spells",
    owner: "0x2468...1357",
  },
  {
    id: "4",
    name: "Crown of Wisdom",
    image: "/jeweled-regalia.png",
    price: 1800,
    rarity: "legendary",
    category: "artifacts",
    owner: "0x1357...2468",
  },
  {
    id: "5",
    name: "Ruby of Power",
    image: "/heart-of-fire.png",
    price: 650,
    rarity: "epic",
    category: "gems",
    owner: "0x9876...5432",
  },
  {
    id: "6",
    name: "Leather Gauntlets",
    image: "/placeholder.svg?height=400&width=300&query=fantasy leather gauntlets",
    price: 120,
    rarity: "common",
    category: "armor",
    owner: "0x5432...9876",
  },
]

export default function FeaturedNFTs() {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 3
  const totalPages = Math.ceil(FEATURED_NFTS.length / itemsPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const currentNFTs = FEATURED_NFTS.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Featured NFTs</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="border-gold/50 text-gold hover:bg-gold/10"
            onClick={prevPage}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-gold/50 text-gold hover:bg-gold/10"
            onClick={nextPage}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentNFTs.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <Button variant="outline" className="border-gold text-gold hover:bg-gold/10">
          View All NFTs
        </Button>
      </div>
    </div>
  )
}
