# [TradeMate] 백엔드 기술 명세서 (Backend Technical Specification)

## 1. 개요 및 기술 스택 (Overview & Tech Stack)

### 1.1 프로젝트 개요
- **프로젝트명**: TradeMate (가칭)
- **목표**: 뇌동매매 차단 및 원칙 기반의 매매 습관 형성을 위한 주식 복기/훈련 시뮬레이션 플랫폼
- **핵심 가치**: 결과(수익금)보다 과정(원칙 준수)을 평가하는 알고리즘 구현

### 1.2 기술 스택 (Tech Stack)
- **Language**: Java 17+ (또는 Kotlin)
- **Framework**: Spring Boot 3.x
- **Database**: MySQL 8.0
  - 대용량 차트 데이터(OHLCV) 처리를 위한 인덱싱 및 파티셔닝 전략 필요
- **ORM**: Spring Data JPA (기본 CRUD), QueryDSL (동적 쿼리 및 통계용)
- **Build Tool**: Gradle
- **API Specs**: Swagger (OpenAPI 3.0)
- **Security**: Spring Security + JWT (Json Web Token)

## 2. 데이터베이스 설계 (Database Design)
핵심 엔티티와 관계를 정의합니다. MySQL 스키마 매핑을 위한 논리적 설계입니다.

### 2.1 주요 테이블 구조
| 테이블명 | 역할 | 주요 컬럼 (Key Columns) |
|---|---|---|
| **Users** | 사용자 정보 | `user_id` (PK), `email`, `password`, `nickname`, `settings` (JSON) |
| **Stocks** | 종목 정보 | `stock_code` (PK), `stock_name`, `market_type` (KOSPI/DAQ) |
| **Candles** | 시세 데이터 | `id` (PK), `stock_code` (FK), `date_time`, `open`, `high`, `low`, `close`, `volume` |
| **TrainingSession** | 훈련 게임 1판 | `session_id` (PK), `user_id` (FK), `start_date`, `end_date`, `initial_balance`, `rules_config` (JSON - 원칙 가중치) |
| **Orders** | 주문 내역 | `order_id` (PK), `session_id` (FK), `type` (BUY/SELL), `price`, `quantity`, `reason` (진입/청산 근거), `stop_loss`, `take_profit` |
| **TradeReview** | 평가 결과 | `review_id` (PK), `session_id` (FK), `final_score`, `rule_compliance_rate`, `feedback_text` |

### 2.2 데이터 처리 전략
- **Candles 테이블**: 수천만 건 이상의 데이터가 적재되므로 `stock_code`와 `date_time`에 복합 인덱스(Composite Index)를 설정하여 조회 속도 최적화.
- **JSON 타입 활용**: `rules_config`와 같이 사용자가 커스텀 가능한 설정 값은 MySQL의 JSON 타입을 활용하여 유연성 확보.

## 3. 핵심 비즈니스 로직 (Core Logic)
기획서의 2.1 ~ 2.2 내용을 구현하기 위한 백엔드 로직입니다.

### 3.1 블라인드 차트 & 타임머신 로직
- **가상 시간 관리**: `TrainingSession` 내에 `current_virtual_time` 변수를 두어 관리합니다.
- **데이터 페칭(Fetching)**: 프론트엔드 요청 시, DB에서 `date_time <= current_virtual_time` 조건으로 데이터를 조회하여 미래 데이터를 완벽히 차단합니다.
- **리플레이 속도**: 백엔드는 캔들 데이터 묶음(Chunk)을 제공하고, 실제 재생 속도(1배속~고배속)는 프론트엔드에서 렌더링 속도로 조절하되, 백엔드는 다음 캔들 데이터를 요청받을 때 유효성을 검증합니다.

### 3.2 강제성 부여 로직 (주문 프로세스)
- **매수 주문 (Buy Order)**: API 요청 바디에 `entryReason`(진입 근거), `stopLossPrice`(손절가), `targetPrice`(목표가) 필드가 null이거나 Blank일 경우 400 Bad Request 예외를 발생시켜 주문 자체를 거부합니다.
- **매도 주문 (Sell Order)**: `exitReason`(청산 근거) 필수 입력 검증.

### 3.3 원칙 준수 평가 알고리즘 (Scoring Algorithm)
훈련 종료 시 호출되는 로직입니다.
- **약속 이행 추적**:
  - 매수 시 설정한 `stopLossPrice`와 `targetPrice`를 로드합니다.
  - 보유 기간 동안의 Candles 데이터(Low, High)를 순회하며 사용자가 설정한 가격에 도달했는지 확인합니다.
  - 실제 매도 시점의 가격과 비교하여, 손절가를 건드렸음에도 매도하지 않고 버텼다면 감점, 원칙대로 수행했다면 가점을 부여합니다.
- **점수 산출**:
  - `Total Score = (수익성 점수 * w1) + (손절 원칙 준수 * w2) + (익절 원칙 준수 * w3) + (근거 작성 충실도 * w4)`
  - `w1`~`w4`는 사용자가 설정한 가중치

## 4. API 명세 (API Specification Summary)
주요 기능을 수행하기 위한 REST API 엔드포인트 설계입니다.

### 4.1 훈련 세션 (Simulation)
- **훈련 시작**: `POST /api/training/start`
  - **Input**: 종목 모드(랜덤/지정), 시작 날짜, 원칙 설정
  - **Output**: `sessionId`, 초기 차트 데이터
- **다음 캔들 조회**: `GET /api/training/{sessionId}/next-candles`
  - **Input**: 현재 가상 시간, 요청 캔들 개수
  - **Output**: 캔들 데이터 리스트 (미래 데이터 제외)

### 4.2 주문 및 매매 (Trading)
- **주문 접수**: `POST /api/orders`
  - **Input**: `sessionId`, `type`(BUY/SELL), `price`, `qty`, `reason`, `sl_price`, `tp_price`
  - **Logic**: 필수 입력값 검증(Validation) 수행 후 가상 체결 처리
- **잔고 조회**: `GET /api/training/{sessionId}/balance`
  - **Output**: 실현 손익, 미실현 손익, 현재 보유량

### 4.3 결과 및 리포트 (Report)
- **훈련 종료 및 채점**: `POST /api/training/{sessionId}/finish`
  - **Logic**: 전체 매매 내역 분석, 알고리즘 점수 계산
  - **Output**: `finalScore`, `complianceRate`(원칙 준수율)
- **상세 리뷰 조회**: `GET /api/reviews/{sessionId}`
  - **Output**: 차트 데이터 + 매매 마킹(매수/매도 시점) + 당시 작성한 근거 + 원칙 위반 여부 플래그

## 5. 개발 단계별 이정표 (Milestones)
- **Phase 1: 기초 환경 구축**
  - Spring Boot 프로젝트 생성 및 DB 연동
  - 주식 시세 데이터(과거 데이터) 확보 및 DB 적재 (크롤링 또는 API 활용)
- **Phase 2: 시뮬레이션 엔진 구현**
  - 타임머신 로직 (과거 시점 데이터 조회 API) 구현
  - 가상 체결 시스템 (주문 -> 잔고 반영) 구현
- **Phase 3: 강제성 및 평가 로직 구현**
  - 주문 시 텍스트 입력 강제 Validation 적용
  - 평가 알고리즘 (원칙 준수 여부 판단 로직) 개발
- **Phase 4: 리포트 및 고도화**
  - 훈련 결과 리포트 API 개발
  - 대용량 데이터 조회 성능 튜닝 (쿼리 최적화)