import { Metadata } from "next"
import SendClient from "./client"

export const metadata: Metadata = {
  title: "Send GOLD | Goldium.io",
  description: "Send and gift GOLD tokens to other wallets on the Solana blockchain",
}

export default function SendPage() {
  return (
    <div className="pt-24">
      <SendClient />
    </div>
  )
}
