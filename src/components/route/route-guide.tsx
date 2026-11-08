"use client";

import { ActionButton, BottomSheet, Portal } from "@seed-design/react";
import Link from "next/link";
import { useState } from "react";
import { ootContent } from "../../../content/ocarina-of-time/index";
import { useProgress } from "@/lib/use-progress";
import { isStopVisible, selectRoute } from "@/lib/route-selection";
import { RouteMap } from "./route-map";
import { HintReveal } from "../hint/hint-reveal";
import { ContentSources } from "./content-sources";

export function RouteGuide({ initialStopId, puzzleId }: { initialStopId?: string; puzzleId?: string }) {
  const { progress, commit, storageNotice, notice } = useProgress();
  const [selectedId, setSelectedId] = useState(initialStopId ?? null);
  const [walkthroughId, setWalkthroughId] = useState<string | null>(null);
  if (!progress) return <p role="status">진행 기록을 확인하고 있어요.</p>;
  if (!ootContent.stops.length) return <p className="t4-regular">아직 공개된 모험 노선이 없어요. 출처와 판본을 확인한 뒤 추가할 예정이에요.</p>;
  const route = selectRoute(ootContent.stops, progress);
  const puzzle = puzzleId ? ootContent.puzzles.find((entry) => entry.id === puzzleId) : undefined;
  const requested = puzzle?.stopId ?? selectedId;
  const selected = ootContent.stops.find((stop) => stop.id === requested);
  const visible = selected && isStopVisible(selected.id, progress.spoilerLevel, progress, route);
  const done = selected && progress.completedStopIds.includes(selected.id);

  function reveal(ids: string[]) {
    if (progress) commit({ ...progress, revealedHintIds: [...new Set([...progress.revealedHintIds, ...ids])], updatedAt: new Date().toISOString() });
  }

  return (
    <>
      {route.conflictIds.length > 0 && <p role="alert" className="mb-x4 t3-regular">완료 기록과 선행 조건이 맞지 않는 역이 있어요. 완료 기록과 보유 조건을 직접 확인해 주세요.</p>}
      {storageNotice && <p role="alert" className="mb-x4 t3-regular">{storageNotice} 원본 복구와 백업은 홈의 진행도·설정에서 이용해 주세요.</p>}
      {notice && <p role="status">{notice}</p>}
      {puzzle ? (
        visible ? <><HintReveal puzzle={puzzle} revealedIds={progress.revealedHintIds} onReveal={reveal} /><ContentSources verification={puzzle.verification} /></>
          : <p className="t3-regular">아직 공개하지 않은 구간이에요. <Link href="/oot" className="underline">홈의 설정</Link>에서 공개 범위를 직접 변경할 수 있어요.</p>
      ) : (
        <>
          <p className="mb-x4 t3-regular text-fg-neutral-muted">전체 {ootContent.stops.length}개 구간 중 {progress.completedStopIds.length}개 완료 · 출처 기반 초안</p>
          <RouteMap stops={ootContent.stops} progress={progress} onSelect={(id) => { setSelectedId(id); setWalkthroughId(null); }} />
          {selected && !visible && <p className="mt-x4 t3-regular">아직 공개하지 않은 구간이에요. 홈에서 스포일러 설정을 변경할 수 있어요.</p>}
          <BottomSheet.Root open={Boolean(selected && visible)} onOpenChange={(open) => { if (!open) { setSelectedId(null); setWalkthroughId(null); } }}>
            <Portal><BottomSheet.Positioner><BottomSheet.Backdrop />
              <BottomSheet.Content className="settings-sheet">
                <BottomSheet.Header><BottomSheet.Title>{visible ? selected.title : "모험 안내"}</BottomSheet.Title></BottomSheet.Header>
                <BottomSheet.Body>
                  {visible && <div className="flex flex-col gap-x4 pb-x6">
                    <ul className="list-disc pl-x5 t4-regular">{selected.summary.map((line) => <li key={line}>{line}</li>)}</ul>
                    {selected.requiredAge && <p className="t3-regular">필요한 시대: {selected.requiredAge === "child" ? "소년" : "청년"} · 현재 확인: {progress.age === "child" ? "소년" : progress.age === "adult" ? "청년" : "미확인"}</p>}
                    {selected.prerequisiteItemIds.length > 0 && <p className="t3-regular">준비물: {selected.prerequisiteItemIds.map((id) => `${ootContent.items.find((item) => item.id === id)?.title} ${progress.confirmedItemIds.includes(id) ? "✓" : "(미확인)"}`).join(" · ")}</p>}
                    {selected.requiredAge && <div className="flex flex-wrap gap-x2" role="group" aria-label="시대 확인">
                      {(["child", "adult"] as const).map((age) => <ActionButton className="min-h-x11" key={age} aria-pressed={progress.age === age} variant={progress.age === age ? "neutralSolid" : "neutralOutline"} onClick={() => commit({ ...progress, age, updatedAt: new Date().toISOString() })}>{age === "child" ? "소년" : "청년"}</ActionButton>)}
                    </div>}
                    {selected.prerequisiteItemIds.map((id) => {
                      const item = ootContent.items.find((entry) => entry.id === id);
                      const confirmed = progress.confirmedItemIds.includes(id);
                      return <ActionButton className="min-h-x11" key={id} variant="neutralOutline" aria-pressed={confirmed} onClick={() => commit({ ...progress, confirmedItemIds: confirmed ? progress.confirmedItemIds.filter((value) => value !== id) : [...progress.confirmedItemIds, id], updatedAt: new Date().toISOString() })}>{item?.title} · {confirmed ? "보유 해제" : "보유 확인"}</ActionButton>;
                    })}
                    <p className="t2-regular text-fg-neutral-muted">장비와 시대는 게임에서 확인한 뒤 선택하세요. 완료 표시로 자동 획득하지 않아요.</p>
                    {selected.recommendationReason && <p className="t3-regular">추천 이유: {selected.recommendationReason}</p>}
                    {selected.walkthrough && (walkthroughId === selected.id ? <section aria-label="상세 공략">
                      <h2 className="mb-x3 t4-bold">상세 공략·해법</h2>
                      <ol className="list-decimal space-y-x3 pl-x5 t3-regular">{selected.walkthrough.map((line, index) => <li key={index}>{line}</li>)}</ol>
                      <ActionButton className="mt-x3 min-h-x11" variant="neutralOutline" onClick={() => setWalkthroughId(null)}>상세 공략 접기</ActionButton>
                    </section> : <ActionButton className="min-h-x11" variant="neutralOutline" onClick={() => setWalkthroughId(selected.id)}>상세 공략·해법 보기</ActionButton>)}
                    {selected.puzzleIds.map((id) => <Link key={id} href={`/oot/puzzles/${id}`} className="min-h-x11 py-x3 t3-bold text-fg-informative-contrast">힌트: {ootContent.puzzles.find((entry) => entry.id === id)?.name} →</Link>)}
                    {!done && !route.availableIds.includes(selected.id) && <p className="t3-regular">완료하려면 선행 구간과 시대·보유 조건을 확인해 주세요.</p>}
                    <ActionButton className="min-h-x11" variant="neutralSolid" disabled={!done && !route.availableIds.includes(selected.id)} onClick={() => {
                      commit({ ...progress, completedStopIds: done ? progress.completedStopIds.filter((id) => id !== selected.id) : [...progress.completedStopIds, selected.id], updatedAt: new Date().toISOString() });
                      setSelectedId(null);
                    }}>{done ? "완료 취소" : "이 역 완료"}</ActionButton>
                    <ContentSources verification={selected.verification} />
                  </div>}
                </BottomSheet.Body>
                <BottomSheet.CloseButton aria-label="역 안내 닫기">×</BottomSheet.CloseButton>
              </BottomSheet.Content>
            </BottomSheet.Positioner></Portal>
          </BottomSheet.Root>
        </>
      )}
    </>
  );
}
