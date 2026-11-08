# 젤다 하이패스 — 5분 요약 (최종 기획 기준)

> 문서 기준일: 2026-11-08. **제품/기술 결정은 확정**, 공략의 최적성·게임판 차이·실제 사용자 지표는 아직 검증 대상입니다. 이 패키지는 실행 가능한 **기획·개발·검증 문서**이며 시오 전체 공략 데이터가 완성됐다는 뜻은 아닙니다.

## 제품 한 줄 정의

**보통의 조작 실력을 가진 한국어 이용자가 특수 트릭 없이 안정적으로 빠르게 《시간의 오카리나》(Nintendo Switch 2)의 엔딩까지 가도록 돕는 모바일 모험 내비게이션.**

'가장 빠른'은 측정 전에는 주장하지 않는다. 지도상 최단 거리보다 준비/전투/실패/재시도를 포함한 **일반 이용자의 총 소요 시간과 실패 위험**을 우선한다.

## 첫 출시 경험

1. **세로 노선도**: 필수역, 근거 있는 추천 경유, 현재 역과 다음 목표를 보여준다. 수집 요소는 처음부터 섞지 않는다.
2. **역 선택**: 현 구간의 목표·필수 준비·짧은 행동 가이드(최대 세 문장)를 SEED Bottom Sheet로 본다.
3. **퍼즐 도움**: 기본적으로 정답은 숨긴다. 힌트 1(관찰) → 2(구체적 단서) → 3(해법)를 사용자가 직접 연다. 바로 정답 보기도 명시적 선택 시 가능.
4. **진행도 반영**: 사용자가 완료/미완료 또는 획득 조건을 수정하면 **규칙 기반**으로 이후 추천과 잠금 상태를 다시 계산한다. 노선 레이아웃 자체는 안정적으로 유지.
5. **스포일러 기본값**: 완료·현재 구간과 **다음 목적지까지만 명시**. 미래 구간 이름·보스·해답은 잠금/미공개. 단순 CSS 블러만을 보호 장치로 믿지 않는다.
6. **선택 로그인 + 서버 저장**: Supabase Auth와 PostgreSQL로 사용자별 완료·힌트 기록을 저장한다. 비로그인 로컬 기록과 JSON 백업도 유지한다. 현재 기반은 명시적 서버 저장/가져오기이며 자동 병합·실시간 동기화는 미구현이다.

## 확정된 구현 선택

| 영역 | 결정 |
| --- | --- |
| 앱 | Next.js App Router + TypeScript |
| 공통 UI | SEED Design React |
| CSS | Tailwind CSS v4 + SEED 공식 Tailwind 토큰 연동; 특수 노선도는 필요한 경우만 CSS Modules |
| 디자인 토큰 | **SEED 내장 토큰 우선**. Primitive→Semantic→Component를 별도 재구축하지 않음. 새 값은 필요한 고유 UI에 한해 정의 |
| 상태 | `useState` 기본, **실제 props drilling/공유 필요가 생길 때만 `useContext`**. Jotai·Zustand 도입 안 함 |
| 지속 저장 | Supabase PostgreSQL/Auth + Server Actions/Route Handlers; 로컬 버전 관리·백업/복원 병행 |
| 지도 | 접근 가능한 DOM 목록 + SVG 노선 표현; 필요 전 그래프 라이브러리 금지 |
| 공략 | 정적 TypeScript/JSON + 출처/판본/검증 상태 |
| 품질 | 자동 데이터 검사, 핵심 유틸 테스트, 모바일 사용자 테스트 |
| 측정 | Search Console + 개인정보 검토 후 GA4; MAU는 월간 사용자 수, 페이지뷰와 혼동 금지 |

## 명시적으로 하지 않는 것

- 유저에게 프레임 단위 조작/글리치를 강요하는 스피드런, 초판부터 100% 수집 완주 공략, AI가 출처 없이 공략 생성.
- AI가 실시간으로 화면 좌표/컴포넌트 구조를 마음대로 재배치하는 기능.
- 실시간 자동 동기화·자동 병합, AI 개인화, GIF/동영상 필수 제공, 야숨·왕눈 구체 루트 개발. 선택 로그인과 서버 저장은 현재 개발 범위에 포함한다.
- SEED Button 등을 다시 감싸는 범용 UI 래퍼, 가정에 근거한 고급 추상화.

## 후속 로드맵

- **Phase 2**: 별도 100% 수집 모드. 기존 스토리 진행도를 필요 시 활용.
- **후속 후보**: 실시간 동기화·충돌 자동 병합, AI 기반 개인별 경로 재추천. 선택 로그인과 수동 서버 저장/가져오기는 현재 기반에 포함했다. 사용자의 요청대로 **AI가 경로가 바뀌었다는 결과를 반영하되**, 배치는 우선 규칙 기반 UI로 표현. AI 레이아웃 직접 생성은 별도 효용·안정성 검증 후에만.
- **장기**: 야숨·왕눈. 사용자의 직접 경험에 따른 공략 방향만 유지하고 구체 루트는 이번 설계에서 제외.

## 현재 실행 상태

- 앱 실행: [README](README.md), [개발 환경 설정](docs/development/01-local-setup.md).
- Supabase 연결 및 사용자 설정: [백엔드/인증](docs/architecture/04-backend-auth.md), [설정 안내](docs/development/03-supabase-setup.md).
- 구현 완료·미구현·미검증의 구분: [현재 상태](docs/development/02-project-status.md).

## 어디부터 읽나

- 제품: [`docs/product/01-prd.md`](docs/product/01-prd.md)
- 최적화 원칙: [`docs/game/01-route-criteria.md`](docs/game/01-route-criteria.md)
- UX/스포일러: [`docs/design/03-ux-flows.md`](docs/design/03-ux-flows.md), [`docs/game/04-hint-policy.md`](docs/game/04-hint-policy.md)
- 기술/상태: [`docs/architecture/01-technical-design.md`](docs/architecture/01-technical-design.md), [`docs/architecture/03-progress-routing.md`](docs/architecture/03-progress-routing.md)
- 디자인 토큰/컴포넌트: [`docs/design/05-seed-token-policy.md`](docs/design/05-seed-token-policy.md), [`docs/design/04-component-guidelines.md`](docs/design/04-component-guidelines.md)
- 승인 기록: [`docs/decisions/001-architecture-decisions.md`](docs/decisions/001-architecture-decisions.md)
- 전체 색인: [`docs/INDEX.md`](docs/INDEX.md)
