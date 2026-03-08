# 시뮬레이션 결과 분석 보고서 API 구현

## 1. 배경 및 목적

- 사용자가 종료된 시뮬레이션을 대상으로 결과 분석을 요청하면, 서버가 점수 계산 알고리즘을 거쳐 결과 보고서용 JSON을 생성하여 응답
- 점수는 '수익 결과(R)'와 '원칙 준수(C)'를 기반으로 계산
- 평단가는 DB에 저장하지 않고, 요청 시 이동평균법으로 계산하여 데이터 정합성 보장
- 금융 연산은 `BigDecimal`을 사용하여 부동소수점 오차 방지

## 2. 프롬프트 (User Input)

```text
목표는 사용자가 종료된 시뮬레이션을 대상으로 결과 분석 요청 api를 호출하면, 서버가 점수 계산 알고리즘을 거쳐 결과 점수 및 평가 내용을 계산하고, 프론트가 파싱해 결과 보고서를 생성할 수 있도록 json을 생성해 응답해주는거야.

서버가 결과 보고서에 노출될 결과 점수 및 평가 내용을 계산하는 방식은 simulation_report_calculation_strategy.md에, 응답 내용을 프론트가 조합해 완성될 보고서의 예시 형식은 simulation_report_example.md에 정리되어 있어.

사용 시나리오:
사용자는 종료된 시뮬레이션을 대상으로(종료시점 컬럼이 null이 아님) 결과 분석을 요청할 수 있어.
GET /api/simulation/{id}/report
서버는 이 요청을 받아 해당 시뮬레이션의 보고서 작성에 필요한 수치들을 계산하고, 성공하면 json으로 해당 내용들을 체계적으로 정리해 200 응답해.

평단가 계산은 데이터에 별도로 컬럼을 추가하지 않고, 결과 분석 요청 시에 서버가 계산하는 것으로 하자.
```

## 3. AI 응답 요약 (AI Output)

### 설계 피드백
- 거래 데이터가 **시간순 정렬**되어야 평단가 계산 정확 (기존 Repository 메서드 활용)
- 점수는 **매도(Sell) 거래에만** 적용, 매수는 평단가 갱신에만 사용
- 종료되지 않은 시뮬레이션 → `400 Bad Request` 에러
- Divide by Zero 방지 → 분모가 0일 때 기본값 100점 반환

### 응답 JSON 구조
```json
{
  "summary": {
    "simulationId": 1,
    "stockCode": "005930",
    "startDate": "2026-01-01",
    "endDate": "2026-01-31",
    "finalAvgPrice": 75000.00,
    "totalInvestment": 7500000,
    "totalRealizedProfit": 412500,
    "totalRoi": 5.50,
    "totalScore": 85.50
  },
  "trades": [
    {
      "sequence": 1,
      "tradeDate": "2026-01-15",
      "sellPrice": 80000,
      "avgPrice": 75000.00,
      "targetPrice": 82000,
      "stopLoss": 70000,
      "volume": 10,
      "profit": 50000,
      "roi": 6.67,
      "resultScore": 100.00,
      "complianceScore": 71.43,
      "tradeScore": 85.71
    }
  ],
  "totalSellVolume": 50,
  "totalTradeCount": 5
}
```

### 점수 계산 알고리즘
```
개별 매도 점수: s_i = (R + C) / 2 × 100

익절 시 (P_sell >= P_avg):
  - R = 1.0 (고정, 수익 창출 성공)
  - C = 목표가 이탈 거리 기반 감점

손절 시 (P_sell < P_avg):
  - R = P_sell / P_avg (회수율)
  - C = 손절가 이행 여부 기반

최종 종합 점수: S_Total = Σ(s_i × q_i / Q_Total)
  - 수량 비중에 따른 가중 평균
```

### 파일 구조
```
dto/
├── TradeScoreDetail.java      // 매도 건별 상세
├── ReportSummary.java         // 요약 정보
└── SimulationReportResponse.java  // 전체 응답

service/
└── SimulationScoreCalculator.java  // 점수 계산 전담
```

## 4. 결과 및 적용 (Result)

### 생성된 파일 (4개)
| 파일 | 설명 |
|------|------|
| `TradeScoreDetail.java` | 매도 건별 점수 상세 DTO (sequence, sellPrice, avgPrice, scores 등) |
| `ReportSummary.java` | 보고서 요약 DTO (totalScore, totalRoi, totalInvestment 등) |
| `SimulationReportResponse.java` | 전체 응답 DTO (summary + trades 목록) |
| `SimulationScoreCalculator.java` | 점수 계산 서비스 (핵심 알고리즘) |

### 수정된 파일 (3개)
| 파일 | 변경 내용 |
|------|-----------|
| `ErrorCode.java` | `SIMULATION_NOT_ENDED` (400) 에러 코드 추가 |
| `SimulationService.java` | `getReport()` 메서드 추가, `SimulationScoreCalculator` 주입 |
| `SimulationController.java` | `GET /{id}/report` 엔드포인트 추가 |

### 핵심 구현 내용

#### 평단가 계산 (이동평균법)
```java
// 매수 시 평단가 갱신
BigDecimal oldTotal = avgPrice.multiply(new BigDecimal(currentBalance));
BigDecimal newPurchase = buyPrice.multiply(new BigDecimal(buyVolume));
currentBalance += buyVolume;
avgPrice = oldTotal.add(newPurchase)
        .divide(new BigDecimal(currentBalance), SCALE, ROUNDING_MODE);

// 매도 시 평단가 유지, 전량 매도 시 초기화
if (currentBalance <= 0) {
    avgPrice = ZERO;
}
```

#### 익절 과정 점수 계산
```java
if (sellPrice.compareTo(target) <= 0) {
    // 목표가 미달: 1.0 - |T - P_sell| / |T - P_avg|
    compliance = ONE.subtract(numerator.divide(denominator, SCALE, ROUNDING_MODE));
} else {
    // 목표가 초과: 페널티 50% 감면
    BigDecimal penalty = HALF.multiply(excess).divide(denominator, SCALE, ROUNDING_MODE);
    compliance = ONE.subtract(penalty);
}
```

#### 종합 점수 계산 (가중 평균)
```java
// 매도 수량 비중으로 가중치 적용
weightedScoreSum = weightedScoreSum.add(
        scores.tradeScore().multiply(new BigDecimal(sellVolume)));

// 최종 계산
totalScore = weightedScoreSum.divide(new BigDecimal(totalSellVolume), SCALE, ROUNDING_MODE);
```

### API 엔드포인트

```
GET /api/simulation/{id}/report
```

| 조건 | 응답 |
|------|------|
| 종료된 시뮬레이션 | 200 OK + 보고서 JSON |
| 미종료 시뮬레이션 | 400 `SIMULATION_NOT_ENDED` |
| 타인 시뮬레이션 | 403 `ACCESS_DENIED` |
| 존재하지 않음 | 404 `SIMULATION_NOT_FOUND` |

### 배운 점
- 금융 연산에서 `double` 대신 `BigDecimal` 사용의 중요성
- 복잡한 계산 로직은 별도 클래스(`SimulationScoreCalculator`)로 분리하여 테스트 용이성 확보
- Divide by Zero 등 예외 케이스에 대한 방어적 프로그래밍 필요
- record 클래스에 Builder 패턴을 적용할 때는 수동으로 Builder 클래스 구현 필요
