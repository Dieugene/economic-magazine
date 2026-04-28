import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Match Django's URL convention (paths end with `/`).
  trailingSlash: true,
  experimental: {
    // PDF выпусков журнала — до 20 МБ. Без этого Next.js 16 молча обрезает
    // тело route handler-а на 10 МБ (см. proxyClientMaxBodySize в доках).
    proxyClientMaxBodySize: "50mb",
  },
};

export default nextConfig;
