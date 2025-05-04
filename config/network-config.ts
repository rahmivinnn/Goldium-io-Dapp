// Network configuration
export type NetworkType = "mainnet" | "testnet"

export const DEFAULT_NETWORK: NetworkType = "testnet"

// Token metadata
export const GOLD_TOKEN_METADATA = {
  symbol: "GOLD",
  name: "Goldium Token",
  decimals: 9,
  logoURI: "/gold_icon-removebg-preview.png",
  totalSupply: 1000000, // 1 million total supply
}

export const SOL_TOKEN_METADATA = {
  symbol: "SOL",
  name: "Solana",
  decimals: 9,
  logoURI: "/images/solana-logo.png",
}

export const NETWORKS = {
  mainnet: {
    name: "Mainnet",
    endpoint: "https://api.mainnet-beta.solana.com",
    goldTokenAddress: "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // Real GOLD token address on mainnet
    explorerUrl: "https://explorer.solana.com",
  },
  testnet: {
    name: "Testnet",
    endpoint: "https://api.testnet.solana.com",
    goldTokenAddress: "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // Using same address for demo, would be different in real scenario
    explorerUrl: "https://explorer.solana.com/?cluster=testnet",
  },
}
