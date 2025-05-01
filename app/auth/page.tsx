"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Shield, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function AuthPage() {
  const { toast } = useToast()
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleWalletConnect = async (walletType: string) => {
    setIsConnecting(true)

    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsConnecting(false)
    toast({
      title: "Wallet Connected",
      description: `Successfully connected ${walletType} wallet`,
    })
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigningIn(true)

    // Simulate email sign-in
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSigningIn(false)
    toast({
      title: "Verification Email Sent",
      description: "Please check your inbox for a verification link",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 p-4">
      <Card className="w-full max-w-md border-yellow-500/20 bg-black/80 backdrop-blur-sm text-white">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 relative w-16 h-16">
            <Image src="/gold-logo.png" alt="Goldium Logo" fill className="object-contain" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">
            Welcome to Goldium
          </CardTitle>
          <CardDescription className="text-gray-400">
            Connect your wallet or sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="wallet" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="wallet" className="data-[state=active]:bg-amber-500">
                Wallet
              </TabsTrigger>
              <TabsTrigger value="email" className="data-[state=active]:bg-amber-500">
                Email
              </TabsTrigger>
            </TabsList>

            <TabsContent value="wallet">
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-between border-yellow-500/20 hover:border-yellow-500/50 hover:bg-yellow-500/10"
                  onClick={() => handleWalletConnect("MetaMask")}
                  disabled={isConnecting}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 mr-3 rounded-full bg-orange-100 flex items-center justify-center">
                      <span className="text-orange-500 text-xs font-bold">M</span>
                    </div>
                    MetaMask
                  </div>
                  {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between border-yellow-500/20 hover:border-yellow-500/50 hover:bg-yellow-500/10"
                  onClick={() => handleWalletConnect("WalletConnect")}
                  disabled={isConnecting}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 mr-3 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-500 text-xs font-bold">W</span>
                    </div>
                    WalletConnect
                  </div>
                  {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between border-yellow-500/20 hover:border-yellow-500/50 hover:bg-yellow-500/10"
                  onClick={() => handleWalletConnect("Coinbase")}
                  disabled={isConnecting}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 mr-3 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-500 text-xs font-bold">C</span>
                    </div>
                    Coinbase Wallet
                  </div>
                  {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between border-yellow-500/20 hover:border-yellow-500/50 hover:bg-yellow-500/10"
                  onClick={() => handleWalletConnect("Ledger")}
                  disabled={isConnecting}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 mr-3 rounded-full bg-black flex items-center justify-center">
                      <span className="text-white text-xs font-bold">L</span>
                    </div>
                    Ledger
                  </div>
                  {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="email">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      className="pl-10 bg-transparent border-yellow-500/20 focus:border-yellow-500/50"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                  disabled={isSigningIn}
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Link...
                    </>
                  ) : (
                    <>Sign in with Email</>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Separator className="bg-yellow-500/20" />
          <div className="text-xs text-center text-gray-400">
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-3 w-3 mr-1" />
              <span>Secure, non-custodial login</span>
            </div>
            <p>By connecting, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
