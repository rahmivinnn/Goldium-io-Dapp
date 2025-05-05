"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Connection, PublicKey } from "@solana/web3.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNetworkConfig } from "@/hooks/use-network-config"

// NFT type
interface NFT {
  mint: string
  name: string
  symbol: string
  uri: string
  image: string
  description?: string
  attributes?: Array<{
    trait_type: string
    value: string
  }>
}

export default function GalleryPage() {
  const { publicKey, connected } = useWallet()
  const { toast } = useToast()
  const { endpoint, network } = useNetworkConfig()

  const [nfts, setNfts] = useState<NFT[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [connection, setConnection] = useState<Connection | null>(null)
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null)

  // Initialize connection and fetch data
  useEffect(() => {
    if (!connected || !publicKey) return

    const initConnection = async () => {
      try {
        setIsLoading(true)
        const conn = new Connection(endpoint, "confirmed")
        setConnection(conn)

        // Fetch NFTs
        await fetchNFTs(conn, publicKey)

        setIsLoading(false)
      } catch (error) {
        console.error("Error initializing:", error)
        toast({
          title: "Connection Error",
          description: "Failed to connect to the Solana network",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    initConnection()
  }, [connected, publicKey, endpoint])

  // Fetch NFTs using Metaplex
  const fetchNFTs = async (conn: Connection, walletPubkey: PublicKey) => {
    try {
      // In a real implementation, this would use the Metaplex SDK
      // For demo purposes, we're using a simplified approach

      // Get token accounts
      const tokenAccounts = await conn.getParsedTokenAccountsByOwner(walletPubkey, {
        programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
      })

      // Filter for NFTs (amount = 1)
      const nftAccounts = tokenAccounts.value.filter(
        (account) =>
          account.account.data.parsed.info.tokenAmount.amount === "1" &&
          account.account.data.parsed.info.tokenAmount.decimals === 0,
      )

      // Fetch metadata for each NFT
      const nftData: NFT[] = []

      for (const account of nftAccounts) {
        const mint = account.account.data.parsed.info.mint

        try {
          // In a real implementation, this would fetch the metadata from the chain
          // and then fetch the JSON from the URI
          // For demo purposes, we're using mock data

          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 100))

          // Generate mock NFT data
          const mockNft: NFT = {
            mint,
            name: `Goldium NFT #${Math.floor(Math.random() * 1000)}`,
            symbol: "GOLD",
            uri: `https://arweave.net/mock-uri-${mint.slice(0, 8)}`,
            image: `/placeholder.svg?height=300&width=300&query=fantasy gold nft ${Math.floor(Math.random() * 100)}`,
            description: "A unique NFT from the Goldium collection",
            attributes: [
              {
                trait_type: "Rarity",
                value: ["Common", "Uncommon", "Rare", "Epic", "Legendary"][Math.floor(Math.random() * 5)],
              },
              {
                trait_type: "Type",
                value: ["Weapon", "Armor", "Accessory", "Collectible"][Math.floor(Math.random() * 4)],
              },
              {
                trait_type: "Element",
                value: ["Fire", "Water", "Earth", "Air", "Gold"][Math.floor(Math.random() * 5)],
              },
            ],
          }

          nftData.push(mockNft)
        } catch (error) {
          console.error(`Error fetching metadata for ${mint}:`, error)
        }
      }

      setNfts(nftData)
    } catch (error) {
      console.error("Error fetching NFTs:", error)
      toast({
        title: "Error",
        description: "Failed to fetch your NFTs",
        variant: "destructive",
      })
    }
  }

  // Get explorer URL for NFT
  const getNftExplorerUrl = (mint: string) => {
    const baseUrl =
      network === "mainnet" ? "https://explorer.solana.com/address/" : "https://explorer.solana.com/address/"

    return `${baseUrl}${mint}?cluster=${network}`
  }

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto bg-black/50 border border-yellow-500/30 text-white">
          <CardHeader>
            <CardTitle className="text-center text-yellow-500">Wallet Connection Required</CardTitle>
            <CardDescription className="text-center text-gray-300">
              Please connect your wallet to view your NFT gallery
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <WalletMultiButton />
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
          NFT Gallery
        </h1>

        <Tabs defaultValue="gallery" className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-yellow-500/30">
            <TabsTrigger value="gallery" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              Gallery
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
              disabled={!selectedNft}
            >
              NFT Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
              </div>
            ) : nfts.length === 0 ? (
              <Card className="bg-black/50 border border-yellow-500/30 text-white">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-gray-400 mb-4">No NFTs found in your wallet</p>
                  <p className="text-sm text-gray-500 max-w-md text-center">
                    You don't have any NFTs in your wallet yet. Mint or purchase NFTs to see them here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {nfts.map((nft) => (
                  <Card
                    key={nft.mint}
                    className="bg-black/50 border border-yellow-500/30 text-white hover:border-yellow-500 transition-colors cursor-pointer"
                    onClick={() => setSelectedNft(nft)}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-yellow-500 truncate">{nft.name}</h3>
                      <p className="text-xs text-gray-400 truncate">
                        {nft.mint.slice(0, 8)}...{nft.mint.slice(-8)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            {selectedNft && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/50 border border-yellow-500/30 text-white">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={selectedNft.image || "/placeholder.svg"}
                      alt={selectedNft.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Card>

                <Card className="bg-black/50 border border-yellow-500/30 text-white">
                  <CardHeader>
                    <CardTitle className="text-yellow-500">{selectedNft.name}</CardTitle>
                    <CardDescription className="text-gray-300">{selectedNft.symbol}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Description</p>
                      <p className="text-gray-300">{selectedNft.description || "No description available"}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-400">Mint Address</p>
                      <div className="flex items-center">
                        <p className="text-sm font-mono truncate">{selectedNft.mint}</p>
                        <a
                          href={getNftExplorerUrl(selectedNft.mint)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-yellow-500 hover:text-yellow-400"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    {selectedNft.attributes && selectedNft.attributes.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-400 mb-2">Attributes</p>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedNft.attributes.map((attr, index) => (
                            <div key={index} className="bg-black/30 rounded-md p-2 border border-yellow-500/20">
                              <p className="text-xs text-gray-400">{attr.trait_type}</p>
                              <p className="text-sm font-medium">{attr.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                      onClick={() => setSelectedNft(null)}
                    >
                      Back to Gallery
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Card className="bg-black/50 border border-yellow-500/30 text-white">
          <CardHeader>
            <CardTitle className="text-yellow-500">About NFTs on Solana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">What are NFTs?</h3>
                <p className="text-gray-300">
                  Non-Fungible Tokens (NFTs) are unique digital assets that represent ownership of a specific item or
                  piece of content. Unlike cryptocurrencies, each NFT has distinct properties and cannot be exchanged on
                  a one-to-one basis.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Solana NFT Standard</h3>
                <p className="text-gray-300">
                  Solana NFTs follow the Metaplex NFT standard, which provides a framework for creating, managing, and
                  trading NFTs on the Solana blockchain. This standard ensures compatibility across different
                  marketplaces and applications.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Goldium NFTs</h3>
                <p className="text-gray-300">
                  Goldium offers exclusive NFTs that provide various benefits within the ecosystem, including special
                  access to features, enhanced rewards, and unique in-game items. Stay tuned for upcoming NFT drops and
                  collections.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
