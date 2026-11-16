# 공략·상태 데이터 구조

> 데이터 스키마는 **시오 한 작품의 검증된 필요만** 충족시킨다. 여러 게임 범용 엔진을 미리 만들지 않는다.

## 모델 분리

- **공략 사실**: 스토리 역/아이템·시대·이벤트 선행 조건/퍼즐/문장/출처/판본.
- **노선 표현**: 선과 역의 화면 배치·분기; 공략 데이터 그 자체와 분리.
- **사용자 데이터**: 완료 체크/획득 조건/힌트 공개/스포일러 설정. 이 데이터는 게임 사실을 바꾸지 않음.

## 구현 기준

- `Verification.guideSourceId`는 앱에서 여는 GameWith 참고 공략이다. `sourceIds`는 실제 집필·교차조사 근거로 별도 보존한다. 참고 링크 통일로 사실의 출처나 검증 상태를 바꾸지 않는다.

- 실제 타입: [content.ts](../../src/lib/content.ts), [progress-storage.ts](../../src/lib/progress-storage.ts).
- 정적 데이터: [시오 진입점](../../content/ocarina-of-time/index.ts), 현재 `oot-draft-1` / `oot-switch2-2026`. 30개 역·31개 문제·21개 보유 조건이 있다. 본문/힌트/출처/노선 조건(routes.ts)을 분리했다. rewardItemIds는 획득 경유용이며 자동 보상이 아니다. routeVerification에 연결 근거를 남긴다.
- Verification은 출처 ID/판본/상태와 선택적 검증일·evidence·caveat를 갖는다. source는 ID/제목/HTTPS URL/출처 판본을 기록한다. item에도 검증 메타를 둔다.
- GuideContent는 version/gameVersion과 sources/items/stops/puzzles를 보유한다. Hint의 마지막 단계가 해법이며 총 1~3단계다.
- 사용자 스냅샷은 localStorage와 JSON 백업에서 같은 스키마를 사용한다. 현재 서버 메타와 저장 코드는 없다.
- AI 추천은 추후 검증된 ID를 사용할 수 있게 하되 현재 임의 메타/AI 테이블을 만들지 않는다.

## 초기 설계 예시 (구현의 전체 타입은 위 파일 기준)

```ts
type VerificationStatus = 'proposed' | 'cross_checked' | 'playtested' | 'compared';
type Verification = {
  status: VerificationStatus;
  version: 'oot-switch2-2026';
  sourceIds: string[];
  verifiedAt?: string;
  caveat?: string;
};
type Hint = { id: string; level: 1 | 2 | 3; text: string };
type Puzzle = {
  id: string;
  stopId: string;
  name: string;
  problemPhrase: string;
  hints: Hint[];
  verification: Verification;
};
// 실제 시오의 복잡한 조건 관계를 조사한 후 최소 필드로 조정할 것.
type RouteStop = {
  id: string;
  title: string;
  summary: string[];            // 사용자 화면에는 최대 3개의 짧은 행동 문장
  walkthrough?: string[];       // 명시적 요청 후에만 렌더링하는 상세 해법
  requiredAge?: 'child' | 'adult';
  kind: 'required' | 'recommended' | 'optional';
  prerequisiteStopIds: string[];
  prerequisiteItemIds: string[];
  puzzleIds: string[];
  recommendationReason?: string; // kind === 'recommended'일 때 필수
  verification: Verification;
};
type SpoilerLevel = 'strict' | 'default' | 'full';
type SavedProgress = {
  schemaVersion: 1;
  contentVersion: string;
  completedStopIds: string[];
  confirmedItemIds: string[];   // 획득 '확인'만. 확인하지 않은 상태 자동 추정 금지
  revealedHintIds: string[];
  spoilerLevel: SpoilerLevel;
  age?: 'unknown' | 'child' | 'adult'; // 기존 기록의 누락은 unknown으로 읽음
  goalStopId?: string;         // 선택 목적지, 누락 시 엔딩
  updatedAt: string;
};
```

`currentStopId`를 별도로 저장할지는 **완료 상태만으로 다음 역이 명확한지** 검증 후 결정한다. 별도 저장하면 완료 상태와 충돌하는 경우 사용자 선택을 우선한다.

## 불변 조건

- Stable IDs (이름을 바꿔도 ID는 유지), 출처 ID 유효, `recommended`는 추천 이유 필수.
- 2026 리메이크 전용 조건이 원작 공략에만 있으면 `cross_checked`로 자동 승격 금지.
- `playtested`는 실제 플레이 기록/날짜 필요, `compared`는 후보 동선 조건과 측정 기록 필요.
- `summary` 3문장을 억지로 만들지 않는다. '최대 3문장' 기본.
- 시대·아이템·시간대 등 조건을 단일 정수 순서만으로 표현할 수 없다면 명시적 조건을 추가한다.
- 콘텐츠/사용자 데이터 버전을 별도 관리하고 마이그레이션 루틴과 테스트를 만든다.

## 미디어를 추가할 때만

`originUrl`, `creator`, `permissionEvidence`, `license`, `alt`, `durationSec` 등을 도입. 없는 이미지를 데이터 스키마 때문에 억지로 만들지 않는다.

## 검증 방법

빌드 시 중복 ID, 없는 참조, 선행 조건 모순/의도치 않은 순환, 빈 한국어 문장, 유효하지 않은 힌트 레벨·출처를 검사. **자동 검사로 게임 공략 사실성까지 보증되진 않는다.**
