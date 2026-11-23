import assert from "node:assert/strict";
import test from "node:test";
import {
  ADVENTURE_ID_STORAGE_KEY,
  clearStoredAdventure,
  readStoredAdventure,
  saveStoredAdventure,
  validateAdventureId,
} from "./adventure-id.ts";

function createMemoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => { map.set(key, value); },
    removeItem: (key: string) => { map.delete(key); },
  };
}

test("자유 아이디 검증: 한글·영문·숫자·하이픈·언더스코어 허용", () => {
  assert.deepEqual(validateAdventureId("  hyrule_link-01 "), { ok: true, value: "hyrule_link-01" });
  assert.deepEqual(validateAdventureId("코키리초보"), { ok: true, value: "코키리초보" });
});

test("자유 아이디 검증: 길이·특수문자·개인정보 형태 차단", () => {
  assert.equal(validateAdventureId("").ok, false);
  assert.equal(validateAdventureId("a").ok, false);
  assert.equal(validateAdventureId("a".repeat(25)).ok, false);
  assert.equal(validateAdventureId("link@hyrule.com").ok, false);
  assert.equal(validateAdventureId("010-1234-5678").ok, false);
  assert.equal(validateAdventureId("01012345678").ok, false);
  assert.equal(validateAdventureId("link hyrule").ok, false);
});

test("로컬스토리지 저장·복원·초기화 및 손상 JSON 복구", () => {
  const storage = createMemoryStorage();
  assert.equal(readStoredAdventure(storage), null);

  assert.equal(saveStoredAdventure("젤다_모험가", storage), true);
  const restored = readStoredAdventure(storage);
  assert.equal(restored?.adventureId, "젤다_모험가");
  assert.ok(restored?.updatedAt);

  storage.setItem(ADVENTURE_ID_STORAGE_KEY, "{broken-json");
  assert.equal(readStoredAdventure(storage), null);

  saveStoredAdventure("link-01", storage);
  clearStoredAdventure(storage);
  assert.equal(readStoredAdventure(storage), null);
});
