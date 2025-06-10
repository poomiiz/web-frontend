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
           {
       source: '/api/models',
      destination: 'http://localhost:8080/admin/config',
     },
       {
        source: '/api/prompts/:path*',
        destination: 'http://localhost:8080/admin/prompts/:path*',
      },
      {
        source: '/api/ai/:path*',
        destination: 'http://localhost:8080/ai/:path*',
      },
            {
        source: '/api/models/:path*',
        destination: 'http://localhost:8080/admin/config/:path*',
      },
    ]
  },
}
