# AGENTS.md — AI 개발·조사 에이전트 필수 규칙

## 제품 정체성

'가장 짧은 지도 경로'가 아니라 **보통 실력 이용자의 안전하고 빠른 엔딩**을 위한 한국어 시오 모바일 내비게이션. 퍼즐은 직접 풀 재미를 지키고 답은 요청받을 때만 공개한다.

## 먼저 읽을 문서

1. `START-HERE.md`, `docs/product/01-prd.md`, `docs/decisions/001-architecture-decisions.md`
2. 공략: `docs/game/01-route-criteria.md`, `docs/game/02-research-protocol.md`, `docs/game/04-hint-policy.md`
3. UI: `docs/design/03-ux-flows.md`, `docs/design/04-component-guidelines.md`, `docs/design/05-seed-token-policy.md`
4. 상태/콘텐츠: `docs/architecture/01-technical-design.md`, `docs/architecture/02-content-model.md`, `docs/architecture/03-progress-routing.md`
5. 서버: `docs/architecture/04-backend-auth.md`
6. 개발/검증: `docs/development/01-local-setup.md`, `docs/development/02-project-status.md`, `docs/quality/01-validation.md`, `docs/quality/02-rights-privacy.md`

## 절대 지킬 규칙

1. **사실을 지어내지 않는다.** 게임의 한국어 이름/조건/경로/단축 시간은 `판본 + 출처 + 검증 상태`를 기록한다. Switch 2판에서 검증 안 한 과거판 공략은 미검증으로 남긴다.
2. **합의한 기술 선택을 임의로 뒤집지 않는다.** Next.js + TS, SEED, Tailwind v4 + SEED 토큰, 필요 시 CSS Modules, `useState`와 조건부 Context, localStorage 백업 + **Next.js Server Actions/Route Handlers, Supabase PostgreSQL/Auth**가 현재 구성이다. 과거의 로그인/DB 금지는 폐기했다. **Jotai/Zustand와 별도 Express/Django 서버는 실제 필요 전 도입 금지**.
3. **SEED 토큰을 재사용한다.** Primitive/Semantic 토큰을 중복 생성하거나 토스 3단계 체계를 복제하지 않는다. 프로젝트 고유 상태/노선도에 필요한 예외만 정의하고 기록한다.
4. **컴포넌트 책임을 먼저 정한다.** SEED Button/Sheet 같은 래퍼, `Base*`/`Generic*`/`Universal*` 등의 미래 확장용 추상화 금지. 실제 중복 또는 독립적인 동작·접근성 책임이 있을 때만 추출.
5. **최소 상태부터 시작한다.** 로컬 UI에는 `useState`. 공유 경계에서 실제 props drilling이 있을 때만 `useContext`. Context를 전역 저장소로 남용하지 않는다.
6. **진행도 수정 후 경로 추천은 규칙 기반.** AI가 게임 사실이나 노선 좌표를 생성하지 않는다. 먼저 선행 조건 검증 → 현재 상태에 맞는 다음 역 계산 → UI의 강조 상태 업데이트. 완료를 암묵적으로 추정하지 않는다.
7. **스포일러는 단계적으로 공개한다.** 기본은 완료/현재/다음 목적지만. 미래 구간은 이름을 숨기거나 잠금으로 표현하고, 정답은 명시적 동작 때만 DOM에 나타나게 한다. 블러만을 보호 수단으로 쓰지 않는다.
8. **권리 침해를 피한다.** 외부 영상·이미지·지도·공략 문장 복제 금지. 자체 문구·자체 도형 우선, 직접 녹화도 자동으로 사용 허가가 생기는 건 아니다.
9. **저장과 장애 처리.** `localStorage` 스키마 버전, 백업·복원, 파손된 JSON 및 스토리지 제한, SSR hydration 차이를 검증.
10. **서버의 권한 경계를 지킨다.** Server Action마다 인증 사용자를 검증하고 입력/콘텐츠 ID를 검사한다. DB는 `auth.uid() = user_id` RLS 적용. 사용자 ID를 클라이언트 입력에서 신뢰하지 않는다. 서비스 역할 키는 사용하지 않는다. 서버 상태와 UI 상태를 분리하고 버전 충돌을 덮어쓰지 않는다.
11. **좋아 보인다는 이유만으로 추가하지 않는다.** 새 라이브러리/컴포넌트/상태 계층/페이지는 어떤 실제 사용자 문제를 해결하는지 PR에 기록한다.

## 공략 작성 프로세스

출처 등록 → 사실 단위 교차 확인 → 추천 루트 후보 비교(이유와 위험 기록) → 독자 문장/힌트 작성 → 직접 플레이로 검수 → 검증 상태 승격. `@nintaku_chick`는 사용자가 추천한 조사 후보일 뿐 개별 영상/타임스탬프를 임의 작성하지 않는다.

## 개발 명령과 코드 위치

- Node 24, npm. `npm ci`, `npm run dev`, `npm run check`, `npm run build`, `npm run test:e2e`.
- 앱: `src/app`; 고유 UI: `src/components`; 순수 로직/저장: `src/lib`; 서버 전용: `src/lib/supabase`; DB: `supabase/migrations`.
- 공략: `content/ocarina-of-time/index.ts`. 현재 빈 배열을 유지한다. 가상 데이터는 테스트 파일 안에서만 사용한다.
- 라이브러리 설정/API는 Context7의 resolve-library-id → query-docs 순으로 최신 공식 문서를 확인한다. Next.js 설치판 문서는 `node_modules/next/dist/docs`에도 있다.
- 환경변수는 `.env.local`, 예시는 `.env.example`. 키/쿠키/이메일을 로그에 남기지 않는다. 원격 프로젝트 생성·비용 발생·기존 데이터 삭제는 사용자 판단을 받는다.

## 자동 커밋 규칙

- 사용자가 자동 커밋을 요청했다. 의미 있는 작업 단위를 완료하고 관련 검증을 통과하면 별도 확인 없이 로컬 커밋한다.
- 형식은 `feat(scope): 한글 메시지`, `fix(scope): 한글 메시지`, `chore(scope): 한글 메시지`만 허용한다. scope는 `content`, `route`, `auth`, `docs`, `project`처럼 변경 대상을 짧게 표현한다.
- 기능·콘텐츠 추가는 `feat`, 오류 수정은 `fix`, 설정·문서·유지보수는 `chore`를 사용한다. 제목과 필요한 본문은 한국어로 작성한다.
- 커밋 전 스테이징 내용을 검토하고 환경변수 실제 값, 개인 백업, 빌드 결과, node_modules를 포함하지 않는다.
- 기존 커밋을 임의로 amend/rebase하거나 다른 작업자의 변경을 되돌리지 않는다. 원격 push는 사용자 요청이 있을 때 진행한다.
- 예시: `feat(content): 초반 장비 준비 공략 초안 추가`.

## 작업 완료 조건

- 관련 콘텐츠 출처·판본·검증 정도가 남아 있고 미검증을 숨기지 않는다.
- 타입검사/린트/실제 관련 테스트 통과. 모바일 360/390px, 긴 한국어, 저장 복구, 키보드/스크린리더, 스포일러 누출 검사.
- 실측 근거 없이 '최단 보장', '30분 절약' 등의 홍보 문구를 사용하지 않는다.
- 사용자 합의 변경이면 관련 모든 문서/ADR/코드의 충돌을 함께 수정한다.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
