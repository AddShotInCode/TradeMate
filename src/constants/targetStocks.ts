export interface TargetStock {
  code: string;
  name: string;
  corpCode: string; // DART 고유번호
  market: "KOSPI" | "KOSDAQ";
}

export const TARGET_STOCKS: TargetStock[] = [
  // KOSPI
  { code: "005930", name: "삼성전자", corpCode: "00126380", market: "KOSPI" },
  { code: "000660", name: "SK하이닉스", corpCode: "00164779", market: "KOSPI" },
  { code: "005380", name: "현대차", corpCode: "00164742", market: "KOSPI" },
  { code: "005490", name: "POSCO홀딩스", corpCode: "00155319", market: "KOSPI" },
  { code: "035420", name: "NAVER", corpCode: "00266961", market: "KOSPI" },
  { code: "000270", name: "기아", corpCode: "00106641", market: "KOSPI" },
  { code: "068270", name: "셀트리온", corpCode: "00413046", market: "KOSPI" },
  { code: "012330", name: "현대모비스", corpCode: "00164788", market: "KOSPI" },
  { code: "055550", name: "신한지주", corpCode: "00382199", market: "KOSPI" },
  { code: "066570", name: "LG전자", corpCode: "00401731", market: "KOSPI" },
  { code: "035720", name: "카카오", corpCode: "00258801", market: "KOSPI" },
  { code: "036570", name: "엔씨소프트", corpCode: "00261443", market: "KOSPI" },
  { code: "251270", name: "넷마블", corpCode: "00904672", market: "KOSPI" },

  // KOSDAQ
  { code: "900110", name: "이스트아시아홀딩스", corpCode: "00799070", market: "KOSDAQ" },
  { code: "035760", name: "CJ ENM", corpCode: "00265324", market: "KOSDAQ" },
  { code: "293490", name: "카카오게임즈", corpCode: "01137383", market: "KOSDAQ" },
  { code: "263750", name: "펄어비스", corpCode: "01152470", market: "KOSDAQ" },
  { code: "112040", name: "위메이드", corpCode: "00444329", market: "KOSDAQ" },
  { code: "095340", name: "ISC", corpCode: "00572905", market: "KOSDAQ" },
  { code: "058470", name: "리노공업", corpCode: "00369657", market: "KOSDAQ" },
];
