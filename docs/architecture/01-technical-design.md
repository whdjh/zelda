# 기술 설계 — 현재 구현 기준

> 현재 우선순위는 전체 공략집 제작이며 기본 사용 흐름은 비로그인이다. Supabase 인증/DB 준비 코드는 보존하고 연결은 뒤로 미룬다. [ADR-011/012](../decisions/001-architecture-decisions.md), [구현 상태](../development/02-project-status.md)를 함께 확인한다.

## 책임과 선택

| 영역 | 구성 | 책임 |
| --- | --- | --- |
| 페이지·SEO | Next.js App Router + TypeScript | 노선 진입과 스포일러 없는 메타, 서버 인증 확인 |
| UI | SEED Design React | 버튼·입력·Bottom Sheet·선택 컨트롤 직접 사용 |
| CSS | Tailwind v4 + SEED 공식 theme | 레이아웃과 SEED 토큰 재사용; 복잡한 고유 UI가 생길 때만 CSS Modules |
| 클라이언트 상태 | useState + 작은 도메인 hook | 선택 역·시트·로컬 진행도; Context는 실제 공유 문제 전 추가하지 않음 |
| 서버 (후속 준비) | Server Actions / Route Handlers | 준비 코드를 보존하고 공략 핵심 흐름 이후 로그인/서버 기록 연결 |
| 인증·DB (후속 준비) | Supabase Auth / PostgreSQL | 사용자별 진행도·힌트 해금·RLS·동시 변경 revision 설계 보존 |
| 비로그인 저장 | localStorage v1 / JSON 백업 | 기기 내 기록, 손상 원본 보존, 저장 실패 대응 |
| 콘텐츠 | content/ocarina-of-time | 출처 기반 본문·힌트·준비 조건·판본별 검증 메타 |
| 추천 | 순수 selectRoute 함수 | 선행·장비 조건 검사, 목적지의 남은 연결·위상 단계·추천 후보 계산 |
| 검증 | Node test / ESLint / TS / Playwright | 별도 테스트 러너 없이 순수 로직 검사, 핵심 모바일 동작 |

별도 Express/Django, ORM, Zustand/Jotai, AI SDK, 그래프 엔진은 없다. 새로운 작품은 content 아래 독립 폴더로 시작하고 실제 중복이 생긴 뒤 공통화한다.

## 실제 폴더와 서버 경계

- src/app: 공개/로그인/노선/역/퍼즐 페이지, auth 콜백 Route Handler와 인증·진행도 Server Actions.
- src/components: 진행 설정, 로그인 폼, RouteMap/RouteGuide, HintReveal. SEED 래퍼를 복제하지 않는다.
- src/lib: 정적 데이터 타입/검사, 규칙 계산, 저장 스키마와 useProgress.
- src/lib/supabase: server-only 설정·쿠키 서버 클라이언트와 DB 타입. 사용자 ID는 getUser 결과만 사용한다.
- src/proxy.ts: 후속 로그인/인증 콜백 경로에만 getClaims 세션 갱신과 private/no-store를 적용한다. 공개 공략 홈/노선은 인증을 조회하지 않는다.
- supabase/migrations: 버전 관리 SQL. RLS/경쟁 수정 검증 시나리오는 supabase/tests.

메인 /oot는 소개 화면 없이 노선과 설정을 함께 표시하고 페이지의 useProgress 결과를 두 컴포넌트에 props로 전달한다. 별도 저장 상태를 두지 않아 설정·백업 복원이 즉시 노선에 반영된다. /oot/route는 /oot로 이동하며 역·퍼즐 고유 주소는 유지한다.

서버 스냅샷을 React 전역 상태로 복제하지 않는다. 로컬 기록과 서버 기록은 사용자가 직접 저장/가져오기하며, 로그인 직후 자동 교체하지 않는다.

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
- 개별 역/퍼즐 URL은 준비했지만 데이터가 없는 ID는 404다. 공략이 준비될 때까지 전역 noindex를 유지한다. 실제 공개 명칭·canonical·sitemap은 콘텐츠 검증 뒤 작성한다.
- 공개 정적 JS 데이터를 소스 분석으로 읽는 것까지 막는 보안 기능이라고 주장하지 않는다.

## 서버 저장과 확장 경계

세부 인증/DB/설정은 [백엔드 설계](04-backend-auth.md), [상태·규칙](03-progress-routing.md)을 따른다. game_id/game_version과 버전 있는 진행 스냅샷만 준비한다. AI가 추후 검증된 ID를 제안하도록 확장할 여지는 있지만 AI 호출/벡터 DB/좌표 생성은 현재 구현하지 않는다.
