"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Coins, Heart, Clock, Eye, Shield, Sword, Wand2, Crown, Gem } from "lucide-react"
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
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)

      toast({
        title: "Added to favorites",
        description: `${nft.name} has been added to your favorites`,
      })
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)"
    setIsHovered(false)
  }

  const getRarityClass = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500/80 text-white"
      case "uncommon":
        return "bg-green-500/80 text-white"
      case "rare":
        return "bg-blue-500/80 text-white"
      case "epic":
        return "bg-purple-500/80 text-white"
      case "legendary":
        return "bg-gold-500/80 text-black"
      default:
        return "bg-gray-500/80 text-white"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "weapons":
        return <Sword className="h-4 w-4" />
      case "armor":
        return <Shield className="h-4 w-4" />
      case "spells":
        return <Wand2 className="h-4 w-4" />
      case "artifacts":
        return <Crown className="h-4 w-4" />
      case "gems":
        return <Gem className="h-4 w-4" />
      default:
        return <Sword className="h-4 w-4" />
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          ref={cardRef}
          className="nft-card cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          {isNew && (
            <motion.div
              className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold z-10"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              NEW
            </motion.div>
          )}
          <div
            className={`absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold z-10 backdrop-blur-sm ${getRarityClass(nft.rarity)}`}
          >
            {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
          </div>
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={nft.image || "/placeholder.svg"}
              alt={nft.name}
              fill
              className="object-cover rounded-t-lg transition-transform duration-500"
              style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
            />

            {/* Overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-gold-500/20 rounded-full p-3"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Eye className="h-6 w-6 text-gold-500" />
              </motion.div>
            </motion.div>
          </div>
          <div className="p-4 bg-black">
            <div className="flex items-center mb-1">
              {getCategoryIcon(nft.category)}
              <span className="text-xs text-gray-400 ml-1 capitalize">{nft.category}</span>
            </div>
            <h3 className="font-bold text-gold-500 truncate font-serif">{nft.name}</h3>
            <div className="flex justify-between items-center mt-2">
              <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
                <Coins className="h-4 w-4 text-gold-500 mr-1" />
                <span className="font-bold">{nft.price} GOLD</span>
              </motion.div>
              <motion.button
                onClick={handleLike}
                className="flex items-center text-gray-400 hover:text-red-500"
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={
                    liked
                      ? {
                          scale: [1, 1.5, 1],
                          transition: { duration: 0.3 },
                        }
                      : {}
                  }
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-current text-red-500" : ""}`} />
                </motion.div>
                <span className="ml-1 text-xs">{likeCount}</span>
              </motion.button>
            </div>
            {isAuction ? (
              <motion.div
                className="flex items-center mt-2 text-xs text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Clock className="h-3 w-3 mr-1" />
                <span>Ends in 6h 23m</span>
              </motion.div>
            ) : null}
          </div>

          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(255,215,0,0) 0%, rgba(255,215,0,0) 100%)",
                "linear-gradient(45deg, rgba(255,215,0,0) 0%, rgba(255,215,0,0.1) 50%, rgba(255,215,0,0) 100%)",
                "linear-gradient(45deg, rgba(255,215,0,0) 0%, rgba(255,215,0,0) 100%)",
              ],
              backgroundPosition: ["200% 50%", "0% 50%", "-200% 50%"],
            }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
          />
        </motion.div>
      </DialogTrigger>

      <DialogContent className="bg-black border-gold sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-gold-500 text-xl font-serif">{nft.name}</DialogTitle>
          <DialogDescription>
            <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${getRarityClass(nft.rarity)} mt-2`}>
              {nft.rarity.toUpperCase()}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            className="relative aspect-square rounded-lg overflow-hidden border-2 border-gold-500/50"
            whileHover={{ scale: 1.02 }}
          >
            <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />

            {/* Animated glow overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-gold/0 to-gold-500/20 opacity-0"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            />
          </motion.div>

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
                <p className="mt-1 text-gold-500">{nft.owner}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400">Properties</h4>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <motion.div
                    className="border border-gold-500/30 rounded p-2 text-center"
                    whileHover={{
                      borderColor: "rgba(255, 215, 0, 0.8)",
                      backgroundColor: "rgba(255, 215, 0, 0.1)",
                    }}
                  >
                    <div className="text-xs text-gray-400">Type</div>
                    <div className="font-medium capitalize flex items-center justify-center">
                      {getCategoryIcon(nft.category)}
                      <span className="ml-1">{nft.category}</span>
                    </div>
                  </motion.div>
                  <motion.div
                    className="border border-gold-500/30 rounded p-2 text-center"
                    whileHover={{
                      borderColor: "rgba(255, 215, 0, 0.8)",
                      backgroundColor: "rgba(255, 215, 0, 0.1)",
                    }}
                  >
                    <div className="text-xs text-gray-400">Rarity</div>
                    <div className="font-medium capitalize">{nft.rarity}</div>
                  </motion.div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400">Price</h4>
                <motion.div
                  className="flex items-center mt-1"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Coins className="h-5 w-5 text-gold-500 mr-2" />
                  <span className="text-2xl font-bold text-gold-500">{nft.price} GOLD</span>
                </motion.div>
              </div>

              {isAuction ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Auction ends in:</span>
                    <span className="font-medium">06:23:14</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current bid:</span>
                    <span className="font-medium text-gold-500">{nft.price} GOLD</span>
                  </div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button onClick={handleBid} className="gold-button w-full mt-2">
                      Place Bid
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button onClick={handleBuy} className="gold-button w-full">
                    Buy Now
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
