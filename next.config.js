/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["v0.blob.com"],
  },
  webpack: (config, { isServer }) => {
    // Fix for pino-pretty issues
    if (isServer) {
      config.externals = [...(config.externals || []), "pino-pretty", "lokijs", "encoding"]
    }
    return config
  },
  // Skip specific pages during static generation
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
  experimental: {
    // Disable static generation for specific paths
    optimizeCss: false,
    optimizeServerReact: false,
    serverMinification: false,
    serverSourceMaps: false,
  },
  // Completely disable static generation for specific paths
  generateStaticParams: async () => {
    return []
  },
  // Exclude specific pages from static generation
  unstable_excludeFiles: [
    "app/staking/**/*",
    "app/staking-client/**/*",
    "components/defi/staking-interface.tsx",
    "components/defi/staking-contract.tsx",
    "components/connect-wallet-button.tsx",
    "components/wallet-identity-card.tsx",
  ],
}

module.exports = nextConfig
