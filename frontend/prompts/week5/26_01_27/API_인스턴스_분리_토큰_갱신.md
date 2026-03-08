# API 인스턴스 분리 및 토큰 자동 갱신

## 1. 배경 및 목적

- 인증 시스템 구현 후, Access Token 만료 시 매번 수동으로 로그인해야 하는 불편함 존재
- Refresh Token을 활용한 자동 토큰 갱신 메커니즘이 필요
- API 요청 시 자동으로 토큰을 주입하고, 만료 시 갱신하는 중앙집중식 관리 필요
- `authService.ts`는 기본 Axios를 사용해야 하며(토큰 갱신 시 무한 루프 방지), 다른 서비스는 커스텀 인스턴스 사용

## 2. 프롬프트 (User Input)

```text
토큰 리프레시 기능 구현해줘
```

## 3. AI 응답 요약 (AI Output)

### 목표
JWT 토큰 자동 갱신 메커니즘을 구현하여 사용자 경험 개선:
1. Access Token 자동 주입
2. 401 에러 감지 시 자동 Refresh Token으로 갱신
3. 갱신 성공 시 원래 요청 재시도
4. 갱신 실패 시 자동 로그아웃

### 구현 내용

#### 1. Axios 인스턴스 생성 (`src/lib/axios.ts`)
- **Request Interceptor**: 쿠키의 Access Token을 `Authorization` 헤더에 자동 주입
- **Response Interceptor**: 
  - 401 에러 감지
  - Refresh Token으로 `/api/auth/refresh` 호출
  - 새 토큰으로 쿠키 업데이트
  - 원래 요청 재시도
  - 갱신 실패 시 로그아웃

#### 2. 서비스 파일 수정
- **`stockService.ts`**: 커스텀 Axios 인스턴스 사용
- **`statementService.ts`**: 커스텀 Axios 인스턴스 사용
- **`authService.ts`**: 기본 Axios 사용 유지 (인터셉터 간섭 방지)

### 주요 코드 구조
```typescript
// Request Interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token refresh logic
      const refreshToken = Cookies.get('refreshToken');
      const newTokens = await authService.refresh(refreshToken);
      // Retry original request
    }
  }
);
```

## 4. 결과 및 적용 (Result)

### 적용 완료
- ✅ `src/lib/axios.ts` 파일 생성
- ✅ `stockService.ts`, `statementService.ts`가 커스텀 인스턴스 사용
- ✅ `authService.ts`는 기본 Axios 사용하여 무한 루프 방지
- ✅ 토큰 갱신 실패 시 자동 로그아웃 처리
- ✅ implementation_plan.md에 구현 계획 문서화
- ✅ walkthrough.md에 구현 결과 문서화

### 사용자 경험 개선
1. **자동 토큰 관리**: API 요청 시 토큰이 자동으로 헤더에 추가
2. **무중단 사용**: Access Token 만료 시 백그라운드에서 자동 갱신
3. **보안 강화**: 토큰 갱신 실패 시 즉시 로그아웃으로 보안 유지
4. **코드 간소화**: 각 서비스에서 토큰 관리 로직 불필요

### 아키텍처 개선
- **관심사 분리**: 인증 로직과 비즈니스 로직 분리
- **중앙집중식 관리**: 모든 API 요청이 동일한 인터셉터를 통과
- **무한 루프 방지**: authService는 기본 Axios를 사용하여 토큰 갱신 시 인터셉터 미적용

### 배운 점
- Axios Interceptor를 활용한 횡단 관심사(Cross-Cutting Concerns) 처리
- Token Refresh 시 무한 루프를 방지하기 위한 인스턴스 분리 전략
- 401 에러 처리 및 원본 요청 재시도 패턴
- 쿠키 기반 토큰 관리의 장점 (서버사이드 Middleware 접근 가능)
