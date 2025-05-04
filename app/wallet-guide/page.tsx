"use client"
import { WalletConnectionGuide } from "@/components/wallet-connection-guide"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function WalletGuidePage() {
  const { connect } = useSolanaWallet()

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-yellow-500 hover:text-yellow-400 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-yellow-500 mb-8">Wallet Connection Guide</h1>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Why Connect a Wallet?</h2>
            <p className="text-gray-300 mb-4">Connecting a wallet to Goldium.io allows you to:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
              <li>Access your GOLD and MANA tokens</li>
              <li>Participate in staking and earn rewards</li>
              <li>Trade NFTs in the marketplace</li>
              <li>Play games and earn rewards</li>
              <li>Vote on governance proposals</li>
              <li>Transfer tokens across different blockchains</li>
            </ul>
            <p className="text-gray-300">
              Your wallet is your digital identity in the Goldium ecosystem. It securely stores your private keys and
              allows you to interact with the blockchain.
            </p>
          </div>

          <WalletConnectionGuide onConnect={connect} />

          <div className="mt-8 bg-gray-900/50 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Wallet Security Tips</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Never share your seed phrase or private keys with anyone</li>
              <li>Store your recovery phrase in a secure, offline location</li>
              <li>Be cautious of phishing attempts and only connect to trusted sites</li>
              <li>Consider using a hardware wallet for large holdings</li>
              <li>Always verify transaction details before confirming</li>
              <li>Disconnect your wallet when not using the site</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
