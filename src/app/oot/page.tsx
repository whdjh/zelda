import { ProgressSettings } from "@/components/progress-settings";
import Link from "next/link";

export default function AdventurePage() {
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
        <ProgressSettings />
      </header>

      <main id="main" tabIndex={-1} className="py-x10">
        <section aria-labelledby="adventure-title" className="mb-x10">
          <p className="mb-x4 t3-bold text-fg-positive-contrast">시간의 오카리나 · 모험 내비게이션</p>
          <h1 id="adventure-title" className="screen-title mb-x4">
            헤매는 시간은 줄이고,<br />모험의 재미는 그대로.
          </h1>
          <p className="t4-regular text-fg-neutral-muted">
            지금 할 일은 짧고 명확하게.<br />퍼즐의 답은 내가 원할 때, 필요한 만큼만.
          </p>
        </section>

        <section aria-labelledby="route-title" className="rounded-r4 border border-stroke-neutral-muted bg-bg-layer-default p-x6">
          <div className="mb-x6 flex flex-wrap items-center justify-between gap-x3">
            <h2 id="route-title" className="t5-bold">나의 모험 노선</h2>
            <span className="rounded-r2 bg-bg-positive-weak px-x3 py-x1 t2-bold text-fg-positive-contrast">준비 중</span>
          </div>
          <div className="rounded-r3 bg-bg-neutral-weak px-x5 py-x8">
            <svg aria-hidden="true" viewBox="0 0 160 80" className="mb-x5 h-x16 w-x32 text-fg-neutral-subtle" fill="none">
              <path d="M16 64h42a20 20 0 0 0 20-20V36a20 20 0 0 1 20-20h46" stroke="currentColor" strokeWidth="2" strokeDasharray="5 6" />
              <circle cx="16" cy="64" r="7" fill="currentColor" />
              <circle cx="144" cy="16" r="7" stroke="currentColor" strokeWidth="2" />
            </svg>
            <h3 className="mb-x2 t5-bold">안심하고 따라갈 길을 준비하고 있어요</h3>
            <p className="t3-regular text-fg-neutral-muted">
              출처와 게임판을 확인한 공략부터 차근차근 담을 예정이에요.
              아직 이용할 수 있는 모험 노선과 퍼즐 힌트는 없어요.
            </p>
          </div>
          <p className="mt-x4 t2-regular text-fg-neutral-muted">Nintendo Switch 2판 기준 · 공략 조사 및 플레이 검증 대기</p>
          <Link href="/oot/route" className="mt-x4 inline-flex min-h-x11 items-center text-fg-informative-contrast t3-bold">노선 준비 상태 확인 →</Link>
        </section>

        <section aria-labelledby="guide-title" className="mt-x10">
          <h2 id="guide-title" className="mb-x5 t5-bold">이렇게 모험을 도울 거예요</h2>
          <ol className="grid gap-x6 sm:grid-cols-3">
            <li className="border-t border-stroke-neutral-muted pt-x4">
              <p className="mb-x2 t2-bold text-fg-positive-contrast">01 · 지금 갈 곳</p>
              <h3 className="mb-x2 t4-bold">한 번에 한 목적지</h3>
              <p className="t3-regular text-fg-neutral-muted">앞으로의 이야기는 가리고, 현재와 다음 목적지에 집중해요.</p>
            </li>
            <li className="border-t border-stroke-neutral-muted pt-x4">
              <p className="mb-x2 t2-bold text-fg-positive-contrast">02 · 막혔을 때</p>
              <h3 className="mb-x2 t4-bold">단서부터 한 단계씩</h3>
              <p className="t3-regular text-fg-neutral-muted">작은 힌트부터 해법까지. 어디까지 볼지는 직접 정해요.</p>
            </li>
            <li className="border-t border-stroke-neutral-muted pt-x4">
              <p className="mb-x2 t2-bold text-fg-positive-contrast">03 · 다음 모험에도</p>
              <h3 className="mb-x2 t4-bold">이 브라우저에서 이어서</h3>
              <p className="t3-regular text-fg-neutral-muted">로그인 없이 기록하고, 백업 파일로 내보내 보관해요.</p>
            </li>
          </ol>
        </section>
      </main>

      <footer className="border-t border-stroke-neutral-muted py-x6 t2-regular text-fg-neutral-muted">
        <p className="mb-x2">게임의 재미는 남기고, 헤매는 시간은 줄인다.</p>
        <p>비공식 팬 프로젝트이며 Nintendo와 제휴·후원 관계가 없습니다.</p>
        <p className="mt-x2"><a className="underline" href="/licenses/seed-design-NOTICE.txt">SEED Design 고지</a> · <a className="underline" href="/licenses/seed-design-LICENSE.txt">라이선스</a></p>
      </footer>
    </div>
  );
}
