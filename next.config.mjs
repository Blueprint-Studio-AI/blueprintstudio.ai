/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  webpack: (config, { isServer }) => {
    // Ignore source map files from @sparticuz/chrome-aws-lambda
    config.module.rules.push({
      test: /\.map$/,
      use: 'ignore-loader'
    });

    return config;
  },
};

export default nextConfig;