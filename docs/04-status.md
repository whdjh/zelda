# 현재 상태

> 기준일: 2026-11-23

## 완료

1. **이전 작업 보존**: 리셋 전 30역 초안·조사 변경본을 Git 이력에 커밋해 보존.
2. **코드·문서 슬림 정리**: 미검증 30역 노선 코드와 35개 문서를 초경량 베이스로 축소.
3. **기능별 목업 HTML (`mockups/`)**: 당근 SEED 라이트 톤 + 자체 젤다 아이콘셋으로 4개 화면 시안 작성.
4. **Supabase 연동 & 자유 아이디 로그인**:
   - `localStorage` 기반 자동 로그인 유지 (`src/lib/adventure-id.ts`)
   - 공유 Supabase 프로젝트용 `zhp_adventures` 스키마 및 서버 액션 (`supabase/schema.sql`, `src/lib/supabase.ts`, `src/app/actions/adventure.ts`)
   - 당근 SEED 메인 로그인 화면 (`src/components/adventure-login.tsx`)

## 다음 단계

1. `.env.local`에 실제 Supabase URL + Publishable Key 입력 및 `supabase/schema.sql` 실행 후 실연동 확인.
2. 《시간의 오카리나》를 직접 플레이하면서 검증된 첫 증강 카드 묶음과 3단계 힌트를 한 장씩 추가.
