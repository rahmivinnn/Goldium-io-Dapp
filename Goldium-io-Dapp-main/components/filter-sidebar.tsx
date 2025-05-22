"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"

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
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "weapons", name: "Weapons" },
    { id: "armor", name: "Armor" },
    { id: "spells", name: "Spells" },
    { id: "artifacts", name: "Artifacts" },
    { id: "gems", name: "Gems" },
  ]

  const rarities = [
    { id: "common", name: "Common" },
    { id: "uncommon", name: "Uncommon" },
    { id: "rare", name: "Rare" },
    { id: "epic", name: "Epic" },
    { id: "legendary", name: "Legendary" },
  ]

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setPriceRange([0, 2500])
    setSelectedRarities({
      common: true,
      uncommon: true,
      rare: true,
      epic: true,
      legendary: true,
    })
  }

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="md:hidden mb-4">
        <Button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          variant="outline"
          className="w-full flex items-center justify-center"
        >
          {isFilterOpen ? <X className="mr-2 h-4 w-4" /> : <Filter className="mr-2 h-4 w-4" />}
          {isFilterOpen ? "Close Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Filter Sidebar Content */}
      <div
        className={`space-y-6 bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-amber-200/20 mt-8 md:mt-0 ${
          isFilterOpen ? "block" : "hidden md:block"
        }`}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Search</h3>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search NFTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-black/50 border-amber-200/30"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <input
                  type="radio"
                  id={`category-${category.id}`}
                  name="category"
                  checked={selectedCategory === category.id}
                  onChange={() => setSelectedCategory(category.id)}
                  className="mr-2 accent-amber-500"
                />
                <Label htmlFor={`category-${category.id}`} className="cursor-pointer">
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Price Range</h3>
          <div className="px-2">
            <Slider
              defaultValue={priceRange}
              min={0}
              max={2500}
              step={50}
              value={priceRange}
              onValueChange={setPriceRange}
              className="my-6"
            />
            <div className="flex items-center justify-between">
              <span>{priceRange[0]} GOLD</span>
              <span>{priceRange[1]} GOLD</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Rarity</h3>
          <div className="space-y-2">
            {rarities.map((rarity) => (
              <div key={rarity.id} className="flex items-center">
                <Checkbox
                  id={`rarity-${rarity.id}`}
                  checked={selectedRarities[rarity.id]}
                  onCheckedChange={(checked) =>
                    setSelectedRarities({
                      ...selectedRarities,
                      [rarity.id]: !!checked,
                    })
                  }
                  className="mr-2 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                />
                <Label htmlFor={`rarity-${rarity.id}`} className="cursor-pointer">
                  {rarity.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={resetFilters} variant="outline" className="w-full">
          Reset Filters
        </Button>
      </div>
    </>
  )
}
