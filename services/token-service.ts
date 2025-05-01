import { type Connection, PublicKey } from "@solana/web3.js"
import { NETWORKS, type NetworkType, GOLD_TOKEN_METADATA, SOL_TOKEN_METADATA } from "@/config/network-config"

export interface TokenInfo {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI: string
  balance?: number
}

export const getSOLBalance = async (connection: Connection, walletAddress: string): Promise<number> => {
  try {
    const publicKey = new PublicKey(walletAddress)
    const balance = await connection.getBalance(publicKey)
    return balance / 10 ** SOL_TOKEN_METADATA.decimals
  } catch (error) {
    console.error("Error fetching SOL balance:", error)
    return 0
  }
}

export const getGOLDBalance = async (
  connection: Connection,
  walletAddress: string,
  network: NetworkType,
): Promise<number> => {
  try {
    // In a real implementation, you would use the SPL Token program to get the token balance
    // This is a simplified mock implementation
    const publicKey = new PublicKey(walletAddress)
    const tokenAddress = new PublicKey(NETWORKS[network].goldTokenAddress)

    // Mock balance for demo purposes
    // In production, you would use getTokenAccountsByOwner and deserialize the data
    return network === "mainnet" ? 1000 : 5000
  } catch (error) {
    console.error("Error fetching GOLD balance:", error)
    return 0
  }
}

export const getTokenInfo = (network: NetworkType): { SOL: TokenInfo; GOLD: TokenInfo } => {
  return {
    SOL: {
      address: "native",
      ...SOL_TOKEN_METADATA,
    },
    GOLD: {
      address: NETWORKS[network].goldTokenAddress,
      ...GOLD_TOKEN_METADATA,
    },
  }
}

// Mock staking data
export const getStakingInfo = async (
  walletAddress: string,
  network: NetworkType,
): Promise<{
  stakedAmount: number
  estimatedYield: number
  rewardRate: number
  lockPeriod: number
}> => {
  // In a real implementation, you would fetch this data from a smart contract
  return {
    stakedAmount: network === "mainnet" ? 500 : 2500,
    estimatedYield: network === "mainnet" ? 50 : 250,
    rewardRate: 0.1, // 10% APY
    lockPeriod: 30, // 30 days
  }
}

// Mock swap function
export const estimateSwap = (
  fromToken: string,
  toToken: string,
  amount: number,
): {
  estimatedAmount: number
  fee: number
  priceImpact: number
} => {
  let rate = 0

  if (fromToken === "SOL" && toToken === "GOLD") {
    rate = 100 // 1 SOL = 100 GOLD
  } else if (fromToken === "GOLD" && toToken === "SOL") {
    rate = 0.01 // 100 GOLD = 1 SOL
  }

  const estimatedAmount = amount * rate
  const fee = estimatedAmount * 0.003 // 0.3% fee

  return {
    estimatedAmount: estimatedAmount - fee,
    fee,
    priceImpact: 0.1, // 0.1% price impact
  }
}
