import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { NetworkProvider } from "@/contexts/network-context"

export const metadata: Metadata = {
  title: "Goldium.io - Web3 DApp",
  description: "Goldium.io - A Web3 DApp for cross-chain token bridging",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <NetworkProvider>{children}</NetworkProvider>
      </body>
    </html>
  )
}
