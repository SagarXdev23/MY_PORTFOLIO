import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required to enable instrumentation.ts (server startup hook for keep-alive ping)
  instrumentationHook: true,
};

export default nextConfig;
