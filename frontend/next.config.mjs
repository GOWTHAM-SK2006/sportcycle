/** @type {import('next').NextConfig} */
const BACKEND_INTERNAL_PORT = process.env.BACKEND_PORT || '8085';

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `http://127.0.0.1:${BACKEND_INTERNAL_PORT}/api/v1/:path*`,
      },
      {
        source: '/swagger-ui/:path*',
        destination: `http://127.0.0.1:${BACKEND_INTERNAL_PORT}/swagger-ui/:path*`,
      },
      {
        source: '/swagger-ui.html',
        destination: `http://127.0.0.1:${BACKEND_INTERNAL_PORT}/swagger-ui.html`,
      },
      {
        source: '/v3/api-docs/:path*',
        destination: `http://127.0.0.1:${BACKEND_INTERNAL_PORT}/v3/api-docs/:path*`,
      },
      {
        source: '/status',
        destination: `http://127.0.0.1:${BACKEND_INTERNAL_PORT}/api/v1/status`,
      },
    ];
  },
};

export default nextConfig;
