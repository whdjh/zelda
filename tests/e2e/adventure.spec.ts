import { expect, test, type Page } from "@playwright/test";
import { STORAGE_KEY } from "../../src/lib/progress-storage";
import { ootContent } from "../../content/ocarina-of-time/index";

async function openPuzzle(page: Page, puzzleId: string) {
  const puzzle = ootContent.puzzles.find((entry) => entry.id === puzzleId)!;
  const stop = ootContent.stops.find((entry) => entry.id === puzzle.stopId)!;
  await page.getByRole("button", { name: "목록", exact: true }).click();
  await page.getByRole("button", { name: `${stop.title} ·`, exact: false }).click();
  await page.getByRole("button", { name: `힌트: ${puzzle.name}`, exact: true }).click();
}


test("첫 화면과 시트는 작은 화면에서 넘치지 않고 키보드로 열고 닫는다", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("시간의 오카리나");
  await expect(page.getByRole("button", { name: "숲에서 출발 준비 · 추천", exact: true })).toBeVisible();
  await expect(page.getByRole("navigation")).toHaveCount(0);
  await expect(page.getByRole("complementary")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("button", { name: "진행도·설정", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "진행도·설정" })).toBeVisible();
  await expect(page.getByRole("radio", { name: "전체", exact: true })).toBeChecked();
  await expect(page.getByRole("link", { name: "로그인 안내" })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "진행도·설정", exact: true })).toBeFocused();
  expect(errors).toEqual([]);
});

test("설정을 저장해 복원하고 백업을 내보내며 잘못된 가져오기는 거부한다", async ({ page }) => {
  await page.goto("/");
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
  await expect(page.getByRole("radio", { name: "전체", exact: true })).toBeChecked();
  await expect(page.getByRole("status")).toHaveText("백업을 복원하고 저장했어요.");
});

test("한 화면에서 설정·완료·백업 복원을 노선에 즉시 반영한다", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  const first = page.getByRole("button", { name: "숲에서 출발 준비 · 추천", exact: true });
  const last = page.getByRole("button", { name: "마지막 전투와 엔딩", exact: false });
  await expect(first).toBeVisible();
  await page.screenshot({ path: `/private/tmp/zelda-home-${testInfo.project.name}.png` });
  await page.getByRole("button", { name: "진행도·설정", exact: true }).click();
  await page.getByText("엄격", { exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(last).toHaveCount(0);
  await first.click();
  await page.getByRole("button", { name: "이 역 완료", exact: true }).click();
  await page.getByRole("button", { name: "진행도·설정", exact: true }).click();
  await expect(page.getByText("완료한 역 1개 · 공개한 힌트 0개")).toBeVisible();
  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), STORAGE_KEY);
  await page.getByLabel("백업 파일 가져오기").setInputFiles({ name: "backup.json", mimeType: "application/json", buffer: Buffer.from(JSON.stringify({ ...saved, completedStopIds: [], spoilerLevel: "full" })) });
  await page.getByRole("button", { name: "백업으로 교체", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(first).toBeVisible();
  await expect(last).toHaveCount(1);
  await first.click();
  await page.getByRole("button", { name: "이 역 완료", exact: true }).click();
  expect(await page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).spoilerLevel, STORAGE_KEY)).toBe("full");
});

test("손상된 원본 기록은 설정을 바꿔도 보존한다", async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, "{broken"), STORAGE_KEY);
  await page.goto("/");
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
  await page.goto("/");
  await page.getByRole("button", { name: "진행도·설정", exact: true }).click();
  await page.getByText("엄격", { exact: true }).click();
  await expect(page.getByRole("radio", { name: "엄격", exact: true })).toBeChecked();
  await expect(page.getByRole("alert")).toContainText("저장할 수 없어요");
});

test("메인 외 기존 페이지와 인증 경로는 제공하지 않는다", async ({ page }) => {
  for (const path of ["/oot", "/oot/route", "/oot/route/opening-preparation", "/oot/puzzles/first-equipment", "/login", "/auth/callback", "/unknown"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await page.getByRole("link", { name: "모험 홈으로", exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("button", { name: "숲에서 출발 준비 · 추천" })).toBeVisible();
  }
});


test("전체 노선을 공개하고 조건과 무관하게 완료하며 정답은 요청 뒤 공개한다", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "마지막 전투와 엔딩", exact: false })).toHaveCount(1);
  await page.getByRole("button", { name: "숲에서 출발 준비 · 추천" }).click();
  await expect(page.getByRole("region", { name: "상세 공략", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "이 역 완료", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "소년", exact: true }).click();
  await page.getByRole("button", { name: "상세 공략·해법 보기" }).click();
  await expect(page.getByRole("region", { name: "상세 공략", exact: true })).toContainText("40루피");
  await page.getByRole("button", { name: "이 역 완료", exact: true }).click();
  await expect(page.getByRole("button", { name: "첫 던전의 아래층으로 · 추천" })).toBeVisible();
  await page.getByRole("button", { name: "목록", exact: true }).click();
  await page.getByRole("button", { name: "숲에서 출발 준비 · 완료" }).click();
  await expect(page.getByRole("region", { name: "상세 공략", exact: true })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await openPuzzle(page, "first-equipment");
  await expect(page.getByRole("list", { name: "공개한 힌트" })).toBeEmpty();
  await page.getByRole("button", { name: "힌트 1 보기" }).click();
  await expect(page.getByRole("list", { name: "공개한 힌트" }).getByRole("listitem")).toHaveCount(1);
  await page.getByRole("button", { name: "바로 정답 보기" }).click();
  await expect(page.getByRole("list", { name: "공개한 힌트" })).toContainText("40루피");
  await page.reload();
  await expect(page.getByRole("list", { name: "공개한 힌트" })).toHaveCount(0);
  await openPuzzle(page, "first-equipment");
  await expect(page.getByRole("list", { name: "공개한 힌트" })).toContainText("40루피");
});

test("전체 공개에서 모든 역의 상세 본문과 연결을 확인한다", async ({ page }) => {
  test.setTimeout(90_000);
  const { ootContent } = await import("../../content/ocarina-of-time/index");
  await page.addInitScript(({ key, version }) => localStorage.setItem(key, JSON.stringify({
    schemaVersion: 1, contentVersion: version, completedStopIds: [], confirmedItemIds: [],
    revealedHintIds: [], spoilerLevel: "full", age: "unknown", updatedAt: new Date().toISOString(),
  })), { key: STORAGE_KEY, version: ootContent.version });
  await page.goto("/");
  for (const stop of ootContent.stops) {
    await page.getByRole("button", { name: `${stop.title} ·`, exact: false }).click();
    const dialog = page.getByRole("dialog", { name: stop.title, exact: true });
    await expect(dialog.getByRole("region", { name: "상세 공략", exact: true })).toHaveCount(0);
    await dialog.getByRole("button", { name: "상세 공략·해법 보기" }).click();
    await expect(dialog.getByRole("region", { name: "상세 공략", exact: true }).getByRole("listitem")).toHaveText(stop.walkthrough!);
    for (const id of stop.puzzleIds) await expect(dialog.getByRole("button", { name: `힌트: ${ootContent.puzzles.find((puzzle) => puzzle.id === id)!.name}`, exact: true })).toHaveCount(1);
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
    await page.goto("/");
    await expect(page.getByRole("list", { name: "공개한 힌트" })).toHaveCount(0);
    await openPuzzle(page, puzzle.id);
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: puzzle.name, exact: true })).toBeVisible();
    const hints = page.getByRole("list", { name: "공개한 힌트" });
    await expect(hints).toBeEmpty();
    for (const hint of puzzle.hints) {
      await page.getByRole("button", { name: hint.level === 3 ? "해법 보기" : `힌트 ${hint.level} 보기`, exact: true }).click();
      await expect(hints.getByRole("listitem")).toHaveCount(hint.level);
      await expect(hints.getByRole("listitem").last()).toContainText(hint.text);
    }
    await page.reload();
    await expect(hints).toHaveCount(0);
    await openPuzzle(page, puzzle.id);
    await expect(hints.getByRole("listitem")).toHaveCount(3);
    await page.getByRole("button", { name: "역 안내 닫기", exact: true }).click();
    await expect(hints).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});


test("분기 목적지를 선택하고 보유 기록을 바꾸면 노선이 재구성된다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "물의 신전 수위 알아보기 · 준비 확인", exact: true }).click();
  await page.getByRole("button", { name: "여기로 경로 보기" }).click();
  await expect(page.getByRole("button", { name: "남은 경로", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "얼음 속에서 잠수 준비", exact: false })).toHaveCount(1);
  await page.getByText("시대·장비", { exact: true }).click();
  await page.getByRole("checkbox", { name: "헤비 부츠·조라의 옷", exact: true }).check();
  await expect(page.getByRole("button", { name: "얼음 속에서 잠수 준비", exact: false })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("region", { name: "경로 안내" })).toContainText("물의 신전 수위 알아보기까지");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("button", { name: "목적지 초기화", exact: true }).click();
  await expect(page.getByRole("region", { name: "경로 안내" })).toContainText("엔딩까지");
  await expect(page.getByRole("button", { name: "목적지 초기화", exact: true })).toHaveCount(0);
});

test("엄격 설정에서는 미래 역 이름과 상세 해법을 DOM에 넣지 않는다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "진행도·설정", exact: true }).click();
  await page.getByText("엄격", { exact: true }).click();
  await page.keyboard.press("Escape");
  await page.goto("/");
  await expect(page.getByRole("button", { name: "마지막 전투와 엔딩", exact: false })).toHaveCount(0);
  await expect(page.getByRole("region", { name: "상세 공략", exact: true })).toHaveCount(0);
});


test("역은 점으로 표시하고 호버·길게 누르기·키보드로 이름을 확인한다", async ({ page }, testInfo) => {
  await page.goto("/");
  const station = page.getByRole("button", { name: "숲에서 출발 준비 · 추천", exact: true });
  await expect(station).toHaveText("");
  await station.hover();
  await expect(page.getByRole("tooltip")).toContainText("숲에서 출발 준비");
  await page.mouse.move(0, 0);
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await station.focus();
  await expect(page.getByRole("tooltip")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("tooltip")).toHaveCount(0);
  await station.dispatchEvent("pointerdown", { pointerType: "touch", clientX: 100, clientY: 100 });
  await expect(page.getByRole("tooltip")).toBeVisible();
  await station.dispatchEvent("pointerup", { pointerType: "touch" });
  await station.dispatchEvent("click");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await station.dispatchEvent("click");
  await expect(page.getByRole("dialog", { name: "숲에서 출발 준비", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("region", { name: "모험 환승 노선도" }).screenshot({ path: `/private/tmp/zelda-map-${testInfo.project.name}.png` });
});
