"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useClickAway } from "react-use"

interface NetworkSelectorProps {
  networks: Array<{
    id: string
    name: string
    icon: string
  }>
  selectedNetwork: string
  onNetworkChange: (network: string) => void
  excludeNetwork?: string
}

export function NetworkSelector({ networks, selectedNetwork, onNetworkChange, excludeNetwork }: NetworkSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useClickAway(ref, () => {
    setIsOpen(false)
  })

  // Get the selected network details
  const selectedNetworkDetails = networks.find((network) => network.id === selectedNetwork)

  // Filter out the excluded network
  const availableNetworks = networks.filter((network) => network.id !== excludeNetwork)

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
          {selectedNetworkDetails && (
            <img
              src={selectedNetworkDetails.icon || "/placeholder.svg"}
              alt={selectedNetworkDetails.name}
              className="w-5 h-5 rounded-full mr-2"
            />
          )}
          <span>{selectedNetworkDetails?.name || selectedNetwork}</span>
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
              {availableNetworks.map((network) => (
                <li key={network.id}>
                  <Button
                    type="button"
                    className={`w-full justify-start text-left ${
                      selectedNetwork === network.id
                        ? "bg-gold/20 text-gold"
                        : "bg-transparent text-gray-200 hover:bg-gray-800"
                    }`}
                    onClick={() => {
                      onNetworkChange(network.id)
                      setIsOpen(false)
                    }}
                  >
                    <div className="flex items-center w-full">
                      <img
                        src={network.icon || "/placeholder.svg"}
                        alt={network.name}
                        className="w-5 h-5 rounded-full mr-2"
                      />
                      <span>{network.name}</span>
                    </div>
                    {selectedNetwork === network.id && <Check className="ml-auto h-4 w-4" />}
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
