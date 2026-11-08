import { expect, test } from "@playwright/test";
import { STORAGE_KEY } from "../../src/lib/progress-storage";

test("첫 화면과 시트는 작은 화면에서 넘치지 않고 키보드로 열고 닫는다", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveURL(/\/oot$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("헤매는 시간");
  await expect(page.getByRole("link", { name: "공략 시작하기" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("button", { name: "진행도·설정", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "진행도·설정" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "기본", exact: true })).toBeChecked();
  await expect(page.getByRole("link", { name: "로그인 안내" })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "진행도·설정", exact: true })).toBeFocused();
  expect(errors).toEqual([]);
});

test("설정을 저장해 복원하고 백업을 내보내며 잘못된 가져오기는 거부한다", async ({ page }) => {
  await page.goto("/oot");
  await page.getByRole("button", { name: "진행도·설정", exact: true }).click();
  await page.getByText("엄격", { exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("스포일러 설정을 저장했어요.");
  const before = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
  await page.reload();
  await page.getByRole("button", { name: "진행도·설정", exact: true }).click();
  await expect(page.getByRole("radio", { name: "엄격", exact: true })).toBeChecked();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "백업 내보내기", exact: true }).click();
  expect((await downloadPromise).suggestedFilename()).toBe("zelda-highpass-progress.json");
  await page.getByLabel("백업 파일 가져오기").setInputFiles({ name: "broken.json", mimeType: "application/json", buffer: Buffer.from("{broken") });
  await expect(page.getByRole("status")).toContainText("JSON");
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(before);
  const backup = { ...JSON.parse(before!), spoilerLevel: "default" };
  await page.getByLabel("백업 파일 가져오기").setInputFiles({ name: "backup.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify(backup)) });
  await expect(page.getByRole("button", { name: "백업으로 교체" })).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe(before);
  await page.getByRole("button", { name: "백업으로 교체" }).click();
  await expect(page.getByRole("radio", { name: "기본", exact: true })).toBeChecked();
  await expect(page.getByRole("status")).toHaveText("백업을 복원하고 저장했어요.");
});

test("손상된 원본 기록은 설정을 바꿔도 보존한다", async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, "{broken"), STORAGE_KEY);
  await page.goto("/oot");
  await page.getByRole("button", { name: "진행도·설정", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("JSON");
  await page.getByText("엄격", { exact: true }).click();
  expect(await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY)).toBe("{broken");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "보존된 원본 내보내기" }).click();
  expect((await downloadPromise).suggestedFilename()).toBe("zelda-highpass-original.json");
});

test("저장 차단 시 현재 탭에서 설정을 바꿀 수 있고 실패를 고지한다", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException("blocked", "QuotaExceededError"); };
  });
  await page.goto("/oot");
  await page.getByRole("button", { name: "진행도·설정", exact: true }).click();
  await page.getByText("엄격", { exact: true }).click();
  await expect(page.getByRole("radio", { name: "엄격", exact: true })).toBeChecked();
  await expect(page.getByRole("alert")).toContainText("저장할 수 없어요");
});

test("외부 설정 없이 로그인 안내·공략 노선·없는 콘텐츠를 안전하게 표시한다", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("로그인 연결을 준비하고 있어요.", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "이메일로 로그인 링크 받기" })).toBeDisabled();
  await page.goto("/oot/route");
  await expect(page.getByRole("button", { name: "숲에서 출발 준비 · 현재" })).toBeVisible();
  const response = await page.goto("/oot/puzzles/unknown");
  expect(response?.status()).toBe(404);
});


test("공략·미래 이름·정답은 요청한 범위에서만 공개하고 완료 뒤 다음 목표로 간다", async ({ page }) => {
  await page.goto("/oot/route");
  await expect(page.getByRole("button", { name: "마지막 전투와 엔딩", exact: false })).toHaveCount(0);
  await page.getByRole("button", { name: "숲에서 출발 준비 · 현재" }).click();
  await expect(page.getByRole("region", { name: "상세 공략", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "이 역 완료", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "소년", exact: true }).click();
  await page.getByRole("button", { name: "상세 공략·해법 보기" }).click();
  await expect(page.getByRole("region", { name: "상세 공략", exact: true })).toContainText("40루피");
  await page.getByRole("button", { name: "이 역 완료", exact: true }).click();
  await expect(page.getByRole("button", { name: "첫 던전의 아래층으로 · 현재" })).toBeVisible();
  await page.getByRole("button", { name: "숲에서 출발 준비 · 완료" }).click();
  await expect(page.getByRole("region", { name: "상세 공략", exact: true })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await page.goto("/oot/puzzles/first-equipment");
  await expect(page.getByRole("list", { name: "공개한 힌트" })).toBeEmpty();
  await page.getByRole("button", { name: "힌트 1 보기" }).click();
  await expect(page.getByRole("list", { name: "공개한 힌트" }).getByRole("listitem")).toHaveCount(1);
  await page.getByRole("button", { name: "바로 정답 보기" }).click();
  await expect(page.getByRole("list", { name: "공개한 힌트" })).toContainText("40루피");
  await page.reload();
  await expect(page.getByRole("list", { name: "공개한 힌트" })).toContainText("40루피");
});

test("전체 공개에서 모든 역의 상세 본문과 연결을 확인한다", async ({ page }) => {
  test.setTimeout(90_000);
  const { ootContent } = await import("../../content/ocarina-of-time/index");
  await page.addInitScript(({ key, version }) => localStorage.setItem(key, JSON.stringify({
    schemaVersion: 1, contentVersion: version, completedStopIds: [], confirmedItemIds: [],
    revealedHintIds: [], spoilerLevel: "full", age: "unknown", updatedAt: new Date().toISOString(),
  })), { key: STORAGE_KEY, version: ootContent.version });
  await page.goto("/oot/route");
  for (const stop of ootContent.stops) {
    await page.getByRole("button", { name: `${stop.title} ·`, exact: false }).click();
    const dialog = page.getByRole("dialog", { name: stop.title, exact: true });
    await expect(dialog.getByRole("region", { name: "상세 공략", exact: true })).toHaveCount(0);
    await dialog.getByRole("button", { name: "상세 공략·해법 보기" }).click();
    await expect(dialog.getByRole("region", { name: "상세 공략", exact: true }).getByRole("listitem")).toHaveText(stop.walkthrough!);
    for (const id of stop.puzzleIds) await expect(dialog.locator(`a[href="/oot/puzzles/${id}"]`)).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await dialog.getByRole("button", { name: "역 안내 닫기" }).click();
    await expect(dialog).not.toBeVisible();
  }
});

test("모든 문제에서 세 단계 힌트를 열고 새로고침으로 복원한다", async ({ page }) => {
  test.setTimeout(90_000);
  const { ootContent } = await import("../../content/ocarina-of-time/index");
  await page.addInitScript(({ key, version }) => {
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({
      schemaVersion: 1, contentVersion: version, completedStopIds: [], confirmedItemIds: [],
      revealedHintIds: [], spoilerLevel: "full", age: "unknown", updatedAt: new Date().toISOString(),
    }));
  }, { key: STORAGE_KEY, version: ootContent.version });
  for (const puzzle of ootContent.puzzles) {
    const response = await page.goto(`/oot/puzzles/${puzzle.id}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: puzzle.name, exact: true })).toBeVisible();
    const hints = page.getByRole("list", { name: "공개한 힌트" });
    await expect(hints).toBeEmpty();
    for (const hint of puzzle.hints) {
      await page.getByRole("button", { name: hint.level === 3 ? "해법 보기" : `힌트 ${hint.level} 보기`, exact: true }).click();
      await expect(hints.getByRole("listitem")).toHaveCount(hint.level);
      await expect(hints.getByRole("listitem").last()).toContainText(hint.text);
    }
    await page.reload();
    await expect(hints.getByRole("listitem")).toHaveCount(3);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
