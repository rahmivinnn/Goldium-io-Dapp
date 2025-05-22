"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Heart, Share2, Clock, Tag, BarChart3, History, MessageSquare, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { useConnection } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { getNFTByMint } from "@/services/nft-service"
import type { NFT } from "@/services/nft-service"

// Mock history data - in a real app, this would come from blockchain events
const mockHistory = [
  {
    event: "Minted",
    from: "Creator",
    to: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    price: 100,
    date: "2023-04-15",
  },
  { event: "Listed", from: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", to: null, price: 120, date: "2023-04-20" },
  {
    event: "Sold",
    from: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    to: "0x3FE687A2A3B6cc3e85bF7F7C5dB2Cc3b3F8FD078",
    price: 120,
    date: "2023-04-22",
  },
  { event: "Listed", from: "0x3FE687A2A3B6cc3e85bF7F7C5dB2Cc3b3F8FD078", to: null, price: 125, date: "2023-05-01" },
]

export default function NFTDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { connection } = useConnection()
  const { connected, walletAddress, publicKey } = useSolanaWallet()

  const id = params.id as string
  const [nft, setNft] = useState<NFT | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [isBuying, setIsBuying] = useState(false)

  useEffect(() => {
    async function fetchNFT() {
      setIsLoading(true)
      try {
        // In a real app, this would fetch from the blockchain
        // For now, we'll simulate with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Try to parse the ID as a Solana public key
        try {
          const mintPublicKey = new PublicKey(id)
          const nftData = await getNFTByMint(connection, mintPublicKey)

          if (nftData) {
            // Add mock price and history for demonstration
            setNft({
              ...nftData,
              price: 125,
              listed: true,
            })
          } else {
            // Fallback to mock data if NFT not found
            setNft(null)
          }
        } catch (error) {
          console.error("Invalid mint address:", error)
          setNft(null)
        }
      } catch (error) {
        console.error("Error fetching NFT:", error)
        setNft(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNFT()
  }, [id, connection])

  const handleBuyNFT = async () => {
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to purchase this NFT",
        variant: "destructive",
      })
      return
    }

    if (!nft) return

    setIsBuying(true)
    try {
      // In a real app, this would execute a blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Purchase Successful",
        description: `You have successfully purchased ${nft.name} for ${nft.price} GOLD`,
      })

      // Update the NFT owner
      if (walletAddress) {
        setNft({
          ...nft,
          owner: walletAddress,
          listed: false,
        })
      }
    } catch (error) {
      console.error("Error buying NFT:", error)
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBuying(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gold font-medium">Loading NFT details...</p>
        </div>
      </div>
    )
  }

  if (!nft) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">NFT Not Found</h2>
          <p className="mb-6">The NFT you're looking for doesn't exist or has been removed.</p>
          <Link href="/marketplace">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const isOwner = connected && walletAddress === nft.owner

  return (
    <div className="container mx-auto p-4 pb-16">
      <div className="mb-6">
        <Link href="/marketplace">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* NFT Image */}
        <div className="bg-black/5 rounded-xl p-4 flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-lg mx-auto">
            <Image src={nft.image || "/placeholder.svg"} alt={nft.name} fill className="object-contain rounded-lg" />
          </div>
        </div>

        {/* NFT Details */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold">{nft.name}</h1>
              <p className="text-gray-500">From the {nft.collection || "Unknown"} collection</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setLiked(!liked)}
                className={liked ? "text-red-500" : ""}
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-red-500" : ""}`} />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
              <Clock className="h-3 w-3" />
              <span>Listed recently</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
              <Tag className="h-3 w-3" />
              <span>Verified</span>
            </Badge>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">Current Price</p>
                  <p className="text-3xl font-bold">{nft.price} GOLD</p>
                </div>
                {nft.listed && !isOwner ? (
                  <Button className="bg-gold hover:bg-gold/90 text-black" onClick={handleBuyNFT} disabled={isBuying}>
                    {isBuying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Buy Now"
                    )}
                  </Button>
                ) : isOwner ? (
                  <Button className="bg-gold hover:bg-gold/90 text-black">List for Sale</Button>
                ) : (
                  <Button className="bg-gray-700 text-white" disabled>
                    Not for Sale
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Owner:{" "}
                <span className="font-mono">{`${nft.owner.substring(0, 6)}...${nft.owner.substring(nft.owner.length - 4)}`}</span>
                {isOwner && " (You)"}
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="details">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="attributes">Attributes</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="offers">Offers</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{nft.description}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-2">Creator</h3>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <p className="font-mono">{`${nft.creator.substring(0, 6)}...${nft.creator.substring(nft.creator.length - 4)}`}</p>
                    <p className="text-sm text-gray-500">Original Creator</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="attributes">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {nft.attributes.map((attr, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-500">{attr.trait_type}</p>
                      <p className="font-semibold">{attr.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-4">
                {mockHistory.map((event, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-4 mt-1">
                      {event.event === "Minted" && <History className="h-5 w-5 text-green-500" />}
                      {event.event === "Listed" && <Tag className="h-5 w-5 text-blue-500" />}
                      {event.event === "Sold" && <BarChart3 className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div>
                      <p className="font-medium">{event.event}</p>
                      <p className="text-sm text-gray-500">
                        {event.event === "Listed" ? `Listed for ${event.price} GOLD` : `${event.price} GOLD`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {event.from &&
                          `From: ${event.from === "Creator" ? "Creator" : `${event.from.substring(0, 6)}...${event.from.substring(event.from.length - 4)}`}`}
                        {event.to &&
                          ` To: ${`${event.to.substring(0, 6)}...${event.to.substring(event.to.length - 4)}`}`}
                      </p>
                      <p className="text-xs text-gray-400">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="offers">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No offers yet</p>
                <Button variant="outline" className="mt-4">
                  Make an Offer
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
