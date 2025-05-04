import { type Connection, PublicKey } from "@solana/web3.js"
import { Metaplex } from "@metaplex-foundation/js"
import type { NetworkType } from "@/contexts/network-context"

export interface NFT {
  mint: string
  name: string
  symbol: string
  description: string
  image: string
  attributes: { trait_type: string; value: string }[]
  owner: string
  collection?: {
    name: string
    family: string
  }
  price?: number
  listed?: boolean
  uri?: string
  metadataAddress?: string
}

// Function to get NFTs owned by a wallet using Metaplex
export async function getNFTsByOwner(connection: Connection, owner: string, network: NetworkType): Promise<NFT[]> {
  try {
    const ownerPublicKey = new PublicKey(owner)
    const metaplex = new Metaplex(connection)

    // Fetch all NFTs owned by the wallet
    const nfts = await metaplex.nfts().findAllByOwner({ owner: ownerPublicKey })

    // Process and return the NFTs
    const processedNfts = await Promise.all(
      nfts.map(async (nft) => {
        try {
          // Fetch metadata if available
          let metadata: any = {}
          if (nft.uri) {
            try {
              const response = await fetch(nft.uri)
              metadata = await response.json()
            } catch (error) {
              console.error("Error fetching NFT metadata:", error)
            }
          }

          return {
            mint: nft.mintAddress.toString(),
            name: nft.name || metadata.name || "Unnamed NFT",
            symbol: nft.symbol || metadata.symbol || "",
            description: metadata.description || "",
            image: metadata.image || "/placeholder.svg",
            attributes: metadata.attributes || [],
            owner: owner,
            collection: nft.collection
              ? {
                  name: nft.collection.name || "",
                  family: nft.collection.key.toString(),
                }
              : undefined,
            uri: nft.uri || "",
            metadataAddress: nft.address.toString(),
          }
        } catch (error) {
          console.error("Error processing NFT:", error)
          return null
        }
      }),
    )

    // Filter out any null values from errors
    return processedNfts.filter(Boolean) as NFT[]
  } catch (error) {
    console.error("Error fetching NFTs:", error)

    // If in development mode, return mock data
    if (process.env.NODE_ENV === "development") {
      return mockNFTs
    }

    return []
  }
}

// Function to get NFT details by mint address
export async function getNFTByMint(connection: Connection, mint: string, network: NetworkType): Promise<NFT | null> {
  try {
    const mintPublicKey = new PublicKey(mint)
    const metaplex = new Metaplex(connection)

    // Fetch the NFT by mint address
    const nft = await metaplex.nfts().findByMint({ mintAddress: mintPublicKey })

    // Fetch metadata if available
    let metadata: any = {}
    if (nft.uri) {
      try {
        const response = await fetch(nft.uri)
        metadata = await response.json()
      } catch (error) {
        console.error("Error fetching NFT metadata:", error)
      }
    }

    return {
      mint: nft.mintAddress.toString(),
      name: nft.name || metadata.name || "Unnamed NFT",
      symbol: nft.symbol || metadata.symbol || "",
      description: metadata.description || "",
      image: metadata.image || "/placeholder.svg",
      attributes: metadata.attributes || [],
      owner: nft.ownerAddress?.toString() || "",
      collection: nft.collection
        ? {
            name: nft.collection.name || "",
            family: nft.collection.key.toString(),
          }
        : undefined,
      uri: nft.uri || "",
      metadataAddress: nft.address.toString(),
    }
  } catch (error) {
    console.error("Error fetching NFT:", error)

    // If in development mode, return mock data
    if (process.env.NODE_ENV === "development") {
      const mockNft = mockNFTs.find((nft) => nft.mint === mint)
      return mockNft || null
    }

    return null
  }
}

// Mock NFT data for development
const mockNFTs: NFT[] = [
  {
    mint: "NFT123456789",
    name: "Dragon Breath Sword",
    symbol: "DBS",
    description: "A legendary sword imbued with dragon's breath.",
    image: "/nft-images/dragon-breath-sword.png",
    attributes: [
      { trait_type: "Rarity", value: "Legendary" },
      { trait_type: "Damage", value: "150" },
      { trait_type: "Element", value: "Fire" },
    ],
    owner: "Test1234567890123456789012345678901234567890",
    collection: {
      name: "Legendary Weapons",
      family: "Goldium Arsenal",
    },
    price: 25,
    listed: true,
  },
  {
    mint: "NFT987654321",
    name: "Ethereal Shield",
    symbol: "ES",
    description: "A mystical shield that protects against arcane attacks.",
    image: "/nft-images/ethereal-shield.png",
    attributes: [
      { trait_type: "Rarity", value: "Epic" },
      { trait_type: "Defense", value: "120" },
      { trait_type: "Element", value: "Arcane" },
    ],
    owner: "Test1234567890123456789012345678901234567890",
    collection: {
      name: "Legendary Weapons",
      family: "Goldium Arsenal",
    },
    price: 18,
    listed: true,
  },
  {
    mint: "NFT456789123",
    name: "Arcane Fireball",
    symbol: "AF",
    description: "A powerful spell that unleashes a ball of arcane fire.",
    image: "/nft-images/arcane-fireball.png",
    attributes: [
      { trait_type: "Rarity", value: "Rare" },
      { trait_type: "Damage", value: "90" },
      { trait_type: "Element", value: "Fire" },
    ],
    owner: "Test1234567890123456789012345678901234567890",
    collection: {
      name: "Magical Spells",
      family: "Goldium Spellbook",
    },
    price: 12,
    listed: false,
  },
]
