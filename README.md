# TradeMate

<h3>
<b>운을 배제하고 실력을 만드는 올바른 매매 습관 형성 플랫폼</b>
</h3>

## 개요

**TradeMate**는 투자자가 감이나 운에 의존하는 '뇌동매매'를 멈추고, 자신만의 원칙을 세워 검증할 수 있도록 돕는 트레이딩 훈련 플랫폼입니다.

## 핵심 기능

### 훈련 및 시뮬레이션

### 뇌동매매 원천 차단 시스템

- 사용자가 진입 근거(사유)와 손절/목표가를 입력하지 않으면 주문 자체가 불가능합니다.
- 매매 버튼을 누르는 순간 시스템이 강제로 원칙 작성을 요구하여 신중한 매매 습관을 기릅니다.

### 타임머신 블라인드 리플레이

- **블라인드 모드**: 특정 과거 시점 이후의 데이터를 가려, 미래를 모르는 상태에서 실전처럼 훈련합니다.
- **가변 배속 조절**: 1배속부터 고배속, 캔들 단위 넘기기(Step) 기능을 통해 주말이나 장 마감 후에도 효율적인 훈련이 가능합니다.

### 시나리오 기반 가상 체결

- 실제 호가창의 슬리피지와 수수료를 반영한 정교한 가상 체결 시스템을 제공합니다.
- 매수 시점에 설정한 대응 시나리오(손절/익절)를 시스템이 기억하고 추적합니다.

### 분석 및 평가

### Process 중심의 평가 리포트

- 단순 수익률 경쟁이 아닌, '원칙 준수율'을 평가합니다.
- 수익이 났더라도 원칙을 어긴 매매는 감점 처리되어 운으로 번 돈을 실력에서 배제합니다.
- 손익비, 승률, 원칙 이행률을 종합 분석하여 트레이더 등급을 산정합니다.

### 매매 마킹 리플레이 & 복기

- 훈련 종료 후, 가려졌던 미래 차트가 공개되며 사용자의 매수/매도 타점이 차트 위에 자동 마킹됩니다.
- 진입 당시 작성했던 근거와 실제 차트 흐름을 한 화면에서 비교하며 논리적인 복기가 가능합니다.

## 기술 스택

<!-- Frontend -->

### Frontend

- **Framework**: Next.js

- **Language**: TypeScript

- **Styling**: Tailwind CSS

- **Design**: Google Stitch

<!-- Backend -->

### Backend

- **Server Framework**: Spring Boot
- **language**: Java
- **Database**: MySQL

## 주간 진행 상황

### Week 1 (24.12.22 - 12.28)

**작업 내역** (필수)

**FE / BE**

- **기술 명세서 작성**: 프로젝트 개발 방향성 수립 및 기술 스택 확정.
- **아키텍처 설계**: 폴더 구조 및 컴포넌트 설계 원칙 수립
- **데이터 모델링**: 사용자(User), 매매(Trade), 시뮬레이션(Simulation) 등 핵심 엔티티 정의.
- **컨벤션 수립**: Git 워크플로우, 커밋 메시지 규칙, 코딩 컨벤션 등 협업 가이드라인 마련.

**AI 활용** (필수)

- **문서 구조화**: 기술 명세서 목차(개요-아키텍처-상세설계) 구성 및 초안 작성 요청.
- **아키텍처 제안**: FSD 아키텍처의 장단점 분석 및 프로젝트 규모에 맞는 변형 구조 추천 받음.

**완료 기능**

- 기술 명세서 문서
- 데이터 모델 ERD 초안

**커밋 로그**

- docs: 기술 명세서(technical_specification.md) 작성

**링크**

- [기술 명세서 작성](https://github.com/AddShotInCode/TradeMate_FE/pull/1)
- [기술 명세서 작성](https://github.com/AddShotInCode/TradeMate_BE/pull/1)

**다음 주 계획** (필수)

**FE**

- Next.js 프로젝트 초기 세팅 및 라이브러리 설치
- 공통 UI 컴포넌트 환경(shadcn/ui) 구성

**BE**

- 프로젝트 프로토타입 제작

### Week 2 (24.12.29 - 01.04)

**작업 내역** (필수)

**FE**

- **프로젝트 초기 설정**: Next.js 16 + Tailwind CSS v4 기반 프로젝트 스캐폴딩.
- **라이브러리 세팅**: Zustand, React Hook Form, Zod, Lightweight Charts 등 핵심 라이브러리 설치.
- **기반 코드 구현**: `cn` 유틸리티(Tailwind Merge), 폰트 설정, 다크 모드 설정, 절대 경로 Alias 설정.
- **초기 UI 작업**: 메인 레이아웃 및 사이드바 번역 작업 진행.

**BE**

- **프로젝트 초기 설정**: Spring Boot 3.3 + Java 21 기반 백엔드 환경 구축.
- **라이브러리 세팅**: Spring Data JPA, QueryDSL(동적 쿼리), MySQL Connector, Spring Dotenv(환경변수) 등 핵심 의존성 추가.
- **기반 코드 구현**: 도메인 주도 설계(DDD)에 따른 패키지 구조화(simulation, order, candle, report), CORS 설정(WebConfig), 예외 처리 핸들러 구현.
- **데이터 파이프라인**: 한국투자증권(KIS) API 연동 및 대용량 캔들 데이터 조회/적재 로직 구현.

**AI 활용** (필수)

**FE**

- **설정 파일 생성**: `globals.css` (Tailwind v4), `tsconfig.json`, `tailwind.config.ts` 등의 설정 파일 코드 자동 생성.
- **버전 호환성 체크**: Next.js 16과 호환되는 라이브러리 버전 확인 및 의존성 해결.

**BE**

- **복잡한 쿼리 작성**: QueryDSL을 활용한 시뮬레이션 타임머신(Time-Travel) 및 기간 내 최저가/최고가 집계 쿼리 최적화.
- **설정 파일 관리**: 보안을 위한 application.yml과 application-secret.yaml 분리 및 .env 파일 연동 가이드 적용.
- **에러 디버깅**: 의존성 주입 실패(UnsatisfiedDependencyException) 및 DB 접속 에러(Access denied) 해결.

**완료 기능**

**FE**

- 프로젝트 실행 환경 (Dev Server 동작 확인)
- 기본 디렉토리 구조 (`src/app`, `src/components`)

**BE**

- 시뮬레이션 세션 생성 및 종료 (Session Management)
- 가상 시간 기반 차트 데이터 조회 (Time Travel API)
- 매수/매도 주문 체결 및 잔고 동기화 (Atomic Order Processing)

**커밋 로그**

**FE**

- chore: Next.js 프로젝트 초기화 및 라이브러리 설치
- feat: Tailwind CSS v4 설정 및 글로벌 스타일 적용
- chore: 디렉토리 구조 생성 및 절대 경로 설정

**BE**

- feat: prototype 제작 완료

**테스트 결과**

**FE**

- `npm run dev` 실행 시 메인 페이지 정상 렌더링 확인.
- Tailwind 클래스 적용 및 다크 모드 전환 동작 확인.

**BE**

- TradeMateApplication 서버 정상 실행 (Tomcat Port 8080) 확인.
- MySQL 데이터베이스 연결(HikariCP) 및 스키마 자동 생성(DDL Auto) 성공.

**링크**

**FE**

- [프로젝트 세팅](https://github.com/AddShotInCode/TradeMate_FE/pull/2)

**BE**

- [백엔드 프로토타입 제작](https://github.com/AddShotInCode/TradeMate_BE/pull/2)

**다음 주 계획** (필수)

- 인덱스(랜딩) 페이지 UI 구현
- 로그인 페이지 개발 및 라우팅 처리

### Week 3 (26.01.05 - 01.11)

**작업 내역** (필수)

**FE**

- **인덱스(랜딩) 페이지 구현**: Hero, Stats, Features, Workflow, CTA, Footer 등 전체 섹션 UI 구축 및 반응형 디자인 적용.
- **로그인 페이지 구현**: 기존 디자인 언어를 유지한 로그인 UI 개발, 비밀번호 토글 및 입력 폼 컴포넌트(`input.tsx`) 구현.
- **주식 조회 페이지 구현**: 관심 종목의 상세정보를 수치로 확인, 차트를 통한 시각화 구현.
- **원칙 설정 페이지 구현**: 사용자가 단계별로 자신만의 투자 원칙을 정의하는 페이지 구현.
- **UI/UX 개선**: 한글 톤앤매너 수정(번역투 개선), 로고 컴포넌트(`Logo.tsx`) 분리, 불필요한 데모 버튼 및 요금제 섹션 제거.
- **법적 고지 추가**: 데이터 신뢰도 확보를 위해 공공데이터(금융위원회) 활용 출처 명시.

**BE**

- **기술 명세서 및 아키텍처 수립**: 가중치 기반 다중 지표 진입 시스템, 전략 최적화 엔진의 상세 명세 확정 및 Spring Boot 기반 아키텍처 설계.
- **프로젝트 환경 구축**: Spring Boot 3.x, Java 21, Gradle, MySQL 연동 및 JPA Auditing 등 기본 서버 환경 구성 완료.
- **주식 데이터 수집 시스템 구현**:
  - 금융위원회 '주식시세정보' OpenAPI 연동 Client 개발 (`RestTemplate` 활용).
  - 종목(`Stock`) 및 일별 시세(`DailyPrice`) 정규화 DB 설계 및 Entity/Repository 구현.
  - 1년치 과거 데이터 적재(Init) 및 매일 당일 시세 업데이트(Update) 로직 구현.
  - 데이터 생명주기 관리(1년 경과 데이터 자동 삭제)를 위한 스케줄러(`@Scheduled`) 적용.
- **컨벤션 수립**: API 쿼리 파라미터 규칙, 데이터 락인(Lock-in) 프로세스 및 High/Low Service 계층 분리 전략 마련.

**AI 활용** (필수)

**FE**

- **보일러플레이트 생성**: 디자인 명세를 바탕으로 HeroSection, `FeaturesSection` 등 주요 컴포넌트의 초안 코드를 AI로 자동 생성하여 개발 시간 단축.
- **리팩토링 제안**: 반복되는 로고 및 Input 요소를 감지하고 재사용 가능한 컴포넌트로 분리하는 리팩토링 수행.
- **컨텐츠 최적화**: 프로토타입 데이터를 실제 서비스 맥락('훈련', '원칙 준수')에 맞는 문구로 자연스럽게 다듬는 데 활용.

**BE**

- **로직 고도화 및 체계화**: 단순 복기 서비스에서 '전략 최적화 엔진'으로 서비스 가치를 격상시키기 위한 가중치 채점 알고리즘 및 기여도 대비 효율 정렬 로직 구체화.
- **수학적 최적화 알고리즘 설계**: AI 모듈 없이 구현 가능한 Brute-force 기반 가중치 재조정 및 MFE/MAE 분석을 통한 손익 구간 최적화 논리 검토 및 수립.
- **트러블 슈팅 및 디버깅**:
  - 공공데이터 API의 XML/JSON 응답 혼재 문제 해결을 위한 Raw Response 로깅 전략 제안 및 적용.
  - `Stock` 정보(종목명 등) 누락 문제 해결을 위한 Dirty Checking 기반 업데이트 로직 수정.
  - 인증키 인코딩/디코딩 이슈 분석을 통한 `UriComponentsBuilder` 설정 최적화.

**완료 기능**

**FE**

- 메인 랜딩 페이지 (반응형 웹 지원)
- 로그인 페이지 UI 및 라우팅 연결
- 공통 UI 컴포넌트 (Button, Input, Logo)
- 네비게이션 스크롤 이동 및 메뉴 순서 최적화
- 주식조회, 원칙설정 페이지 UI

**BE**

- [TradeMate] 백엔드 기술 명세서 (전략 최적화 및 원칙 평가 엔진 포함)
- 지표별 누적 성적표 및 효율 점수 산출 로직 설계
- 수학적 기대값 기반의 원칙 추천 알고리즘 정의
- Spring Boot 서버 및 MySQL DB 연동 완료
- 주식 시세 데이터 자동 수집 및 적재 시스템 (초기화/갱신/삭제)
- OpenAPI 연동 예외 처리 및 로깅 시스템

**커밋 로그**

- feat: 인덱스 페이지 초기 구현 (Hero, Stats, Features)
- refactor: 로고 컴포넌트 분리 및 전역 적용
- feat: 로그인 페이지 UI 구현 및 라우팅 연결
- fix: 모바일 가독성 개선, 불필요한 데모 버튼 삭제
- feat: 주식조회, 원칙설정 페이지 컴포넌트 기반 구현
- feat: 백엔드 프로젝트 초기 설정 및 DB 스키마(Stock, DailyPrice) 구현
- feat: 공공데이터 API 연동 Client 및 데이터 수집 Service 로직 구현

**테스트 결과**

- (스크린샷 첨부 예정: 완성된 랜딩 페이지 및 로그인 화면)
- 모바일/데스크탑 환경에서 레이아웃 깨짐 없이 반응형 동작 확인함.
- 네비게이션 링크 및 '서비스 소개' 섹션 스크롤 이동 정상 작동함.

**링크**

**FE**

- [인덱스 페이지 및 로그인 페이지 추가](https://github.com/AddShotInCode/TradeMate_FE/pull/4)
- [InquiryPage, PropensityPage 제작 완료](https://github.com/AddShotInCode/TradeMate_FE/pull/6)

**BE**

- [주식 시세 데이터 수집 기능 구현](https://github.com/AddShotInCode/TradeMate_BE/pull/3)

**다음 주 계획** (필수)

- 메인 대시보드 레이아웃 수정
- 백엔드와 주식 데이터 연동
- 차트 라이브러리 도입 및 테스트
- 로그인 연결
- 디자인 통일
- 기업 재무정보 API 제작

## 팀원 소개

<div align="center">
<table>
<thead>
<tr>
<th style="text-align:center;"><a href="https://github.com/yyouseong">양윤성</a></th>
<th style="text-align:center;"><a href="https://github.com/Reighnex">박태훈</a></th>
<th style="text-align:center;"><a href="https://github.com/dib3474">문수호</a></th>
<th style="text-align:center;"><a href="https://github.com/RainDrop3">강민규</a></th>
</tr>
</thead>
<tbody>
<tr>
<td align="center"><img src="https://avatars.githubusercontent.com/u/53364172?v=4" width="150" height="150" alt="양윤성"></td>
<td align="center"><img src="https://avatars.githubusercontent.com/u/71837588?v=4" width="150" height="150" alt="박태훈"></td>
<td align="center"><img src="https://avatars.githubusercontent.com/u/95611065?v=4" width="150" height="150" alt="문수호"></td>
<td align="center"><img src="https://avatars.githubusercontent.com/u/110617720?v=4" width="150" height="150" alt="강민규"></td>
</tr>
<tr>
