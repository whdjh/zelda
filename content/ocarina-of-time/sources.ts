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

export function draft(sourceIds: string[], caveat?: string): Verification {
  return { status: "proposed", version: gameVersion, sourceIds,
    caveat: caveat ?? "출처를 참고해 작성한 초안입니다. 직접 플레이 미검증이며, 일부 이름은 통용명·자체 제목으로 공식 한글 표기를 확인해야 합니다." };
}
