import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CoinFlipGame from "@/components/games/coin-flip-game"
import CardFlipGame from "@/components/games/card-flip-game"
import CardBattleGame from "@/components/games/card-battle-game"
import FloatingParticles from "@/components/floating-particles"
import { Orbitron } from "next/font/google"

const orbitron = Orbitron({ subsets: ["latin"] })

export default function GamesPage() {
  return (
    <div className="min-h-screen pt-20 relative">
      <FloatingParticles count={40} speed={0.7} />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1
            className={`text-4xl md:text-5xl font-bold mt-32 mb-10 text-center ${orbitron.className} tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600`}
          >
            Goldium Games
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Play, compete, and earn GOLD tokens with our exciting blockchain-powered games
          </p>
        </div>

        <Tabs defaultValue="coinflip" className="w-full">
          <TabsList className="grid grid-cols-3 max-w-2xl mx-auto mb-8">
            <TabsTrigger value="coinflip" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Coin Flip
            </TabsTrigger>
            <TabsTrigger value="cardflip" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Card Flip
            </TabsTrigger>
            <TabsTrigger value="cardbattle" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Card Battle
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coinflip" className="mt-0">
            <Card className="border-gold bg-slate-900/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <Suspense fallback={<div>Loading game...</div>}>
                  <CoinFlipGame />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cardflip" className="mt-0">
            <Card className="border-gold bg-slate-900/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <Suspense fallback={<div>Loading game...</div>}>
                  <CardFlipGame />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cardbattle" className="mt-0">
            <Card className="border-gold bg-slate-900/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <Suspense fallback={<div>Loading game...</div>}>
                  <CardBattleGame />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6 gold-gradient">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: "Gold Rush",
                description: "Mine for digital gold in this exciting strategy game",
                comingSoon: "Q3 2023",
              },
              {
                title: "Token Trader",
                description: "Test your trading skills in a simulated market",
                comingSoon: "Q4 2023",
              },
              {
                title: "NFT Arena",
                description: "Battle with your NFTs in the ultimate showdown",
                comingSoon: "Q1 2024",
              },
            ].map((game, index) => (
              <Card key={index} className="border-gold/30 bg-slate-900/60 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">{game.title}</h3>
                  <p className="text-gray-400 mb-4">{game.description}</p>
                  <div className="inline-block px-3 py-1 rounded-full bg-gold/20 text-gold text-sm">
                    Coming {game.comingSoon}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
