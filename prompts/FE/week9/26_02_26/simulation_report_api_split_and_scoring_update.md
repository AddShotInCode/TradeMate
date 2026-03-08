# simulation_report_api_split_and_scoring_update

## 1. 배경 및 목적

- 시뮬레이션 보고서 기능을 생성/조회 API로 분리한 뒤, 프론트에 정확히 반영할 필요가 있었음.
- 보고서 페이지의 에이전트 의견 영역을 Gemini/GPT/Claude 구조로 개편하고, 유료 기능 잠금 UI를 적용하려는 요구가 있었음.
- 점수 표기(수익/원칙/AI/종합)의 데이터 출처와 계산 책임(백 vs 프론트)을 명확히 정리하고, 종합점수 산식을 요구사항에 맞게 변경할 필요가 있었음.

## 2. 프롬프트 (User Input)

```text
시뮬레이션 보고서 생성/요청 기능을 각각 post/get api를 분리했는데 이걸 적용시키고 싶어.
어 기능 분리시켜줘
시뮬레이션 종료 버튼을 눌렀을 때 POST를 쏘고 결과 분석 버튼을 눌렀을 때 GET조회하게 해줘
보고서 페이지의 에이전트 의견 섹션에 있는 3가지 카드는 각각 ai에이전트의 의견을 보여주는 카드로 할거야.
각각 gemini, gpt, claude의 의견을 보여줄건데 일단 첫번째 카드에는 gemini api를 활용해서 gemini의 의견을 요약해 보여주고
나머지 2개의 에이전트는 유료 회원에게만 공개하는 식으로 하고싶어.
gemini api key넣어둔게 이렇게 활용되고 있어?
지금은 백에서 gemini의 점수만 날라오고 멘트가 안날라오는거 같은데 확인해줘
gemini의견 받을 때 요약해서 카드 안에 내용이 다 들어가고 짤리지 않게 해줘.
레포트 페이지에서 수익, 원칙준수, ai평가 3개의 점수와 그 3가지의 종합 점수까지 총 4개의 점수가 표기되는데
각 점수가 정확히 어디서 받아와서 뭘 보여주는 건지 알려줘.
수익/원칙 점수도 프론트 계산식 없이 백에서 그대로 받아서 쓰고싶어.
백 코드는 건들지말고 프론트 코드만 수정 가능해.
백에 수익/원칙 점수를 계산한 로직이 있는지 확인하고 그걸 그대로 프론트 계산없이 웹에 표시해줘.
지금 백에서 받는 원칙/수익 점수는 가장 최근 거래 1건만 기준으로 하는거야?
난 시뮬레이션 전체 거래 내역을 반영하는 원칙/수익 점수를 원해.
종합 점수를 ai평가까지 반영해서 3가지 점수의 평균점수로 하고싶어.
백 수정없이 프론트 수정만으로 가능해?
이제 4가지 점수가 각 백의 어느 데이터를 받아오는지/계산식은 무엇인지/각 점수가 프론트or백 중 어디서 최종계산되는지 알려줘
백에서 저 계산식 점수가 바로 넘어오지는 않는거지?
그래서 점수 받기만 해서 계산을 프론트에서 하는거야?
원칙/수익 점수는 백에서는 각 거래내역 1건1건에 관해서만 넘겨줘서 프론트에서 그걸 종합하고 평균내는거야?
그리고 ai점수에서 백에서 ai점수를 못받았을때 들어가는 summary.totalscore는 정확히 뭐야?
```

## 3. AI 응답 요약 (AI Output)

- `simulationService`에 보고서 생성/조회를 분리:
  - `generateReport(id)` → `POST /api/simulation/{id}/report`
  - `getReport(id)` → `GET /api/simulation/{id}/report`
- 보고서 페이지와 시뮬레이션 헤더 동작 분리:
  - 종료 시점: 보고서 생성 POST
  - 결과 분석 진입 시점: 보고서 GET 조회
- 에이전트 의견 UI 개편:
  - 1번 카드: Gemini 의견 요약(백의 `aiComment` 기반)
  - 2/3번 카드: GPT/Claude, 유료 회원 전용 잠금 UI
- Gemini 키 사용 여부 확인:
  - FE 직접 호출이 아니라 BE의 보고서 생성 로직에서 Gemini API 호출
  - `aiScore`, `aiComment`를 보고서 엔티티에 저장하고 조회 응답에 포함
- 점수 로직 정리:
  - 원칙/수익 점수는 `trades[]` 기반 프론트 가중평균 집계
  - AI 점수는 `summary.aiScore` 우선, 없으면 `summary.totalScore` fallback
  - 종합점수는 프론트에서 `(원칙 + 수익 + AI) / 3`으로 변경

## 4. 결과 및 적용 (Result)

- 실제 반영 파일
  - `src/services/simulationService.ts`
  - `src/components/simulation/SimulationHeader.tsx`
  - `src/app/simulation/[id]/report/page.tsx`
  - `src/services/__tests__/simulationService.test.ts`
- 주요 적용 사항
  - 보고서 API 분리(POST/GET) 및 프론트 동작 분리 완료
  - 보고서 페이지 에이전트 카드 3종 구조 적용(Gemini 공개 + GPT/Claude 잠금)
  - Gemini 코멘트 요약이 카드 내부에서 줄바꿈/단어 래핑되도록 UI 보완
  - 원칙/수익 점수는 전체 거래 반영 가중평균으로 유지
  - 종합점수는 AI 포함 3점수 평균으로 화면 표시 변경
- 대화 중 확인된 사실
  - 백엔드는 거래 단위 점수(`resultScore`, `complianceScore`, `tradeScore`)와 요약(`totalScore`, `aiScore`, `aiComment`)을 제공
  - 프론트는 요구사항에 맞춰 일부 집계/표시 산식을 담당
