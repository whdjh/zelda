# 출처 등록부 — 2026-11-08 기준

## 상태 기준

- `직접 확인`: 해당 URL의 관련 공개 내용 열람.
- `부분 확인`: 설명/목록 등 일부 기능만 파악. 전체 공략 사실까지 검증한 것이 아님.
- `미검증`: 채널/자료 후보만 알고 내용 열람 전.
- `플레이 확인 필요`: 오래된 판본 또는 리메이크 비교 요구.

| ID | 자료 | 유형 | 자료 상태 | 활용/주의 |
| --- | --- | --- | --- | --- |
| N01 | [한국닌텐도 공식 제품](https://www.nintendo.com/kr/games/switch2/aa9ja/) | 공식 | 직접 확인 | 공식 한국어 이름·판본·발매일 |
| N02 | [한국닌텐도 공식 뉴스 2026-09-09](https://www.nintendo.com/kr/news/article/4ctc5VMlKFu98IsLdsmyKF) | 공식 | 직접 확인 | 풀 리메이크 안내·2026-11-05 출시 |
| N03 | [2026-11-05 출시 및 ZELDA NOTES](https://www.nintendo.com/kr/news/article/iloZeL436N61v4w8jNfRf) | 공식 | 직접 확인 | 게임 보조 기능과 제품 차별성 검토 |
| C01 | [OoT Guide 한국어](https://ootguide.com/ko/) | 경쟁 서비스 | 부분 확인 | 공략·진행 저장 UX 후보. 세부 공략은 교차검증 |
| C02 | [OoT Story-order Checklist](https://getloopwink.com/oot/) | 경쟁 서비스 | 부분 확인 | 이미 유사한 체크리스트가 존재함. 독창성 과장 금지 |
| C03 | [Zelda Dungeon](https://www.zeldadungeon.net/ocarina-of-time-walkthrough/) | 해외 공략 | 부분 확인 | 판본별 조건/아이템 검증 후보 |
| Y01 | [@nintaku_chick](https://www.youtube.com/@nintaku_chick) | 사용자 추천 영상 채널 | **개별 영상 미검증** | 영상 제목·공략 내용·시점·실제 조건 임의 기입 금지 |
| UI01 | [SEED React](https://seed-design.io/react) | UI 라이브러리 | 직접 확인 | 컴포넌트·토큰 기반 |
| UI02 | [SEED Tailwind CSS 4](https://seed-design.io/react/getting-started/styling/tailwind-css) | CSS 통합 | 직접 확인 | `@seed-design/css`, `@seed-design/tailwind4-theme` |
| UI03 | [SEED 색상 토큰 원리](https://v2.seed-design.io/foundation/color/color-system/) | 디자인 | 직접 확인 | Scale/Semantic, 중복 토큰 생성 금지 |
| UI04 | [zelda-hyrule-ui](https://github.com/chaos-xxl/zelda-hyrule-ui) | 팬 UI | 직접 확인 | 야숨 시커 스톤 분위기; 비공식/비상업 경고·IP 주의 |
| UI05 | [zelda-ui-kit](https://github.com/allenpan05/zelda-ui-kit) | 팬 UI | 직접 확인 | 야숨풍 UI, 글꼴·닌텐도 요소의 제3자 권리 검토 |
| L01 | [닌텐도 한국어 저작물 이용 가이드](https://www.nintendo.co.jp/networkservice_guideline/ko/index.html) | 권리 | 직접 확인 | 지정 영상/이미지 플랫폼을 주로 다룸. 독립 공략 웹 전면 허용 아님 |
| T01 | [Next.js App Router 문서](https://nextjs.org/docs/app) | 개발 | 직접 확인 여부 프로젝트 착수 시 재확인 | 정적 콘텐츠와 인터랙티브 컴포넌트 |
| T02 | [React useContext](https://react.dev/reference/react/useContext) | 개발 | 개발 시 버전 재확인 | props drilling이 실제 문제일 때만 |
| T03 | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | 접근성 | 공개 표준 | 텍스트 대비·터치·키보드 |

## 정보의 성격을 구분

이번 초기 구현에서는 N01 공식 제품 페이지, SEED 설치/토큰/레이어 문서, Next.js 설치판 문서와 Supabase SSR/Auth/RLS 문서를 확인했다. 나머지 자료의 상태는 제공된 기획 문서의 기존 조사 기록이며 이번 작업에서 전체를 재열람·플레이 검증한 것은 아니다. 실제 공략 데이터에는 아직 출처나 사실을 추가하지 않았다.

- **게임의 객관적 사실**(아이템 획득 조건, 진행 필수 이벤트)과 **우리의 추천**(이 길이 효율적)은 별개.
- 서로 독립적인 자료인지 확인. 하나의 원문을 복제한 페이지 두 개는 독립 근거 아님.
- N64/3DS와 Switch 2의 차이는 반드시 판본 표시.
- 출처의 조회 수/검색 순위로 최적 루트의 진실성을 판정하지 않는다.
- 개별 영상의 실제 내용/시점은 직접 열람한 후 `Y01-001` 같은 기록으로 추가.

## 권리/인용

외부 문장·영상·이미지의 복제 대신 자체 콘텐츠 제작. 링크/짧은 사실 요약을 중심으로 검토하고 상세한 권리 해석은 `docs/quality/02-rights-privacy.md`를 따른다.
