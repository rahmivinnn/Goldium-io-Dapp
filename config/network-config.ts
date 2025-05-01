// Network configuration
export type NetworkType = "mainnet" | "testnet"

export const DEFAULT_NETWORK: NetworkType = "testnet"

export const NETWORKS = {
  mainnet: {
    name: "Mainnet",
    endpoint: "https://api.mainnet-beta.solana.com",
    goldTokenAddress: "GLD1aose7SawAYZ5DLZKLmZU9UpEDGxwgQhvmSvczXr", // Example mainnet address
  },
  testnet: {
    name: "Testnet",
    endpoint: "https://api.testnet.solana.com",
    goldTokenAddress: "GLD7aose7SawAYZ5DLZKLmZU9UpEDGxwgQhvmSvczXr", // Example testnet address
  },
}
