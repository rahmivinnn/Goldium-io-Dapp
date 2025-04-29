"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { useWallet } from "@/hooks/use-wallet"
import { Menu, Home, ShoppingBag, Coins, Sword, Repeat, User, Bell, Settings } from "lucide-react"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: User, requiresAuth: true },
  { name: "Marketplace", href: "/marketplace", icon: ShoppingBag, requiresAuth: true },
  { name: "Staking", href: "/staking", icon: Coins, requiresAuth: true },
  { name: "Games", href: "/games", icon: Sword, requiresAuth: true },
  { name: "Swap", href: "/swap", icon: Repeat, requiresAuth: true },
]

// Initialize state outside the component to avoid conditional hook call
const initialMobileMenuOpen = false

export default function Header() {
  const pathname = usePathname()
  const { connected } = useWallet()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(initialMobileMenuOpen)

  // Close mobile menu after navigation
  const handleMobileNavigation = useCallback((href: string) => {
    setMobileMenuOpen(false)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-dark-400/80 backdrop-blur-md border-b border-gold-500/10" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/" className="flex items-center">
              <div className="relative h-10 w-10 mr-2">
                <Image src="/golden-g-logo.png" alt="Goldium.io" width={40} height={40} className="object-contain" />
              </div>
              <span className="text-xl font-bold gold-gradient-text">Goldium.io</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              if (item.requiresAuth && !connected) return null

              return (
                <motion.div key={item.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      pathname === item.href
                        ? "bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-dark-900"
                        : "text-gray-300 hover:bg-dark-300 hover:text-gold-400"
                    }`}
                  >
                    <span className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </nav>

          <div className="flex items-center space-x-2">
            {connected && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="hidden md:flex space-x-2"
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gold-500/30 text-gold-500 hover:bg-dark-300 hover:border-gold-500"
                    >
                      <Bell className="h-5 w-5" />
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gold-500/30 text-gold-500 hover:bg-dark-300 hover:border-gold-500"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ConnectWalletButton />
            </motion.div>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden border-gold-500/30 text-gold-500 hover:bg-dark-300 hover:border-gold-500"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent className="bg-dark-400/95 border-gold-500/20 backdrop-blur-lg">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, staggerChildren: 0.1 }}
                  className="flex flex-col space-y-4 mt-8"
                >
                  {navigation.map((item, index) => {
                    if (item.requiresAuth && !connected) return null

                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 5 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => handleMobileNavigation(item.href)}
                          className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                            pathname === item.href
                              ? "bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-dark-900"
                              : "text-gray-300 hover:bg-dark-300 hover:text-gold-400"
                          }`}
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </Link>
                      </motion.div>
                    )
                  })}

                  {connected && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: navigation.length * 0.05 }}
                        whileHover={{ x: 5 }}
                      >
                        <Link
                          href="/notifications"
                          onClick={() => handleMobileNavigation("/notifications")}
                          className="flex items-center px-3 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-dark-300 hover:text-gold-400"
                        >
                          <Bell className="mr-3 h-5 w-5" />
                          Notifications
                        </Link>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navigation.length + 1) * 0.05 }}
                        whileHover={{ x: 5 }}
                      >
                        <Link
                          href="/settings"
                          onClick={() => handleMobileNavigation("/settings")}
                          className="flex items-center px-3 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-dark-300 hover:text-gold-400"
                        >
                          <Settings className="mr-3 h-5 w-5" />
                          Settings
                        </Link>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
