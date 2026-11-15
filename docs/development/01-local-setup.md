# 로컬 개발 시작

## 실행

Node 24와 npm을 사용한다. .nvmrc가 있으며 실제 설치 버전은 package-lock.json에 고정한다.

```sh
npm ci
npm run dev
```

기본 주소는 http://localhost:3000/. 다른 포트는 npm run dev -- --port 3001. 환경변수·외부 계정 설정 없이 메인 공략과 로컬 저장을 사용한다.

## 구조

```text
src/
  app/                  # 메인 페이지, 루트 레이아웃, 오류·404
  components/           # 진행도·백업 설정과 route/, hint/ UI
  lib/                  # 공략 타입/검사, 추천 규칙, 로컬 저장
content/
  ocarina-of-time/       # 출처 기반 실제 공략 초안
scripts/                # 문서 링크·콘텐츠 검증
tests/e2e/              # 모바일 브라우저 시나리오
docs/                   # 제품/설계/조사/개발 문서
```

로그인·서버 저장·인증 proxy·SQL·전용 의존성은 제거했다. 후속 기능은 [후보 문서](../product/05-future-expansion.md)에만 기록하고 필요할 때 Git 이력에서 이전 구현을 참고한다.

## 검증

```sh
npm run check
npm run build
npm run test:e2e
```

- check: 문서 내부 파일 링크, 데이터 ID/출처/순환/힌트 검사, ESLint, 타입 검사, Node 테스트.
- build: 실제 프로덕션 빌드. 환경변수 없이 통과해야 한다.
- test:e2e: Google Chrome 설치를 기본 사용하며 비어 있는 3100 포트에 별도 개발 서버를 띄운다. Chrome이 없는 CI에서는 playwright.config.ts의 channel을 제거하고 Playwright Chromium을 설치해 사용한다.
- 외부 서비스 없이 RLS/메일 발송까지 통과했다고 간주하지 않는다. 실제 환경 결과는 [현재 상태](02-project-status.md)에 기록한다.

## 문서 관리

루트에는 README(실행), START-HERE(제품 요약), AGENTS(AI 규칙)만 둔다. 기획 원문은 기존 분야별 docs 경로를 유지해 참조 손상을 줄였다. docs/INDEX.md를 전체 색인으로 사용한다.

변경 시 결정은 ADR, 구현 사실은 현재 상태 문서에 기록한다. 날짜가 같아도 최신 사용자 지시가 예전 문서보다 우선한다. 공략 가상 데이터는 테스트 파일 밖에 넣지 않는다.
