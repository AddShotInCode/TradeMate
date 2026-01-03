# 기술 명세서 작성

## 1. 배경 및 목적

- **배경**: TradeMate 프로젝트의 본격적인 개발에 앞서, 팀원 간의 기술적 합의와 명확한 개발 방향성을 수립하기 위해 상세한 기술 명세서가 필요했습니다.
- **목적**:
    1. **기술 스택 확정**: Frontend (Next.js 14+, Zustand, React Hook Form, Shadcn UI 등) 및 주요 라이브러리 버전 정의.
    2. **아키텍처 설계**: FSD(Feature-Sliced Design)를 변형한 폴더 구조 및 컴포넌트 설계 원칙 수립.
    3. **데이터 모델링**: 주요 도메인 엔티티(User, Trade, Simulation 등)의 타입 정의.
    4. **컨벤션 통일**: 코딩 컨벤션, Git 워크플로우, 커밋 메시지 규칙 등 협업 가이드라인 마련.

## 2. 프롬프트 (User Input)

```text
TradeMate 프로젝트의 프론트엔드 기술 명세서를 작성해줘.
주요 기능은 뇌동매매 방지, 타임머신 시뮬레이션, 매매 원칙 준수 평가야.
기술 스택은 Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, React-Query를 사용해.
디렉토리 구조랑 상태 관리 전략, 그리고 주요 컴포넌트 설계 내용도 포함해줘.
```

## 3. AI 응답 요약 (AI Output)

- **문서 구조 제안**: 개요 -> 시스템 아키텍처 -> 상세 설계 -> 데이터 모델 -> 개발 환경 설정 순의 목차 구성.
- **상세 내용 작성**:
    - **Tech Stack**: Next.js App Router 기반의 SSR/CSR 전략 구분, Zustand를 이용한 클라이언트 상태 관리, React-Query를 이용한 서버 상태 관리.
    - **Directory Structure**: `src/app` (라우팅), `src/components` (공통/도메인), `src/features` (기능 단위), `src/store` (전역 상태) 등 상세 트리 구조 명시.
    - **Key Features**: 차트 라이브러리(Lightweight Charts) 통합 방안, WebSocket 실시간 데이터 처리 등 핵심 기능 구현 방안 기술.

## 4. 결과 및 적용 (Result)

- **명세서 산출**: `docs/specification/tech_spec.md` 파일로 문서화 완료.
- **개발 기준 수립**: 이후 진행된 프로젝트 초기 세팅(Scaffolding) 및 라이브러리 설치의 근거 자료로 활용됨.
- **팀 싱크**: 개발 팀원들이 동일한 기술적 맥락을 이해하고 작업을 분담할 수 있는 기초 마련.
