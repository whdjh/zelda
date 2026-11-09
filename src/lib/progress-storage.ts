import type { GuideContent } from "./content.ts";

export const STORAGE_KEY = "zelda-highpass:oot:progress:v1";
export const MAX_BACKUP_BYTES = 1024 * 1024;
export type SpoilerLevel = "strict" | "default" | "full";
export type SavedProgress = {
  schemaVersion: 1;
  contentVersion: string;
  completedStopIds: string[];
  confirmedItemIds: string[];
  revealedHintIds: string[];
  spoilerLevel: SpoilerLevel;
  age?: "unknown" | "child" | "adult";
  goalStopId?: string;
  updatedAt: string;
};

export function createProgress(content: GuideContent): SavedProgress {
  return {
    schemaVersion: 1,
    contentVersion: content.version,
    completedStopIds: [],
    confirmedItemIds: [],
    revealedHintIds: [],
    spoilerLevel: "full",
    age: "unknown",
    updatedAt: new Date().toISOString(),
  };
}

export function parseProgress(raw: string, content: GuideContent): SavedProgress {
  if (new TextEncoder().encode(raw).byteLength > MAX_BACKUP_BYTES) {
    throw new Error("백업 파일은 1MB 이하여야 합니다.");
  }
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error("JSON을 읽을 수 없습니다. 원본 기록은 유지됩니다.");
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("올바른 진행도 백업이 아닙니다.");
  }
  const data = value as Record<string, unknown>;
  if (data.schemaVersion !== 1) throw new Error("지원하지 않는 저장 버전입니다. 원본 파일을 보관해 주세요.");
  if (data.contentVersion !== content.version) {
    throw new Error("다른 콘텐츠 버전의 기록입니다. 호환성을 확인할 때까지 원본을 보관해 주세요.");
  }
  if (data.goalStopId !== undefined && (typeof data.goalStopId !== "string" || !content.stops.some((stop) => stop.id === data.goalStopId))) {
    throw new Error("경로 목적지가 현재 공략에 없습니다.");
  }
  const levels = ["strict", "default", "full"];
  if (typeof data.spoilerLevel !== "string" || !levels.includes(data.spoilerLevel)) {
    throw new Error("스포일러 설정이 올바르지 않습니다.");
  }
  if (typeof data.updatedAt !== "string" || Number.isNaN(Date.parse(data.updatedAt))) {
    throw new Error("기록의 저장 날짜가 올바르지 않습니다.");
  }
  if (data.age !== undefined && !["unknown", "child", "adult"].includes(data.age as string)) {
    throw new Error("시대 기록이 올바르지 않습니다.");
  }
  function readIds(field: string, allowed: Set<string>): string[] {
    const values = data[field];
    if (!Array.isArray(values) || values.some((id) => typeof id !== "string" || !allowed.has(id))) {
      throw new Error(`${field}: 현재 공략에 없는 기록이 있습니다. 원본은 유지됩니다.`);
    }
    if (new Set(values).size !== values.length) throw new Error(`${field}: 중복된 기록이 있습니다.`);
    return values;
  }
  return {
    schemaVersion: 1,
    contentVersion: content.version,
    completedStopIds: readIds("completedStopIds", new Set(content.stops.map((stop) => stop.id))),
    confirmedItemIds: readIds("confirmedItemIds", new Set(content.items.map((item) => item.id))),
    revealedHintIds: readIds("revealedHintIds", new Set(content.puzzles.flatMap((puzzle) => puzzle.hints.map((hint) => hint.id)))),
    spoilerLevel: data.spoilerLevel === "default" ? "full" : data.spoilerLevel as SpoilerLevel,
    ...(data.goalStopId ? { goalStopId: data.goalStopId as string } : {}),
    age: (data.age as SavedProgress["age"]) ?? "unknown",
    updatedAt: data.updatedAt,
  };
}

type StorageAccess = () => Pick<Storage, "getItem" | "setItem">;
type LoadResult =
  | { ok: true; progress: SavedProgress; raw: string | null }
  | { ok: false; message: string; raw: string | null };

export function loadProgress(access: StorageAccess, content: GuideContent): LoadResult {
  let raw: string | null = null;
  try {
    raw = access().getItem(STORAGE_KEY);
    return { ok: true, progress: raw === null ? createProgress(content) : parseProgress(raw, content), raw };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "브라우저 저장소를 읽을 수 없습니다.", raw };
  }
}

export function saveProgress(access: StorageAccess, progress: SavedProgress): boolean {
  try {
    access().setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
