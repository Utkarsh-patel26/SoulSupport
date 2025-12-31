/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'localhost'],
  },
  env: {
    API_BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
