# 주식 시세 정보 오픈 API 연동 및 DB 구축

## 1. 배경 및 목적

- **목표**: 'TradeMate' 프로젝트의 백엔드(Spring Boot) 환경을 구축하고, 금융위원회 공공데이터 포털의 '주식시세정보 API'를 활용해 약 100개 종목의 1년치 시세 데이터를 수집 및 저장하는 기능을 구현하고자 함.
- **요구사항**:
  - 1년치 과거 데이터 적재 및 매일 당일 시세 갱신 (스케줄링).
  - 1년이 지난 데이터는 자동 삭제.
  - 코딩 컨벤션(Entity/DTO 분리, High/Low Service 분리) 준수.

## 2. 프롬프트 (User Input)

### Step 1. 프로젝트 생성 및 DB 설정
> "백엔드를 맡았고, Spring Boot 프로젝트를 생성하는 방법부터 알려줄래?"
> "vscode를 사용하고 있는데, 어플리케이션은 어떻게 실행할 수 있어?"
> (에러 로그 공유 후) "Access denied for user 'root'@'localhost' 에러 해결 방법은?"

### Step 2. DB 스키마 설계 및 API 분석
> "서버에 100개 종목의 1년치 데이터를 저장하고 매일 갱신할거야. openAPI 가이드를 보고 DB 구성과 API 사용법을 분석해줘."

### Step 3. 구현 (Entity, Repository, Service)
> "aib.trademate 패키지 구조에 맞춰서 spring boot 서버가 db를 관리할 수 있도록 코드를 작성해줘."
> "공공데이터 API를 호출해서 데이터를 받아오는 Client 모듈과 Service 로직을 구현해줘."

### Step 4. 디버깅 (API 응답 확인)
> "초기화를 시켰는데 stock 테이블에 name이 null로 들어가고 daily_prices에는 아무것도 없어. 문제 원인과 해결책은?"

## 3. AI 응답 요약 (AI Output)

### 1) 프로젝트 환경 구축
- **Spring Initializr 설정**: Java 17/21, Gradle, Dependencies(Web, JPA, Lombok, MySQL 등).
- **application.yml**: DB 연결 설정, JPA `ddl-auto: update`, 로깅 레벨(`DEBUG`) 설정 제안.
- **실행 가이드**: Gradle Wrapper(`gradlew bootRun`) 사용법 및 MySQL 접속 정보 수정 안내.

### 2) DB 설계 및 JPA Entity 구현
- **테이블 구조**: `Stock`(종목 정보)과 `DailyPrice`(일별 시세)로 정규화하여 1:N 관계 설정.
- **Entity 코드**: `BaseTimeEntity` 적용, `LAZY` 로딩 준수, `UniqueConstraint`로 중복 방지.
- **Service 계층 분리**: 단순 CRUD는 `LowService`, 비즈니스 로직은 `StockService`로 분리.

### 3) 공공데이터 API 연동 로직
- **DTO 설계**: JSON 응답 구조(Response > Body > Items > Item)에 맞춘 `StockApiDto` 작성.
- **Client 구현**: `RestTemplate`을 사용하여 API 호출, `UriComponentsBuilder`로 파라미터 구성.
- **초기화 및 스케줄링**:
  - `initStockData()`: 1년치 데이터 일괄 요청 및 저장.
  - `@Scheduled`: 매일 16:30 당일 데이터 갱신, 00:00 오래된 데이터 삭제.

### 4) 디버깅 전략 제시
- **문제 분석**: API 응답이 XML(에러)이거나 JSON 파싱 실패일 가능성 제시.
- **해결 코드**: `StockOpenApiClient`를 수정하여 응답을 DTO로 바로 변환하지 않고, **String(Raw Data)으로 받아 로그를 먼저 출력**하도록 변경하여 원인 파악 유도.

## 4. 결과 및 적용 (Result)

- **적용 내용**:
  - `aib.trademate` 패키지 하위에 도메인별(User, Stock) 구조 생성 완료.
  - MySQL DB 연동 및 JPA Entity/Repository 생성 완료.
  - API 호출을 위한 `RestTemplate` 설정 및 Client 코드 작성 완료.
- **진행 중**:
  - API 호출 시 `Stock` 정보(이름, 시장구분) 업데이트 로직 추가 (`dirty checking` 활용).
  - 현재 인증키 문제 또는 파싱 오류 확인을 위해 **Raw Response 로그 확인** 단계 진행 중.
- **배운 점**:
  - 공공데이터포털의 인증키는 Encoding/Decoding 유형에 따라 `UriComponentsBuilder` 사용 시 주의가 필요함.