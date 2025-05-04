import type { Metadata } from "next"
import BridgeInterface from "@/components/bridge/bridge-interface"
import BridgeHistory from "@/components/bridge/bridge-history"

export const metadata: Metadata = {
  title: "Goldium | Cross-Chain Bridge",
  description: "Transfer your assets across multiple blockchain networks with Goldium Cross-Chain Bridge",
}

export default function BridgePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-300">
        Goldium Cross-Chain Bridge
      </h1>
      <p className="text-center text-gray-300 mb-8">
        Transfer your assets seamlessly between different blockchain networks
      </p>

      <BridgeInterface />
      <BridgeHistory />
    </div>
  )
}
