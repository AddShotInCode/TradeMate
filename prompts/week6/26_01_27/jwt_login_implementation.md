# JWT 기반 로그인 기능 구현

## 1. 배경 및 목적

- 프로젝트에 사용자 인증 기능이 필요하여 JWT(JSON Web Token) 기반 로그인 시스템 구현
- 회원가입, 로그인, 로그아웃, 토큰 갱신 4가지 API 개발
- 추후 사용자 정보를 활용한 기능 확장을 고려한 구조 설계

## 2. 프롬프트 (User Input)

```text
지금부터 이 프로젝트에 새로운 기능을 개발하자.
목표는 로그인 기능을 만드는 것이고, jwt를 사용할거야.
회원가입시, 사용자는 이메일, 비밀번호, 이름, 전화번호를 입력해 회원가입 요청을 보낼 수 있어. 
회원가입이 완료되면, 사용자는 로그아웃 상태일 때 이메일과 비밀번호를 이용해 로그인 요청을 보내 로그인 할 수 있고, 
로그인 상태일 때 로그아웃 요청을 보내 로그아웃 할 수 있어.
현재 기획은 이정도로, 간단한 로그인 기능을 수행하지만, 추후 사용자 정보를 이용한 기능이 확장될 수는 있어.
```

## 3. AI 응답 요약 (AI Output)

### 3.1 구현된 API 엔드포인트

| Method | Endpoint | 설명 | 인증 필요 |
|--------|----------|------|----------|
| POST | `/api/auth/signup` | 회원가입 | ❌ |
| POST | `/api/auth/login` | 로그인 (JWT 발급) | ❌ |
| POST | `/api/auth/refresh` | 토큰 갱신 | ❌ |
| POST | `/api/auth/logout` | 로그아웃 | ✅ |

### 3.2 생성된 파일 목록

**Domain - Member**
- `domain/member/entity/Member.java` - 회원 엔티티
- `domain/member/entity/Role.java` - 권한 enum (USER, ADMIN)
- `domain/member/entity/RefreshToken.java` - Refresh Token 엔티티
- `domain/member/repository/MemberRepository.java`
- `domain/member/repository/RefreshTokenRepository.java`

**Domain - Auth**
- `domain/auth/controller/AuthController.java` - 인증 API 컨트롤러
- `domain/auth/service/AuthService.java` - 인증 비즈니스 로직
- `domain/auth/dto/SignUpRequest.java` - 회원가입 요청 DTO
- `domain/auth/dto/LoginRequest.java` - 로그인 요청 DTO
- `domain/auth/dto/TokenResponse.java` - 토큰 응답 DTO
- `domain/auth/dto/RefreshTokenRequest.java` - 토큰 갱신 요청 DTO

**Global - Security**
- `global/config/SecurityConfig.java` - Spring Security 설정
- `global/security/jwt/JwtTokenProvider.java` - JWT 생성/검증
- `global/security/jwt/JwtAuthenticationFilter.java` - JWT 인증 필터
- `global/security/UserDetailsServiceImpl.java` - Spring Security UserDetailsService
- `global/security/JwtAuthenticationEntryPoint.java` - 401 응답 처리
- `global/security/JwtAccessDeniedHandler.java` - 403 응답 처리

### 3.3 수정된 파일 목록

- `build.gradle` - Spring Security, JWT 의존성 추가
- `db_schema.sql` - members, refresh_token 테이블 추가
- `application.yml` - JWT 설정 추가
- `.env.example` - JWT_SECRET 환경변수 추가
- `global/exception/ErrorCode.java` - AUTH 관련 에러 코드 추가
- `global/exception/GlobalExceptionHandler.java` - 예외 핸들러 추가

### 3.4 토큰 설정

| 토큰 타입 | 만료 시간 |
|----------|----------|
| Access Token | 30분 |
| Refresh Token | 7일 |

## 4. 결과 및 적용 (Result)

### 4.1 주요 구현 사항

1. **JWT 기반 Stateless 인증**
   - Access Token + Refresh Token 이중 토큰 전략
   - BCrypt를 이용한 비밀번호 암호화

2. **예외 처리 강화**
   - JWT 형식 오류, 만료, Body 누락 등 다양한 예외 상황에 대해 적절한 HTTP 상태 코드와 에러 메시지 반환
   - 기존 500 에러 → 400/401/403 등 적절한 상태 코드로 변환

3. **테이블 이름 변경**
   - MySQL 예약어 문제로 `member` → `members`로 변경

### 4.2 추가 고려사항

- 현재 로그아웃 후에도 Access Token 만료 전까지 유효함 (JWT 특성)
- 보안 강화가 필요할 경우 토큰 블랙리스트 구현 고려
- 소셜 로그인, 이메일 인증 등 추후 확장 가능한 구조

### 4.3 환경 설정 필요사항

`.env` 파일에 다음 환경변수 추가 필요:
```
JWT_SECRET=your_jwt_secret_key_must_be_at_least_32_characters_long
```

### 4.4 API 사용 예시

```bash
# 회원가입
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"mypassword123","name":"홍길동","phone":"010-1234-5678"}'

# 로그인
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"mypassword123"}'

# 로그아웃 (토큰 필요)
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer {accessToken}"

# 토큰 갱신
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"{refreshToken}"}'
```
