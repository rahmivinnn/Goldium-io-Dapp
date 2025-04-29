"use client"

import type React from "react"
import { Inter, Cinzel, Uncial_Antiqua } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { WalletProvider } from "@/components/wallet-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ErrorBoundary } from "react-error-boundary"
import { Button } from "@/components/ui/button"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel", weight: ["400", "500", "600", "700"] })
const uncialAntiqua = Uncial_Antiqua({ subsets: ["latin"], variable: "--font-uncial", weight: "400" })

// Create a fallback component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h2 className="text-2xl font-bold text-gold mb-4">Something went wrong</h2>
      <p className="text-gray-400 mb-6">{error.message}</p>
      <Button onClick={resetErrorBoundary} className="gold-button">
        Try again
      </Button>
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${cinzel.variable} ${uncialAntiqua.variable} font-sans bg-black text-white min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <WalletProvider>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </ErrorBoundary>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
