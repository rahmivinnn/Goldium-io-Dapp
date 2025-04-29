"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Gift, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DailyRewardCardProps {
  loading: boolean
}

export default function DailyRewardCard({ loading }: DailyRewardCardProps) {
  const [claimed, setClaimed] = useState(false)
  const { toast } = useToast()

  const handleClaim = () => {
    setClaimed(true)

    // Update user's balance in a real implementation
    // For now, we'll just show a toast notification
    toast({
      title: "Daily Reward Claimed!",
      description: "You've received 50 GOLD tokens.",
    })

    // In a real implementation, this would call an API to update the user's balance
    // For now, we'll just simulate the reward
    setTimeout(() => {
      console.log("User balance updated with daily reward")
    }, 1000)
  }

  return (
    <Card className="border-gold bg-black">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Gift className="mr-2 h-5 w-5 text-gold" />
          Daily Reward
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-16 w-full bg-gold/10" />
        ) : (
          <div>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                {claimed ? <Check className="h-8 w-8 text-green-500" /> : <Gift className="h-8 w-8 text-gold" />}
              </div>
            </div>

            <div className="text-center mb-4">
              <h3 className="font-bold text-lg">{claimed ? "Reward Claimed!" : "50 GOLD Available"}</h3>
              <p className="text-sm text-gray-400">
                {claimed ? "Come back tomorrow for more rewards" : "Claim your daily login bonus"}
              </p>
            </div>

            <Button
              className={claimed ? "w-full bg-green-500 hover:bg-green-600 text-white" : "gold-button w-full"}
              disabled={claimed}
              onClick={handleClaim}
            >
              {claimed ? "Claimed" : "Claim Reward"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
