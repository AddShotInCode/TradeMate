# 예외처리 강화 및 리팩토링

## 1. 배경 및 목적

- API 요청 시 발생하는 다양한 예외 상황에 대해 적절한 HTTP 상태 코드와 명확한 에러 메시지를 반환하도록 개선
- 기존에 500 Internal Server Error로 응답하던 상황들을 400, 404, 405 등 적절한 상태 코드로 변경
- 예외처리 구조를 체계화하여 유지보수성 향상

### 기존 문제점

| 상황 | 기존 응답 |
|------|----------|
| 존재하지 않는 API 경로 (`/api/stock`) | 500 Internal Server Error |
| 필수 파라미터 누락 (start, end, year, quarter) | 500 Internal Server Error |
| 파라미터 타입 불일치 (year=abc) | 500 Internal Server Error |
| 잘못된 날짜 (20250631) | 400 (메시지 불명확) |
| quarter 범위 초과 (0, 5) | 500 Internal Server Error |

## 2. 프롬프트 (User Input)

```text
사용자가 api 요청을 했을 때, 예외처리를 강화하고 리팩토링 해보려고 해.
우선 현재 예외처리 구조가 바람직하게 작성되어있는건지 잘 모르겠어. 
다른 구조로 리팩토링이나 분리가 필요할지에 대해서 의견을 들려줄래?

다음으로는 강화해야할 예외처리야.

전체
현재 /api/stock과 같이 존재하지 않는 api 경로(url 잘못됨)이면 500 internal server error로 
응답하는데, 이것이 404 not found로 응답하면 좋겠어.

api/stock
start나 end가 없을 시에는 500 internal server error이 발생하는데, 
이것이 400 bad request로 응답하면 좋겠어.
start와 end의 format이 잘못되거나 존재하지 않는 날짜(ex. 20250631)면 400 bad request로 
응답하는데, 이때 message가 Invalid date format 만 작성되어있어. 
message에 존재하지 않는 날짜에 관한 내용도 작성되어있으면 좋겠어.

api/statement
year과 quarter에 format이 맞지 않는 값이 오거나, 값이 없을 때 모두 
500 internal server error으로 응답하는데, 이것이 400 bad request로 응답하면 좋겠어.

500 internal server error는 사용자가 요청에 어떤 오류를 냈는지에 대한 정보를 알려주지 못하니, 
일반적으로 발생할 수 있는 거의 모든 경우에 대해서, 사용자가 오류가 발생한 이유를 알 수 있도록 
알맞은 응답을 해주면 좋겠어.
```

## 3. AI 응답 요약 (AI Output)

### 3.1 리팩토링 구조 제안

```
global/exception/
├── GlobalExceptionHandler.java     # 전역 예외 핸들러
├── ErrorCode.java                  # 에러 코드 enum (NEW)
├── ErrorResponse.java              # 응답 DTO 분리 (NEW)
├── BusinessException.java          # 비즈니스 예외 기반 클래스 (NEW)
├── StockNotFoundException.java     # → BusinessException 상속
└── StatementNotFoundException.java # → BusinessException 상속
```

### 3.2 추가된 예외 핸들러

| 예외 타입 | HTTP 상태 | 처리 대상 |
|----------|----------|----------|
| `NoHandlerFoundException` | 404 | 존재하지 않는 API 경로 |
| `MissingServletRequestParameterException` | 400 | 필수 파라미터 누락 |
| `MethodArgumentTypeMismatchException` | 400 | 타입 변환 실패 |
| `ConstraintViolationException` | 400 | Bean Validation 실패 |
| `HttpRequestMethodNotSupportedException` | 405 | 잘못된 HTTP 메서드 |
| `DateTimeParseException` | 400 | 날짜 형식/값 오류 |

### 3.3 Null Safety 경고 해결

리팩토링 후 발생한 경고 처리:

**Null Type Safety 경고 (10개)**
- 원인: `ResponseEntity.status()`가 `@NonNull HttpStatusCode`를 기대하지만 `HttpStatus`가 null일 수 있다고 컴파일러가 판단
- 해결: 클래스에 `@SuppressWarnings("null")` 추가 (HttpStatus enum은 null이 될 수 없음)

**Potential Null Pointer Access 경고 (1개)**
- 원인: `e.getRequiredType()`을 두 번 호출하여 중간에 null이 될 수 있다고 판단
- 해결: 지역 변수에 저장 후 사용

```java
// Before
String expectedType = e.getRequiredType() != null 
        ? e.getRequiredType().getSimpleName()  // 경고 발생
        : "unknown";

// After
Class<?> requiredType = e.getRequiredType();
String expectedType = requiredType != null 
        ? requiredType.getSimpleName() 
        : "unknown";
```

## 4. 결과 및 적용 (Result)

### 4.1 생성된 파일

| 파일 | 설명 |
|------|------|
| `ErrorCode.java` | 에러 코드 중앙 관리 enum (COMMON-001 ~ COMMON-101) |
| `ErrorResponse.java` | 에러 응답 DTO (timestamp, path, fieldErrors 포함) |
| `BusinessException.java` | 비즈니스 예외 기반 클래스 |

### 4.2 수정된 파일

| 파일 | 변경 내용 |
|------|-----------|
| `GlobalExceptionHandler.java` | 6개 예외 핸들러 추가, `@SuppressWarnings("null")` 추가 |
| `StockNotFoundException.java` | `BusinessException` 상속으로 변경 |
| `StatementNotFoundException.java` | `BusinessException` 상속으로 변경 |
| `StockController.java` | `@Validated`, `@Min` 추가 |
| `StatementController.java` | `@Validated`, `@Min`, `@Max` 추가 |
| `StatementService.java` | 중복 검증 로직 제거 |
| `application.yml` | `NoHandlerFoundException` 활성화 설정 |

### 4.3 application.yml 추가 설정

```yaml
spring:
  mvc:
    throw-exception-if-no-handler-found: true
  web:
    resources:
      add-mappings: false
```

### 4.4 개선된 응답

| 상황 | 이전 | 이후 |
|------|------|------|
| 존재하지 않는 API 경로 | 500 | **404** |
| 필수 파라미터 누락 | 500 | **400** |
| 타입 불일치 (year=abc) | 500 | **400** |
| 잘못된 날짜 (20250631) | 400 (불명확) | **400** (상세 메시지) |
| quarter 범위 초과 | 500 | **400** |
| 잘못된 HTTP 메서드 | 500 | **405** |

### 4.5 응답 예시

```json
{
  "timestamp": "2026-01-23T12:34:56.789",
  "status": 400,
  "error": "Bad Request",
  "code": "COMMON-004",
  "message": "Required parameter 'start' is missing",
  "path": "/api/stock/005930"
}
```

### 4.6 배운 점

1. **예외처리 계층화**: `BusinessException` 기반 클래스를 만들어 비즈니스 예외를 일관성 있게 관리
2. **ErrorCode enum**: 에러 코드를 중앙에서 관리하여 중복 방지 및 유지보수성 향상
3. **Bean Validation 활용**: 컨트롤러에서 `@Validated`, `@Min`, `@Max` 등으로 입력값 검증을 선언적으로 처리
4. **Null Safety**: `@SuppressWarnings("null")`을 사용할 때는 실제로 null이 될 수 없는 상황인지 확인 필요
5. **NoHandlerFoundException 활성화**: Spring Boot에서 기본적으로 비활성화되어 있으므로 yml 설정 필요
