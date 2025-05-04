"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

// Token distribution data
const DISTRIBUTION_DATA = [
  { name: "Community", value: 500000, percentage: 50, color: "#FFD700" },
  { name: "Investors", value: 200000, percentage: 20, color: "#C9B037" },
  { name: "Team", value: 150000, percentage: 15, color: "#D4AF37" },
  { name: "Ecosystem", value: 100000, percentage: 10, color: "#996515" },
  { name: "Reserve", value: 50000, percentage: 5, color: "#665D1E" },
]

// Token release schedule
const RELEASE_SCHEDULE = [
  { phase: "TGE", date: "Q2 2023", community: 10, investors: 5, team: 0, ecosystem: 10, reserve: 0 },
  { phase: "Month 3", date: "Q3 2023", community: 20, investors: 10, team: 10, ecosystem: 20, reserve: 10 },
  { phase: "Month 6", date: "Q4 2023", community: 40, investors: 20, team: 20, ecosystem: 40, reserve: 20 },
  { phase: "Month 12", date: "Q2 2024", community: 70, investors: 40, team: 40, ecosystem: 70, reserve: 40 },
  { phase: "Month 18", date: "Q4 2024", community: 100, investors: 70, team: 70, ecosystem: 100, reserve: 70 },
  { phase: "Month 24", date: "Q2 2025", community: 100, investors: 100, team: 100, ecosystem: 100, reserve: 100 },
]

// Custom tooltip for the pie chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border border-gold-500 p-2 rounded-md">
        <p className="font-bold">{`${payload[0].name}`}</p>
        <p className="text-gold-500">{`${payload[0].value.toLocaleString()} GOLD (${payload[0].payload.percentage}%)`}</p>
      </div>
    )
  }
  return null
}

export function TokenDistributionChart() {
  const [activeTab, setActiveTab] = useState("distribution")

  return (
    <Card className="border-gold-500 bg-black w-full">
      <CardHeader>
        <CardTitle className="text-gold-500">GOLD Token Distribution</CardTitle>
        <CardDescription>Total Supply: 1,000,000 GOLD</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger
              value="distribution"
              className="data-[state=active]:bg-gold-500 data-[state=active]:text-black"
            >
              Distribution
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
              Release Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="distribution" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DISTRIBUTION_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                      labelLine={false}
                    >
                      {DISTRIBUTION_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Token Allocation</h3>
                <div className="space-y-4">
                  {DISTRIBUTION_DATA.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                        <span>{item.name}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-gold-500">{item.value.toLocaleString()} GOLD</span>
                        <span className="text-sm text-gray-400">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total Supply:</span>
                    <span className="font-bold text-gold-500">1,000,000 GOLD</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="mt-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-4 py-3 text-left">Phase</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-right">Community</th>
                    <th className="px-4 py-3 text-right">Investors</th>
                    <th className="px-4 py-3 text-right">Team</th>
                    <th className="px-4 py-3 text-right">Ecosystem</th>
                    <th className="px-4 py-3 text-right">Reserve</th>
                  </tr>
                </thead>
                <tbody>
                  {RELEASE_SCHEDULE.map((phase, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-900">
                      <td className="px-4 py-3 font-medium">{phase.phase}</td>
                      <td className="px-4 py-3">{phase.date}</td>
                      <td className="px-4 py-3 text-right">
                        {phase.community}%
                        <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
                          <div
                            className="bg-gold-500 h-full rounded-full"
                            style={{ width: `${phase.community}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {phase.investors}%
                        <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
                          <div
                            className="bg-gold-500 h-full rounded-full"
                            style={{ width: `${phase.investors}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {phase.team}%
                        <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
                          <div className="bg-gold-500 h-full rounded-full" style={{ width: `${phase.team}%` }}></div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {phase.ecosystem}%
                        <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
                          <div
                            className="bg-gold-500 h-full rounded-full"
                            style={{ width: `${phase.ecosystem}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {phase.reserve}%
                        <div className="w-full bg-gray-700 h-1 mt-1 rounded-full overflow-hidden">
                          <div className="bg-gold-500 h-full rounded-full" style={{ width: `${phase.reserve}%` }}></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Release Notes</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium">TGE (Token Generation Event):</span> Initial release with focus on
                  community and ecosystem building.
                </li>
                <li>
                  <span className="font-medium">Team tokens:</span> 12-month cliff with 24-month linear vesting to
                  ensure long-term commitment.
                </li>
                <li>
                  <span className="font-medium">Investor tokens:</span> 6-month cliff with 18-month linear vesting.
                </li>
                <li>
                  <span className="font-medium">Community tokens:</span> Released gradually through staking rewards,
                  airdrops, and community initiatives.
                </li>
                <li>
                  <span className="font-medium">Reserve:</span> Locked for 12 months, then released gradually for
                  unexpected expenses and opportunities.
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
