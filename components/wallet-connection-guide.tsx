"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react"

interface WalletConnectionGuideProps {
  onClose?: () => void
  onConnect?: () => void
}

export function WalletConnectionGuide({ onClose, onConnect }: WalletConnectionGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)

  // Phantom ghost icon SVG
  const PhantomGhostIcon = () => (
    <div className="w-24 h-24 flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800 rounded-full p-5">
      <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          d="M103.3 71.4c-13.4 0-24.3-10.9-24.3-24.3 0-13.4 10.9-24.3 24.3-24.3 13.4 0 24.3 10.9 24.3 24.3 0 13.4-10.9 24.3-24.3 24.3z"
          fill="white"
        />
        <path
          d="M24.7 71.4c-13.4 0-24.3-10.9-24.3-24.3 0-13.4 10.9-24.3 24.3-24.3 13.4 0 24.3 10.9 24.3 24.3 0 13.4-10.9 24.3-24.3 24.3z"
          fill="white"
        />
        <path
          d="M64 128c-30.4 0-55.1-21.3-55.1-47.5 0-16.1 9.2-30.7 23.7-39.5 3.1-1.9 7.1-1 9 2.1 1.9 3.1 1 7.1-2.1 9-10.1 6.2-16.4 16.4-16.4 28.4 0 18.2 18.3 33 40.9 33s40.9-14.8 40.9-33c0-12-6.3-22.2-16.4-28.4-3.1-1.9-4-5.9-2.1-9 1.9-3.1 5.9-4 9-2.1 14.5 8.8 23.7 23.4 23.7 39.5 0 26.2-24.7 47.5-55.1 47.5z"
          fill="white"
        />
        <path
          d="M64 101.5c-11.5 0-20.9-9.4-20.9-20.9 0-11.5 9.4-20.9 20.9-20.9 11.5 0 20.9 9.4 20.9 20.9 0 11.5-9.4 20.9-20.9 20.9z"
          fill="white"
        />
        <path
          d="M78.7 47.2c0 8.1-6.6 14.7-14.7 14.7s-14.7-6.6-14.7-14.7S55.9 32.5 64 32.5s14.7 6.6 14.7 14.7z"
          fill="white"
        />
        <path
          d="M34.8 47.1c0 5.6-4.5 10.1-10.1 10.1s-10.1-4.5-10.1-10.1 4.5-10.1 10.1-10.1 10.1 4.5 10.1 10.1z"
          fill="#534BB1"
        />
        <path
          d="M113.4 47.1c0 5.6-4.5 10.1-10.1 10.1s-10.1-4.5-10.1-10.1 4.5-10.1 10.1-10.1 10.1 4.5 10.1 10.1z"
          fill="#534BB1"
        />
      </svg>
    </div>
  )

  const steps = [
    {
      title: "Install Phantom Wallet",
      description: "If you don't have Phantom wallet installed, you'll need to add it to your browser first.",
      icon: <PhantomGhostIcon />,
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
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full opacity-20"></div>
          <PhantomGhostIcon />
          <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      ),
      action: null,
    },
    {
      title: "Connect to Goldium.io",
      description: "Click the 'Connect Wallet' button and approve the connection request in the Phantom popup.",
      icon: (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800 rounded-full p-3">
            <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path
                d="M103.3 71.4c-13.4 0-24.3-10.9-24.3-24.3 0-13.4 10.9-24.3 24.3-24.3 13.4 0 24.3 10.9 24.3 24.3 0 13.4-10.9 24.3-24.3 24.3z"
                fill="white"
              />
              <path
                d="M24.7 71.4c-13.4 0-24.3-10.9-24.3-24.3 0-13.4 10.9-24.3 24.3-24.3 13.4 0 24.3 10.9 24.3 24.3 0 13.4-10.9 24.3-24.3 24.3z"
                fill="white"
              />
              <path
                d="M64 128c-30.4 0-55.1-21.3-55.1-47.5 0-16.1 9.2-30.7 23.7-39.5 3.1-1.9 7.1-1 9 2.1 1.9 3.1 1 7.1-2.1 9-10.1 6.2-16.4 16.4-16.4 28.4 0 18.2 18.3 33 40.9 33s40.9-14.8 40.9-33c0-12-6.3-22.2-16.4-28.4-3.1-1.9-4-5.9-2.1-9 1.9-3.1 5.9-4 9-2.1 14.5 8.8 23.7 23.4 23.7 39.5 0 26.2-24.7 47.5-55.1 47.5z"
                fill="white"
              />
              <path
                d="M64 101.5c-11.5 0-20.9-9.4-20.9-20.9 0-11.5 9.4-20.9 20.9-20.9 11.5 0 20.9 9.4 20.9 20.9 0 11.5-9.4 20.9-20.9 20.9z"
                fill="white"
              />
              <path
                d="M78.7 47.2c0 8.1-6.6 14.7-14.7 14.7s-14.7-6.6-14.7-14.7S55.9 32.5 64 32.5s14.7 6.6 14.7 14.7z"
                fill="white"
              />
              <path
                d="M34.8 47.1c0 5.6-4.5 10.1-10.1 10.1s-10.1-4.5-10.1-10.1 4.5-10.1 10.1-10.1 10.1 4.5 10.1 10.1z"
                fill="#534BB1"
              />
              <path
                d="M113.4 47.1c0 5.6-4.5 10.1-10.1 10.1s-10.1-4.5-10.1-10.1 4.5-10.1 10.1-10.1 10.1 4.5 10.1 10.1z"
                fill="#534BB1"
              />
            </svg>
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 12H19M19 12L12 5M19 12L12 19"
              stroke="#FFD700"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="w-16 h-16 flex items-center justify-center bg-black rounded-full border-2 border-yellow-500 p-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="#FFD700"
                strokeWidth="2"
              />
              <path
                d="M7.5 12.5L10.5 15.5L16.5 9.5"
                stroke="#FFD700"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
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
        <div className="relative w-24 h-24 flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-3">
          <PhantomGhostIcon />
          <div className="absolute bottom-2 w-16 h-8 bg-white rounded-md flex items-center justify-center">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5 12L10 17L19 8"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-xs font-bold">Approve</div>
          </div>
        </div>
      ),
      action: null,
    },
    {
      title: "You're Connected!",
      description: "Your wallet is now connected to Goldium.io. You can now access all features of the platform.",
      icon: (
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-full"></div>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full p-2">
            <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path
                d="M103.3 71.4c-13.4 0-24.3-10.9-24.3-24.3 0-13.4 10.9-24.3 24.3-24.3 13.4 0 24.3 10.9 24.3 24.3 0 13.4-10.9 24.3-24.3 24.3z"
                fill="white"
              />
              <path
                d="M24.7 71.4c-13.4 0-24.3-10.9-24.3-24.3 0-13.4 10.9-24.3 24.3-24.3 13.4 0 24.3 10.9 24.3 24.3 0 13.4-10.9 24.3-24.3 24.3z"
                fill="white"
              />
              <path
                d="M64 128c-30.4 0-55.1-21.3-55.1-47.5 0-16.1 9.2-30.7 23.7-39.5 3.1-1.9 7.1-1 9 2.1 1.9 3.1 1 7.1-2.1 9-10.1 6.2-16.4 16.4-16.4 28.4 0 18.2 18.3 33 40.9 33s40.9-14.8 40.9-33c0-12-6.3-22.2-16.4-28.4-3.1-1.9-4-5.9-2.1-9 1.9-3.1 5.9-4 9-2.1 14.5 8.8 23.7 23.4 23.7 39.5 0 26.2-24.7 47.5-55.1 47.5z"
                fill="white"
              />
              <path
                d="M64 101.5c-11.5 0-20.9-9.4-20.9-20.9 0-11.5 9.4-20.9 20.9-20.9 11.5 0 20.9 9.4 20.9 20.9 0 11.5-9.4 20.9-20.9 20.9z"
                fill="white"
              />
              <path
                d="M78.7 47.2c0 8.1-6.6 14.7-14.7 14.7s-14.7-6.6-14.7-14.7S55.9 32.5 64 32.5s14.7 6.6 14.7 14.7z"
                fill="white"
              />
              <path
                d="M34.8 47.1c0 5.6-4.5 10.1-10.1 10.1s-10.1-4.5-10.1-10.1 4.5-10.1 10.1-10.1 10.1 4.5 10.1 10.1z"
                fill="#534BB1"
              />
              <path
                d="M113.4 47.1c0 5.6-4.5 10.1-10.1 10.1s-10.1-4.5-10.1-10.1 4.5-10.1 10.1-10.1 10.1 4.5 10.1 10.1z"
                fill="#534BB1"
              />
            </svg>
          </div>
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
