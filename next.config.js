/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GEOCODE: process.env.GEOCODE,
    HJID: process.env.HJID
  },
};

module.exports = nextConfig;
