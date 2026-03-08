# 스케줄링 메서드 트랜잭션 오류 수정

## 1. 배경 및 목적

- 주식 데이터 초기화(`/api/stocks/init`) 기능은 정상 동작했으나, 스케줄링된 작업(매일 장 마감 후 당일 데이터 업데이트, 매일 자정 1년 지난 데이터 삭제)이 제대로 동작할지 점검이 필요했음
- 스케줄러 메서드에 `@Transactional`이 누락되어 있어 데이터 저장/삭제가 실패할 수 있는 잠재적 버그 발견

## 2. 프롬프트 (User Input)

```text
좋아. 이제 데이터베이스에 init을 통해 1년치 데이터들을 저장하는 것은 잘 작동해.
다음으로 스케줄링된 작업이 잘 작동할지를 점검해줄래? API의 응답 구조 및 지금까지 수정되었던 내용들에 주의해서, 앞으로 매일 장이 마감되고 데이터베이스에 당일 데이터가 오류 없이 잘 업데이트 될지, 매일 자정에 1년이 지난 데이터가 잘 삭제될지 점검해줘.
```

## 3. AI 응답 요약 (AI Output)

### 발견된 문제점 3가지

| 문제 | 위치 | 설명 |
|------|------|------|
| `@Transactional` 누락 | `StockService.updateTodayStockData()` | 트랜잭션 없이 실행 시 조회한 Stock 엔티티가 준영속 상태가 되어 DailyPrice 연관관계 처리 오류 가능 |
| `@Transactional` 누락 | `StockService.deleteExpiredData()` | `@Modifying` 벌크 쿼리는 트랜잭션 필수, 없으면 `TransactionRequiredException` 발생 |
| `clearAutomatically` 미설정 | `DailyPriceRepository.deleteByDateBefore()` | 벌크 삭제 후 영속성 컨텍스트와 DB 불일치 문제 발생 가능 |

### 수정 코드

**StockService.java**
```java
// 수정 전
@Scheduled(cron = "0 30 16 * * *")
public void updateTodayStockData() { ... }

@Scheduled(cron = "0 0 0 * * *")
public void deleteExpiredData() { ... }

// 수정 후
@Transactional
@Scheduled(cron = "0 30 16 * * *")
public void updateTodayStockData() { ... }

@Transactional
@Scheduled(cron = "0 0 0 * * *")
public void deleteExpiredData() { ... }
```

**DailyPriceRepository.java**
```java
// 수정 전
@Modifying
@Query("DELETE FROM DailyPrice d WHERE d.date < :date")
void deleteByDateBefore(@Param("date") LocalDate date);

// 수정 후
@Modifying(clearAutomatically = true)
@Query("DELETE FROM DailyPrice d WHERE d.date < :date")
void deleteByDateBefore(@Param("date") LocalDate date);
```

## 4. 결과 및 적용 (Result)

### 적용된 파일
- `src/main/java/aib/trademate/domain/stock/service/StockService.java`
- `src/main/java/aib/trademate/domain/stock/repository/DailyPriceRepository.java`

### 배운 점
1. **스케줄러 메서드도 트랜잭션이 필요하다**: `@Scheduled` 메서드는 Spring이 직접 호출하므로 트랜잭션이 자동 적용되지 않음. DB 작업이 있다면 명시적으로 `@Transactional` 추가 필요
2. **벌크 연산의 특성**: `@Modifying` 쿼리는 영속성 컨텍스트를 거치지 않고 DB에 직접 실행됨. `clearAutomatically = true`로 1차 캐시와 DB 동기화 필요
3. **준영속 상태 주의**: 트랜잭션 경계를 벗어난 엔티티는 준영속 상태가 되어 연관관계 설정 시 문제 발생 가능
