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
import Script from "next/script"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Goldium - Web3 Gaming & DeFi Platform",
  description: "The next generation Web3 platform for gaming, NFTs, and DeFi",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Add Phantom detection script */}
        <Script id="phantom-detection" strategy="beforeInteractive">
          {`
            console.log("Initializing Phantom detection...");
            
            function checkForPhantom() {
              if (window.solana && window.solana.isPhantom) {
                console.log("✅ Phantom wallet detected!");
                window.phantomDetected = true;
                
                // Dispatch a custom event that our React app can listen for
                const event = new CustomEvent('phantomDetected', { detail: true });
                window.dispatchEvent(event);
                
                return true;
              } else {
                console.log("❌ Phantom wallet not detected");
                window.phantomDetected = false;
                return false;
              }
            }
            
            // Check immediately
            checkForPhantom();
            
            // Also check after window load
            window.addEventListener('load', function() {
              checkForPhantom();
            });
            
            // Check periodically for a few seconds to handle delayed injection
            let checkCount = 0;
            const phantomCheckInterval = setInterval(function() {
              if (checkForPhantom() || checkCount > 10) {
                clearInterval(phantomCheckInterval);
              }
              checkCount++;
            }, 300);
          `}
        </Script>
      </head>
      <body className={`${inter.className} min-h-screen bg-black text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NetworkProvider>
            <SolanaWalletProvider>
              <ScrollProgress />
              <AnimatedBackground />
              <CustomCursor />
              <div className="flex flex-col min-h-screen">
                <Header />
                <div className="flex-grow">{children}</div>
                <Footer />
              </div>
              <NotificationCenter />
              <ScrollToTopButton />
              <Toaster />
            </SolanaWalletProvider>
          </NetworkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
