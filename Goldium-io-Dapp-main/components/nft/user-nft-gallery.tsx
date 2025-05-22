"use client"

import { useState, useEffect } from "react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import Image from "next/image"

interface NFT {
  id: string
  name: string
  image: string
  description?: string
  attributes?: Array<{ trait_type: string; value: string }>
}

export function UserNFTGallery() {
  const { connected, walletAddress } = useSolanaWallet()
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (connected && walletAddress) {
      fetchNFTs()
    } else {
      setNfts([])
    }
  }, [connected, walletAddress])

  const fetchNFTs = async () => {
    if (!walletAddress) return

    setLoading(true)
    try {
      // In a real implementation, you would fetch NFTs from Metaplex or Helius API
      // For demo purposes, we'll use mock data

      // Mock data for development
      setTimeout(() => {
        const mockNFTs: NFT[] = [
          {
            id: "nft1",
            name: "Golden Dragon",
            image: "/nft-images/dragon-egg.png",
            description: "A rare golden dragon NFT from the Goldium collection",
          },
          {
            id: "nft2",
            name: "Ruby of Power",
            image: "/nft-images/ruby-of-power.png",
            description: "Grants the holder special powers in the Goldium ecosystem",
          },
          {
            id: "nft3",
            name: "Enchanted Bow",
            image: "/nft-images/enchanted-bow.png",
            description: "A magical bow that never misses its target",
          },
          {
            id: "nft4",
            name: "Shadow Cloak",
            image: "/nft-images/shadow-cloak.png",
            description: "Provides stealth abilities to the holder",
          },
        ]
        setNfts(mockNFTs)
        setLoading(false)
      }, 1500)

      // In production, you would use code like this:
      /*
      // Using Helius API (you would need an API key)
      const response = await fetch(
        `https://api.helius.xyz/v0/addresses/${walletAddress}/nfts?api-key=YOUR_HELIUS_API_KEY`
      )
      const data = await response.json()
      
      // Transform the data to match our NFT interface
      const transformedNFTs = data.nfts.map((nft: any) => ({
        id: nft.mint,
        name: nft.content.metadata.name,
        image: nft.content.files[0]?.uri || "",
        description: nft.content.metadata.description,
        attributes: nft.content.metadata.attributes,
      }))
      
      setNfts(transformedNFTs)
      */
    } catch (error) {
      console.error("Error fetching NFTs:", error)
      toast({
        title: "Error",
        description: "Failed to fetch NFTs. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isClient) {
    return null
  }

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
        <p className="text-muted-foreground">Connect your wallet to view your NFTs</p>
        <ConnectWalletButton showIdentityCard={false} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your NFT Collection</h2>
        <Button onClick={fetchNFTs} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : nfts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <Card key={nft.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 w-full">
                <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold truncate">{nft.name}</h3>
                {nft.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{nft.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <p>No NFTs found in your wallet.</p>
        </div>
      )}
    </div>
  )
}
