# Supabase 연동 & 개인정보 없는 자유 아이디 로그인

## 1. 로그인 방식

- 이메일·전화번호·비밀번호·JWT를 사용하지 않습니다.
- 사용자가 편한 **모험 아이디(2~24자, 한글/영문/숫자/`-`/`_`)** 하나만 입력합니다.
- 입력한 아이디는 브라우저 `localStorage`(`zelda-highpass:adventure-id:v1`)에 저장되어 새로고침·재방문 시 계속 로그인 상태가 유지됩니다.
- 이메일(`@`)·휴대폰 번호 형태는 개인정보 오입력 방지를 위해 차단합니다.

## 2. 공유 Supabase 프로젝트 & 테이블 접두사(`zhp_`)

무료 Supabase 프로젝트를 다른 프로젝트와 공유하므로, 이 앱의 모든 테이블과 정책에는 **`zhp_`** 접두사를 붙입니다.

- 테이블명: `public.zhp_adventures`
- SQL 위치: [`supabase/schema.sql`](../supabase/schema.sql)

## 3. 환경변수 설정

1. `.env.example`을 복사해 `.env.local`을 만듭니다.
2. Supabase 프로젝트의 URL과 공개 키만 입력합니다. (**`service_role` 키 금지**)

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

3. Supabase 대시보드 **SQL Editor**에서 [`supabase/schema.sql`](../supabase/schema.sql)을 1회 실행합니다.
4. 키가 설정되지 않은 상태에서도 로컬스토리지 모드로 정상 동작합니다.
