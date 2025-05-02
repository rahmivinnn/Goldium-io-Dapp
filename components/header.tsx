"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { ConnectWalletButton } from "./connect-wallet-button"
import { useMobile } from "@/hooks/use-mobile"
import { useWallet } from "@/components/wallet-provider"
import { NetworkSwitcher } from "./network-switcher"
import Image from "next/image"
import { useNetwork } from "@/contexts/network-context"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()
  const { connected } = useWallet()
  const { isTestnet } = useNetwork()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Marketplace", href: "/marketplace" },
    {
      name: "DeFi",
      href: "/defi",
      dropdown: true,
      items: [
        { name: "DeFi Hub", href: "/defi" },
        { name: "Swap", href: "/swap" },
        { name: "Staking", href: "/staking" },
      ],
    },
    { name: "Games", href: "/games" },
    { name: "Governance", href: "/governance" },
    { name: "Transactions", href: "/transactions" },
  ]

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/gold_icon-removebg-preview.png"
                alt="Goldium.io Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">
                Goldium.io
              </span>
            </Link>
            {isTestnet && (
              <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded bg-amber-500/20 text-amber-500">
                Testnet
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.name} className="relative">
                  <div className="flex items-center">
                    <Link
                      href={link.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname === link.href ? "text-amber-400" : "text-gray-300 hover:text-amber-300"
                      }`}
                    >
                      {link.name}
                    </Link>
                    <button
                      onClick={() => toggleDropdown(link.name)}
                      className="p-1 text-gray-300 hover:text-amber-300 focus:outline-none"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  {openDropdown === link.name && (
                    <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md rounded-md shadow-lg py-1 z-50 border border-amber-500/30">
                      {link.items?.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-amber-500/10 hover:text-amber-300"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === link.href ? "text-amber-400" : "text-gray-300 hover:text-amber-300"
                  }`}
                >
                  {link.name}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <NetworkSwitcher />
            <ConnectWalletButton />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      className={`flex-grow px-3 py-2 rounded-md text-base font-medium ${
                        pathname === link.href ? "text-amber-400" : "text-gray-300 hover:text-amber-300"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                    <button
                      onClick={() => toggleDropdown(link.name)}
                      className="px-3 py-2 text-gray-300 hover:text-amber-300 focus:outline-none"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  {openDropdown === link.name && (
                    <div className="pl-4 space-y-1 border-l-2 border-amber-500/30 ml-3">
                      {link.items?.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-amber-300"
                          onClick={() => {
                            setOpenDropdown(null)
                            setIsOpen(false)
                          }}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    pathname === link.href ? "text-amber-400" : "text-gray-300 hover:text-amber-300"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ),
            )}
            <div className="pt-4 flex flex-col space-y-3">
              <NetworkSwitcher />
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
