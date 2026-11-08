import { expect, test } from "@playwright/test";
import { STORAGE_KEY } from "../../src/lib/progress-storage";

test("첫 화면과 시트는 작은 화면에서 넘치지 않고 키보드로 열고 닫는다", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveURL(/\/oot$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("헤매는 시간");
  await expect(page.getByText("아직 이용할 수 있는 모험 노선과 퍼즐 힌트는 없어요.", { exact: false })).toBeVisible();
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

test("외부 설정 없이 로그인 안내·빈 노선·없는 콘텐츠를 안전하게 표시한다", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("로그인 연결을 준비하고 있어요.", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "이메일로 로그인 링크 받기" })).toBeDisabled();
  await page.goto("/oot/route");
  await expect(page.getByText("아직 공개된 모험 노선이 없어요.", { exact: false })).toBeVisible();
  const response = await page.goto("/oot/puzzles/unknown");
  expect(response?.status()).toBe(404);
});
