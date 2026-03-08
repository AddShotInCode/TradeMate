# 주식 시뮬레이션 CRUD API 구현

## 1. 배경 및 목적

- 사용자가 주식투자 시뮬레이션을 생성하고, 거래 데이터를 기록할 수 있는 기능 필요
- 각 사용자는 자신만의 시뮬레이션을 관리하고, 타인의 시뮬레이션에는 접근 불가
- 시뮬레이션 삭제 시 관련 거래 데이터도 함께 삭제되어야 함

## 2. 프롬프트 (User Input)

```text
목표는 사용자의 주식투자 simulation 정보를 저장하고 반환해주는 api를 만드는 것이야.
각 사용자는 개인 투자 simulation들을 생성할 수 있고, 각 simulation은 다음과 같은 정보를 가져.

시뮬레이션 id: 시뮬레이션을 구분하는 id.
사용자 id: 어떤 사용자의 시뮬레이션인지 나타내는 사용자 id.
종목코드: 시뮬레이션 대상 종목코드.
시작지점: 시뮬레이션의 시작점에 해당하는 날짜.
종료지점: 시뮬레이션의 종료점에 해당하는 날짜.(default는 null)
시뮬레이션 생성 일자: 시뮬레이션이 생성된 날짜.

하나의 시뮬레이션은 다음과 같은 거래 데이터들을 가져.

거래 데이터 id: 데이터를 구분하는 id.
시뮬레이션 id: 어떤 시뮬레이션의 데이터인지 구분하는 id.
거래시점: 시뮬레이션 중 언제 일어난 거래인지 나타내는 날짜.
보유수: 거래 전 사용자의 해당 주식 보유수.
가격: 거래 시점에 해당 주식 한 주의 가격.
상한: 사용자가 설정한 상한.
하한: 사용자가 설정한 하한.
거래종류: 거래의 종류(매수(b), 매도(s) 중 하나).
거래량: 사용자가 거래한 주식 수.
코멘트: 사용자가 해당 거래에 대해 작성하는 메모용 문자열(최대 100자).

사용 시나리오:
- 사용자는 시뮬레이션을 생성할 수 있어. (POST /api/simulation)
- 사용자는 시뮬레이션의 종료시점을 업데이트 할 수 있어. (PATCH /api/simulation/{id})
- 사용자는 자신이 생성한 시뮬레이션의 목록을 조회할 수 있어. (GET /api/simulation)
- 사용자는 자신의 시뮬레이션을 삭제할 수 있어. (DELETE /api/simulation/{id})
- 사용자는 특정 시뮬레이션에 거래 데이터를 추가할 수 있어. (POST /api/simulation/{id}/data)
- 사용자는 특정 시뮬레이션의 거래 데이터 목록을 조회할 수 있어. (GET /api/simulation/{id}/data)

이 시나리오들은 모두 사용자가 로그인되어있을 때만 작동하는 api들이고, 특정 시뮬레이션에 대한 조작을 할 때, 자신이 소유한 시뮬레이션이 아니라면 접근이 불가능해야 해.
```

## 3. AI 응답 요약 (AI Output)

### 설계 피드백
- 거래 데이터 추가 시 Query Param 대신 **Request Body** 사용 권장 (코멘트에 특수문자 가능)
- `/data` 경로로 시뮬레이션과 거래 데이터 리소스 분리
- PATCH 성공 시 201이 아닌 **200 OK** 사용 (리소스 수정은 201이 아님)
- DELETE 성공 시 **204 No Content** 사용

### 구현 구조
```
domain/simulation/
├── controller/
│   └── SimulationController.java
├── service/
│   └── SimulationService.java
├── repository/
│   ├── SimulationRepository.java
│   └── SimulationTradeRepository.java
├── entity/
│   ├── Simulation.java
│   ├── SimulationTrade.java
│   ├── TradeType.java (Enum)
│   └── TradeTypeConverter.java
└── dto/
    ├── AddTradeRequest.java
    ├── CreateSimulationResponse.java
    ├── SimulationResponse.java
    ├── SimulationListResponse.java
    ├── TradeResponse.java
    └── TradeListResponse.java
```

### DB 스키마
```sql
CREATE TABLE simulation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    stock_code VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE TABLE simulation_trade (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    simulation_id BIGINT NOT NULL,
    trade_date DATE NOT NULL,
    balance INT NOT NULL,
    price INT NOT NULL,
    upper_limit INT NOT NULL,
    lower_limit INT NOT NULL,
    trade_type CHAR(1) NOT NULL,  -- 'B': 매수, 'S': 매도
    volume INT NOT NULL,
    comment VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (simulation_id) REFERENCES simulation(id) ON DELETE CASCADE
);
```

### 소유권 검증 로직
```java
private Simulation findSimulationWithOwnerCheck(String email, Long simulationId) {
    Member member = findMemberByEmail(email);
    Simulation simulation = simulationRepository.findById(simulationId)
            .orElseThrow(() -> new BusinessException(ErrorCode.SIMULATION_NOT_FOUND, ...));
    
    if (!simulation.getMemberId().equals(member.getId())) {
        throw new BusinessException(ErrorCode.ACCESS_DENIED, ...);
    }
    return simulation;
}
```

### TradeType Enum과 Converter
- `TradeType.BUY` → DB에 'B' 저장
- `TradeType.SELL` → DB에 'S' 저장
- `TradeTypeConverter`로 Enum ↔ String 자동 변환

## 4. 결과 및 적용 (Result)

### 생성된 파일 (11개)
| 파일 | 설명 |
|------|------|
| `Simulation.java` | 시뮬레이션 엔티티 |
| `SimulationTrade.java` | 거래 데이터 엔티티 |
| `TradeType.java` | 거래 종류 Enum (BUY/SELL) |
| `TradeTypeConverter.java` | Enum ↔ DB 코드 변환기 |
| `SimulationRepository.java` | 시뮬레이션 JPA Repository |
| `SimulationTradeRepository.java` | 거래 데이터 JPA Repository |
| `SimulationService.java` | 비즈니스 로직 + 소유권 검증 |
| `SimulationController.java` | 6개 API 엔드포인트 |
| DTO 클래스 6개 | Request/Response DTOs |

### 수정된 파일
| 파일 | 변경 내용 |
|------|-----------|
| `db_schema.sql` | simulation, simulation_trade 테이블 추가 |
| `ErrorCode.java` | `SIMULATION_NOT_FOUND` 에러 코드 추가 |

### API 엔드포인트
| Method | Endpoint | 설명 | 응답 |
|--------|----------|------|------|
| `POST` | `/api/simulation?code=&start=` | 시뮬레이션 생성 | 201 |
| `GET` | `/api/simulation` | 내 시뮬레이션 목록 | 200 |
| `PATCH` | `/api/simulation/{id}?end=` | 종료일 업데이트 | 200 |
| `DELETE` | `/api/simulation/{id}` | 시뮬레이션 삭제 | 204 |
| `POST` | `/api/simulation/{id}/data` | 거래 추가 | 201 |
| `GET` | `/api/simulation/{id}/data` | 거래 목록 조회 | 200 |

### 추가 작업: Null Type Safety 경고 해결
- `SimulationService`에 `@SuppressWarnings("null")` 추가
- JPA `save()` 반환값과 Builder 객체는 런타임에서 null이 아님이 보장됨

### 배운 점
- Cascade 삭제는 JPA의 `@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)`와 DB의 `ON DELETE CASCADE`로 이중 보장
- TradeType처럼 코드값으로 저장해야 하는 Enum은 `AttributeConverter`를 사용
- SecurityConfig에서 `.anyRequest().authenticated()` 설정으로 새 경로도 자동으로 인증 필요
