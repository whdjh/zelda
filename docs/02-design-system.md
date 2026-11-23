# 디자인 시스템 — 당근 SEED + 자체 젤다 이미지셋

## 1. 당근 SEED Design 우선

- 컬러 모드: `light-only` (깨끗한 화이트·뉴트럴 라이트 표면 + 당근 브랜드 오렌지 포인트)
- 컴포넌트: `@seed-design/react` (`ActionButton`, `BottomSheet` 등) 기본 컴포넌트를 래퍼 없이 직접 사용
- 스타일링: Tailwind CSS v4 + `@seed-design/tailwind4-theme` 토큰 우선

## 2. 자체 젤다 이미지셋 (`public/assets/zelda/`)

외부 저작권 이미지나 게임 스크린샷을 복제하지 않고, 당근 SEED 라이트 톤과 어울리는 자체 제작 3D/일러스트 아이콘을 사용합니다.

| 파일 | 용도 |
| --- | --- |
| `adventure-emblem.png` | 앱 심볼 · 모험 로그인/상태 헤더 |
| `sword-shield.png` | 메인 직행 증강 카드 |
| `fairy-bottle.png` | 안전·생존 준비 증강 카드 |
| `ocarina.png` | 자유 갈래·이동 편의 증강 카드 |
| `hint-fairy.png` | 스포일러 방지 3단계 힌트 |
