"use client"

import React from "react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
          <h2 className="text-2xl font-bold text-gold mb-4">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{this.state.error?.message || "An unexpected error occurred"}</p>
          <Button onClick={this.resetErrorBoundary} className="gold-button">
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h2 className="text-2xl font-bold text-gold mb-4">Something went wrong</h2>
      <p className="text-gray-400 mb-6">{error.message}</p>
      <Button onClick={resetErrorBoundary} className="gold-button">
        Try again
      </Button>
    </div>
  )
}
