/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    NEXT_PUBLIC_GH_TOKEN: process.env.NEXT_PUBLIC_GH_TOKEN,
  },
}

module.exports = nextConfig
