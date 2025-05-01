"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useWallet } from "@/components/wallet-provider"
import { useNetwork } from "@/contexts/network-context"

interface TokenSelectorProps {
  value: string
  onChange: (value: string) => void
  excludeToken?: string
}

export default function TokenSelector({ value, onChange, excludeToken }: TokenSelectorProps) {
  const [open, setOpen] = useState(false)
  const { tokens } = useWallet()
  const { network } = useNetwork()

  // Filter tokens to only include SOL and GOLD
  const filteredTokens = tokens.filter(
    (token) => (token.symbol === "SOL" || token.symbol === "GOLD") && token.symbol !== excludeToken,
  )

  // If the current value is not in the filtered tokens, reset it
  useEffect(() => {
    if (value && !filteredTokens.some((token) => token.symbol === value)) {
      // Default to the first available token
      if (filteredTokens.length > 0) {
        onChange(filteredTokens[0].symbol)
      }
    }
  }, [value, filteredTokens, onChange, network])

  const selectedToken = filteredTokens.find((token) => token.symbol === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedToken ? (
            <div className="flex items-center">
              <img
                src={selectedToken.icon || "/placeholder.svg"}
                alt={selectedToken.name}
                className="mr-2 h-5 w-5 rounded-full"
              />
              <span>{selectedToken.symbol}</span>
            </div>
          ) : (
            "Select token..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search token..." />
          <CommandList>
            <CommandEmpty>No tokens found.</CommandEmpty>
            <CommandGroup>
              {filteredTokens.map((token) => (
                <CommandItem
                  key={token.symbol}
                  value={token.symbol}
                  onSelect={() => {
                    onChange(token.symbol)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center">
                    <img
                      src={token.icon || "/placeholder.svg"}
                      alt={token.name}
                      className="mr-2 h-5 w-5 rounded-full"
                    />
                    <span>{token.symbol}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{token.name}</span>
                  </div>
                  <Check className={cn("ml-auto h-4 w-4", value === token.symbol ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
