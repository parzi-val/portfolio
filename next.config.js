/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false, // Disable source maps for production
  webpack: (config) => {
    
    return config;
  },
  images: {
    unoptimized: true,  // Reduce build memory usage
  },
};

module.exports = nextConfig;
