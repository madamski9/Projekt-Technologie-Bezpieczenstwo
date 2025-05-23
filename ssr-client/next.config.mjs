/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/admin/:path*',
        destination: 'http://backend:3000/api/admin/:path*',
      },
    ];
  },
};

export default nextConfig;
