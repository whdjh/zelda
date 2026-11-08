import type { RouteStop } from "./content.ts";
import type { SavedProgress, SpoilerLevel } from "./progress-storage.ts";

export function selectRoute(stops: RouteStop[], progress: Pick<SavedProgress, "completedStopIds" | "confirmedItemIds" | "age">) {
  const completed = new Set(progress.completedStopIds);
  const items = new Set(progress.confirmedItemIds);
  const connected = (stop: RouteStop, completedIds = completed) => stop.prerequisiteStopIds.every((id) => completedIds.has(id));
  const hasItems = (stop: RouteStop) => stop.prerequisiteItemIds.every((id) => items.has(id));
  const possible = (stop: RouteStop) => connected(stop) && hasItems(stop) && (!stop.requiredAge || stop.requiredAge === progress.age);
  const remaining = stops.filter((stop) => stop.kind !== "optional" && !completed.has(stop.id));
  // 준비물이 없어도 목표와 준비 방법은 보여야 한다. 완료 가능 여부와 목표 선택은 다르다.
  const current = remaining.find((stop) => connected(stop));
  const afterCurrent = new Set(completed);
  if (current) afterCurrent.add(current.id);
  const next = current ? remaining.find((stop) => stop.id !== current.id && connected(stop, afterCurrent)) : undefined;
  return {
    currentId: current?.id ?? null,
    nextId: next?.id ?? null,
    availableIds: remaining.filter((stop) => possible(stop)).map((stop) => stop.id),
    blockedIds: remaining.filter((stop) => !possible(stop)).map((stop) => stop.id),
    // 시대가 바뀌어도 과거 시대의 완료 기록은 모순이 아니다.
    conflictIds: stops.filter((stop) => completed.has(stop.id) && (!connected(stop) || !hasItems(stop))).map((stop) => stop.id),
  };
}

export function isStopVisible(id: string, level: SpoilerLevel, progress: Pick<SavedProgress, "completedStopIds">, route: ReturnType<typeof selectRoute>) {
  return level === "full" || progress.completedStopIds.includes(id) || id === route.currentId || (level === "default" && id === route.nextId);
}
