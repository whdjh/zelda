"use client";

import Link from "next/link";
import { ActionButton } from "@seed-design/react";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main id="main" className="page-shell px-x5 py-x10">
    <h1 className="screen-title mb-x4">안내를 불러오지 못했어요</h1>
    <p className="mb-x5 t4-regular text-fg-neutral-muted">연결을 확인하고 다시 시도해 주세요. 브라우저 기록은 삭제하지 않았어요.</p>
    <div className="flex flex-wrap gap-x3">
      <ActionButton variant="neutralSolid" onClick={reset}>다시 시도</ActionButton>
      <ActionButton asChild variant="neutralOutline"><Link href="/oot">모험 홈으로</Link></ActionButton>
    </div>
  </main>;
}
