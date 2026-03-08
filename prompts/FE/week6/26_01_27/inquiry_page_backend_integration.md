# Inquiry 페이지 백엔드 연동

## 1. 배경 및 목적

- 기존 Inquiry 페이지가 예시(목업) 데이터 기반으로 구성되어 있어 실제 백엔드 데이터(OHLCV)를 조회/표시하지 못했음
- 이미 동작 중인 Simulation 페이지의 연동 방식(Next.js `/api` rewrite + axios service + Zustand store)을 기준으로 Inquiry 페이지도 동일한 패턴으로 백엔드와 연동
- 이후 UX 요구사항(탭 제거, 전체 목록/스크롤, 이름 검색, 헤더/차트 표시, 차트 기간 버튼 등)을 반영하면서도 연동 구조는 유지

## 2. 프롬프트 (User Input)

```text
inquiry페이지를 백이랑 연동… simulation페이지의 방식을 기반으로 inquiry페이지도 연동

관심종목, 최근조회 탭을 모두 없애고 목록 탭만
모든 주식 목록을 보여주고 스크롤 가능하게
이름으로만 검색

헤더에서 종목코드 말고 이름만 뜨게
차트가 안뜨는데 표시되게 (simulation 페이지 참고)

차트 좌상단에 기간 버튼(1달/3달/6달/1년 등)
원칙체크 카드 제거
표 데이터 기준일(최근 데이터 날짜) 표시
```

## 3. AI 응답 요약 (AI Output)

- **연동 패턴 통일**
  - Next.js에서 `/api/*` 요청을 백엔드(`http://localhost:8080/api/*`)로 프록시하도록 구성된 rewrite를 전제로, 프론트는 항상 `/api` 기준으로 호출
  - `src/services/stockService.ts`의 axios 호출을 통해 주가 데이터를 조회하고, Zustand store(`useInquiryStore`)에서 로딩/에러/데이터 상태를 관리

- **데이터 모델링/가공**
  - 백엔드에서 받은 `items`를 날짜순 정렬 후 캔들 데이터로 변환
  - 차트 호환을 위해 날짜를 `BusinessDay`로 변환(YYYYMMDD, YYYY-MM-DD 형태 모두 대응)
  - 파생 지표(등락/등락률, 52주 최고/최저, 평균 거래량 등)를 `rawItems` 기반으로 계산

- **UI/UX 반영**
  - 좌측 리스트를 프로젝트 상수(`TARGET_STOCKS`) 기반 전체 종목 목록으로 통일
  - 탭 제거 후 “목록”만 남기고, 이름 기준 검색만 지원
  - Flex 레이아웃에서 스크롤이 잘리던 문제를 `min-h-0`/`overflow-y-auto`로 해결
  - 헤더는 종목코드 노출 없이 이름 중심으로 표시

- **차트 안정화 및 기능 추가**
  - `lightweight-charts`를 사용하여 캔들 차트를 렌더링
  - 데이터 유무와 무관하게 차트 컨테이너를 항상 마운트하고, 로딩/빈 상태는 overlay로 처리하여 초기화 누락 문제를 방지
  - `ResizeObserver` 기반으로 차트를 초기화하여 컨테이너 사이즈(특히 height/width=0) 문제를 회피
  - 기간 버튼(1달/3달/6달/1년)으로 표시 구간을 필터링
  - 종목 변경 시 가격축이 해당 종목 가격대에 맞도록 `rightPriceScale.autoScale` 및 마진 적용
  - O/H/L/C(시가/고가/저가/종가) 옆에 `?` 도움말 hover 툴팁 제공

- **표 기준일 표시**
  - 표(기본 정보)가 “오늘”이 아니라 “최근 데이터(마지막 캔들) 기준”임을 명확히 하기 위해 `기준일: YYYY-MM-DD`를 헤더에 노출

## 4. 결과 및 적용 (Result)

- 연동/상태관리
  - `src/store/inquiryStore.ts`: 데이터 로딩 + 캔들 변환 + `rawItems` 저장
  - `src/services/stockService.ts`: `/api` 기반 호출 유지(백엔드 rewrite 전제)

- 페이지/컴포넌트 변경
  - `src/app/inquiry/page.tsx`: 선택 종목 및 데이터 로딩을 store 기반으로 전환
  - `src/components/inquiry/WatchlistSidebar.tsx`: 전체 목록/이름 검색/스크롤 UX 반영
  - `src/components/inquiry/StockHeader.tsx`: 종목명 중심 표시
  - `src/components/inquiry/StockDetailView.tsx`: 목업 제거, 파생 지표/기본 정보 구성, 원칙체크 카드 제거
  - `src/components/inquiry/InquiryChart.tsx`: 차트 초기화 안정화 + 기간 버튼 + 도움말 + 가격축 오토스케일
  - `src/components/inquiry/FundamentalData.tsx`: 기준일(as-of date) 표시 지원

- 추가적인 수정 사항
  - 차트/스크롤 등 레이아웃 이슈는 “조건부 렌더링으로 컨테이너가 마운트되지 않음” 및 “flex 자식 overflow 제약”이 원인이었고, 컨테이너 상시 마운트 + `min-h-0`로 해결

- 배운 점/특이사항
  - 비동기 데이터 로딩 UI에서 차트(또는 캔버스) 컨테이너를 조건부로 없애면 초기화 타이밍을 놓치기 쉽기 때문에, 컨테이너는 항상 렌더하고 상태(로딩/빈 값)는 overlay로 처리하는 방식이 안정적임
  - 가격축 오토스케일은 데이터/종목이 바뀌는 순간에도 재적용해줘야 기대하는 “종목별 가격대 맞춤” UX가 유지됨
