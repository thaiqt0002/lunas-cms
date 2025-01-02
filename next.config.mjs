/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dev.image.lunas.vn',
      },
    ],
  },
}

export default nextConfig
