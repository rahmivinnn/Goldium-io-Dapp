import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const network = searchParams.get("network") || "testnet"

  // Get the token address from environment variables based on the network
  // If not available, use our default testnet token address
  let tokenAddress: string | undefined;

  if (network === "mainnet") {
    tokenAddress = process.env.GOLD_TOKEN_ADDRESS_MAINNET || "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump";
  } else if (network === "testnet") {
    tokenAddress = process.env.GOLD_TOKEN_ADDRESS_TESTNET || "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump";
  }

  // Return the token address
  return NextResponse.json({
    address: tokenAddress || "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // Fallback address
    network,
  })
}
