import type { RouteStop } from "./content.ts";
import type { SavedProgress, SpoilerLevel } from "./progress-storage.ts";

export function selectRoute(stops: RouteStop[], progress: Pick<SavedProgress, "completedStopIds" | "confirmedItemIds">) {
  const completed = new Set(progress.completedStopIds);
  const items = new Set(progress.confirmedItemIds);
  const possible = (stop: RouteStop, completedIds = completed) =>
    stop.prerequisiteStopIds.every((id) => completedIds.has(id)) && stop.prerequisiteItemIds.every((id) => items.has(id));
  const remaining = stops.filter((stop) => stop.kind !== "optional" && !completed.has(stop.id));
  const current = remaining.find((stop) => possible(stop));
  const afterCurrent = new Set(completed);
  if (current) afterCurrent.add(current.id);
  const next = current ? remaining.find((stop) => stop.id !== current.id && possible(stop, afterCurrent)) : undefined;
  return {
    currentId: current?.id ?? null,
    nextId: next?.id ?? null,
    availableIds: remaining.filter((stop) => possible(stop)).map((stop) => stop.id),
    blockedIds: remaining.filter((stop) => !possible(stop)).map((stop) => stop.id),
    conflictIds: stops.filter((stop) => completed.has(stop.id) && !possible(stop)).map((stop) => stop.id),
  };
}

export function isStopVisible(id: string, level: SpoilerLevel, progress: Pick<SavedProgress, "completedStopIds">, route: ReturnType<typeof selectRoute>) {
  return level === "full" || progress.completedStopIds.includes(id) || id === route.currentId || (level === "default" && id === route.nextId);
}
