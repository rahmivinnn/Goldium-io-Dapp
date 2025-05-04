"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { useSolanaWallet } from "@/contexts/solana-wallet-context"
import { ConnectWalletButton } from "@/components/connect-wallet-button"

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { connected } = useSolanaWallet()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when path changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/games", label: "Games" },
    { href: "/defi", label: "DeFi" },
    { href: "/staking", label: "Staking" },
  ]

  // Add conditional links that only show when connected
  const connectedLinks = [
    { href: "/my-nfts", label: "My NFTs" },
    { href: "/transactions", label: "Transactions" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-10 mr-2">
              <Image
                src="/gold_icon-removebg-preview.png"
                alt="Goldium Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-gold font-bold text-xl">Goldium</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href ? "text-gold bg-gold/10" : "text-gray-300 hover:text-gold hover:bg-gold/10"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Show conditional links when connected */}
            {connected &&
              connectedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === link.href ? "text-gold bg-gold/10" : "text-gray-300 hover:text-gold hover:bg-gold/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
          </nav>

          {/* Connect Wallet Button */}
          <div className="hidden md:block">
            <ConnectWalletButton
              variant="default"
              showIdentityCard={false}
              className="bg-gold-500 hover:bg-gold-600 text-black font-medium border-gold-600"
              size="sm"
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <ConnectWalletButton
              variant="default"
              size="sm"
              showIdentityCard={false}
              className="bg-gold-500 hover:bg-gold-600 text-black font-medium border-gold-600"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gold"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-2">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === link.href ? "text-gold bg-gold/10" : "text-gray-300 hover:text-gold hover:bg-gold/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Show conditional links when connected */}
              {connected &&
                connectedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === link.href ? "text-gold bg-gold/10" : "text-gray-300 hover:text-gold hover:bg-gold/10"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
