"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, ShoppingBag, Tag, Sword, Shield, Wand2, Crown, Gem } from "lucide-react"
import NFTCard from "@/components/nft-card"
import { useWallet } from "@/hooks/use-wallet"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { toast } from "@/components/ui/use-toast"

const RARITY_COLORS = {
  common: "bg-gray-500",
  uncommon: "bg-green-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-gold text-black",
}

const CATEGORIES = [
  { id: "all", name: "All Items", icon: ShoppingBag },
  { id: "weapons", name: "Weapons", icon: Sword },
  { id: "armor", name: "Armor", icon: Shield },
  { id: "spells", name: "Spells", icon: Wand2 },
  { id: "artifacts", name: "Artifacts", icon: Crown },
  { id: "gems", name: "Gems", icon: Gem },
]

// Sample NFT data
const SAMPLE_NFTS = [
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
  {
    id: "7",
    name: "Ice Shard Spell",
    image: "/placeholder.svg?height=400&width=300&query=ice magic spell fantasy",
    price: 380,
    rarity: "uncommon",
    category: "spells",
    owner: "0x8642...1357",
  },
  {
    id: "8",
    name: "Ancient Amulet",
    image: "/placeholder.svg?height=400&width=300&query=fantasy amulet with runes",
    price: 920,
    rarity: "epic",
    category: "artifacts",
    owner: "0x1234...5678",
  },
]

export default function Marketplace() {
  const { connected } = useWallet()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [selectedRarities, setSelectedRarities] = useState({
    common: true,
    uncommon: true,
    rare: true,
    epic: true,
    legendary: true,
  })
  const [displayedNFTs, setDisplayedNFTs] = useState(6)

  // Filter NFTs based on search, category, price range, and rarity
  const filteredNFTs = SAMPLE_NFTS.filter((nft) => {
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || nft.category === selectedCategory
    const matchesPrice = nft.price >= priceRange[0] && nft.price <= priceRange[1]
    const matchesRarity = selectedRarities[nft.rarity]

    return matchesSearch && matchesCategory && matchesPrice && matchesRarity
  })

  const toggleRarity = (rarity) => {
    setSelectedRarities((prev) => ({
      ...prev,
      [rarity]: !prev[rarity],
    }))
  }

  const handleListNFT = () => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to list an NFT for sale.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "List NFT",
      description: "NFT listing functionality will be available soon!",
    })
  }

  const loadMoreNFTs = () => {
    setDisplayedNFTs(Math.min(displayedNFTs + 3, filteredNFTs.length))

    if (displayedNFTs + 3 >= filteredNFTs.length) {
      toast({
        title: "All NFTs Loaded",
        description: "You've reached the end of the available NFTs.",
      })
    }
  }

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>
        <p className="text-gray-400 mb-8">Please connect your wallet to access the marketplace.</p>
        <ConnectWalletButton className="gold-button" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">NFT Marketplace</h1>
          <p className="text-gray-400">Buy, sell, and trade unique fantasy NFTs using GOLD</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button className="gold-button" onClick={handleListNFT}>
            <Tag className="mr-2 h-4 w-4" />
            List NFT for Sale
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-gold bg-black sticky top-4">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Filter className="mr-2 h-5 w-5 text-gold" />
                Filters
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search NFTs..."
                    className="pl-10 bg-black border-gold/50 focus:border-gold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Category</label>
                <div className="space-y-2">
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className={`w-full justify-start ${
                        selectedCategory === category.id
                          ? "bg-gold text-black"
                          : "border-gold/50 text-white hover:bg-gold/10"
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <category.icon className="mr-2 h-4 w-4" />
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Price Range (GOLD)</label>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 2000]}
                    max={2000}
                    step={50}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="my-6"
                  />
                  <div className="flex justify-between">
                    <span>{priceRange[0]} GOLD</span>
                    <span>{priceRange[1]} GOLD</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Rarity</label>
                <div className="space-y-2">
                  {Object.entries(selectedRarities).map(([rarity, isSelected]) => (
                    <div key={rarity} className="flex items-center cursor-pointer" onClick={() => toggleRarity(rarity)}>
                      <div className={`w-4 h-4 mr-2 rounded ${isSelected ? RARITY_COLORS[rarity] : "bg-gray-700"}`}>
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

              <Button
                variant="outline"
                className="w-full border-gold text-gold hover:bg-gold/10"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setPriceRange([0, 2000])
                  setSelectedRarities({
                    common: true,
                    uncommon: true,
                    rare: true,
                    epic: true,
                    legendary: true,
                  })
                }}
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* NFT Grid */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="all">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="bg-black border border-gold/50">
                <TabsTrigger value="all" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  All NFTs
                </TabsTrigger>
                <TabsTrigger value="buy-now" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  Buy Now
                </TabsTrigger>
                <TabsTrigger value="auctions" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  Auctions
                </TabsTrigger>
                <TabsTrigger value="new" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  New
                </TabsTrigger>
              </TabsList>

              <div className="text-sm text-gray-400">{filteredNFTs.length} items</div>
            </div>

            <TabsContent value="all" className="mt-0">
              {filteredNFTs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNFTs.slice(0, displayedNFTs).map((nft) => (
                    <NFTCard key={nft.id} nft={nft} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No NFTs found matching your filters.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="buy-now" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNFTs.slice(0, 6).map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="auctions" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNFTs.slice(2, 5).map((nft) => (
                  <NFTCard key={nft.id} nft={nft} isAuction={true} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="new" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNFTs.slice(4, 8).map((nft) => (
                  <NFTCard key={nft.id} nft={nft} isNew={true} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center">
            <Button variant="outline" className="border-gold text-gold hover:bg-gold/10" onClick={loadMoreNFTs}>
              Load More
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
