"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Wallet, Menu, X } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import "./premium-marketplace.css"

// Sample NFT data with real image URLs
const PREMIUM_NFTS = [
  {
    id: "1",
    name: "Golden Egg #001",
    image: "https://picsum.photos/id/1015/300",
    price: 3.2,
    rarity: "legendary",
  },
  {
    id: "2",
    name: "Ethereal Shield #042",
    image: "https://picsum.photos/id/1025/300",
    price: 2.5,
    rarity: "epic",
  },
  {
    id: "3",
    name: "Arcane Fireball #103",
    image: "https://picsum.photos/id/1045/300",
    price: 1.8,
    rarity: "rare",
  },
  {
    id: "4",
    name: "Crown of Wisdom #007",
    image: "https://picsum.photos/id/1055/300",
    price: 4.5,
    rarity: "legendary",
  },
  {
    id: "5",
    name: "Ruby of Power #089",
    image: "https://picsum.photos/id/1069/300",
    price: 2.2,
    rarity: "epic",
  },
  {
    id: "6",
    name: "Leather Gauntlets #156",
    image: "https://picsum.photos/id/1074/300",
    price: 0.9,
    rarity: "common",
  },
  {
    id: "7",
    name: "Ice Shard Spell #072",
    image: "https://picsum.photos/id/1080/300",
    price: 1.5,
    rarity: "rare",
  },
  {
    id: "8",
    name: "Ancient Amulet #033",
    image: "https://picsum.photos/id/1084/300",
    price: 2.8,
    rarity: "epic",
  },
  {
    id: "9",
    name: "Dragon Scale Armor #012",
    image: "https://picsum.photos/id/1062/300",
    price: 3.7,
    rarity: "legendary",
  },
]

// NFT Card Component
const PremiumNFTCard = ({ nft }: { nft: any }) => {
  const handleBuy = () => {
    alert(`You bought NFT: ${nft.name} for ${nft.price} GOLD`)
  }

  const getRarityClass = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "legendary":
        return "rarity-legendary"
      case "epic":
        return "rarity-epic"
      case "rare":
        return "rarity-rare"
      default:
        return "rarity-common"
    }
  }

  return (
    <motion.div
      className="premium-nft-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="nft-image-container">
        <Image
          src={nft.image}
          alt={nft.name}
          width={300}
          height={300}
          className="nft-image"
        />
        <div className="absolute top-3 left-3">
          <span className={`rarity-badge ${getRarityClass(nft.rarity)}`}>
            {nft.rarity}
          </span>
        </div>
      </div>
      <div className="nft-content">
        <h3 className="nft-title">{nft.name}</h3>
        <div className="nft-price-container">
          <div className="nft-price">
            <span className="nft-price-amount">{nft.price}</span>
            <span className="nft-price-currency">GOLD</span>
          </div>
        </div>
        <button className="buy-button" onClick={handleBuy}>
          Buy Now
        </button>
      </div>
    </motion.div>
  )
}

// Header Component
const PremiumHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  const handleConnectWallet = () => {
    setIsWalletConnected(!isWalletConnected)
    alert("Wallet Connected!")
  }

  return (
    <header className="premium-header">
      <div className="premium-container">
        <div className="premium-header-content">
          <div className="flex items-center gap-8">
            <Link href="/" className="premium-logo">
              Goldium.io
            </Link>
            <nav className={`premium-nav ${isMenuOpen ? 'open' : ''}`}>
              <Link href="/" className="premium-nav-item">
                Home
              </Link>
              <Link href="/marketplace/premium" className="premium-nav-item active">
                Marketplace
              </Link>
              <Link href="/staking" className="premium-nav-item">
                Staking
              </Link>
              <Link href="/games" className="premium-nav-item">
                Game
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="connect-wallet-button" onClick={handleConnectWallet}>
              <Wallet size={18} />
              {isWalletConnected ? "0x7F...A4D2" : "Connect Wallet"}
            </button>
            <button 
              className="mobile-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

// Main Marketplace Page
export default function PremiumMarketplacePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="premium-background">
      <PremiumHeader />
      <main className="premium-container py-8">
        <div className="mb-12">
          <h1 className="marketplace-title">Premium NFT Marketplace</h1>
          <p className="marketplace-subtitle">Discover, collect, and trade unique NFTs using GOLD tokens</p>
        </div>

        {isLoading ? (
          <div className="premium-marketplace-grid">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="premium-nft-card animate-pulse"
              >
                <div className="nft-image-container bg-gray-800"></div>
                <div className="nft-content">
                  <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
                  <div className="nft-price-container">
                    <div className="h-6 bg-gray-800 rounded w-1/3"></div>
                  </div>
                  <div className="h-12 bg-gray-800 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="premium-marketplace-grid">
            {PREMIUM_NFTS.map((nft) => (
              <PremiumNFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        )}
      </main>
      <Toaster />
    </div>
  )
}
