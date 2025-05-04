"use client"

import { useParams } from "next/navigation"
import { QRCode } from "@/components/qr-code"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function TokenQRPage() {
  const params = useParams()
  const { address } = params
  const [tokenName, setTokenName] = useState("Token")
  const [tokenColor, setTokenColor] = useState("#F59E0B")
  const { toast } = useToast()

  useEffect(() => {
    // Determine token name and color based on address
    if (typeof address === "string") {
      if (address === "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump") {
        setTokenName("GOLD")
        setTokenColor("#F59E0B")
      } else if (address === "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey") {
        setTokenName("MANA")
        setTokenColor("#3B82F6")
      }
    }
  }, [address])

  const copyToClipboard = () => {
    if (typeof address === "string") {
      navigator.clipboard.writeText(address)
      toast({
        title: "Address Copied",
        description: `${tokenName} contract address copied to clipboard`,
      })
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Link href="/" className="flex items-center text-gray-400 hover:text-white mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <Card className="max-w-md mx-auto bg-black/70 border-gray-800">
        <CardHeader>
          <CardTitle className="text-center" style={{ color: tokenColor }}>
            {tokenName} Token QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {typeof address === "string" && (
            <QRCode value={address} tokenName={tokenName} size={280} color={tokenColor} className="mb-6" />
          )}

          <div className="text-center mb-6">
            <p className="text-gray-400 mb-2">Scan this QR code to get the contract address</p>
            <p className="text-sm text-gray-500 font-mono break-all">{address}</p>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={copyToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Address
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
