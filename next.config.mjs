// next.config.mjs
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    runtime: 'edge',
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    domains: [
      'localhost',
      'blueprintstudio.ai',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      chunkIds: 'deterministic',
    }

    // Handle browser-specific polyfills
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        async_hooks: false,
      }
    }

    // Exclude specific packages from the server bundle
    if (isServer) {
      config.externals = [...(config.externals || []), 
        'canvas', 
        'jsdom',
        'html2canvas',
        'jspdf'
      ]
    }

    return config
  },
  // Handle specific headers for edge functions
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },
  // Redirect configuration if needed
  async redirects() {
    return []
  },
  // Environment configuration
  env: {
    NEXT_PUBLIC_ENVIRONMENT: process.env.NODE_ENV,
    NEXT_RUNTIME: 'edge',
  },
  // Optimize output
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  // Cache configuration
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

export default nextConfig;