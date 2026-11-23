export const ADVENTURE_ID_STORAGE_KEY = "zelda-highpass:adventure-id:v1";

export type AdventureIdErrorCode = "empty" | "pii" | "length" | "charset";

export type ValidationResult =
  | { ok: true; value: string }
  | { ok: false; code: AdventureIdErrorCode };

const ALLOWED_ID_PATTERN = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9_-]+$/;
const PHONE_LIKE_PATTERN = /^01[016789]-?\d{3,4}-?\d{4}$/;

export function validateAdventureId(raw: string): ValidationResult {
  const value = raw.trim();
  if (!value) return { ok: false, code: "empty" };
  if (value.includes("@") || PHONE_LIKE_PATTERN.test(value)) return { ok: false, code: "pii" };
  if (value.length < 2 || value.length > 24) return { ok: false, code: "length" };
  if (!ALLOWED_ID_PATTERN.test(value)) return { ok: false, code: "charset" };
  return { ok: true, value };
}

export interface StoredAdventure {
  adventureId: string;
  updatedAt: string;
}

export function readStoredAdventure(storage?: Pick<Storage, "getItem">): StoredAdventure | null {
  const target = storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
  if (!target) return null;
  try {
    const raw = target.getItem(ADVENTURE_ID_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredAdventure>;
    if (typeof parsed.adventureId !== "string") return null;
    const checked = validateAdventureId(parsed.adventureId);
    if (!checked.ok) return null;
    return {
      adventureId: checked.value,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : "",
    };
  } catch {
    return null;
  }
}

export function saveStoredAdventure(adventureId: string, storage?: Pick<Storage, "setItem">): boolean {
  const checked = validateAdventureId(adventureId);
  if (!checked.ok) return false;
  const target = storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
  if (!target) return false;
  try {
    const payload: StoredAdventure = {
      adventureId: checked.value,
      updatedAt: new Date().toISOString(),
    };
    target.setItem(ADVENTURE_ID_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function clearStoredAdventure(storage?: Pick<Storage, "removeItem">): void {
  const target = storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
  if (!target) return;
  try {
    target.removeItem(ADVENTURE_ID_STORAGE_KEY);
  } catch {
    // 스토리지 접근이 막힌 환경에서는 무시한다.
  }
}
