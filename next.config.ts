import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Allow CloudFront CDN for product images
      {
        protocol: 'https',
        hostname: 'diiospp53gsun.cloudfront.net',
      },
    ],
  },
  // Prevent bundling Node.js-only packages in client bundles
  serverExternalPackages: ['ali-oss', 'proxy-agent'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle Node.js-only packages for client-side code
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'proxy-agent': false,
        'ali-oss': false,
        'http': false,
        'https': false,
        'net': false,
        'tls': false,
      };
    }
    return config;
  },
};

export default nextConfig;
