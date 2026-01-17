# TradeMate Backend - AI 코딩 에이전트 가이드

## 프로젝트 개요

**TradeMate**는 원칙 기반의 의사결정을 강제하여 뇌동매매를 방지하는 트레이딩 훈련 플랫폼입니다. 백엔드는 Spring Boot 3.5.9로 구성되었으며 주식 데이터, 매매 이력, 사용자 훈련 시뮬레이션을 관리합니다.

**핵심 아키텍처 패턴**: 도메인 주도 설계(DDD)에 따른 계층 분리:
- `XxxLowService`: 단순 CRUD/쿼리 작업 (DB 접근 1회)
- `XxxService`: 복합 비즈니스 로직 (다중 쿼리/트랜잭션)

## 필수 개발 워크플로우

### 빌드 & 실행
```bash
./gradlew build          # 프로젝트 빌드 (Java 21로 컴파일)
./gradlew bootRun        # 개발 서버 시작 (http://localhost:8080)
./gradlew test           # 단위 테스트 실행
```

### 설정
- 모든 비밀키는 `.env` 파일로 관리 (MySQL 자격증명, OpenAPI 키)
- MySQL 사용, JPA 자동 스키마 생성 (`ddl-auto: update`)
- Hibernate 배치 페치 사이즈 100으로 설정해 N+1 문제 완화
- 기본값은 LAZY 로딩; 필요 시 fetch join 명시적 사용

### 로깅 레벨
구조화된 로깅을 SLF4J로 관리하며 특정 규칙을 따릅니다:
- `org.hibernate.SQL`, `org.hibernate.orm.jdbc.bind`: DEBUG 레벨로 쿼리 추적
- 프로젝트 패키지 `aib.trademate`: DEBUG, 나머지: INFO
- [application.yml](src/main/resources/application.yml) 참고

## 프로젝트 특화 패턴

### 엔티티 설계
모든 엔티티는 `BaseTimeEntity`를 상속받아 JPA Auditing으로 `createdAt`/`updatedAt` 자동 관리. [Stock.java](src/main/java/aib/trademate/domain/stock/entity/Stock.java) 참고:
- `@NoArgsConstructor(access = AccessLevel.PROTECTED)` 필수 사용 (JPA 요구사항)
- `@Builder`는 클래스 레벨이 아닌 생성자에 붙이기
- 도메인 특화 업데이트 메서드 포함: `updateInfo(name, marketType)`
- 엔티티 관계는 단방향 기본; 양방향 필요 시 최소화

### 서비스 & 레포지토리 계층
- Repository는 `JpaRepository<T, ID>`를 확장하며 Spring Data 명명 규칙 준수
- `XxxLowService`: 단순 쿼리 (`findById()`, `findAll()`, `existsById()`)
- `XxxService`: 조율/오케스트레이션 (다중 쿼리 조합, 트랜잭션 처리)
- findBy 쿼리는 항상 `Optional<T>` 반환; null 반환 금지

### 외부 API 연동
한국 공개 API에서 주식 데이터 조회. [StockOpenApiClient.java](src/main/java/aib/trademate/domain/stock/client/StockOpenApiClient.java) 참고:
- RestTemplate 설정: 5초 연결 타임아웃, 10초 읽기 타임아웃 ([RestTemplateConfig.java](src/main/java/aib/trademate/global/config/RestTemplateConfig.java))
- API 자격증명은 `application.yml`에서 `@Value`로 주입
- API 호출 실패 시 null이 아닌 빈 컬렉션 반환
- 예약된 작업은 `@Scheduled` 애너테이션 사용 (예: `initStockData()`)

### 데이터 모델
- `Stock`: 핵심 엔티티 (code, name, marketType) 및 업데이트 기능
- `DailyPrice`: Stock 연계 시계열 데이터
- 모든 타임스탬프는 `BaseTimeEntity`로 관리
- 단수형 엔티티명 사용 (`Stock`, `Stocks` 아님)

## 코딩 컨벤션 (필수)

### 네이밍
- **패키지**: 전부 소문자 단수형: `aib.trademate.user.service`
- **클래스/인터페이스**: PascalCase: `UserService`, `TradeType`
- **메서드/필드/변수**: camelCase: `findByEmail`, `createdAt`
- **상수**: UPPER_SNAKE_CASE: `MAX_RETRY`, `DEFAULT_PAGE_SIZE`
- **DTO**: API 입출력에는 `XxxRequestDto`, `XxxResponseDto`; 내부용은 `XxxDto`
- **Repository 메서드**: 의미 명확히: `findAllByStatusOrderByCreatedAtDesc`

### REST API 설계
- **리소스명은 복수 명사**: `/api/stocks`, `/api/trades/{id}/wishes`
- **엔드포인트에 동사 금지** (HTTP 메서드로 표현)
- **HTTP 메서드 규칙**:
  - POST `/api/trades` → 생성
  - GET `/api/trades/{id}` → 조회
  - PUT `/api/trades/{id}` → 전체 수정
  - PATCH `/api/trades/{id}` → 부분 수정
  - DELETE `/api/trades/{id}` → 삭제

### 예외 처리
- 과도하게 구체적인 예외 지양 (예: ❌ `NotFoundTradeException`)
- 포괄적 예외 권장 (예: ✅ `NotFoundEntityException`, `InvalidOperationException`)
- 예외 메시지는 항상 의미있는 맥락 제공

### JPA 모범 사례
- 기본값은 LAZY 로딩; 관계 매핑 시 `@Query` + fetch join 사용
- Fetch join 메서드는 `WithXxx` 접미사로 명시: `findStockWithDailyPrices()`
- 비자명한 쿼리는 Spring Data 메서드명 자동 생성보다 `@Query` 직접 정의

## Git & 코드 리뷰 워크플로우

### 커밋 메시지 (Conventional Commits)
```
<type>(<scope>): <short summary>
<BLANK LINE>
<body>
```

유효한 타입: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `perf`, `chore`

예시: `feat(stock): 일일 가격 배치 초기화 추가`

### Pull Request
- 모든 변경사항은 PR로 팀 리뷰 후 병합
- 최소 1명 이상 승인 필수 (24시간 리뷰 SLA)
- "승인" 만하지 말고 구체적 코멘트 1개 이상 작성
- 의견 차이는 팀 논의로 조율하고 기록

## 일반적인 개발 작업

### 새로운 도메인 기능 추가
1. `domain/{feature}/entity/`에 `BaseTimeEntity` 상속 엔티티 정의
2. `domain/{feature}/repository/`에 명명된 쿼리 메서드 포함 레포지토리 작성
3. 서비스 분리: `{Feature}LowService` (쿼리), `{Feature}Service` (로직)
4. `domain/{feature}/controller/`에 REST 컨벤션 준수하는 컨트롤러 추가
5. `domain/{feature}/dto/`에 Request/Response 접미사 포함 DTO 작성

### 외부 API 통합
- `domain/{feature}/client/`에 `{Service}Client` 컴포넌트 생성
- `application.yml`에 자격증명 설정, `@Value`로 주입
- API 호출 실패 시 예외가 아닌 빈 컬렉션 반환
- API 호출을 DEBUG 레벨로 구조화된 파라미터와 함께 로깅

### 데이터베이스 마이그레이션
- Hibernate DDL 생성으로 엔티티가 DB에 자동 동기화
- 운영 환경에서는 `ddl-auto: validate` 설정해 의도치 않은 스키마 변경 방지
- 실제 배치 사이즈 (기본값 100)로 쿼리 테스트해 N+1 문제 감지

## 핵심 파일 참고

| 파일 | 용도 |
|------|------|
| [build.gradle](build.gradle) | Spring Boot 3.5.9, Java 21, MySQL 드라이버 설정 |
| [application.yml](src/main/resources/application.yml) | DB, JPA, 로깅, OpenAPI 설정 |
| [docs/strategy/coding_strategy.md](docs/strategy/coding_strategy.md) | 완전한 네이밍/설계 패턴 가이드 |
| [TrademateApplication.java](src/main/java/aib/trademate/TrademateApplication.java) | JPA Auditing 활성화 |
| [BaseTimeEntity.java](src/main/java/aib/trademate/global/entity/BaseTimeEntity.java) | 타임스탬프 상속 패턴 |
