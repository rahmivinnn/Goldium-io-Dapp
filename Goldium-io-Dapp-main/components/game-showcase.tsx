"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sword, Coins, CreditCard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ScrollStaggerContainer, ScrollStaggerItem } from "@/components/ui/scroll-animation"

export default function GameShowcase() {
  return (
    <div className="space-y-6">
      <ScrollStaggerContainer staggerDelay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScrollStaggerItem type="slide-up">
            <Card className="border-gold bg-black hover:gold-glow transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative h-40">
                  <Image
                    src="/placeholder.svg?key=p7ef6"
                    alt="Card Battle"
                    fill
                    className="object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex items-center">
                    <Sword className="h-6 w-6 text-gold mr-2" />
                    <h3 className="text-xl font-bold text-white">Card Battle</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-400 mb-4">
                    Strategic card battle game where you build your deck and battle other players for GOLD rewards.
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Coins className="h-4 w-4 text-gold mr-1" />
                      <span>Entry: 50 GOLD</span>
                    </div>
                    <div className="text-green-500 font-medium">Win up to 100 GOLD</div>
                  </div>
                  <Link href="/games?tab=battle">
                    <Button className="gold-button w-full">Play Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </ScrollStaggerItem>

          <ScrollStaggerItem type="slide-up">
            <Card className="border-gold bg-black hover:gold-glow transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative h-40">
                  <Image src="/placeholder.svg?key=e6k4a" alt="Coin Flip" fill className="object-cover rounded-t-lg" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex items-center">
                    <Coins className="h-6 w-6 text-gold mr-2" />
                    <h3 className="text-xl font-bold text-white">Coin Flip</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-400 mb-4">
                    Simple yet exciting game of chance. Bet on heads or tails and double your GOLD if you win.
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Coins className="h-4 w-4 text-gold mr-1" />
                      <span>Min Bet: 10 GOLD</span>
                    </div>
                    <div className="text-green-500 font-medium">2x Multiplier</div>
                  </div>
                  <Link href="/games?tab=coinflip">
                    <Button className="gold-button w-full">Play Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </ScrollStaggerItem>

          <ScrollStaggerItem type="slide-up">
            <Card className="border-gold bg-black hover:gold-glow transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative h-40">
                  <Image src="/placeholder.svg?key=nbjtl" alt="Card Flip" fill className="object-cover rounded-t-lg" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex items-center">
                    <CreditCard className="h-6 w-6 text-gold mr-2" />
                    <h3 className="text-xl font-bold text-white">Card Flip</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-400 mb-4">
                    Test your memory by matching pairs of cards. The faster you match, the more GOLD you win.
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Coins className="h-4 w-4 text-gold mr-1" />
                      <span>Entry: 25 GOLD</span>
                    </div>
                    <div className="text-green-500 font-medium">Win up to 75 GOLD</div>
                  </div>
                  <Link href="/games?tab=cardflip">
                    <Button className="gold-button w-full">Play Now</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </ScrollStaggerItem>
        </div>
      </ScrollStaggerContainer>

      <div className="flex justify-center mt-6">
        <Link href="/games">
          <Button variant="outline" className="border-gold text-gold hover:bg-gold/10">
            View All Games
          </Button>
        </Link>
      </div>
    </div>
  )
}
