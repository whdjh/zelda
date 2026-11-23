import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "젤다 하이패스 · 시간의 오카리나 증강 내비",
  description: "시간의 오카리나를 플레이하며 다음 갈래를 카드처럼 고르고, 스포일러 없이 힌트를 얻는 모바일 내비게이션입니다.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" data-seed data-seed-color-mode="light-only">
      <body>
        <a className="skip-link bg-bg-layer-default text-fg-informative-contrast" href="#main">본문으로 건너뛰기</a>
        {children}
      </body>
    </html>
  );
}
