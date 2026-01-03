# TradeMate 백엔드 MVP 개발 및 핵심 로직 구현

## 1. 배경 및 목적

- **배경**: 주식 과거 데이터를 활용한 타임머신 시뮬레이션 플랫폼 'TradeMate'의 핵심 비즈니스 로직 처리와 안정적인 데이터 관리를 위한 서버 구축이 필요함.
- **목적**:
    1. **기반 환경 구축**: Spring Boot 3.3 + Java 21 기반의 최신 기술 스택을 적용하여 안정적이고 확장 가능한 서버 환경 구성.
    2. **데이터 파이프라인**: 한국투자증권(KIS) API 데이터를 가공하여 MySQL에 적재하고, 대용량 조회 성능 최적화를 위한 인덱싱(Indexing) 적용.
    3. **핵심 로직 구현**: 시뮬레이션 엔진(타임머신 기능), 가상 주문 체결(Atomic Update), 심화 채점(손절 원칙 준수 여부 판단) 알고리즘 개발.
    4. **API 제공**: 프론트엔드와 원활하게 연동 가능한 RESTful API(Start, Status, Order, Finish, Report) 명세 확립 및 구현.

## 2. 프롬프트 (User Input)

```text
TradeMate 백엔드 MVP(최소 기능 제품) 개발을 위한 단계별 구현을 진행해줘.

1. 프로젝트 구조: com.trademate.backend 하위에 도메인별(simulation, order, candle, review) 패키지 구조 설계.
2. 시뮬레이션 엔진: SimulationService를 구현하여 훈련 세션 생성 및 가상 시간(current_virtual_time) 관리 로직 작성.
3. 데이터 조회 최적화: QueryDSL을 사용하여 특정 기간의 캔들 조회 및 최저/최고가(Min/Max) 집계 쿼리 구현.
4. 주문 시스템: OrderService를 통해 매수/매도 주문을 처리하고, 잔고와 보유 수량을 원자적으로 갱신하는 로직 구현.
5. 채점 알고리즘: 훈련 종료 시(finish), 매매 기간 내 최저가를 조회하여 손절 원칙을 지켰는지 평가하는 ScoringService 구현.
6. 리포트 API: 최종적으로 차트 데이터, 매매 마킹, 성적표를 통합 반환하는 ReportService 및 DTO 설계.
```

## 3. AI 응답 요약 (AI Output)

- **아키텍처 설계**: 도메인 주도 설계(DDD) 원칙에 입각하여 Package-by-Feature 구조를 제안 및 적용, 유지보수성 확보.
- **데이터베이스 최적화**: 대량의 캔들 데이터 조회를 위해 candles 테이블에 stock_code + date_time 복합 인덱스를 적용하여 조회 성능 확보.
- **핵심 기능 구현**:
    - **타임머신**: 미래 데이터를 차단하고 현재 가상 시간(Virtual Time)을 기준으로 과거 데이터를 순차적으로 서빙하는 로직 구현.
    - **손절 원칙 검증(존버 방지)**: QueryDSL을 활용해 매수 시점과 매도 시점 사이의 Min(Low Price)를 추적하여 손절 원칙 미준수 페널티 로직 적용.
- **API 명세 구현**:
    - `POST /training/start`: 훈련 세션 생성 및 초기화.
    - `GET /next-candles`: 시간 전진 및 다음 캔들 데이터 제공.
    - `POST /orders`: 매수/매도 주문 체결 및 잔고 갱신.
    - `POST /finish`: 훈련 종료 처리 및 채점 알고리즘 실행.
    - `GET /reports/{id}`: 최종 결과 리포트 및 차트 데이터 조회.
- **설정 및 유틸**: WebConfig를 통한 CORS 설정, QueryDslConfig 빈 등록, 전역 예외 처리(GlobalExceptionHandler) 적용.

## 4. 결과 및 적용 (Result)

- **백엔드 MVP 완성**: 시뮬레이션의 시작부터 주문, 종료, 결과 분석까지 이어지는 전체 라이프사이클을 처리하는 API 서버 구축 완료.
- **안정성 확보**: 주요 로직에 트랜잭션 관리(@Transactional)와 동시성 제어 로직을 적용하여 데이터 무결성 보장.
- **연동 준비 완료**: 프론트엔드(React)와의 통신을 위한 명확한 API 명세가 확정되었으며, CORS 이슈 해결로 즉시 통합 테스트 가능.
- **확장성**: 향후 사용자 인증(Security), 랭킹 시스템, 전략 커스터마이징 기능을 추가하기 용이한 모듈형 구조 확보.