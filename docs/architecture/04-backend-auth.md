# 백엔드·인증·사용자 진행 기록

> **후속 준비 코드**: Next.js 서버 기능 + Supabase Auth/PostgreSQL 선택은 유지한다. ADR-013에 따라 전체 공략집 제작을 먼저 진행하며 현재 기본 화면에는 로그인/서버 저장을 연결하지 않는다. 원격 프로젝트 생성과 키 설정은 지금 필요하지 않다.

## 인증

- /login: 이메일을 Server Action에 제출하고 Supabase signInWithOtp로 링크 요청. 비밀번호 저장/UI와 OAuth Secret이 필요하지 않은 최소 구성이다.
- /auth/callback: PKCE code를 exchangeCodeForSession으로 교환하고 고정된 내부 경로로 이동한다. 임의 next URL을 허용하지 않는다. 링크는 요청한 브라우저에서 열어야 한다.
- src/proxy.ts: 후속 로그인/인증 콜백 경로에서만 getClaims로 세션 쿠키 갱신. 공개 공략 경로는 인증 조회 대상에서 제외한다.
- 보호 Action은 매번 getUser를 호출한다. UI에 로그인 표시가 있다고 해서 신뢰하지 않는다. signOut Action도 준비했다.
- 서버 전용 환경변수: SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SITE_URL. 클라이언트 SDK나 서비스 역할 키를 추가하지 않는다.
- 환경변수 미설정 시 로그인 폼은 비활성 안내를 보이며 나머지 앱은 실행된다.

공식 근거: [SSR 클라이언트](https://supabase.com/docs/guides/auth/server-side/nextjs), [이메일 링크](https://supabase.com/docs/guides/auth/auth-email-passwordless).

## DB

supabase/migrations/20261108000100_user_progress.sql의 user_progress:

| 열 | 역할 |
| --- | --- |
| user_id | auth.users FK, 계정 삭제 시 해당 기록 cascade |
| game_id / game_version | 작품·판본 구분, user_id와 복합 기본키 |
| data (jsonb) | 버전 있는 완료·보유 조건·힌트 ID·공개 범위 스냅샷 |
| revision | 갱신 충돌 감지, trigger로 증가 |
| updated_at | DB 기준 갱신 시간 |

데이터는 1MB 제한과 필수 키/배열/공개 범위 CHECK를 갖는다. 실제 게임 ID의 존재·중복은 서버의 콘텐츠 검사로 검증한다. 게임 본문은 정적 콘텐츠로 유지하므로 DB에 공략을 중복 적재하지 않는다. AI 추천 실행 기록 테이블은 실제 기능 필요 시 추가한다.

RLS는 select/insert/update/delete마다 auth.uid() = user_id를 적용한다. anon은 테이블 권한이 없다. 서비스 역할 키로 RLS를 우회하지 않는다. [공식 RLS 문서](https://supabase.com/docs/guides/database/postgres/row-level-security).

## 서버 Action

src/app/oot/progress-actions.ts는 현재 시오 판본의 기록만 다룬다. 읽기 후 UI에서 저장/가져오기를 선택한다. 저장 입력은 신뢰하지 않으며 raw JSON·크기·버전·ID·revision을 검증한다. 조건이 모순되는 완료 기록도 사용자 기록으로 보존하고 규칙 계산 결과로 충돌을 알린다.

첫 저장은 insert, 이후는 eq(revision, expectedRevision) 업데이트를 수행한다. 결과 행이 없거나 최초 insert가 중복되면 재조회하도록 안내한다. 사용자별 서버 상태와 화면 임시 상태를 별도 책임으로 유지한다.

## 실제 검증이 필요한 부분

- 마이그레이션은 PGlite 0.5.15의 격리된 메모리 PostgreSQL에 적용해 통과했다. auth 스키마/역할/uid 함수는 테스트용으로 준비했고 원격 Supabase에는 적용하지 않았다.
- Supabase 계정 연결, 메일 발송/콜백, 세션 갱신, 사용자 A/B RLS, 동시 revision 충돌은 실제 서비스 시험 필요.
- supabase/tests/user_progress.sql은 위 격리 엔진에서 통과했다. 실제 Supabase의 세션/JWT/기본 권한과 결합한 회귀 검증은 사용자 프로젝트 연결 후 다시 수행한다.
- 공개 전 SMTP/발송 제한, 개인정보 보유/삭제 및 탈퇴 절차를 정해야 한다. 자동 동기화·OAuth·AI는 미구현.

[사용자 설정 절차](../development/03-supabase-setup.md)
