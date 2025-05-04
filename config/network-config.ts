// Network configuration
export type NetworkType = "mainnet" | "testnet"

export const DEFAULT_NETWORK: NetworkType = "testnet"

// Token metadata
export const GOLD_TOKEN_METADATA = {
  symbol: "GOLD",
  name: "Goldium Token",
  decimals: 9,
  logoURI: "/gold_icon-removebg-preview.png",
  totalSupply: 1000000000, // 1 billion total supply
}

export const SOL_TOKEN_METADATA = {
  symbol: "SOL",
  name: "Solana",
  decimals: 9,
  logoURI: "/images/solana-logo.png",
}

export const MANA_TOKEN_METADATA = {
  symbol: "MANA",
  name: "Decentraland",
  decimals: 18,
  logoURI: "/images/mana-logo.png",
  // Ethereum MANA Contract Address: 0x0F5D2fB29fb7d3CFeE444a200298f468908cC942
  // Solana MANA Contract Address (wrapped): MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey
}

export const NETWORKS = {
  mainnet: {
    name: "Mainnet",
    endpoint: "https://api.mainnet-beta.solana.com",
    goldTokenAddress: "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // Real GOLD token address on mainnet
    manaTokenAddress: "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey", // MANA token address on Solana (wrapped)
    explorerUrl: "https://explorer.solana.com",
  },
  testnet: {
    name: "Testnet",
    endpoint: "https://api.testnet.solana.com",
    goldTokenAddress: "APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump", // Using same address for demo, would be different in real scenario
    manaTokenAddress: "MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey", // Using same address for demo
    explorerUrl: "https://explorer.solana.com/?cluster=testnet",
  },
}
