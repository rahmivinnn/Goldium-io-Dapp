"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, Clock, Lock, Unlock, ExternalLink } from "lucide-react"

// Sample staking history data
const STAKING_HISTORY = [
  {
    id: "stake1",
    type: "stake",
    amount: 500,
    plan: "90-Day Lock",
    apr: "12.5%",
    timestamp: "2025-04-15T10:15:00Z",
    unlockDate: "2025-07-14T10:15:00Z",
  },
  {
    id: "stake2",
    type: "stake",
    amount: 250,
    plan: "Flexible",
    apr: "4.5%",
    timestamp: "2025-04-10T14:30:00Z",
  },
  {
    id: "stake3",
    type: "unstake",
    amount: 100,
    plan: "Flexible",
    timestamp: "2025-04-05T09:45:00Z",
  },
  {
    id: "stake4",
    type: "claim",
    amount: 18.5,
    timestamp: "2025-04-01T16:20:00Z",
  },
  {
    id: "stake5",
    type: "stake",
    amount: 500,
    plan: "30-Day Lock",
    apr: "8.2%",
    timestamp: "2025-03-25T11:10:00Z",
    unlockDate: "2025-04-24T11:10:00Z",
  },
]

export default function StakingHistory() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "stake":
        return <ArrowUpRight className="h-5 w-5 text-blue-500" />
      case "unstake":
        return <ArrowDownRight className="h-5 w-5 text-orange-500" />
      case "claim":
        return <ArrowDownRight className="h-5 w-5 text-green-500" />
      default:
        return null
    }
  }

  const getTypeLabel = (transaction: any) => {
    switch (transaction.type) {
      case "stake":
        return `Stake GOLD (${transaction.plan})`
      case "unstake":
        return `Unstake GOLD (${transaction.plan})`
      case "claim":
        return "Claim Staking Rewards"
      default:
        return transaction.type
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gold/30">
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Details</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="px-4 py-3 text-right">Status</th>
            <th className="px-4 py-3 text-right"></th>
          </tr>
        </thead>
        <tbody>
          {STAKING_HISTORY.map((transaction) => (
            <tr key={transaction.id} className="border-b border-gold/10 hover:bg-gold/5">
              <td className="px-4 py-3">
                <div className="flex items-center">{getTypeIcon(transaction.type)}</div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium">{getTypeLabel(transaction)}</div>
                {transaction.apr && <div className="text-xs text-gray-400">APR: {transaction.apr}</div>}
              </td>
              <td className="px-4 py-3">
                <div>{formatDate(transaction.timestamp)}</div>
                {transaction.unlockDate && (
                  <div className="text-xs text-gray-400">Unlocks: {formatDate(transaction.unlockDate)}</div>
                )}
              </td>
              <td className="px-4 py-3 text-right font-bold">
                <span
                  className={
                    transaction.type === "claim"
                      ? "text-green-500"
                      : transaction.type === "unstake"
                        ? "text-orange-500"
                        : "text-gold"
                  }
                >
                  {transaction.type === "claim" || transaction.type === "unstake" ? "+" : ""}
                  {transaction.amount} GOLD
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                {transaction.unlockDate ? (
                  <div className="flex items-center justify-end text-xs">
                    <Lock className="h-3 w-3 mr-1 text-blue-500" />
                    <span>Locked</span>
                  </div>
                ) : transaction.type === "stake" ? (
                  <div className="flex items-center justify-end text-xs">
                    <Unlock className="h-3 w-3 mr-1 text-green-500" />
                    <span>Flexible</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-end text-xs">
                    <Clock className="h-3 w-3 mr-1 text-gray-400" />
                    <span>Completed</span>
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gold">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-center mt-6">
        <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
          View All History
        </Button>
      </div>
    </div>
  )
}
