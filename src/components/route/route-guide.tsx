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
  const state = useProgress();
  return <RouteGuideView state={state} initialStopId={initialStopId} puzzleId={puzzleId} />;
}

export function RouteGuideView({ state, initialStopId, puzzleId }: { state: ReturnType<typeof useProgress>; initialStopId?: string; puzzleId?: string }) {
  const { progress, commit, storageNotice, notice } = state;
  const [view, setView] = useState<"all" | "remaining" | "list">("all");
  const [routeNotice, setRouteNotice] = useState("");
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

      {storageNotice && <p role="alert" className="mb-x4 t3-regular">{storageNotice} 원본 복구와 백업은 홈의 진행도·설정에서 이용해 주세요.</p>}
      {notice && <p role="status">{notice}</p>}
      {puzzle ? (
        visible ? <><HintReveal puzzle={puzzle} revealedIds={progress.revealedHintIds} onReveal={reveal} /><ContentSources verification={puzzle.verification} /></>
          : <p className="t3-regular">아직 공개하지 않은 구간이에요. <Link href="/oot" className="underline">홈의 설정</Link>에서 공개 범위를 직접 변경할 수 있어요.</p>
      ) : (
        <>
          <p className="mb-x3 t2-regular text-fg-neutral-muted">전체 {ootContent.stops.length}개 구간 중 {progress.completedStopIds.length}개 완료</p>
          <section className="mb-x4 rounded-r3 bg-bg-positive-weak p-x4" aria-label="경로 안내">
            <p className="t3-bold">{progress.spoilerLevel === "strict" ? "선택한 목적지까지" : `${ootContent.stops.find((stop) => stop.id === route.goalId)?.title ?? "엔딩"}까지`}</p>
            <p className="mt-x1 t2-regular">남은 경유 {route.neededIds.length}개 · 준비 확인된 구간 {route.availableIds.length}개</p>
            {progress.goalStopId && <ActionButton className="mt-x3" size="small" variant="neutralOutline" onClick={() => {
              commit({ ...progress, goalStopId: "final-battle", updatedAt: new Date().toISOString() });
              setRouteNotice("엔딩까지의 경로를 다시 구성했어요.");
            }}>엔딩까지 다시 보기</ActionButton>}
          </section>
          <div className="mb-x4 flex flex-wrap gap-x2" role="group" aria-label="노선 보기 방식">
            {([["all", "전체 노선"], ["remaining", "남은 경로"], ["list", "목록"]] as const).map(([value, label]) => <ActionButton key={value} size="small" aria-pressed={view === value} variant={view === value ? "neutralSolid" : "neutralOutline"} onClick={() => setView(value)}>{label}</ActionButton>)}
          </div>
          <p role="status" className={routeNotice ? "mb-x4 t3-regular" : "sr-only"}>{routeNotice}</p>
          <details className="mb-x4 rounded-r3 border border-stroke-neutral-muted px-x4 py-x2">
            <summary className="min-h-x11 cursor-pointer t3-bold">내 시대·장비 기록 수정</summary>
            <p className="mb-x3 t2-regular">게임에서 확인한 상태만 선택하세요. 완료와 장비는 따로 기록해요.</p>
            <div className="mb-x4 flex gap-x2" role="group" aria-label="현재 시대">
              {(["child", "adult"] as const).map((age) => <ActionButton key={age} size="small" aria-pressed={progress.age === age} variant={progress.age === age ? "neutralSolid" : "neutralOutline"} onClick={() => { commit({ ...progress, age, updatedAt: new Date().toISOString() }); setRouteNotice("시대에 맞춰 추천 구간을 다시 계산했어요."); }}>{age === "child" ? "소년" : "청년"}</ActionButton>)}
            </div>
            <div className="grid gap-x2 sm:grid-cols-2">{ootContent.items.map((item) => <label key={item.id} className="flex min-h-x11 items-center gap-x3 t3-regular">
              <input type="checkbox" checked={progress.confirmedItemIds.includes(item.id)} onChange={(event) => {
                commit({ ...progress, confirmedItemIds: event.target.checked ? [...progress.confirmedItemIds, item.id] : progress.confirmedItemIds.filter((id) => id !== item.id), updatedAt: new Date().toISOString() });
                setRouteNotice("장비 기록을 반영해 필요한 획득 경유와 연결을 다시 구성했어요.");
              }} />{item.title}
            </label>)}</div>
          </details>
          <RouteMap stops={ootContent.stops} progress={progress} view={view} onSelect={(id) => { setSelectedId(id); setWalkthroughId(null); }} />
          {selected && !visible && <p className="mt-x4 t3-regular">아직 공개하지 않은 구간이에요. 홈에서 스포일러 설정을 변경할 수 있어요.</p>}
          <BottomSheet.Root open={Boolean(selected && visible)} onOpenChange={(open) => { if (!open) { setSelectedId(null); setWalkthroughId(null); } }}>
            <Portal><BottomSheet.Positioner><BottomSheet.Backdrop />
              <BottomSheet.Content className="settings-sheet">
                <BottomSheet.Header><BottomSheet.Title>{visible ? selected.title : "모험 안내"}</BottomSheet.Title></BottomSheet.Header>
                <BottomSheet.Body>
                  {visible && <div className="flex flex-col gap-x4 pb-x6">
                    <ul className="list-disc pl-x5 t4-regular">{selected.summary.map((line) => <li key={line}>{line}</li>)}</ul>
                    <div className="flex flex-wrap gap-x2">
                      <ActionButton variant="neutralSolid" onClick={() => {
                        commit({ ...progress, completedStopIds: done ? progress.completedStopIds.filter((id) => id !== selected.id) : [...progress.completedStopIds, selected.id], updatedAt: new Date().toISOString() });
                        setRouteNotice(done ? "완료를 취소하고 남은 노선을 다시 연결했어요." : "완료한 구간을 반영해 남은 노선을 다시 구성했어요.");
                        setSelectedId(null); setWalkthroughId(null);
                      }}>{done ? "완료 취소" : "이 역 완료"}</ActionButton>
                      <ActionButton variant="neutralOutline" onClick={() => {
                        commit({ ...progress, goalStopId: selected.id, updatedAt: new Date().toISOString() });
                        setRouteNotice("선택한 목적지에 필요한 경유로 노선을 재구성했어요.");
                        setView("remaining"); setSelectedId(null); setWalkthroughId(null);
                      }}>여기로 경로 보기</ActionButton>
                    </div>
                    <p className="t2-regular text-fg-neutral-muted">플레이한 구간을 자유롭게 완료로 기록하세요. 준비 조건은 경로 안내에만 사용해요.</p>
                    {selected.routeNote && <p className="t3-regular">{selected.routeNote}</p>}
                    {route.requirements[selected.id].stops.length > 0 && <section aria-label="먼저 확인할 구간">
                      <h2 className="mb-x2 t3-bold">먼저 확인할 구간</h2>
                      <div className="flex flex-wrap gap-x2">{route.requirements[selected.id].stops.map((id) => <ActionButton key={id} size="small" variant="neutralWeak" onClick={() => { setSelectedId(id); setWalkthroughId(null); }}>{isStopVisible(id, progress.spoilerLevel, progress, route) ? ootContent.stops.find((stop) => stop.id === id)?.title : "미공개 준비 구간"}</ActionButton>)}</div>
                    </section>}
                    {selected.requiredAge && <p className="t3-regular">필요한 시대: {selected.requiredAge === "child" ? "소년" : "청년"} · 현재 확인: {progress.age === "child" ? "소년" : progress.age === "adult" ? "청년" : "미확인"}</p>}
                    {selected.prerequisiteItemIds.length > 0 && <p className="t3-regular">준비물: {selected.prerequisiteItemIds.map((id) => `${ootContent.items.find((item) => item.id === id)?.title} ${progress.confirmedItemIds.includes(id) ? "✓" : "(미확인)"}`).join(" · ")}</p>}
                    {selected.requiredAge && <div className="flex flex-wrap gap-x2" role="group" aria-label="시대 확인">
                      {(["child", "adult"] as const).map((age) => <ActionButton className="min-h-x11" key={age} aria-pressed={progress.age === age} variant={progress.age === age ? "neutralSolid" : "neutralOutline"} onClick={() => commit({ ...progress, age, updatedAt: new Date().toISOString() })}>{age === "child" ? "소년" : "청년"}</ActionButton>)}
                    </div>}
                    <details><summary className="min-h-x11 cursor-pointer t3-bold">이 구간의 준비물·획득물 기록</summary><div className="flex flex-col gap-x2">
                    {[...new Set([...selected.prerequisiteItemIds, ...(selected.rewardItemIds ?? [])])].map((id) => {
                      const item = ootContent.items.find((entry) => entry.id === id);
                      const confirmed = progress.confirmedItemIds.includes(id);
                      return <ActionButton className="min-h-x11" key={id} variant="neutralOutline" aria-pressed={confirmed} onClick={() => commit({ ...progress, confirmedItemIds: confirmed ? progress.confirmedItemIds.filter((value) => value !== id) : [...progress.confirmedItemIds, id], updatedAt: new Date().toISOString() })}>{item?.title} · {confirmed ? "보유 해제" : "보유 확인"}</ActionButton>;
                    })}
                    </div></details>
                    <p className="t2-regular text-fg-neutral-muted">장비와 시대는 게임에서 확인한 뒤 선택하세요. 완료 표시로 자동 획득하지 않아요.</p>
                    {selected.recommendationReason && <p className="t3-regular">추천 이유: {selected.recommendationReason}</p>}
                    {selected.walkthrough && (walkthroughId === selected.id ? <section aria-label="상세 공략">
                      <h2 className="mb-x3 t4-bold">상세 공략·해법</h2>
                      <ol className="list-decimal space-y-x3 pl-x5 t3-regular">{selected.walkthrough.map((line, index) => <li key={index}>{line}</li>)}</ol>
                      <ActionButton className="mt-x3 min-h-x11" variant="neutralOutline" onClick={() => setWalkthroughId(null)}>상세 공략 접기</ActionButton>
                    </section> : <ActionButton className="min-h-x11" variant="neutralOutline" onClick={() => setWalkthroughId(selected.id)}>상세 공략·해법 보기</ActionButton>)}
                    {selected.puzzleIds.map((id) => <Link key={id} href={`/oot/puzzles/${id}`} className="min-h-x11 py-x3 t3-bold text-fg-informative-contrast">힌트: {ootContent.puzzles.find((entry) => entry.id === id)?.name} →</Link>)}
                    <details><summary className="min-h-x11 cursor-pointer t3-bold">출처·판본·검증 상태</summary>
                      <ContentSources verification={selected.verification} />
                      {selected.routeVerification && <ContentSources verification={selected.routeVerification} />}
                    </details>
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
