import { Connection, PublicKey } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createTransferInstruction } from "@solana/spl-token"

export interface TokenCA {
  address: string
  symbol: string
  decimals: number
  name: string
}

export interface TokenBalance {
  amount: number
  decimals: number
  uiAmount: number
}

export class TokenCAService {
  private connection: Connection

  constructor(connection: Connection) {
    this.connection = connection
  }

  async getTokenBalance(tokenAddress: string, walletAddress: string): Promise<TokenBalance | null> {
    try {
      const mintPubkey = new PublicKey(tokenAddress)
      const walletPubkey = new PublicKey(walletAddress)
      const tokenAccount = await getAssociatedTokenAddress(mintPubkey, walletPubkey)

      try {
        const balance = await this.connection.getTokenAccountBalance(tokenAccount)
        return {
          amount: Number(balance.value.amount),
          decimals: balance.value.decimals,
          uiAmount: balance.value.uiAmount
        }
      } catch (error) {
        console.error('Error getting token balance:', error)
        return null
      }
    } catch (error) {
      console.error('Error getting token account:', error)
      return null
    }
  }

  async prepareTokenTransfer(
    tokenAddress: string,
    senderPubkey: PublicKey,
    recipientAddress: string,
    amount: number,
    decimals: number
  ) {
    const mintPubkey = new PublicKey(tokenAddress)
    const recipientPubkey = new PublicKey(recipientAddress)

    // Get the associated token accounts
    const senderTokenAccount = await getAssociatedTokenAddress(mintPubkey, senderPubkey)
    const recipientTokenAccount = await getAssociatedTokenAddress(mintPubkey, recipientPubkey)

    const instructions = []

    // Check if recipient token account exists
    try {
      await this.connection.getTokenAccountBalance(recipientTokenAccount)
    } catch {
      // Create associated token account if it doesn't exist
      instructions.push(
        createAssociatedTokenAccountInstruction(
          senderPubkey,
          recipientTokenAccount,
          recipientPubkey,
          mintPubkey
        )
      )
    }

    // Add transfer instruction
    const transferAmount = amount * Math.pow(10, decimals)
    instructions.push(
      createTransferInstruction(
        senderTokenAccount,
        recipientTokenAccount,
        senderPubkey,
        transferAmount,
        [],
        TOKEN_PROGRAM_ID
      )
    )

    return instructions
  }

  async validateTokenCA(tokenAddress: string): Promise<boolean> {
    try {
      const mintInfo = await this.connection.getParsedAccountInfo(
        new PublicKey(tokenAddress)
      )
      return mintInfo.value !== null && mintInfo.value.owner.equals(TOKEN_PROGRAM_ID)
    } catch {
      return false
    }
  }
}