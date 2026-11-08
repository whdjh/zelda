# 사용자가 해야 할 Supabase 설정

> **후속 연결용 안내이며 지금 수행할 필요는 없다.** 전체 공략 제작과 핵심 UI가 우선이다. 외부 프로젝트 생성/계정 권한/비용 작업은 수행하지 않았다. 키는 로컬 환경 파일에 입력하고 대화창에 보내지 않는다. 현재 로그인 코드는 이메일 링크이며 OAuth Secret은 필요 없다.

## 1. 프로젝트 생성

[Supabase 대시보드](https://supabase.com/dashboard)에서 조직과 새 프로젝트를 선택한다. 요금/리전/DB 비밀번호는 본인이 확인하고 결정한다. 프로젝트가 준비되면 Connect 또는 프로젝트 API 설정에서 **Project URL**과 **Publishable key**를 확인한다. service_role/secret key는 이 앱에 필요 없다.

## 2. 환경변수

프로젝트 루트에서 다음을 실행한다.

```sh
cp .env.example .env.local
```

.env.local에 본인 값을 입력한다.

```dotenv
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SITE_URL=http://localhost:3000
```

예시 문자를 그대로 두지 않는다. 다른 포트/도메인을 쓰면 SITE_URL도 실제 접속 주소로 변경한다. 세 값은 서버 코드에서만 읽는다. .env.local은 Git에서 제외되어 있다.

## 3. DB 마이그레이션 적용

새 개발 프로젝트의 SQL Editor에서 [마이그레이션](../../supabase/migrations/20261108000100_user_progress.sql)의 **전체 내용**을 한 번 실행한다. 기존 서비스 DB에 재적용하거나 기존 테이블을 삭제하지 않는다. 이미 적용되어 있으면 다음 단계를 진행한다.

Table Editor에서 user_progress 테이블과 RLS 활성화를 확인한다. PK는 user_id/game_id/game_version, 정책은 본인 사용자만 select/insert/update/delete하도록 설정되어 있어야 한다. 마이그레이션 파일은 저장소에서 계속 관리하고 변경은 새 파일로 추가한다.

[SQL 회귀 시나리오](../../supabase/tests/user_progress.sql)는 격리된 개발/테스트 DB에서만 실행한다. auth.users에 테스트 사용자 2명을 트랜잭션 안에서 만든 뒤 ROLLBACK한다. 실제 사용자 데이터가 있는 운영 환경 시험은 별도 계획한다.

## 4. Auth 설정

Auth 설정에서 Email 공급자를 활성화하고 이메일 가입 허용 여부를 확인한다. 현재 코드는 최초 로그인 시 계정을 생성할 수 있다.

URL Configuration에 다음을 등록한다.

- Site URL: http://localhost:3000
- Redirect URL: http://localhost:3000/auth/callback

로컬 127.0.0.1/다른 포트를 섞지 말고 동일한 브라우저·호스트에서 요청하고 링크를 연다. 배포 시 SITE_URL과 두 등록 주소를 실제 HTTPS 도메인으로 변경한다. 로그인 메일 템플릿의 기본 ConfirmationURL을 유지한다. PKCE 코드 교환은 /auth/callback에서 수행한다.

메일이 오지 않으면 Auth 로그, 이메일 발송 제한 및 허용 수신자/SMTP 설정을 확인한다. 공개 서비스를 운영하기 전에는 본인 발신 메일 서비스와 정책을 설정한다. [이메일 공식 안내](https://supabase.com/docs/guides/auth/auth-email-passwordless), [리다이렉트 공식 안내](https://supabase.com/docs/guides/auth/redirect-urls).

## 5. 실행과 실제 확인

```sh
npm run dev
```

1. /login에서 본인 이메일로 링크 요청 → 같은 브라우저에서 링크 열기 → /oot로 돌아오는지 확인.
2. 진행도·설정에서 서버 기록 확인 → 최초 서버 저장 → 새로고침 → 서버 기록 다시 확인.
3. 다른 브라우저에서 같은 계정 로그인 → 서버 기록 확인/가져오기. 로컬 기록이 자동 교체되지 않는지 확인.
4. 다른 계정으로 같은 기록을 읽거나 수정할 수 없는지 RLS 회귀 시나리오 및 실제 A/B 계정으로 확인.
5. 같은 계정 두 탭에서 서버 기록을 읽은 뒤 각각 저장해 나중 저장이 충돌 안내로 거부되는지 확인.
6. 로그아웃 후 서버 접근이 거부되고 로컬 백업은 계속 가능한지 확인.

현재 공략이 없으므로 스포일러 설정과 빈 진행도 스냅샷으로 인증/저장을 시험할 수 있다.

## OAuth는 언제 설정하나

현재 이메일 로그인에는 필요 없다. Google/Kakao 등 원하는 공급자를 정한 뒤 해당 개발자 콘솔의 Client ID/Secret, Supabase provider 설정과 콜백 URL을 연결하는 작업을 추가한다. 아직 해당 버튼/연동 코드는 구현하지 않았다.
