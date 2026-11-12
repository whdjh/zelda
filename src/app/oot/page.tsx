"use client";

import { ProgressSettings } from "@/components/progress-settings";
import { RouteGuideView } from "@/components/route/route-guide";
import { useProgress } from "@/lib/use-progress";

export default function AdventurePage() {
  const state = useProgress();
  return (
    <div className="page-shell px-x5 sm:px-x8">
      <header className="flex flex-wrap items-center justify-between gap-x4 border-b border-stroke-neutral-muted py-x5">
        <a href="/oot" className="flex min-h-x11 items-center gap-x2 t5-bold" aria-label="젤다 하이패스 홈">
          <svg aria-hidden="true" viewBox="0 0 32 32" className="size-x8 text-fg-positive-contrast" fill="none">
            <path d="M8 25V11a5 5 0 0 1 10 0v10a4 4 0 0 0 8 0V7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <circle cx="8" cy="25" r="4" fill="currentColor" />
            <circle cx="26" cy="7" r="4" fill="currentColor" />
          </svg>
          젤다 하이패스
        </a>
        <ProgressSettings state={state} />
      </header>

      <main id="main" tabIndex={-1} className="py-x6">
        <h1 className="mb-x2 t5-bold">시간의 오카리나 · 모험 노선</h1>
        <p className="mb-x4 t2-regular text-fg-neutral-muted">출처 기반 초안 · 직접 플레이 미검증</p>
        <RouteGuideView state={state} />
      </main>

      <footer className="border-t border-stroke-neutral-muted py-x6 t2-regular text-fg-neutral-muted">
        <p className="mb-x2">스토리·엔딩 공략 · 수집 100% 공략은 미포함</p>
        <p>비공식 팬 프로젝트이며 Nintendo와 제휴·후원 관계가 없습니다.</p>
        <p className="mt-x2"><a className="underline" href="/licenses/seed-design-NOTICE.txt">SEED Design 고지</a> · <a className="underline" href="/licenses/seed-design-LICENSE.txt">라이선스</a></p>
      </footer>
    </div>
  );
}
