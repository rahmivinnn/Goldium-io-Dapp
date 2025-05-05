"use client"

import { Suspense, useState, useEffect } from "react"
import NFTCard from "@/components/nft-card"
import MarketplaceHeader from "@/components/marketplace-header"
import FilterSidebar from "@/components/filter-sidebar"
import { useToast } from "@/hooks/use-toast"
import MarketplaceTabs from "@/components/marketplace-tabs"

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
    image: "/placeholder.svg?key=v7dn3",
    price: 120,
    rarity: "common",
    category: "armor",
    owner: "0x5432...9876",
  },
  {
    id: "7",
    name: "Ice Shard Spell",
    image: "/placeholder.svg?key=1tiqw",
    price: 380,
    rarity: "uncommon",
    category: "spells",
    owner: "0x8642...1357",
  },
  {
    id: "8",
    name: "Ancient Amulet",
    image: "/placeholder.svg?key=4x25e",
    price: 920,
    rarity: "epic",
    category: "artifacts",
    owner: "0x1234...5678",
  },
  {
    id: "9",
    name: "Enchanted Bow",
    image: "/placeholder.svg?key=fxxae",
    price: 750,
    rarity: "rare",
    category: "weapons",
    owner: "0x7531...2468",
  },
  {
    id: "10",
    name: "Mystic Orb",
    image: "/placeholder.svg?key=oui4d",
    price: 1100,
    rarity: "epic",
    category: "gems",
    owner: "0x2468...7531",
  },
  {
    id: "11",
    name: "Dragonscale Armor",
    image: "/placeholder.svg?key=wccgx",
    price: 1600,
    rarity: "legendary",
    category: "armor",
    owner: "0x1357...8642",
  },
  {
    id: "12",
    name: "Thunderbolt Spell",
    image: "/placeholder.svg?key=wuta4",
    price: 480,
    rarity: "rare",
    category: "spells",
    owner: "0x8642...1357",
  },
  {
    id: "13",
    name: "Golden Chalice",
    image: "/placeholder.svg?key=emvt9",
    price: 1350,
    rarity: "legendary",
    category: "artifacts",
    owner: "0x9753...1357",
  },
  {
    id: "14",
    name: "Emerald of Life",
    image: "/placeholder.svg?key=ivw46",
    price: 720,
    rarity: "epic",
    category: "gems",
    owner: "0x3579...7531",
  },
  {
    id: "15",
    name: "Obsidian Dagger",
    image: "/placeholder.svg?key=238nq",
    price: 580,
    rarity: "rare",
    category: "weapons",
    owner: "0x2468...1357",
  },
  {
    id: "16",
    name: "Celestial Plate",
    image: "/placeholder.svg?key=a5tzp",
    price: 1450,
    rarity: "legendary",
    category: "armor",
    owner: "0x8642...1357",
  },
  {
    id: "17",
    name: "Healing Potion",
    image: "/placeholder.svg?key=b4nik",
    price: 220,
    rarity: "common",
    category: "spells",
    owner: "0x1357...2468",
  },
  {
    id: "18",
    name: "Sapphire Pendant",
    image: "/placeholder.svg?key=gb9qj",
    price: 890,
    rarity: "epic",
    category: "gems",
    owner: "0x7531...2468",
  },
  {
    id: "19",
    name: "War Hammer",
    image: "/placeholder.svg?key=hg7hf",
    price: 980,
    rarity: "rare",
    category: "weapons",
    owner: "0x3579...7531",
  },
  {
    id: "20",
    name: "Phoenix Feather",
    image: "/placeholder.svg?key=ht13s",
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

// Sample NFT data
const nfts = [
  {
    id: "1",
    name: "Dragon Breath Sword",
    image: "/nft-images/dragon-breath-sword.png",
    price: 1250,
    currency: "GOLD",
    rarity: "legendary",
    creator: "CryptoForge",
    likes: 89,
  },
  {
    id: "2",
    name: "Ethereal Shield",
    image: "/nft-images/ethereal-shield.png",
    price: 850,
    currency: "GOLD",
    rarity: "epic",
    creator: "DigitalArtisan",
    likes: 56,
  },
  {
    id: "3",
    name: "Arcane Fireball",
    image: "/nft-images/arcane-fireball.png",
    price: 600,
    currency: "GOLD",
    rarity: "rare",
    creator: "MagicMinter",
    likes: 42,
  },
  {
    id: "4",
    name: "Crown of Wisdom",
    image: "/nft-images/crown-of-wisdom.png",
    price: 1800,
    currency: "GOLD",
    rarity: "legendary",
    creator: "RoyalCreations",
    likes: 103,
  },
  {
    id: "5",
    name: "Ruby of Power",
    image: "/nft-images/ruby-of-power.png",
    price: 750,
    currency: "GOLD",
    rarity: "epic",
    creator: "GemCrafter",
    likes: 67,
  },
  {
    id: "6",
    name: "Leather Gauntlets",
    image: "/nft-images/leather-gauntlets.png",
    price: 300,
    currency: "GOLD",
    rarity: "uncommon",
    creator: "ArmorSmith",
    likes: 28,
  },
  {
    id: "7",
    name: "Ice Shard Spell",
    image: "/nft-images/ice-shard-spell.png",
    price: 550,
    currency: "GOLD",
    rarity: "rare",
    creator: "FrostMage",
    likes: 39,
  },
  {
    id: "8",
    name: "Ancient Amulet",
    image: "/nft-images/ancient-amulet.png",
    price: 920,
    currency: "GOLD",
    rarity: "epic",
    creator: "RelicHunter",
    likes: 71,
  },
]

export default function MarketplacePage() {
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
    <div className="pt-24 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <MarketplaceHeader />
        <MarketplaceTabs />
        <div className="flex flex-col md:flex-row gap-6 mt-8">
          <aside className="w-full md:w-64 shrink-0">
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
          </aside>
          <main className="flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <Suspense fallback={<div>Loading NFTs...</div>}>
                {nfts.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
