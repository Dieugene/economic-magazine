import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Match Django's URL convention (paths end with `/`).
  trailingSlash: true,
};

export default nextConfig;
