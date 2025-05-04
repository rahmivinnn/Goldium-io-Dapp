import type React from "react"
import type { Metadata } from "next"
import { Inter, Cinzel } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AnimatedBackground from "@/components/animated-background"
import CustomCursor from "@/components/custom-cursor"
import { SolanaWalletProvider } from "@/contexts/solana-wallet-context"
import { NetworkProvider } from "@/contexts/network-context"
import { ScrollProgress, ScrollToTopButton } from "@/components/ui/scroll-progress"
import NotificationCenter from "@/components/notification-center"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Goldium.io - Web3 Fantasy DApp",
  description:
    "Experience the future of decentralized finance with GOLD token economy, fantasy-themed NFTs, and games.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cinzel.variable} font-sans text-white min-h-screen flex flex-col`}>
        <NetworkProvider>
          <SolanaWalletProvider>
            <ScrollProgress />
            <AnimatedBackground />
            <CustomCursor />
            <Header />
            <main className="flex-grow pt-24">{children}</main>
            <Footer />
            <NotificationCenter />
            <ScrollToTopButton />
            <Toaster />
          </SolanaWalletProvider>
        </NetworkProvider>
      </body>
    </html>
  )
}
