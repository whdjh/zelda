import assert from "node:assert/strict";
import { test } from "node:test";
import { ootContent } from "../../content/ocarina-of-time/index.ts";
import { createProgress, loadProgress, MAX_BACKUP_BYTES, parseProgress, saveProgress, STORAGE_KEY } from "./progress-storage.ts";

test("빈 기록과 스포일러 설정을 JSON으로 왕복하고 알 수 없는 필드는 내보내지 않는다", () => {
  const progress = { ...createProgress(ootContent), spoilerLevel: "strict" as const };
  assert.deepEqual(parseProgress(JSON.stringify({ ...progress, email: "private" }), ootContent), progress);
});

test("손상 JSON, 미지원 버전, 다른 콘텐츠, 없는 ID를 거부한다", () => {
  const original = createProgress(ootContent);
  assert.throws(() => parseProgress("{broken", ootContent), /JSON/);
  for (const patch of [
    { schemaVersion: 2 }, { contentVersion: "older" }, { completedStopIds: ["unknown"] },
    { confirmedItemIds: ["unknown"] }, { revealedHintIds: ["unknown"] },
    { spoilerLevel: "invalid" }, { updatedAt: "not-a-date" }, { completedStopIds: null },
  ]) {
    assert.throws(() => parseProgress(JSON.stringify({ ...original, ...patch }), ootContent));
  }
  for (const raw of ["null", "[]", "5", "false"]) assert.throws(() => parseProgress(raw, ootContent));
});

test("크기 제한은 UTF-8 바이트 기준으로 적용한다", () => {
  assert.throws(() => parseProgress("가".repeat(Math.ceil(MAX_BACKUP_BYTES / 3)), ootContent), /1MB/);
});

test("첫 방문에는 기본 상태를 반환하고 아직 저장하지 않는다", () => {
  let writes = 0;
  const result = loadProgress(() => ({ getItem: () => null, setItem: () => { writes++; } }), ootContent);
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.progress.spoilerLevel, "default");
  assert.equal(writes, 0);
});

test("손상 기록은 원문과 함께 반환하고 덮어쓰지 않는다", () => {
  let writes = 0;
  const result = loadProgress(() => ({ getItem: () => "{broken", setItem: () => { writes++; } }), ootContent);
  assert.equal(result.ok, false);
  assert.equal(result.raw, "{broken");
  assert.equal(writes, 0);
});

test("스토리지 접근 차단과 쓰기 용량 초과를 처리한다", () => {
  const inaccessible = () => { throw new Error("denied"); };
  assert.equal(loadProgress(inaccessible, ootContent).ok, false);
  assert.equal(saveProgress(inaccessible, createProgress(ootContent)), false);
  assert.equal(saveProgress(() => ({ getItem: () => null, setItem: () => { throw new Error("quota"); } }), createProgress(ootContent)), false);
});

test("기록을 저장한 뒤 다시 읽어도 공개 범위를 유지한다", () => {
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
  const progress = { ...createProgress(ootContent), spoilerLevel: "full" as const };
  assert.equal(saveProgress(() => storage, progress), true);
  assert.ok(values.has(STORAGE_KEY));
  const restored = loadProgress(() => storage, ootContent);
  assert.equal(restored.ok, true);
  if (restored.ok) assert.deepEqual(restored.progress, progress);
});
