"use client"

import { TokenBurn } from "@/components/defi/token-burn"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { BurnStatistics } from "@/components/defi/burn-statistics"

export default function BurnPage() {
  const { connected } = useSolanaWallet()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 gold-gradient">Token Burning</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {!connected ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Card className="border-gold bg-slate-900/80 backdrop-blur-sm w-full max-w-md">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Connect Your Wallet</CardTitle>
                  <CardDescription className="text-center">Connect your wallet to burn tokens</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ConnectWalletButton className="gold-button" />
                </CardContent>
              </Card>
            </div>
          ) : (
            <TokenBurn />
          )}
        </div>

        <div>
          <BurnStatistics />
        </div>
      </div>
    </div>
  )
}
