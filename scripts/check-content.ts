import { ootContent } from "../content/ocarina-of-time/index.ts";
import { validateContent } from "../src/lib/validate-content.ts";

const errors = validateContent(ootContent);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`콘텐츠 검사: 역 ${ootContent.stops.length}개 / 퍼즐 ${ootContent.puzzles.length}개`);
  if (!ootContent.stops.length) console.log("공략 데이터 준비 중입니다. 빈 데이터 검사는 공략 완성을 의미하지 않습니다.");
}
