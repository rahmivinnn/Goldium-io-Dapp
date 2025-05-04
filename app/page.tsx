"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import LiveStats from "@/components/live-stats"
import FeaturedNFTs from "@/components/featured-nfts"
import GameShowcase from "@/components/game-showcase"
import EventsPreview from "@/components/events-preview"
import { Trophy, Coins, Sword, ShoppingBag } from "lucide-react"
import FloatingParticles from "@/components/floating-particles"
import { ScrollAnimation, ScrollStaggerContainer, ScrollStaggerItem } from "@/components/ui/scroll-animation"
import { ScrollReveal, GoldReveal } from "@/components/ui/scroll-reveal"
import { ParallaxScroll } from "@/components/ui/parallax-scroll"
import { TokenContractCard } from "@/components/token-contract-card"
import { useNetwork } from "@/contexts/network-context"
import { TokenDistributionChart } from "@/components/token-distribution-chart"
import TwitterEmbed from "@/components/twitter-embed"
import { useEffect } from "react"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"

export default function Home() {
  const { goldTokenAddress } = useNetwork()
  const { walletAddress, connected } = useSolanaWallet()

  // Log untuk debugging
  useEffect(() => {
    console.log("Home page render:", { connected, walletAddress, goldTokenAddress })
  }, [connected, walletAddress, goldTokenAddress])

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="hero-section min-h-[80vh] flex items-center justify-center relative">
        <FloatingParticles count={50} speed={0.8} />
        <div className="container mx-auto px-4 py-20 relative z-10 text-center">
          <ScrollAnimation type="fade" duration={0.8}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 gold-gradient">
              Experience the Future of
              <br />
              Decentralized Finance
            </h1>
          </ScrollAnimation>

          <ScrollAnimation type="slide-up" delay={0.3} duration={0.8}>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-gray-300">
              Join Goldium.io for NFT trading, staking, and seamless crypto payments powered by GOLD token.
            </p>
          </ScrollAnimation>

          <ScrollAnimation type="slide-up" delay={0.5} duration={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ConnectWalletButton className="gold-button text-lg py-3 px-8" />

              {/* Contract Address Button - Using TokenContractCard in compact mode */}
              <TokenContractCard compact className="text-lg py-3 px-8" />
            </div>
          </ScrollAnimation>

          <ScrollAnimation type="fade" delay={0.8} duration={1}>
            <div className="mt-12">
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-gold"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-2">RATED 5 STARS BY USERS</p>
            </div>
          </ScrollAnimation>

          {/* Full Contract Address Display - Using TokenContractCard */}
          <ScrollAnimation type="fade" delay={1} duration={1}>
            <div className="mt-8 flex flex-col items-center">
              <TokenContractCard className="max-w-full" />
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-black relative">
        <FloatingParticles count={30} speed={0.6} />
        <div className="container mx-auto px-4">
          <GoldReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gold-gradient">
              Follow Our Latest Updates
            </h2>
          </GoldReveal>
          <div className="flex justify-center">
            <ScrollAnimation type="slide-up">
              <TwitterEmbed />
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Rest of the page content remains unchanged */}
      {/* Live Stats Section */}
      <section className="py-16 bg-gradient-to-b from-slate-900/80 to-slate-800/80 backdrop-blur-sm relative">
        <FloatingParticles count={20} speed={0.5} />
        <div className="container mx-auto px-4">
          <GoldReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gold-gradient">Live Ecosystem Stats</h2>
          </GoldReveal>
          <ScrollAnimation type="slide-up" delay={0.2}>
            <LiveStats />
          </ScrollAnimation>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-900/60 backdrop-blur-sm relative">
        <FloatingParticles count={30} speed={0.6} />
        <div className="container mx-auto px-4">
          <GoldReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gold-gradient">
              Explore the Goldium Ecosystem
            </h2>
          </GoldReveal>

          <ScrollAnimation type="slide-up">
            <Tabs defaultValue="nfts" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="nfts" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  NFTs
                </TabsTrigger>
                <TabsTrigger value="staking" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  <Coins className="mr-2 h-5 w-5" />
                  Staking
                </TabsTrigger>
                <TabsTrigger value="games" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  <Sword className="mr-2 h-5 w-5" />
                  Games
                </TabsTrigger>
                <TabsTrigger value="leaderboard" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                  <Trophy className="mr-2 h-5 w-5" />
                  Leaderboard
                </TabsTrigger>
              </TabsList>

              <TabsContent value="nfts" className="mt-0">
                <Card className="border-gold bg-slate-900/80 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <FeaturedNFTs />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="staking" className="mt-0">
                <Card className="border-gold bg-slate-900/80 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <ScrollStaggerContainer staggerDelay={0.15}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ScrollStaggerItem type="slide-up">
                          <div className="black-gold-card">
                            <h3 className="text-xl font-bold mb-4">Flexible Staking</h3>
                            <p className="text-gray-300 mb-4">
                              Stake your GOLD tokens with no lock-up period. Withdraw anytime.
                            </p>
                            <div className="text-gold text-2xl font-bold mb-2">4.5% APR</div>
                            <Button className="gold-button w-full">Stake Now</Button>
                          </div>
                        </ScrollStaggerItem>

                        <ScrollStaggerItem type="slide-up">
                          <div className="black-gold-card relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-gold text-black px-2 py-1 text-xs font-bold">
                              POPULAR
                            </div>
                            <h3 className="text-xl font-bold mb-4">30-Day Lock</h3>
                            <p className="text-gray-300 mb-4">Lock your GOLD tokens for 30 days for higher returns.</p>
                            <div className="text-gold text-2xl font-bold mb-2">8.2% APR</div>
                            <Button className="gold-button w-full">Stake Now</Button>
                          </div>
                        </ScrollStaggerItem>

                        <ScrollStaggerItem type="slide-up">
                          <div className="black-gold-card">
                            <h3 className="text-xl font-bold mb-4">90-Day Lock</h3>
                            <p className="text-gray-300 mb-4">Maximum returns with a 90-day commitment period.</p>
                            <div className="text-gold text-2xl font-bold mb-2">12.5% APR</div>
                            <Button className="gold-button w-full">Stake Now</Button>
                          </div>
                        </ScrollStaggerItem>
                      </div>
                    </ScrollStaggerContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="games" className="mt-0">
                <Card className="border-gold bg-slate-900/80 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <GameShowcase />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="leaderboard" className="mt-0">
                <Card className="border-gold bg-slate-900/80 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <ScrollReveal>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gold/30">
                              <th className="px-4 py-3 text-left">Rank</th>
                              <th className="px-4 py-3 text-left">Player</th>
                              <th className="px-4 py-3 text-right">Wins</th>
                              <th className="px-4 py-3 text-right">GOLD Earned</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { rank: 1, player: "GoldenKnight", wins: 142, gold: 18750 },
                              { rank: 2, player: "CryptoWizard", wins: 136, gold: 15420 },
                              { rank: 3, player: "TokenMaster", wins: 129, gold: 14280 },
                              { rank: 4, player: "NFTHunter", wins: 118, gold: 12950 },
                              { rank: 5, player: "BlockchainBaron", wins: 105, gold: 11340 },
                            ].map((item) => (
                              <tr key={item.rank} className="border-b border-gold/10 hover:bg-gold/5">
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    <span
                                      className={`text-lg font-bold ${item.rank <= 3 ? "text-gold" : "text-gray-400"}`}
                                    >
                                      #{item.rank}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gold/20 mr-3"></div>
                                    <span>{item.player}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-right">{item.wins}</td>
                                <td className="px-4 py-3 text-right font-bold text-gold">
                                  {item.gold.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4 text-center">
                        <Button variant="outline" className="border-gold text-gold hover:bg-gold/10">
                          View Full Leaderboard
                        </Button>
                      </div>
                    </ScrollReveal>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </ScrollAnimation>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-sm relative">
        <FloatingParticles count={25} speed={0.7} />
        <div className="container mx-auto px-4">
          <GoldReveal>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center gold-gradient">Upcoming Events</h2>
          </GoldReveal>
          <ScrollAnimation type="slide-up">
            <EventsPreview />
          </ScrollAnimation>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900/60 backdrop-blur-sm relative overflow-hidden">
        <ParallaxScroll speed={0.2} direction="up">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-transparent"></div>
          </div>
        </ParallaxScroll>
        <FloatingParticles count={40} speed={0.9} />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <GoldReveal>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 gold-gradient">Ready to Join the Gold Rush?</h2>
            </GoldReveal>
            <ScrollAnimation type="slide-up" delay={0.3}>
              <p className="text-lg text-gray-300 mb-8">
                Connect your wallet now and start earning GOLD tokens through staking, gaming, and trading NFTs.
              </p>
            </ScrollAnimation>
            <ScrollAnimation type="slide-up" delay={0.5}>
              <ConnectWalletButton className="gold-button text-lg py-3 px-8" />
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gold-500">Token Economics</h2>
          <TokenDistributionChart />
        </div>
      </section>
    </div>
  )
}
