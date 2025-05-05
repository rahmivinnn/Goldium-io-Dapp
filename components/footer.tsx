import Link from "next/link"
import { Github, Twitter, DiscIcon as Discord } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black/80 border-t border-yellow-500/20 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img src="/gold_icon-removebg-preview.png" alt="Goldium.io Logo" className="h-8 w-8 mr-2" />
              <span className="text-yellow-500 font-bold text-xl">Goldium.io</span>
            </div>
            <p className="text-gray-400 text-sm">
              A Web3 platform for GOLD token transactions, staking, and gaming on the Solana blockchain.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://twitter.com/goldium"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://discord.gg/goldium"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <Discord className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/goldium"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/games" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Games
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">DeFi</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/send" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Send GOLD
                </Link>
              </li>
              <li>
                <Link href="/faucet" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Faucet
                </Link>
              </li>
              <li>
                <Link href="/staking" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Staking
                </Link>
              </li>
              <li>
                <Link href="/transactions" className="text-gray-400 hover:text-yellow-500 transition-colors">
                  Transactions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://explorer.solana.com/address/APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  GOLD Token
                </a>
              </li>
              <li>
                <a
                  href="https://docs.solana.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  Solana Docs
                </a>
              </li>
              <li>
                <a
                  href="https://phantom.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  Phantom Wallet
                </a>
              </li>
              <li>
                <a
                  href="https://solflare.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-500 transition-colors"
                >
                  Solflare Wallet
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-yellow-500/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Goldium.io. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-yellow-500 transition-colors text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
