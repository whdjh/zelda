# 경로 재구성을 위한 조건 조사

조사일: 2026-11-09. 대상: oot-switch2-2026. 기존 30역·31문제 전체 공략에 연결할 조건을 조사했다. 인터넷 자료 전체 수집 완료나 모든 순서의 플레이 검증을 뜻하지 않는다. 모든 연결은 proposed이며, 실측 시간·최단 보장은 없다.

## 자료와 사실 단위 정리

| 사실 / 관찰 | 확인한 본문 | 적용 / 한계 |
| --- | --- | --- |
| 청년 조라의 샘에서 얼음 발판으로 동굴 접근, 병으로 푸른 불 운반 | [GameWith 얼음](https://gamewith.jp/zelda-tokino-ocarina/563389), [Nintendo Life 얼음](https://www.nintendolife.com/guides/zelda-ocarina-of-time-ice-cavern-walkthrough-switch-2) | 불 신전 완료를 진입 조건으로 설명하지 않는다. 시간의 문 + 병으로 분리하는 것은 조건 설명으로부터의 추론이며 대체 순서 실기 미검증 |
| 고론 시티 대화·내열 옷·훅샷으로 불 신전 접근 | [GameWith 불](https://gamewith.jp/zelda-tokino-ocarina/563390), [Nintendo Life 불](https://www.nintendolife.com/guides/zelda-ocarina-of-time-fire-temple-walkthrough-switch-2) | 숲 보스와 분리. 기존 본문의 눈 스위치 때문에 활 조건은 보수적으로 유지. 활 없는 완주를 보장하지 않음 |
| 수중 장비와 훅샷으로 물 신전 입장, 내부 활 사용 | [GameWith 물](https://gamewith.jp/zelda-tokino-ocarina/563388), [Nintendo Life 물](https://www.nintendolife.com/guides/zelda-ocarina-of-time-water-temple-walkthrough-switch-2) | 얼음 준비와 숲의 활 획득 경유를 연결. 불 신전 클리어와 분리한 것은 추론 |
| 숲 신전 뒤 시대 복귀, 폭풍의 노래로 우물 진행 | [GameWith 우물](https://gamewith.jp/zelda-tokino-ocarina/563387), [FinalBoss 곡](https://finalboss.io/zelda-oot-switch-2-ocarina-songs) | 우물의 선행 역을 물 보스에서 숲 보스로 수정 |
| 어둠 진입곡의 사건은 숲·불·물 진행 이후 | [FinalBoss 곡](https://finalboss.io/zelda-oot-switch-2-ocarina-songs), [GameWith 어둠](https://gamewith.jp/zelda-tokino-ocarina/563386) | 세 신전 합류. GameWith는 사건의 정확한 발동 조건을 열거하지 않으므로 독립 교차 검증 완료로 표시하지 않음 |
| 요새의 다리는 에포나 또는 롱샷, 사막은 통행 후 렌즈 사용 | [GameWith 요새](https://gamewith.jp/zelda-tokino-ocarina/563385), [GameWith 혼](https://gamewith.jp/zelda-tokino-ocarina/563384) | 현재 실행 경로는 롱샷 유지. 에포나 입장 후 요새 내부의 롱샷 없는 동선은 후보만 등록 |
| 혼의 신전은 소년/청년 구간과 귀환곡을 이용 | [GameWith 혼](https://gamewith.jp/zelda-tokino-ocarina/563384) | 어둠 보스가 아닌 사막·시대 복귀·보유 조건과 연결. 혼/어둠 역순 전체 재현은 미검증 |
| 최종 성에서 현자들의 다리, 여섯 결계가 탑을 차단 | [GameWith 최종 성](https://gamewith.jp/zelda-tokino-ocarina/563383) | 신전 경로 합류와 결계 → 탑 → 엔딩. 성 내부 6개 분기 분할은 후속 |
| 산 정상 샘에서 폭탄으로 진입해 딘의 불꽃 습득 | [Nintendo Life 샘](https://www.nintendolife.com/guides/zelda-ocarina-of-time-great-fairy-fountain-locations-all-switch-2) | 기존 충돌에 독립 자료 추가. 보스 완료가 마법 자동 획득을 뜻하지 않음 |

## 보존할 팁과 판단 기준

- 얼음 동굴에서 병이 여러 개면 푸른 불 재충전 왕복을 줄일 수 있다(Nintendo Life 얼음). 추가 병을 구하는 비용까지 비교하지 않았으므로 필수 경유로 만들지 않는다.
- 불 신전의 허수아비 노래는 추가 수집에 유용하지만 선택 사항이다(Nintendo Life 불). 엔딩의 필수 조건으로 넣지 않는다.
- 물 신전의 딘의 불꽃은 특정 전투에 유용하다는 안내다(Nintendo Life 물). 해당 던전 입장 필수 조건으로 만들지 않는다.
- 에포나로 요새 다리를 넘는 대안은 확인했다(GameWith 요새). 현재 본문은 롱샷을 이용하는 감옥 탈출을 설명하므로 입장 대안과 내부 완주 가능성을 구분한다.

## 관리 위치와 갱신 순서

- 출처: `content/ocarina-of-time/sources.ts`. 추가된 Nintendo Life 4개와 FinalBoss 1개는 본문을 열람했다. 같은 편집처의 여러 페이지를 독립 출처로 세지 않는다.
- 조건: `content/ocarina-of-time/routes.ts`. 각 역마다 `before`, `rewards`, `sources`, `note`를 명시한다. 배열의 앞 원소를 필수 조건으로 쓰지 않는다.
- 상황별 팁: `tips.ts`의 4개 항목. 역 ID·자체 문장·출처·판본·초안 상태를 묶고 콘텐츠 검사에서 참조를 검증한다.
- 기존 목표·본문·힌트: `story.ts`, `puzzles.ts`. 최초 집필 범위는 [05 기록](05-oot-story-draft.md)을 따른다. 이번에 모든 방의 본문을 재검수한 것은 아니다.
- `before`는 현재 안내 경로의 이벤트/구간 조건, 기존 `prerequisiteItemIds`는 보유 조건이다. 보유가 확인된 장비의 획득 경유를 제거할 수 있지만, 해당 역을 자동 완료하지 않는다.
- `rewards`는 그 구간에서 확인할 수 있는 획득물 목록이지 완료 보상이 자동 지급된다는 뜻이 아니다. 롱샷처럼 보스 전에 획득한 장비도 따로 체크한다.
- 추가 자료 발견 → 동일 사실의 판본/출발 상태 비교 → 충돌 기록 → 규칙 수정 → 케이스 회귀 테스트 → 플레이 기록 후에만 검증 승격.

## 조사 후보와 제외 근거

- N64판 [퍼즐 의존관계 분석](https://icewyrmgames.github.io/examples/the-puzzle-structure-of-ocarina-of-time/) 및 커뮤니티의 대체 순서는 조사 후보다. 현 판본에서 활 없는 불/물 완주, 조라 선행, 렌즈 생략 등을 검증한 것으로 사용하지 않는다.
- Zelda Dungeon 얼음·어둠 추가 페이지는 이번 열람에서 403/접근 실패. 읽은 출처로 등록하지 않았다.
- 사용자 추천 영상 채널의 개별 영상·타임스탬프는 이번에 확인하지 못했다.
- 미완료: 에포나 대안의 전체 내부 동선, 장비 대체 OR 조건, 필수/권장 장비 세분화, 방별 위치·워프 이동 비용, 시간·실패율 측정, 모든 대체 순서 실기 재현, 최종 성 내부 분할, 100% 수집.

## 검증할 실제 케이스

1. 시간의 문 완료 후 얼음 동굴을 먼저 선택한다.
2. 숲의 활은 보유했지만 숲 보스는 미완료인 상태로 불/물 준비를 본다.
3. 숲 신전만 완료하고 소년으로 돌아와 우물 경로를 확인한다.
4. 어둠 보스 미완료 상태에서 롱샷·렌즈를 갖고 사막 방면을 선택한다.
5. 후반 역만 완료 기록한 사용자에게 과거 역을 자동 완료하거나 처음부터 강요하지 않는다.
6. 보유 취소/완료 취소/목적지 변경 때 경유와 합류를 재계산한다.
7. 준비 역은 완료했으나 획득물 체크가 없는 경우 장비 확인 안내를 남긴다.

위 케이스는 소프트웨어 규칙 검사와 게임 플레이 재현을 구분해 기록한다.
