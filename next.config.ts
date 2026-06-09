import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/company/distributors', destination: '/contact', permanent: true },
      { source: '/company/offices', destination: '/contact', permanent: true },
      { source: '/company/factory', destination: '/company/about', permanent: true },
      { source: '/support/clearance-duty', destination: '/support/shipping', permanent: true },
      { source: '/support/affiliate', destination: '/contact', permanent: true },
      { source: '/support/free-shipping', destination: '/support/shipping', permanent: true },
    ];
  },
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
  // Turbopack configuration (silences warning and applies same exclusions)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
