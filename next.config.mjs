// next.config.mjs
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        encoding: false,
      }
    }
    return config
  },

  // You can keep this, but it's optional
  turbopack: { root: __dirname },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'blueprintstudio.ai', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/**' },
    ],
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },

  async redirects() {
    return [
      // Old indexed pages → homepage (301 permanent)
      { source: '/web-design', destination: '/', permanent: true },
      { source: '/service-index', destination: '/', permanent: true },
      { source: '/services-index', destination: '/', permanent: true },
      { source: '/blog', destination: '/', permanent: true },
      { source: '/blog/:slug*', destination: '/', permanent: true },
      { source: '/tools', destination: '/', permanent: true },
      { source: '/learn', destination: '/', permanent: true },
      { source: '/old-home', destination: '/', permanent: true },
      { source: '/living-persona', destination: '/', permanent: true },
      { source: '/project-metavision', destination: '/', permanent: true },
      { source: '/cona-cash', destination: '/', permanent: true },
    ]
  },

  // Keep only if self-hosting. If deploying to Vercel, remove this.
  // output: 'standalone',

  poweredByHeader: false,
  compress: true,
  generateEtags: true,

  // Optional dev tuning; harmless in prod
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

export default nextConfig
