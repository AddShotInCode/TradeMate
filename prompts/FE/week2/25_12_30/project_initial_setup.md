# 프로젝트 초기 설정 및 라이브러리 추가

## 1. 배경 및 목적

- **배경**: TradeMate 프로젝트 개발을 시작하기 위해 Next.js 환경을 구축하고 기본 기술 스택을 설정했습니다.
- **목적**:
    1. **기반 환경 구축**: Next.js 16, Tailwind CSS v4 기반의 프로젝트 기본 구조 생성.
    2. **라이브러리 세팅**: Shadcn UI, Zustand(전역 상태), React Hook Form(폼 관리), Lightweight Charts(차트), Zod(유효성 검사) 등 핵심 라이브러리 설치.
    3. **스타일링 설정**: `globals.css`에 Tailwind v4 `@theme` 변수 및 다크 모드(Shadcn 호환) 설정 적용.
    4. **디렉토리 구조**: `src` 내부의 `components/ui`, `store`, `hooks`, `lib` 등 표준 폴더 구조 확립.

## 2. 프롬프트 (User Input)

```text
기술 명세서를 바탕으로 프로젝트 세팅 계획 작성해줘.
구축까지만 진행해줘
```

## 3. AI 응답 요약 (AI Output)

- **필수 파일 생성**: `package.json`에 필요한 `dependencies` 및 `devDependencies` 정의.
- **설정 파일 구성**:
    - `src/app/globals.css`: Tailwind v4 호환 CSS 변수 및 리셋 스타일 정의.
    - `src/app/layout.tsx`: 맑은 고딕/Inter 폰트 설정, Hydration 경고 제어(`suppressHydrationWarning`), `cn` 유틸리티 적용.
    - `tsconfig.json`: 절대 경로 import를 위한 `@/*` → `./src/*` Alias 설정.
    - `src/lib/utils.ts`: 스타일 병합을 위한 `cn` (clsx + tailwind-merge) 함수 구현.
- **패키지 설치 안내**: 터미널 이슈로 인한 자동 설치 실패 가능성을 고려하여 수동 `npm install` 가이드 제공.

## 4. 결과 및 적용 (Result)

- **초기 세팅 완료**: 프로젝트 개발에 필요한 스캐폴딩(Scaffolding)이 완료되었습니다.
- **최신 기술 스택 반영**: Next.js 16 + React 19 + Tailwind v4 조합으로 최신 프론트엔드 트렌드를 반영한 개발 환경이 준비되었습니다.
- **확장성 확보**: 공통 컴포넌트(`components/ui`)와 전역 상태(`store`)를 담을 디렉토리 구조를 미리 확보하여 향후 기능 개발이 용이해졌습니다.
