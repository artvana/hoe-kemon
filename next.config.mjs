/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@opendatalabs/connect-js'],
  images: {
    remotePatterns: [
      { hostname: 'replicate.delivery' },
      { hostname: 'pbxt.replicate.delivery' },
    ],
  },
}

export default nextConfig
