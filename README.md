# 젤다 하이패스

《젤다의 전설 시간의 오카리나》(Switch 2)를 플레이하며 **다음 갈래를 롤 증강 카드처럼 2~3장 중에서 고르고, 막힐 때만 스포일러 없이 3단계 힌트를 여는** 한국어 모바일 내비게이션입니다.

## 핵심 특징

- **스크롤 없는 증강 카드 UX**: 긴 공략 목록 대신 현재 지점에서 선택할 수 있는 2~3개 갈래만 한 화면에 제시합니다.
- **직접 플레이 기반 적립**: 미검증 공략을 한 번에 채우지 않고, 직접 플레이하며 검증된 갈래와 힌트만 한 장씩 추가합니다.
- **단일 참고 사이트 통일**: 상세 외부 링크는 GameWith 한 곳으로 통일합니다.
- **개인정보 없는 간편 로그인**: 이메일·비밀번호·JWT 없이 자유 아이디 하나만 입력해 `localStorage`로 유지하고, 공유 Supabase 프로젝트(`zhp_` 접두사 테이블)에 진행 기록을 저장합니다.
- **100% 수집 공략 제외**: 실시간 지도·수집품 필터는 공식 `ZELDA NOTES` 영역으로 두고, 의사결정·퍼즐 힌트에 집중합니다.

## 로컬 실행

```bash
npm ci
cp .env.example .env.local # Supabase URL / Publishable Key 입력 (선택)
npm run dev
```

- 검증: `npm run check && npm run build`
- 기능별 목업 HTML: `mockups/index.html`

## 문서

- [시작 요약](START-HERE.md)
- [제품 방향](docs/01-product-direction.md)
- [디자인 시스템 (당근 SEED + 젤다 아이콘셋)](docs/02-design-system.md)
- [Supabase 연동 & 자유 아이디 로그인](docs/03-supabase-login.md)
- [현재 상태](docs/04-status.md)
