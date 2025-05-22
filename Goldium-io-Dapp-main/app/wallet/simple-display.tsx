"use client"

import { useState } from "react"
import SimpleWalletDisplay from "@/components/simple-wallet-display"
import { Button } from "@/components/ui/button"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export default function SimpleWalletPage() {
  const [showDetailed, setShowDetailed] = useState(false)

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Wallet Balance</h1>
          <WalletMultiButton />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Simple Balance Display</h2>
            <Button variant="outline" onClick={() => setShowDetailed(!showDetailed)} className="text-xs">
              {showDetailed ? "Show Compact" : "Show Detailed"}
            </Button>
          </div>

          <SimpleWalletDisplay compact={!showDetailed} />
        </div>
      </div>
    </div>
  )
}
