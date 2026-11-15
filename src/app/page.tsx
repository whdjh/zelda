"use client";

import { ProgressSettings } from "@/components/progress-settings";
import { RouteGuide } from "@/components/route/route-guide";
import { useProgress } from "@/lib/use-progress";

export default function Home() {
  const state = useProgress();
  return (
    <div className="page-shell px-x5 sm:px-x8">
      <main id="main" tabIndex={-1} className="py-x6">
        <div className="mb-x4 flex flex-wrap items-center justify-between gap-x3">
          <h1 className="t5-bold">시간의 오카리나</h1>
          <ProgressSettings state={state} />
        </div>
        <RouteGuide state={state} />
      </main>

      <footer className="border-t border-stroke-neutral-muted py-x6 t2-regular text-fg-neutral-muted">
        <details>
          <summary className="min-h-x11 cursor-pointer">서비스 정보</summary>
          <p className="mb-x2">출처 기반 초안 · 직접 플레이 미검증</p>
          <p className="mb-x2">스토리·엔딩 공략 · 수집 100% 공략은 미포함</p>
          <p>비공식 팬 프로젝트이며 Nintendo와 제휴·후원 관계가 없습니다.</p>
          <p className="mt-x2"><a className="underline" href="/licenses/seed-design-NOTICE.txt">SEED Design 고지</a> · <a className="underline" href="/licenses/seed-design-LICENSE.txt">라이선스</a></p>
        </details>
      </footer>
    </div>
  );
}
