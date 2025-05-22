import type React from "react"
export const dynamic = "force-dynamic"
export const runtime = "edge"

export default function StakingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="staking-layout">{children}</div>
}
