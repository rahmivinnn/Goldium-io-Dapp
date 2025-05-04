"use client"

import { Suspense, useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, ChevronDown, Wallet, Tag, Heart, ExternalLink, X, Sliders, ArrowUpDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import "./enhanced-marketplace.css"

// Sample NFT data
const SAMPLE_NFTS = [
  {
    id: "1",
    name: "Golden Egg",
    image: "/placeholder.svg?height=400&width=400&query=golden+egg+fantasy+treasure",
    price: 1250,
    rarity: "legendary",
    creator: "CryptoForge",
    likes: 89,
  },
  {
    id: "2",
    name: "Ethereal Shield",
    image: "/placeholder.svg?height=400&width=400&query=ethereal+shield+fantasy+glowing",
    price: 850,
    rarity: "epic",
    creator: "DigitalArtisan",
    likes: 56,
  },
  {
    id: "3",
    name: "Arcane Fireball",
    image: "/placeholder.svg?height=400&width=400&query=arcane+fireball+magic+spell",
    price: 600,
    rarity: "rare",
    creator: "MagicMinter",
    likes: 42,
  },
  {
    id: "4",
    name: "Crown of Wisdom",
    image: "/placeholder.svg?height=400&width=400&query=crown+of+wisdom+fantasy+royal",
    price: 1800,
    rarity: "legendary",
    creator: "RoyalCreations",
    likes: 103,
  },
  {
    id: "5",
    name: "Ruby of Power",
    image: "/placeholder.svg?height=400&width=400&query=ruby+of+power+fantasy+gem",
    price: 750,
    rarity: "epic",
    creator: "GemCrafter",
    likes: 67,
  },
  {
    id: "6",
    name: "Leather Gauntlets",
    image: "/placeholder.svg?height=400&width=400&query=leather+gauntlets+fantasy+armor",
    price: 300,
    rarity: "common",
    creator: "ArmorSmith",
    likes: 28,
  },
  {
    id: "7",
    name: "Ice Shard Spell",
    image: "/placeholder.svg?height=400&width=400&query=ice+shard+spell+magic+fantasy",
    price: 550,
    rarity: "rare",
    creator: "FrostMage",
    likes: 39,
  },
  {
    id: "8",
    name: "Ancient Amulet",
    image: "/placeholder.svg?height=400&width=400&query=ancient+amulet+fantasy+artifact",
    price: 920,
    rarity: "epic",
    creator: "RelicHunter",
    likes: 71,
  },
  {
    id: "9",
    name: "Dragon Scale Armor",
    image: "/placeholder.svg?height=400&width=400&query=dragon+scale+armor+fantasy",
    price: 1400,
    rarity: "legendary",
    creator: "DragonForge",
    likes: 95,
  },
  {
    id: "10",
    name: "Mystic Orb",
    image: "/placeholder.svg?height=400&width=400&query=mystic+orb+glowing+fantasy",
    price: 680,
    rarity: "rare",
    creator: "OrbWeaver",
    likes: 47,
  },
  {
    id: "11",
    name: "Phoenix Feather",
    image: "/placeholder.svg?height=400&width=400&query=phoenix+feather+fantasy+fire",
    price: 520,
    rarity: "uncommon",
    creator: "FireBird",
    likes: 33,
  },
  {
    id: "12",
    name: "Enchanted Bow",
    image: "/placeholder.svg?height=400&width=400&query=enchanted+bow+fantasy+weapon",
    price: 780,
    rarity: "epic",
    creator: "BowMaster",
    likes: 62,
  },
]

// NFT Card Component
const NFTCard = ({ nft, onBuy }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [liked, setLiked] = useState(false)
  const cardRef = useRef(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const posX = e.clientX - centerX
    const posY = e.clientY - centerY

    // Calculate rotation based on mouse position
    // Limit rotation to a small range for subtle effect
    const rotateX = (posY / (rect.height / 2)) * -5
    const rotateY = (posX / (rect.width / 2)) * 5

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
    setRotation({ x: 0, y: 0 })
  }

  // Apply CSS variables for shine effect
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.setProperty("--x", `${position.x}%`)
      cardRef.current.style.setProperty("--y", `${position.y}%`)
    }
  }, [position])

  const handleLike = (e) => {
    e.stopPropagation()
    setLiked(!liked)
  }

  const getRarityClass = (rarity) => {
    switch (rarity.toLowerCase()) {
      case "legendary":
        return "rarity-legendary"
      case "epic":
        return "rarity-epic"
      case "rare":
        return "rarity-rare"
      case "uncommon":
        return "rarity-uncommon"
      default:
        return "rarity-common"
    }
  }

  return (
    <motion.div
      className="nft-card-enhanced"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg)",
        transition: isHovered ? "none" : "transform 0.5s ease-out",
      }}
    >
      <div className="nft-image">
        <Image
          src={nft.image}
          alt={nft.name}
          width={400}
          height={400}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2 z-10">
          <button
            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>
        <div className="absolute top-2 left-2 z-10">
          <span className={`rarity-badge-enhanced ${getRarityClass(nft.rarity)}`}>
            {nft.rarity}
          </span>
        </div>
      </div>
      <div className="nft-content">
        <h3 className="nft-title">{nft.name}</h3>
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">Created by</div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Heart className="h-3 w-3" /> {nft.likes}
          </div>
        </div>
        <div className="text-sm text-gold-500 mb-3">{nft.creator}</div>
        <div className="nft-price">
          <span className="nft-price-amount">{nft.price}</span>
          <span className="nft-price-currency">GOLD</span>
        </div>
        <button className="buy-button mt-4" onClick={() => onBuy(nft)}>
          Buy Now
        </button>
      </div>
    </motion.div>
  )
}

// Filter Sidebar Component
const FilterSidebar = ({ filters, setFilters, isOpen, onClose }) => {
  const handleRarityChange = (rarity) => {
    setFilters(prev => ({
      ...prev,
      rarities: {
        ...prev.rarities,
        [rarity]: !prev.rarities[rarity]
      }
    }))
  }

  const handlePriceChange = (e, index) => {
    const newPriceRange = [...filters.priceRange]
    newPriceRange[index] = parseInt(e.target.value)
    setFilters(prev => ({
      ...prev,
      priceRange: newPriceRange
    }))
  }

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "all",
      priceRange: [0, 2000],
      rarities: {
        common: true,
        uncommon: true,
        rare: true,
        epic: true,
        legendary: true
      },
      sortBy: "newest"
    })
  }

  return (
    <motion.div
      className={`filter-sidebar ${isOpen ? 'block' : 'hidden'} md:block`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold flex items-center">
          <Filter className="mr-2 h-5 w-5 text-gold-primary" />
          Filters
        </h3>
        <button className="md:hidden" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="filter-section">
        <div className="filter-section-title">
          <Search className="h-4 w-4 text-gold-primary" />
          Search
        </div>
        <input
          type="text"
          placeholder="Search NFTs..."
          className="w-full bg-dark-secondary border border-gold-primary/20 rounded-lg p-2 text-sm focus:outline-none focus:border-gold-primary/50"
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
      </div>

      <div className="filter-section">
        <div className="filter-section-title">
          <Tag className="h-4 w-4 text-gold-primary" />
          Category
        </div>
        <div className="space-y-2">
          {["all", "weapons", "armor", "spells", "artifacts", "gems"].map((category) => (
            <div
              key={category}
              className={`p-2 rounded-lg cursor-pointer transition-all ${
                filters.category === category
                  ? "bg-gold-primary/20 border border-gold-primary/50"
                  : "hover:bg-dark-accent"
              }`}
              onClick={() => setFilters(prev => ({ ...prev, category }))}
            >
              <span className="capitalize">{category}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-section-title">
          <ArrowUpDown className="h-4 w-4 text-gold-primary" />
          Price Range
        </div>
        <div className="flex justify-between mb-2">
          <span>{filters.priceRange[0]} GOLD</span>
          <span>{filters.priceRange[1]} GOLD</span>
        </div>
        <div className="flex gap-4 items-center">
          <input
            type="range"
            min="0"
            max="2000"
            value={filters.priceRange[0]}
            onChange={(e) => handlePriceChange(e, 0)}
            className="w-full accent-gold-primary"
          />
          <input
            type="range"
            min="0"
            max="2000"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange(e, 1)}
            className="w-full accent-gold-primary"
          />
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-section-title">
          <Sliders className="h-4 w-4 text-gold-primary" />
          Rarity
        </div>
        <div className="space-y-2">
          {Object.entries(filters.rarities).map(([rarity, isSelected]) => (
            <div
              key={rarity}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleRarityChange(rarity)}
            >
              <div className={`w-4 h-4 rounded ${isSelected ? getRarityColor(rarity) : "bg-gray-700"}`}>
                {isSelected && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <span className="capitalize">{rarity}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        className="w-full mt-6 p-2 border border-gold-primary/50 text-gold-primary rounded-lg hover:bg-gold-primary/10 transition-all"
        onClick={resetFilters}
      >
        Reset Filters
      </button>
    </motion.div>
  )
}

// Helper function to get rarity color
const getRarityColor = (rarity) => {
  switch (rarity) {
    case "legendary":
      return "bg-amber-500"
    case "epic":
      return "bg-purple-500"
    case "rare":
      return "bg-blue-500"
    case "uncommon":
      return "bg-green-500"
    default:
      return "bg-gray-500"
  }
}

// Connect Wallet Button Component
const ConnectWalletButton = () => {
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()

  const handleConnect = () => {
    if (isConnected) {
      setIsConnected(false)
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      })
    } else {
      setIsConnected(true)
      toast({
        title: "Wallet Connected",
        description: "Your Phantom wallet has been connected successfully!",
      })
    }
  }

  return (
    <motion.button
      className="connect-wallet-button"
      onClick={handleConnect}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Wallet className="h-5 w-5" />
      {isConnected ? "0x7F...A4D2" : "Connect Wallet"}
    </motion.button>
  )
}

// Main Marketplace Page
export default function EnhancedMarketplacePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    priceRange: [0, 2000],
    rarities: {
      common: true,
      uncommon: true,
      rare: true,
      epic: true,
      legendary: true
    },
    sortBy: "newest"
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleBuyNFT = (nft) => {
    toast({
      title: "Purchase Initiated",
      description: `You bought NFT: ${nft.name}!`,
    })
  }

  // Filter NFTs based on search, category, price range, and rarity
  const filteredNFTs = SAMPLE_NFTS.filter((nft) => {
    const matchesSearch = nft.name.toLowerCase().includes(filters.search.toLowerCase())
    const matchesCategory = filters.category === "all" || nft.category === filters.category
    const matchesPrice = nft.price >= filters.priceRange[0] && nft.price <= filters.priceRange[1]
    const matchesRarity = filters.rarities[nft.rarity.toLowerCase()]

    return matchesSearch && matchesCategory && matchesPrice && matchesRarity
  })

  // Sort NFTs based on selected sort option
  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (filters.sortBy) {
      case "price-high":
        return b.price - a.price
      case "price-low":
        return a.price - b.price
      case "most-liked":
        return b.likes - a.likes
      default:
        return 0 // Default to newest
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-primary to-dark-secondary pt-32 pb-16">
      {/* Header */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-2">
              <span className="gold-gradient">Goldium.io</span> Marketplace
            </h1>
            <p className="text-gray-400">Discover, collect, and trade unique NFTs</p>
          </motion.div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ConnectWalletButton />
            </motion.div>
            
            <motion.button
              className="md:hidden p-2 border border-gold-primary/30 rounded-lg"
              onClick={() => setSidebarOpen(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Filter className="h-5 w-5 text-gold-primary" />
            </motion.button>
          </div>
        </div>

        {/* Tabs and Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex overflow-x-auto pb-2 hide-scrollbar">
            <div className="flex space-x-2">
              {["All NFTs", "Buy Now", "Auctions", "New"].map((tab, index) => (
                <motion.button
                  key={tab}
                  className="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all bg-dark-card hover:bg-dark-card-hover border border-gold-primary/20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  {tab}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                className="appearance-none bg-dark-card border border-gold-primary/20 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none"
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              >
                <option value="newest">Newest</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="most-liked">Most Liked</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold-primary/50 h-4 w-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Mobile */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                className="fixed inset-0 bg-black/80 z-50 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute right-0 top-0 bottom-0 w-80 bg-dark-card p-6"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                  <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sidebar - Desktop */}
          <div className="hidden md:block md:w-64 shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} isOpen={true} />
          </div>

          {/* NFT Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-dark-card animate-pulse rounded-lg overflow-hidden h-80"
                  >
                    <div className="bg-dark-accent h-48 w-full"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-dark-accent rounded w-3/4"></div>
                      <div className="h-4 bg-dark-accent rounded w-1/2"></div>
                      <div className="h-8 bg-dark-accent rounded w-full mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedNFTs.length === 0 ? (
              <div className="text-center py-16 bg-dark-card rounded-lg">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Search className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No NFTs Found</h3>
                  <p className="text-gray-400">Try adjusting your filters to find what you're looking for.</p>
                </motion.div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedNFTs.map((nft, index) => (
                  <NFTCard
                    key={nft.id}
                    nft={nft}
                    onBuy={handleBuyNFT}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
