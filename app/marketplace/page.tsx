"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NFTCard from "@/components/nft-card"
import MarketplaceHeader from "@/components/marketplace-header"
import FilterSidebar from "@/components/filter-sidebar"
import { useToast } from "@/hooks/use-toast"

// Expanded Sample NFT data with more items
const SAMPLE_NFTS = [
  {
    id: "1",
    name: "Dragon's Breath Sword",
    image: "/dragon-breath-blade.png",
    price: 1250,
    rarity: "legendary",
    category: "weapons",
    owner: "0x1234...5678",
  },
  {
    id: "2",
    name: "Ethereal Shield",
    image: "/shimmering-aegis.png",
    price: 850,
    rarity: "epic",
    category: "armor",
    owner: "0x8765...4321",
  },
  {
    id: "3",
    name: "Arcane Fireball",
    image: "/arcane-explosion.png",
    price: 550,
    rarity: "rare",
    category: "spells",
    owner: "0x2468...1357",
  },
  {
    id: "4",
    name: "Crown of Wisdom",
    image: "/serpent-king's-regalia.png",
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
    image: "/placeholder.svg?height=400&width=400&query=leather+armor+gauntlets+fantasy",
    price: 120,
    rarity: "common",
    category: "armor",
    owner: "0x5432...9876",
  },
  {
    id: "7",
    name: "Ice Shard Spell",
    image: "/placeholder.svg?height=400&width=400&query=ice+shard+magic+spell+fantasy",
    price: 380,
    rarity: "uncommon",
    category: "spells",
    owner: "0x8642...1357",
  },
  {
    id: "8",
    name: "Ancient Amulet",
    image: "/placeholder.svg?height=400&width=400&query=ancient+magic+amulet+fantasy+artifact",
    price: 920,
    rarity: "epic",
    category: "artifacts",
    owner: "0x1234...5678",
  },
  {
    id: "9",
    name: "Enchanted Bow",
    image: "/placeholder.svg?height=400&width=400&query=enchanted+bow+fantasy+weapon",
    price: 750,
    rarity: "rare",
    category: "weapons",
    owner: "0x7531...2468",
  },
  {
    id: "10",
    name: "Mystic Orb",
    image: "/placeholder.svg?height=400&width=400&query=mystic+orb+glowing+gem+fantasy",
    price: 1100,
    rarity: "epic",
    category: "gems",
    owner: "0x2468...7531",
  },
  {
    id: "11",
    name: "Dragonscale Armor",
    image: "/placeholder.svg?height=400&width=400&query=dragonscale+armor+fantasy+rpg",
    price: 1600,
    rarity: "legendary",
    category: "armor",
    owner: "0x1357...8642",
  },
  {
    id: "12",
    name: "Thunderbolt Spell",
    image: "/placeholder.svg?height=400&width=400&query=thunderbolt+lightning+spell+magic",
    price: 480,
    rarity: "rare",
    category: "spells",
    owner: "0x8642...1357",
  },
  {
    id: "13",
    name: "Golden Chalice",
    image: "/placeholder.svg?height=400&width=400&query=golden+chalice+artifact+fantasy",
    price: 1350,
    rarity: "legendary",
    category: "artifacts",
    owner: "0x9753...1357",
  },
  {
    id: "14",
    name: "Emerald of Life",
    image: "/placeholder.svg?height=400&width=400&query=emerald+gem+fantasy+glowing",
    price: 720,
    rarity: "epic",
    category: "gems",
    owner: "0x3579...7531",
  },
  {
    id: "15",
    name: "Obsidian Dagger",
    image: "/placeholder.svg?height=400&width=400&query=obsidian+dagger+fantasy+weapon",
    price: 580,
    rarity: "rare",
    category: "weapons",
    owner: "0x2468...1357",
  },
  {
    id: "16",
    name: "Celestial Plate",
    image: "/placeholder.svg?height=400&width=400&query=celestial+plate+armor+fantasy",
    price: 1450,
    rarity: "legendary",
    category: "armor",
    owner: "0x8642...1357",
  },
  {
    id: "17",
    name: "Healing Potion",
    image: "/placeholder.svg?height=400&width=400&query=healing+potion+spell+fantasy+rpg",
    price: 220,
    rarity: "common",
    category: "spells",
    owner: "0x1357...2468",
  },
  {
    id: "18",
    name: "Sapphire Pendant",
    image: "/placeholder.svg?height=400&width=400&query=sapphire+pendant+fantasy+gem+jewelry",
    price: 890,
    rarity: "epic",
    category: "gems",
    owner: "0x7531...2468",
  },
  {
    id: "19",
    name: "War Hammer",
    image: "/placeholder.svg?height=400&width=400&query=fantasy+war+hammer+weapon",
    price: 980,
    rarity: "rare",
    category: "weapons",
    owner: "0x3579...7531",
  },
  {
    id: "20",
    name: "Phoenix Feather",
    image: "/placeholder.svg?height=400&width=400&query=phoenix+feather+magical+artifact+fantasy",
    price: 1750,
    rarity: "legendary",
    category: "artifacts",
    owner: "0x9753...1357",
  },
  {
    id: "21",
    name: "Shadow Cloak",
    image: "/placeholder.svg?height=400&width=400&query=shadow+cloak+dark+fantasy+armor",
    price: 760,
    rarity: "epic",
    category: "armor",
    owner: "0x2468...1357",
  },
  {
    id: "22",
    name: "Frost Nova Spell",
    image: "/placeholder.svg?height=400&width=400&query=frost+nova+ice+magic+spell+fantasy",
    price: 420,
    rarity: "uncommon",
    category: "spells",
    owner: "0x8642...1357",
  },
  {
    id: "23",
    name: "Diamond of Truth",
    image: "/placeholder.svg?height=400&width=400&query=glowing+diamond+fantasy+gem",
    price: 1200,
    rarity: "legendary",
    category: "gems",
    owner: "0x1357...2468",
  },
  {
    id: "24",
    name: "Ancient Scroll",
    image: "/placeholder.svg?height=400&width=400&query=ancient+magical+scroll+artifact",
    price: 680,
    rarity: "rare",
    category: "artifacts",
    owner: "0x7531...2468",
  },
  {
    id: "25",
    name: "Flaming Axe",
    image: "/placeholder.svg?height=400&width=400&query=flaming+axe+fire+weapon+fantasy",
    price: 950,
    rarity: "epic",
    category: "weapons",
    owner: "0x3579...7531",
  },
  {
    id: "26",
    name: "Mithril Chainmail",
    image: "/placeholder.svg?height=400&width=400&query=mithril+chainmail+armor+fantasy",
    price: 820,
    rarity: "rare",
    category: "armor",
    owner: "0x9753...1357",
  },
  {
    id: "27",
    name: "Teleportation Rune",
    image: "/placeholder.svg?height=400&width=400&query=teleportation+rune+magic+spell+fantasy",
    price: 1100,
    rarity: "epic",
    category: "spells",
    owner: "0x2468...1357",
  },
  {
    id: "28",
    name: "Amethyst Crystal",
    image: "/placeholder.svg?height=400&width=400&query=amethyst+crystal+purple+gem+fantasy",
    price: 540,
    rarity: "uncommon",
    category: "gems",
    owner: "0x8642...1357",
  },
  {
    id: "29",
    name: "Dragon Egg",
    image: "/placeholder.svg?height=400&width=400&query=dragon+egg+fantasy+artifact",
    price: 2200,
    rarity: "legendary",
    category: "artifacts",
    owner: "0x1357...2468",
  },
  {
    id: "30",
    name: "Vorpal Blade",
    image: "/placeholder.svg?height=400&width=400&query=vorpal+blade+fantasy+legendary+sword",
    price: 1650,
    rarity: "legendary",
    category: "weapons",
    owner: "0x7531...2468",
  },
]

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 2500])
  const [selectedRarities, setSelectedRarities] = useState({
    common: true,
    uncommon: true,
    rare: true,
    epic: true,
    legendary: true,
  })
  const [displayedNFTs, setDisplayedNFTs] = useState(12) // Increased from 6 to 12
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Filter NFTs based on search, category, price range, and rarity
  const filteredNFTs = SAMPLE_NFTS.filter((nft) => {
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || nft.category === selectedCategory
    const matchesPrice = nft.price >= priceRange[0] && nft.price <= priceRange[1]
    const matchesRarity = selectedRarities[nft.rarity]

    return matchesSearch && matchesCategory && matchesPrice && matchesRarity
  })

  const loadMoreNFTs = () => {
    setDisplayedNFTs(Math.min(displayedNFTs + 6, filteredNFTs.length)) // Increased from 3 to 6

    if (displayedNFTs + 6 >= filteredNFTs.length) {
      toast({
        title: "All NFTs Loaded",
        description: "You've reached the end of the available NFTs.",
      })
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MarketplaceHeader />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        {/* Filters Sidebar */}
        <FilterSidebar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedRarities={selectedRarities}
          setSelectedRarities={setSelectedRarities}
        />

        {/* NFT Grid */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="bg-black border border-gold-500/50">
                <TabsTrigger value="all" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
                  All NFTs
                </TabsTrigger>
                <TabsTrigger value="buy-now" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
                  Buy Now
                </TabsTrigger>
                <TabsTrigger
                  value="auctions"
                  className="data-[state=active]:bg-gold-500 data-[state=active]:text-black"
                >
                  Auctions
                </TabsTrigger>
                <TabsTrigger value="new" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
                  New
                </TabsTrigger>
              </TabsList>

              <div className="text-sm text-gray-400">{filteredNFTs.length} items</div>
            </div>

            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(12)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-gray-800 rounded-lg h-64 mb-2"></div>
                      <div className="bg-gray-800 h-4 rounded w-3/4 mb-2"></div>
                      <div className="bg-gray-800 h-4 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredNFTs.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  <AnimatePresence>
                    {filteredNFTs.slice(0, displayedNFTs).map((nft) => (
                      <motion.div key={nft.id} variants={item}>
                        <NFTCard nft={nft} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No NFTs found matching your filters.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="buy-now" className="mt-0">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {filteredNFTs.slice(0, 12).map((nft) => (
                  <motion.div key={nft.id} variants={item}>
                    <NFTCard nft={nft} />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="auctions" className="mt-0">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {filteredNFTs.slice(2, 14).map((nft) => (
                  <motion.div key={nft.id} variants={item}>
                    <NFTCard nft={nft} isAuction={true} />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="new" className="mt-0">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {filteredNFTs.slice(15, 27).map((nft) => (
                  <motion.div key={nft.id} variants={item}>
                    <NFTCard nft={nft} isNew={true} />
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="border-gold-500 text-gold-500 hover:bg-gold-500/10"
                onClick={loadMoreNFTs}
              >
                Load More
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
