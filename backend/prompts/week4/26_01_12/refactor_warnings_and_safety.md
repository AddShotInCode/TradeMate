# Java Null Safety 경고 해결 및 Deprecated 메서드 리팩토링

## 1. 배경 및 목적

- **배경**: Spring Boot 3.x 및 Java 21 환경에서 개발 진행 중, IDE(VS Code)에서 Null Type Safety 관련 경고와 라이브러리 버전 업데이트에 따른 Deprecated 메서드 경고가 다수 발생함.
- **목적**:
  - `@NonNull` 파라미터에 Nullable 변수를 전달할 때 발생하는 잠재적 위험 제거.
  - Spring Framework 버전 업그레이드로 인한 Deprecated 메서드(`fromHttpUrl`, `setConnectTimeout` 등)를 최신 권장 방식으로 교체하여 코드 품질 및 유지보수성 향상.

## 2. 프롬프트 (User Input)

### Case 1. Null Type Safety 경고
> "Null type safety: The expression of type 'String' needs unchecked conversion to conform to '@NonNull String' 이 경고는 왜 발생하는거야?"
> "Null type safety: The expression of type 'Stock' needs unchecked conversion... 여기에서도 비슷한 경고가 발생해."

### Case 2. Deprecated 메서드 경고
> "The method fromHttpUrl(String) from the type UriComponentsBuilder is deprecated since version 6.2"
> "The method setConnectTimeout(Duration) from the type RestTemplateBuilder has been deprecated since version 3.4.0..."

## 3. AI 응답 요약 (AI Output)

### 1) Null Safety 해결
- **원인**: Spring Framework 및 Data JPA의 메서드 파라미터가 `@NonNull`로 정의되어 있으나, 주입받은 필드(`@Value`)나 파라미터가 Null일 가능성이 있다고 컴파일러가 판단함.
- **해결**: `java.util.Objects.requireNonNull()`을 사용하여 명시적으로 Null이 아님을 검증하고 컴파일러에게 보장함.

### 2) Deprecated 메서드 교체
- **UriComponentsBuilder**: `fromHttpUrl(String)`이 Spring 6.1(Boot 3.2)부터 Deprecated됨. -> **`fromUriString(String)`** 으로 교체 권장.
- **RestTemplateBuilder**: `setConnectTimeout`, `setReadTimeout`이 Spring Boot 3.4부터 Deprecated됨 (set 접두사 제거). -> **`connectTimeout`, `readTimeout`** 으로 교체.

## 4. 결과 및 적용 (Result)

### 1) StockOpenApiClient.java
- `apiUrl` 사용 시 `Objects.requireNonNull(apiUrl)` 적용.
- `UriComponentsBuilder.fromHttpUrl` -> `UriComponentsBuilder.fromUriString` 변경.

### 2) StockLowService.java
- `saveStock`, `saveDailyPrices` 메서드에서 파라미터에 `Objects.requireNonNull()` 적용하여 Null 저장 방지.

### 3) RestTemplateConfig.java
- `builder.setConnectTimeout(...)` -> `builder.connectTimeout(...)` 변경.
- `builder.setReadTimeout(...)` -> `builder.readTimeout(...)` 변경.

### 배운 점
- 최신 Spring Boot 버전에서는 빌더 패턴에서 `set` 접두사를 제거하는 추세임을 확인.
- `@Value`로 주입받는 필드라도 컴파일러 입장에서는 초기화 시점을 알 수 없으므로, 사용 시점에 Null 체크를 명시하는 것이 안전함.