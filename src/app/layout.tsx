import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "젤다 하이패스 · 모험 내비게이션",
  description: "시간의 오카리나를 위한 한국어 모험 내비게이션. 공략 콘텐츠를 준비하고 있습니다.",
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
