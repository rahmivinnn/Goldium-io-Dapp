"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TransactionType } from "@/services/transaction-service"
import { ArrowUpRight, ArrowDownRight, RefreshCw, Coins, ImageIcon, ListFilter } from "lucide-react"

interface TransactionFiltersProps {
  onFilterChange: (type: TransactionType) => void
  activeFilter: TransactionType
}

export function TransactionFilters({ onFilterChange, activeFilter }: TransactionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h2 className="text-2xl font-bold">Transaction History</h2>

      <div className="flex items-center space-x-2">
        <Select value={activeFilter} onValueChange={(value) => onFilterChange(value as TransactionType)}>
          <SelectTrigger className="w-[180px] border-gold/30 bg-black">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-black border-gold/30">
            <SelectItem value="all" className="flex items-center">
              <ListFilter className="mr-2 h-4 w-4" />
              All Transactions
            </SelectItem>
            <SelectItem value="send" className="flex items-center">
              <ArrowUpRight className="mr-2 h-4 w-4 text-red-500" />
              Send
            </SelectItem>
            <SelectItem value="receive" className="flex items-center">
              <ArrowDownRight className="mr-2 h-4 w-4 text-green-500" />
              Receive
            </SelectItem>
            <SelectItem value="swap" className="flex items-center">
              <RefreshCw className="mr-2 h-4 w-4 text-blue-500" />
              Swap
            </SelectItem>
            <SelectItem value="stake" className="flex items-center">
              <Coins className="mr-2 h-4 w-4 text-gold" />
              Stake
            </SelectItem>
            <SelectItem value="nft" className="flex items-center">
              <ImageIcon className="mr-2 h-4 w-4 text-purple-500" />
              NFT
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
