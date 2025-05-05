import type React from "react"
import type { Metadata } from "next"
import { Inter, Orbitron } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { WalletProvider } from "@/components/wallet-provider"
import { NetworkProvider } from "@/contexts/network-context"
import { SolanaWalletProvider } from "@/contexts/solana-wallet-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" })

export const metadata: Metadata = {
  title: "Goldium.io - Web3 DApp for GOLD Token",
  description: "Stake, send, and play with GOLD tokens on the Solana blockchain",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${orbitron.variable} font-sans bg-black text-white min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <NetworkProvider>
            <SolanaWalletProvider>
              <WalletProvider>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow pt-16">{children}</main>
                  <Footer />
                </div>
                <Toaster />
              </WalletProvider>
            </SolanaWalletProvider>
          </NetworkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
