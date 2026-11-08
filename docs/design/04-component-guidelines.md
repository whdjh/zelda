# 컴포넌트 설계 원칙 — 재사용은 하고, 추상화는 필요한 만큼만

## 확정 규칙

1. **SEED 기본 컴포넌트를 그대로 사용**한다. 단순 Button/Sheet 재포장 래퍼(`BaseButton`, `AppDialog` 등) 금지.
2. 도메인 책임과 독립 인터랙션이 있을 때만 별도 컴포넌트로 나눈다. 파일 줄 수만으로 컴포넌트 분리하지 않는다.
3. 실제 두 곳 이상에서 동일한 사용이 생기거나, 접근성·테스트·독립 동작이라는 구체적 이유가 있을 때만 공통화를 검토한다.
4. 너무 많은 props, config-driven '유니버설 컴포넌트', 계층적인 service/repository/adapter/factory 금지.
5. 로컬은 `useState`, 실제 공유/props drilling 문제가 생길 때만 Context. **Jotai와 Zustand를 사용하지 않는다.**
6. 게임 콘텐츠(사실/출처)와 컴포넌트의 표현(스타일/SVG 배치)을 구분한다. 단, 파일·추상 계층을 과도하게 만들지 않는다.

## 필요한 범위에서만 만들어볼 도메인 컴포넌트

| 컴포넌트(가칭) | 책임 | 판단 |
| --- | --- | --- |
| `RouteMap` | 필수/추천/완료/잠금의 노선도 표현 | 독립적 핵심 기능이므로 적절 |
| `RouteStop` | 역 상태 표시·선택·키보드 접근 | 반복 역 렌더링이 실제 필요 |
| `StopDetailSheet` | 역의 행동 가이드와 완료 수정 | SEED Bottom Sheet 구성만 담당 |
| `HintReveal` | 단계 공개/바로 답 보기/스크린리더 보호 | 독립 상호작용·테스트가 필요한 도메인 UI |
| `ActionSummary` | 짧은 행동 가이드 | 여러 화면에서 **실제로** 필요할 때 추출 |

`UniversalNode`, `GenericProgressEngine`, `BaseSeedButton`, 다중 게임 범용 UI 엔진은 미래 필요를 상상해 만들지 않는다.

## 상태 소유 예시

- `StopDetailSheet` 열림/선택 역: 가능한 한 노선 화면 `useState`.
- `HintReveal` 단계 표시: 개별 화면 `useState`. '다음에 다시 방문해도 공개 상태 기억'이 요구될 때만 완료 상태 저장에 포함.
- 완료 기록이 노선도·상세·헤더에서 함께 필요하면 상위에서 props로 전달. 여러 계층 prop drilling이 **실제로** 반복되면 좁은 Provider.
- 고정 공략은 상태가 아니라 `content`에서 읽는 데이터.

## CSS 원칙

Tailwind v4 + SEED 토큰 기반. 역 간 커넥터/특수 애니메이션만 CSS Modules. 컴포넌트별 새로운 spacing/color scale 구축 금지. `docs/design/05-seed-token-policy.md` 우선.

## 코드 리뷰 체크

- 어떤 사용자 문제를 해결하는가?
- SEED UI 중복 래퍼는 아닌가?
- 이 함수/컴포넌트는 실제 사용처가 있는가?
- props 수가 줄어든 게 아니라 오히려 복잡해지진 않았는가?
- 순수 로직을 테스트할 수 있는가?
- Context/라이브러리를 도입해야 하는 실제 props drilling 또는 복잡한 동시 변경이 있는가?
- 공략 내용/스포일러/검증 정보가 표시 로직에 하드코딩되어 있지 않은가?
