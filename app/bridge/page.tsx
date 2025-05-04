import { BridgeInterface } from "@/components/bridge/bridge-interface"
import { BridgeHistory } from "@/components/bridge/bridge-history"

export default function BridgePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gold mb-2">Cross-Chain Bridge</h1>
      <p className="text-gray-400 mb-8">Transfer your assets between different blockchain networks</p>

      <BridgeInterface />
      <BridgeHistory />
    </div>
  )
}
