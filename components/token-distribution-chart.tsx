"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

// Updated to 1 billion tokens
const TOTAL_SUPPLY = 1_000_000_000

const initialData = [
  { name: "Public Sale", value: 400_000_000, percentage: 40, color: "#FFD700" },
  { name: "Team & Advisors", value: 150_000_000, percentage: 15, color: "#FFA500" },
  { name: "Ecosystem Growth", value: 200_000_000, percentage: 20, color: "#FF8C00" },
  { name: "Staking Rewards", value: 150_000_000, percentage: 15, color: "#FF4500" },
  { name: "Marketing", value: 50_000_000, percentage: 5, color: "#FF0000" },
  { name: "Reserve", value: 50_000_000, percentage: 5, color: "#8B0000" },
]

const unlockScheduleData = [
  { month: "Month 1", publicSale: 100_000_000, team: 0, ecosystem: 20_000_000, staking: 12_500_000 },
  { month: "Month 3", publicSale: 100_000_000, team: 15_000_000, ecosystem: 20_000_000, staking: 12_500_000 },
  { month: "Month 6", publicSale: 100_000_000, team: 30_000_000, ecosystem: 40_000_000, staking: 25_000_000 },
  { month: "Month 12", publicSale: 100_000_000, team: 45_000_000, ecosystem: 40_000_000, staking: 25_000_000 },
  { month: "Month 18", publicSale: 0, team: 30_000_000, ecosystem: 40_000_000, staking: 25_000_000 },
  { month: "Month 24", publicSale: 0, team: 30_000_000, ecosystem: 40_000_000, staking: 25_000_000 },
  { month: "Month 30", publicSale: 0, team: 0, ecosystem: 0, staking: 25_000_000 },
]

export function TokenDistributionChart() {
  const [activeTab, setActiveTab] = useState("distribution")

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}M`
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}K`
    }
    return num.toString()
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-black/90 border border-gold/30 p-3 rounded-md">
          <p className="text-gold font-medium">{data.name}</p>
          <p className="text-white">
            {formatNumber(data.value)} GOLD ({data.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-gold/30 bg-black/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-gold">GOLD Token Distribution</CardTitle>
        <CardDescription>Total Supply: 1,000,000,000 GOLD</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-gold/20">
            <TabsTrigger value="distribution" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Distribution
            </TabsTrigger>
            <TabsTrigger value="unlock" className="data-[state=active]:bg-gold data-[state=active]:text-black">
              Unlock Schedule
            </TabsTrigger>
          </TabsList>
          <TabsContent value="distribution" className="pt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={initialData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {initialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    formatter={(value) => <span className="text-sm text-white">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="unlock" className="pt-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-400">Token unlock schedule over time:</p>
              <div className="space-y-3">
                {unlockScheduleData.map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.month}</span>
                      <span className="text-sm text-gold">
                        {formatNumber(item.publicSale + item.team + item.ecosystem + item.staking)} GOLD
                      </span>
                    </div>
                    <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-[#FFD700]"
                        style={{ width: `${(item.publicSale / TOTAL_SUPPLY) * 100}%` }}
                        title="Public Sale"
                      ></div>
                      <div
                        className="h-full bg-[#FFA500]"
                        style={{ width: `${(item.team / TOTAL_SUPPLY) * 100}%` }}
                        title="Team & Advisors"
                      ></div>
                      <div
                        className="h-full bg-[#FF8C00]"
                        style={{ width: `${(item.ecosystem / TOTAL_SUPPLY) * 100}%` }}
                        title="Ecosystem Growth"
                      ></div>
                      <div
                        className="h-full bg-[#FF4500]"
                        style={{ width: `${(item.staking / TOTAL_SUPPLY) * 100}%` }}
                        title="Staking Rewards"
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#FFD700] rounded-full"></div>
                  <span className="text-xs">Public Sale</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#FFA500] rounded-full"></div>
                  <span className="text-xs">Team & Advisors</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#FF8C00] rounded-full"></div>
                  <span className="text-xs">Ecosystem Growth</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#FF4500] rounded-full"></div>
                  <span className="text-xs">Staking Rewards</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
