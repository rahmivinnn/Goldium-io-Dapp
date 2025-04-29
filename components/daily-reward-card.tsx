"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Gift, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DailyRewardCardProps {
  loading?: boolean
}

export default function DailyRewardCard({ loading = false }: DailyRewardCardProps) {
  const [claimed, setClaimed] = useState(false)
  const { toast } = useToast()

  const handleClaim = () => {
    // Set claimed state to true
    setClaimed(true)

    // Show success toast
    toast({
      title: "Daily Reward Claimed!",
      description: "You've received 50 GOLD tokens.",
    })

    // In a real implementation, this would call an API to update the user's balance
    console.log("User balance updated with daily reward")
  }

  return (
    <Card className="border-gold-500 bg-black">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Gift className="mr-2 h-5 w-5 text-gold-500" />
          Daily Reward
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-16 w-full bg-gold-500/10" />
        ) : (
          <div>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gold-500/20 flex items-center justify-center">
                {claimed ? <Check className="h-8 w-8 text-green-500" /> : <Gift className="h-8 w-8 text-gold-500" />}
              </div>
            </div>

            <div className="text-center mb-4">
              <h3 className="font-bold text-lg">{claimed ? "Reward Claimed!" : "50 GOLD Available"}</h3>
              <p className="text-sm text-gray-400">
                {claimed ? "Come back tomorrow for more rewards" : "Claim your daily login bonus"}
              </p>
            </div>

            <Button
              className={
                claimed
                  ? "w-full bg-green-500 hover:bg-green-600 text-white"
                  : "w-full bg-gold-500 hover:bg-gold-600 text-black"
              }
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
