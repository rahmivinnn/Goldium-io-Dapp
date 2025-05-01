import { type Connection, PublicKey } from "@solana/web3.js"
import { Metadata, PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"

// Interface for NFT metadata
export interface NFTMetadata {
  mint: string
  name: string
  symbol: string
  uri: string
  sellerFeeBasisPoints: number
  creators: {
    address: string
    verified: boolean
    share: number
  }[]
}

// Interface for NFT data
export interface NFT {
  id: string
  name: string
  description: string
  image: string
  attributes: {
    trait_type: string
    value: string
  }[]
  mint: string
  owner: string
  creator: string
  price?: number
  listed?: boolean
  collection?: string
}

// Get all NFTs owned by a wallet
export async function getNFTsByOwner(connection: Connection, owner: PublicKey): Promise<NFT[]> {
  try {
    // Get all token accounts owned by the wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(owner, {
      programId: TOKEN_PROGRAM_ID,
    })

    // Filter for NFTs (tokens with amount 1)
    const nftAccounts = tokenAccounts.value.filter((account) => {
      const parsedInfo = account.account.data.parsed.info
      return parsedInfo.tokenAmount.uiAmount === 1 && parsedInfo.tokenAmount.decimals === 0
    })

    // Get metadata for each NFT
    const nfts = await Promise.all(
      nftAccounts.map(async (account) => {
        const parsedInfo = account.account.data.parsed.info
        const mint = new PublicKey(parsedInfo.mint)

        try {
          // Get metadata PDA for the mint
          const [metadataPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
            METADATA_PROGRAM_ID,
          )

          // Get metadata account info
          const metadataAccount = await connection.getAccountInfo(metadataPDA)

          if (!metadataAccount) {
            throw new Error("Metadata account not found")
          }

          // Decode metadata
          const metadata = Metadata.deserialize(metadataAccount.data)[0]

          // Fetch JSON metadata from URI
          const response = await fetch(metadata.data.uri)
          const json = await response.json()

          return {
            id: mint.toString(),
            name: metadata.data.name,
            description: json.description || "",
            image: json.image || "",
            attributes: json.attributes || [],
            mint: mint.toString(),
            owner: owner.toString(),
            creator: metadata.data.creators?.[0]?.address || "",
            collection: metadata.collection?.key.toString(),
          }
        } catch (error) {
          console.error(`Error fetching metadata for mint ${parsedInfo.mint}:`, error)
          return null
        }
      }),
    )

    // Filter out nulls from failed metadata fetches
    return nfts.filter(Boolean) as NFT[]
  } catch (error) {
    console.error("Error fetching NFTs:", error)
    throw error
  }
}

// Get NFT by mint address
export async function getNFTByMint(connection: Connection, mint: PublicKey): Promise<NFT | null> {
  try {
    // Get metadata PDA for the mint
    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      METADATA_PROGRAM_ID,
    )

    // Get metadata account info
    const metadataAccount = await connection.getAccountInfo(metadataPDA)

    if (!metadataAccount) {
      throw new Error("Metadata account not found")
    }

    // Decode metadata
    const metadata = Metadata.deserialize(metadataAccount.data)[0]

    // Fetch JSON metadata from URI
    const response = await fetch(metadata.data.uri)
    const json = await response.json()

    // Find the owner (this is simplified - in a real app you'd need to check token accounts)
    // This is a placeholder for demonstration
    const owner = "Unknown" // In a real app, you'd find the actual owner

    return {
      id: mint.toString(),
      name: metadata.data.name,
      description: json.description || "",
      image: json.image || "",
      attributes: json.attributes || [],
      mint: mint.toString(),
      owner: owner,
      creator: metadata.data.creators?.[0]?.address || "",
      collection: metadata.collection?.key.toString(),
    }
  } catch (error) {
    console.error(`Error fetching NFT for mint ${mint.toString()}:`, error)
    return null
  }
}

// For marketplace functionality, we'd need to interact with a marketplace program
// This is a simplified mock implementation
export async function listNFTForSale(
  connection: Connection,
  mint: PublicKey,
  owner: PublicKey,
  price: number,
): Promise<boolean> {
  // In a real implementation, this would create a listing on a marketplace program
  console.log(`Listing NFT ${mint.toString()} for sale at ${price} GOLD`)
  return true
}

export async function buyNFT(
  connection: Connection,
  mint: PublicKey,
  buyer: PublicKey,
  price: number,
): Promise<boolean> {
  // In a real implementation, this would execute a purchase on a marketplace program
  console.log(`Buying NFT ${mint.toString()} for ${price} GOLD`)
  return true
}
