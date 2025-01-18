/** @type {import('next').NextConfig} */
const nextConfig = {
    // TODO: update process
    basePath: process.env.NODE_ENV === 'production' ? '/blueprintstudio.ai' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/blueprintstudio.ai' : '',
  };
  
  export default nextConfig;
  