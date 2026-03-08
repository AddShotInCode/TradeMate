# Stock Codes Configuration Separation

## 1. 배경 및 목적

- 관리할 종목 코드 리스트 `TARGET_STOCK_CODES`가 `StockService.java`에 하드코딩되어 있었음
- 실제 운영 시 약 100개의 종목을 관리해야 하므로 코드에 직접 넣기엔 부적절
- 종목 추가/삭제 시 코드 수정 없이 설정 파일만 변경하도록 분리 필요

## 2. 프롬프트 (User Input)

```text
지금부터는 새로운 개선사항이야. 지금까지는 관리할 종목의 리스트 TARGET_STOCK_CODES에 종목 코드들을 하드코딩했는데, 실제로는 약 100개의 종목이 등록될 것이라 하드코딩하기엔 너무 많아. 이것을 별도의 파일로 분리하고싶어.
```

## 3. AI 응답 요약 (AI Output)

### 생성된 파일

**1. StockProperties.java** - 설정값을 읽어오는 클래스
```java
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "stock")
public class StockProperties {
    private List<String> targetCodes = new ArrayList<>();
}
```

**2. stock-codes.yml** - 종목 코드 리스트 파일
```yaml
stock:
  target-codes:
    - "005930"  # 삼성전자
    - "000660"  # SK하이닉스
    - "900110"  # 이스트아시아홀딩스
    # ... 추가 종목
```

**3. application.yml** - import 설정 추가
```yaml
spring:
  config:
    import: classpath:stock-codes.yml
```

### StockService.java 변경사항

```java
// Before
private static final List<String> TARGET_STOCK_CODES = List.of("900110", "005930");

// After
private final StockProperties stockProperties;

// 사용 시
for (String code : stockProperties.getTargetCodes()) { ... }
```

## 4. 결과 및 적용 (Result)

### 적용된 파일
- `src/main/java/aib/trademate/domain/stock/config/StockProperties.java` (신규)
- `src/main/resources/stock-codes.yml` (신규)
- `src/main/resources/application.yml` (수정)
- `src/main/java/aib/trademate/domain/stock/service/StockService.java` (수정)

### 사용 방법
종목을 추가/삭제할 때 `stock-codes.yml` 파일만 수정하면 됨:
```yaml
stock:
  target-codes:
    - "005930"  # 삼성전자
    - "123456"  # 새 종목 추가
```

### 배운 점
1. **@ConfigurationProperties**: Spring Boot에서 외부 설정을 타입 안전하게 바인딩하는 방법
2. **spring.config.import**: Spring Boot 2.4+에서 추가 설정 파일을 import하는 방법
3. **관심사 분리**: 비즈니스 로직(코드)과 설정(데이터)을 분리하여 유지보수성 향상
