import Link from "next/link";
import { notFound } from "next/navigation";
import { ootContent } from "../../../../../content/ocarina-of-time/index";
import { RouteGuide } from "@/components/route/route-guide";

export const metadata = { title: "퍼즐 도움 · 젤다 하이패스", description: "퍼즐의 답은 요청할 때만 단계별로 공개됩니다." };

export default async function PuzzlePage({ params }: { params: Promise<{ puzzleId: string }> }) {
  const { puzzleId } = await params;
  if (!ootContent.puzzles.some((puzzle) => puzzle.id === puzzleId)) notFound();
  return <main id="main" className="page-shell px-x5 py-x8">
    <Link href="/oot" className="mb-x6 inline-flex min-h-x11 items-center text-fg-informative-contrast">← 모험 노선</Link>
    <h1 className="screen-title mb-x6">퍼즐 도움</h1>
    <RouteGuide puzzleId={puzzleId} />
  </main>;
}
