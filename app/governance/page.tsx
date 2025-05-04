"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/hooks/use-wallet"
import { WalletConnectOverlay } from "@/components/wallet-connect-overlay"
import DAOVoting from "@/components/governance/dao-voting"

export default function GovernancePage() {
  const { isConnected } = useWallet()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 mt-16 text-center bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">
        Goldium Governance
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card className="border border-amber-200/20 bg-black/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Active Proposals</CardTitle>
              <CardDescription>Vote on current governance proposals</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <DAOVoting />
              {!isConnected && <WalletConnectOverlay />}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border border-amber-200/20 bg-black/60 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="text-xl">Governance Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Total Proposals</p>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Active Proposals</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Your Voting Power</p>
                  <p className="text-2xl font-bold">{isConnected ? "1,250 GOLD" : "Connect Wallet"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Participation Rate</p>
                  <p className="text-2xl font-bold">67.8%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border border-amber-200/20 bg-black/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create Proposal</CardTitle>
          <CardDescription>Submit a new governance proposal</CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-4">
            <p className="text-gray-400">
              To create a new proposal, you need to hold at least 1,000 GOLD tokens. Proposals will be open for voting
              for 7 days.
            </p>
            <button
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-md transition-colors"
              disabled={!isConnected}
            >
              Create New Proposal
            </button>
          </div>
          {!isConnected && <WalletConnectOverlay />}
        </CardContent>
      </Card>
    </div>
  )
}
