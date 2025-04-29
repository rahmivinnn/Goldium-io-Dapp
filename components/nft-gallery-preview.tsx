"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

// Update the NFTGalleryPreview component to make it more interactive

// First, add the necessary imports
import { useState } from "react"
import { motion } from "framer-motion"
import { ZoomIn, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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

// Replace the entire component with this enhanced version
export default function NFTGalleryPreview() {
  const [hoveredNft, setHoveredNft] = useState<string | null>(null)

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        {OWNED_NFTS.map((nft) => (
          <Dialog key={nft.id}>
            <DialogTrigger asChild>
              <motion.div
                className="border border-gold/30 rounded-lg p-2 hover:border-gold transition-colors bg-black/50 cursor-pointer overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(255, 215, 0, 0.5)",
                }}
                onHoverStart={() => setHoveredNft(nft.id)}
                onHoverEnd={() => setHoveredNft(null)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative aspect-square mb-2 overflow-hidden rounded">
                  <motion.div
                    className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center opacity-0"
                    animate={{ opacity: hoveredNft === nft.id ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ZoomIn className="text-gold w-8 h-8" />
                  </motion.div>

                  <motion.div
                    animate={{
                      scale: hoveredNft === nft.id ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full"
                  >
                    <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover rounded" />
                  </motion.div>

                  <div
                    className={`absolute top-1 right-1 w-3 h-3 rounded-full ${
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
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full bg-inherit"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="truncate text-sm font-medium text-gold">{nft.name}</div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </motion.div>
            </DialogTrigger>

            <DialogContent className="bg-black border-gold sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-gold text-xl">{nft.name}</DialogTitle>
                <DialogDescription>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                      nft.rarity === "legendary"
                        ? "bg-gold/20 text-gold"
                        : nft.rarity === "epic"
                          ? "bg-purple-500/20 text-purple-400"
                          : nft.rarity === "rare"
                            ? "bg-blue-500/20 text-blue-400"
                            : nft.rarity === "uncommon"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                    } mt-2`}
                  >
                    {nft.rarity.toUpperCase()}
                  </span>
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4">
                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gold/50 mb-4">
                  <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Description</h4>
                    <p className="mt-1">
                      A powerful {nft.rarity} item from the ancient realms, imbued with magical properties.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-gold/30 rounded p-2 text-center">
                      <div className="text-xs text-gray-400">Rarity</div>
                      <div className="font-medium capitalize">{nft.rarity}</div>
                    </div>
                    <div className="border border-gold/30 rounded p-2 text-center">
                      <div className="text-xs text-gray-400">ID</div>
                      <div className="font-medium">{nft.id}</div>
                    </div>
                  </div>

                  <div className="flex justify-between gap-2">
                    <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 w-1/2">
                      Transfer
                    </Button>
                    <Button className="gold-button w-1/2">List for Sale</Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
