import assert from "node:assert/strict";
import test from "node:test";
import {
  createInitialProgress,
  readStoredProgress,
  sanitizeProgress,
  saveStoredProgress,
} from "./adventure-progress.ts";

function createMemoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => { map.set(key, value); },
  };
}

test("진행도 초기값 및 저장·복원", () => {
  const storage = createMemoryStorage();
  assert.deepEqual(readStoredProgress("link01", storage), createInitialProgress());

  const next = {
    currentCardId: "deku-tree" as const,
    selectedHistory: ["kokiri-gear" as const],
    revealedHints: ["kokiri-gear-1"],
  };
  assert.equal(saveStoredProgress("link01", next, storage), true);
  assert.deepEqual(readStoredProgress("link01", storage), next);
});

test("잘못된 카드 ID와 중복 힌트 정리", () => {
  const cleaned = sanitizeProgress({
    currentCardId: "unknown" as never,
    selectedHistory: ["kokiri-gear", "bad" as never],
    revealedHints: ["kokiri-gear-1", "kokiri-gear-1"],
  });
  assert.deepEqual(cleaned, {
    currentCardId: "kokiri-gear",
    selectedHistory: ["kokiri-gear"],
    revealedHints: ["kokiri-gear-1"],
  });
});
