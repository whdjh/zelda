import type { GuideContent, Verification } from "../../src/lib/content.ts";

export const gameVersion = "oot-switch2-2026";
const chapters = [
  ["opening", "숲의 시작", "563396"], ["deku", "데크나무", "563395"],
  ["castle", "하이랄 성", "563394"], ["dodongo", "도동고 동굴", "563393"],
  ["jabu", "자부자부", "563392"], ["forest", "숲의 신전", "563391"],
  ["fire", "불의 신전", "563390"], ["ice", "얼음 동굴", "563389"],
  ["water", "물의 신전", "563388"], ["well", "우물", "563387"],
  ["shadow", "어둠의 신전", "563386"], ["gerudo", "겔드 요새", "563385"],
  ["spirit", "혼의 신전", "563384"], ["ganon-castle", "최종 성", "563383"],
  ["time", "시간의 신전", "587159"], ["fairies", "대요정 샘", "563324"],
  ["gohma", "첫 던전 보스", "563406"], ["king-dodongo", "동굴 보스", "563405"],
  ["barinade", "자부자부 보스", "563404"], ["phantom", "숲의 신전 보스", "563403"],
  ["volvagia", "불의 신전 보스", "563402"], ["morpha", "물의 신전 보스", "563400"],
  ["bongo", "어둠의 신전 보스", "563399"], ["twinrova", "혼의 신전 보스", "563398"],
  ["ganondorf", "최종 성 보스", "563397"], ["ganon", "최종전", "563423"],
] as const;

export const sources: GuideContent["sources"] = chapters.map(([id, title, page]) => ({
  id: `gw-${id}`, title: `GameWith · ${title} (일본어, Switch 2판)`,
  url: `https://gamewith.jp/zelda-tokino-ocarina/${page}`, version: gameVersion,
}));
sources.push({
  id: "zd-dodongo", title: "Zelda Dungeon Wiki · Dodongo Cavern (Switch 2판)",
  url: "https://www.zeldadungeon.net/wiki/Walkthrough:Dodongo_Cavern_(Ocarina_of_Time)", version: gameVersion,
}, {
  id: "zd-time", title: "Zelda Dungeon Wiki · Temple of Time (Switch 2판)",
  url: "https://www.zeldadungeon.net/wiki/Walkthrough:Temple_of_Time_(Ocarina_of_Time)", version: gameVersion,
}, {
  id: "zd-deku", title: "Zelda Dungeon Wiki · Great Deku Tree (Switch 2판)",
  url: "https://www.zeldadungeon.net/wiki/Walkthrough:Great_Deku_Tree_(Ocarina_of_Time)", version: gameVersion,
}, {
  id: "gr-opening", title: "GamesRadar+ · 시작 장비 위치 (Switch 2판)",
  url: "https://www.gamesradar.com/games/the-legend-of-zelda/zelda-ocarina-of-time-sword-shield/", version: gameVersion,
});

// 2026-11-09: 본문 열람. 같은 편집처의 문서는 독립 교차 근거로 세지 않는다.
sources.push(...[
  ["nl-ice", "Nintendo Life · 얼음 동굴", "https://www.nintendolife.com/guides/zelda-ocarina-of-time-ice-cavern-walkthrough-switch-2"],
  ["nl-fire", "Nintendo Life · 불의 신전", "https://www.nintendolife.com/guides/zelda-ocarina-of-time-fire-temple-walkthrough-switch-2"],
  ["nl-water", "Nintendo Life · 물의 신전", "https://www.nintendolife.com/guides/zelda-ocarina-of-time-water-temple-walkthrough-switch-2"],
  ["nl-fairies", "Nintendo Life · 대요정 샘", "https://www.nintendolife.com/guides/zelda-ocarina-of-time-great-fairy-fountain-locations-all-switch-2"],
  ["fb-songs", "FinalBoss · 곡과 습득 조건", "https://finalboss.io/zelda-oot-switch-2-ocarina-songs"],
].map(([id, title, url]) => ({ id, title, url, version: gameVersion })));

// 앱의 읽기 링크만 통일한다. sourceIds는 실제 집필·교차조사 근거로 보존한다.
const guideChapters: Record<string, string> = {
  "zd-dodongo": "gw-dodongo", "zd-time": "gw-time",
  "nl-ice": "gw-ice", "nl-fire": "gw-fire", "nl-water": "gw-water",
};

export function draft(sourceIds: string[], caveat?: string): Verification {
  const guideSourceId = sourceIds.find((id) => id.startsWith("gw-")) ?? guideChapters[sourceIds[0]];
  if (!guideSourceId) throw new Error(`참고 공략이 없는 출처: ${sourceIds.join(", ")}`);
  return { status: "proposed", version: gameVersion, sourceIds, guideSourceId,
    caveat: caveat ?? "출처를 참고해 작성한 초안입니다. 직접 플레이 미검증이며, 일부 이름은 통용명·자체 제목으로 공식 한글 표기를 확인해야 합니다." };
}
