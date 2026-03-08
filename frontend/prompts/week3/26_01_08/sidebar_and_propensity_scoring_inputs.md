# 사이드바 네비게이션 정리 및 원칙설정(점수 산정 입력) 개편

## 1. 배경 및 목적

- 랜딩/인덱스 페이지의 네비게이션에서 일부 버튼을 제거하고, 대시보드 기준의 사이드바 네비게이션을 여러 페이지에 일관되게 적용하고자 했습니다.
- `/inquiry`, `/propensity` 페이지에서 상단 네비게이션을 제거하고, 대시보드의 사이드바로 이동/활성 상태(Active UI)를 통일하고자 했습니다.
- 모의 시뮬레이션 점수 산정 로직 문서(main_logic.md)를 기반으로, 원칙설정 페이지에서 사용자에게 받을 입력을 “점수 산정에 필요한 값(SL/TP, Expected ROI, 지표 가중치, 평가 항목 비중)” 중심으로 재구성하고자 했습니다.

## 2. 프롬프트 (User Input)

```text
인덱스 페이지의 네비게이션에 있는 주식 조회, 원칙설정 버튼을 없애줘.
대쉬보드 페이지의 사이드 바에 있는 원칙 버튼을 /propensity로 연결하고, '조회' 버튼을 하나 추가해서 /inquiry로 연결하게 해줘

inquiry, propensity페이지에서 네비게이션을 제거하고 대쉬보드의 사이드바를 그대로 추가해줘. 그리고 사이드바로 페이지 이동할 때 누른 버튼이 눌러진 상태인것처럼 ui설정해줘

main_logic.md는 모의 시뮬레이션에서 어떤 식으로 점수를 측정할지에 대한 문서야. 이를 기반으로 원칙설정 페이지에서 사용자에게 입력받을 원칙,정보를 수정해줘

1. 원칙설정페이지에서 2번섹션 아예 제거해줘
2. 1번섹션에서 SL,TP랑 ROI랑 입력 칸의 높이가 다른데 동일하게 맞춰줘.
3. 3번섹션에서 토글로 껐을 때 0퍼 입력된것처럼 합계 비율에 반영해줘. 지금은 꺼도 그 숫자가 그대로 합계에 남아있어.

사이드바 최하단에 있는 텍스트 없애줘
```

## 3. AI 응답 요약 (AI Output)

- 랜딩 네비게이션에서 “주식 조회”, “원칙 설정” 링크를 제거하여 인덱스(랜딩) 페이지 상단 메뉴를 단순화했습니다.
- 대시보드 사이드바에 “조회(/inquiry)” 항목을 추가하고, “원칙” 항목을 “/propensity”로 연결되도록 수정했습니다.
- `/inquiry`, `/propensity` 페이지의 상단 네비게이션을 제거하고, 대시보드와 동일한 사이드바 레이아웃을 적용했습니다.
- 사이드바에서 현재 경로를 기준으로 Active 스타일이 자동 적용되도록 개선했습니다(`usePathname()` 기반).
- `main_logic.md`의 점수 산정 항목을 반영하여, `/propensity`의 입력을 다음으로 개편했습니다.
  - SL(손절%), TP(익절%), Expected ROI(예상 수익률%) 입력
  - 지표 이름 + 가중치(합계 100%) 입력
  - Compliance/Validity/Performance 평가 비중(합계 100%) 입력
- `/propensity`에서 2번 섹션(전략 템플릿)을 제거했습니다.
- 1번 섹션의 SL/TP/ROI 입력 필드 높이를 동일하게 맞췄습니다.
- 3번 섹션에서 토글 OFF 시 합계 계산에 0%로 반영되도록 수정했습니다.
- 사이드바 최하단의 “오늘의 팁” 텍스트 블록을 제거했습니다.
- 변경 후 `npm run lint` 기준으로 린트 통과 상태를 확인했습니다.

## 4. 결과 및 적용 (Result)

- 적용 파일(핵심)
  - `src/components/landing/LandingNavigation.tsx`
  - `src/components/layout/Sidebar.tsx`
  - `src/app/inquiry/page.tsx`
  - `src/app/propensity/page.tsx`
  - `src/components/propensity/PropensityAssessment.tsx`
  - `src/components/propensity/PrinciplesCustomizer.tsx`

- 실제 반영 내용
  - 랜딩 네비: 불필요 링크 제거
  - 사이드바: `/dashboard`, `/inquiry`, `/propensity` 라우팅 및 Active UI 적용
  - Inquiry/Propensity: 상단 네비 제거 + 사이드바 레이아웃 통일
  - Propensity 입력: 점수 산정에 필요한 값 중심(SL/TP/Expected ROI/지표 가중치/평가 비중)으로 재구성

- 추가 메모
  - 현재는 “합계 100%”를 UI로만 표시하며, 저장 버튼 비활성화 같은 강제 로직은 적용하지 않았습니다(추가 요구 시 적용 가능).
  - 지표 이름은 자유 텍스트이며, 실제 “지표 적중 여부” 판정 로직은 추후 데이터/차트 기반으로 구현되는 것을 전제로 합니다.
