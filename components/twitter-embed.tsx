"use client"

import { useState, useEffect, useRef } from "react"
import {
  Calendar,
  MapPin,
  LinkIcon,
  MoreHorizontal,
  MessageCircle,
  Repeat,
  Heart,
  Share,
  Twitter,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface Tweet {
  id: string
  text: string
  created_at: string
  media_url?: string
  public_metrics: {
    retweet_count: number
    reply_count: number
    like_count: number
    quote_count: number
  }
  highlighted?: boolean
}

export default function TwitterEmbed() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Definisikan tweet dengan gambar yang valid
  const tweets: Tweet[] = [
    {
      id: "1",
      text: "🚀 Exciting news! We're launching our new NFT collection next week with exclusive rewards for early adopters. Join our Discord for a chance to get on the whitelist! #Goldium #NFTs #Web3 #Gaming",
      created_at: "2023-05-04T12:00:00Z",
      media_url: "/nft-images/dragon-egg.png",
      public_metrics: {
        retweet_count: 128,
        reply_count: 42,
        like_count: 512,
        quote_count: 18,
      },
      highlighted: true,
    },
    {
      id: "2",
      text: "💰 $GOLD staking rewards have been distributed! Check your wallet and enjoy those sweet returns. Current APY: 18.5% #DeFi #Staking #PassiveIncome",
      created_at: "2023-05-03T15:30:00Z",
      media_url: "/gold_icon-removebg-preview.png",
      public_metrics: {
        retweet_count: 76,
        reply_count: 24,
        like_count: 320,
        quote_count: 8,
      },
    },
    {
      id: "3",
      text: "🎮 Our play-to-earn game has reached 50,000 active players! Thanks to our amazing community for making this possible. Special rewards coming this weekend for all participants! #GameFi #P2E #Goldium",
      created_at: "2023-05-02T09:15:00Z",
      media_url: "/nft-images/ruby-of-power.png",
      public_metrics: {
        retweet_count: 95,
        reply_count: 31,
        like_count: 405,
        quote_count: 12,
      },
      highlighted: true,
    },
    {
      id: "4",
      text: "📢 AMA session with our founders starts in 2 hours! Join us on Discord to learn about our roadmap and upcoming features. We'll be giving away 1000 $GOLD tokens to participants! #Goldium #AMA #Crypto",
      created_at: "2023-05-01T18:45:00Z",
      public_metrics: {
        retweet_count: 82,
        reply_count: 28,
        like_count: 346,
        quote_count: 9,
      },
    },
    {
      id: "5",
      text: "🔥 New partnership announcement! We're collaborating with @CryptoLeague to bring exclusive in-game items to Goldium holders. Stay tuned for more details! #Partnership #Gaming #NFTs",
      created_at: "2023-04-30T14:20:00Z",
      media_url: "/nft-images/crown-of-wisdom.png",
      public_metrics: {
        retweet_count: 112,
        reply_count: 36,
        like_count: 478,
        quote_count: 15,
      },
      highlighted: true,
    },
  ]

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Auto-rotate tweets every 5 seconds if not hovering
  useEffect(() => {
    if (isHovering) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tweets.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isHovering, tweets.length])

  // Format date to relative time (e.g., "2d ago")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60))
        return `${diffMinutes}m ago`
      }
      return `${diffHours}h ago`
    }
    return `${diffDays}d ago`
  }

  const nextTweet = () => {
    setActiveIndex((prev) => (prev + 1) % tweets.length)
  }

  const prevTweet = () => {
    setActiveIndex((prev) => (prev - 1 + tweets.length) % tweets.length)
  }

  return (
    <div
      className="w-full max-w-5xl mx-auto flex justify-center"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      ref={containerRef}
    >
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-black border border-gold/30 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(255,215,0,0.2)]"
          >
            {/* Header/Banner Image */}
            <div className="relative h-48 bg-gradient-to-r from-black to-[#1a1a1a] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-black/80 opacity-70"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

              {/* Gold particles animation */}
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-gold"
                    initial={{
                      x: Math.random() * 100 + "%",
                      y: "100%",
                      opacity: 0.3 + Math.random() * 0.7,
                      scale: 0.5 + Math.random() * 1.5,
                    }}
                    animate={{
                      y: "0%",
                      opacity: 0,
                    }}
                    transition={{
                      duration: 2 + Math.random() * 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      delay: Math.random() * 5,
                    }}
                  />
                ))}
              </div>

              {/* Twitter Logo Overlay */}
              <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-full">
                <Twitter className="h-6 w-6 text-gold" />
              </div>
            </div>

            {/* Profile Section */}
            <div className="relative px-6 pb-4 pt-20">
              {/* Avatar */}
              <div className="absolute -top-16 left-6 border-4 border-black rounded-full overflow-hidden shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                <div className="w-32 h-32 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src="/gold_icon-removebg-preview.png"
                    alt="Goldium Official"
                    width={100}
                    height={100}
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Follow Button */}
              <div className="flex justify-end">
                <a
                  href="https://x.com/goldiumofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button className="rounded-full bg-gold hover:bg-gold/80 text-black font-bold px-6 py-2 text-base">
                    Follow
                  </Button>
                </a>
              </div>

              {/* Profile Info */}
              <div className="mt-3">
                <h2 className="text-2xl font-bold">Goldium Official</h2>
                <p className="text-gray-500">@goldiumofficial</p>

                <p className="my-4 text-white text-lg">
                  The official account for Goldium.io | Web3 Gaming & NFT Platform | Join our community of gamers and
                  collectors
                </p>

                <div className="flex flex-wrap gap-y-3 text-sm text-gray-500">
                  <div className="flex items-center mr-6">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Joined March 2023</span>
                  </div>
                  <div className="flex items-center mr-6">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>Blockchain</span>
                  </div>
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    <a href="https://goldium.io" className="text-gold hover:underline">
                      goldium.io
                    </a>
                  </div>
                </div>

                <div className="flex mt-4 text-base">
                  <div className="mr-6">
                    <span className="font-bold text-white">1,024</span> <span className="text-gray-500">Following</span>
                  </div>
                  <div>
                    <span className="font-bold text-white">5,678</span> <span className="text-gray-500">Followers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tweets Carousel Section */}
            <div className="border-t border-gold/10 mt-4 relative">
              <div className="p-6 min-h-[300px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start"
                  >
                    <div className="mr-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center overflow-hidden">
                        <Image
                          src="/gold_icon-removebg-preview.png"
                          alt="Goldium Official"
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <span className="font-bold">Goldium Official</span>{" "}
                          <span className="text-gray-500">
                            @goldiumofficial · {formatDate(tweets[activeIndex].created_at)}
                          </span>
                        </div>
                        <button className="text-gray-500 hover:text-gold">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-2">
                        <p className="text-white text-lg">{tweets[activeIndex].text}</p>

                        {/* Tweet Image (if available) */}
                        {tweets[activeIndex].media_url && (
                          <div className="mt-4 rounded-xl overflow-hidden border border-gold/20">
                            <Image
                              src={tweets[activeIndex].media_url || "/placeholder.svg"}
                              alt="Tweet media"
                              width={800}
                              height={450}
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        )}

                        {/* Tweet Actions - Semua menggunakan warna gold */}
                        <div className="flex justify-between mt-4 text-gray-500">
                          <motion.button
                            className="flex items-center hover:text-gold group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="p-2 rounded-full group-hover:bg-gold/10 transition-colors">
                              <MessageCircle className="h-5 w-5" />
                            </div>
                            <span className="ml-1">{tweets[activeIndex].public_metrics.reply_count}</span>
                          </motion.button>
                          <motion.button
                            className="flex items-center hover:text-gold group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="p-2 rounded-full group-hover:bg-gold/10 transition-colors">
                              <Repeat className="h-5 w-5" />
                            </div>
                            <span className="ml-1">{tweets[activeIndex].public_metrics.retweet_count}</span>
                          </motion.button>
                          <motion.button
                            className="flex items-center hover:text-gold group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="p-2 rounded-full group-hover:bg-gold/10 transition-colors">
                              <Heart className="h-5 w-5" />
                            </div>
                            <span className="ml-1">{tweets[activeIndex].public_metrics.like_count}</span>
                          </motion.button>
                          <motion.button
                            className="flex items-center hover:text-gold group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="p-2 rounded-full group-hover:bg-gold/10 transition-colors">
                              <Share className="h-5 w-5" />
                            </div>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Tweet Navigation - Selalu terlihat */}
              <div className="absolute top-1/2 -translate-y-1/2 left-2">
                <motion.button
                  onClick={prevTweet}
                  className="p-2 rounded-full bg-black/70 border border-gold/30 text-gold hover:bg-gold/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowLeft className="h-5 w-5" />
                </motion.button>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-2">
                <motion.button
                  onClick={nextTweet}
                  className="p-2 rounded-full bg-black/70 border border-gold/30 text-gold hover:bg-gold/20 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Tweet Indicators */}
              <div className="flex justify-center gap-2 py-4">
                {tweets.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === activeIndex ? "bg-gold w-6" : "bg-gray-600 hover:bg-gold/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {!isLoaded && (
        <div className="h-96 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}
