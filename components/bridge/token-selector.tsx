"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useClickAway } from "react-use"

interface TokenSelectorProps {
  tokens: Array<{
    id: string
    name: string
    symbol: string
    icon: string
    decimals?: number
  }>
  selectedToken: string
  onTokenChange: (token: string) => void
}

export function TokenSelector({ tokens, selectedToken, onTokenChange }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useClickAway(ref, () => {
    setIsOpen(false)
  })

  // Get the selected token details
  const selectedTokenDetails = tokens.find((token) => token.id === selectedToken)

  return (
    <div className="relative" ref={ref}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        className="w-full justify-between bg-gray-900 border-gray-700 hover:bg-gray-800 hover:border-gray-600 text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {selectedTokenDetails && (
            <img
              src={selectedTokenDetails.icon || "/placeholder.svg"}
              alt={selectedTokenDetails.symbol}
              className="w-5 h-5 rounded-full mr-2"
            />
          )}
          <span>{selectedTokenDetails?.symbol || selectedToken}</span>
        </div>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-10 mt-1 w-full rounded-md bg-gray-900 border border-gray-700 shadow-lg"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="max-h-60 overflow-auto p-1">
              {tokens.map((token) => (
                <li key={token.id}>
                  <Button
                    type="button"
                    className={`w-full justify-start text-left ${
                      selectedToken === token.id
                        ? "bg-gold/20 text-gold"
                        : "bg-transparent text-gray-200 hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      onTokenChange(token.id)
                      setIsOpen(false)
                    }}
                  >
                    <div className="flex items-center w-full">
                      <img
                        src={token.icon || "/placeholder.svg"}
                        alt={token.symbol}
                        className="w-5 h-5 rounded-full mr-2"
                      />
                      <div className="flex flex-col">
                        <span>{token.symbol}</span>
                        <span className="text-xs text-gray-400">{token.name}</span>
                      </div>
                    </div>
                    {selectedToken === token.id && <Check className="ml-auto h-4 w-4" />}
                  </Button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Add default export to fix the error
export default TokenSelector
