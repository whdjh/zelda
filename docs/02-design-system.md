# 디자인 시스템 — 당근 SEED 구조 + 시간의 오카리나 컬러 토큰

## 1. SEED 컴포넌트 + 시오 브랜드 토큰 오버라이드

- **구조/컴포넌트**: 당근 SEED Design (`@seed-design/react`, `light-only`)의 레이아웃·타이포·버튼·간격을 그대로 사용합니다.
- **색상 토큰**: SEED 기본 당근 오렌지(`#FF6600`)를 [`src/app/globals.css`](../src/app/globals.css)에서 **《시간의 오카리나》 시그니처 팔레트**로 시맨틱 오버라이드합니다.

| 역할 | SEED 시맨틱 토큰 | 시오 색상 | 용도 |
| --- | --- | --- | --- |
| **코키리 에메랄드 (Primary)** | `--seed-color-bg-brand-solid` / `weak` | `#16794F` / `#EBF6F0` | 주요 CTA 버튼, 선택된 증강 카드, 활성 배지 |
| **트라이포스 골드 (Warning/Accent)** | `--seed-color-fg-warning` / `bg-warning-weak` | `#9E700D` / `#FDF6E3` | 안전 준비 카드, 퍼즐 해법 강조 |
| **오카리나 블루 (Informative)** | `--seed-color-fg-informative` / `bg-informative-weak` | `#245EC7` / `#EDF4FF` | 이동·노래 갈래, 나비 3단계 힌트 |
| **하이랄 파치먼트 (Surface)** | `--seed-color-bg-layer-basement` / `neutral-muted` | `#F7F5EE` / `#F5F3EC` | 따뜻한 라이트 배경, 카드 구분선 `#E8E4D9` |

## 2. 자체 젤다 이미지셋 (`public/assets/zelda/`)

외부 저작권 이미지나 게임 스크린샷을 복제하지 않고, 위 팔레트에 맞춘 자체 제작 3D 아이콘을 사용합니다.

| 파일 | 용도 |
| --- | --- |
| `adventure-emblem.png` | 앱 심볼 · 모험 로그인/상태 헤더 |
| `sword-shield.png` | 메인 직행 증강 카드 |
| `fairy-bottle.png` | 안전·생존 준비 증강 카드 |
| `ocarina.png` | 자유 갈래·이동 편의 증강 카드 |
| `hint-fairy.png` | 스포일러 방지 3단계 힌트 |
