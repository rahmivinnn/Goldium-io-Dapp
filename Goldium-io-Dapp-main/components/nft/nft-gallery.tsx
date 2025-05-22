"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useConnection } from "@solana/wallet-adapter-react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useNetwork } from "@/contexts/network-context"
import { getNFTsByOwner } from "@/services/nft-service"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { ZoomIn, ExternalLink, RefreshCw } from "lucide-react"

export default function NFTGallery() {
  const { connection } = useConnection()
  const { walletAddress, connected } = useSolanaWallet()
  const { network } = useNetwork()
  const [nfts, setNfts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hoveredNft, setHoveredNft] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchNFTs = async () => {
    if (!connected || !walletAddress) return

    setLoading(true)
    setError(null)

    try {
      const fetchedNfts = await getNFTsByOwner(connection, walletAddress, network)
      setNfts(fetchedNfts)
    } catch (err) {
      console.error("Error fetching NFTs:", err)
      setError("Failed to load NFTs. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNFTs()
  }, [connected, walletAddress, network])

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case "legendary":
        return "bg-gold"
      case "epic":
        return "bg-gold/70"
      case "rare":
        return "bg-gold/50"
      case "uncommon":
        return "bg-gold/30"
      default:
        return "bg-gray-500"
    }
  }

  if (!connected) {
    return (
      <Card className="border-gold/30 bg-black/60 backdrop-blur-sm">
        <CardContent className="p-6 text-center">
          <p>Connect your wallet to view your NFTs</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your NFT Collection</h2>
        <Button
          variant="outline"
          size="sm"
          className="border-gold/50 text-gold hover:bg-gold/10"
          onClick={fetchNFTs}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && <div className="bg-black/60 border border-gold/30 p-4 rounded-md text-center">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border border-gold/30 rounded-lg p-2 bg-black/50">
              <Skeleton className="aspect-square w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : nfts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {nfts.map((nft) => (
            <Dialog key={nft.mint}>
              <DialogTrigger asChild>
                <motion.div
                  className="border border-gold/30 rounded-lg p-2 hover:border-gold transition-colors bg-black/50 cursor-pointer overflow-hidden"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 15px rgba(255, 215, 0, 0.5)",
                  }}
                  onHoverStart={() => setHoveredNft(nft.mint)}
                  onHoverEnd={() => setHoveredNft(null)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative aspect-square mb-2 overflow-hidden rounded">
                    <motion.div
                      className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center opacity-0"
                      animate={{ opacity: hoveredNft === nft.mint ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ZoomIn className="text-gold w-8 h-8" />
                    </motion.div>

                    <motion.div
                      animate={{
                        scale: hoveredNft === nft.mint ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className="h-full w-full"
                    >
                      <Image
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.name}
                        fill
                        className="object-cover rounded"
                        onError={(e) => {
                          // Fallback for broken images
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </motion.div>

                    {nft.attributes?.find((attr: any) => attr.trait_type === "Rarity") && (
                      <div
                        className={`absolute top-1 right-1 w-3 h-3 rounded-full ${getRarityColor(
                          nft.attributes.find((attr: any) => attr.trait_type === "Rarity").value,
                        )}`}
                      >
                        <motion.div
                          className="absolute inset-0 rounded-full bg-inherit"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="truncate text-sm font-medium text-gold">{nft.name}</div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                </motion.div>
              </DialogTrigger>

              <DialogContent className="bg-black border-gold sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="text-gold text-xl">{nft.name}</DialogTitle>
                  <DialogDescription>
                    {nft.attributes?.find((attr: any) => attr.trait_type === "Rarity") && (
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-bold ${getRarityColor(
                          nft.attributes.find((attr: any) => attr.trait_type === "Rarity").value,
                        ).replace("bg-", "bg-opacity-20 text-")} mt-2`}
                      >
                        {nft.attributes.find((attr: any) => attr.trait_type === "Rarity").value.toUpperCase()}
                      </span>
                    )}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                  <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gold/50 mb-4">
                    <Image
                      src={nft.image || "/placeholder.svg"}
                      alt={nft.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">Description</h4>
                      <p className="mt-1">{nft.description || "No description available."}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {nft.collection && (
                        <div className="border border-gold/30 rounded p-2 text-center">
                          <div className="text-xs text-gray-400">Collection</div>
                          <div className="font-medium">{nft.collection.name}</div>
                        </div>
                      )}
                      <div className="border border-gold/30 rounded p-2 text-center">
                        <div className="text-xs text-gray-400">Mint Address</div>
                        <div className="font-medium text-xs truncate">{nft.mint}</div>
                      </div>
                    </div>

                    {nft.attributes && nft.attributes.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Attributes</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {nft.attributes.map((attr: any, index: number) => (
                            <div key={index} className="border border-gold/30 rounded p-2 text-center">
                              <div className="text-xs text-gray-400">{attr.trait_type}</div>
                              <div className="font-medium">{attr.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between gap-2">
                      <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 w-1/2">
                        Transfer
                      </Button>
                      <Button className="bg-gold hover:bg-gold/80 text-black w-1/2">List for Sale</Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ) : (
        <div className="bg-black/60 border border-gold/30 p-8 rounded-md text-center">
          <p className="mb-2">No NFTs found in your wallet</p>
          <p className="text-sm text-gray-400">NFTs you own will appear here</p>
        </div>
      )}
    </div>
  )
}
