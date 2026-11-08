import Link from "next/link";
import { RouteGuide } from "@/components/route/route-guide";

export const metadata = { title: "모험 노선 · 젤다 하이패스" };

export default function RoutePage() {
  return <main id="main" className="page-shell px-x5 py-x8">
    <Link href="/oot" className="mb-x6 inline-flex min-h-x11 items-center t3-bold text-fg-informative-contrast">← 모험 홈·설정</Link>
    <h1 className="screen-title mb-x6">모험 노선</h1>
    <RouteGuide />
  </main>;
}
