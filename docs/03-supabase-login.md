# Supabase 연동 & 백엔드 주도 아키텍처

## 1. 역할 분리 (야숨·왕눈 확장 대비)

- **백엔드 (`src/server/`, `src/app/actions/adventure.ts`)**: 게임별 카드 그래프·셔플·3단계 힌트 원본과 유저 진행도(`zhp_adventures`)를 모두 관리하고, **현재 화면에 필요한 카드와 공개된 힌트만** 프론트에 내려줍니다.
- **프론트엔드 (`src/components/adventure-shell.tsx`)**: `localStorage`에 자유 아이디(`adventureId`)만 유지하며, 서버가 내려준 뷰 모델만 SEED UI로 렌더링합니다.

## 2. 로그인 방식

- 이메일·전화번호·비밀번호·JWT를 사용하지 않습니다.
- 사용자가 편한 모험 아이디(2~24자) 하나만 입력하면 `localStorage`에 저장되어 로그인 상태가 유지됩니다.
- 로그인 후에는 우상단 **플로팅 버튼**으로 아이디를 표시하고, 탭 시 바텀시트에서 아이디를 변경할 수 있습니다.

## 3. 공유 Supabase 프로젝트 & `zhp_` 접두사

- 테이블명: `public.zhp_adventures`
- SQL 위치: [`supabase/schema.sql`](../supabase/schema.sql)
- `.env.example`을 복사해 `.env.local`에 `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`만 입력합니다. (`service_role` 키 금지)
