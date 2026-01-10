# [Frontend] TradeMate 기술 명세서

## 1. 프로젝트 개요

- **프로젝트명:** TradeMate (트레이드메이트)
- **목표:** 수익률 중심이 아닌 **'원칙 준수 여부'**를 평가하는 자기주도 주식 매매 훈련 플랫폼.
- **핵심 가치:** 뇌동매매 차단, 타임머신(리플레이) 기능, 원칙 기반 평가.

## 2. 기술 스택 (Tech Stack)

바이브 코딩 효율을 극대화하기 위해 생태계가 넓고 AI 학습 데이터가 풍부한 모던 스택을 선정했습니다.

- **Core:** Next.js 14+ (App Router), TypeScript, React
- **Styling:** Tailwind CSS (AI가 코드를 생성하기 가장 좋은 스타일링 방식)
- **UI Components:** shadcn/ui (Radix UI 기반, 커스터마이징 용이)
- **State Management:** Zustand (전역 상태 관리 - 시뮬레이션 시간, 잔고, 주문 상태 동기화)
- **Form Management:** React Hook Form + Zod (매매 원칙 강제 입력을 위한 엄격한 유효성 검사)
- **Charting:** **Lightweight Charts** (TradingView 오픈소스) - 캔들스틱 차트 및 리플레이 구현에 최적화
- **Icons:** Lucide React

## 3. 디렉토리 구조 (App Router 기반)

```
src/
├── app/
│   ├── layout.tsx          # 전역 레이아웃 (네비게이션 등)
│   ├── page.tsx            # 랜딩 페이지
│   ├── simulation/         # 핵심 기능: 타임머신 시뮬레이션
│   │   └── page.tsx
│   ├── report/             # 훈련 결과 리포트
│   │   └── [id]/page.tsx
│   └── dashboard/          # 마이페이지 (과거 기록 확인)
├── components/
│   ├── ui/                 # shadcn 기본 컴포넌트 (Button, Input 등)
│   ├── chart/              # 차트 관련 컴포넌트 (ReplayChart)
│   ├── trade/              # 매매 패널 (OrderForm, PositionStatus)
│   └── report/             # 결과 분석 차트 및 피드백 UI
├── hooks/                  # 커스텀 훅 (useSimulation, useOrders)
├── store/                  # Zustand 스토어 (simulationStore.ts)
├── lib/                    # 유틸리티 (수익률 계산, 차트 데이터 가공)
└── types/                  # 타입 정의 (Trade, Candle, Principle)

```

## 4. 핵심 기능별 상세 명세

### 4.1. 타임머신 시뮬레이션 (The Time Machine)

이 프로젝트의 핵심인 '과거 시점 리플레이' 기능입니다. 다음과 같습니다.

- **기능 요구사항:**
- **블라인드 모드:** 특정 날짜 이후의 데이터를 차단하고, 사용자의 조작(Play/Next)에 따라 캔들을 하나씩 렌더링.
- **배속 컨트롤:** 1x, 2x, 4x, 일시정지, 1캔들 넘기기(Step) 기능.
- **데이터 흐름:** 전체 과거 데이터를 한 번에 로드하되, `currentIndex` 상태를 관리하여 차트에는 `slice(0, currentIndex)` 데이터만 전달.

- **구현 포인트:**
- `Lightweight Charts`의 `setData`가 아닌 `update` 메서드를 사용하여 캔들이 실시간으로 그려지는 듯한 애니메이션 효과 구현.
- `requestAnimationFrame` 혹은 `setInterval`을 활용한 커스텀 훅(`useTicker`) 작성.

### 4.2. 시나리오 기반 주문 시스템 (Order System)

사용자가 원칙을 지키지 않으면 매매를 할 수 없도록 강제하는 UI입니다.

- **기능 요구사항:**
- **매수(Long) 패널:** \* 필수 입력: `진입 근거(Text)`, `손절가(Price)`, `목표가(Price)`.
- Validation: 입력값이 없으면 '매수' 버튼 `disabled` 처리.

- **약속 이행 추적:** 매수 체결 시, 차트 상에 손절선/목표가 라인을 시각적으로 표시 (LineSeries 활용).
- **매도(Sell) 패널:** `청산 사유(Text)` 입력 필수.

- **데이터 모델 (Type):**

```typescript
interface TradeOrder {
  type: "BUY" | "SELL";
  price: number;
  quantity: number;
  reason: string; // 진입/청산 근거
  stopLossPrice: number; // 원칙 1
  takeProfitPrice: number; // 원칙 2
}
```

### 4.3. TradeMate 평가 시스템 (Evaluation Logic)

수익금이 아닌 '과정'을 평가하는 로직은 프론트엔드에서 1차적으로 시각화합니다.

- **평가 알고리즘 (Client Side Visualization):**
- **원칙 준수 여부 체크:**
- 사용자가 설정한 Stop Loss 가격보다 낮게 내려갔는데도 매도하지 않았는가? (손절 원칙 위반)
- 목표가에 도달했는데 욕심을 부려 매도하지 않았는가?

- **피드백 UI:**
- 리포트 페이지에서 차트 타임라인 위에 '원칙 위반' 구간을 붉은색 마커로 표시.
- 당시 작성했던 '진입 근거'를 툴팁으로 노출하여 복기 유도.

### 4.4. 결과 리포트 (Review)

- **구성:**
- **종합 점수:** 수익률(30%) + 원칙 준수(70%) 가중치 그래프.
- **매매 복기 차트:** 전체 차트를 공개(Unblind)하고, 사용자의 매수/매도 시점을 화살표 마커로 표시.
- **비교 분석:** [나의 진입 근거] vs [실제 이후 차트 흐름]을 좌우 대조 레이아웃으로 배치.

## 5. 상태 관리 전략 (Zustand Store 설계)

바이브 코딩 시 AI에게 아래 스토어 구조를 제공하면 코드 생성이 매우 정확해집니다.

```typescript
// store/simulationStore.ts

interface SimulationState {
  // 시뮬레이션 상태
  fullData: CandleData[]; // 전체 데이터
  currentData: CandleData[]; // 현재 보여지는 데이터
  currentIndex: number; // 현재 시점 인덱스
  isPlaying: boolean;
  speed: number;

  // 계좌 상태
  balance: number; // 예수금
  positions: Position[]; // 보유 주식

  // 액션
  nextCandle: () => void; // 다음 캔들로 이동
  buyStock: (order: OrderParams) => void;
  sellStock: (order: OrderParams) => void;
  checkPrinciples: () => void; // 매 틱마다 원칙 준수 여부 감시
}
```

## 6. 개발 로드맵 (Phase)

1. **Phase 1 (기반 구축):** Next.js 세팅, Shadcn UI 설치, 레이아웃 구성.
2. **Phase 2 (차트 & 리플레이):** Lightweight Charts 연동, 과거 데이터(JSON Mock)를 활용한 리플레이 기능 구현.
3. **Phase 3 (주문 & 검증):** 주문 Form 개발, Zod 검증 로직, 매수/매도 버튼 제어.
4. **Phase 4 (평가 로직):** 매매 종료 후 리포트 페이지 데이터 시각화.
