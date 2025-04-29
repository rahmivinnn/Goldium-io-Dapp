"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample featured NFT data
const FEATURED_NFTS = [
  {
    id: "1",
    name: "Dragon's Breath Sword",
    image: "/flame-forged-blade.png",
    price: 1250,
    rarity: "legendary",
    description: "A legendary blade forged in dragon fire, capable of unleashing devastating flame attacks.",
  },
  {
    id: "2",
    name: "Ethereal Shield",
    image: "/arcane-aegis.png",
    price: 850,
    rarity: "epic",
    description: "An arcane shield that creates a powerful barrier against magical attacks.",
  },
  {
    id: "3",
    name: "Crown of Wisdom",
    image: "/jeweled-regalia.png",
    price: 1800,
    rarity: "legendary",
    description: "A crown worn by ancient sages, enhancing the wearer's magical abilities.",
  },
  {
    id: "4",
    name: "Ruby of Power",
    image: "/heart-of-fire.png",
    price: 650,
    rarity: "epic",
    description: "A gemstone pulsing with magical energy, capable of amplifying spells.",
  },
]

export default function FeaturedNFTs() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState(1) // 1 for right, -1 for left

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % FEATURED_NFTS.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handlePrev = () => {
    setIsAutoPlaying(false)
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + FEATURED_NFTS.length) % FEATURED_NFTS.length)
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % FEATURED_NFTS.length)
  }

  const currentNft = FEATURED_NFTS[currentIndex]

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
  }

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "legendary":
        return "text-gold"
      case "epic":
        return "text-purple-400"
      case "rare":
        return "text-blue-400"
      case "uncommon":
        return "text-green-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-gold/30 bg-black/50">
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
        <Sparkles className="h-5 w-5 text-gold" />
        <h2 className="text-xl font-bold text-gold">Featured NFTs</h2>
      </div>

      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-gold/50 bg-black/70 text-gold hover:bg-gold/20"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full border-gold/50 bg-black/70 text-gold hover:bg-gold/20"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="relative h-[400px] w-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0"
          >
            <div className="grid h-full grid-cols-1 md:grid-cols-2">
              <div className="relative flex items-center justify-center p-6">
                <motion.div
                  className="relative h-64 w-64 overflow-hidden rounded-xl border-2 border-gold/50"
                  whileHover={{ scale: 1.05 }}
                  animate={{ rotate: [0, 1, 0, -1, 0] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                >
                  <Image
                    src={currentNft.image || "/placeholder.svg"}
                    alt={currentNft.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <motion.div
                    className="absolute inset-0 bg-gold/20 opacity-0"
                    animate={{ opacity: [0, 0.2, 0] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  />
                </motion.div>
              </div>

              <div className="flex flex-col justify-center p-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h3 className="mb-2 text-2xl font-bold text-gold">{currentNft.name}</h3>
                  <div className="mb-4 flex items-center">
                    <span
                      className={`mr-2 rounded px-2 py-1 text-xs font-bold uppercase ${
                        currentNft.rarity === "legendary"
                          ? "bg-gold/20 text-gold"
                          : currentNft.rarity === "epic"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {currentNft.rarity}
                    </span>
                    <span className="text-sm text-gray-400">ID: #{currentNft.id}</span>
                  </div>

                  <p className="mb-6 text-gray-300">{currentNft.description}</p>

                  <div className="mb-6 flex items-center">
                    <span className="mr-2 text-gray-400">Price:</span>
                    <motion.span
                      className="text-2xl font-bold text-gold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      {currentNft.price} GOLD
                    </motion.span>
                  </div>

                  <div className="flex space-x-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="gold-button">View Details</Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                        Add to Wishlist
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {FEATURED_NFTS.map((_, index) => (
          <motion.button
            key={index}
            className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-gold" : "bg-gray-600"}`}
            onClick={() => {
              setIsAutoPlaying(false)
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            whileHover={{ scale: 1.5 }}
            animate={index === currentIndex ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: index === currentIndex ? Number.POSITIVE_INFINITY : 0 }}
          />
        ))}
      </div>
    </div>
  )
}
