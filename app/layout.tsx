import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { SolanaWalletProvider } from "@/contexts/solana-wallet-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Goldium.io - Web3 Gaming & DeFi Platform",
  description: "Experience the future of gaming with Goldium.io - Play, earn, and trade in our Web3 ecosystem.",
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
        <ThemeProvider attribute="class" defaultTheme="dark">
          <SolanaWalletProvider>
            <div className="flex flex-col min-h-screen bg-black text-white">
              <Header />
              <main className="flex-grow pt-16">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </SolanaWalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
