# Logging Enhancement

## 1. 배경 및 목적

- 기존 로그가 단순하여 초기화/업데이트 시 성공/실패 현황을 파악하기 어려움
- 어떤 종목이 실패했는지, 총 몇 개를 처리했는지 한눈에 보이지 않음
- Windows 콘솔에서 한글 깨짐 문제 발생
- OpenAPI 클라이언트 로그가 서비스 로그와 섞여 가독성 저하

## 2. 프롬프트 (User Input)

```text
이번엔 초기화 및 매일 데이터 업데이트 시 로그가 더 자세하게 출력되면 좋겠어. 초기화 시 몇 개의 종목에 대해서 각각 몇 개의 가격 데이터를 저장했는지, 어떤 종목의 데이터 저장을 실패했는지 등을 알 수 있으면 좋겠고, 매일 데이터 업데이트 시 총 몇 개의 종목 중 몇 개를 업데이트에 성공 및 실패했는지, 실패한 것은 어떤 종목인지를 알 수 있으면 좋겠어.
```

```text
콘솔에서 한글이 깨져서 잘 보이지가 않네. 로그를 전부 영어로 바꿔줄래?
```

```text
StockOpenApiClient의 로깅도 StockService의 로깅에 섞여 방해되지 않게 수정해줄래?
```

## 3. AI 응답 요약 (AI Output)

### 로그 개선 내용

**1. 성공/실패 카운팅 추가**
```java
int successCount = 0;
int failCount = 0;
List<String> failedCodes = new ArrayList<>();
```

**2. 구분선과 요약 로그**
```
========== [INIT START] Total 20 stocks ==========
[INIT] Stock 005930 (Samsung) - Saved 240 price records
========== [INIT COMPLETE] ==========
Total 20 stocks - Success: 18, Failed: 2
Failed stocks: [900110(no data)]
```

**3. 로그 레벨 분리**
| 레벨 | 용도 |
|------|------|
| `info` | 시작/종료, 요약 정보 |
| `debug` | 개별 종목 처리 상세 |
| `warn` | 데이터 없음, 실패 목록 |
| `error` | 예외 발생 |
| `trace` | API 원본 응답 (디버깅용) |

**4. OpenAPI 클라이언트 로그**
```java
log.debug("[OpenAPI] Response: stock={}, {} items received", stockCode, items.size());
log.error("[OpenAPI] Request failed: stock={}, error={}", stockCode, e.getMessage());
```

### 한글 → 영어 변경

| Before | After |
|--------|-------|
| `[초기화 시작]` | `[INIT START]` |
| `[초기화 완료]` | `[INIT COMPLETE]` |
| `[일일 업데이트 시작]` | `[DAILY UPDATE START]` |
| `저장 완료` | `Saved` |
| `데이터 없음` | `No data` |
| `저장 실패` | `Save failed` |

## 4. 결과 및 적용 (Result)

### 적용된 파일
- `src/main/java/aib/trademate/domain/stock/service/StockService.java`
- `src/main/java/aib/trademate/domain/stock/client/StockOpenApiClient.java`
- `src/main/resources/application.yml` (Hibernate 로그 비활성화)

### 로그 출력 예시

**초기화 시:**
```
========== [INIT START] Total 20 stocks ==========
[INIT] Stock 005930 (Samsung Electronics) - Saved 240 price records
[INIT] Stock 000660 (SK Hynix) - Saved 238 price records
[INIT] Stock 900110 - No data (empty API response)
========== [INIT COMPLETE] ==========
Total 20 stocks - Success: 19, Failed: 1
Failed stocks: [900110(no data)]
```

**일일 업데이트 시:**
```
========== [DAILY UPDATE START] Date: 2026-01-12, Total 20 stocks ==========
========== [DAILY UPDATE COMPLETE] ==========
Total 20 stocks - Success: 18, Skipped: 2, Failed: 0
```

### 배운 점
1. **로그 레벨 활용**: DEBUG/TRACE 레벨로 상세 로그를 분리하면 운영 시 깔끔하게 INFO만 출력 가능
2. **구조화된 로그**: 시작/종료 구분선, 요약 정보로 가독성 향상
3. **실패 추적**: 실패 목록을 별도로 수집하여 한 번에 출력하면 디버깅 용이
4. **인코딩 문제 우회**: 한글 대신 영어 사용으로 콘솔 호환성 확보
