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
    // 75 is next/image's default; 90 is for flat-graphic brand heroes (hero.quality)
    qualities: [75, 90],
    remotePatterns: [
      { protocol: 'https', hostname: 'blueprintstudio.ai', pathname: '/**' },
      { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/**' },
      { protocol: 'https', hostname: 'img.youtube.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/**' },
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
      { source: '/blog', destination: '/insights', permanent: true },
      { source: '/blog/:slug*', destination: '/insights/:slug*', permanent: true },
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

  // Brand pages: the share images (lib/brands/og.tsx) read their art from
  // public/ by a path built at runtime, so file tracing can't tell which files
  // and bundles ALL of public/ (hundreds of MB of brand assets and zips) into
  // each /brands function, past Vercel's 250 MB limit. Nothing under /brands
  // reads public/ at request time: the pages and share images are prerendered
  // at build, when the files are on disk. Keep them force-static.
  outputFileTracingExcludes: {
    '/brands/**': ['./public/**/*'],
  },

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
