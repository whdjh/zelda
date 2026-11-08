"use client";

import { ActionButton, BottomSheet, Portal } from "@seed-design/react";
import Link from "next/link";
import { useState } from "react";
import { ootContent } from "../../../content/ocarina-of-time/index";
import { useProgress } from "@/lib/use-progress";
import { isStopVisible, selectRoute } from "@/lib/route-selection";
import { RouteMap } from "./route-map";
import { HintReveal } from "../hint/hint-reveal";

export function RouteGuide({ initialStopId, puzzleId }: { initialStopId?: string; puzzleId?: string }) {
  const { progress, commit, storageNotice, notice } = useProgress();
  const [selectedId, setSelectedId] = useState(initialStopId ?? null);
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
        visible ? <HintReveal puzzle={puzzle} revealedIds={progress.revealedHintIds} onReveal={reveal} />
          : <p className="t3-regular">아직 공개하지 않은 구간이에요. <Link href="/oot" className="underline">홈의 설정</Link>에서 공개 범위를 직접 변경할 수 있어요.</p>
      ) : (
        <>
          <RouteMap stops={ootContent.stops} progress={progress} onSelect={setSelectedId} />
          {selected && !visible && <p className="mt-x4 t3-regular">아직 공개하지 않은 구간이에요. 홈에서 스포일러 설정을 변경할 수 있어요.</p>}
          <BottomSheet.Root open={Boolean(selected && visible)} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
            <Portal><BottomSheet.Positioner><BottomSheet.Backdrop />
              <BottomSheet.Content className="settings-sheet">
                <BottomSheet.Header><BottomSheet.Title>{visible ? selected.title : "모험 안내"}</BottomSheet.Title></BottomSheet.Header>
                <BottomSheet.Body>
                  {visible && <div className="flex flex-col gap-x4 pb-x6">
                    <p className="t2-regular text-fg-neutral-muted">검증: {selected.verification.status} · {selected.verification.version}</p>
                    <ul className="list-disc pl-x5 t4-regular">{selected.summary.map((line) => <li key={line}>{line}</li>)}</ul>
                    {selected.recommendationReason && <p className="t3-regular">추천 이유: {selected.recommendationReason}</p>}
                    {selected.puzzleIds.map((id) => <Link key={id} href={`/oot/puzzles/${id}`} className="min-h-x11 py-x3 t3-bold text-fg-informative-contrast">퍼즐 도움 열기</Link>)}
                    <ActionButton variant="neutralSolid" disabled={!done && !route.availableIds.includes(selected.id)} onClick={() => {
                      commit({ ...progress, completedStopIds: done ? progress.completedStopIds.filter((id) => id !== selected.id) : [...progress.completedStopIds, selected.id], updatedAt: new Date().toISOString() });
                      setSelectedId(null);
                    }}>{done ? "완료 취소" : "이 역 완료"}</ActionButton>
                  </div>}
                </BottomSheet.Body>
                <BottomSheet.CloseButton aria-label="역 안내 닫기">×</BottomSheet.CloseButton>
              </BottomSheet.Content>
            </BottomSheet.Positioner></Portal>
          </BottomSheet.Root>
        </>
      )}
      {ootContent.items.length > 0 && <section className="mt-x6" aria-label="보유 조건 확인">
        <h2 className="mb-x3 t4-bold">확인한 보유 조건</h2>
        <p className="mb-x3 t3-regular text-fg-neutral-muted">아이템 이름은 해당 준비가 필요한 공개 구간에서만 보여요.</p>
        {ootContent.items.filter((item) => ootContent.stops.some((stop) => isStopVisible(stop.id, progress.spoilerLevel, progress, route) && stop.prerequisiteItemIds.includes(item.id))).map((item) => {
          const confirmed = progress.confirmedItemIds.includes(item.id);
          return <ActionButton key={item.id} className="mb-x2 mr-x2" variant="neutralOutline" onClick={() => commit({ ...progress, confirmedItemIds: confirmed ? progress.confirmedItemIds.filter((id) => id !== item.id) : [...progress.confirmedItemIds, item.id], updatedAt: new Date().toISOString() })}>{item.title} · {confirmed ? "보유 해제" : "보유 확인"}</ActionButton>;
        })}
      </section>}
    </>
  );
}
