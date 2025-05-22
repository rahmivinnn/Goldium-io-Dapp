"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import type { NFT } from "@/services/nft-service"

interface NFTCardProps {
  nft: NFT
  isAuction?: boolean
  isNew?: boolean
}

export default function NFTCard({ nft, isAuction = false, isNew = false }: NFTCardProps) {
  const [liked, setLiked] = useState(false)
  const { toast } = useToast()
  const { connected } = useSolanaWallet()
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLiked(!liked)
    toast({
      title: liked ? "Removed from favorites" : "Added to favorites",
      description: `${nft.name} has been ${liked ? "removed from" : "added to"} your favorites.`,
    })
  }

  const handleBuy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase this NFT.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Purchase initiated",
      description: `You are about to purchase ${nft.name} for ${nft.price} GOLD.`,
    })
  }

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(`/marketplace/nft-detail/${nft.id}`)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const posX = e.clientX - centerX
    const posY = e.clientY - centerY

    // Calculate rotation based on mouse position
    // Limit rotation to a small range for subtle effect
    const rotateX = (posY / (rect.height / 2)) * -10
    const rotateY = (posX / (rect.width / 2)) * 10

    // Calculate position for shine effect
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setRotation({ x: rotateX, y: rotateY })
    setPosition({ x, y })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    // Reset rotation when mouse leaves
    setRotation({ x: 0, y: 0 })
  }

  // Apply CSS variables for shine effect
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.setProperty("--x", `${position.x}%`)
      cardRef.current.style.setProperty("--y", `${position.y}%`)
    }
  }, [position])

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case "legendary":
        return "bg-orange-500/10 text-orange-500 border-orange-500/50"
      case "epic":
        return "bg-purple-500/10 text-purple-500 border-purple-500/50"
      case "rare":
        return "bg-blue-500/10 text-blue-500 border-blue-500/50"
      case "uncommon":
        return "bg-green-500/10 text-green-500 border-green-500/50"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/50"
    }
  }

  // Find rarity attribute
  const rarityAttribute = nft.attributes?.find(
    (attr) => attr.trait_type.toLowerCase() === "rarity" || attr.trait_type.toLowerCase() === "tier",
  )
  const rarity = rarityAttribute?.value || "Common"

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full cursor-pointer"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg)",
        transition: isHovered ? "none" : "transform 0.5s ease-out",
      }}
    >
      <Card className="tilt-card overflow-hidden border-gray-800 bg-black/80 backdrop-blur-sm h-full flex flex-col">
        <div className="tilt-card-inner relative aspect-square" style={{ transform: `translateZ(40px)` }}>
          <Image
            src={nft.image || "/placeholder.svg?height=400&width=400&query=fantasy+item"}
            alt={nft.name}
            fill
            className="object-cover transition-all hover:scale-105"
          />
          <div className="absolute top-2 right-2 flex gap-2" style={{ transform: `translateZ(60px)` }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm button-3d"
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : "text-white"}`} />
            </Button>
          </div>
          {isNew && (
            <Badge className="absolute top-2 left-2 bg-gold text-black" style={{ transform: `translateZ(60px)` }}>
              New
            </Badge>
          )}
          {isAuction && (
            <div
              className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs p-1 rounded flex justify-between items-center"
              style={{ transform: `translateZ(50px)` }}
            >
              <span>Auction ends in</span>
              <span className="font-mono">12h 30m 15s</span>
            </div>
          )}
          <div className="tilt-card-shine"></div>
        </div>
        <CardContent className="p-4 flex-grow" style={{ transform: `translateZ(30px)` }}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg line-clamp-1">{nft.name}</h3>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={getRarityColor(rarity)}>
              {rarity}
            </Badge>
            {nft.collection && (
              <Badge variant="outline" className="border-gold/50 text-gold">
                Collection
              </Badge>
            )}
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400">Price</p>
              <p className="font-bold text-gold">{nft.price} GOLD</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                window.open(`https://explorer.solana.com/address/${nft.mint}`, "_blank", "noopener,noreferrer")
              }}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0" style={{ transform: `translateZ(20px)` }}>
          <Button className="w-full bg-gold hover:bg-gold/90 text-black button-3d" onClick={handleBuy}>
            {isAuction ? "Place Bid" : "Buy Now"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
