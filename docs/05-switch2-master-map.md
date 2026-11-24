# Switch 2판 《시간의 오카리나》 마스터 공략 참조 지도

> 기준일: 2026-11-24 (Switch 2 리메이크 출시일: 2026-11-05)
> 검증 방식: GameWith · Game8 · Zelda Wiki · Zelda Central · VGC · 100pguides · 전파미니코게이머 등 복수 출처 + **Claude Code(`WebSearch`) 교차 검증** 반영
> 원칙: 확인된 사실과 **출처 상충·실플레이 미확인 항목**을 명확히 분리한다. 앱 DB(`zhp_cards`)에는 미리 대량 투입하지 않고, 직접 플레이하며 검증된 구간만 1장씩 적립한다.

---

## 1. Switch 2 리메이크 확인된 변경점 (복수 출처 교차 검증 완료)

| 영역 | 원작(N64/3DS) | Switch 2 리메이크 (2026) | 카드·힌트 설계 영향 |
| --- | --- | --- | --- |
| **빈 병 총 개수** | 4개 | **5개 (소년 4 + 성인 1)** | **최속 빈 병은 하이랄 성하마을 약국(벌레 잡기 → 빨간 물약 병)**! 성인기 빅 포우도 10마리 → **5마리**로 완화 |
| **대요정의 샘** | 무료 · 하이랄 성=딘의 불꽃, 데스마운틴=회전베기 | **루피 기부(25/50/100/200/300/500R)** · **데스마운틴=딘의 불꽃(25R), 하이랄 성=회전베기(50R)** | 보상 위치 교체 + **등산로(딘의 불꽃) 선행 방문이 다른 대요정 출현 조건**(GameWith 기준) |
| **지갑 상한** | 99 / 200 / 500 | **200 / 500 / 1000루피** | 초반 루피 여유 확대, 대요정 기부 대비 용이 |
| **시간 전환** | 태양의 노래 필수 | **민가 침대(성하마을 북서쪽 골목 포함)로도 낮/밤 전환 가능** | 태양의 노래는 어디서든 즉시 전환 + 리데드 경직 때문에 여전히 유효 |
| **하이랄 성 말론 알** | 아침 대기 필요 | **성 앞 도착 즉시 수령·아침 대기 없이 부화 완화** | 하이랄 성 잠입 동선 단축 |
| **카카리코 묘지 방패** | 밤 한정 | **소년기·밤에만 꽃 비석 이동 가능** (이미 상점 구매 시 상자 보상 20루피) | 시간 조건 명시 + 소년기 웅크려 방어 단서 병기 |
| **데크나무 스탈튤라** | 회전 타이밍 대기 | **검 타격으로 회전시켜 약점 노출** + 자유 점프·대시·우측 스틱 카메라 | 초반 전투·이동 난이도 완화 |
| **물의 신전** | 부츠 메뉴 반복·동선 난해 | **부츠 전환 간소화 · 수위 조절 지점 지도 표시 · 격자 벽 조정 · 클리어 후 조라의 마을 해빙** | 탐색 스트레스 대폭 감소 *(열쇠 개수 4개 vs 6개는 출처 상충 — 실플레이 확인 필요)* |
| **어둠의 신전** | 장비 교체 번거로움 | **렌즈·부츠 원버튼 장착 · 은 루피 삭제 · 가시 피해 방식 변경** | 장비 전환 부담 감소 |
| **요정 회복량** | 하트 대량 회복 | **병 속 요정 부활 시 하트 5개 회복으로 약화**(리뷰 출처) | 빈 병에 요정 vs 물약/우유 선택 가치 재평가 필요 |
| **만마전(보스 재전)** | 없음 | **성인기 진입 후 소년기 복귀 → 카카리코 방문 시 해금**, 이후 침대에서 입장 | 성인기 중반 이후 선택 콘텐츠 |

### ⚠️ 출처 상충 · 실플레이 확인 필요 항목 (단정 금지)
- **미혹의 숲 경로 표기**: 영문 가이드(`오→왼→오→왼→직진→왼→오`) vs Game8(`왼→왼→직진→왼→오`) 상충 — 실제 플레이로 재확인 필요.
- **물의 신전 작은 열쇠 개수**: Game8/100pguides(4개) vs GameWith 아이템 목록(6개) 상충.
- **빅 포우 선행 조건**: 숲의 신전 클리어 선행 여부(단일 출처).
- **근거 미확인(사실 단정 제외)**: 미혹의 숲 음표 시각 안내, 데크나무 3층 가드레일, 방 재입장 시 몬스터 리스폰 없음, 아킨도 너트 열매, 물의 신전 활 비필수, 어둠의 신전 투명 발판 위 루피, 한국어 정식 명칭 일부(`妖精の落書き` / Fairy Thoughts 등).

---

## 2. 전체 진행 그래프 & 플래그 의존성 (소년기 → 성인기)

### A. 소년기 (정령석 3개 → 시간의 신전)
1. **코키리 숲 출발** (`kokiri-gear`)
   - 획득: `kokiri-sword`, `deku-shield` → 해금: `deku-tree`
   - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/563396`
2. **데크나무님 속** (`deku-tree`, 선형)
   - 획득: `fairy-slingshot`, `kokiri-emerald`, 숲 출구 `fairy-ocarina` → 해금: 하이랄 평원·성하마을
   - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/563395`
3. **하이랄 성하마을 & 하이랄 성 잠입** (`hyrule-castle`, 핵심 분기 게이트)
   - 동시 체크 가능(Switch 2 신규): **성하마을 약국 벌레 잡기 → 빈 병 #1 + 빨간 물약**
   - 획득: `zelda-letter`, `zelda-lullaby`, `talon-awake`
   - ⚠️ **주의**: `사리아의 노래`, `에포나의 노래`, `태양의 노래`, `데스마운틴 등산로`는 모두 하이랄 성 완료 후 해금!
   - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/563310`
4. **하이랄 성 직후 자유 갈래 풀 (비선형 구간 #1)**
   - **메인 직행 · 데스마운틴 & 고론 시티**: `zelda-letter` + `zelda-lullaby` → 다루니아 대면(`goron-city-visited`) → `sarias-song` 필요 → **고론의 팔찌(`goron-bracelet`)**
   - **안전 준비 · 카카리코 생존 & 묘지**: 닭 7마리(빈 병) + 밤 묘지 꽃 비석(무료 하일리아 방패, 소년기 웅크려 방어) + 왕가의 무덤(`zelda-lullaby` → `suns-song`)
   - **노래 선행 · 론론 목장 & 미혹의 숲**: `talon-awake` → 에포나의 노래(`eponas-song`) + 타론 슈퍼 닭(빈 병) / `zelda-letter` → 숲의 성역 `sarias-song` (고론 시티 필수!)
   - GameWith: 도돈고/고론 `https://gamewith.jp/zelda-tokino-ocarina/563393`, 묘지 `https://gamewith.jp/zelda-tokino-ocarina/570653`
5. **도돈고의 동굴** (정령석 #2)
   - 필요: `goron-bracelet`
   - 획득: **폭탄 주머니(`bomb-bag`)**, 고론의 루비
   - **폭탄 획득 직후 열리는 고가치 선택지**:
     - 데스마운틴 등산로 대요정의 샘(**딘의 불꽃**, 25루피) — **다른 대요정 출현의 선행 조건**이자 후반 필수급!
     - 하이랄 성 대요정의 샘(**회전베기**, 50루피)
   - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/563393`
6. **조라의 강 → 조라의 마을 → 하일리아 호수 → 자부자부님 뱃속** (정령석 #3)
   - 필요: `bomb-bag` (조라의 강 입구 바위), `zelda-lullaby` (폭포 개방)
   - 흐름: 조라의 마을 다이빙 → **은 비늘(`silver-scale`)** → 하일리아 호수 **루토의 편지(빈 병)** → 킹 조라 → 물고기 → 자부자부님 뱃속 → **부메랑**, 조라의 사파이어
   - 선택(폭탄+자장가+선행 대요정): 조라의 샘 대요정(**프롤의 바람**, 100루피)
   - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/563392`
7. **시간의 신전 (성인기 전환)**
   - 필요: 정령석 3개 → 하이랄 성 해자 이벤트 → **시간의 오카리나** + **시간의 노래(`song-of-time`)** → 마스터 소드 → **성인기 진입**
   - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/587159`

---

### B. 성인기 (현자 메달 & 자유 갈래 구간 #2)
1. **성인기 초반 준비 (필수 + 초고가치 편의)**
   - **카카리코 묘지 단페 레이스 → 훅샷(`hookshot`)** (필수)
   - **론론 목장 에포나 획득** (`eponas-song` 보유 시)
   - **고론 시티 → 내열 옷(`goron-tunic`)**, **조라의 마을 → 조라의 옷(`zora-tunic`)**
   - **선택 최강 무기**: **빅고론도(대고론의 검)** 물물교환
2. **초·중반 3대 신전 (비선형 가능 구간 — Game8 기준 훅샷 획득 후 숲·불·물 순서 변경 가능)**
   - **숲의 신전**: `hookshot` + `sarias-song` → **요정의 활(`fairy-bow`)**, 숲의 메달. *(클리어 후 시간의 신전에서 소년기↔성인기 자유 왕복 해금!)*
     - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/563391`
   - **불의 신전**: `goron-tunic` + `hookshot` (활 보조) → **메가톤 해머(`megaton-hammer`)**, 불의 메달
     - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/563390`
   - **얼음 동굴 → 물의 신전**:
     - 얼음 동굴: 빈 병으로 푸른 불 운반 → **헤비 부츠(`iron-boots`)**, 물의 세레나데
     - 물의 신전: `iron-boots` + `zora-tunic` + `hookshot` + 활(GameWith 기준 눈 스위치 존재) → **롱샷(`longshot`)**, 물의 메달 + **조라의 마을 해빙**
     - GameWith: 얼음 `https://gamewith.jp/zelda-tokino-ocarina/563389`, 물 `https://gamewith.jp/zelda-tokino-ocarina/563388`
3. **우물 밑 & 후반 2대 신전**
   - **카카리코 우물 밑 (숲 신전 완료 → 소년기 복귀 필요)**:
     - 성인기 풍차 **폭풍의 노래(`song-of-storms`)** → 소년기 복귀 후 우물 물 빼기 → **진실의 렌즈(`lens-of-truth`)**
     - *(소년기 복귀 시 카카리코 방문으로 만마전도 해금)*
     - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/563387`
   - **어둠의 신전**: 숲·불·물 완료 후 카카리코 이벤트(`nocturne-of-shadow`) + `dins-fire` + `lens-of-truth` → **호버 부츠(`hover-boots`)**, 어둠의 메달
     - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/563386`
   - **게르도 요새 → 환멸의 사막 → 혼의 신전**:
     - 게르도 요새: `epona` 또는 `longshot` → 목수 구출 → 게르도 회원증 (`https://gamewith.jp/zelda-tokino-ocarina/563385`)
     - 혼의 신전: 성인기 입구 `requiem-of-spirit` → 소년기 구간(**은의 글러브**) → 성인기 구간(**미러 실드**) → 혼의 메달 (`https://gamewith.jp/zelda-tokino-ocarina/563384`)
4. **최종 결전 · 가논 성**
   - 필요: 5신전 메달(빛의 화살 수령) + 추천 준비: **가논 성 대요정(방어력 2배, 500루피)**, **데스마운틴 분화구 대요정(마력 2배, 200루피)**, 빈 병 회복 아이템
   - GameWith: `https://gamewith.jp/zelda-tokino-ocarina/563383`

---

## 3. 고가치 선택 카드 풀 요약 (100% 수집 제외)

### 빈 병 5개 (Switch 2판 검증 완료)
1. **하이랄 성하마을 약국** (소년기 · 최속 · Switch 2 신규): 벌레 잡기 → 빈 병 + 빨간 물약
2. **론론 목장** (소년기 · `talon-awake` 후): 타론 슈퍼 닭 3마리(10루피) → 빈 병 + 우유
3. **카카리코 마을** (소년기): 닭 7마리 모으기 → 빈 병
4. **하일리아 호수** (소년기 · `silver-scale` 후): 루토의 편지 → 킹 조라 전달 → 빈 병
5. **성하마을 폐허 고스트 숍** (성인기 · `epona` + `fairy-bow` 권장): 빅 포우 **5마리** → 빈 병

### 대요정의 샘 6곳 (Switch 2판 · 루피 기부 필수 · 등산로 선행)
1. 데스마운틴 등산로 (소년 · 폭탄 · **선행**): **딘의 불꽃** — 25루피
2. 하이랄 성 (소년 · 폭탄): **회전베기** — 50루피
3. 조라의 샘 (소년 · 폭탄): **프롤의 바람** — 100루피
4. 데스마운틴 분화구 (성인 · 해머): **마력 2배** — 200루피
5. 거대 사신상 (성인 · 폭탄): **넬의 사랑** — 300루피
6. 가논 성 (성인 · 금의 글러브): **방어력 2배** — 500루피

---

## 4. GameWith 단일 참조 URL 인덱스
- 스토리 차트 전체: `https://gamewith.jp/zelda-tokino-ocarina/563310`
- Switch 2 리메이크 변경점: `https://gamewith.jp/zelda-tokino-ocarina/586513`
- 대요정의 샘(루피·위치): `https://gamewith.jp/zelda-tokino-ocarina/563324`
- 카카리코 묘지: `https://gamewith.jp/zelda-tokino-ocarina/570653`
- 하일리아 방패: `https://gamewith.jp/zelda-tokino-ocarina/586651`
- 시간 전환(침대·태양의 노래): `https://gamewith.jp/zelda-tokino-ocarina/586397`
- 오프닝: `https://gamewith.jp/zelda-tokino-ocarina/563396`
- 데크나무님 속: `https://gamewith.jp/zelda-tokino-ocarina/563395`
- 도돈고의 동굴: `https://gamewith.jp/zelda-tokino-ocarina/563393`
- 자부자부님 뱃속: `https://gamewith.jp/zelda-tokino-ocarina/563392`
- 시간의 신전: `https://gamewith.jp/zelda-tokino-ocarina/587159`
- 숲의 신전: `https://gamewith.jp/zelda-tokino-ocarina/563391`
- 불의 신전: `https://gamewith.jp/zelda-tokino-ocarina/563390`
- 얼음 동굴: `https://gamewith.jp/zelda-tokino-ocarina/563389`
- 물의 신전: `https://gamewith.jp/zelda-tokino-ocarina/563388`
- 우물 밑: `https://gamewith.jp/zelda-tokino-ocarina/563387`
- 어둠의 신전: `https://gamewith.jp/zelda-tokino-ocarina/563386`
- 게르도 요새: `https://gamewith.jp/zelda-tokino-ocarina/563385`
- 혼의 신전: `https://gamewith.jp/zelda-tokino-ocarina/563384`
- 가논 성: `https://gamewith.jp/zelda-tokino-ocarina/563383`
