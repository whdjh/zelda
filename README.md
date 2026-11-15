# 젤다 하이패스

보통 실력 이용자가 《시간의 오카리나》의 엔딩까지 안정적으로 진행하도록 돕는 한국어 모바일 모험 내비게이션입니다. **30개 구간·31개 단계별 힌트를 담은 출처 기반 초안을 이용할 수 있습니다. 직접 플레이 검증은 아직입니다.**

현재 작업은 **처음부터 엔딩까지의 전체 공략집 조사·작성**입니다. 스토리·던전·보스·퍼즐을 다루고, 요약과 단계별 힌트로 연결합니다. 현재는 메인 페이지와 핵심 공략 기능만 제공합니다.

## 실행

Node.js 24와 npm을 사용합니다. 환경변수 없이도 실제 공략·로컬 진행도·설정·백업을 실행할 수 있습니다.

```sh
npm ci
npm run dev
```

[http://localhost:3000/](http://localhost:3000/)에서 확인합니다.

**메인 `/` 한 화면**에서 전체 노선과 진행도·설정을 바로 사용합니다. 네비바·사이드바·로그인 페이지는 없습니다. 힌트도 역 안내 안에서 엽니다. 점에 마우스를 올리거나 길게 누르면 이름, 탭하면 상세 안내가 열립니다. 목록 보기로 이름을 한꺼번에 볼 수 있습니다. 완료·장비·목적지 변경으로 남은 연결이 재구성되며, 상세 해법은 별도로 엽니다. [조사 범위와 한계](docs/research/06-route-network.md)를 참고하세요.

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
| 전체 공략집 범위·집필 현황 | [전체 구성](docs/game/03-oot-guide-outline.md) |
| 전 구간 출처·검증 과제 | [집필 기록](docs/research/05-oot-story-draft.md) |
| 첫 구간 사실 대조·자체 문장 | [초반 공략 초안](docs/research/04-oot-opening.md) |
| 개발 시작·폴더 구조·명령 | [로컬 개발](docs/development/01-local-setup.md) |
| 구현/미구현/미검증 구분 | [현재 상태](docs/development/02-project-status.md) |
| AI 작업 규칙 | [AGENTS.md](AGENTS.md) |

## 현재 구성

Next.js App Router + TypeScript, React 기본 상태, SEED Design + Tailwind CSS v4/공식 토큰, localStorage와 JSON 백업을 사용합니다. 현재 쓰지 않는 인증·서버 저장 코드와 전용 의존성은 제거했습니다. 범위는 [ADR-016](docs/decisions/001-architecture-decisions.md)을 따릅니다.

후속 기능은 [확장 후보](docs/product/05-future-expansion.md)에만 기록합니다. 기존 준비 코드는 Git 이력에 남아 있으며, 현재는 계정이나 키 설정이 필요하지 않습니다.

출처·판본·검증 상태 없는 게임 사실을 추가하지 않습니다. 게임판과 출처는 [등록부](docs/research/01-source-register.md), 데이터 입력은 [콘텐츠 규칙](content/ocarina-of-time/README.md)을 따릅니다. 비공식 팬 프로젝트이며 Nintendo와 제휴·후원 관계가 없습니다.
