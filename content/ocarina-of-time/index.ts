import type { GuideContent } from "../../src/lib/content.ts";
import { draft, gameVersion, sources } from "./sources.ts";
import { story } from "./story.ts";
import { puzzles } from "./puzzles.ts";
import { routeData } from "./routes.ts";

const equipment = [
  ["sword-shield", "검·방패 장착", "gw-opening"], ["slingshot", "새총", "gw-deku"],
  ["royal-letter-lullaby", "젤다의 편지·자장가", "gw-castle"], ["goron-bracelet", "고론 팔찌", "gw-dodongo"],
  ["bomb-bag", "폭탄 주머니", "gw-dodongo"], ["bottle", "사용 가능한 병", "gw-jabu"],
  ["boomerang", "부메랑", "gw-jabu"], ["hookshot", "훅샷", "gw-forest"],
  ["bow", "활", "gw-forest"], ["storm-song", "폭풍의 노래", "gw-well"],
  ["hammer", "해머", "gw-fire"], ["iron-boots-tunic", "헤비 부츠·조라의 옷", "gw-ice"],
  ["longshot", "롱샷", "gw-water"], ["fire-arrows", "불의 화살", "gw-water"],
  ["lens", "진실의 렌즈", "gw-well"], ["din-fire", "딘의 불꽃·사용할 마력", "gw-shadow"],
  ["hover-boots", "호버 부츠", "gw-shadow"], ["spirit-song", "혼의 레퀴엠", "gw-gerudo"],
  ["silver-gauntlets", "은 건틀릿", "gw-spirit"], ["mirror-shield", "미러 실드", "gw-spirit"],
  ["light-arrows", "빛의 화살", "gw-spirit"],
] as const;

export const ootContent: GuideContent = {
  // 빈 초안의 기존 백업과 호환되도록 버전은 유지한다. ID를 바꾸는 수정은 별도 마이그레이션이 필요하다.
  version: "oot-draft-1", gameVersion, sources, puzzles,
  items: equipment.map(([id, title, source]) => ({ id, title, verification: draft([source]) })),
  stops: story.map(({ sourceIds, ...stop }) => ({
    ...stop, kind: "required",
    ...routeData(stop.id),
    puzzleIds: puzzles.filter((puzzle) => puzzle.stopId === stop.id).map((puzzle) => puzzle.id),
    verification: draft(sourceIds),
  })),
};
