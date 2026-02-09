import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize AdminJS and its dependencies to avoid bundling issues
      const externals = config.externals || [];
      config.externals = [
        ...externals,
        'adminjs',
        '@adminjs/express',
        '@adminjs/prisma',
        '@adminjs/upload',
        'rollup',
        'esbuild',
        'fsevents',
      ];

      // Suppress warnings about dynamic requires in AdminJS
      config.module = {
        ...config.module,
        exprContextCritical: false,
        unknownContextCritical: false,
      };

      // Ignore warnings from AdminJS dynamic requires
      config.ignoreWarnings = [
        { module: /node_modules\/adminjs/ },
      ];
    }
    return config;
  },
};

export default nextConfig;
