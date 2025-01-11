/** @type {import('next').NextConfig} */
const nextConfig = {
    // TODO: update your-repository-name
    basePath: process.env.NODE_ENV === 'production' ? '/your-repository-name' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/your-repository-name/' : '',
  };
  
  export default nextConfig;
  