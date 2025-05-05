"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MarketplaceHeader() {
  const { toast } = useToast()

  const handleListNFT = () => {
    toast({
      title: "List NFT",
      description: "NFT listing functionality will be available soon!",
    })
  }

  return (
    <motion.div
      className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <motion.h1
          className="text-3xl font-bold tracking-wider text-center md:text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
            GOLDIUM.IO MARKETPLACE
          </span>
        </motion.h1>
        <motion.p
          className="text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Buy, sell, and trade unique NFTs using GOLD
        </motion.p>
      </div>
      <motion.div
        className="flex gap-2 mt-4 md:mt-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="gold-button" onClick={handleListNFT}>
            <Tag className="mr-2 h-4 w-4" />
            List NFT for Sale
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
