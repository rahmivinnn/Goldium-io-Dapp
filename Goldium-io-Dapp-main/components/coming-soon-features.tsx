"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ScrollStaggerContainer, ScrollStaggerItem } from "@/components/ui/scroll-animation"

export default function ComingSoonFeatures() {
  const upcomingFeatures = [
    {
      id: 1,
      title: "Gold Rush",
      description: "Mine for digital gold in this exciting strategy game",
    },
    {
      id: 2,
      title: "Token Trader",
      description: "Test your trading skills in a simulated market",
    },
    {
      id: 3,
      title: "NFT Arena",
      description: "Battle with your NFTs in the ultimate showdown",
    },
  ]

  return (
    <div className="py-16">
      <h2 className="text-4xl font-bold text-center text-yellow-500 mb-12 font-['Orbitron',sans-serif] tracking-wider">
        Coming Soon
      </h2>

      <ScrollStaggerContainer staggerDelay={0.15}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {upcomingFeatures.map((feature) => (
            <ScrollStaggerItem key={feature.id} type="slide-up">
              <Card className="border-gold bg-black/80 hover:gold-glow transition-all duration-300 h-full">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <h3 className="text-2xl font-bold text-yellow-500 mb-4">{feature.title}</h3>
                  <p className="text-gray-300 mb-4">{feature.description}</p>
                  <div className="mt-auto">
                    <span className="text-yellow-500 font-medium">Coming Soon</span>
                  </div>
                </CardContent>
              </Card>
            </ScrollStaggerItem>
          ))}
        </div>
      </ScrollStaggerContainer>
    </div>
  )
}
