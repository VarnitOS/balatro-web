/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@balatro/cards'],
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
}

module.exports = nextConfig
