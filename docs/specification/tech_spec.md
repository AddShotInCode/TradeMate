# [TradeMate] 백엔드 기술 명세서 (Backend Technical Specification)

## 1. 개요 및 기술 스택 (Overview & Tech Stack)

### 1.1 프로젝트 개요
- **프로젝트명**: TradeMate
- **목표**: 뇌동매매 차단 및 원칙 기반의 매매 습관 형성을 위한 주식 훈련 시뮬레이션 플랫폼
- **핵심 가치**: 결과(수익금)보다 과정(원칙 준수)을 평가하는 알고리즘 구현

### 1.2 기술 스택 (Tech Stack)
| 구분 | 기술 | 버전 |
|---|---|---|
| **Language** | Java | 21 |
| **Framework** | Spring Boot | 3.5.9 |
| **Database** | MySQL | 8.0 |
| **ORM** | Spring Data JPA | - |
| **Build Tool** | Gradle | - |
| **Security** | Spring Security + JWT | jjwt 0.12.6 |
| **Validation** | Jakarta Validation | - |
| **Utilities** | Lombok, spring-dotenv | 4.0.0 |

### 1.3 외부 API 연동
| API | 제공처 | 용도 |
|---|---|---|
| 주식시세정보 API | 금융위원회 (공공데이터포털) | 일별 시세(OHLCV) 수집 |
| DART OpenAPI | 금융감독원 | 분기별 재무제표 공시 링크 수집 |

## 2. 프로젝트 구조 (Project Structure)

### 2.1 패키지 구조
```
src/main/java/aib/trademate/
├── TrademateApplication.java
├── domain/
│   ├── auth/           # 인증 (로그인, 회원가입, 토큰 관리)
│   │   ├── controller/
│   │   ├── dto/
│   │   └── service/
│   ├── member/         # 회원 정보
│   │   ├── entity/
│   │   └── repository/
│   ├── simulation/     # 시뮬레이션 훈련
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── repository/
│   │   └── service/
│   ├── statement/      # 재무제표
│   │   ├── client/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── repository/
│   │   └── service/
│   └── stock/          # 주식 시세
│       ├── client/
│       ├── config/
│       ├── controller/
│       ├── dto/
│       ├── entity/
│       ├── repository/
│       └── service/
└── global/
    ├── config/         # 전역 설정 (CORS, Security 등)
    ├── entity/         # 공통 엔티티 (BaseTimeEntity)
    ├── exception/      # 전역 예외 처리
    └── security/       # JWT 및 인증 관련
        └── jwt/
```

### 2.2 설정 파일
| 파일 | 용도 |
|---|---|
| `application.yml` | DB, JPA, 로깅, JWT, 외부 API 설정 |
| `stock-codes.yml` | 관리 대상 종목 리스트 (20개 종목) |
| `.env` | 환경 변수 (DB 인증정보, API 키 등 민감 정보) |

## 3. 데이터베이스 설계 (Database Design)

### 3.1 ERD 개요
```
members ─┬─< refresh_token
         └─< simulation ─< simulation_trade

stock ─< daily_price

statement (독립)
```

### 3.2 주요 테이블 구조
| 테이블명 | 역할 | 주요 컬럼 |
|---|---|---|
| **members** | 사용자 정보 | `id`, `email`, `password`(BCrypt), `name`, `birthdate`, `phone`, `role` |
| **refresh_token** | 리프레시 토큰 저장 | `id`, `member_id`(FK), `token`, `expiry_date` |
| **stock** | 종목 기본 정보 | `id`, `code`(UNIQUE), `name`, `market_type` |
| **daily_price** | 일별 시세 데이터 | `id`, `stock_id`(FK), `date`, `open_price`, `high_price`, `low_price`, `close_price`, `volume` |
| **statement** | 재무제표 공시 링크 | `id`, `stock_code`, `fiscal_year`, `qtr`, `rcept_no`, `rcept_dt` |
| **simulation** | 시뮬레이션 세션 | `id`, `member_id`(FK), `stock_code`, `start_date`, `end_date` |
| **simulation_trade** | 개별 거래 기록 | `id`, `simulation_id`(FK), `trade_date`, `balance`, `price`, `upper_limit`, `lower_limit`, `trade_type`, `volume`, `comment` |

### 3.3 인덱스 전략
- `daily_price`: `(stock_id, date)` 복합 UNIQUE 인덱스 - 종목별 기간 조회 최적화
- `simulation`: `member_id` 인덱스 - 사용자별 시뮬레이션 목록 조회
- `simulation_trade`: `simulation_id` 인덱스 - 시뮬레이션별 거래 내역 조회

## 4. 핵심 비즈니스 로직 (Core Logic)

### 4.1 JWT 기반 인증 시스템
- **토큰 저장**: HttpOnly 쿠키 (XSS 공격 방어)
- **Access Token**: 30분 유효
- **Refresh Token**: 7일 유효 (DB 저장 및 재발급)
- **비밀번호 암호화**: BCrypt 해시

### 4.2 시뮬레이션 점수 계산 알고리즘
매도 거래 발생 시 개별 거래 점수를 계산하고, 시뮬레이션 종료 후 가중 평균으로 총점을 산출합니다.

#### 개별 거래 점수 (s_i)
```
s_i = (R + C) / 2
```
- **R (Result)**: 결과 점수 (0 ~ 100)
  - 익절 (P_sell ≥ P_avg): 고정 100점
  - 손절 (P_sell < P_avg): `P_sell / P_avg × 100`
- **C (Compliance)**: 원칙 준수 점수 (0 ~ 100)
  - 익절 시: `(1.0 - |T - P_sell| / |T - P_avg|) × 100` (목표가 미만 매도 → 감점)
  - 손절 시: 손절가 이상 매도 → 100점, 손절가 미만 → `(1.0 - (S - P_sell) / |S - P_avg|) × 100`

#### 총점 계산 (가중 평균)
```
Total Score = Σ(s_i × v_i) / Σ(v_i)
```
- `v_i`: 각 매도 거래의 거래량 (큰 거래에 높은 가중치)

#### 등급 산출
| 점수 범위 | 등급 |
|---|---|
| 90점 이상 | A |
| 80점 이상 | B |
| 70점 이상 | C |
| 60점 이상 | D |
| 60점 미만 | F |

### 4.3 데이터 수집 자동화
- **주식 시세**: 매일 당일 시세 자동 업데이트 (스케줄러)
- **재무제표**: DART API 연동으로 분기별 공시 링크 수집
- **데이터 생명주기**: 1년 경과 데이터 자동 삭제

## 5. API 명세 (API Specification)

### 5.1 인증 API (`/api/auth`)
| Method | Endpoint | 설명 | 인증 |
|---|---|---|---|
| POST | `/signup` | 회원가입 | - |
| POST | `/login` | 로그인 (토큰 쿠키 발급) | - |
| POST | `/refresh` | 토큰 갱신 | 쿠키 |
| POST | `/logout` | 로그아웃 (쿠키 삭제) | 필요 |

### 5.2 주식 시세 API (`/api/stock`)
| Method | Endpoint | 설명 | 파라미터 |
|---|---|---|---|
| GET | `/{stockCode}` | 기간별 가격 조회 | `start`, `end`, `page`, `pageSize` |
| POST | `/init` | 시세 데이터 초기화 (관리자) | - |

### 5.3 재무제표 API (`/api/statement`)
| Method | Endpoint | 설명 | 파라미터 |
|---|---|---|---|
| GET | `/{stockCode}` | 재무제표 뷰어 링크 조회 | `year`, `quarter` |
| POST | `/init` | 공시 데이터 초기화 (관리자) | - |

### 5.4 시뮬레이션 API (`/api/simulation`)
| Method | Endpoint | 설명 | 파라미터 |
|---|---|---|---|
| POST | `/` | 시뮬레이션 생성 | `code`, `start` |
| GET | `/` | 내 시뮬레이션 목록 조회 | - |
| PATCH | `/{id}` | 종료일 업데이트 | `end` |
| DELETE | `/{id}` | 시뮬레이션 삭제 | - |
| POST | `/{id}/data` | 거래 데이터 추가 | Body: `AddTradeRequest` |
| GET | `/{id}/data` | 거래 데이터 목록 조회 | - |
| GET | `/{id}/report` | 결과 분석 보고서 조회 | - |

### 5.5 에러 응답 형식
```json
{
  "timestamp": "2026-02-07T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "code": "COMMON-001",
  "message": "Invalid input value",
  "path": "/api/simulation"
}
```

### 5.6 주요 에러 코드
| HTTP Status | Code | 설명 |
|---|---|---|
| 400 | COMMON-001 | 잘못된 입력값 |
| 400 | SIMULATION-002 | 시뮬레이션 미종료 상태 |
| 401 | AUTH-001 | 잘못된 이메일/비밀번호 |
| 401 | AUTH-002 | 유효하지 않은 토큰 |
| 403 | AUTH-020 | 접근 거부 |
| 404 | SIMULATION-001 | 시뮬레이션 없음 |
| 404 | STOCK-001 | 종목 없음 |
| 409 | AUTH-010 | 이메일 중복 |

## 6. 보안 설정 (Security Configuration)

### 6.1 인증 제외 경로
- `/api/auth/signup`, `/api/auth/login`, `/api/auth/refresh` - 회원가입/로그인/토큰갱신
- `/api/stock/**`, `/api/statement/**` - 공개 데이터 조회

### 6.2 인증 필요 경로
- `/api/simulation/**` - 시뮬레이션 관련 모든 API
- `/api/auth/logout` - 로그아웃

### 6.3 CORS 설정
- 허용 Origin: 프론트엔드 도메인 (`http://localhost:3000` 등)
- Credentials: 허용 (쿠키 전송)

## 7. 관리 대상 종목 (Supported Stocks)

총 20개 종목 (KOSPI 13개, KOSDAQ 7개)

| 시장 | 종목명 | 종목코드 |
|---|---|---|
| KOSPI | 삼성전자 | 005930 |
| KOSPI | SK하이닉스 | 000660 |
| KOSPI | 현대차 | 005380 |
| KOSPI | POSCO홀딩스 | 005490 |
| KOSPI | NAVER | 035420 |
| KOSPI | 기아 | 000270 |
| KOSPI | 셀트리온 | 068270 |
| KOSPI | 현대모비스 | 012330 |
| KOSPI | 신한지주 | 055550 |
| KOSPI | LG전자 | 066570 |
| KOSPI | 카카오 | 035720 |
| KOSPI | 엔씨소프트 | 036570 |
| KOSPI | 넷마블 | 251270 |
| KOSDAQ | 이스트아시아홀딩스 | 900110 |
| KOSDAQ | CJ ENM | 035760 |
| KOSDAQ | 카카오게임즈 | 293490 |
| KOSDAQ | 펄어비스 | 263750 |
| KOSDAQ | 위메이드 | 112040 |
| KOSDAQ | ISC | 095340 |
| KOSDAQ | 리노공업 | 058470 |

## 8. 개발 환경 설정 (Development Setup)

### 8.1 필수 환경 변수 (.env)
```properties
# Database
DB_URL=jdbc:mysql://localhost:3306/trademate
DB_USERNAME=your_username
DB_PASSWORD=your_password

# OpenAPI (공공데이터포털)
OPENAPI_URL=https://apis.data.go.kr/...
OPENAPI_SERVICE_KEY=your_service_key

# DART API (금융감독원)
DART_API_URL=https://opendart.fss.or.kr/api/...
DART_API_KEY=your_api_key

# JWT
JWT_SECRET=your_jwt_secret_key_at_least_256_bits
```

### 8.2 실행 방법
```bash
# 빌드
./gradlew build

# 실행
./gradlew bootRun

# 테스트
./gradlew test
```

### 8.3 초기 데이터 적재
서버 실행 후 다음 API를 순차 호출:
1. `POST /api/stock/init` - 주식 시세 초기화 (약 5분 소요)
2. `POST /api/statement/init` - 재무제표 공시 초기화