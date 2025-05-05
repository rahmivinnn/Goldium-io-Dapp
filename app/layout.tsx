import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { NetworkProvider } from "@/contexts/network-context"
import { SolanaWalletProvider } from "@/contexts/solana-wallet-context"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import { AutoWalletPopup } from "@/components/auto-wallet-popup"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Goldium.io - Web3 Gaming & DeFi Platform",
  description:
    "Experience the future of gaming with Goldium.io's Web3 platform featuring NFTs, DeFi, and play-to-earn games.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <NetworkProvider>
            <SolanaWalletProvider>
              <Header />
              {children}
              <Toaster />
              <AutoWalletPopup autoShow={false} />{" "}
              {/* Set to false to prevent auto popup, users will click the button instead */}
            </SolanaWalletProvider>
          </NetworkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
