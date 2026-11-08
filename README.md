# 젤다 하이패스

보통 실력 이용자가 《시간의 오카리나》의 엔딩까지 안정적으로 진행하도록 돕는 한국어 모바일 모험 내비게이션입니다. **현재는 개발 기반이며 실제 공략 콘텐츠는 비어 있습니다.**

## 실행

Node.js 24와 npm을 사용합니다. 환경변수 없이도 공략 준비 화면·로컬 설정·백업을 실행할 수 있습니다.

```sh
npm ci
npm run dev
```

[http://localhost:3000/oot](http://localhost:3000/oot)에서 확인합니다.

```sh
npm run check        # 내부 문서 링크·콘텐츠·린트·타입·단위 테스트
npm run build        # 콘텐츠 검사 + 프로덕션 빌드
npm run test:e2e     # Google Chrome, 360/390px 브라우저 검사
```

## 문서 길잡이

| 목적 | 문서 |
| --- | --- |
| 제품을 처음 이해하기 | [5분 요약](START-HERE.md) |
| 모든 기획/설계 찾기 | [분야별 색인](docs/INDEX.md) |
| 개발 시작·폴더 구조·명령 | [로컬 개발](docs/development/01-local-setup.md) |
| 구현/미구현/미검증 구분 | [현재 상태](docs/development/02-project-status.md) |
| 본인이 해야 할 Supabase 설정 | [단계별 설정](docs/development/03-supabase-setup.md) |
| AI 작업 규칙 | [AGENTS.md](AGENTS.md) |

## 현재 구성

Next.js App Router + TypeScript, React 기본 상태, SEED Design + Tailwind CSS v4/공식 토큰, Server Actions/Route Handlers, Supabase Auth/PostgreSQL입니다. 비로그인 localStorage와 JSON 백업도 지원합니다. 백엔드 제외 결정은 [ADR-011](docs/decisions/001-architecture-decisions.md)로 대체했습니다.

회원 프로젝트 생성·비밀키 발급·OAuth 등록은 자동 수행하지 않습니다. [.env.example](.env.example)을 복사하고 [설정 안내](docs/development/03-supabase-setup.md)를 따라 연결합니다. 키는 대화창이나 소스 코드에 붙이지 마세요.

출처·판본·검증 상태 없는 게임 사실을 추가하지 않습니다. 게임판과 출처는 [등록부](docs/research/01-source-register.md), 데이터 입력은 [콘텐츠 규칙](content/ocarina-of-time/README.md)을 따릅니다. 비공식 팬 프로젝트이며 Nintendo와 제휴·후원 관계가 없습니다.
