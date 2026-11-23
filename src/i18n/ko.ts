export const ko = {
  app: {
    title: "젤다 하이패스",
    description: "시간의 오카리나 모험 내비게이션",
    skipToMain: "본문으로 건너뛰기",
    goHome: "홈으로",
  },
  login: {
    title: "시간의 오카리나",
    idLabel: "모험 아이디",
    idPlaceholder: "hyrule-link",
    submit: "시작하기",
    submitting: "불러오는 중...",
    loading: "불러오는 중...",
    switchId: "아이디 변경",
    validation: {
      empty: "아이디를 입력해 주세요.",
      pii: "이메일·전화번호 대신 별명을 적어 주세요.",
      length: "2~24자로 입력해 주세요.",
      charset: "한글, 영문, 숫자, -, _ 만 쓸 수 있어요.",
    },
  },
  guide: {
    referenceLabel: "GameWith 공략 ↗",
    openHint: "힌트 보기",
    closeHint: "힌트 닫기",
    nextHint1: "힌트 1 보기",
    nextHint2: "힌트 2 보기",
    showSolution: "해법 보기",
    solveNow: "바로 정답",
    completeNext: "완료 · 다음으로",
    prevStep: "이전으로",
    nextPending: "데크나무 이후 갈래가 이어집니다.",
    hintLevels: {
      1: "힌트 1 · 관찰",
      2: "힌트 2 · 단서",
      3: "해법",
    },
  },
  cards: {
    "kokiri-gear": {
      stepLabel: "1단계",
      title: "출발 장비 확보",
      steps: [
        "코키리 숲에서 검과 방패를 구해 장착합니다.",
        "장비를 갖춘 뒤 마을 동쪽 길목의 미도에게 말을 겁니다.",
      ],
      hintQuestion: "검과 방패를 어디서 얻는지 모르겠어요.",
    },
    "deku-tree": {
      stepLabel: "2단계",
      title: "데크나무님 속",
      steps: [
        "동쪽 길목을 지나 데크나무 안으로 들어갑니다.",
        "난간 끝 자동 점프와 방패 막기를 활용해 안쪽으로 진행합니다.",
      ],
      hintQuestion: "",
    },
  },
  hints: {
    "kokiri-gear-1": "마을 남서쪽 훈련장과 상점을 살펴보세요.",
    "kokiri-gear-2": "훈련장 낮은 통로 너머에 바위가 굴러다니고, 방패는 40루피가 필요해요.",
    "kokiri-gear-3": "훈련장 낮은 통로에서 바위를 피해 상자의 검을 얻고, 상점에서 40루피로 방패를 산 뒤 둘 다 장착하세요.",
  },
  error: {
    title: "화면을 불러오지 못했어요",
    retry: "다시 시도",
  },
  notFound: {
    title: "페이지를 찾을 수 없어요",
  },
} as const;

export type Messages = typeof ko;
