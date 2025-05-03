"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallet } from "@/hooks/use-wallet"
import { useToast } from "@/hooks/use-toast"
import { Wallet, Shield, ArrowRight } from "lucide-react"
import { WalletIdentityCard } from "@/components/wallet-identity-card"
import { ConnectWalletButton } from "@/components/connect-wallet-button"

export function WalletAuth() {
  const { connected, connecting, address, connect, disconnect } = useWallet()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [authMethod, setAuthMethod] = useState<"wallet" | "social">("wallet")
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum")

  // Shorten wallet address for display
  const shortenAddress = (addr: string | null) => {
    if (!addr) return ""
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Copy address to clipboard
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  // Get explorer link based on selected network
  const getExplorerLink = () => {
    if (!address) return "#"

    switch (selectedNetwork) {
      case "ethereum":
        return `https://etherscan.io/address/${address}`
      case "solana":
        return `https://solscan.io/account/${address}`
      case "bsc":
        return `https://bscscan.com/address/${address}`
      default:
        return `https://etherscan.io/address/${address}`
    }
  }

  // Handle network change
  const handleNetworkChange = (network: string) => {
    setSelectedNetwork(network)
    toast({
      title: "Network Changed",
      description: `Switched to ${network.charAt(0).toUpperCase() + network.slice(1)} network`,
    })
  }

  return (
    <Card className="border-gold bg-black w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-gold">Wallet Authentication</CardTitle>
        <CardDescription>Connect your wallet to access all features</CardDescription>
      </CardHeader>

      <CardContent>
        {!connected ? (
          <Tabs defaultValue="wallet" onValueChange={(v) => setAuthMethod(v as "wallet" | "social")}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="wallet" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <Wallet className="mr-2 h-4 w-4" />
                Wallet
              </TabsTrigger>
              <TabsTrigger value="social" className="data-[state=active]:bg-gold data-[state=active]:text-black">
                <Shield className="mr-2 h-4 w-4" />
                Social Login
              </TabsTrigger>
            </TabsList>

            <TabsContent value="wallet">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={selectedNetwork === "ethereum" ? "default" : "outline"}
                    className={selectedNetwork === "ethereum" ? "bg-blue-500 hover:bg-blue-600" : ""}
                    onClick={() => handleNetworkChange("ethereum")}
                  >
                    Ethereum
                  </Button>
                  <Button
                    variant={selectedNetwork === "solana" ? "default" : "outline"}
                    className={selectedNetwork === "solana" ? "bg-purple-500 hover:bg-purple-600" : ""}
                    onClick={() => handleNetworkChange("solana")}
                  >
                    Solana
                  </Button>
                  <Button
                    variant={selectedNetwork === "bsc" ? "default" : "outline"}
                    className={selectedNetwork === "bsc" ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}
                    onClick={() => handleNetworkChange("bsc")}
                  >
                    BSC
                  </Button>
                </div>

                <ConnectWalletButton className="w-full" />

                <div className="text-xs text-gray-400 text-center">
                  By connecting, you agree to our Terms of Service
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social">
              <div className="space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Continue with Google</Button>
                <Button className="w-full bg-gray-700 hover:bg-gray-800">Continue with Discord</Button>
                <Button className="w-full bg-blue-400 hover:bg-blue-500">Continue with Twitter</Button>
                <div className="text-xs text-gray-400 text-center">
                  Social login creates a wallet for you automatically
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <WalletIdentityCard />
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t border-gold/20 pt-4">
        <Button variant="link" className="text-gray-400 hover:text-gold p-0">
          Need help?
        </Button>
        <Button variant="link" className="text-gold p-0">
          View Dashboard <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
