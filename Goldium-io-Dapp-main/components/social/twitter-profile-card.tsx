"use client"

import { Twitter, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function TwitterProfileCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-black border border-gold/30 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(255,215,0,0.15)] max-w-sm"
    >
      {/* Header/Banner Image */}
      <div className="relative h-24 bg-gradient-to-r from-black to-[#1a1a1a] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?key=nxuww')] bg-cover bg-center opacity-70"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Profile Section */}
      <div className="relative px-4 pb-3 pt-12">
        {/* Avatar */}
        <div className="absolute -top-8 left-4 border-2 border-black rounded-full overflow-hidden">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center overflow-hidden">
            <Image
              src="/gold_icon-removebg-preview.png"
              alt="Goldium Official"
              width={50}
              height={50}
              className="object-cover"
            />
          </div>
        </div>

        {/* Follow Button */}
        <div className="flex justify-end">
          <a href="https://x.com/goldiumofficial" target="_blank" rel="noopener noreferrer" className="inline-block">
            <Button size="sm" className="rounded-full bg-gold hover:bg-gold/80 text-black font-bold">
              Follow
            </Button>
          </a>
        </div>

        {/* Profile Info */}
        <div className="mt-1">
          <h2 className="text-lg font-bold">Goldium Official</h2>
          <p className="text-gray-500 text-sm">@goldiumofficial</p>

          <p className="my-2 text-sm text-white">The official account for Goldium.io | Web3 Gaming & NFT Platform</p>

          <div className="flex mt-2 text-xs">
            <div className="mr-3">
              <span className="font-bold text-white">1,024</span> <span className="text-gray-500">Following</span>
            </div>
            <div>
              <span className="font-bold text-white">5,678</span> <span className="text-gray-500">Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gold/10 flex justify-between items-center">
        <div className="flex items-center text-gold">
          <Twitter className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">X.com</span>
        </div>
        <a
          href="https://x.com/goldiumofficial"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gold hover:underline flex items-center"
        >
          Visit <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </motion.div>
  )
}
