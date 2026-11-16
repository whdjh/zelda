# 전 구간 공략 초안 집필 기록

> 아래는 최초 집필 당시 기록이다. 선형 연결·완료 차단·기본 이름 가림 정책은 2026-11-09 ADR-014로 대체했다. 현재 조건 근거는 [06 조사](06-route-network.md)를 따른다.

2026-11-08. 참고 사이트의 실제 장별 본문과 보스 공략을 읽고 자체 한국어로 작성해 앱에 연결했다. 데이터는 [본문](../../content/ocarina-of-time/story.ts), [힌트](../../content/ocarina-of-time/puzzles.ts), [출처 URL](../../content/ocarina-of-time/sources.ts)에 있다. 30개 구간, 31개 문제의 93개 힌트, 21개 보유 조건을 수록했다.

## 수록 범위

| 범위 | 역 ID | 참고 자료 ID |
| --- | --- | --- |
| 출발 준비·첫 던전 | forest-equipment, deku-depths, deku-guardian | gw-opening, gr-opening, gw-deku, zd-deku, gw-gohma |
| 왕성·산·동굴 | royal-meeting, mountain-access, dodongo-tools, dodongo-guardian | gw-castle, zd-dodongo, gw-dodongo, gw-king-dodongo |
| 조라·자부자부 | zora-audience, jabu-rescue, jabu-guardian | gw-jabu, gw-barinade |
| 시대 전환·청년 준비 | time-door, adult-preparation | zd-time, gw-forest, gw-well |
| 숲·불의 신전 | forest-bow, forest-guardian, fire-hammer, fire-guardian | gw-forest, gw-phantom, gw-fire, gw-volvagia |
| 얼음 동굴·물의 신전 | ice-equipment, water-levels, water-guardian | gw-ice, gw-water, gw-morpha |
| 우물·어둠의 신전 | well-lens, shadow-boots, shadow-guardian | gw-well, gw-shadow, gw-bongo |
| 요새·사막 | gerudo-rescue, desert-crossing | gw-gerudo |
| 소년·청년 혼의 신전 | spirit-child, spirit-adult, spirit-guardian | gw-spirit, gw-twinrova |
| 최종 성·탈출·엔딩 | castle-barriers, tower-escape, final-battle | gw-ganon-castle, gw-ganondorf, gw-ganon |

본문은 목표를 따라가는 압축된 스토리 초안이다. 모든 방의 상세 지도, 수집 100%, 미니게임 전수, 대체 순서·동선의 우열까지 검증한 완성본으로 보고하지 않는다. 말·목장과 우물의 추가 수집 같은 선택 콘텐츠를 엔딩 필수 조건으로 끌어들이지 않았다.

## 출처와 상태

- GameWith의 Switch 2판 장별 글과 별도 보스 글을 참고했다. 같은 편집처의 두 글은 독립적인 두 근거로 세지 않는다.
- Zelda Dungeon Wiki는 첫 던전·동굴·시간의 신전 본문을 열람했다. 숲의 신전 페이지는 당시 선택 콘텐츠 일부만 작성돼 있어 전체 던전의 독립 검증 출처로 쓰지 않았다. 자부자부 Wiki URL은 403으로 열리지 않아 근거로 추가하지 않았다.
- GamesRadar+는 시작 장비 관련 본문에 사용했다. OoT Guide는 GameWith/Nintendúo를 재정리한 계보가 있어 별도 독립 근거로 세지 않았다.
- 전 구간의 상태는 proposed다. 서로 일치하는 일부 사실이 있어도 구간 전체가 교차 검증된 것으로 승격하지 않았다. 직접 플레이, 공식 한국어 표기, 실측 시간·실패율은 확인하지 않았다.
- 문장과 단계별 힌트는 자체 작성했다. 원자료의 이미지·지도·영상·문장을 복제하지 않았다.

## 발견한 충돌과 판본 주의

- 딘의 불꽃 위치: GameWith 동굴 장별 글과 Zelda Dungeon Switch 2 동굴 글은 산 정상의 샘·25루피로 일치한다. GameWith 바리네이드 글에는 성의 샘이라고 적혀 있다. 이 초안은 판본을 명시한 두 장별 글을 우선하고 충돌을 본문에도 표시했다. 실기 확인 전 완전 해소로 처리하지 않는다.
- 새총 뒤 사다리, 잠수 놀이, 숲 지하 눈 스위치, 어둠 석상, 물의 신전 비탈, 최종전 후반은 과거판 지식을 그대로 대입하지 않았다. 해당 판본을 다룬 자료의 절차를 사용하되 직접 재현은 남아 있다.
- 물의 신전의 모든 열쇠 회수와 우회 통로, 숲의 신전의 각 유령 방은 현재 압축 설명이다. 실제 플레이를 따라가며 방별 누락과 막힘을 점검·보강해야 한다.
- 배열의 연결은 선택한 이야기 노선의 선행 관계다. 가능한 모든 던전 순서와 최단 경로를 의미하지 않는다.

## 앱에 반영한 보호

- 요약과 상세 해법을 분리했다. 상세 본문은 버튼을 누른 뒤에만 렌더링하고, 힌트는 공개한 ID만 렌더링한다.
- 현재·다음 목적지와 완료 기록만 기본 공개한다. 보스·미래 역 이름을 잠금 표시에 넣지 않는다.
- 보유 조건이나 시대가 맞지 않아도 현재 목표의 준비 방법을 읽을 수 있다. 완료는 직접 확인한 조건을 통과해야 한다.
- 소년/청년 전환과 아이템 획득은 자동 추정하지 않는다. 기존 시대 필드 없는 백업은 미확인으로 읽는다.

검증 실행 결과는 [현재 상태](../development/02-project-status.md)에 따로 기록한다.
