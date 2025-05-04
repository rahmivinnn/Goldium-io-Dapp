"use client"

import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { NetworkProvider } from "@/contexts/network-context"
import { SolanaWalletProvider } from "@/contexts/solana-wallet-context"
import { Inter } from "next/font/google"
import "../enhanced-marketplace.css"

const inter = Inter({ subsets: ["latin"] })

export default function EnhancedMarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <NetworkProvider>
          <SolanaWalletProvider>
            {children}
            <Toaster />
          </SolanaWalletProvider>
        </NetworkProvider>
      </ThemeProvider>
    </div>
  )
}
