# AGENTS.md — AI 개발·공략 파트너 규칙

## 제품 정체성

《젤다의 전설 시간의 오카리나》(Nintendo Switch 2)를 처음 플레이하는 한국어 이용자를 위한 **증강 카드형 모바일 내비게이션**.

- 긴 스크롤 노선 대신 **현재 지점에서 선택할 수 있는 다음 갈래 2~3장(증강 카드)**을 추천한다.
- **100% 수집 공략은 제외**한다(실시간 지도·수집품 추적은 공식 `ZELDA NOTES` 영역).
- 퍼즐은 직접 풀 재미를 지키고, **관찰 → 단서 → 해법 3단계 힌트**를 요청받을 때만 DOM에 렌더링한다.
- 외부 참고 공략 링크는 **GameWith 한 곳**으로 통일한다.
- 공략과 카드를 한 번에 대량 작성하지 않고, **사용자와 함께 플레이하며 검증된 구간만 한 장씩 적립**한다.

## 먼저 읽을 문서

- `START-HERE.md`
- `docs/01-product-direction.md`
- `docs/02-design-system.md`
- `docs/03-supabase-login.md`
- `docs/04-status.md`
- `docs/05-switch2-master-map.md`

## 절대 지킬 규칙

1. **사실을 지어내지 않는다.** 직접 플레이로 확인하지 않은 Switch 2판 용어·조건·동선은 검증 완료로 표기하지 않는다.
2. **디자인은 당근 SEED Design(라이트 톤) + 자체 젤다 이미지셋.** SEED 기본 컴포넌트·토큰을 우선 사용하고 중복 래퍼나 임의 다크 테마를 만들지 않는다. 외부 저작권 이미지·공략 문장 복제 금지.
3. **로그인은 개인정보 없는 자유 아이디 방식.** 이메일·전화번호·비밀번호·JWT를 수집하지 않는다. `localStorage`에 아이디를 저장해 로그인을 유지하고, 서버 동기화는 공유 Supabase 프로젝트의 **`zhp_` 접두사 테이블**(`zhp_adventures`)만 사용한다.
4. **보안과 환경변수.** `service_role` 키는 절대 사용하지 않는다. 실제 키는 `.env.local`에만 두고 커밋·로그에 남기지 않는다.
5. **과잉 설계 금지.** `useState` 우선, 불필요한 상태 라이브러리(Jotai/Zustand)나 범용 래퍼(`Base*`/`Generic*`) 금지. 기능별 목업 HTML(`mockups/`)로 먼저 확인하고 실제 앱에 옮긴다.

## 개발 명령

- Node 24, npm: `npm ci`, `npm run dev`, `npm run check`, `npm run build`
- 목업 HTML: `mockups/index.html`
- 이미지셋: `public/assets/zelda/`
- Supabase SQL: `supabase/schema.sql` (`zhp_` prefix 필수)

## 자동 커밋 규칙

- 의미 있는 작업 단위를 완료하고 `npm run check`와 `npm run build`를 통과하면 로컬 커밋한다.
- 형식은 `feat(scope): 한글 메시지`, `fix(scope): 한글 메시지`, `chore(scope): 한글 메시지`만 사용한다.
- `.env.local`, 실제 키, 빌드 결과, `node_modules`를 스테이징하지 않는다. 원격 push는 사용자 요청 시에만 진행한다.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
