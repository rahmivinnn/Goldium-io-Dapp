import { Metadata } from "next"
import DashboardClient from "./client"

export const metadata: Metadata = {
  title: "Dashboard | Goldium.io",
  description: "Goldium.io Dashboard - Manage your GOLD tokens and view your transactions",
}

export default function DashboardPage() {
  return (
    <div className="pt-24">
      <DashboardClient />
    </div>
  )
}
