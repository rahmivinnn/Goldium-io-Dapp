"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, AlertTriangle } from "lucide-react"

export default function FeatureRoadmap() {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">
        Goldium.io Feature Roadmap
      </h1>

      <Tabs defaultValue="phase1" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="phase1">Phase 1</TabsTrigger>
          <TabsTrigger value="phase2">Phase 2</TabsTrigger>
          <TabsTrigger value="phase3">Phase 3</TabsTrigger>
          <TabsTrigger value="phase4">Phase 4</TabsTrigger>
          <TabsTrigger value="phase5">Phase 5</TabsTrigger>
        </TabsList>

        <TabsContent value="phase1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span>Core Authentication & User Experience</span>
                <Badge className="ml-2 bg-amber-500">In Progress</Badge>
              </CardTitle>
              <CardDescription>Foundational features for user authentication and basic functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Wallet Authentication", status: "complete" },
                  { name: "Dashboard User Interface", status: "complete" },
                  { name: "Balance Token Display", status: "complete" },
                  { name: "NFT Gallery", status: "complete" },
                  { name: "Wallet Address Shortening", status: "complete" },
                  { name: "Network Selector", status: "in-progress" },
                  { name: "Transaction History", status: "in-progress" },
                  { name: "Recent Activity Feed", status: "in-progress" },
                  { name: "Blockchain Explorer Links", status: "in-progress" },
                  { name: "Responsive Mobile Design", status: "in-progress" },
                  { name: "Multi-Wallet Support", status: "planned" },
                  { name: "Hardware Wallet Support", status: "planned" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center p-3 border rounded-md">
                    {feature.status === "complete" ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : feature.status === "in-progress" ? (
                      <Clock className="h-5 w-5 text-amber-500 mr-2" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    <span>{feature.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phase2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span>NFT Ecosystem</span>
                <Badge className="ml-2 bg-blue-500">Coming Soon</Badge>
              </CardTitle>
              <CardDescription>Complete NFT functionality for minting, trading, and management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "NFT Minting", status: "planned" },
                  { name: "NFT Listing to Marketplace", status: "planned" },
                  { name: "NFT Buying/Selling", status: "planned" },
                  { name: "NFT Bidding System", status: "planned" },
                  { name: "NFT Transfer", status: "planned" },
                  { name: "NFT Metadata Viewer", status: "planned" },
                  { name: "Trait Rarity Viewer", status: "planned" },
                  { name: "NFT Leaderboard", status: "planned" },
                  { name: "NFT Burning Mechanism", status: "planned" },
                  { name: "NFT Search Bar", status: "planned" },
                  { name: "Marketplace Filter & Sort", status: "planned" },
                  { name: "Category Tags", status: "planned" },
                  { name: "Price Slider", status: "planned" },
                  { name: "Collection Verification Badge", status: "planned" },
                  { name: "Trending Collections", status: "planned" },
                  { name: "Recently Sold NFTs", status: "planned" },
                  { name: "Offers Received UI", status: "planned" },
                  { name: "Offers Made UI", status: "planned" },
                  { name: "Watchlist (Favorite NFTs)", status: "planned" },
                  { name: "NFT Fractionalization UI", status: "planned" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center p-3 border rounded-md">
                    {feature.status === "complete" ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : feature.status === "in-progress" ? (
                      <Clock className="h-5 w-5 text-amber-500 mr-2" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    <span>{feature.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phase3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span>DeFi & Financial Tools</span>
                <Badge className="ml-2 bg-purple-500">Planned</Badge>
              </CardTitle>
              <CardDescription>Advanced financial features for token management and DeFi integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Staking Token", status: "complete" },
                  { name: "Unstaking Token", status: "complete" },
                  { name: "Claim Reward Staking", status: "complete" },
                  { name: "Token Swap (DEX Integration)", status: "in-progress" },
                  { name: "Liquidity Pool Status", status: "planned" },
                  { name: "Add Liquidity", status: "planned" },
                  { name: "Remove Liquidity", status: "planned" },
                  { name: "Gas Fee Estimator", status: "planned" },
                  { name: "Token Approval Manager", status: "planned" },
                  { name: "Vesting Schedule Viewer", status: "planned" },
                  { name: "Token Unlock Progress", status: "planned" },
                  { name: "Token Distribution Page", status: "planned" },
                  { name: "Launchpad/IDO Participation", status: "planned" },
                  { name: "On-ramp Fiat-to-Crypto", status: "planned" },
                  { name: "Portfolio Viewer", status: "planned" },
                  { name: "Asset Analytics Chart", status: "planned" },
                  { name: "Wallet Net Worth Calculation", status: "planned" },
                  { name: "Cross-chain Bridge Interface", status: "planned" },
                  { name: "Bridge Status Tracker", status: "planned" },
                  { name: "Token Inflation Tracker", status: "planned" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center p-3 border rounded-md">
                    {feature.status === "complete" ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : feature.status === "in-progress" ? (
                      <Clock className="h-5 w-5 text-amber-500 mr-2" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    <span>{feature.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phase4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span>Governance & Community</span>
                <Badge className="ml-2 bg-indigo-500">Future</Badge>
              </CardTitle>
              <CardDescription>DAO governance and community engagement features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "User Profile (with ENS)", status: "planned" },
                  { name: "Avatar NFT Integration", status: "planned" },
                  { name: "Social Login Fallback", status: "planned" },
                  { name: "Notification System", status: "planned" },
                  { name: "DAO Proposal Creation", status: "planned" },
                  { name: "DAO Voting Interface", status: "planned" },
                  { name: "DAO Proposal History", status: "planned" },
                  { name: "Voting Weight Info", status: "planned" },
                  { name: "Airdrop Claim UI", status: "planned" },
                  { name: "Referral Code System", status: "planned" },
                  { name: "Invite-to-earn UI", status: "planned" },
                  { name: "Reward Dashboard", status: "planned" },
                  { name: "Affiliate Tracking", status: "planned" },
                  { name: "Wallet ENS Name Resolver", status: "planned" },
                  { name: "Token-gated Content Unlock", status: "planned" },
                  { name: "Membership Tiers", status: "planned" },
                  { name: "Discord/Twitter Verified Badge", status: "planned" },
                  { name: "Community Event Calendar", status: "planned" },
                  { name: "Voting Result Visualizer", status: "planned" },
                  { name: "Public Leaderboard", status: "planned" },
                  { name: "Chat with Wallet Authentication", status: "planned" },
                  { name: "Identity Verification (Soulbound)", status: "planned" },
                  { name: "Multi-sig Wallet Manager", status: "planned" },
                  { name: "Treasury Dashboard", status: "planned" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center p-3 border rounded-md">
                    {feature.status === "complete" ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : feature.status === "in-progress" ? (
                      <Clock className="h-5 w-5 text-amber-500 mr-2" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    <span>{feature.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phase5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span>Gaming & Advanced Features</span>
                <Badge className="ml-2 bg-green-500">Future</Badge>
              </CardTitle>
              <CardDescription>Gaming integration and advanced technical features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Game Login with Wallet", status: "planned" },
                  { name: "In-game Wallet Sync", status: "planned" },
                  { name: "Inventory Screen for Game Items", status: "planned" },
                  { name: "Game Leaderboard (On-chain)", status: "planned" },
                  { name: "Reward Claim Screen (Play-to-earn)", status: "planned" },
                  { name: "Lootbox Opening Animation", status: "planned" },
                  { name: "Drag & Drop NFT to Stake", status: "planned" },
                  { name: "NFT Fusion/Evolution UI", status: "planned" },
                  { name: "Batch Transaction Signer", status: "planned" },
                  { name: "Batch NFT Sender", status: "planned" },
                  { name: "Token Faucet UI (Testnet)", status: "planned" },
                  { name: "Developer Console for Contract", status: "planned" },
                  { name: "Code Viewer (for Contract)", status: "planned" },
                  { name: "Audit Status Badge", status: "planned" },
                  { name: "Audit Report Viewer", status: "planned" },
                  { name: "In-app Swap Modal", status: "planned" },
                  { name: "Deposit/Withdraw to dApp Vault", status: "planned" },
                  { name: "Carbon Footprint Tracker", status: "planned" },
                  { name: "Real-time Blockchain Data Feed", status: "planned" },
                  { name: "Smart Contract Interaction", status: "planned" },
                  { name: "Signature Request Modal", status: "planned" },
                  { name: "KYC Check Integration", status: "planned" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center p-3 border rounded-md">
                    {feature.status === "complete" ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    ) : feature.status === "in-progress" ? (
                      <Clock className="h-5 w-5 text-amber-500 mr-2" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-gray-400 mr-2" />
                    )}
                    <span>{feature.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-10 p-6 border rounded-lg bg-gradient-to-b from-amber-50 to-yellow-50">
        <h2 className="text-2xl font-bold mb-4">Implementation Strategy</h2>
        <ul className="space-y-2">
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" />
            <span>All existing features will be preserved and enhanced</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" />
            <span>New features will be implemented in a modular fashion to ensure stability</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" />
            <span>Each phase will undergo thorough testing before moving to the next</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" />
            <span>Smart contract integration will be audited for security</span>
          </li>
          <li className="flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" />
            <span>User feedback will be incorporated throughout development</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
