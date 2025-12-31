import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - allowedDevOrigins might not be in the type definition yet
  allowedDevOrigins: ["mega.wmst.com.br"],
};

export default nextConfig;
