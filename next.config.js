// web-frontend/next.config.js
const BACKEND = process.env.BACKEND_URL || 'http://localhost:8080/admin'

/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/admin/:path*',
        destination: `${BACKEND}/:path*`,
      },
    ]
  },
}
