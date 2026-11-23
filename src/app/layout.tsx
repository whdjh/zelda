import type { Metadata, Viewport } from "next";
import { getMessages } from "@/i18n";
import "./globals.css";

const t = getMessages();

export const metadata: Metadata = {
  title: t.app.title,
  description: t.app.description,
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
        <a className="skip-link bg-bg-layer-default text-fg-informative-contrast" href="#main">{t.app.skipToMain}</a>
        {children}
      </body>
    </html>
  );
}
