import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  webpack(config) {
    // SEED가 Tailwind와 같은 cascade layer 안에서 컴포넌트 CSS를 불러오도록 한다.
    config.resolve.conditionNames = ["seed-layered", ...config.resolve.conditionNames];
    return config;
  },
};

export default nextConfig;
