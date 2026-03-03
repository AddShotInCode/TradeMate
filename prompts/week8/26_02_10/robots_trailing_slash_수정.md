# Robots.ts Trailing Slash 문제 수정

## 1. 배경 및 목적

- SEO 최적화 작업 후, `robots.ts` 파일에서 잠재적인 URL 구성 문제 발견
- `NEXT_PUBLIC_SITE_URL` 환경 변수가 trailing slash(`/`)를 포함할 경우, sitemap URL에 이중 슬래시(`//`)가 발생할 수 있음
- URL 정규화를 통해 환경 변수 값에 관계없이 항상 올바른 sitemap URL 생성 필요

## 2. 프롬프트 (User Input)

```text
If NEXT_PUBLIC_SITE_URL is configured with a trailing slash, ${siteUrl}/sitemap.xml will produce a double slash in the sitemap URL. Consider normalizing siteUrl (trim trailing slash) before constructing the sitemap URL.
```

## 3. AI 응답 요약 (AI Output)

### 문제 분석
`robots.ts` 파일의 기존 코드:
```typescript
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trademate.io";
// ...
sitemap: `${siteUrl}/sitemap.xml`,
```

만약 `NEXT_PUBLIC_SITE_URL`이 `https://trademate.io/`로 설정된 경우:
- 결과: `https://trademate.io//sitemap.xml` ❌
- 예상: `https://trademate.io/sitemap.xml` ✅

### 해결 방법
정규 표현식을 사용하여 trailing slash 제거:
```typescript
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://trademate.io").replace(/\/$/, "");
```

- `.replace(/\/$/, "")`: 문자열 끝의 슬래시를 빈 문자열로 치환
- 이제 `NEXT_PUBLIC_SITE_URL`에 trailing slash가 있어도 안전하게 제거됨

## 4. 결과 및 적용 (Result)

### 적용 완료
- ✅ `src/app/robots.ts` 파일 수정
- ✅ siteUrl 정규화 로직 추가
- ✅ 환경 변수 값에 관계없이 올바른 sitemap URL 생성 보장

### 개선 효과
1. **견고성 향상**: 
   - 환경 변수 설정 실수에도 올바른 URL 생성
   - `https://trademate.io` 또는 `https://trademate.io/` 모두 정상 동작

2. **유지보수성 개선**:
   - 환경 변수 값의 형식을 신경 쓰지 않아도 됨
   - 개발/스테이징/프로덕션 환경에서 일관된 동작 보장

3. **SEO 영향 최소화**:
   - 이중 슬래시로 인한 잘못된 sitemap URL 방지
   - 검색 엔진이 sitemap을 올바르게 찾을 수 있음

### 수정 전후 비교
```diff
- const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trademate.io";
+ const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://trademate.io").replace(/\/$/, "");
```

### 배운 점
- 환경 변수를 URL로 사용할 때는 항상 정규화 필요
- 정규 표현식 `/\/$/`는 문자열 끝의 슬래시를 매칭
- 작은 입력 검증 로직이 큰 버그를 방지할 수 있음
- URL 구성 시 방어적 프로그래밍의 중요성
