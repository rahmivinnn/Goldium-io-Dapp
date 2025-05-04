"use client"

import { useEffect, useState } from "react"
import { TokenContractDisplay } from "@/components/token-contract-display"
import { useNetwork } from "@/contexts/network-context"
import { MANA_TOKEN_METADATA } from "@/config/network-config"

export default function MANATokenPage() {
  const { network, explorerUrl } = useNetwork()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="h-64 bg-black/40 animate-pulse rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <TokenContractDisplay
          tokenName={MANA_TOKEN_METADATA.name}
          tokenSymbol={MANA_TOKEN_METADATA.symbol}
          tokenIcon={MANA_TOKEN_METADATA.logoURI}
          contractAddress="MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey"
          decimals={MANA_TOKEN_METADATA.decimals}
          totalSupply="2,800,000,000 MANA"
          network={network === "mainnet" ? "Solana Mainnet" : "Solana Testnet"}
          explorerUrl={explorerUrl}
        />
      </div>
    </div>
  )
}
