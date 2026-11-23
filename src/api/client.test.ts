import assert from "node:assert/strict";
import test from "node:test";
import { ApiError, apiRequest } from "./client.ts";

test("apiRequest: 성공 응답에서 data를 추출한다", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ ok: true, data: { value: 42 } }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })) as typeof fetch;

  try {
    const result = await apiRequest<{ value: number }>("/api/test");
    assert.deepEqual(result, { value: 42 });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("apiRequest: 실패 응답은 ApiError와 에러 코드로 던진다", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ ok: false, code: "pii" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })) as typeof fetch;

  try {
    await assert.rejects(
      () => apiRequest("/api/test"),
      (err: unknown) => err instanceof ApiError && err.code === "pii" && err.status === 400,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
