# 기술 설계 — 현재 구현 기준

> 현재 우선순위는 전체 공략집 제작이며 기본 사용 흐름은 비로그인이다. 메인 / 하나만 제공하고 미래 기능 준비 코드는 두지 않는다. [ADR-011/012](../decisions/001-architecture-decisions.md), [구현 상태](../development/02-project-status.md)를 함께 확인한다.

## 책임과 선택

| 영역 | 구성 | 책임 |
| --- | --- | --- |
| 페이지·SEO | Next.js App Router + TypeScript | 메인 진입과 스포일러 없는 메타 |
| UI | SEED Design React | 버튼·입력·Bottom Sheet·선택 컨트롤 직접 사용 |
| CSS | Tailwind v4 + SEED 공식 theme | 레이아웃과 SEED 토큰 재사용; 복잡한 고유 UI가 생길 때만 CSS Modules |
| 클라이언트 상태 | useState + 작은 도메인 hook | 선택 역·시트·로컬 진행도; Context는 실제 공유 문제 전 추가하지 않음 |
| 비로그인 저장 | localStorage v1 / JSON 백업 | 기기 내 기록, 손상 원본 보존, 저장 실패 대응 |
| 콘텐츠 | content/ocarina-of-time | 출처 기반 본문·힌트·준비 조건·판본별 검증 메타 |
| 추천 | 순수 selectRoute 함수 | 선행·장비 조건 검사, 목적지의 남은 연결·위상 단계·추천 후보 계산 |
| 검증 | Node test / ESLint / TS / Playwright | 별도 테스트 러너 없이 순수 로직 검사, 핵심 모바일 동작 |

별도 Express/Django, ORM, Zustand/Jotai, AI SDK, 그래프 엔진은 없다. 새로운 작품은 content 아래 독립 폴더로 시작하고 실제 중복이 생긴 뒤 공통화한다.

## 실제 폴더와 상태 경계

- src/app: 메인 page.tsx, 루트 layout, 오류·404 처리. 추가 페이지/API/인증 proxy는 없다.
- src/components: 진행 설정, RouteMap/RouteGuide, HintReveal. SEED 래퍼를 복제하지 않는다.
- src/lib: 정적 데이터 타입/검사, 규칙 계산, 저장 스키마와 useProgress.

메인 /에서 useProgress 한 개를 설정과 노선에 props로 전달한다. 역 안내와 힌트도 이 상태를 공유한다. 설정·백업 복원은 즉시 노선에 반영되고 힌트 열람 중에도 페이지를 이동하지 않는다.

## SEED/CSS

공식 [Tailwind 통합](https://seed-design.io/react/getting-started/styling/tailwind-css)과 [Cascade Layers](https://seed-design.io/react/getting-started/styling/cascade-layers)를 따른다.

```css
@layer theme, base, seed-base, components, seed-components, utilities;
@import "@seed-design/css/base.layered.css";
@import "tailwindcss";
@import "@seed-design/tailwind4-theme";
```

Next.js Webpack resolution에 seed-layered를 추가하고 dev/build에 같은 번들러를 쓴다. html에는 data-seed와 light-only를 지정했다. 다크 테마는 대비/모바일 검증 후 적용할 후보이며, 토큰 팔레트를 새로 만들지 않는다. 노선의 점·연결선·이름 미리보기는 route-map.module.css로 정의한다. 노선 좌표와 터치 영역의 고유 치수만 예외로 사용한다.

## 렌더·스포일러·검색

- 첫 SSR/CSR는 로컬 기록을 모르는 중립 상태, 마운트 이후 검증한 기록만 적용한다.
- 노선과 퍼즐 데이터는 클라이언트 모듈에서 읽어 미래 이름·해법을 초기 HTML/RSC props에 넣지 않는다. 실제 공개 조건을 통과할 때만 DOM에 렌더한다.
- 전체 노선 보기와 정답 공개는 별개다. 검색 메타는 중립 문구를 사용한다.
- 메인 / 외 주소는 404다. 공략 검증 전에는 전역 noindex를 유지한다.
- 공개 정적 JS 데이터를 소스 분석으로 읽는 것까지 막는 보안 기능이라고 주장하지 않는다.

## 후속 기능

인증·서버 저장·분석은 현재 실행 코드와 의존성에 없다. [후속 후보](../product/05-future-expansion.md)에 도입 조건만 기록한다.
