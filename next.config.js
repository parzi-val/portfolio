/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.cache = false;  // Cache setting
    return config;
  },
  images: {
    unoptimized: true,  // Reduce build memory usage
  },
};

module.exports = nextConfig;
