import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const network = searchParams.get("network") || "devnet"

  // Get the token address from environment variables based on the network
  const tokenAddress = network === "mainnet" ? process.env.GOLD_TOKEN_ADDRESS : process.env.GOLD_TOKEN_ADDRESS // Using same address for both networks in this example

  // Return the token address
  return NextResponse.json({
    address: tokenAddress || "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // Fallback address
    network,
  })
}
