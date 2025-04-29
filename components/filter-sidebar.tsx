"use client"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, ShoppingBag, Sword, Shield, Wand2, Crown, Gem } from "lucide-react"

const CATEGORIES = [
  { id: "all", name: "All Items", icon: ShoppingBag },
  { id: "weapons", name: "Weapons", icon: Sword },
  { id: "armor", name: "Armor", icon: Shield },
  { id: "spells", name: "Spells", icon: Wand2 },
  { id: "artifacts", name: "Artifacts", icon: Crown },
  { id: "gems", name: "Gems", icon: Gem },
]

const RARITY_COLORS = {
  common: "bg-gray-500",
  uncommon: "bg-green-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-gold-500 text-black",
}

interface FilterSidebarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  priceRange: number[]
  setPriceRange: (range: number[]) => void
  selectedRarities: Record<string, boolean>
  setSelectedRarities: (rarities: Record<string, boolean>) => void
}

export default function FilterSidebar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  selectedRarities,
  setSelectedRarities,
}: FilterSidebarProps) {
  const toggleRarity = (rarity: string) => {
    setSelectedRarities((prev) => ({
      ...prev,
      [rarity]: !prev[rarity],
    }))
  }

  const resetFilters = () => {
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
  }

  return (
    <motion.div
      className="lg:col-span-1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-gold-500/30 bg-black sticky top-4">
        <CardContent className="pt-6">
          <motion.h2
            className="text-xl font-bold mb-4 flex items-center font-serif"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Filter className="mr-2 h-5 w-5 text-gold-500" />
            Filters
          </motion.h2>

          <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <label className="block text-sm font-medium mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search NFTs..."
                className="pl-10 bg-black border-gold-500/50 focus:border-gold-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <label className="block text-sm font-medium mb-2">Category</label>
            <div className="space-y-2">
              {CATEGORIES.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Button
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`w-full justify-start ${
                      selectedCategory === category.id
                        ? "bg-gold-500 text-black"
                        : "border-gold-500/50 text-white hover:bg-gold-500/10"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.name}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
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
          </motion.div>

          <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
            <label className="block text-sm font-medium mb-2">Rarity</label>
            <div className="space-y-2">
              {Object.entries(selectedRarities).map(([rarity, isSelected], index) => (
                <motion.div
                  key={rarity}
                  className="flex items-center cursor-pointer"
                  onClick={() => toggleRarity(rarity)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
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
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Button
              variant="outline"
              className="w-full border-gold-500 text-gold-500 hover:bg-gold-500/10"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
