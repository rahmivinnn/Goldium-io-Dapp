"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, CheckCircleIcon, LoaderIcon } from "lucide-react"

interface BridgeTransactionProps {
  sourceNetwork: string
  destinationNetwork: string
  sourceToken: string
  destinationToken: string
  amount: string
  fee: string
  isProcessing: boolean
  onConfirm: () => void
  onCancel: () => void
}

const getNetworkIcon = (networkId: string) => {
  const networkIcons: Record<string, string> = {
    ethereum: "/images/ethereum-logo.png",
    solana: "/images/solana-logo.png",
    binance: "/images/binance-logo.png",
    polygon: "/images/polygon-logo.png",
    avalanche: "/images/avalanche-logo.png",
  }

  return networkIcons[networkId] || "/images/ethereum-logo.png"
}

const getTokenIcon = (tokenId: string) => {
  const tokenIcons: Record<string, string> = {
    ETH: "/images/ethereum-logo.png",
    SOL: "/images/solana-logo.png",
    BNB: "/images/binance-logo.png",
    MATIC: "/images/polygon-logo.png",
    AVAX: "/images/avalanche-logo.png",
    USDT: "/abstract-tether.png",
    USDC: "/usdc-digital-currency.png",
    GOLD: "/gold_icon-removebg-preview.png",
  }

  return tokenIcons[tokenId] || "/images/ethereum-logo.png"
}

export default function BridgeTransaction({
  sourceNetwork,
  destinationNetwork,
  sourceToken,
  destinationToken,
  amount,
  fee,
  isProcessing,
  onConfirm,
  onCancel,
}: BridgeTransactionProps) {
  const receiveAmount = (Number.parseFloat(amount) - Number.parseFloat(fee)).toFixed(4)

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-center text-amber-500">Confirm Bridge Transaction</h3>

      <div className="flex items-center justify-center space-x-4 py-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-800 flex items-center justify-center border-2 border-amber-500">
            <Image
              src={getNetworkIcon(sourceNetwork) || "/placeholder.svg"}
              alt={sourceNetwork}
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="text-sm text-gray-300 mt-2 capitalize">{sourceNetwork}</span>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full h-0.5 bg-gradient-to-r from-amber-500 to-yellow-300 relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black p-1 rounded-full">
              <ArrowRightIcon className="h-4 w-4 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-800 flex items-center justify-center border-2 border-amber-500">
            <Image
              src={getNetworkIcon(destinationNetwork) || "/placeholder.svg"}
              alt={destinationNetwork}
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="text-sm text-gray-300 mt-2 capitalize">{destinationNetwork}</span>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 relative mr-2 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
              <Image
                src={getTokenIcon(sourceToken) || "/placeholder.svg"}
                alt={sourceToken}
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <div>
              <div className="text-white font-medium">
                {amount} {sourceToken}
              </div>
              <div className="text-xs text-gray-400">You send</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 relative mr-2 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                <Image
                  src={getTokenIcon(destinationToken) || "/placeholder.svg"}
                  alt={destinationToken}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <div>
                <div className="text-white font-medium">
                  {receiveAmount} {destinationToken}
                </div>
                <div className="text-xs text-gray-400">You receive</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Bridge Fee</span>
          <span className="text-white">
            {fee} {sourceToken}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Estimated Time</span>
          <span className="text-white">10-30 minutes</span>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 border-gray-700 text-white hover:bg-gray-800 hover:text-white"
          disabled={isProcessing}
        >
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-300 hover:from-amber-600 hover:to-yellow-400 text-black font-medium"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center">
              <LoaderIcon className="animate-spin h-4 w-4 mr-2" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Confirm
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}
