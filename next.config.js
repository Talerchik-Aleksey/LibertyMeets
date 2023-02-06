/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GEOCODE: process.env.GEOCODE,
  },
};

module.exports = nextConfig;
