# Canonical URL SEO 문제 수정

## 1. 배경 및 목적

- SEO 최적화 작업 중, 루트 레이아웃에 설정된 canonical URL이 모든 페이지에 동일하게 적용되는 중대한 SEO 문제 발견
- `alternates.canonical: "/"`가 루트 레이아웃에 있어 모든 페이지(대시보드, 시뮬레이션 등)가 홈페이지를 canonical로 지정하게 됨
- 검색 엔진이 각 페이지를 개별적으로 인덱싱하지 못하고 모두 중복 콘텐츠로 간주할 위험
- 각 페이지가 자신만의 canonical URL을 가질 수 있도록 구조 개선 필요

## 2. 프롬프트 (User Input)

```text
alternates.canonical is set to "/" in the root layout metadata. Since this layout wraps all routes, it will emit the same canonical URL for every page unless overridden, which can cause major SEO canonicalization problems. Consider removing canonical from the root layout or generating a per-route canonical (e.g., via generateMetadata using the current pathname).
```

## 3. AI 응답 요약 (AI Output)

### 문제 분석
루트 레이아웃(`src/app/layout.tsx`)의 기존 코드:
```typescript
export const metadata: Metadata = {
  // ... other metadata
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://trademate.io"),
  alternates: {
    canonical: "/",  // ❌ 모든 페이지에 동일한 canonical 적용
  },
  // ...
};
```

**문제점**:
- `/dashboard` 페이지도 canonical이 `/`로 설정됨
- `/simulation` 페이지도 canonical이 `/`로 설정됨
- 검색 엔진은 모든 페이지를 홈페이지의 중복으로 간주
- 각 페이지가 검색 결과에 제대로 노출되지 않음

### 해결 방법

#### 1. 루트 레이아웃에서 canonical 제거
```typescript
export const metadata: Metadata = {
  // ... other metadata
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://trademate.io"),
  // alternates.canonical 제거 ✅
  // ...
};
```

#### 2. 홈페이지에 명시적으로 canonical 추가
`src/app/page.tsx`:
```typescript
export const metadata: Metadata = {
  title: "TradeMate - 원칙 중심의 주식 매매 훈련 플랫폼",
  description: "...",
  alternates: {
    canonical: "/",  // ✅ 홈페이지만 "/"를 canonical로 지정
  },
  openGraph: {
    // ...
  },
};
```

이제 각 페이지는:
- 자체 canonical을 설정할 수 있음
- 설정하지 않으면 현재 경로가 기본값으로 사용됨
- 검색 엔진이 각 페이지를 올바르게 인식

## 4. 결과 및 적용 (Result)

### 적용 완료
- ✅ `src/app/layout.tsx`에서 `alternates.canonical` 제거
- ✅ `src/app/page.tsx`에 `alternates.canonical: "/"` 추가
- ✅ 각 페이지가 독립적인 canonical URL 설정 가능

### SEO 개선 효과

1. **정확한 페이지 인덱싱**:
   - 각 페이지가 고유한 canonical URL을 가짐
   - 검색 엔진이 페이지를 중복으로 판단하지 않음
   - 모든 페이지가 검색 결과에 올바르게 노출됨

2. **유연한 메타데이터 관리**:
   - 페이지별로 canonical URL을 커스터마이즈 가능
   - 필요시 다른 URL을 canonical로 지정 가능
   - 동적 페이지에서 `generateMetadata` 사용 가능

3. **중복 콘텐츠 문제 해결**:
   - `/dashboard`의 canonical: `/dashboard`
   - `/simulation`의 canonical: `/simulation`
   - 각 페이지가 독립적으로 평가됨

### 수정 전후 비교

**수정 전** (잘못된 구조):
```
/ (홈)           → canonical: "/"  ✅
/dashboard      → canonical: "/"  ❌ (잘못됨)
/simulation     → canonical: "/"  ❌ (잘못됨)
/account        → canonical: "/"  ❌ (잘못됨)
```

**수정 후** (올바른 구조):
```
/ (홈)           → canonical: "/"           ✅
/dashboard      → canonical: "/dashboard"  ✅
/simulation     → canonical: "/simulation" ✅
/account        → canonical: "/account"    ✅
```

### 배운 점
- 루트 레이아웃의 메타데이터는 모든 하위 페이지에 상속됨
- canonical URL은 SEO에서 매우 중요한 요소
- 잘못된 canonical 설정은 검색 엔진 인덱싱을 완전히 망가뜨릴 수 있음
- Next.js의 메타데이터 우선순위: 페이지 > 레이아웃 (하위가 상위를 오버라이드)
- 공통 메타데이터는 루트 레이아웃에, 페이지별 메타데이터는 각 페이지에 설정하는 것이 베스트 프랙티스
