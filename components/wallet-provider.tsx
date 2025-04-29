"use client"

import type React from "react"
import { WalletProvider as WalletContextProvider } from "@/hooks/use-wallet"

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return <WalletContextProvider>{children}</WalletContextProvider>
}
