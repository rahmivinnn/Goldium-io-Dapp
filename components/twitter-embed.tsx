"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Heart, MessageCircle, Repeat, Share2, Twitter, VerifiedIcon } from "lucide-react"
import Image from "next/image"

export default function TwitterEmbed() {
  const [currentTweet, setCurrentTweet] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const tweets = [
    {
      id: "1",
      content:
        "🚀 Exciting news! We're launching our new NFT collection next week with exclusive rewards for early adopters. Join our Discord for a chance to get on the whitelist! #Goldium #NFTs #Web3 #Gaming",
      date: "2h ago",
      likes: 245,
      retweets: 87,
      replies: 32,
    },
    {
      id: "2",
      content:
        "💰 $GOLD staking rewards have been distributed! Check your wallet and enjoy those sweet returns. Current APY: 18.5% #DeFi #Staking #PassiveIncome",
      date: "1d ago",
      likes: 189,
      retweets: 56,
      replies: 24,
    },
    {
      id: "3",
      content: "CA: APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump",
      date: "2d ago",
      likes: 312,
      retweets: 103,
      replies: 47,
    },
  ]

  const nextTweet = () => {
    setCurrentTweet((prev) => (prev + 1) % tweets.length)
  }

  const prevTweet = () => {
    setCurrentTweet((prev) => (prev - 1 + tweets.length) % tweets.length)
  }

  if (!mounted) return null

  return (
    <Card className="border-gold/30 bg-black/70 backdrop-blur-sm overflow-hidden max-w-md mx-auto">
      <div className="bg-gradient-to-r from-amber-600 to-yellow-400 h-16 relative">
        <div className="absolute -bottom-10 left-4">
          <div className="rounded-full border-4 border-black bg-black p-1">
            <Image
              src="/gold_icon-removebg-preview.png"
              alt="Goldium Profile"
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
        </div>
      </div>
      <CardContent className="pt-12 pb-4">
        <div className="flex items-center mb-2">
          <span className="font-bold text-lg">Goldium</span>
          <VerifiedIcon className="h-4 w-4 text-blue-500 ml-1" />
          <span className="text-gray-400 text-sm ml-2">@goldium_io</span>
        </div>
        <div className="text-gray-400 text-sm mb-1">24.5K Followers</div>

        <div className="mt-4 min-h-[100px]">
          <p className="text-white">{tweets[currentTweet].content}</p>
          <p className="text-gray-400 text-sm mt-2">{tweets[currentTweet].date}</p>
        </div>

        <div className="flex justify-between items-center mt-4 border-t border-gray-800 pt-3">
          <div className="flex items-center text-gray-400 text-sm">
            <MessageCircle className="h-4 w-4 mr-1" />
            <span>{tweets[currentTweet].replies}</span>
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <Repeat className="h-4 w-4 mr-1" />
            <span>{tweets[currentTweet].retweets}</span>
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <Heart className="h-4 w-4 mr-1" />
            <span>{tweets[currentTweet].likes}</span>
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <Share2 className="h-4 w-4" />
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="outline" size="sm" onClick={prevTweet} className="border-gold/30 hover:bg-gold/10">
            <ArrowLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <Button variant="outline" size="sm" onClick={nextTweet} className="border-gold/30 hover:bg-gold/10">
            Next <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="flex justify-center mt-4">
          <Twitter className="h-5 w-5 text-blue-400" />
        </div>
      </CardContent>
    </Card>
  )
}
