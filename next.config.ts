import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
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
      // Configure externals to use commonjs format (for require)
      const externals = config.externals || [];

      // Only externalize build-time dependencies that shouldn't be bundled
      config.externals = [
        ...externals,
        ({request}: {request?: string}, callback: (error?: Error | null, result?: string) => void) => {
          // Externalize build-time dependencies
          if (
            request === 'fsevents' ||
            request === 'rollup' ||
            request === 'esbuild' ||
            request?.startsWith('@esbuild/') ||
            request === 'rollup-plugin-esbuild-minify' ||
            request === 'chokidar'
          ) {
            return callback(null, `commonjs ${request}`);
          }
          callback();
        },
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
