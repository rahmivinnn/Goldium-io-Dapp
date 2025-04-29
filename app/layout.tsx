import type React from "react"
import type { Metadata } from "next"
import Client from "./client"

export const metadata: Metadata = {
  title: "Goldium.io | Web3 GOLD Token Economy",
  description:
    "Experience the future of decentralized finance with Goldium.io - NFT trading, staking, and seamless crypto payments powered by GOLD token.",
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <Client>{children}</Client>
}


import './globals.css'