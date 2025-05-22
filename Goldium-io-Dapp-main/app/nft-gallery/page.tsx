"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NFTGallery from "@/components/nft/nft-gallery"
import { WalletConnectOverlay } from "@/components/wallet-connect-overlay"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"

export default function NFTGalleryPage() {
  const { connected } = useSolanaWallet()
  const [activeTab, setActiveTab] = useState("owned")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">
        NFT Gallery
      </h1>

      <Card className="border border-gold/20 bg-black/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-gold">Your NFT Collection</CardTitle>
          <CardDescription className="text-center">View and manage your NFTs</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6 bg-black/50 border border-gold/20">
              <TabsTrigger value="owned" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Owned
              </TabsTrigger>
              <TabsTrigger value="created" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Created
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="owned" className="relative">
              <NFTGallery />
              {!connected && <WalletConnectOverlay />}
            </TabsContent>

            <TabsContent value="created" className="relative">
              <div className="p-8 text-center">
                <p>NFTs you've created will appear here</p>
              </div>
              {!connected && <WalletConnectOverlay />}
            </TabsContent>

            <TabsContent value="activity" className="relative">
              <div className="p-8 text-center">
                <p>Your NFT activity will appear here</p>
              </div>
              {!connected && <WalletConnectOverlay />}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
