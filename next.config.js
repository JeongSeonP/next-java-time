/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "developers.kakao.com",
      },
    ],
  },
};

const nextConfig = withPWA({
  dest: "public",
  skipWaiting: true,
  runtimeCaching,
})(config);

module.exports = nextConfig;
