import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Twitter, Github, DiscIcon as Discord, Globe, Mail, Shield, FileText, HelpCircle } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gold/20 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Goldium.io</h3>
            <p className="text-gray-400 mb-4">
              Experience the future of decentralized finance with GOLD token economy, fantasy-themed NFTs, and games.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" className="rounded-full border-gold/50 text-gold hover:bg-gold/10">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-gold/50 text-gold hover:bg-gold/10">
                <Discord className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-gold/50 text-gold hover:bg-gold/10">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full border-gold/50 text-gold hover:bg-gold/10">
                <Globe className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/marketplace" className="text-gray-400 hover:text-gold">
                  NFT Marketplace
                </Link>
              </li>
              <li>
                <Link href="/staking" className="text-gray-400 hover:text-gold">
                  GOLD Staking
                </Link>
              </li>
              <li>
                <Link href="/games" className="text-gray-400 hover:text-gold">
                  Games
                </Link>
              </li>
              <li>
                <Link href="/swap" className="text-gray-400 hover:text-gold">
                  Token Swap
                </Link>
              </li>
              <li>
                <Link href="/referrals" className="text-gray-400 hover:text-gold">
                  Referral Program
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-gold">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/whitepaper" className="text-gray-400 hover:text-gold">
                  Whitepaper
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="text-gray-400 hover:text-gold">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-gold">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-gold">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-gold flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-gold flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-gold flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-gold flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold/10 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Goldium.io. All rights reserved.
          </p>
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gold">
              Terms
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gold">
              Privacy
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gold">
              Cookies
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
