/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "127.0.0.1" },
    ],
  },
};

module.exports = nextConfig;
