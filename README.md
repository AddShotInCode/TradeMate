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

### Week 4 (26.01.12 - 01.18)

**작업 내역** (필수)

**FE**

- **회원가입 페이지 구현**: `tmp_registration.html` 기반으로 `/register` UI 구성 및 로그인 페이지에서 회원가입으로 이동 플로우 연결.
- **이메일 인증(실동작) 구현**: 6자리 인증번호 발송/검증 API 연동, 5분 TTL + 카운트다운 표시, 6자리 입력 시 자동 검증 UX 적용.
- **약관/개인정보 처리방침 모달 연동**: 텍스트 파일을 API로 읽어 중앙 팝업으로 노출하고 문서 가독성(정리/줄바꿈) 개선.
- **입력 검증/UX 정비**: 생년월일(연/월/일 드롭다운, 연도 범위 자동 갱신), 비밀번호 규칙(영문/숫자/특수기호 포함 8자 이상), 비밀번호 확인 일치, 전화번호(빈칸 또는 숫자 11자리) 검증에 따라 제출 버튼 활성화.
- **회원정보 페이지(/account) 구현**: 개인 정보/보안 설정 화면 추가 및 사이드바 최하단 사용자 이름 버튼에서 회원정보 페이지로 이동하도록 연결.
- **회원정보 검증/입력 제한**: 이메일 비활성화, 생년월일 범위/형식 회원가입과 정합성 유지, 저장 시 오류 검증 + 첫 오류 입력칸 포커스 이동.
- **시뮬레이션 페이지 개선**: 통화 단위를 원화(₩)로 일괄 적용하고, 주문 입력 유효성(음수 방지/최소값) 및 더미 데이터 스케일을 일봉 기준으로 조정.

**BE**

- **프로젝트 구조 분석 및 도메인 확장**: 기존 src 디렉토리 구조를 분석하여 statements(재무제표) 패키지를 신규 설계하고, 전체 프로젝트의 아키텍처 정합성 확인.
- **기업 재무정보 수집 시스템 구축**: Spring Boot 3.x, Java 21, Gradle, MySQL 연동 및 JPA Auditing 등 기본 서버 환경 구성 완료.
    - 금융위원회 '기업 재무정보' OpenAPI 연동을 위한 FinancialStatementApiClient 개발.
    - 재무제표 데이터(FinancialStatement) 저장을 위한 Entity 및 Repository 설계.
    - 법인등록번호 매핑 로직을 포함한 FinancialStatementService 구현.
- **REST API 엔드포인트 구현**: 외부에서 재무 데이터를 조회하고 DB에 저장할 수 있는 컨트롤러 및 DTO 구조 확립.
    
- **환경 설정 및 보안 고도화**: API 쿼리 파라미터 규칙, 데이터 락인(Lock-in) 프로세스 및 High/Low Service 계층 분리 전략 마련.
    - spring-boot-dotenv 라이브러리를 활용하여 API Key, URL 등 민감 정보를 .env 파일로 분리 관리.
    - 주식 시세 API와 재무제표 API의 설정(Base URL, Service Key)을 명확히 분리하여 유지보수성 향상.
**AI 활용** (필수)

**FE**

- **UI 초안 생성 및 한글 문구 정리**: 계정 설정 화면 레이아웃을 빠르게 구성하고, 서비스 톤앤매너에 맞게 문구를 자연스럽게 다듬는 데 활용.
- **검증 규칙 정합성 점검**: 회원가입 페이지의 입력 제한 규칙을 기준으로 회원정보 페이지에 동일 규칙을 재적용하는 과정에서 누락/불일치 포인트를 빠르게 체크.
- **시뮬레이션 로컬라이징 보완**: 통화/데이터 스케일 변경(원화/일봉) 포인트를 빠르게 정리하고, 입력 유효성 검사 누락을 점검.

**BE**

- **아키텍처 설계 및 단계별 가이드**: 신규 기능 구현을 위한 8단계 프로세스(패키징부터 설정까지)를 수립하여 개발 방향성 제시.
- **코드 생성 및 로직 고도화**: AI 모듈 없이 구현 가능한 Brute-force 기반 가중치 재조정 및 MFE/MAE 분석을 통한 손익 구간 최적화 논리 검토 및 수립.
    - API 명세를 바탕으로 복잡한 JSON 응답 구조를 처리하는 DTO 및 Client 코드를 자동 생성하여 개발 속도 단축.
    - CompanyNotFoundException 등 전역 예외 처리기와 연동되는 커스텀 예외 로직 설계.
- **코드 리뷰 및 전략 준수 확인**: coding_strategy.md 가이드라인에 따라 네이밍 규칙, JPA 활용 방식, Optional 처리 등이 적절히 적용되었는지 전수 검토 및 피드백.
- **환경 변수 최적화**: .env 파일 내 변수 명명 규칙 제안 및 application.yml과의 유연한 연결 로직(Placeholder 활용) 구현.

**완료 기능**

**FE**

- 회원가입 페이지 UI 및 이메일 인증 플로우
- 약관/개인정보 처리방침 모달 연동
- 회원정보 페이지(/account) UI
- 사이드바 최하단 사용자 버튼 → /account 라우팅 연결
- 회원정보 입력 제한(이메일 비활성화, 생년월일 범위/형식, 전화번호/비밀번호 규칙) 및 저장 시 검증 UX
- 시뮬레이션 페이지 UI(차트/컨트롤/주문/로그/통계) 및 원화 표기/입력 유효성(음수 방지) 적용

**BE**

- 재무제표 데이터 모델링 및 DB 스키마 정의 (FinancialStatement)
- 공공데이터 OpenAPI 기반 재무제표 수집 로직
- 재무제표 조회 및 수집 API (/api/statements/**)
- 보안 강화를 위한 .env 기반 환경 설정 시스템
- coding_strategy.md 기반의 백엔드 코드 컨벤션 정립

**커밋 로그**

**FE**

- feat: 회원가입 페이지 추가
- feat: simulation-page 구현
- feat: 사이드바 충돌 해결

**BE**

- feat: 기업 재무제표 API 제작

**테스트 결과**

**FE**

- 회원가입 페이지에서 이메일 인증번호 발송/만료/재발송 UI 동작 확인
- 회원정보 페이지에서 이메일 비활성화 및 생년월일/전화번호/비밀번호 입력 제한 동작 확인
- 저장 버튼 클릭 시 에러 발생 입력칸으로 포커스 이동 및 안내 문구 노출 확인
- 시뮬레이션 페이지에서 원화 표기, 차트/컨트롤 동작, 주문 입력 음수 방지 동작 확인

**BE**

- FinancialStatementApiClient를 통한 외부 API 호출 및 데이터 수신 확인 완료.
- .env에 설정된 환경 변수가 application.yml을 통해 정상적으로 주입됨을 확인.
- 재무제표 데이터의 DB 저장 및 REST API 반환 결과 정상 작동 확인.

**링크**

**FE**

- [회원가 페이지 추가](https://github.com/AddShotInCode/TradeMate_FE/pull/8)
- [Simulation Page 구현](https://github.com/AddShotInCode/TradeMate_FE/pull/9)

**BE**

- [기업 요약 재무제표 API 제작](https://github.com/AddShotInCode/TradeMate_BE/pull/8)

**다음 주 계획** (필수)

1. 백과 프론트 연결
    1. 회원가입, 회원 정보 DB
    2. 주식 정보, 기업 정보 화면에 띄우기
2. 규칙, 시뮬레이션 구현 시작
3. 백엔드
    1. 시뮬레이션 알고리즘 구체화
4. 프론트엔드
    1. 기록(구 계정)페이지 구현
    2. 분석 페이지 구현
    3. 백이랑 연결 후 디테일 다듬기

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
