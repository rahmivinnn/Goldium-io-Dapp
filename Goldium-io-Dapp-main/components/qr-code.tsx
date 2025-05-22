"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QRCodeProps {
  value: string
  size?: number
  color?: string
  bgColor?: string
  className?: string
  tokenName?: string
}

export function QRCode({
  value,
  size = 200,
  color = "#000000",
  bgColor = "#ffffff",
  className = "",
  tokenName = "Token",
}: QRCodeProps) {
  const [qrCodeSrc, setQrCodeSrc] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Use a simple QR code API service instead of a library
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
      value,
    )}&size=${size}x${size}&color=${encodeURIComponent(color.replace("#", ""))}&bgcolor=${encodeURIComponent(
      bgColor.replace("#", ""),
    )}`

    setQrCodeSrc(qrApiUrl)
    setIsLoading(false)
  }, [value, size, color, bgColor])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    toast({
      title: "Address Copied",
      description: `${tokenName} contract address copied to clipboard`,
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQRCode = () => {
    if (!qrCodeSrc) return

    // Create a temporary link and trigger download
    const link = document.createElement("a")
    link.href = qrCodeSrc
    link.download = `${tokenName.toLowerCase()}-contract-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "QR Code Downloaded",
      description: `${tokenName} QR code has been downloaded`,
    })
  }

  if (!mounted || isLoading) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="animate-pulse bg-gray-300 w-3/4 h-3/4 rounded-lg"></div>
      </div>
    )
  }

  return (
    <Card className={`p-4 bg-white rounded-lg ${className}`}>
      <div className="flex flex-col items-center">
        <div className="relative">
          <img
            src={qrCodeSrc || "/placeholder.svg"}
            alt={`QR Code for ${tokenName} contract`}
            width={size}
            height={size}
            className="rounded-md"
            onError={() => {
              // Fallback if the QR API fails
              setQrCodeSrc(`/placeholder.svg?height=${size}&width=${size}&query=QR%20Code%20for%20${tokenName}`)
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-20 hover:opacity-0 transition-opacity">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              <span className="text-2xl font-bold" style={{ color }}>
                {tokenName.substring(0, 1)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-600 mb-2">{tokenName} Contract Address</p>
          <p className="text-xs font-mono text-gray-800 truncate max-w-[180px]">{value}</p>
        </div>
        <div className="flex gap-2 mt-3">
          <Button size="sm" variant="outline" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
          <Button size="sm" variant="outline" onClick={downloadQRCode}>
            <Download className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
    </Card>
  )
}
