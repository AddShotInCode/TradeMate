# SEO 최적화 - 메타데이터 추가

## 1. 배경 및 목적

- TradeMate 웹사이트의 검색 엔진 가시성 향상 필요
- 소셜 미디어 공유 시 적절한 미리보기 표시 필요
- Next.js 14+ App Router의 Metadata API를 활용한 체계적인 SEO 구현
- 페이지별 적절한 인덱싱 정책 설정 (공개 페이지 vs 인증 필요 페이지)

## 2. 프롬프트 (User Input)

```text
SEO 최적화를 위한 메타데이터를 추가해줘.
```

## 3. AI 응답 요약 (AI Output)

### 목표
Next.js Metadata API를 활용한 포괄적인 SEO 최적화:
1. `robots.txt` 및 `sitemap.xml` 자동 생성
2. 루트 레이아웃에 기본 메타데이터 설정
3. 각 페이지별 개별 메타데이터 추가
4. Open Graph 및 Twitter Card 메타데이터 구성

### 구현 내용

#### 1. Robots.txt 생성 (`src/app/robots.ts`)
- Next.js Metadata API를 사용한 동적 생성
- 공개 페이지(/, /login, /register, /policy/*) 크롤링 허용
- 인증 필요 페이지(/dashboard, /simulation, /account) 크롤링 차단
- Sitemap URL 자동 지정

#### 2. Sitemap.xml 생성 (`src/app/sitemap.ts`)
- 모든 공개 페이지 포함
- 적절한 우선순위 설정:
  - 홈페이지: Priority 1.0, 월간 업데이트
  - 로그인/회원가입: Priority 0.5, 연간 업데이트
  - 정책 페이지: Priority 0.3, 월간 업데이트

#### 3. 루트 레이아웃 메타데이터 강화 (`src/app/layout.tsx`)
```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://trademate.io'),
  title: {
    template: '%s | TradeMate',
    default: 'TradeMate - 원칙 중심의 주식 매매 훈련',
  },
  description: '체계적인 주식 매매 훈련 플랫폼...',
  keywords: ['주식 매매 훈련', '트레이딩 시뮬레이션', ...],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: 'TradeMate',
    description: '...',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradeMate',
    description: '...',
  },
};
```

#### 4. 페이지별 메타데이터 설정
총 11개 페이지에 개별 메타데이터 추가:
- **공개 페이지** (인덱싱 허용): 홈, 정책 페이지
- **비공개 페이지** (인덱싱 차단): 대시보드, 시뮬레이션, 계정, 로그인, 회원가입 등

### 기술적 제약 및 해결
- **클라이언트 컴포넌트 제약**: `"use client"` 사용 페이지는 `metadata` export 불가
- **해결책**: 루트 레이아웃의 기본 메타데이터 사용 + `robots.ts`에서 인덱싱 제어

## 4. 결과 및 적용 (Result)

### 적용 완료
- ✅ `robots.ts` 파일 생성 - 자동 robots.txt 생성
- ✅ `sitemap.ts` 파일 생성 - 자동 sitemap.xml 생성
- ✅ 루트 레이아웃 메타데이터 강화 (Open Graph, Twitter Card)
- ✅ 11개 페이지에 개별 메타데이터 설정
- ✅ implementation_plan.md에 계획 문서화
- ✅ walkthrough.md에 결과 문서화

### SEO 개선 효과
1. **검색 엔진 최적화**:
   - 적절한 title, description으로 검색 결과 노출 개선
   - Keywords 설정으로 관련 검색어 타겟팅
   - Sitemap 제공으로 크롤링 효율성 향상

2. **소셜 미디어 최적화**:
   - Open Graph 메타데이터로 Facebook, LinkedIn 등에서 풍부한 미리보기 제공
   - Twitter Card로 트위터 공유 시 매력적인 카드 표시

3. **보안 및 프라이버시**:
   - 인증 필요 페이지는 검색 엔진 인덱싱 차단
   - 사용자별 동적 콘텐츠 검색 노출 방지

### 파일 구조
```
src/app/
├── robots.ts                    # Robots.txt 생성
├── sitemap.ts                   # Sitemap.xml 생성
├── layout.tsx                   # 루트 메타데이터
├── page.tsx                     # 홈페이지 메타데이터
├── dashboard/page.tsx           # 대시보드 메타데이터
├── simulation/page.tsx          # 시뮬레이션 메타데이터
└── policy/
    ├── privacy/page.tsx         # 개인정보처리방침 메타데이터
    └── terms/page.tsx           # 이용약관 메타데이터
```

### 배운 점
- Next.js 14+ Metadata API의 강력함과 편의성
- Server Component에서만 `metadata` export 가능한 제약
- SEO를 위한 페이지별 인덱싱 정책 수립의 중요성
- Open Graph와 Twitter Card의 차이점 및 활용 방법
- `metadataBase` 설정으로 절대 URL 자동 생성 가능

### 향후 개선사항
- Open Graph 이미지 생성 (1200x630px, TradeMate 브랜딩)
- Google Search Console 및 Naver 웹마스터 도구 등록
- 실제 도메인으로 `metadataBase` 업데이트
- 검색 엔진 사이트 인증 코드 추가
