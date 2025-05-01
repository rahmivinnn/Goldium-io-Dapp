import { type Connection, PublicKey } from "@solana/web3.js"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"

export type TransactionType = "all" | "send" | "receive" | "swap" | "nft" | "stake"

export interface TransactionItem {
  signature: string
  blockTime: number
  type: TransactionType
  status: "confirmed" | "failed"
  amount?: number
  fee: number
  from?: string
  to?: string
  tokenSymbol?: string
  programId?: string
  description?: string
}

export async function getTransactionHistory(
  connection: Connection,
  walletAddress: string,
  limit = 20,
  before?: string,
): Promise<TransactionItem[]> {
  try {
    const publicKey = new PublicKey(walletAddress)

    // Fetch signatures
    const signatures = await connection.getSignaturesForAddress(
      publicKey,
      { limit, before: before ? before : undefined },
      "confirmed",
    )

    if (!signatures.length) return []

    // Fetch transaction details
    const transactions = await Promise.all(
      signatures.map(async (sig) => {
        try {
          const tx = await connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
          })

          if (!tx) return null

          // Determine transaction type
          let type: TransactionType = "all"
          let amount = 0
          const tokenSymbol = "SOL"
          let from = ""
          let to = ""
          let description = ""

          // Check if this is a SOL transfer
          if (tx.meta && tx.transaction.message.instructions.length > 0) {
            const instruction = tx.transaction.message.instructions[0]

            // Check program ID to determine type
            const programId = tx.transaction.message.accountKeys[instruction.programId].toString()

            // System program = SOL transfers
            if (programId === "11111111111111111111111111111111") {
              // Check if wallet is sender or receiver
              const accounts = instruction.accounts.map((idx) => tx.transaction.message.accountKeys[idx].toString())

              if (accounts[0] === walletAddress) {
                type = "send"
                from = walletAddress
                to = accounts[1]

                // Calculate amount from pre/post balances
                if (tx.meta.preBalances[0] && tx.meta.postBalances[0]) {
                  amount = (tx.meta.preBalances[0] - tx.meta.postBalances[0]) / LAMPORTS_PER_SOL
                  // Subtract fee from amount
                  amount -= tx.meta.fee / LAMPORTS_PER_SOL
                }

                description = `Sent ${amount} SOL to ${to.slice(0, 4)}...${to.slice(-4)}`
              } else if (accounts[1] === walletAddress) {
                type = "receive"
                from = accounts[0]
                to = walletAddress

                // Calculate amount from pre/post balances
                if (tx.meta.preBalances[1] && tx.meta.postBalances[1]) {
                  amount = (tx.meta.postBalances[1] - tx.meta.preBalances[1]) / LAMPORTS_PER_SOL
                }

                description = `Received ${amount} SOL from ${from.slice(0, 4)}...${from.slice(-4)}`
              }
            }
            // Token Program = SPL token transfers
            else if (programId === "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA") {
              // This would require more complex parsing for token transfers
              type = "swap"
              description = "Token swap transaction"
            }
            // Metaplex = NFT transactions
            else if (programId.startsWith("metaqbxxUerdq")) {
              type = "nft"
              description = "NFT transaction"
            }
            // Stake program
            else if (programId === "Stake11111111111111111111111111111111111111") {
              type = "stake"
              description = "Staking transaction"
            }
          }

          return {
            signature: sig.signature,
            blockTime: sig.blockTime || 0,
            type,
            status: sig.err ? "failed" : "confirmed",
            amount,
            fee: tx.meta ? tx.meta.fee / LAMPORTS_PER_SOL : 0,
            from,
            to,
            tokenSymbol,
            programId: tx.transaction.message.instructions[0]?.programId.toString(),
            description,
          }
        } catch (error) {
          console.error(`Error fetching transaction ${sig.signature}:`, error)
          return null
        }
      }),
    )

    return transactions.filter(Boolean) as TransactionItem[]
  } catch (error) {
    console.error("Error fetching transaction history:", error)
    return []
  }
}

export function getExplorerUrl(
  signature: string,
  cluster: "mainnet-beta" | "devnet" | "testnet" = "mainnet-beta",
): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`
}
