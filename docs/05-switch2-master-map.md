# Switch 2판 《시간의 오카리나》 마스터 공략 참조 지도

> 기준일: 2026-11-24 (Switch 2 리메이크 출시일: 2026-11-05)
> 검증 방식: **GameWith 원문 HTML 직접 대조(`586513`, `563324`, `563388`, `563394`, `570659` 등 30개 페이지 HTTP 200 확인)** + Game8 · VGC · Zelda Wiki + Claude Code 교차 검증
> 원칙: 1차 원문으로 확인된 사실과 출처 상충·실플레이 확인 항목을 분리한다. 앱 DB(`zhp_cards`)에는 미리 대량 투입하지 않고, 직접 플레이하며 검증된 구간만 1장씩 적립한다.

---

## 1. Switch 2 리메이크 핵심 변경점 (GameWith `586513` 등 1차 원문 확인)

| 영역 | 원작(N64/3DS) | Switch 2 리메이크 (2026) | 카드·힌트 설계 영향 |
| --- | --- | --- | --- |
| **점프·대시 조작** | 단차 끝 자동 점프 | **자동 점프 폐지 → `X` 수동 점프 / 구르기 후 `A` 길게 대시** | 모든 던전·필드 발판 이동 안내의 기본 전제 |
| **빈 병 총 개수** | 4개 | **5개 (소년 4 + 성인 1)** | **최속 빈 병은 하이랄 성하마을 약국(벌레 잡기 → 빨간 물약 병)**, 성인기 빅 포우도 10마리 → **5마리**로 완화 |
| **대요정의 샘** | 무료 · 하이랄 성=딘, 등산로=회전베기 | **루피 기부(25/50/100/200/300/500R)** · **등산로=딘의 불꽃(25R), 하이랄 성=회전베기(50R)** | 보상 위치 교체 + **등산로(딘의 불꽃) 입수 후 다른 대요정 출현**(`563324` 원문) |
| **회전베기** | 마력 소모 | **마력 무소모** (`586513` 원문) | 하이랄 성 대요정(50R) 보상 가치 대폭 상승 |
| **지갑 상한** | 99 / 200 / 500 | **200 / 500 / 1000루피** | 초반 루피 여유 확대, 대요정 기부 대비 용이 |
| **시간 흐름·전환** | 마을 내 정지 · 밤 도개교 폐쇄 | **마을 내에서도 시간 흐름 · 밤에도 성하마을 출입 가능 · 민가 침대 낮/밤 전환** | 성하마을 야간 대기 삭제, 묘지 밤 맞추기 수월 |
| **하이랄 성 말론 알** | 타론 확인·아침 대기 필요 | **성 도착 즉시 알 수령·아침 대기 없이 부화** (`586513` 원문) | 하이랄 성 잠입 동선 단축 |
| **데크나무 내부** | 데크너츠 반사 즉사 · 촛대 2개 | **데크너츠 반사 후 직접 타격 필요 · 일부 방 촛대 3개 · 스탈튤라 타격 회전** | 초반 전투 힌트 작성 시 주의 |
| **조라 다이빙 게임** | 루피 줍기 | **비늘 5개 줍기 규칙** (`586513` 원문) | 은 비늘 획득 안내 시 반영 |
| **고열 지역·용암** | 제한시간 타이머 · 용암 보행 가능 | **타이머 폐지 → 지속 데미지 / 불의 신전 용암 즉시 침강** | 내열 옷(`goron-tunic`) 중요도 상승 |
| **물의 신전** | 중앙 탑 수중 작은 열쇠(총 6개) · 얼어붙은 조라 | **중앙 탑 수중 보상=황금 스탈튤라(실제 차트 열쇠 4개) · 클리어 후 조라의 마을 해빙** | 보스 열쇠 루트 눈 스위치 때문에 **요정의 활은 여전히 필수**(`563388` 원문) |
| **빅고론도 안약 길** | 바위 옆 점프 우회 가능 | **데스마운틴 분화구 바위를 메가톤 해머로 파괴해야 통과** (`586513` 원문) | 불의 신전 해머 획득 이후 진행 권장 |
| **신규 도움 기능** | 없음 | **아킨도 너트 열매(던전 내 상인 호출) · 요정의 마음(푸른 낙서 힌트) · 시간의 궤적 · ZELDA NOTES** | `586513` 원문 확인 완료 |
| **세이브** | 3슬롯 · 집/던전 입구 재개 | **1슬롯 + 오토세이브 · 저장한 자리에서 즉시 재개** | 중단·재개 동선 손실 없음 |

### ⚠️ 출처 상충 · 실플레이 확인 메모
- **만마전(보스 재전) 해금 시점**: GameWith(`586513`)는 *"숲의 신전 클리어 후 시간의 신전에서 시크와 대화한 뒤 침대에서 수면"*, Game8(`840132`)은 *"성인기 진입 후 소년기 복귀해 카카리코 방문 후 침대"*로 서술 — 소년기 복귀 자체가 숲의 신전 클리어 후 해금되므로 시점은 사실상 동일하나 정확한 트리거는 실플레이로 확인.
- **미혹의 숲 경로(상충 원인 규명 완료)**:
  - **코키리 숲 입구 출발(7칸)**: `오른쪽 → 왼쪽 → 오른쪽 → 왼쪽 → 직진 → 왼쪽 → 오른쪽`
  - **고론 시티 2층 지름길 출발(5칸)**: `왼쪽 → 왼쪽 → 직진 → 왼쪽 → 오른쪽`
- **요정 부활 회복량**: 병 속 요정 부활 시 하트 5개 회복으로 약화(리뷰 출처, 실플레이 확인 권장).

---

## 2. 전체 진행 그래프 & 플래그 의존성 (소년기 → 성인기)

### A. 소년기 (정령석 3개 → 시간의 신전)
1. **코키리 숲 출발** (`kokiri-gear`)
   - 획득: `kokiri-sword`, `deku-shield` → 해금: `deku-tree`
   - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/563396`
2. **데크나무님 속** (`deku-tree`, 선형)
   - 핵심: `X` 수동 점프, 3층→1층 거미줄 낙하, 데크너츠 반사 후 직접 공격
   - 획득: `fairy-slingshot`, `kokiri-emerald`, 숲 출구 `fairy-ocarina` → 해금: 하이랄 평원·성하마을
   - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/563395`
3. **하이랄 성하마을 & 하이랄 성 잠입** (`hyrule-castle`, 핵심 분기 게이트)
   - 동시 체크 가능(Switch 2 신규): **성하마을 약국 벌레 잡기 → 빈 병 #1 + 빨간 물약** (밤에도 성하마을 출입 가능)
   - 획득: `zelda-letter`, `zelda-lullaby`, `talon-awake`
   - ⚠️ **주의**: 카카리코 마을 자체(닭 7마리·밤 묘지 방패)는 평원 직후에도 갈 수 있으나, **`사리아의 노래`, `에포나의 노래`, `태양의 노래`, `데스마운틴 등산로`는 모두 하이랄 성 완료 후 해금!**
   - GameWith: 하이랄 성 `https://gamewith.jp/zelda-tokino-ocarina/563394`, 경비병 회피 `https://gamewith.jp/zelda-tokino-ocarina/563319`, 성하마을 `https://gamewith.jp/zelda-tokino-ocarina/570655`
4. **하이랄 성 직후 자유 갈래 풀 (비선형 구간 #1)**
   - **메인 직행 · 데스마운틴 & 고론 시티**: `zelda-letter` + `zelda-lullaby` → 다루니아 대면(`goron-city-visited`) → `sarias-song` 필요 → **고론의 팔찌(`goron-bracelet`)**
   - **안전 준비 · 카카리코 생존 & 묘지**: 닭 7마리(빈 병) + 밤 묘지 꽃 비석(무료 하일리아 방패, 소년기 웅크려 방어) + 왕가의 무덤(`zelda-lullaby` → `suns-song`)
   - **노래 선행 · 론론 목장 & 미혹의 숲**: `talon-awake` → 에포나의 노래(`eponas-song`) + 타론 슈퍼 닭(10루피, 빈 병) / `zelda-letter` → 숲의 성역 `sarias-song` (고론 시티 필수!)
   - GameWith: 고론 시티 `https://gamewith.jp/zelda-tokino-ocarina/570651`, 카카리코 `https://gamewith.jp/zelda-tokino-ocarina/570654`, 묘지 `https://gamewith.jp/zelda-tokino-ocarina/570653`, 론론 목장 `https://gamewith.jp/zelda-tokino-ocarina/570656`, 미혹의 숲 `https://gamewith.jp/zelda-tokino-ocarina/570659`
5. **도돈고의 동굴** (정령석 #2)
   - 필요: `goron-bracelet`
   - 획득: **폭탄 주머니(`bomb-bag`)**, 고론의 루비 *(Switch 2판은 일반 도돈고도 폭탄 삼키기 처치 가능)*
   - **폭탄 획득 직후 열리는 고가치 선택지**:
     1. 데스마운틴 등산로 대요정(**딘의 불꽃**, 25루피) — **다른 모든 대요정 출현의 선행 조건**이자 후반 필수!
     2. 하이랄 성 대요정(**회전베기**, 50루피, 마력 무소모) — `dins-fire` 선행 필요
   - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/563393`, 대요정 `https://gamewith.jp/zelda-tokino-ocarina/563324`
6. **조라의 강 → 조라의 마을 → 하일리아 호수 → 자부자부님 뱃속** (정령석 #3)
   - 필요: `bomb-bag` (조라의 강 입구 바위), `zelda-lullaby` (폭포 개방)
   - 흐름: 조라의 마을 다이빙(비늘 5개 줍기) → **은 비늘(`silver-scale`)** → 하일리아 호수 **루토의 편지(빈 병)** → 킹 조라 → 물고기 → 자부자부님 뱃속 → **부메랑**, 조라의 사파이어
   - 선택(`bomb-bag` + `dins-fire`): 조라의 샘 대요정(**프롤의 바람**, 100루피)
   - GameWith: 조라의 마을 `https://gamewith.jp/zelda-tokino-ocarina/570648`, 자부자부 `https://gamewith.jp/zelda-tokino-ocarina/563392`
7. **시간의 신전 (성인기 전환)**
   - 필요: 정령석 3개 → 하이랄 성 해자 이벤트 → **시간의 오카리나** *(Switch 2판은 요정의 오카리나도 인벤토리에 유지)* + **시간의 노래(`song-of-time`)** → 마스터 소드 → **성인기 진입**
   - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/587159`

---

### B. 성인기 (현자 메달 & 자유 갈래 구간 #2)
1. **성인기 초반 준비 (필수 + 초고가치 편의)**
   - **카카리코 묘지 단페 레이스 → 훅샷(`hookshot`)** (필수)
   - **론론 목장 에포나 획득** (`eponas-song` 보유 시 · `https://gamewith.jp/zelda-tokino-ocarina/563329`)
   - **고론 시티 → 내열 옷(`goron-tunic`)**, **조라의 마을/얼음 → 조라의 옷(`zora-tunic`)**
2. **초·중반 3대 신전 (진입 순서 유연, 완주 기준 권장: 숲 → 불 ↔ 물)**
   - **숲의 신전**: `hookshot` + `sarias-song` → **요정의 활(`fairy-bow`)**, 숲의 메달 *(북서 방 리프트 추가·그림 퍼즐 개편, 클리어 후 **소년기↔성인기 왕복** 및 **만마전** 해금)*
     - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/563391`
   - **불의 신전**: `goron-tunic` + `hookshot` (지도 상자만 활 사용, 본편 완주는 활 없이도 가능) → **메가톤 해머(`megaton-hammer`)**, 불의 메달
     - 해머 획득 후 고가치 선택지: **데스마운틴 분화구 대요정(마력 2배, 200R)** + **빅고론도 물물교환**(`https://gamewith.jp/zelda-tokino-ocarina/563323`, 분화구 안약 루트에 해머 필요!)
     - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/563390`
   - **얼음 동굴 → 물의 신전**:
     - 얼음 동굴: 빈 병으로 푸른 불 운반 → **헤비 부츠(`iron-boots`)**, 물의 세레나데 (`https://gamewith.jp/zelda-tokino-ocarina/563389`)
     - 물의 신전: `iron-boots` + `zora-tunic` + `hookshot` + **`fairy-bow` 필수**(보스 열쇠 루트 눈 스위치) → **롱샷(`longshot`)**, 물의 메달 + **조라의 마을 해빙** (`https://gamewith.jp/zelda-tokino-ocarina/563388`)
3. **우물 밑 & 후반 2대 신전 (어둠 ↔ 영혼 순서 유연)**
   - **카카리코 우물 밑 (숲 신전 완료 → 소년기 복귀 필수)**:
     - 성인기 풍차 **폭풍의 노래(`song-of-storms`)** → 소년기 복귀 후 우물 물 빼기 → **진실의 렌즈(`lens-of-truth`)**
     - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/563387`
   - **어둠의 신전**: 숲·불·물 완료 후 카카리코 이벤트(`nocturne-of-shadow`) + `dins-fire` + `lens-of-truth` + `fairy-bow` → **호버 부츠(`hover-boots`)**, 어둠의 메달
     - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/563386`
   - **게르드의 요새 → 환영의 사막 → 영혼(혼)의 신전**:
     - 게르드의 요새: `epona` 또는 `longshot` → 목수 4명 구출 → 게르드의 회원증 (`https://gamewith.jp/zelda-tokino-ocarina/563385`)
     - 환영의 사막: 유사 강(`longshot` 또는 `hover-boots`) + 유령 안내인(`lens-of-truth`) → 거대 사신상 입구 `requiem-of-spirit` + 선택 대요정(**넬의 사랑**, 300R)
     - 영혼의 신전: 소년기 구간(**은 글러브**) → 성인기 구간(**미러 실드**) → 혼의 메달 (`https://gamewith.jp/zelda-tokino-ocarina/563384`)
4. **최종 결전 · 가논 성**
   - 필요: 현자 6메달(빛의 화살 수령) → 내부 어둠의 결계에서 **금 글러브(`golden-gauntlets`)** 획득 시 성 외부 대요정(**방어력 2배**, 500R) 해방 가능 → 6결계 해제 → 가논 토벌
   - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/563383`

---

## 3. 고가치 선택 카드 풀 요약 (100% 수집 제외)

### 빈 병 5개 (Switch 2판)
1. **하이랄 성하마을 약국** (소년 · 최속 · Switch 2 신규): 벌레 잡기 → 빈 병 + 빨간 물약
2. **론론 목장** (소년 · `talon-awake` 후): 타론 슈퍼 닭 3마리(10루피) → 빈 병 + 우유
3. **카카리코 마을** (소년): 닭 7마리 모으기 → 빈 병
4. **하일리아 호수** (소년 · `silver-scale` 후): 루토의 편지 → 킹 조라 전달 → 빈 병
5. **성하마을 고스트 숍** (성인 · 에포나로 울타리 점프 시 출현 `586513` 원문): 빅 포우 **5마리** → 빈 병 (`https://gamewith.jp/zelda-tokino-ocarina/563322`)

### 대요정의 샘 6곳 (Switch 2판 · 루피 기부 필수 · 1번 선행 필수)
1. 데스마운틴 등산로 (소년 · 폭탄 · **선행 필수**): **딘의 불꽃** — 25루피
2. 하이랄 성 (소년 · 폭탄 + 1번 완료): **회전베기(마력 무소모)** — 50루피
3. 조라의 샘 (소년 · 폭탄 + 1번 완료): **프롤의 바람** — 100루피
4. 데스마운틴 분화구 (성인 · 해머 + 1번 완료): **마력 2배** — 200루피
5. 거대 사신상 (성인 · 폭탄 + 1번 완료): **넬의 사랑** — 300루피
6. 가논 성 외부 (성인 · 금 글러브 + 1번 완료): **방어력 2배** — 500루피

---

## 4. GameWith 단일 참조 URL 인덱스 (전수 HTTP 200 확인 완료)
- 스토리 차트 전체: `https://gamewith.jp/zelda-tokino-ocarina/563310`
- Switch 2 신요소·변경점: `https://gamewith.jp/zelda-tokino-ocarina/586513`
- 오프닝: `https://gamewith.jp/zelda-tokino-ocarina/563396`
- 데크나무님 속: `https://gamewith.jp/zelda-tokino-ocarina/563395`
- 하이랄 성 잠입: `https://gamewith.jp/zelda-tokino-ocarina/563394`
- 경비병 회피: `https://gamewith.jp/zelda-tokino-ocarina/563319`
- 성하마을: `https://gamewith.jp/zelda-tokino-ocarina/570655`
- 카카리코 마을: `https://gamewith.jp/zelda-tokino-ocarina/570654`
- 카카리코 묘지: `https://gamewith.jp/zelda-tokino-ocarina/570653`
- 하일리아 방패: `https://gamewith.jp/zelda-tokino-ocarina/586651`
- 시간 전환(침대·태양의 노래): `https://gamewith.jp/zelda-tokino-ocarina/586397`
- 론론 목장: `https://gamewith.jp/zelda-tokino-ocarina/570656`
- 미혹의 숲: `https://gamewith.jp/zelda-tokino-ocarina/570659`
- 숲의 성역: `https://gamewith.jp/zelda-tokino-ocarina/570658`
- 고론 시티: `https://gamewith.jp/zelda-tokino-ocarina/570651`
- 도돈고의 동굴: `https://gamewith.jp/zelda-tokino-ocarina/563393`
- 조라의 마을: `https://gamewith.jp/zelda-tokino-ocarina/570648`
- 자부자부님 뱃속: `https://gamewith.jp/zelda-tokino-ocarina/563392`
- 시간의 신전: `https://gamewith.jp/zelda-tokino-ocarina/587159`
- 숲의 신전: `https://gamewith.jp/zelda-tokino-ocarina/563391`
- 불의 신전: `https://gamewith.jp/zelda-tokino-ocarina/563390`
- 얼음 동굴: `https://gamewith.jp/zelda-tokino-ocarina/563389`
- 물의 신전: `https://gamewith.jp/zelda-tokino-ocarina/563388`
- 우물 밑: `https://gamewith.jp/zelda-tokino-ocarina/563387`
- 어둠의 신전: `https://gamewith.jp/zelda-tokino-ocarina/563386`
- 게르드의 요새: `https://gamewith.jp/zelda-tokino-ocarina/563385`
- 영혼(혼)의 신전: `https://gamewith.jp/zelda-tokino-ocarina/563384`
- 가논 성: `https://gamewith.jp/zelda-tokino-ocarina/563383`
- 대요정의 샘: `https://gamewith.jp/zelda-tokino-ocarina/563324`
- 에포나 입수: `https://gamewith.jp/zelda-tokino-ocarina/563329`
- 빅고론도 물물교환: `https://gamewith.jp/zelda-tokino-ocarina/563323`
- 빅 포우: `https://gamewith.jp/zelda-tokino-ocarina/563322`
