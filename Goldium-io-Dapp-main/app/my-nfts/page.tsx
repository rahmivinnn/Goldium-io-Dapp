"use client"

import { useState, useEffect } from "react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import Image from "next/image"

// Mock NFT data for development
const mockNFTs = [
  {
    id: "nft1",
    name: "Dragon Breath Sword",
    image: "/nft-images/dragon-breath-sword.png",
    description: "A legendary sword forged in dragon fire",
    attributes: [
      { trait_type: "Rarity", value: "Legendary" },
      { trait_type: "Damage", value: "120" },
      { trait_type: "Element", value: "Fire" },
    ],
  },
  {
    id: "nft2",
    name: "Ethereal Shield",
    image: "/nft-images/ethereal-shield.png",
    description: "A shield that phases between dimensions",
    attributes: [
      { trait_type: "Rarity", value: "Epic" },
      { trait_type: "Defense", value: "85" },
      { trait_type: "Element", value: "Arcane" },
    ],
  },
  {
    id: "nft3",
    name: "Crown of Wisdom",
    image: "/nft-images/crown-of-wisdom.png",
    description: "Enhances the wearer's magical abilities",
    attributes: [
      { trait_type: "Rarity", value: "Rare" },
      { trait_type: "Intelligence", value: "+30" },
      { trait_type: "Mana", value: "+50" },
    ],
  },
  {
    id: "nft4",
    name: "Ruby of Power",
    image: "/nft-images/ruby-of-power.png",
    description: "A gem that amplifies magical energy",
    attributes: [
      { trait_type: "Rarity", value: "Uncommon" },
      { trait_type: "Power", value: "+25" },
      { trait_type: "Element", value: "Fire" },
    ],
  },
]

export default function MyNFTsPage() {
  const { connected, walletAddress } = useSolanaWallet()
  const [nfts, setNfts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Simulate loading NFTs
    if (connected && walletAddress) {
      setLoading(true)
      // In a real app, you would fetch NFTs from the blockchain here
      setTimeout(() => {
        setNfts(mockNFTs)
        setLoading(false)
      }, 1500)
    } else {
      setNfts([])
      setLoading(false)
    }
  }, [connected, walletAddress])

  if (!connected) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">My NFT Collection</h1>
          <p className="text-gray-400 mb-8">Connect your wallet to view your NFT collection</p>
          <div className="flex justify-center">
            <ConnectWalletButton showIdentityCard={true} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">My NFT Collection</h1>
        <p className="text-gray-400 mb-8">View and manage your NFT assets</p>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
              All NFTs
            </TabsTrigger>
            <TabsTrigger value="game" onClick={() => setActiveTab("game")}>
              Game Items
            </TabsTrigger>
            <TabsTrigger value="art" onClick={() => setActiveTab("art")}>
              Art Collection
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
                <span className="ml-2 text-gold">Loading your NFTs...</span>
              </div>
            ) : nfts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {nfts.map((nft) => (
                  <NFTCard key={nft.id} nft={nft} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400">No NFTs found in your wallet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="game" className="mt-6">
            <div className="text-center py-20">
              <p className="text-gray-400">Game item NFTs will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="art" className="mt-6">
            <div className="text-center py-20">
              <p className="text-gray-400">Art collection NFTs will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function NFTCard({ nft }: { nft: any }) {
  return (
    <Card className="overflow-hidden bg-black/40 border-gold/20 hover:border-gold/50 transition-all">
      <div className="relative aspect-square">
        <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
        <p className="text-sm text-gray-400 mb-3">{nft.description}</p>
        <div className="space-y-1">
          {nft.attributes.map((attr: any, index: number) => (
            <div key={index} className="flex justify-between text-xs">
              <span className="text-gray-400">{attr.trait_type}</span>
              <span className="font-medium text-gold">{attr.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
