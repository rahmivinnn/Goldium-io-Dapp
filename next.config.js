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
  },
}

module.exports = nextConfig
