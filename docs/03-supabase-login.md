# Supabase 연동 & 백엔드 API 아키텍처

## 1. 역할 분리 (야숨·왕눈 확장 대비)

- **백엔드 API (`src/app/api/adventure/*`, `src/server/`)**: 게임별 카드 그래프·셔플·3단계 힌트 원본과 유저 진행도(`zhp_adventures`)를 관리하고, **현재 화면에 필요한 카드와 공개된 힌트만** JSON으로 내려줍니다.
- **중앙 API 계층 (`src/api/`)**:
  - `src/api/types.ts`: 요청·응답·에러 코드·뷰모델 타입 단일 정의
  - `src/api/client.ts`: 공통 `apiRequest` 래퍼 및 `ApiError` 처리
  - `src/api/adventure.ts`: `adventureKeys` + TanStack Query 훅(`useAdventureQuery`, `useSelectNextCardMutation`, `useGoBackCardMutation`, `useRevealHintMutation`)
- **프론트엔드 (`src/components/adventure-shell.tsx`)**: `localStorage`에 자유 아이디(`adventureId`)만 유지하고, 중앙 훅이 내려준 뷰 모델만 SEED UI로 렌더링합니다.

## 2. 로그인 방식

- 이메일·전화번호·비밀번호·JWT를 사용하지 않습니다.
- 사용자가 편한 모험 아이디(2~24자) 하나만 입력하면 `localStorage`에 저장되어 로그인 상태가 유지됩니다.
- 로그인 후에는 우상단 **플로팅 버튼**으로 아이디를 표시하고, 탭 시 바텀시트에서 아이디를 변경할 수 있습니다.

## 3. 공유 Supabase 프로젝트 & `zhp_` 접두사

- 테이블명: `public.zhp_adventures`
- SQL 위치: [`supabase/schema.sql`](../supabase/schema.sql)
- `.env.example`을 복사해 `.env.local`에 `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`만 입력합니다. (`service_role` 키 금지)
