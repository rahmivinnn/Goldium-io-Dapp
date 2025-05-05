"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Image from "next/image"

interface Token {
  id: string
  name: string
  symbol: string
  icon: string
  decimals: number
}

interface TokenSelectorProps {
  tokens: Token[]
  selectedToken: Token
  onTokenChange: (token: Token) => void
}

export function TokenSelector({ tokens, selectedToken, onTokenChange }: TokenSelectorProps) {
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
                src={selectedToken.icon || "/placeholder.svg?height=24&width=24&query=token"}
                alt={selectedToken.name}
                width={24}
                height={24}
              />
            </div>
            <span>{selectedToken.symbol}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-black/90 border-yellow-500/30">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search token..." className="text-white" />
          <CommandList>
            <CommandEmpty>No token found.</CommandEmpty>
            <CommandGroup>
              {tokens.map((token) => (
                <CommandItem
                  key={token.id}
                  value={token.id}
                  onSelect={() => {
                    onTokenChange(token)
                    setOpen(false)
                  }}
                  className={`cursor-pointer hover:bg-yellow-500/10 ${
                    selectedToken.id === token.id ? "bg-yellow-500/20" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 mr-2 rounded-full overflow-hidden bg-black/50 flex items-center justify-center">
                      <Image
                        src={token.icon || "/placeholder.svg?height=24&width=24&query=token"}
                        alt={token.name}
                        width={24}
                        height={24}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span>{token.symbol}</span>
                      <span className="text-xs text-gray-400">{token.name}</span>
                    </div>
                  </div>
                  <Check className={`ml-auto h-4 w-4 ${selectedToken.id === token.id ? "opacity-100" : "opacity-0"}`} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default TokenSelector
