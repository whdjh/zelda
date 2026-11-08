"use client";

import { ActionButton } from "@seed-design/react";
import type { RouteStop } from "@/lib/content";
import type { SavedProgress } from "@/lib/progress-storage";
import { isStopVisible, selectRoute } from "@/lib/route-selection";

export function RouteMap({ stops, progress, onSelect }: { stops: RouteStop[]; progress: SavedProgress; onSelect: (id: string) => void }) {
  const route = selectRoute(stops, progress);
  return (
    <ol aria-label="모험 노선" className="flex flex-col gap-x3">
      {stops.filter((stop) => stop.kind !== "optional").map((stop) => {
        const visible = isStopVisible(stop.id, progress.spoilerLevel, progress, route);
        const done = progress.completedStopIds.includes(stop.id);
        const status = done ? "완료" : stop.id === route.currentId ? "현재" : stop.id === route.nextId ? "다음" : "미진행";
        return (
          <li key={stop.id} className="flex items-center gap-x3">
            <svg aria-hidden="true" viewBox="0 0 16 56" className="h-x14 w-x4 shrink-0 text-fg-positive-contrast">
              <path d="M8 0v56" stroke="currentColor" strokeWidth="2" />
              <circle cx="8" cy="28" r="5" fill="currentColor" />
            </svg>
            {visible ? (
              <ActionButton className="h-auto min-h-x11 min-w-0 whitespace-normal py-x3" variant={stop.id === route.currentId ? "neutralSolid" : "neutralWeak"} onClick={() => onSelect(stop.id)}>
                {stop.title} · {status}
              </ActionButton>
            ) : <p className="t3-regular text-fg-neutral-muted">미발견 역 · 잠김</p>}
          </li>
        );
      })}
    </ol>
  );
}
