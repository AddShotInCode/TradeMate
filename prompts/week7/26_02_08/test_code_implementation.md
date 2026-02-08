# 테스트 코드 작성 및 CI 구성

## 1. 배경 및 목적

- 코드 신뢰성 확보를 위한 CI(Continuous Integration) 파이프라인 구축
- 핵심 비즈니스 로직에 대한 단위 테스트 및 통합 테스트 작성
- PR/Push 시 자동 테스트 실행으로 품질 보장

## 2. 프롬프트 (User Input)

```text
코드 신뢰성 CI를 위해서 이 프로젝트에 테스트 코드를 작성하려고 해. 순차적으로 테스트코드 작성을 진행해보자.
```

```text
좋아. 깃허브 ci 구성을 진행해보자.
```

```text
JaCoCo 커버리지 리포트도 추가해줄래?
```

## 3. AI 응답 요약 (AI Output)

### 테스트 계층별 우선순위
1. **Unit Tests**: 핵심 비즈니스 로직 (ScoreCalculator, JwtTokenProvider)
2. **Service Tests**: 서비스 레이어 (AuthService, SimulationService)
3. **Controller Tests**: API 엔드포인트 (AuthController, SimulationController)
4. **Repository Tests**: 데이터 접근 계층 (Member, Simulation, Trade, RefreshToken)

### 생성된 테스트 클래스

| Layer | Test Class | 주요 테스트 케이스 |
|-------|-----------|------------------|
| Unit | `SimulationScoreCalculatorTest` | 점수 계산 알고리즘 (15개) |
| Unit | `JwtTokenProviderTest` | JWT 생성/검증/파싱 (15개) |
| Service | `AuthServiceTest` | 회원가입, 로그인, 토큰 갱신, 로그아웃 (10개) |
| Service | `SimulationServiceTest` | CRUD, 거래 관리, 리포트 생성 (12개) |
| Controller | `AuthControllerTest` | 인증 API 엔드포인트 (9개) |
| Controller | `SimulationControllerTest` | 시뮬레이션 API 엔드포인트 (9개) |
| Repository | `MemberRepositoryTest` | 회원 조회/저장/삭제 |
| Repository | `SimulationRepositoryTest` | 시뮬레이션 CRUD |
| Repository | `SimulationTradeRepositoryTest` | 거래 조회 (날짜순 정렬) |
| Repository | `RefreshTokenRepositoryTest` | 토큰 CRUD |

### CI/CD 구성

**GitHub Actions 워크플로우** (`.github/workflows/ci.yml`)
- JDK 21 (Temurin) 설정
- Gradle 캐시로 빌드 속도 향상
- 테스트 실행 + JaCoCo 커버리지 리포트
- PR 코멘트에 커버리지 자동 표시

**JaCoCo 설정** (`build.gradle`)
- XML + HTML 리포트 출력
- 테스트 완료 후 자동 리포트 생성

## 4. 결과 및 적용 (Result)

### 생성된 파일 목록

```
src/test/java/aib/trademate/
├── TrademateApplicationTests.java
├── domain/
│   ├── auth/
│   │   ├── controller/AuthControllerTest.java
│   │   └── service/AuthServiceTest.java
│   ├── member/
│   │   └── repository/
│   │       ├── MemberRepositoryTest.java
│   │       └── RefreshTokenRepositoryTest.java
│   └── simulation/
│       ├── controller/
│       │   ├── SimulationControllerTest.java
│       │   └── TestUserDetailsArgumentResolver.java
│       ├── repository/
│       │   ├── SimulationRepositoryTest.java
│       │   └── SimulationTradeRepositoryTest.java
│       └── service/
│           ├── SimulationScoreCalculatorTest.java
│           └── SimulationServiceTest.java
└── global/
    └── security/
        └── jwt/JwtTokenProviderTest.java

.github/workflows/ci.yml
```

### 주요 기술적 결정

1. **MockMvc Standalone 모드 사용**
   - `@WebMvcTest` 대신 standalone 모드로 Spring Context 로딩 없이 빠른 테스트
   - `GlobalExceptionHandler`를 `setControllerAdvice()`로 등록

2. **Custom ArgumentResolver 생성**
   - `@AuthenticationPrincipal` 처리를 위한 `TestUserDetailsArgumentResolver` 구현
   - Security Context 없이도 인증된 사용자 테스트 가능

3. **H2 인메모리 DB 사용**
   - Repository 테스트를 위해 `testRuntimeOnly 'com.h2database:h2'` 추가
   - `@DataJpaTest`로 JPA 관련 빈만 로드

4. **Null Safety 경고 해결**
   - 테스트 클래스에 `@SuppressWarnings("null")` 적용
   - `TestUserDetailsArgumentResolver`에 `@NonNull`, `@Nullable` 어노테이션 추가

### 배운 점

- Controller 테스트 시 Spring Security 설정으로 인한 빈 로딩 문제는 Standalone MockMvc로 해결
- Mockito의 `when().thenReturn()` 패턴에서 null safety 경고는 `@SuppressWarnings`로 억제 가능
- JaCoCo와 GitHub Actions 연동으로 PR 리뷰 시 커버리지 확인 가능

### CI 트리거 조건

- `main`, `develop` 브랜치에 Push
- `main`, `develop` 브랜치로 PR
