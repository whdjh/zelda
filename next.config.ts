import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // 최대 1MB JSON 스냅샷을 전송할 때 요청 인코딩 여유를 둔다.
    serverActions: { bodySizeLimit: "2mb" },
  },
  webpack(config) {
    // SEED가 Tailwind와 같은 cascade layer 안에서 컴포넌트 CSS를 불러오도록 한다.
    config.resolve.conditionNames = ["seed-layered", ...config.resolve.conditionNames];
    return config;
  },
};

export default nextConfig;
