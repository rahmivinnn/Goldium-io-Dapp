"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Coins, Heart, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface NFTCardProps {
  nft: {
    id: string
    name: string
    image: string
    price: number
    rarity: string
    category: string
    owner: string
  }
  isAuction?: boolean
  isNew?: boolean
}

export default function NFTCard({ nft, isAuction = false, isNew = false }: NFTCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50))
  const { toast } = useToast()

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  const handleBuy = () => {
    toast({
      title: "Purchase Initiated",
      description: `Buying ${nft.name} for ${nft.price} GOLD`,
    })
  }

  const handleBid = () => {
    toast({
      title: "Bid Placed",
      description: `Your bid on ${nft.name} has been placed`,
    })
  }

  const getRarityClass = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "rarity-common"
      case "uncommon":
        return "rarity-uncommon"
      case "rare":
        return "rarity-rare"
      case "epic":
        return "rarity-epic"
      case "legendary":
        return "rarity-legendary"
      default:
        return "rarity-common"
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="nft-card cursor-pointer">
          {isNew && (
            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
              NEW
            </div>
          )}
          <div className={`rarity-badge ${getRarityClass(nft.rarity)}`}>
            {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
          </div>
          <div className="relative aspect-square">
            <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover rounded-t-lg" />
          </div>
          <div className="p-4 bg-black">
            <h3 className="font-bold text-gold truncate">{nft.name}</h3>
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center">
                <Coins className="h-4 w-4 text-gold mr-1" />
                <span className="font-bold">{nft.price} GOLD</span>
              </div>
              <button onClick={handleLike} className="flex items-center text-gray-400 hover:text-red-500">
                <Heart className={`h-4 w-4 ${liked ? "fill-current text-red-500" : ""}`} />
                <span className="ml-1 text-xs">{likeCount}</span>
              </button>
            </div>
            {isAuction ? (
              <div className="flex items-center mt-2 text-xs text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                <span>Ends in 6h 23m</span>
              </div>
            ) : null}
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="bg-black border-gold sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-gold text-xl">{nft.name}</DialogTitle>
          <DialogDescription>
            <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${getRarityClass(nft.rarity)} mt-2`}>
              {nft.rarity.toUpperCase()}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gold/50">
            <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
          </div>

          <div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400">Description</h4>
                <p className="mt-1">
                  A powerful {nft.category} from the ancient realms, imbued with magical properties.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400">Owner</h4>
                <p className="mt-1 text-gold">{nft.owner}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400">Properties</h4>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="border border-gold/30 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">Type</div>
                    <div className="font-medium capitalize">{nft.category}</div>
                  </div>
                  <div className="border border-gold/30 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">Rarity</div>
                    <div className="font-medium capitalize">{nft.rarity}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400">Price</h4>
                <div className="flex items-center mt-1">
                  <Coins className="h-5 w-5 text-gold mr-2" />
                  <span className="text-2xl font-bold text-gold">{nft.price} GOLD</span>
                </div>
              </div>

              {isAuction ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Auction ends in:</span>
                    <span className="font-medium">06:23:14</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current bid:</span>
                    <span className="font-medium text-gold">{nft.price} GOLD</span>
                  </div>
                  <Button onClick={handleBid} className="gold-button w-full mt-2">
                    Place Bid
                  </Button>
                </div>
              ) : (
                <Button onClick={handleBuy} className="gold-button w-full">
                  Buy Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
