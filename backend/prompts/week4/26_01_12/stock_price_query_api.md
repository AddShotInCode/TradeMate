# Stock Price Query API Implementation

## 1. 배경 및 목적

- 사용자가 특정 주식 종목의 특정 기간에 대한 가격 정보를 조회할 수 있는 API가 필요
- 페이징 기능을 통해 대량의 데이터를 효율적으로 전달
- 존재하지 않는 종목 요청 시 적절한 에러 응답(404) 반환

## 2. 프롬프트 (User Input)

```text
이번엔 새로운 기능이야. 사용자로부터 특정 주식 종목의 특정 기간에 대한 요청을 받으면, 해당 종목의 해당 기간 동안의 가격 정보를 데이터베이스로부터 가져와 응답하는 API를 추가하려고 해. 사용자가 

api/stock/005930?start=20250112&end=20260112&pageSize=20&page=1

와 같은 요청을 보내면(pageSize를 입력하지 않으면 default 10, page를 입력하지 않으면 default 1), 

{
  "stock": { "code": "005930", "name": "삼성전자", "market": "KOSPI" },
  "pagination": { "page": 1, "pageSize": 20, "totalElements": 365, "totalPages": 19 },
  "items": [
    { "date": "2025-01-12", "open": 73000, "high": 74000, ... },
    ...
  ]
}

와 같이 응답을 전송하는거야. 설계를 제안해줄래?
```

```text
좋아, 구현을 진행하자.
```

```text
방금 구현한 것에서, 만약 사용자가 요청한 종목이 데이터베이스에 없다면 어떻게 응답하게 돼?
```

```text
좋아, 사용자가 요청한 종목을 데이터베이스에서 찾을 수 없으면 404 응답을 반환하도록 만들어줘.
```

```text
api 응답의 결과 날짜가 역순으로 나오니, 좀 불편한 것 같아. 20250512 ~ 20250812를 조회한다면, 1페이지부터 5월부터 8월까지의 순서로 데이터가 응답되도록 바꿔줄래?
```

## 3. AI 응답 요약 (AI Output)

### 설계 구조

```
[Controller] → [Service] → [LowService] → [Repository]
     ↓              ↓            ↓              ↓
  요청 파싱      비즈니스 로직   위임 처리     DB 페이징 조회
     ↓              ↓            
[Response DTO] ← [Entity 변환]
```

### 생성된 파일

| 파일 | 역할 |
|------|------|
| `StockPriceResponseDto.java` | 응답 DTO (stock, pagination, items) |
| `StockNotFoundException.java` | 커스텀 예외 (404용) |
| `GlobalExceptionHandler.java` | 전역 예외 핸들러 |

### 수정된 파일

| 파일 | 변경 내용 |
|------|----------|
| `StockController.java` | GET `/{stockCode}` 엔드포인트 추가 |
| `StockService.java` | `getStockPrices()` 메서드 추가 |
| `StockLowService.java` | 페이징 조회 메서드 추가 |
| `DailyPriceRepository.java` | `findByStockCodeAndDateBetweenOrderByDateAsc()` 추가 |

### 핵심 코드

**Controller:**
```java
@GetMapping("/{stockCode}")
public ResponseEntity<StockPriceResponseDto.Response> getStockPrices(
        @PathVariable String stockCode,
        @RequestParam String start,
        @RequestParam String end,
        @RequestParam(defaultValue = "10") int pageSize,
        @RequestParam(defaultValue = "1") int page
) { ... }
```

**Repository:**
```java
Page<DailyPrice> findByStockCodeAndDateBetweenOrderByDateAsc(
        String stockCode, LocalDate startDate, LocalDate endDate, Pageable pageable);
```

**Exception Handler:**
```java
@ExceptionHandler(StockNotFoundException.class)
public ResponseEntity<ErrorResponse> handleStockNotFoundException(StockNotFoundException e) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(...);
}
```

## 4. 결과 및 적용 (Result)

### API 사용법

```
GET /api/stock/{stockCode}?start={yyyyMMdd}&end={yyyyMMdd}&pageSize={n}&page={n}
```

### 응답 예시

**정상 응답 (200):**
```json
{
  "stock": {
    "code": "005930",
    "name": "삼성전자",
    "market": "KOSPI"
  },
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalElements": 240,
    "totalPages": 24
  },
  "items": [
    {
      "date": "2025-01-12",
      "open": 73000,
      "high": 74000,
      "low": 72500,
      "close": 73100,
      "volume": 12345678,
      "changeAmount": -500,
      "changeRate": -0.68
    },
    ...
  ]
}
```

**종목 없음 (404):**
```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Stock not found: 999999"
}
```

### 배운 점

1. **Spring Data JPA 메서드 네이밍**: `findBy...OrderByDateAsc`로 정렬 방향 지정 가능
2. **페이징 처리**: `PageRequest.of(page - 1, pageSize)`로 0-based 인덱스 변환
3. **전역 예외 처리**: `@RestControllerAdvice`로 일관된 에러 응답 포맷 유지
4. **커스텀 예외**: 도메인별 예외 클래스로 명확한 에러 구분
