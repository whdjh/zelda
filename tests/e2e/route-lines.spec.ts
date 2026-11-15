import { expect, test } from "@playwright/test";

test("노선은 화면 폭에 늘어나지 않고 연결선이 다른 역을 관통하지 않는다", async ({ page }, testInfo) => {
  await page.goto("/");
  const map = page.getByRole("region", { name: "모험 환승 노선도" });
  await expect(map.getByRole("button")).toHaveCount(30);
  for (const width of [testInfo.project.use.viewport!.width, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    const geometry = await map.evaluate((element) => {
      const svg = element.querySelector("svg")!;
      const rect = svg.getBoundingClientRect();
      const points = Array.from(element.querySelectorAll("li")).map((node) => {
        const station = node.getBoundingClientRect();
        return { x: station.x + station.width / 2 - rect.x, y: station.y + station.height / 2 - rect.y };
      });
      let intersectsStation = false;
      for (const path of svg.querySelectorAll("g > path:last-child")) {
        const line = path as SVGPathElement;
        const length = line.getTotalLength();
        const start = line.getPointAtLength(0), end = line.getPointAtLength(length);
        const unrelated = points.filter((point) => Math.hypot(point.x - start.x, point.y - start.y) > 1 && Math.hypot(point.x - end.x, point.y - end.y) > 1);
        for (let distance = 0; distance < length; distance += 2) {
          const point = line.getPointAtLength(distance);
          if (unrelated.some((station) => Math.hypot(station.x - point.x, station.y - point.y) < 12)) intersectsStation = true;
        }
      }
      return { width: rect.width, logicalWidth: svg.viewBox.baseVal.width, intersectsStation, overflow: element.scrollWidth > element.clientWidth };
    });
    expect(geometry.width).toBe(geometry.logicalWidth);
    expect(geometry.intersectsStation).toBe(false);
    expect(geometry.overflow).toBe(false);
    await map.screenshot({ path: `/private/tmp/zelda-lines-${testInfo.project.name}-${width}.png` });
    await map.focus();
    await map.getByRole("button").last().focus();
    const tooltip = await page.getByRole("tooltip").boundingBox();
    const bounds = await map.boundingBox();
    expect(tooltip!.x).toBeGreaterThanOrEqual(bounds!.x);
    expect(tooltip!.x + tooltip!.width).toBeLessThanOrEqual(bounds!.x + bounds!.width);
    expect(tooltip!.y + tooltip!.height).toBeLessThanOrEqual(bounds!.y + bounds!.height);
    await page.keyboard.press("Escape");
  }
});
