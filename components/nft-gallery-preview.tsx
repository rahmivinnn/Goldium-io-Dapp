"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

// Sample NFT data
const OWNED_NFTS = [
  {
    id: "1",
    name: "Dragon's Breath Sword",
    image: "/flame-forged-blade.png",
    rarity: "legendary",
  },
  {
    id: "2",
    name: "Ethereal Shield",
    image: "/arcane-aegis.png",
    rarity: "epic",
  },
  {
    id: "3",
    name: "Arcane Fireball",
    image: "/arcane-inferno.png",
    rarity: "rare",
  },
  {
    id: "4",
    name: "Crown of Wisdom",
    image: "/jeweled-regalia.png",
    rarity: "legendary",
  },
]

export default function NFTGalleryPreview() {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        {OWNED_NFTS.map((nft) => (
          <div key={nft.id} className="border border-gold/30 rounded-lg p-2 hover:border-gold transition-colors">
            <div className="relative aspect-square mb-2">
              <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover rounded" />
              <div
                className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                  nft.rarity === "legendary"
                    ? "bg-gold"
                    : nft.rarity === "epic"
                      ? "bg-purple-500"
                      : nft.rarity === "rare"
                        ? "bg-blue-500"
                        : nft.rarity === "uncommon"
                          ? "bg-green-500"
                          : "bg-gray-500"
                }`}
              ></div>
            </div>
            <div className="truncate text-sm">{nft.name}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">Showing 4 of 12 NFTs</div>
        <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 text-sm">
          View All NFTs
        </Button>
      </div>
    </div>
  )
}
