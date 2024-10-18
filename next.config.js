/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["sharp", "onnxruntime-node"],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  output: "standalone",
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "source.unsplash.com" },
      { hostname: "localhost" },
    ],
  },
};

module.exports = nextConfig;
