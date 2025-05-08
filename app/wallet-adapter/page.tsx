"use client"

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"
import { useMemo } from "react"
import WalletBalanceDisplay from "@/components/wallet-balance-display"

// Remove this import as it might not be available in the build process
// import "@solana/wallet-adapter-react-ui/styles.css"

export const dynamic = "force-dynamic"

export default function WalletAdapterPage() {
  // You can also provide the endpoint through an environment variable
  const endpoint = useMemo(() => clusterApiUrl(WalletAdapterNetwork.Testnet), [])

  // Initialize wallet adapters
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-center text-yellow-500">Wallet Adapter Integration</h1>

            <div className="flex flex-col md:flex-row gap-6 items-center justify-center mb-8">
              <div className="w-full md:w-auto">
                <WalletMultiButton className="!bg-yellow-500 hover:!bg-yellow-600 !text-black font-medium" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Compact display */}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold mb-2">Compact Display</h2>
                <WalletBalanceDisplay compact={true} />
              </div>

              {/* Full display */}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold mb-2">Full Display</h2>
                <WalletBalanceDisplay compact={false} />
              </div>
            </div>

            <div className="mt-8 p-4 bg-gray-900/60 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Implementation Notes</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>This implementation uses the official Solana wallet adapter</li>
                <li>Supports multiple wallet providers (currently configured for Phantom)</li>
                <li>Auto-refreshes balances every 30 seconds</li>
                <li>Provides both compact and full display options</li>
                <li>Shows loading states and last updated timestamp</li>
                <li>Handles connection and error states gracefully</li>
              </ul>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
