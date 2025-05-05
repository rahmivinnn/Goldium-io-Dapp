import type React from "react"
export default function StakingClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">{children}</div>
}
