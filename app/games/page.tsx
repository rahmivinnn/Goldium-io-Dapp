"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sword, Coins, Trophy, Users, Clock, CreditCard } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import GoldBalance from "@/components/gold-balance"
import CoinFlipGame from "@/components/games/coin-flip-game"
import CardFlipGame from "@/components/games/card-flip-game"
import CardBattleGame from "@/components/games/card-battle-game"

export default function Games() {
  const { connected } = useWallet()
  const [activeTab, setActiveTab] = useState("battle")

  if (!connected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Connect Your Wallet</h1>
        <p className="text-gray-400 mb-8">Please connect your wallet to access games.</p>
        <ConnectWalletButton className="gold-button" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Games</h1>
          <p className="text-gray-400">Play games to earn GOLD tokens</p>
        </div>
        <GoldBalance compact />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-gold bg-black">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="h-10 w-10 text-gold" />
            </div>
            <h3 className="text-lg font-bold text-center mb-1">Your Rank</h3>
            <div className="text-center text-2xl font-bold text-gold mb-2">#42</div>
            <p className="text-center text-sm text-gray-400">Top 15% of players</p>
          </CardContent>
        </Card>

        <Card className="border-gold bg-black">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <Coins className="h-10 w-10 text-gold" />
            </div>
            <h3 className="text-lg font-bold text-center mb-1">Total Winnings</h3>
            <div className="text-center text-2xl font-bold text-gold mb-2">1,250 GOLD</div>
            <p className="text-center text-sm text-gray-400">Across all games</p>
          </CardContent>
        </Card>

        <Card className="border-gold bg-black">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <Sword className="h-10 w-10 text-gold" />
            </div>
            <h3 className="text-lg font-bold text-center mb-1">Win Rate</h3>
            <div className="text-center text-2xl font-bold text-gold mb-2">62%</div>
            <p className="text-center text-sm text-gray-400">85 wins / 137 games</p>
          </CardContent>
        </Card>

        <Card className="border-gold bg-black">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-10 w-10 text-gold" />
            </div>
            <h3 className="text-lg font-bold text-center mb-1">Online Players</h3>
            <div className="text-center text-2xl font-bold text-gold mb-2">156</div>
            <p className="text-center text-sm text-gray-400">24 in matchmaking</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="battle" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <Sword className="mr-2 h-5 w-5" />
            Card Battle
          </TabsTrigger>
          <TabsTrigger value="coinflip" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <Coins className="mr-2 h-5 w-5" />
            Coin Flip
          </TabsTrigger>
          <TabsTrigger value="cardflip" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            <CreditCard className="mr-2 h-5 w-5" />
            Card Flip
          </TabsTrigger>
        </TabsList>

        <TabsContent value="battle" className="mt-0">
          <Card className="border-gold bg-black">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sword className="mr-2 h-5 w-5 text-gold" />
                Card Battle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardBattleGame />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coinflip" className="mt-0">
          <Card className="border-gold bg-black">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Coins className="mr-2 h-5 w-5 text-gold" />
                Coin Flip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CoinFlipGame />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cardflip" className="mt-0">
          <Card className="border-gold bg-black">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-gold" />
                Card Flip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardFlipGame />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Upcoming Tournaments</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-gold bg-black relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gold text-black px-3 py-1 text-sm font-bold">FEATURED</div>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">Weekend Warrior</h3>
              <p className="text-gray-400 mb-4">Battle against the best players for massive GOLD rewards</p>

              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-gold mr-2" />
                <span>Starts in 1 day 4 hours</span>
              </div>

              <div className="flex items-center mb-4">
                <Coins className="h-5 w-5 text-gold mr-2" />
                <span>Entry: 100 GOLD</span>
              </div>

              <div className="flex items-center mb-4">
                <Trophy className="h-5 w-5 text-gold mr-2" />
                <span>Prize Pool: 5,000 GOLD</span>
              </div>

              <div className="flex items-center mb-6">
                <Users className="h-5 w-5 text-gold mr-2" />
                <span>32 Players Registered</span>
              </div>

              <Button className="gold-button w-full">Register Now</Button>
            </CardContent>
          </Card>

          <Card className="border-gold bg-black">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">Daily Duel</h3>
              <p className="text-gray-400 mb-4">Quick tournament with fast matches and instant rewards</p>

              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-gold mr-2" />
                <span>Starts in 2 hours</span>
              </div>

              <div className="flex items-center mb-4">
                <Coins className="h-5 w-5 text-gold mr-2" />
                <span>Entry: 50 GOLD</span>
              </div>

              <div className="flex items-center mb-4">
                <Trophy className="h-5 w-5 text-gold mr-2" />
                <span>Prize Pool: 1,200 GOLD</span>
              </div>

              <div className="flex items-center mb-6">
                <Users className="h-5 w-5 text-gold mr-2" />
                <span>18 Players Registered</span>
              </div>

              <Button className="gold-button w-full">Register Now</Button>
            </CardContent>
          </Card>

          <Card className="border-gold bg-black">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">Champion's League</h3>
              <p className="text-gray-400 mb-4">Elite tournament for top-ranked players with NFT rewards</p>

              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 text-gold mr-2" />
                <span>Starts in 5 days</span>
              </div>

              <div className="flex items-center mb-4">
                <Coins className="h-5 w-5 text-gold mr-2" />
                <span>Entry: 250 GOLD</span>
              </div>

              <div className="flex items-center mb-4">
                <Trophy className="h-5 w-5 text-gold mr-2" />
                <span>Prize: 10,000 GOLD + NFTs</span>
              </div>

              <div className="flex items-center mb-6">
                <Users className="h-5 w-5 text-gold mr-2" />
                <span>8 Players Registered</span>
              </div>

              <Button className="gold-button w-full">Register Now</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
