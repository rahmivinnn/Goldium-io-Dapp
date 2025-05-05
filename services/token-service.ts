import { type Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { getAccount, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import {
  NETWORKS,
  type NetworkType,
  GOLD_TOKEN_METADATA,
  SOL_TOKEN_METADATA,
  MANA_TOKEN_METADATA,
} from "@/config/network-config"

export interface TokenInfo {
  address: string
  symbol: string
  name: string
  decimals: number
  logoURI: string
  balance?: number
}

// Improved SOL balance fetching with better error handling and debugging
export const getSOLBalance = async (connection: Connection, walletAddress: string): Promise<number> => {
  try {
    console.log(`[getSOLBalance] Fetching for address: ${walletAddress}`)

    if (!walletAddress || !connection) {
      console.error("[getSOLBalance] Invalid wallet address or connection")
      return 0
    }

    // Create a PublicKey from the wallet address
    const publicKey = new PublicKey(walletAddress)

    // Get the balance with explicit commitment level for better reliability
    const balance = await connection.getBalance(publicKey, "confirmed")
    console.log(`[getSOLBalance] Raw balance in lamports: ${balance}`)

    // Convert lamports to SOL
    const solBalance = balance / LAMPORTS_PER_SOL
    console.log(`[getSOLBalance] Converted SOL balance: ${solBalance}`)

    return solBalance
  } catch (error) {
    console.error("[getSOLBalance] Error:", error)
    // Return 0 on error
    return 0
  }
}

// Improved GOLD balance fetching with better error handling and debugging
export const getGOLDBalance = async (
  connection: Connection,
  walletAddress: string,
  network: NetworkType,
): Promise<number> => {
  try {
    console.log(`[getGOLDBalance] Fetching for address: ${walletAddress} on network: ${network}`)

    if (!walletAddress || !connection) {
      console.error("[getGOLDBalance] Invalid wallet address or connection")
      return 0
    }

    const publicKey = new PublicKey(walletAddress)
    const tokenMintAddress = NETWORKS[network].goldTokenAddress
    console.log(`[getGOLDBalance] Token mint address: ${tokenMintAddress}`)

    if (!tokenMintAddress) {
      console.error("[getGOLDBalance] Token mint address not found for network:", network)
      return 0
    }

    const tokenAddress = new PublicKey(tokenMintAddress)

    // Get the associated token account address
    const associatedTokenAddress = await getAssociatedTokenAddress(tokenAddress, publicKey)
    console.log(`[getGOLDBalance] Associated token address: ${associatedTokenAddress.toString()}`)

    try {
      // Try to get the token account
      const tokenAccount = await getAccount(connection, associatedTokenAddress)
      console.log(`[getGOLDBalance] Token account found, raw amount: ${tokenAccount.amount.toString()}`)

      // Convert from raw balance to decimal balance
      const balance = Number(tokenAccount.amount) / Math.pow(10, GOLD_TOKEN_METADATA.decimals)
      console.log(`[getGOLDBalance] Converted balance: ${balance}`)
      return balance
    } catch (error) {
      // If the account doesn't exist or there's an error, try to find it another way
      console.log("[getGOLDBalance] Token account not found via getAccount, trying alternative method")

      try {
        // Try to find all token accounts owned by this wallet
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID })

        console.log(`[getGOLDBalance] Found ${tokenAccounts.value.length} token accounts`)

        // Look for the GOLD token account
        for (const accountInfo of tokenAccounts.value) {
          const parsedInfo = accountInfo.account.data.parsed.info
          const mintAddress = parsedInfo.mint

          if (mintAddress === tokenMintAddress) {
            const amount = parsedInfo.tokenAmount.uiAmount
            console.log(`[getGOLDBalance] Found GOLD token account with balance: ${amount}`)
            return amount
          }
        }

        console.log("[getGOLDBalance] No GOLD token account found in wallet")
        return 0
      } catch (err) {
        console.error("[getGOLDBalance] Error finding token accounts:", err)
        return 0
      }
    }
  } catch (error) {
    console.error("[getGOLDBalance] Error:", error)
    return 0
  }
}

// Get token balance for a specific mint
export async function getTokenBalance(
  connection: Connection,
  walletAddress: PublicKey,
  mintAddress: PublicKey,
): Promise<number> {
  try {
    // Find token accounts for this wallet
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {
      programId: TOKEN_PROGRAM_ID,
    })

    // Find the token account for the specific mint
    const tokenAccount = tokenAccounts.value.find(
      (account) => account.account.data.parsed.info.mint === mintAddress.toString(),
    )

    if (tokenAccount) {
      const amount = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount
      return amount
    }

    return 0
  } catch (error) {
    console.error("Error getting token balance:", error)
    return 0
  }
}

// Get all token balances for a wallet
export async function getAllTokenBalances(
  connection: Connection,
  walletAddress: PublicKey,
): Promise<{ mint: string; balance: number }[]> {
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletAddress, {
      programId: TOKEN_PROGRAM_ID,
    })

    return tokenAccounts.value.map((account) => {
      const { mint, tokenAmount } = account.account.data.parsed.info
      return {
        mint,
        balance: tokenAmount.uiAmount,
      }
    })
  } catch (error) {
    console.error("Error getting all token balances:", error)
    return []
  }
}

// Rest of the file remains the same...
export const getTokenInfo = (network: NetworkType): { SOL: TokenInfo; GOLD: TokenInfo; MANA: TokenInfo } => {
  return {
    SOL: {
      address: "native",
      ...SOL_TOKEN_METADATA,
    },
    GOLD: {
      address: NETWORKS[network].goldTokenAddress,
      ...GOLD_TOKEN_METADATA,
    },
    MANA: {
      address: NETWORKS[network].manaTokenAddress,
      ...MANA_TOKEN_METADATA,
    },
  }
}

// Add this function after the getTokenInfo function:
export const getTokenSupplyInfo = (
  token: string,
): {
  totalSupply: number
  circulating: number
  burned: number
  distribution: {
    community: number
    team: number
    investors: number
    ecosystem: number
    reserve: number
  }
} => {
  if (token === "GOLD") {
    // Get burned tokens from localStorage or API in a real app
    const burnedAmount = getBurnedTokensAmount(token)

    return {
      totalSupply: 1000000, // 1 million total supply
      circulating: 750000 - burnedAmount, // 75% in circulation minus burned tokens
      burned: burnedAmount,
      distribution: {
        community: 500000, // 50%
        team: 150000, // 15%
        investors: 200000, // 20%
        ecosystem: 100000, // 10%
        reserve: 50000, // 5%
      },
    }
  }

  // Default empty response for other tokens
  return {
    totalSupply: 0,
    circulating: 0,
    burned: 0,
    distribution: {
      community: 0,
      team: 0,
      investors: 0,
      ecosystem: 0,
      reserve: 0,
    },
  }
}

// Function to create a token account if it doesn't exist
export const createTokenAccountIfNeeded = async (
  connection: Connection,
  walletPublicKey: PublicKey,
  tokenMintAddress: string,
): Promise<string> => {
  try {
    // This is a simplified version. In a real app, you would:
    // 1. Check if token account exists
    // 2. If not, create it using createAssociatedTokenAccountInstruction
    // 3. Return the token account address

    // For now, we'll just return a placeholder
    return "Token account would be created here"
  } catch (error) {
    console.error("Error creating token account:", error)
    throw error
  }
}

// Mock staking data - in a real app, this would interact with a staking program
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

// Swap function - in a real app, this would interact with a DEX
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
    rate = 1000 // 1 SOL = 1000 GOLD (adjusted for 1M supply)
  } else if (fromToken === "GOLD" && toToken === "SOL") {
    rate = 0.001 // 1000 GOLD = 1 SOL
  }

  // Calculate estimated amount
  const rawAmount = amount * rate

  // Calculate fee (0.3%)
  const fee = rawAmount * 0.003

  // Calculate price impact based on amount
  // In a real DEX, this would be calculated based on liquidity pool reserves
  let priceImpact = 0
  if (amount > 10) {
    priceImpact = 0.5 // 0.5% for amounts > 10
  }
  if (amount > 100) {
    priceImpact = 1.2 // 1.2% for amounts > 100
  }
  if (amount > 1000) {
    priceImpact = 3.5 // 3.5% for amounts > 1000
  }

  return {
    estimatedAmount: rawAmount - fee,
    fee,
    priceImpact,
  }
}

// Get swap price
export const getSwapPrice = (fromToken: string, toToken: string): number => {
  if (fromToken === "SOL" && toToken === "GOLD") {
    return 1000 // 1 SOL = 1000 GOLD
  } else if (fromToken === "GOLD" && toToken === "SOL") {
    return 0.001 // 1 GOLD = 0.001 SOL
  }
  return 1 // Default 1:1 for same token
}

// Get liquidity pool info
export const getLiquidityPoolInfo = async (
  connection: Connection,
  network: NetworkType,
): Promise<{
  solReserve: number
  goldReserve: number
  totalLiquidity: number
  userLiquidity: number
  apr: number
}> => {
  // In a real implementation, this would fetch data from the liquidity pool contract
  return {
    solReserve: 100,
    goldReserve: 100000, // Adjusted for 1M supply
    totalLiquidity: 200000, // Adjusted for 1M supply
    userLiquidity: 0,
    apr: 12.5,
  }
}

// Get burned tokens
export const getBurnedTokens = async (
  network: NetworkType,
): Promise<{
  total: number
  recent: { amount: number; date: string; txSignature: string }[]
}> => {
  // In a real implementation, this would fetch data from the blockchain or a database
  // For now, we'll use mock data
  try {
    // Try to get from localStorage if available
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem(`burnedTokens_${network}`)
      if (storedData) {
        return JSON.parse(storedData)
      }
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error)
  }

  // Default mock data
  return {
    total: 25000, // 2.5% of total supply
    recent: [
      {
        amount: 5000,
        date: "2023-04-15 14:32",
        txSignature: "5xGZsNVHbcJKPJALmDzsYtCKVXGBQMUyGJvuMsvBbEPmAb2KT7J2RPrKu1LwSUcQY",
      },
      {
        amount: 3500,
        date: "2023-04-10 09:15",
        txSignature: "3tGZsNVHbcJKPJALmDzsYtCKVXGBQMUyGJvuMsvBbEPmAb2KT7J2RPrKu1LwSUcQY",
      },
      {
        amount: 7500,
        date: "2023-04-05 18:45",
        txSignature: "2xGZsNVHbcJKPJALmDzsYtCKVXGBQMUyGJvuMsvBbEPmAb2KT7J2RPrKu1LwSUcQY",
      },
    ],
  }
}

// Record a new burn event
export const recordBurnEvent = async (network: NetworkType, amount: number, txSignature: string): Promise<void> => {
  try {
    // In a real implementation, this would be recorded on the blockchain or in a database
    // For now, we'll update our mock data in localStorage if available
    if (typeof window !== "undefined") {
      const currentData = await getBurnedTokens(network)

      const newData = {
        total: currentData.total + amount,
        recent: [
          {
            amount,
            date: new Date().toLocaleString(),
            txSignature,
          },
          ...currentData.recent,
        ].slice(0, 10), // Keep only the 10 most recent burns
      }

      localStorage.setItem(`burnedTokens_${network}`, JSON.stringify(newData))
    }
  } catch (error) {
    console.error("Error recording burn event:", error)
  }
}

// Get burn statistics
export const getBurnStatistics = async (
  network: NetworkType,
): Promise<{
  totalBurned: number
  burnRate: {
    daily: number
    weekly: number
    monthly: number
  }
  largestBurn: {
    amount: number
    date: string
    txSignature: string
  }
  topBurners: {
    address: string
    amount: number
  }[]
  burnHistory: {
    date: string
    amount: number
  }[]
}> => {
  // In a real implementation, this would fetch data from the blockchain or a database
  // For now, we'll use mock data
  const burnedData = await getBurnedTokens(network)

  return {
    totalBurned: burnedData.total,
    burnRate: {
      daily: 250,
      weekly: 1750,
      monthly: 7500,
    },
    largestBurn: burnedData.recent[0] || {
      amount: 0,
      date: "",
      txSignature: "",
    },
    topBurners: [
      {
        address: "8xGZsNVHbcJKPJALmDzsYtCKVXGBQMUyGJvu",
        amount: 12500,
      },
      {
        address: "5tGZsNVHbcJKPJALmDzsYtCKVXGBQMUyGJvu",
        amount: 7500,
      },
      {
        address: "3xGZsNVHbcJKPJALmDzsYtCKVXGBQMUyGJvu",
        amount: 3500,
      },
      {
        address: "2tGZsNVHbcJKPJALmDzsYtCKVXGBQMUyGJvu",
        amount: 1500,
      },
    ],
    burnHistory: Array.from({ length: 30 }, (_, i) => {
      // Generate some random data for the burn history
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return {
        date: date.toLocaleDateString(),
        amount: Math.floor(Math.random() * 500) + (i > 25 ? 200 : 50), // Higher amounts for recent days
      }
    }),
  }
}

// Helper function to get the total amount of burned tokens
const getBurnedTokensAmount = (token: string): number => {
  if (token !== "GOLD") return 0

  try {
    // Try to get from localStorage if available
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem(`burnedTokens_mainnet`)
      if (storedData) {
        const data = JSON.parse(storedData)
        return data.total || 25000
      }
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error)
  }

  return 25000 // Default value if not found
}
