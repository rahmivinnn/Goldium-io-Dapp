"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react"
import { PhantomLogo } from "./phantom-logo"

interface WalletConnectionGuideProps {
  onClose?: () => void
  onConnect?: () => void
}

export function WalletConnectionGuide({ onClose, onConnect }: WalletConnectionGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Install Phantom Wallet",
      description: "If you don't have Phantom wallet installed, you'll need to add it to your browser first.",
      icon: (
        <div className="flex justify-center">
          <PhantomLogo size={60} />
        </div>
      ),
      action: (
        <Button
          onClick={() => window.open("https://phantom.app/download", "_blank")}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Download className="h-4 w-4" /> Download Phantom
        </Button>
      ),
    },
    {
      title: "Create or Import a Wallet",
      description: "Open Phantom and either create a new wallet or import an existing one with your seed phrase.",
      icon: (
        <div className="flex justify-center">
          <PhantomLogo size={60} />
        </div>
      ),
      action: null,
    },
    {
      title: "Connect to Goldium.io",
      description: "Click the 'Connect Wallet' button and approve the connection request in the Phantom popup.",
      icon: (
        <div className="flex justify-center">
          <PhantomLogo size={60} />
        </div>
      ),
      action: (
        <Button
          onClick={onConnect}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
        >
          Connect Wallet
        </Button>
      ),
    },
    {
      title: "Approve Permissions",
      description: "Phantom will ask for permission to connect to Goldium.io. Review and approve the request.",
      icon: (
        <div className="flex justify-center">
          <PhantomLogo size={60} />
        </div>
      ),
      action: null,
    },
    {
      title: "You're Connected!",
      description: "Your wallet is now connected to Goldium.io. You can now access all features of the platform.",
      icon: (
        <div className="flex justify-center">
          <PhantomLogo size={60} />
        </div>
      ),
      action: (
        <Button onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white">
          Start Using Goldium
        </Button>
      ),
    },
  ]

  const currentStepData = steps[currentStep]

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <Card className="w-full max-w-md border-yellow-500/30 bg-black text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-yellow-500">Connect Your Wallet</h3>
          <div className="text-sm text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        <div className="relative h-[200px] w-full mb-6 bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
          {currentStepData.icon}
        </div>

        <h4 className="text-lg font-semibold mb-2">{currentStepData.title}</h4>
        <p className="text-gray-300 mb-6">{currentStepData.description}</p>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={goToPrevStep}
            disabled={currentStep === 0}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>

          <div className="flex-1 flex justify-center">{currentStepData.action}</div>

          <Button
            variant="outline"
            onClick={goToNextStep}
            disabled={currentStep === steps.length - 1}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full ${index === currentStep ? "bg-yellow-500" : "bg-gray-700"}`}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <a
              href="https://phantom.app/learn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-yellow-500 hover:text-yellow-400 flex items-center"
            >
              Learn more about Phantom <ExternalLink className="h-3 w-3 ml-1" />
            </a>

            <Button variant="ghost" onClick={onClose} className="text-sm text-gray-400 hover:text-white">
              Skip guide
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
