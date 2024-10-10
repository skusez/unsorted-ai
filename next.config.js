/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "source.unsplash.com" },
      { hostname: "localhost" },
    ],
  },
};

module.exports = nextConfig;
