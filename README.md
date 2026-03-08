# TradeMate

<h3>
<b>운을 배제하고 실력을 만드는 올바른 매매 습관 형성 플랫폼</b>
</h3>

## 개요

**TradeMate**는 투자자가 감이나 운에 의존하는 '뇌동매매'를 멈추고, 자신만의 원칙을 세워 검증할 수 있도록 돕는 트레이딩 훈련 플랫폼입니다.

## 핵심 기능

### 훈련 시스템

#### 뇌동매매 원천 차단 시스템

- 진입 근거(사유) 입력 없이는 주문이 불가능합니다.
- 손절가(Stop Loss)와 목표가(Target Price) 설정이 필수입니다.
- 추가 매수(물타기/불타기) 시에는 기존 SL/TP가 유지되어 일관된 원칙을 강제합니다.

#### 타임머신 블라인드 리플레이

- 과거 특정 시점부터 시작하여 미래 데이터를 완전히 차단합니다.
- "다음 캔들" 버튼을 눌러 차트를 한 캔들씩 진행시키며 훈련합니다.
- 실전과 동일한 불확실성 속에서 의사결정 능력을 기릅니다.

#### 시나리오 기반 가상 체결

- 매수 시 설정한 SL/TP를 시스템이 지속적으로 추적합니다.
- 원화(₩) 기반의 자산 및 손익 관리를 제공합니다.
- 실시간 평가손익 및 보유 포지션 현황을 표시합니다.

### 정보 제공

#### 종목 조회 시스템

- KOSPI/KOSDAQ 주요 20개 종목을 지원합니다. (추후 종목 추가 예정)
- 1년치 일봉 차트 및 주요 지표(52주 고/저, 평균 거래량)를 제공합니다.
- 시가/고가/저가/종가/거래량 등 펀더멘탈 데이터를 확인할 수 있습니다.

#### 재무제표 열람 (시간 동기화)

- 금융감독원(DART) 연동 공시 데이터를 제공합니다.
- **시뮬레이션 시점 이전에 공시된 보고서만 열람 가능**하여 미래 정보 유출을 원천 차단합니다.

### 분석 및 평가

#### 원칙 기반 평가 시스템

- **원칙 준수(Compliance)**: SL/TP 이탈 여부 및 편차를 평가합니다.
- **가설 적중(Validity)**: 진입 후 가격 움직임과 예상의 일치도를 측정합니다.
- **성과(Performance)**: 실제 수익률과 예상 ROI를 비교합니다.
- 사용자 정의 가중치로 개인화된 점수를 산출합니다.

#### 거래 기록 및 복기

- 모든 매매 기록이 자동 저장됩니다. (시간, 가격, 수량, 진입 근거)
- 진행 중인 세션과 종료된 세션을 분리하여 관리합니다.
- 세션 종료 시 보유 주식 자동 청산 및 최종 리포트가 생성됩니다.

#### 매매 마킹 리플레이 & 복기 _(추후 지원 예정)_

- 훈련 종료 후, 사용자의 매수/매도 타점이 차트 위에 자동 마킹됩니다.

### 데이터 신뢰성

#### 공공데이터 기반

- 금융위원회 주식시세정보 OpenAPI를 활용합니다.
- 금융감독원(DART) 기업공시 데이터를 연동합니다.
- 실제 과거 데이터를 기반으로 한 신뢰도 높은 훈련 환경을 제공합니다.

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
- **환경 설정 및 보안 고도화**: API 쿼리 파라미터 규칙, 데이터 락인(Lock-in) 프로세스 및 High/Low Service 계층 분리 전략 마련. - spring-boot-dotenv 라이브러리를 활용하여 API Key, URL 등 민감 정보를 .env 파일로 분리 관리. - 주식 시세 API와 재무제표 API의 설정(Base URL, Service Key)을 명확히 분리하여 유지보수성 향상.
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
- 재무제표 조회 및 수집 API (/api/statements/\*\*)
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

### Week 5 (26.01.19 - 01.25)

**작업 내역** (필수)

**FE**

- **회원정보 페이지 구현**: `/account` 페이지 신규 개발 및 사이드바 사용자 버튼 연동, 회원가입과 동일한 입력 검증(이메일 비활성화, 생년월일/비밀번호 규칙) 적용.
- **인덱스 및 약관 개선**: 랜딩 페이지 불필요 섹션(팀, 제품 등) 제거로 경량화, 약관 텍스트 상수화 및 전용 페이지(`/policy`) 구현.
- **대시보드 리뉴얼**: 지표 카드 디자인 통일, 격려 메시지 헤더 적용, 미사용 차트/메뉴 제거 및 레이아웃 최적화.
- **시뮬레이션 고도화**:
  - **세션 설정**: 종목/날짜 선택 가능한 `SessionSetupModal` 공통 모듈 구현.
  - **주문 시스템**: 매수/매도 탭 분리, SL/TP 자동 계산, 수량 슬라이더 및 입력 제한 로직 강화.
  - **차트 개선**: 한국형 캔들 색상 적용, 리사이징 버그 수정, 데이터 폴백(Fallback) 로직으로 안정성 확보.

**BE**

- **재무제표 뷰어 API 개발**:
  - **DART 연동**: 금융감독원 OpenAPI를 활용해 20개 주요 종목의 분기별 재무제표 원본 링크 수집 및 DB 적재 로직 구현.
  - **데이터 정합성 확보**: 보고서 제목 파싱(Regex)을 통한 정확한 분기 판별 로직 및 기재정정(수정 공시) 중복 처리 로직 적용.
  - **트랜잭션 처리**: 대량 데이터 초기화 시 개별 실패가 전체에 영향을 주지 않도록 트랜잭션 전파 속성(`REQUIRES_NEW`) 격리.
- **예외처리 리팩토링 및 강화**:
  - **전역 핸들러 도입**: `GlobalExceptionHandler` 및 `ErrorCode` Enum 도입으로 에러 응답 구조 표준화.
  - **상태 코드 세분화**: 기존 500 에러로 처리되던 잘못된 경로(404), 파라미터 누락/타입 불일치(400), 잘못된 날짜 포맷 등을 명확한 HTTP 상태 코드와 메시지로 개선.
  - **Null Safety**: 컴파일러 경고 해결을 위한 Null 체크 로직 강화 및 코드 안정성 확보.

**AI 활용** (필수)

**FE**

- **UI 스캐폴딩**: 회원정보 페이지 및 약관 페이지의 초기 레이아웃과 텍스트 상수 구조를 AI로 빠르게 생성.
- **로직 최적화**: 시뮬레이션 주문 폼의 복잡한 유효성 검사 로직(잔고/보유량 기반) 및 차트 리사이징 옵저버 패턴 구현 지원.
- **리팩토링**: 대시보드 및 인덱스 페이지의 불필요한 컴포넌트 의존성 제거 및 파일 구조 정리 제안.

**BE**

- **구조 설계**: 기존 도메인 분석을 통해 `Statement` 관련 Entity, DTO, Repository, Service 계층의 일관성 있는 설계 제안.
- **로직 생성**: 보고서 제목에서 연도와 분기를 추출하는 정규식(Regex) 패턴 생성 및 트랜잭션 격리 전략 제안.
- **트러블 슈팅**: MySQL 예약어(`quarter`) 충돌 원인 분석 및 컬럼명 변경 제안, Null Safety 관련 경고 해결책 제시.
- **리팩토링 가이드**: `BusinessException` 상속 구조를 통한 계층적 예외 처리 및 `ErrorResponse` DTO 설계 지원.

**완료 기능**

**FE**

- 회원정보 페이지 (`/account`)
- 이용약관 및 개인정보처리방침 페이지
- 대시보드 UI 리뉴얼
- 시뮬레이션 세션 설정 및 주문/차트 고도화

**BE**

- 재무제표 원본 링크 조회 API (`/api/statement`)
- DART 공시 데이터 초기화 및 스케줄링 배치
- 전역 예외 처리(Global Exception Handling) 및 표준 에러 응답
- API 입력값 검증(Validation) 강화

**커밋 로그**

**FE**

- feat: 회원정보 페이지 구현 및 사이드바 연동
- refactor: 인덱스 페이지 경량화 및 약관 페이지 추가
- style: 대시보드 UI 디자인 통일 및 레이아웃 수정
- feat: 시뮬레이션 기능 강화 (세션설정, 주문폼, 차트)

**BE**

- feat: 재무제표 뷰어 API 및 DART OpenAPI 연동 구현
- refactor: 전역 예외 처리 구조 리팩토링 및 커스텀 예외 추가
- fix: MySQL 예약어 충돌 해결 및 기재정정 중복 데이터 처리 로직 수정
- chore: 에러 코드 상수화 및 요청 파라미터 검증(@Validated) 강화

**링크**

**FE**

- [인덱스 페이지 리팩토링](https://github.com/AddShotInCode/TradeMate_FE/pull/22)
- [대쉬보드 페이지 리팩토링](https://github.com/AddShotInCode/TradeMate_FE/pull/23)
- [Account 페이지 푸터 연도 수정](https://github.com/AddShotInCode/TradeMate_FE/pull/24)
- [시뮬레이션 페이지 리팩토링](https://github.com/AddShotInCode/TradeMate_FE/pull/25)

**BE**

- [재무제표 뷰어 API 개발, 예외처리 강화 및 리팩토링](https://github.com/AddShotInCode/TradeMate_BE/pull/11)

**다음 주 계획** (필수)

**FE**

- 발표 준비
- 분석 페이지
- 재무제표 연결
- 전반적인 시스템 버그 수정 및 안정화
- 모바일 반응형 디테일 작업
- 배포 준비

**BE**

- 배포 환경 구축 (CI/CD 파이프라인 점검)
- FE 연동 지원 및 API 문서 최적화
- 최종 버그 수정 및 성능 테스트
- 발표 자료 데이터 추출 지원

### Week 6 (26.01.26 - 02.01)

**작업 내역** (필수)

**FE**

- **Inquiry 페이지 백엔드 연동**: Mock 데이터를 실제 API 데이터로 교체하고, `ResizeObserver` 및 `lightweight-charts`를 활용해 기간별(1개월~1년) 캔들 차트를 구현했습니다.
- **미들웨어 및 인증 보안 강화**: `middleware.ts`를 도입하여 토큰 없는 접근을 원천 차단하고, 로그아웃 및 로그인 실패 피드백 로직을 개선했습니다.
- **회원가입 기능 완성**: `authService`를 통한 실제 회원가입 API(`POST /api/auth/signup`) 연동 및 선택 입력(전화번호) 등 유효성 검사를 강화했습니다.
- **원칙(Propensity) 페이지 UI 정리**: 전략 입력 단계를 간소화하고, 비중 합계 100% 검증 UX를 적용하여 저장 로직을 단일화했습니다.
- **시뮬레이션 고도화**: 자동 매매(SL/TP)를 비활성화하여 수동 대응 능력을 기르도록 원칙을 강화하고, 손절/익절 슬라이더(0~50%) 및 `sonner` 토스트 알림을 도입했습니다.
- **리포트 및 대시보드 폴리싱**: 시뮬레이션 결과 리포트의 시인성을 높이고(폰트 확대, 불필요 정보 제거), 대시보드 목록 정렬을 개선했습니다.

**BE**

- **JWT 기반 인증 시스템 구축**:
  - Spring Security와 JWT를 활용한 사용자 인증 구현.
  - HttpOnly 쿠키 기반 토큰 저장으로 XSS 공격 방어 및 보안 강화.
  - 회원가입(`/api/auth/signup`), 로그인(`/api/auth/login`), 로그아웃(`/api/auth/logout`) API 구현.
  - BCrypt를 활용한 비밀번호 암호화 및 `@AuthenticationPrincipal`을 통한 현재 사용자 주입.
- **시뮬레이션 CRUD API 개발**:
  - 시뮬레이션 세션 관리를 위한 `Simulation`, `SimulationTrade` Entity 및 Repository 설계.
  - 시뮬레이션 생성(`POST`), 조회(`GET`), 종료일 수정(`PATCH`), 삭제(`DELETE`) 엔드포인트 구현.
  - 거래 데이터 추가(`POST /{id}/data`) 및 조회(`GET /{id}/data`) API 구현.
  - 사용자 소유권 검증 로직을 통한 타 사용자 데이터 접근 차단.
- **시뮬레이션 리포트 API 개발**:
  - 원칙 기반 평가를 위한 점수 계산 알고리즘(`SimulationScoreCalculator`) 구현.
  - R(Result: 수익률) + C(Compliance: 원칙 준수) 가중 평균 기반 개별 거래 점수 산출.
  - 매도 거래량 기반 가중치 적용으로 큰 거래에 더 높은 비중 부여.
  - 최종 분석 리포트(`GET /{id}/report`) 반환: 총점, 등급(A~F), 거래별 상세 점수 포함.
- **버그 수정 및 안정화**:
  - 전량 매도 시 `finalAvgPrice`가 0으로 표시되는 버그 수정 (마지막 매도 시점의 평균가 보존 로직 추가).
  - `BigDecimal` 기반 금융 계산(SCALE=8, RoundingMode.HALF_UP)으로 정밀도 확보.
  - 커스텀 예외(`SIMULATION_NOT_FOUND`, `SIMULATION_NOT_ENDED`) 추가 및 에러 핸들링 강화.

**AI 활용** (필수)

**FE**

- **코드 생성 및 로직 제안**: Next.js Middleware의 토큰 검증 로직 구현 문제와 시뮬레이션 주문 슬라이더-잔고 연동 로직을 AI로 생성하여 해결했습니다.
- **UX 라이팅 개선**: 시뮬레이션 리포트의 원칙 분석 결과를 점수 구간별(80점 이상/50점 미만 등)로 자연스러운 문장으로 다듬는 데 활용했습니다.
- **리팩토링**: 불필요한 레거시 컴포넌트(이전 차트 컨트롤, 청산 버튼) 제거 및 전역 상태 관리(Zustand) 로직 최적화를 제안받아 적용했습니다.

**BE**

- **아키텍처 설계**: JWT + HttpOnly 쿠키 인증 방식의 장단점 분석 및 Spring Security 필터 체인 구성 가이드 제공.
- **알고리즘 구현**: 점수 계산 알고리즘(R+C 가중 평균, 매도 거래량 기반 가중치)의 수학적 모델링 및 Java 코드 변환 지원.
- **DTO 설계**: Entity ↔ DTO 변환 패턴 및 Record 기반 불변 DTO 구조 제안으로 코드 간결화.
- **버그 분석 및 해결**: 실제 DB 덤프 데이터를 분석하여 전량 매도 시 평균가 초기화 버그의 원인 파악 및 수정안 도출.
- **문서화**: API 명세서(simulation_api_spec.md) 및 프롬프트 문서(simulation_crud_api.md, simulation_report_api.md) 작성 지원.

**완료 기능**

**FE**

- Inquiry 페이지 실 데이터 연동 및 차트화
- 인증 미들웨어(Middleware) 및 로그아웃
- 회원가입 프로세스 연동
- 시뮬레이션 수동 매매 강화 및 주문 UI (슬라이더)
- 시뮬레이션 결과 리포트 UI 개선

**BE**

- JWT 기반 인증 시스템 (회원가입/로그인/로그아웃)
- HttpOnly 쿠키 기반 토큰 관리
- 시뮬레이션 CRUD API (6개 엔드포인트)
- 시뮬레이션 리포트 API (점수 계산 및 등급 산출)
- 사용자 소유권 검증 및 접근 제어
- 커스텀 예외 처리 및 에러 코드 체계화

**커밋 로그**

**FE**

- docs: readme 핵심 기술 내용 변경
- feat: 분석 페이지 구현
- fix: 목표가 손절가 0 문제 해결
- feat: toast 알람 변경
- feat: 시뮬레이션 api 변경
- feat: 로그인 zod 적용
- feat: 회원가입 기능 백이랑 연결
- refactor: 원칙 페이지 수정, 사이드바 계정 버튼 제거
- feat: 조회 페이지 실 데이터와 연결
- feat: 시뮬레이션 로직 추가
- feat: 시뮬레이션 페이지 재무제표 추가

**BE**

- feat: JWT 인증 시스템 및 HttpOnly 쿠키 기반 토큰 관리 구현
- feat: 시뮬레이션 CRUD API 개발 (생성/조회/수정/삭제/거래추가)
- feat: 시뮬레이션 리포트 API 및 점수 계산 알고리즘 구현
- fix: 전량 매도 시 finalAvgPrice 0 표시 버그 수정
- docs: 시뮬레이션 API 명세서 및 프롬프트 문서 작성

**링크**

**FE**

- [시뮬레이션 페이지 로직 추가 및 수정](https://github.com/AddShotInCode/TradeMate_FE/pull/28)
- [조회 페이지 데이터 연결](https://github.com/AddShotInCode/TradeMate_FE/pull/30)
- [회원가입 최종 완성](https://github.com/AddShotInCode/TradeMate_FE/pull/35)
- [회원가입 페이지 프롬프트 추가](https://github.com/AddShotInCode/TradeMate_FE/pull/36)
- [로그인, 로그아웃, 권한 설정](https://github.com/AddShotInCode/TradeMate_FE/pull/37)
- [시뮬레이션 페이지 api 추가](https://github.com/AddShotInCode/TradeMate_FE/pull/38)
- [분석 페이지 구현](https://github.com/AddShotInCode/TradeMate_FE/pull/39)
- [readme 핵심 기술 내용 변경](https://github.com/AddShotInCode/TradeMate_FE/pull/40)

**BE**

- [로그인 기능 구현](https://github.com/AddShotInCode/TradeMate_BE/pull/13)
- [권한 오류 수정 및 사용자 데이터 구성 변경, 토큰 구조 변경](https://github.com/AddShotInCode/TradeMate_BE/pull/14)
- [시뮬레이션 정보 저장 및 조회 api 구현](https://github.com/AddShotInCode/TradeMate_BE/pull/15)
- [시뮬레이션 결과 보고서 api 구현](https://github.com/AddShotInCode/TradeMate_BE/pull/16)
- [최종 평단가 계산 버그 수정](https://github.com/AddShotInCode/TradeMate_BE/pull/17)

**테스트 결과**

**FE**

- 회원가입 프로세스 정상 동작 및 중복 이메일 에러 핸들링 확인.
- 비로그인 사용자의 대시보드 접근 시 로그인 페이지 리다이렉트 동작 확인.
- Inquiry 차트 기간 변경 및 종목 교체 시 데이터 렌더링 확인.
- 시뮬레이션 매수/매도 슬라이더 및 손익 계산 로직 검증 완료.

**BE**

- 회원가입 API 정상 동작 및 중복 이메일 예외 처리 확인.
- 로그인 성공 시 HttpOnly 쿠키에 JWT 토큰 설정 확인.
- 시뮬레이션 CRUD 전체 플로우(생성→거래추가→조회→리포트→삭제) 검증 완료.
- 타 사용자 시뮬레이션 접근 시 403 Forbidden 응답 확인.
- 리포트 API에서 점수 계산 및 등급(A~F) 산출 로직 정상 동작 확인.
- 전량 매도 후 finalAvgPrice 정상 표시(마지막 매도 시점 평균가) 확인.

**다음 주 계획** (필수)

**FE**

- 테스트 코드 추가
- CI/CD 구축
- 반응형 디자인 추가
- 프로젝트 문서화 및 마무리
- 캔들 색상 강조 및 마커 표시
- 각 시점의 진입 근거 및 결과 데이터 툴팁 제공

**BE**

- 테스트 코드 작성 (Service/Controller 단위 테스트)
- CI/CD 파이프라인 구축
- API 문서화 (Swagger)
- 성능 최적화 및 배포 준비

### Week 7 (26.02.02 - 02.08)

**작업 내역** (필수)

**FE**

- **테스트 환경 구축**: Jest + React Testing Library(RTL) 기반의 유닛 테스트 환경 구축. `jest.config.ts`, `jest.setup.ts` 등 설정 파일 구성 및 `@testing-library/react`, `jest-environment-jsdom` 등 테스트 의존성 설치.
- **UI 컴포넌트 테스트 작성**: 핵심 UI 컴포넌트(`Button`, `Card`, `Input`)에 대한 테스트 코드 작성. 렌더링, 이벤트, variant, props 전달 등 다양한 시나리오 커버.
- **Service 레이어 테스트 작성**: `authService`, `simulationService`에 대한 유닛 테스트 구현. Axios 모킹을 통한 API 호출 검증 및 에러 처리 테스트.
- **Store 테스트 작성**: Zustand 기반 상태 관리(`authStore`, `simulationStore`)에 대한 테스트 구현. 상태 변경, 비동기 액션, 데이터 집계 로직 등 검증.
- **테스트 코드 품질 개선**: 모든 테스트 파일에 GWT(Given-When-Then) 형식의 한글 주석 추가로 테스트 의도 명확화 및 가독성 향상.
- **코드 포맷팅 도구 설정**: Prettier 설치 및 `.prettierrc`, `.prettierignore` 설정. `npm run format`, `npm run format:check` 스크립트 추가로 일관된 코드 스타일 유지.
- **타입 에러 수정**: `simulationStore.test.ts`의 mock 데이터를 `StockItem`, `StockResponse` 인터페이스에 맞게 수정하여 TypeScript 타입 정합성 확보.

**BE**

- **테스트 코드 작성 (10개 테스트 클래스, ~97개 테스트 케이스)**:
  - **Unit 테스트**: `SimulationScoreCalculatorTest`(15개) — 점수 계산 알고리즘의 빈 거래, 평균가, 손익 시나리오, 가중치 적용 등 검증. `JwtTokenProviderTest`(15개) — JWT 토큰 생성, 검증, 만료 처리, 이메일 추출, 인증 객체 생성 등 검증.
  - **Service 테스트**: `AuthServiceTest`(10개) — 회원가입(성공/중복), 로그인(성공/이메일 불일치/비밀번호 불일치/토큰 갱신), 리프레시(성공/미존재/만료), 로그아웃(성공/미존재) 검증. `SimulationServiceTest`(12개) — 시뮬레이션 CRUD, 거래 추가, 거래 조회, 리포트 생성 등 비즈니스 로직 검증.
  - **Controller 테스트**: `AuthControllerTest`(9개) — MockMvc Standalone 모드로 인증 API 엔드포인트 검증. `SimulationControllerTest`(9개) — Custom `TestUserDetailsArgumentResolver`를 통한 `@AuthenticationPrincipal` 처리 및 시뮬레이션 API 검증.
  - **Repository 테스트**: `MemberRepositoryTest`(6개), `SimulationRepositoryTest`(8개), `SimulationTradeRepositoryTest`(6개), `RefreshTokenRepositoryTest`(7개) — H2 인메모리 DB 기반 `@DataJpaTest`로 쿼리 동작 검증.
- **GitHub Actions CI 구성**:
  - `.github/workflows/ci.yml` 워크플로우 생성.
  - `main`, `develop` 브랜치에 Push/PR 시 자동 테스트 실행.
  - JDK 21(Temurin) 설정, Gradle 캐시, 테스트 결과 아티팩트 업로드.
- **JaCoCo 테스트 커버리지 리포트**:
  - `build.gradle`에 JaCoCo 플러그인 추가 및 XML/HTML 리포트 설정.
  - CI 파이프라인에 커버리지 리포트 업로드 및 PR 코멘트 자동 표시(`jacoco-report` 액션) 통합.
- **Swagger API 문서화 (SpringDoc OpenAPI)**:
  - `springdoc-openapi-starter-webmvc-ui:2.8.4` 의존성 추가.
  - `SwaggerConfig.java` — API 메타데이터(제목, 설명, 버전), JWT Bearer 인증 스키마 정의.
  - `SecurityConfig.java` — Swagger UI 경로(`/swagger-ui/**`, `/v3/api-docs/**`) permitAll 추가.
  - **Controller 문서화**: `AuthController`(4개 메서드), `SimulationController`(7개 메서드), `StockController`(2개 메서드), `StatementController`(2개 메서드)에 `@Tag`, `@Operation`, `@Parameter`, `@ApiResponses` 어노테이션 적용.
  - **DTO 문서화**: Auth DTO(3개), Simulation DTO(9개), Stock DTO(4개 내부 클래스), Statement DTO(2개 내부 클래스), ErrorResponse에 `@Schema` 어노테이션 적용.

**AI 활용** (필수)

**FE**

- **테스트 코드 생성**: 기존 컴포넌트/서비스 구조를 분석하여 테스트 케이스 초안을 자동 생성하고, edge case 및 에러 시나리오를 보완.
- **GWT 주석 작성**: 각 테스트의 사전 조건(Given), 동작(When), 결과(Then)를 명확히 구분하는 한글 주석을 일괄 적용.
- **타입 에러 분석**: Mock 데이터와 인터페이스 간 불일치 원인을 분석하고, 누락된 속성(`volume`, `changeAmount`, `changeRate`, `pagination`) 추가 제안.
- **설정 파일 구성**: Jest 및 Prettier 설정 파일의 최적 구성을 제안하고, Next.js/TypeScript 환경과의 호환성 확보.

**BE**

- **테스트 전략 수립**: 프로젝트 구조 분석을 통한 테스트 우선순위(Unit → Service → Controller → Repository) 계획 및 단계별 실행 가이드 제공.
- **테스트 코드 생성**: Mockito 기반 Service/Controller 테스트, `@DataJpaTest` 기반 Repository 테스트 코드 자동 생성 및 DTO 필드 차이/ErrorCode 포맷 등 실제 코드와의 정합성 맞춤.
- **트러블 슈팅**: `@WebMvcTest`의 Spring Security Context 로딩 문제를 MockMvc Standalone 모드로 전환하여 해결. `@AuthenticationPrincipal` null 주입 문제를 Custom `TestUserDetailsArgumentResolver` 구현으로 해결.
- **CI/CD 구성**: GitHub Actions 워크플로우 및 JaCoCo 커버리지 리포트 설정 코드 생성.
- **Swagger 문서화**: 전체 Controller/DTO에 대한 Swagger 어노테이션 일괄 적용 및 API 그룹(Tag) 분류 설계.

**완료 기능**

**FE**

- Jest + RTL 테스트 환경 (8개 테스트 스위트, 110개 테스트 케이스)
- UI 컴포넌트 테스트 (`Button.test.tsx`, `Card.test.tsx`, `Input.test.tsx`)
- Service 테스트 (`authService.test.ts`, `simulationService.test.ts`)
- Store 테스트 (`authStore.test.ts`, `simulationStore.test.ts`)
- Test Utilities (`test-utils.tsx` - 커스텀 렌더 함수)
- Prettier 코드 포맷팅 설정

**BE**

- 테스트 코드 작성 (10개 클래스, ~97개 테스트 케이스, BUILD SUCCESSFUL)
- GitHub Actions CI 워크플로우 (Push/PR 자동 테스트)
- JaCoCo 테스트 커버리지 리포트 및 PR 커버리지 코멘트
- Swagger API 문서화 (4개 도메인 전체 문서화)
- Swagger UI 접속 (`/swagger-ui.html`)

**커밋 로그**

**FE**

- test: GWT 형태로 변경
- docs: 포맷팅 프롬프트 추가
- chore: 코드 포맷팅 설정
- fix: 테스트 코드 타입에러 수정
- docs: 테스트 코드 프롬프트 작성
- ci: ci 코드 작성
- test: 테스트 코드 추가

**BE**

- test: 테스트 코드 추가 및 CI 파이프라인 구축
- docs: swagger 기반 api 문서화
- fix: ci 중복빌드 방지 및 jacoco pr 코멘트 권한 설정
- fix: 오타 수정 및 api 문서 내 링크 변경

**링크**

**FE**

- [테스트 코드 추가 및 CI 파이프라인 구축](https://github.com/AddShotInCode/TradeMate_FE/pull/43)

**BE**

- [테스트 코드 추가 및 CI 파이프라인 구축](https://github.com/AddShotInCode/TradeMate_BE/pull/19)
- [swagger 기반 api 문서화](https://github.com/AddShotInCode/TradeMate_BE/pull/20)

**테스트 결과**

**FE**

- `npm run test` 실행 결과:
  ```
  Test Suites: 8 passed, 8 total
  Tests:       110 passed, 1 skipped, 111 total
  Time:        3.547 s
  ```
- 모든 UI 컴포넌트, Service, Store 테스트 정상 통과 확인.
- JSDOM 환경 제약(navigation 미지원)으로 인한 1개 테스트 스킵 (authStore 로그아웃 리다이렉트).

**BE**

- 전체 테스트 스위트 `BUILD SUCCESSFUL` 확인 (10개 테스트 클래스, ~97개 테스트 케이스).
- Unit 테스트(SimulationScoreCalculator, JwtTokenProvider) 빠른 실행 확인.
- Service 테스트(AuthService, SimulationService) Mockito 기반 비즈니스 로직 검증 완료.
- Controller 테스트(AuthController, SimulationController) MockMvc Standalone 모드 정상 동작 확인.
- Repository 테스트 H2 인메모리 DB 기반 JPA 쿼리 동작 검증 완료.
- JaCoCo 커버리지 리포트 정상 생성 (`build/reports/jacoco/test/html/`) 확인.
- Swagger UI(`/swagger-ui.html`) 정상 접속 및 4개 API 그룹(인증, 시뮬레이션, 주가 조회, 재무제표) 표시 확인.

**다음 주 계획** (필수)

**FE**

- LLM 활용에 맞춰 매매분석페이지 UI 수정
- CI/CD 파이프라인 보완 및 강화
- SEO 최적화

**BE**

- LLM 활용 매매분석리포트 내용 생성기능 개발계획 수립 및 구현
- 성능 최적화 및 점검
- CI/CD 파이프라인 보완 및 강화

### Week 8 (26.02.09 - 02.15)

**작업 내역** (필수)

**FE**

- **SEO 최적화 구현**: Next.js Metadata API를 활용한 체계적인 SEO 구축.
  - `robots.ts` 및 `sitemap.ts` 파일 생성으로 검색 엔진 크롤링 최적화.
  - 루트 레이아웃 메타데이터 강화 (Open Graph, Twitter Card 추가).
  - 11개 페이지에 개별 메타데이터 설정 (title, description, keywords).
  - 공개 페이지(홈, 정책)와 비공개 페이지(대시보드, 시뮬레이션)의 인덱싱 정책 차별화.
- **Canonical URL 구조 개선**: 루트 레이아웃의 잘못된 canonical URL 설정 수정.
  - 모든 페이지가 홈페이지를 canonical로 지정하던 중대한 SEO 문제 해결.
  - 각 페이지가 고유한 canonical URL을 가질 수 있도록 구조 개선.
  - `/dashboard`, `/simulation` 등 각 페이지의 독립적인 인덱싱 보장.
- **환경 변수 정규화 및 템플릿 개선**:
  - `robots.ts`에서 trailing slash 처리 로직 추가로 `NEXT_PUBLIC_SITE_URL` 설정 견고성 향상.
  - `.env.example` 파일을 적절한 템플릿으로 수정, 실제 SMTP 설정 값 제거 및 플레이스홀더로 교체.
- **개발 워크플로우 자동화**: 프롬프트 정리 및 주간보고서 작성 자동화 시스템 구축
  - PowerShell 기반 통합 스크립트 개발로 주차 자동 계산, 디렉토리 생성, 템플릿 파일 생성 자동화
  - 프로젝트 시작일 기준으로 동적 주차 계산 로직 구현
  - 프롬프트 문서 템플릿 자동 생성 및 VS Code 연동
  - 주간보고서 섹션 자동 생성 및 클립보드 복사 기능
- **워크플로우 문서화**: `docs/workflows` 폴더 신규 생성 및 팀 공유 문서 작성
  - `prompt-organization.md`: 프롬프트 정리 워크플로우 전체 문서 (빠른 시작, 단계별 가이드, 트러블슈팅)
  - `workflows/README.md`: 워크플로우 목차 및 사용 가이드
  - 다른 팀원도 쉽게 참고할 수 있도록 체계적으로 구성
- **프로젝트 문서 체계화**: 기존 `.agent/workflows`의 내용을 `docs` 폴더로 이동하여 접근성 향상

**BE**

- **기술 명세서 전면 개정**: 프로젝트 진행 상황을 반영하여 tech_spec.md 대폭 업데이트.
  - 프로젝트 개요 및 실제 사용 기술 스택 명시 (Java 21, Spring Boot 3.5.9, MySQL 8.0, JWT 0.12.6).
  - 외부 API 연동 현황 정리 (금융위원회 주식시세정보, 금융감독원 DART API).
  - 패키지 구조 상세화 (domain 계층별 구조 및 global 공통 모듈).
  - 설정 파일 구성 문서화 (application.yml, stock-codes.yml, .env).
  - ERD 및 테이블 구조 명세 (8개 테이블: members, refresh_token, stock, daily_price, statement, simulation, simulation_trade).
  - 인덱스 전략 및 성능 최적화 설계 문서화.
  - 시뮬레이션 점수 계산 알고리즘 수식 및 로직 상세 기술 (개별 거래 점수 s_i, 가중 평균 총점, 등급 산출).
  - JWT 인증 시스템 상세 (토큰 저장 방식, 유효기간, BCrypt 암호화).
  - 데이터 수집 자동화 전략 (스케줄러 기반 시세 업데이트, 데이터 생명주기).
  - 완전한 API 명세 작성 (5개 도메인 14개 API, 파라미터, 에러 코드 체계).
  - 보안 설정 상세화 (인증 제외/필요 경로, CORS 설정).
  - 관리 대상 종목 리스트 정리 (KOSPI 13개, KOSDAQ 7개 총 20종목).
  - 개발 환경 설정 가이드 (필수 환경 변수, 실행 방법, 초기 데이터 적재).
- **AI Agent 워크플로우 문서 작성**: docs/workflows/AGENT.md 신규 생성.
  - AI Agent의 CTO 역할 정의 및 책임 범위 명시.
  - 기술 스택 및 프로젝트 컨텍스트 상세 기술.
  - 응답 방식 및 커뮤니케이션 가이드라인.
  - 7단계 협업 워크플로우 정립 (브레인스토밍 → 질문 → 정보 수집 → 실행 계획 → 단계별 프롬프트 → 상태 리포트).
  - Codex와의 협업 패턴 정의.

**AI 활용** (필수)

**FE**

- **SEO 전략 수립**: Next.js Metadata API의 최적 활용 방법 및 페이지별 인덱싱 정책 제안.
- **문제 진단 및 해결**: Canonical URL의 구조적 문제 분석 및 올바른 메타데이터 계층 구조 설계.
- **코드 생성**: `robots.ts`, `sitemap.ts` 파일 생성 및 11개 페이지의 메타데이터 보일러플레이트 작성.
- **정규 표현식 활용**: Trailing slash 제거를 위한 정규 표현식 패턴 제안.
- **워크플로우 설계**: 프롬프트 정리부터 주간보고서 작성까지의 전체 프로세스 자동화 설계
- **스크립트 생성**: PowerShell 기반 통합 스크립트 (주차 계산, 파일 생성, 클립보드 복사) 자동 생성
- **문서 구조화**: 사용자가 바로 이해하고 사용할 수 있도록 문서 구조 제안 (빠른 시작, 단계별 가이드, 트러블슈팅)
- **트러블슈팅 정리**: PowerShell 실행 오류, VS Code 연동, 주차 계산 등 5가지 주요 문제와 해결책 정리
- **Week 7 보고서 작성 지원**: 2월 8일까지의 테스트 코드 작업 내용을 분석하여 주간보고서 각 섹션에 맞게 정리

**BE**

- **문서 구조 설계**: 기존 간략한 기술 명세를 실제 구현 상태를 반영한 체계적인 문서로 재구성.
- **알고리즘 수식화**: 시뮬레이션 점수 계산 로직을 수학적 수식으로 명확히 표현 (R, C, s_i, 가중 평균).
- **API 명세 표준화**: 14개 API의 파라미터, 응답, 에러 코드를 표 형식으로 정리하여 가독성 향상.
- **워크플로우 템플릿 생성**: AI Agent와 Codex 간 협업을 위한 표준 워크플로우 프로세스 설계.

**완료 기능**

**FE**

- SEO 최적화 시스템
  - `robots.txt` 자동 생성 (공개/비공개 페이지 구분)
  - `sitemap.xml` 자동 생성 (우선순위 및 업데이트 주기 설정)
  - Open Graph 및 Twitter Card 메타데이터
  - 페이지별 독립적인 canonical URL
- 환경 변수 정규화 및 템플릿 개선
- 프롬프트 정리 워크플로우 시스템
  - 주차 자동 계산 (프로젝트 시작일 기준)
  - 프롬프트 디렉토리 자동 생성 (`prompts/week{n}/{YY_MM_DD}/`)
  - 템플릿 기반 프롬프트 문서 자동 생성
  - 주간보고서 섹션 자동 생성 및 클립보드 복사
- 워크플로우 문서화
  - `docs/workflows/prompt-organization.md` (전체 워크플로우 문서)
  - `docs/workflows/README.md` (목차 및 가이드)

**BE**

- 기술 명세서 전면 개정 완료
  - 7개 섹션 361줄 분량 상세 문서 (개요, 구조, DB 설계, 비즈니스 로직, API 명세, 보안, 환경 설정)
  - 시뮬레이션 점수 계산 알고리즘 완전 문서화
  - 14개 REST API 엔드포인트 상세 명세
  - 에러 코드 체계 정립
- AI Agent 워크플로우 문서 작성
  - CTO 역할 정의 및 7단계 협업 프로세스

**커밋 로그**

**FE**

docs: 워크플로우 문서화
feat: canonical url 코드 리뷰 반영
feat: 사이트맵 링크 코드 리뷰 반영
docs: 메타데이터, env 프롬프트 추가
feat: api baseUrl 분리
feat: SEO 최적화 메타데이터 추가

**BE**

- docs: techspec 문서 및 agent workflow 문서 업데이트 (f87246c)

**링크**

**FE**

- [SEO 최적화](https://github.com/AddShotInCode/TradeMate_FE/pull/49)

**BE**

- [기술 명세서 및 워크플로우 문서 업데이트](https://github.com/AddShotInCode/TradeMate_BE/pull/21)

**테스트 결과**

**FE**

- **SEO 검증 결과**:
  - `/robots.txt` 접속 확인: 공개/비공개 페이지 구분 정상 동작.
  - `/sitemap.xml` 접속 확인: 공개 페이지(홈, 로그인, 회원가입, 정책 페이지들) 포함.
  - 각 페이지 HTML `<head>` 검증: canonical URL, Open Graph, Twitter Card 메타태그 정상 렌더링.
  - 홈페이지: `canonical: "/"` ✅
  - 대시보드: `canonical: "/dashboard"` ✅
  - 시뮬레이션: `canonical: "/simulation"` ✅
- **워크플로우 스크립트 검증**:
  - PowerShell 통합 스크립트 정상 실행 확인
  - 주차 자동 계산 (`week8` 정상 출력)
  - 프롬프트 디렉토리 자동 생성 확인
  - 템플릿 파일 생성 및 VS Code 자동 실행 확인
- **문서 접근성 검증**:
  - `docs/workflows/prompt-organization.md` 정상 생성 확인
  - 워크플로우 문서가 독립적으로 이해 가능한지 검증 완료

**BE**

- **문서 품질 검증**:
  - tech_spec.md 마크다운 렌더링 정상 확인 (361줄, 2개 파일 변경)
  - ERD 다이어그램 코드블록 가독성 확인
  - API 명세 표 형식 정상 렌더링 확인
  - 수식 표기 (`s_i = (R + C) / 2`) 가독성 확인 ✅
- **AGENT.md 구조 검증**:
  - 7단계 워크플로우 순서도 논리성 확인
  - 기술 스택 목록과 실제 build.gradle 일치성 확인
  - Codex와의 협업 프로세스 실행 가능성 검증 ✅

**다음 주 계획** (필수)

**FE**

- 배포 테스트
- LLM 연결

**BE**

- LLM 활용 매매분석리포트 생성 기능 개발
- CI/CD 파이프라인 구축 및 자동화
- 성능 모니터링 및 최적화

### Week 9 (26.02.16 - 02.22)

**작업 내역** (필수)

**FE**

- **Report API 분리 반영**: 시뮬레이션 보고서 흐름을 생성(`POST`)과 조회(`GET`)로 분리된 백엔드 API에 맞춰 연결.
  - `simulationService`에 `generateReport(id)` / `getReport(id)` 메서드 분리 적용.
  - 시뮬레이션 종료 시점에 보고서 생성 요청(POST), 결과 분석 페이지 진입 시 보고서 조회(GET)로 역할 분리.
- **리포트 페이지 에이전트 섹션 개편**:
  - 기존 3개 카드 구조를 Gemini/GPT/Claude 에이전트 의견 구조로 전환.
  - 1번 카드: Gemini 코멘트(`aiComment`) 요약 표시.
  - 2~3번 카드: GPT/Claude 유료 회원 전용 잠금 UI 적용(LOCK 표시).
- **Gemini 코멘트 표시 UX 개선**:
  - 긴 코멘트가 카드 밖으로 잘리지 않도록 줄바꿈/단어 래핑 처리.
  - 요약 텍스트를 문장 단위로 정리해 가독성 개선.
- **점수 표시 로직 정리 및 업데이트**:
  - 원칙/수익 점수는 거래 내역 전체를 반영한 수량 가중 평균으로 계산.
  - 종합 점수는 `(원칙 준수 + 수익 실현 + AI 평가) / 3` 평균값으로 표시하도록 변경.
  - 등급(A+/A/B/C/D) 산정도 변경된 종합 점수 기준으로 동기화.

**BE**

- **Report API 분리**: 기존 `GET /api/simulation/{id}/report` 단일 API를 보고서 생성(`POST`)과 조회(`GET`)로 분리.
  - `SimulationReport`, `ReportTradeScore` 엔티티 및 정규화 테이블 신규 생성.
  - `SimulationReportRepository` 추가.
  - `ErrorCode`에 `REPORT_ALREADY_EXISTS`(409), `REPORT_NOT_FOUND`(404) 추가.
  - 보고서를 DB에 저장하여 반복 조회 시 재계산 비용 제거.
- **AI 애널리스트 기능 (Gemini 2.5 Flash)**:
  - 보고서 생성 시 LLM 기반 AI 점수(`aiScore`)와 코멘트(`aiComment`) 자동 생성.
  - `GeminiProperties` — `@ConfigurationProperties`로 Gemini API url, apiKey, model 관리.
  - `GeminiRestTemplateConfig` — Gemini 전용 RestTemplate (connect 5s, read 60s).
  - `GeminiApiClient` — Gemini REST API 호출, JSON 응답 파싱, 실패 시 null 반환 (graceful degradation).
  - `GeminiPromptBuilder` — 주가 차트 데이터(StockService, pageSize=10000) + 거래 내역 + 시스템 프롬프트 조합.
  - `analyst-prompt.txt` — AI 애널리스트 역할/분석 기준/JSON 출력 형식 정의.
  - DB 스키마에 `ai_score INT`, `ai_comment TEXT` 컬럼 추가.
- **Gemini API 버그 수정**:
  - 인증 방식: `?key=` 쿼리 파라미터 → `x-goog-api-key` 헤더 방식으로 공식 문서 기준 수정.
  - JSON 파싱: LLM 응답 내 줄바꿈 등 제어 문자를 `ALLOW_UNESCAPED_CONTROL_CHARS`로 허용.
  - 보안: URL에 API 키 노출 문제 해결.
- **디버그 로깅**: `GeminiApiClient`에 프롬프트 전문 및 Gemini 응답 원문을 DEBUG 레벨로 기록.
- **테스트 코드 업데이트**: `SimulationServiceTest`, `SimulationControllerTest`에 AI 관련 mock/assertion 추가.

**AI 활용** (필수)

**FE**

- **요구사항 해석/분해**: “종료 시 생성, 진입 시 조회”와 같은 사용자 시나리오를 API 호출 타이밍으로 분해해 반영.
- **코드베이스 탐색 자동화**: 서비스/페이지/컴포넌트/테스트 파일의 호출 관계를 분석해 최소 변경 범위로 적용.
- **UI/로직 동시 개선**: 단순 렌더링 변경이 아닌 점수 산식, 카드 구조, 접근 제한(LOCK) UX를 함께 정합성 있게 업데이트.
- **원인 분석 지원**: Gemini `aiComment` 미노출 이슈에 대해 FE 표시 로직과 BE 데이터 흐름(저장/조회)까지 교차 점검.

**BE**

- **API 설계**: Report API 분리 시 HTTP 메서드, 상태 코드(409 중복, 404 미존재), 테이블 정규화 전략 등 아키텍처 결정.
- **전체 구현**: DB 스키마부터 Entity, DTO, Repository, Service, Controller, 테스트까지 일괄 구현.
- **공식 문서 분석**: Gemini API 인증 방식(`x-goog-api-key` 헤더) 및 요청/응답 구조를 공식 문서 기반으로 분석하여 버그 원인 진단.
- **트러블 슈팅**: LLM 응답 JSON 내 제어 문자 파싱 오류를 Jackson `JsonReadFeature` 설정으로 해결.
- **보안 점검**: 원격 저장소 push 전 git 이력/소스/설정 파일 전반에 걸쳐 API 키 노출 여부 점검.

**완료 기능**

**FE**

- 보고서 API 분리 반영 (`generateReport`/`getReport`)
- 시뮬레이션 종료 시 보고서 생성 POST 연동
- 결과 분석 페이지 진입 시 보고서 GET 조회 연동
- 리포트 페이지 에이전트 카드 구조 개편 (Gemini/GPT/Claude)
- Gemini 코멘트 요약/래핑 처리로 카드 내 가독성 개선
- GPT/Claude 유료 회원 전용 잠금 UI 적용
- 종합 점수 산식 변경 (원칙+수익+AI 평균), 등급 연동

**BE**

- Report API 분리 (`POST /{id}/report` 생성, `GET /{id}/report` 조회)
- AI 애널리스트 점수/코멘트 자동 생성 (Gemini 2.5 Flash 연동)
- Gemini 전용 RestTemplate 및 설정 클래스
- AI 분석 실패 시 graceful degradation (aiScore=null, aiComment=null로 보고서 정상 저장)
- 디버그 로깅 (프롬프트 전문, 응답 원문)
- 전체 테스트 통과 (BUILD SUCCESSFUL)

**커밋 로그**

**FE**

- refactor: 보고서 페이지 수정
- docs: 9주차 프롬프트

**BE**

feat: 분석 리포트 ai 애널리스트 평가 기능 추가
refactor: report 응답 방식 개선

**링크**

**FE**

- [보고서 페이지 수정 완료](https://github.com/AddShotInCode/TradeMate_FE/pull/51)

**BE**

- [시뮬레이션 보고서 AI 애널리스트 기능 추가](https://github.com/AddShotInCode/TradeMate_BE/pull/24)

**테스트 결과**

**FE**

- 리포트 페이지/시뮬레이션 헤더 변경 파일 타입 점검 결과: 오류 없음.
- 서비스/페이지 연동 확인: 생성(POST)과 조회(GET)가 분리된 흐름으로 동작하도록 반영 완료.

**BE**

- `.\gradlew test` 실행 결과: BUILD SUCCESSFUL.
- SimulationServiceTest — `generateReport` 테스트: AI mock(GeminiPromptBuilder, GeminiApiClient) 포함 정상 통과.
- SimulationControllerTest — `getReport` 테스트: aiScore/aiComment 응답 필드 검증 통과.
- 전체 테스트 스위트 정상 통과 확인.

**다음 주 계획** (필수)

**FE**

- 유료 회원 판별값 연동하여 GPT/Claude 카드 잠금 해제 조건 적용
- 리포트 페이지 점수 산식/표기 문구(백 산식 vs 프론트 산식) 명확화
- 리포트 UI 마감(카드 문구/레이아웃 미세조정)

**BE**

- ai 애널리스트용 llm 프롬프트 고도화
- 코드 리팩토링
- 성능 모니터링 및 최적화

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
