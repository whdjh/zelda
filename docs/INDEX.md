# 젤다 하이패스 — 문서 색인

> 2026-11-08 · **합의된 제품/기술 요구 v1.0**. 실제 최적 루트/퍼즐 본문은 출처 조사와 직접 플레이를 거쳐 확정해야 합니다.

## 먼저 읽기

- [5분 요약](../START-HERE.md)
- [프로젝트 README](../README.md)
- [AI 에이전트 규칙](../AGENTS.md)
- [확정 의사결정 기록](./decisions/001-architecture-decisions.md)

## 문서 위치와 우선순위

| 위치 | 책임 |
| --- | --- |
| 루트 README / START-HERE / AGENTS | 실행 입구 / 제품 요약 / AI 작업 규칙 |
| product / game / design | 요구사항 / 게임 조사·힌트 원칙 / UX·토큰 |
| architecture / decisions | 현재 기술 설계·데이터 / 변경 이유와 폐기된 결정 |
| development | 실행법·구현 현황·외부 계정 설정 |
| research / quality / operations | 출처·조사 기록 / 검증·권리 / 출시·측정 |
| ../content | 실제 배포할 공략 데이터. 조사 문서와 분리 |

우선순위는 최신 사용자 지시 → 현재 ADR → 각 분야 설계다. **백엔드 제외 ADR-004는 폐기**하고 ADR-011의 Supabase 인증/DB를 채택했다. ADR-013에 따라 현재는 전체 공략집 제작이 우선이며 로그인 연결은 후순위다. 기존 분야별 경로는 유지하고 실행/설정 설명은 아래 개발 문서로 모았다.

## 개발 시작과 사용자 설정

- [로컬 실행·폴더 구조·검증 명령](./development/01-local-setup.md)
- [구현/미구현/미검증 상태](./development/02-project-status.md)
- [후속 로그인 연결 시 Supabase 설정](./development/03-supabase-setup.md)

## 제품·타깃·경쟁

- [PRD v1.0](./product/01-prd.md)
- [타깃/포지셔닝/사용자 여정](./product/02-audience-positioning.md)
- [경쟁 프로젝트 분석](./product/03-competitor-research.md)
- [한국어 검색 및 콘텐츠 전략](./product/04-content-seo.md)
- [후속 모드/인증/AI 확장 경계](./product/05-future-expansion.md)

## 공략 조사·판정·힌트

- [일반 유저 추천 루트 판단 기준](./game/01-route-criteria.md)
- [공략·유튜브 조사 프로토콜](./game/02-research-protocol.md)
- [전체 공략집 구성과 전 구간 집필 현황](./game/03-oot-guide-outline.md)
- [단계별 힌트와 스포일러 정책](./game/04-hint-policy.md)
- [진행 수정에 따른 추천 경로 변화](./game/05-route-adaptation.md)

## 디자인·UX·컴포넌트

- [기초 디자인 원리와 시각 위계](./design/01-visual-foundations.md)
- [젤다 테마 오픈소스/디자인 참조 검토](./design/02-zelda-theme-references.md)
- [세로 노선도·Bottom Sheet·스포일러 UX](./design/03-ux-flows.md)
- [컴포넌트화/과잉 추상화 금지](./design/04-component-guidelines.md)
- [SEED 토큰 재사용 및 CSS 역할](./design/05-seed-token-policy.md)

## 기술·데이터

- [기술 설계(Next/SEED/Tailwind/React state)](./architecture/01-technical-design.md)
- [공략 데이터와 사용자 상태 구조](./architecture/02-content-model.md)
- [규칙 기반 재계산·localStorage·Context 판단](./architecture/03-progress-routing.md)
- [Supabase 백엔드·인증·사용자별 진행도](./architecture/04-backend-auth.md)

## 검증·권리·성과

- [테스트 및 공략 검증 기준](./quality/01-validation.md)
- [저작권·개인정보·비공식 서비스 안내](./quality/02-rights-privacy.md)
- [검색/MAU 측정 원칙](./operations/01-analytics.md)
- [자료 조사 → 개발 → 플레이 검증 → 출시 실행 계획](./operations/02-release-plan.md)

## 출처/조사 기록 양식

- [출처 등록부](./research/01-source-register.md)
- [@nintaku_chick 등 영상 조사 카드](./research/02-youtube-review-template.md)
- [경로 후보 비교·판정 템플릿](./research/03-route-decision-template.md)
- [첫 장비 준비: 사실 대조와 자체 공략 초안](./research/04-oot-opening.md)
- [게임 공략 데이터 입력 규칙](../content/ocarina-of-time/README.md)

## 문서 해석 기준

- **확정:** 사용자가 승인한 목표/기술 원칙/서비스 동작.
- **가설·제안:** UX 성능·구체 레이아웃 같은 실험을 통해 확인할 설계 선택.
- **미검증:** 외부 공략만 보고 추론한 게임 사실/추천 루트, 실제 측정/권리 허가 여부.

기존 설계의 Jotai 및 3단계 토큰 체계 자체 구현은 **취소**했다. SEED 내장 토큰과 기본 React 상태 관리를 우선한다.
