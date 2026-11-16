import type { RouteStop } from "./content.ts";
import type { SavedProgress, SpoilerLevel } from "./progress-storage.ts";

type Progress = Pick<SavedProgress, "completedStopIds" | "confirmedItemIds" | "age" | "goalStopId">;

export function selectRoute(stops: RouteStop[], progress: Progress) {
  const completed = new Set(progress.completedStopIds);
  const items = new Set(progress.confirmedItemIds);
  const byId = new Map(stops.map((stop) => [stop.id, stop]));
  const providers = new Map(stops.flatMap((stop) => (stop.rewardItemIds ?? []).map((id) => [id, stop.id] as const)));
  const remaining = stops.filter((stop) => stop.kind !== "optional" && !completed.has(stop.id));
  const requirements = Object.fromEntries(stops.map((stop) => [stop.id, {
    stops: stop.prerequisiteStopIds.filter((id) => !completed.has(id)),
    items: stop.prerequisiteItemIds.filter((id) => !items.has(id)),
    age: stop.requiredAge && stop.requiredAge !== progress.age ? stop.requiredAge : null,
  }]));
  // 보유 확인된 장비는 획득 경유선을 제거한다. 완료만으로 장비를 추정하지 않는다.
  const dependencies = Object.fromEntries(stops.map((stop) => [stop.id, [...new Set([
    ...requirements[stop.id].stops,
    ...requirements[stop.id].items.flatMap((id) => {
      const provider = providers.get(id);
      return provider && provider !== stop.id && !completed.has(provider) ? [provider] : [];
    }),
  ])]]));
  const goalId = progress.goalStopId && byId.has(progress.goalStopId) ? progress.goalStopId : stops.at(-1)?.id ?? null;
  const needed = new Set<string>();
  function include(id: string) {
    if (completed.has(id) || needed.has(id) || !byId.has(id)) return;
    needed.add(id);
    dependencies[id].forEach(include);
  }
  if (goalId) include(goalId);
  const ready = (stop: RouteStop) => {
    const r = requirements[stop.id];
    return !r.stops.length && !r.items.length && !r.age;
  };
  const candidates = remaining.filter((stop) => needed.has(stop.id));
  // 준비된 후보를 콘텐츠 순서로 고른다. 이동 시간·재도전 비용을 최적화하는 계산은 아니다.
  const current = candidates.find(ready) ?? candidates.find((stop) => !dependencies[stop.id].length);
  const next = candidates.find((stop) => stop.id !== current?.id && dependencies[stop.id].every((id) => id === current?.id));
  // 완료 기록에서 그래프를 자르고 위상 단계별로 다시 배치한다. 순환은 콘텐츠 검사에서 차단한다.
  const depths = new Map<string, number>();
  function depth(id: string, visiting = new Set<string>()): number {
    if (depths.has(id)) return depths.get(id)!;
    if (visiting.has(id)) return 0;
    const path = new Set(visiting).add(id);
    const value = completed.has(id) ? -1 : Math.max(-1, ...dependencies[id].map((previous) => depth(previous, path))) + 1;
    depths.set(id, value);
    return value;
  }
  const layers: string[][] = [];
  for (const stop of remaining) {
    const level = depth(stop.id);
    (layers[level] ??= []).push(stop.id);
  }
  for (const layer of layers) layer.sort((a, b) => Number(needed.has(b)) - Number(needed.has(a)));
  return {
    goalId, currentId: current?.id ?? null, nextId: next?.id ?? null,
    neededIds: [...needed], dependencies, requirements, layers,
    availableIds: remaining.filter(ready).map((stop) => stop.id),
    blockedIds: remaining.filter((stop) => !ready(stop)).map((stop) => stop.id),
    // 기록 누락은 진행 금지가 아니다. 과거 완료와 현재 시대도 비교하지 않는다.
    conflictIds: stops.filter((stop) => completed.has(stop.id) && requirements[stop.id].stops.length).map((stop) => stop.id),
  };
}

export function isStopVisible(id: string, level: SpoilerLevel, progress: Pick<SavedProgress, "completedStopIds">, route: ReturnType<typeof selectRoute>) {
  return level !== "strict" || progress.completedStopIds.includes(id) || id === route.currentId;
}
