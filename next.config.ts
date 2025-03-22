import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable webpack cache to prevent memory issues
  webpack: (config, { dev, isServer }) => {
    // Force filesystem cache off
    config.cache = false;
    
    // Optimize memory usage
    config.optimization = {
      ...config.optimization,
      minimize: true,
    };
    
    return config;
  },
  
  // Reduce image optimization pressure during build
  images: {
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  
  // Use supported experimental features only
  experimental: {
    // Remove unsupported property
  }
};

export default nextConfig;