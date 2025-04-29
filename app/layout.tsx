import type React from "react"
import type { Metadata } from "next"
import { Inter, Cinzel } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import Footer from "@/components/footer"
import NotificationCenter from "@/components/notification-center"
import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/components/wallet-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "Fantasy NFT Marketplace",
  description: "Trade unique fantasy NFTs using GOLD tokens",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cinzel.variable} font-sans bg-black text-white min-h-screen flex flex-col`}>
        <WalletProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <NotificationCenter />
            <Toaster />
          </ThemeProvider>
        </WalletProvider>
      </body>
    </html>
  )
}
