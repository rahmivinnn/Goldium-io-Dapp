import { type Connection, PublicKey } from "@solana/web3.js"
import { NETWORKS } from "@/contexts/network-context"

export type TransactionType = "send" | "receive" | "swap" | "nft" | "stake" | "unknown"

export interface Transaction {
  signature: string
  blockTime: number
  type: TransactionType
  status: "confirmed" | "failed"
  amount?: number
  fee: number
  from: string
  to: string
  description: string
}

// Function to get transaction history
export async function getTransactionHistory(
  connection: Connection,
  walletAddress: string,
  network: "mainnet" | "testnet",
  limit = 10,
  before?: string,
): Promise<Transaction[]> {
  try {
    const publicKey = new PublicKey(walletAddress)

    // Get transaction signatures
    const signatures = await connection.getSignaturesForAddress(publicKey, {
      limit,
      before: before ? new PublicKey(before) : undefined,
    })

    if (signatures.length === 0) {
      return []
    }

    // Get transaction details
    const transactions = await Promise.all(
      signatures.map(async (sig) => {
        try {
          const txDetails = await connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
          })

          if (!txDetails) {
            return null
          }

          // Determine transaction type (simplified)
          let type: TransactionType = "unknown"
          let description = "Unknown transaction"
          let amount: number | undefined = undefined

          // This is a simplified implementation
          // In a real app, you would parse the transaction instructions to determine the type
          if (txDetails.meta?.logMessages?.some((log) => log.includes("Transfer"))) {
            if (txDetails.transaction.message.accountKeys[0].toString() === walletAddress) {
              type = "send"
              description = "Sent SOL"
            } else {
              type = "receive"
              description = "Received SOL"
            }

            // Try to extract amount
            const transferLog = txDetails.meta.logMessages.find((log) => log.includes("Transfer"))
            if (transferLog) {
              const match = transferLog.match(/Transfer: (\d+)/)
              if (match && match[1]) {
                amount = Number.parseInt(match[1]) / 1e9 // Convert lamports to SOL
              }
            }
          } else if (txDetails.meta?.logMessages?.some((log) => log.includes("Swap"))) {
            type = "swap"
            description = "Token swap"
          } else if (txDetails.meta?.logMessages?.some((log) => log.includes("Mint"))) {
            type = "nft"
            description = "NFT transaction"
          } else if (txDetails.meta?.logMessages?.some((log) => log.includes("Stake"))) {
            type = "stake"
            description = "Staking transaction"
          }

          return {
            signature: sig.signature,
            blockTime: sig.blockTime ? sig.blockTime * 1000 : Date.now(), // Convert to milliseconds
            type,
            status: sig.err ? "failed" : "confirmed",
            amount,
            fee: txDetails.meta?.fee ? txDetails.meta.fee / 1e9 : 0, // Convert lamports to SOL
            from: txDetails.transaction.message.accountKeys[0].toString(),
            to: txDetails.transaction.message.accountKeys[1].toString(),
            description,
          }
        } catch (error) {
          console.error("Error fetching transaction details:", error)
          return null
        }
      }),
    )

    return transactions.filter(Boolean) as Transaction[]
  } catch (error) {
    console.error("Error fetching transaction history:", error)
    return []
  }
}

// Function to get transaction explorer URL
export function getTransactionExplorerUrl(signature: string, network: "mainnet" | "testnet"): string {
  const baseUrl = NETWORKS[network].explorerUrl
  return `${baseUrl}/tx/${signature}`
}

// Function to get address explorer URL
export function getAddressExplorerUrl(address: string, network: "mainnet" | "testnet"): string {
  const baseUrl = NETWORKS[network].explorerUrl
  return `${baseUrl}/address/${address}`
}
