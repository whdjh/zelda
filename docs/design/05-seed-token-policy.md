# SEED 디자인 토큰 사용 정책

> **확정:** 토스의 `Primitive → Semantic → Component`가 사고방식으로는 유용하지만, 이 프로젝트에 별도 3단계 시스템을 구축하지 않는다. **SEED의 기성 토큰을 사용한다.**

## 1. 우선순위

1. **SEED 컴포넌트가 이미 가진 크기·간격·색·모션**을 기본값으로 사용한다.
2. 레이아웃은 `@seed-design/tailwind4-theme`가 제공하는 **SEED 기반 Tailwind 유틸리티** 사용. 공용 역할은 SEED Semantic에 맞춘다.
3. 전체 테마의 브랜드 색/다크 변형 필요가 **실제로 확인되면** SEED 공식 테마 커스터마이징 방법을 먼저 검토한다.
4. 기존 토큰에 없는 **'노선 현재역', '노선 연결선' 같은 도메인 특유 의미**에만 프로젝트 Semantic 또는 컴포넌트 범위 CSS 변수를 추가한다.
5. 존재하지 않는 component token을 만들기 위해 토큰 파일을 늘리지 않는다.

## 2. 중복 생성 금지 사례

- `--app-gray-100` 등 SEED 스케일과 같은 팔레트 재정의 금지.
- `--padding-16`, `--radius-medium`, `--text-primary` 같은 기존 역할의 별도 중복 금지.
- 카드/버튼 하나를 쓰려고 프로젝트 전용 `ButtonToken`/`CardToken` 테이블 구축 금지.
- 디자인 시스템 호환성을 깨는 Tailwind arbitrary value 난립 금지. 고유 좌표·선 두께 같은 예외에만 사용.

## 3. 꼭 필요할 수 있는 고유 값 예시

```css
/* 노선도의 실제 고유 제약이 확인된 뒤에만 CSS Module에 둔다. */
.map {
  --route-line-width: 3px;
  --route-station-size: 1.5rem;
}
```

이는 프로젝트 전역 디자인 토큰 **신규 아키텍처가 아니라** 노선 컴포넌트의 로컬 스타일이다. 색은 가능하면 SEED Semantic 토큰을 참조한다.

## 4. CSS 도구 역할

| 도구 | 책임 |
| --- | --- |
| `SEED React` | 버튼·Sheet·Dialog·Checkbox·레이어·상태 기본 디자인 |
| `Tailwind v4 + SEED theme` | 반응형 레이아웃, SEED 값으로 간격/배경/글자 스타일링 |
| `CSS Modules` | 다중 선/역 연결 등 복잡한 고유 SVG/CSS 선택자·애니메이션이 실제 필요한 경우 |
| `inline style` | 노선 좌표처럼 런타임 계산한 제한적 값; 모든 스타일 인라인화 금지 |

## 5. 설계 검토 체크

- [ ] SEED 컴포넌트나 토큰으로 가능한데 다시 만들고 있지 않은가?
- [ ] 새 토큰이 사용자에게 설명 가능한 **고유 의미**를 가지는가?
- [ ] 전역 테마와 여러 화면에 영향을 주는 변경은 공식 API에 따른 것인가?
- [ ] 라이트/다크 대비와 정보 상태가 모두 유지되는가?
- [ ] 버전 업데이트 후 유지보수하기 쉬운가?

## 공식 근거

- SEED 토큰 개념(Scale/Semantic): https://v2.seed-design.io/foundation/color/color-system/
- SEED Tailwind v4 설정: https://seed-design.io/react/getting-started/styling/tailwind-css
- SEED React: https://seed-design.io/react
