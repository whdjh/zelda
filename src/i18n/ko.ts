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
    emptyCardsTitle: "모험 준비 완료",
    emptyCardsBody: "플레이를 시작하면 다음 갈래 카드가 여기에 표시됩니다.",
    validation: {
      empty: "아이디를 입력해 주세요.",
      pii: "이메일·전화번호 대신 별명을 적어 주세요.",
      length: "2~24자로 입력해 주세요.",
      charset: "한글, 영문, 숫자, -, _ 만 쓸 수 있어요.",
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
