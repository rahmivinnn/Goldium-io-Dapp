"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"

export default function MarketplaceTabs() {
  const [activeTab, setActiveTab] = useState("all")
  const [sortOption, setSortOption] = useState("newest")

  const tabs = [
    { id: "all", label: "All NFTs" },
    { id: "buy", label: "Buy Now" },
    { id: "auctions", label: "Auctions" },
    { id: "new", label: "New" },
  ]

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "most-viewed", label: "Most Viewed" },
  ]

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl md:text-4xl font-serif font-bold">
          <span className="gold-gradient-text">Goldium.io Marketplace</span>
        </h1>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0 md:w-64">
            <input
              type="text"
              placeholder="Search items..."
              className="w-full bg-dark-400 border border-gold-500/20 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-gold-500/50"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-500/50 h-4 w-4" />
          </div>

          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none bg-dark-400 border border-gold-500/20 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-gold-500/50"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold-500/50 h-4 w-4 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto pb-2 hide-scrollbar">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? "bg-gold-500 text-black" : "bg-dark-400 text-white hover:bg-dark-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
