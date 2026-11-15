"use client";

import { useEffect, useRef, useState } from "react";
import { ActionButton } from "@seed-design/react";
import type { RouteStop } from "@/lib/content";
import type { SavedProgress } from "@/lib/progress-storage";
import { isStopVisible, selectRoute } from "@/lib/route-selection";
import { layoutRoute } from "@/lib/route-layout";
import styles from "./route-map.module.css";

export function RouteMap({ stops, progress, onSelect, view }: {
  stops: RouteStop[]; progress: SavedProgress; onSelect: (id: string) => void; view: "all" | "remaining" | "list";
}) {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const hold = useRef<ReturnType<typeof setTimeout> | null>(null);
  const origin = useRef({ x: 0, y: 0 });
  const heldId = useRef<string | null>(null);
  function cancelHold() { if (hold.current) clearTimeout(hold.current); hold.current = null; }
  useEffect(() => () => { if (hold.current) clearTimeout(hold.current); }, []);
  const route = selectRoute(stops, progress);
  const byId = new Map(stops.map((stop) => [stop.id, stop]));
  const { layers, width, height, positions, connections } = layoutRoute(route, view === "remaining");
  function station(stop: RouteStop) {
    const visible = isStopVisible(stop.id, progress.spoilerLevel, progress, route);
    const done = progress.completedStopIds.includes(stop.id);
    const status = done ? "완료" : stop.id === route.currentId ? "추천" : route.availableIds.includes(stop.id) ? "준비 확인됨" : "준비 확인";
    const label = `${stop.title} · ${status}`;
    if (view === "list") return visible ? <ActionButton className="min-h-x11 h-auto w-full whitespace-normal py-x3" variant={stop.id === route.currentId ? "neutralSolid" : "neutralOutline"} onClick={() => onSelect(stop.id)}>{label}</ActionButton> : <p className="t3-regular text-fg-neutral-muted">미공개 구간</p>;
    return <button type="button" aria-describedby={previewId === stop.id && visible ? `preview-${stop.id}` : undefined} className={styles.station} aria-label={visible ? label : "미공개 구간"} disabled={!visible}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setPreviewId(stop.id); }}
      onPointerLeave={() => { cancelHold(); setPreviewId(null); }}
      onFocus={() => setPreviewId(stop.id)} onBlur={() => setPreviewId(null)} onKeyDown={(event) => { if (event.key === "Escape") setPreviewId(null); }}
      onPointerDown={(event) => {
        cancelHold(); heldId.current = null; origin.current = { x: event.clientX, y: event.clientY };
        if (event.pointerType !== "mouse") {
          setPreviewId(null);
          hold.current = setTimeout(() => { setPreviewId(stop.id); heldId.current = stop.id; }, 450);
        }
      }}
      onPointerMove={(event) => { if (Math.hypot(event.clientX - origin.current.x, event.clientY - origin.current.y) > 8) cancelHold(); }}
      onPointerUp={cancelHold} onPointerCancel={() => { cancelHold(); setPreviewId(null); }}
      onContextMenu={(event) => event.preventDefault()}
      onClick={() => { if (heldId.current === stop.id) { heldId.current = null; return; } setPreviewId(null); onSelect(stop.id); }} data-status={done ? "done" : stop.id === route.currentId ? "recommended" : route.availableIds.includes(stop.id) ? "ready" : "pending"}>
      <span className={styles.dot} aria-hidden="true" />
      {previewId === stop.id && visible && <span id={`preview-${stop.id}`} role="tooltip" className={styles.name} style={(positions.get(stop.id)?.x ?? 150) < 80 ? { left: 0, transform: "none" } : (positions.get(stop.id)?.x ?? 150) > width - 80 ? { left: "auto", right: 0, transform: "none" } : undefined}>{stop.title}<span className="block t1-regular">{status}</span></span>}
    </button>;
  }
  if (view === "list") return <ul aria-label="모험 노선 목록" className="grid gap-x3 sm:grid-cols-2">{stops.map((stop) => <li key={stop.id}>{station(stop)}</li>)}</ul>;
  return <>
    {view === "all" && progress.completedStopIds.length > 0 && <details className="mb-x5">
      <summary className="min-h-x11 cursor-pointer t3-bold">완료한 역 · {progress.completedStopIds.length}</summary>
      <div className="flex flex-wrap gap-x2">{stops.filter((stop) => progress.completedStopIds.includes(stop.id)).map((stop) => <ActionButton key={stop.id} size="small" variant="neutralWeak" onClick={() => onSelect(stop.id)}>✓ {stop.title}</ActionButton>)}</div>
    </details>}
    {!layers.length ? <p className="py-x6 t4-bold">이 목적지까지 남은 구간이 없어요. 다른 목적지를 선택하거나 기록을 수정할 수 있어요.</p> : <>
      <p id="map-help" className="sr-only">역에 포커스하면 이름, 선택하면 상세 안내를 확인할 수 있어요. 실선은 선행 구간, 점선은 장비 준비예요.</p>
      <div className={styles.viewport} tabIndex={0} role="region" aria-label="모험 환승 노선도" aria-describedby="map-help">
        <div className={styles.canvas} style={{ width, height }}>
          <svg aria-hidden="true" width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={styles.lines}>
            {connections.map((edge) => <g key={`${edge.from}-${edge.to}`} opacity={route.neededIds.includes(edge.to) ? 1 : 0.35}>
              <path d={edge.path} className={styles.bridge} />
              <path d={edge.path} className={styles.track} strokeDasharray={!byId.get(edge.to)!.prerequisiteStopIds.includes(edge.from) ? "4 7" : undefined} />
            </g>)}
          </svg>
          <ul aria-label="모험 노선" className={styles.nodes}>{layers.flat().map((id) => {
            const point = positions.get(id)!;
            return <li key={id} style={{ left: point.x - 24, top: point.y - 24 }} className={styles.node}>{station(byId.get(id)!)}</li>;
          })}</ul>
        </div>
      </div>
    </>}
  </>;
}
