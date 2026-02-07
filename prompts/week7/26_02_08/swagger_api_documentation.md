# Swagger API 문서화

## 1. 배경 및 목적

- 프로젝트의 모든 REST API를 체계적으로 문서화하여 프론트엔드 개발자 및 협업자가 API 스펙을 쉽게 파악할 수 있도록 함
- Swagger UI를 통한 인터랙티브 API 테스트 환경 제공
- SpringDoc OpenAPI를 활용하여 코드 기반의 자동 문서 생성

## 2. 프롬프트 (User Input)

```text
이번엔 swagger를 이용해 api 문서를 작성해보자. 방법을 제시해볼래?
```

```text
전체 문서화로 차근차근 진행해보자.
```

## 3. AI 응답 요약 (AI Output)

### 구현 계획
1. 의존성 추가 (`springdoc-openapi-starter-webmvc-ui`)
2. OpenAPI 설정 클래스 생성 (메타데이터, JWT Security 스키마)
3. Security 경로 허용 (Swagger UI 접근)
4. Controller별 `@Tag`, `@Operation`, `@ApiResponses` 어노테이션
5. DTO별 `@Schema` 어노테이션 (description, example)
6. ErrorResponse `@Schema` 어노테이션

### 사용된 주요 어노테이션

| 어노테이션 | 위치 | 용도 |
|-----------|------|------|
| `@Tag` | Controller 클래스 | API 그룹 분류 |
| `@Operation` | Controller 메서드 | API 설명 (summary, description) |
| `@ApiResponses` | Controller 메서드 | 응답 코드별 설명 |
| `@Parameter` | 메서드 파라미터 | 파라미터 설명, 예시 |
| `@Schema` | DTO 클래스/필드 | 필드 설명, 타입, 예시 |

## 4. 결과 및 적용 (Result)

### 변경된 파일 목록

**새로 생성된 파일:**
- `src/main/java/aib/trademate/global/config/SwaggerConfig.java`

**수정된 파일:**

| 파일 | 변경 내용 |
|------|----------|
| `build.gradle` | `springdoc-openapi-starter-webmvc-ui:2.8.4` 의존성 추가 |
| `SecurityConfig.java` | `/swagger-ui/**`, `/v3/api-docs/**` 경로 permitAll 추가 |
| `AuthController.java` | `@Tag("인증")`, 4개 메서드에 `@Operation`, `@ApiResponses` |
| `SimulationController.java` | `@Tag("시뮬레이션")`, 7개 메서드에 `@Operation`, `@Parameter`, `@ApiResponses` |
| `StockController.java` | `@Tag("주가 조회")`, 2개 메서드에 `@Operation`, `@Parameter` |
| `StatementController.java` | `@Tag("재무제표")`, 2개 메서드에 `@Operation`, `@Parameter` |
| `SignUpRequest.java` | 5개 필드에 `@Schema` |
| `LoginRequest.java` | 2개 필드에 `@Schema` |
| `TokenResponse.java` | 4개 필드에 `@Schema` |
| `AddTradeRequest.java` | 8개 필드에 `@Schema` |
| `CreateSimulationResponse.java` | 2개 필드에 `@Schema` |
| `SimulationResponse.java` | 5개 필드에 `@Schema` |
| `SimulationListResponse.java` | 2개 필드에 `@Schema` |
| `TradeResponse.java` | 8개 필드에 `@Schema` |
| `TradeListResponse.java` | 2개 필드에 `@Schema` |
| `SimulationReportResponse.java` | 4개 필드에 `@Schema` |
| `ReportSummary.java` | 9개 필드에 `@Schema` |
| `TradeScoreDetail.java` | 12개 필드에 `@Schema` |
| `StockPriceResponseDto.java` | 4개 내부 클래스, 17개 필드에 `@Schema` |
| `StatementResponseDto.java` | 2개 내부 클래스, 4개 필드에 `@Schema` |
| `ErrorResponse.java` | 7개 필드에 `@Schema` |

### Swagger UI 접속
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

### API 그룹 (4개 태그)
- **인증**: 회원가입, 로그인, 토큰 갱신, 로그아웃
- **시뮬레이션**: CRUD, 거래 데이터, 분석 리포트
- **주가 조회**: 종목별 기간별 주가 데이터
- **재무제표**: 재무제표 뷰어 링크 조회

### SwaggerConfig 주요 설정
- JWT Bearer 인증 스키마 (Authorize 버튼으로 토큰 입력 가능)
- API 인증 방식 설명 (HttpOnly 쿠키 기반)
- 로컬 개발 서버 URL 설정

### 배운 점
- Spring Boot 3.x에서는 `springfox` 대신 `springdoc-openapi`를 사용해야 함
- `@Schema`의 `hidden = true` 속성으로 민감한 필드(토큰 값)를 문서에서 숨길 수 있음
- Security 설정에서 Swagger 관련 경로를 permitAll로 열어야 접근 가능
