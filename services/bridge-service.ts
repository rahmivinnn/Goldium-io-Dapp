// Bridge transaction types
export interface BridgeTransaction {
  id: string
  sourceNetwork: string
  destinationNetwork: string
  sourceToken: string
  destinationToken: string
  amount: string
  fee: string
  status: "pending" | "completed" | "failed"
  timestamp: number
  hash?: string
  destinationHash?: string
}

// Mock bridge transactions
const mockTransactions: BridgeTransaction[] = [
  {
    id: "tx-1",
    sourceNetwork: "ethereum",
    destinationNetwork: "solana",
    sourceToken: "ETH",
    destinationToken: "SOL",
    amount: "0.5",
    fee: "0.0025",
    status: "completed",
    timestamp: Date.now() - 86400000, // 1 day ago
    hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    destinationHash: "5VJQMBTbhUDBXbXWrNkHVg8xvdgNzxHgTrvJeT9rRThLErZD7GJVSqwRxzP3RVYg",
  },
  {
    id: "tx-2",
    sourceNetwork: "solana",
    destinationNetwork: "ethereum",
    sourceToken: "SOL",
    destinationToken: "ETH",
    amount: "10",
    fee: "0.05",
    status: "pending",
    timestamp: Date.now() - 3600000, // 1 hour ago
    hash: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU5XkS5fk5eqRdBbvf9Fes",
  },
]

// Get all bridge transactions for a user
export const getUserBridgeTransactions = async (walletAddress: string): Promise<BridgeTransaction[]> => {
  // In a real app, this would fetch from an API or blockchain
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTransactions)
    }, 1000)
  })
}

// Initiate a bridge transaction
export const initiateBridgeTransaction = async (
  walletAddress: string,
  sourceNetwork: string,
  destinationNetwork: string,
  sourceToken: string,
  destinationToken: string,
  amount: string,
): Promise<BridgeTransaction> => {
  // In a real app, this would interact with a smart contract
  return new Promise((resolve) => {
    setTimeout(() => {
      const fee = (Number.parseFloat(amount) * 0.005).toFixed(4)
      const newTransaction: BridgeTransaction = {
        id: `tx-${Date.now()}`,
        sourceNetwork,
        destinationNetwork,
        sourceToken,
        destinationToken,
        amount,
        fee,
        status: "pending",
        timestamp: Date.now(),
        hash: `0x${Math.random().toString(16).substring(2, 66)}`,
      }

      resolve(newTransaction)
    }, 2000)
  })
}

// Get transaction status
export const getBridgeTransactionStatus = async (
  transactionId: string,
): Promise<"pending" | "completed" | "failed"> => {
  // In a real app, this would check the status on the blockchain
  return new Promise((resolve) => {
    setTimeout(() => {
      const statuses: Array<"pending" | "completed" | "failed"> = ["pending", "completed", "failed"]
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      resolve(randomStatus)
    }, 1000)
  })
}

export const getNetworkInfo = (networkId: string) => {
  // Mock implementation
  return {
    name: networkId,
    chainId: "0x1",
    currency: "ETH",
  }
}

export const getTokenInfo = (tokenId: string) => {
  // Mock implementation
  return {
    name: tokenId,
    symbol: tokenId,
    decimals: 18,
  }
}
