import Link from "next/link";
import { notFound } from "next/navigation";
import { ootContent } from "../../../../../content/ocarina-of-time/index";
import { RouteGuide } from "@/components/route/route-guide";

export const metadata = { title: "구간 안내 · 젤다 하이패스", description: "요청한 구간의 공개 범위를 확인한 뒤 모험 안내를 보여줍니다." };

export default async function StopPage({ params }: { params: Promise<{ stopId: string }> }) {
  const { stopId } = await params;
  if (!ootContent.stops.some((stop) => stop.id === stopId)) notFound();
  return <main id="main" className="page-shell px-x5 py-x8">
    <Link href="/oot" className="mb-x6 inline-flex min-h-x11 items-center text-fg-informative-contrast">← 모험 노선</Link>
    <h1 className="screen-title mb-x6">구간 안내</h1>
    <RouteGuide initialStopId={stopId} />
  </main>;
}
