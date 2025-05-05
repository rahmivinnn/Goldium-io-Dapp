"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Image from "next/image"

interface Network {
  id: string
  name: string
  icon: string
  chainId: string
}

interface NetworkSelectorProps {
  networks: Network[]
  selectedNetwork: Network
  onNetworkChange: (network: Network) => void
  otherNetwork?: Network
}

export function NetworkSelector({ networks, selectedNetwork, onNetworkChange, otherNetwork }: NetworkSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-black/30 border-yellow-500/30 hover:bg-black/50 hover:border-yellow-500/50"
        >
          <div className="flex items-center">
            <div className="w-6 h-6 mr-2 rounded-full overflow-hidden bg-black/50 flex items-center justify-center">
              <Image
                src={selectedNetwork.icon || "/placeholder.svg"}
                alt={selectedNetwork.name}
                width={24}
                height={24}
              />
            </div>
            <span>{selectedNetwork.name}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-black/90 border-yellow-500/30">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search network..." className="text-white" />
          <CommandList>
            <CommandEmpty>No network found.</CommandEmpty>
            <CommandGroup>
              {networks.map((network) => {
                // Disable selection of the other selected network to prevent same source/destination
                const isDisabled = otherNetwork && network.id === otherNetwork.id

                return (
                  <CommandItem
                    key={network.id}
                    value={network.id}
                    onSelect={() => {
                      if (!isDisabled) {
                        onNetworkChange(network)
                        setOpen(false)
                      }
                    }}
                    disabled={isDisabled}
                    className={`${
                      isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-yellow-500/10"
                    } ${selectedNetwork.id === network.id ? "bg-yellow-500/20" : ""}`}
                  >
                    <div className="flex items-center">
                      <div className="w-6 h-6 mr-2 rounded-full overflow-hidden bg-black/50 flex items-center justify-center">
                        <Image src={network.icon || "/placeholder.svg"} alt={network.name} width={24} height={24} />
                      </div>
                      <span>{network.name}</span>
                    </div>
                    <Check
                      className={`ml-auto h-4 w-4 ${selectedNetwork.id === network.id ? "opacity-100" : "opacity-0"}`}
                    />
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default NetworkSelector
