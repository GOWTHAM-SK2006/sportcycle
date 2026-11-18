/** @type {import('next').NextConfig} */
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
        destination: 'http://127.0.0.1:8080/api/v1/:path*',
      },
      {
        source: '/swagger-ui/:path*',
        destination: 'http://127.0.0.1:8080/swagger-ui/:path*',
      },
      {
        source: '/swagger-ui.html',
        destination: 'http://127.0.0.1:8080/swagger-ui.html',
      },
      {
        source: '/v3/api-docs/:path*',
        destination: 'http://127.0.0.1:8080/v3/api-docs/:path*',
      },
    ];
  },
};

export default nextConfig;
