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
    accountSheetTitle: "모험 아이디",
    closeSheet: "닫기",
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
    chooseBranchTitle: "다음 갈래 선택",
    prevStep: "이전으로",
    nextPending: "직접 플레이 검증 후 다음 갈래가 이어집니다.",
    hintLevels: {
      1: "힌트 1 · 관찰",
      2: "힌트 2 · 단서",
      3: "해법",
    },
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
