"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Gift, Users } from "lucide-react"

export default function EventsPreview() {
  const events = [
    {
      id: 1,
      title: "Mystery Box Drop",
      description: "Limited edition items with 2x GOLD rewards",
      time: "12h 45m 22s",
      date: "April 30, 2025",
      reward: "Mystery NFT + 500 GOLD",
      participants: 156,
    },
    {
      id: 2,
      title: "Flash GOLD Sale",
      description: "50% bonus on all GOLD purchases",
      time: "1d 8h 15m",
      date: "May 1, 2025",
      reward: "Up to 2x GOLD bonus",
      participants: 89,
    },
    {
      id: 3,
      title: "Legendary NFT Auction",
      description: "Bid on exclusive legendary items",
      time: "3d 12h 30m",
      date: "May 3, 2025",
      reward: "Chance to win rare NFTs",
      participants: 212,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="border-gold bg-black">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
            <p className="text-gray-400 mb-4">{event.description}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gold mr-2" />
                <span>Starts in: {event.time}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gold mr-2" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center">
                <Gift className="h-5 w-5 text-gold mr-2" />
                <span>{event.reward}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gold mr-2" />
                <span>{event.participants} participants</span>
              </div>
            </div>

            <Button className="gold-button w-full">Set Reminder</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
