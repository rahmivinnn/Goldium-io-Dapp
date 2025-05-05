import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Orbitron } from "next/font/google"

const orbitron = Orbitron({ subsets: ["latin"] })

export default function MarketplaceTabs() {
  return (
    <div className="mb-6">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className={`grid grid-cols-5 ${orbitron.className}`}>
          <TabsTrigger value="all" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
            All Items
          </TabsTrigger>
          <TabsTrigger value="weapons" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
            Weapons
          </TabsTrigger>
          <TabsTrigger value="armor" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
            Armor
          </TabsTrigger>
          <TabsTrigger value="spells" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
            Spells
          </TabsTrigger>
          <TabsTrigger value="artifacts" className="data-[state=active]:bg-gold-500 data-[state=active]:text-black">
            Artifacts
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
