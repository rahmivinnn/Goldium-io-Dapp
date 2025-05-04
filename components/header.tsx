"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { ChevronDown, Menu, X, Wallet } from "lucide-react"

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { connected } = useSolanaWallet()

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Render a simpler version during SSR to avoid hydration issues
  if (!mounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 mr-2 bg-yellow-500/20 rounded-full"></div>
              <span className="text-yellow-500 font-bold text-xl">Goldium.io</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 rounded-full px-3 py-1">
                <span className="text-white text-sm">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md shadow-md" : "bg-black/50 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/gold_icon-removebg-preview.png" alt="Goldium.io Logo" className="h-8 w-8 mr-2" />
            <span className="text-yellow-500 font-bold text-xl">Goldium.io</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-yellow-500 transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-white hover:text-yellow-500 transition-colors">
              Dashboard
            </Link>
            <Link href="/marketplace" className="text-white hover:text-yellow-500 transition-colors">
              Marketplace
            </Link>
            <div className="relative group">
              <button className="text-white hover:text-yellow-500 transition-colors flex items-center">
                DeFi <ChevronDown className="h-4 w-4 ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-black/90 backdrop-blur-md rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  href="/swap"
                  className="block px-4 py-2 text-sm text-white hover:bg-yellow-500/20 hover:text-yellow-500"
                >
                  Swap
                </Link>
                <Link
                  href="/bridge"
                  className="block px-4 py-2 text-sm text-white hover:bg-yellow-500/20 hover:text-yellow-500"
                >
                  Bridge
                </Link>
                <Link
                  href="/staking-client"
                  className="block px-4 py-2 text-sm text-white hover:bg-yellow-500/20 hover:text-yellow-500"
                >
                  Staking
                </Link>
                <Link
                  href="/burn"
                  className="block px-4 py-2 text-sm text-white hover:bg-yellow-500/20 hover:text-yellow-500"
                >
                  Burn
                </Link>
                <Link
                  href="/wallet-guide"
                  className="block px-4 py-2 text-sm text-white hover:bg-yellow-500/20 hover:text-yellow-500"
                >
                  Wallet Guide
                </Link>
              </div>
            </div>
            <Link href="/games" className="text-white hover:text-yellow-500 transition-colors">
              Games
            </Link>
            <Link href="/governance" className="text-white hover:text-yellow-500 transition-colors">
              Governance
            </Link>
            <Link href="/transactions" className="text-white hover:text-yellow-500 transition-colors">
              Transactions
            </Link>
            <Link href="/adventure-game" className="text-white hover:text-yellow-500 transition-colors">
              3D Adventure
            </Link>
            <Link href="/wallet" className="text-white hover:text-yellow-500 transition-colors flex items-center">
              <Wallet className="h-4 w-4 mr-1" /> Wallet
            </Link>
          </nav>

          {/* Network and Connect Wallet */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 rounded-full px-3 py-1 flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-white text-sm">Mainnet</span>
            </div>
            {connected ? <ConnectWalletButton /> : <WalletConnectButton />}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-white hover:text-yellow-500 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="text-white hover:text-yellow-500 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/marketplace"
                className="text-white hover:text-yellow-500 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <div className="py-2">
                <div className="flex items-center justify-between text-white">
                  <span>DeFi</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="pl-4 mt-2 space-y-2">
                  <Link
                    href="/swap"
                    className="block text-white hover:text-yellow-500 transition-colors py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Swap
                  </Link>
                  <Link
                    href="/bridge"
                    className="block text-white hover:text-yellow-500 transition-colors py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Bridge
                  </Link>
                  <Link
                    href="/staking-client"
                    className="block text-white hover:text-yellow-500 transition-colors py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Staking
                  </Link>
                  <Link
                    href="/burn"
                    className="block text-white hover:text-yellow-500 transition-colors py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Burn
                  </Link>
                  <Link
                    href="/wallet-guide"
                    className="block text-white hover:text-yellow-500 transition-colors py-1"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Wallet Guide
                  </Link>
                </div>
              </div>
              <Link
                href="/games"
                className="text-white hover:text-yellow-500 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Games
              </Link>
              <Link
                href="/governance"
                className="text-white hover:text-yellow-500 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Governance
              </Link>
              <Link
                href="/transactions"
                className="text-white hover:text-yellow-500 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Transactions
              </Link>
              <Link
                href="/adventure-game"
                className="text-white hover:text-yellow-500 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                3D Adventure
              </Link>
              <Link
                href="/wallet"
                className="text-white hover:text-yellow-500 transition-colors py-2 flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Wallet className="h-4 w-4 mr-1" /> Wallet
              </Link>
            </nav>

            {/* Network Status in Mobile Menu */}
            <div className="py-2 flex justify-center">
              <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 rounded-full px-3 py-1 flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                <span className="text-white text-sm">Mainnet</span>
              </div>
            </div>

            <div className="py-2">
              {connected ? <ConnectWalletButton className="w-full" /> : <WalletConnectButton className="w-full" />}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
