"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { WalletConnectOverlay } from "@/components/wallet-connect-overlay"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Upload, ImageIcon, X, Check, Loader2 } from "lucide-react"

export function NFTMinting() {
  const { connected } = useWallet()
  const { toast } = useToast()
  const [mintingStep, setMintingStep] = useState<"upload" | "details" | "preview" | "minting" | "success">("upload")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [nftDetails, setNftDetails] = useState({
    name: "",
    description: "",
    attributes: [
      { trait_type: "Rarity", value: "Common" },
      { trait_type: "Type", value: "Weapon" },
    ],
  })
  const [mintingStatus, setMintingStatus] = useState<"idle" | "processing" | "success" | "error">("idle")

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPEG, PNG, GIF, etc.)",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    // Create object URL for preview
    const imageUrl = URL.createObjectURL(file)
    setUploadedImage(imageUrl)

    // Move to next step
    setMintingStep("details")
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNftDetails((prev) => ({ ...prev, [name]: value }))
  }

  // Handle attribute change
  const handleAttributeChange = (index: number, field: "trait_type" | "value", value: string) => {
    setNftDetails((prev) => {
      const newAttributes = [...prev.attributes]
      newAttributes[index] = { ...newAttributes[index], [field]: value }
      return { ...prev, attributes: newAttributes }
    })
  }

  // Add new attribute
  const addAttribute = () => {
    setNftDetails((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: "", value: "" }],
    }))
  }

  // Remove attribute
  const removeAttribute = (index: number) => {
    setNftDetails((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!nftDetails.name.trim()) {
      toast({
        title: "Missing Name",
        description: "Please enter a name for your NFT",
        variant: "destructive",
      })
      return
    }

    // Move to preview step
    setMintingStep("preview")
  }

  // Start minting process
  const startMinting = () => {
    setMintingStep("minting")
    setMintingStatus("processing")

    // Simulate minting process
    setTimeout(() => {
      setMintingStatus("success")

      toast({
        title: "NFT Minted Successfully",
        description: "Your NFT has been minted and added to your collection",
      })

      // Move to success step
      setTimeout(() => {
        setMintingStep("success")
      }, 1000)
    }, 3000)
  }

  // Reset form
  const resetForm = () => {
    setMintingStep("upload")
    setUploadedImage(null)
    setNftDetails({
      name: "",
      description: "",
      attributes: [
        { trait_type: "Rarity", value: "Common" },
        { trait_type: "Type", value: "Weapon" },
      ],
    })
    setMintingStatus("idle")
  }

  if (!connected) {
    return (
      <Card className="border-gold bg-black w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>NFT Minting</CardTitle>
          <CardDescription>Create your own unique NFT</CardDescription>
        </CardHeader>
        <CardContent>
          <WalletConnectOverlay message="Connect your wallet to mint NFTs" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gold bg-black w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>NFT Minting</CardTitle>
        <CardDescription>Create your own unique NFT on the blockchain</CardDescription>
      </CardHeader>

      <CardContent>
        {mintingStep === "upload" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center p-8"
          >
            <div className="w-48 h-48 border-2 border-dashed border-gold/50 rounded-lg flex flex-col items-center justify-center mb-6">
              <Upload className="h-12 w-12 text-gold/50 mb-2" />
              <p className="text-sm text-gray-400 text-center">
                Drag & drop your image here
                <br />
                or click to browse
              </p>
            </div>

            <input type="file" id="nft-image" accept="image/*" className="hidden" onChange={handleFileUpload} />
            <label htmlFor="nft-image">
              <Button className="gold-button" asChild>
                <span>Upload Image</span>
              </Button>
            </label>

            <div className="mt-4 text-xs text-gray-400">
              Supported formats: JPEG, PNG, GIF, WEBP
              <br />
              Maximum size: 10MB
            </div>
          </motion.div>
        )}

        {mintingStep === "details" && uploadedImage && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="aspect-square rounded-lg overflow-hidden mb-4">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="NFT Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-gold/50 text-gold hover:bg-gold/10"
                    onClick={() => setMintingStep("upload")}
                  >
                    Change Image
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={nftDetails.name}
                      onChange={handleInputChange}
                      className="w-full bg-black border border-gold/50 rounded-md px-3 py-2 focus:border-gold focus:outline-none"
                      placeholder="Enter NFT name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      value={nftDetails.description}
                      onChange={handleInputChange}
                      className="w-full bg-black border border-gold/50 rounded-md px-3 py-2 focus:border-gold focus:outline-none min-h-[100px]"
                      placeholder="Describe your NFT"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Attributes</label>
                    <div className="space-y-2">
                      {nftDetails.attributes.map((attr, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            value={attr.trait_type}
                            onChange={(e) => handleAttributeChange(index, "trait_type", e.target.value)}
                            className="flex-1 bg-black border border-gold/50 rounded-md px-3 py-2 focus:border-gold focus:outline-none"
                            placeholder="Trait name"
                          />
                          <input
                            type="text"
                            value={attr.value}
                            onChange={(e) => handleAttributeChange(index, "value", e.target.value)}
                            className="flex-1 bg-black border border-gold/50 rounded-md px-3 py-2 focus:border-gold focus:outline-none"
                            placeholder="Value"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-500"
                            onClick={() => removeAttribute(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full border-gold/50 text-gold hover:bg-gold/10"
                        onClick={addAttribute}
                      >
                        Add Attribute
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gold/50 text-gold hover:bg-gold/10"
                  onClick={() => setMintingStep("upload")}
                >
                  Back
                </Button>
                <Button type="submit" className="gold-button">
                  Continue
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {mintingStep === "preview" && uploadedImage && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="aspect-square rounded-lg overflow-hidden mb-4 border-2 border-gold">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="NFT Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gold">{nftDetails.name}</h3>
                  <p className="text-gray-400 mt-1">{nftDetails.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Attributes</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {nftDetails.attributes.map((attr, index) => (
                      <div key={index} className="bg-gold/10 rounded-md p-2">
                        <div className="text-xs text-gray-400">{attr.trait_type}</div>
                        <div className="font-medium">{attr.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gold/5 rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-2">Minting Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Network</span>
                      <span>Ethereum</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Standard</span>
                      <span>ERC-721</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Minting Fee</span>
                      <span className="text-gold">0.01 ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gas Estimate</span>
                      <span>~0.003 ETH</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <Button
                type="button"
                variant="outline"
                className="border-gold/50 text-gold hover:bg-gold/10"
                onClick={() => setMintingStep("details")}
              >
                Back
              </Button>
              <Button className="gold-button" onClick={startMinting}>
                Mint NFT
              </Button>
            </div>
          </motion.div>
        )}

        {mintingStep === "minting" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-12"
          >
            {mintingStatus === "processing" && (
              <>
                <Loader2 className="h-16 w-16 text-gold animate-spin mb-6" />
                <h3 className="text-xl font-bold mb-2">Minting Your NFT</h3>
                <p className="text-gray-400 text-center max-w-md mb-6">
                  Please wait while we mint your NFT on the blockchain. This process may take a few moments.
                </p>
                <div className="w-full max-w-md bg-gray-800 rounded-full h-2.5 mb-4">
                  <motion.div
                    className="bg-gold h-2.5 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3 }}
                  ></motion.div>
                </div>
                <p className="text-sm text-gray-400">Do not close this window</p>
              </>
            )}

            {mintingStatus === "success" && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mb-6"
                >
                  <Check className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold mb-2">NFT Minted Successfully!</h3>
                <p className="text-gray-400 text-center max-w-md">
                  Your NFT has been successfully minted and added to your collection.
                </p>
              </>
            )}
          </motion.div>
        )}

        {mintingStep === "success" && uploadedImage && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="aspect-square w-48 rounded-lg overflow-hidden mb-4 border-2 border-gold">
                <img src={uploadedImage || "/placeholder.svg"} alt="NFT" className="w-full h-full object-cover" />
              </div>

              <h3 className="text-xl font-bold text-gold mb-2">{nftDetails.name}</h3>
              <p className="text-gray-400 text-center max-w-md mb-6">
                Your NFT has been successfully minted and is now part of your collection.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <Button className="gold-button">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  View in Collection
                </Button>
                <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10">
                  Share NFT
                </Button>
                <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10" onClick={resetForm}>
                  Mint Another
                </Button>
              </div>

              <div className="mt-6 w-full max-w-md">
                <div className="bg-gold/5 rounded-lg p-4">
                  <h4 className="text-sm font-medium mb-2">Transaction Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Transaction Hash</span>
                      <a href="#" className="text-gold hover:underline truncate max-w-[200px]">
                        0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Token ID</span>
                      <span>1234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Contract Address</span>
                      <a href="#" className="text-gold hover:underline truncate max-w-[200px]">
                        0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
