# 재무제표 뷰어 API 개발

## 1. 배경 및 목적

- 사용자가 `/api/statement/{종목코드}?year={사업연도}&quarter={분기}` 요청 시 해당 종목의 재무제표 원본 뷰어 링크를 제공하는 API 개발
- DART OpenAPI(금융감독원 전자공시시스템)를 활용하여 공시 데이터를 수집
- DB에 저장하고 스케줄링을 통해 주기적으로 업데이트
- 기재정정(수정 공시) 보고서까지 모두 저장하여 여러 버전의 보고서 제공

## 2. 프롬프트 (User Input)

### 2.1 초기 기능 요청

```text
사용자가 서버로 `/api/statement/{종목코드}?year={사업연도}&quarter={분기(1, 2, 3, 4)}` 요청을 하면, 
그 종목의 해당 연도, 분기의 재무제표 원본 뷰어 링크를 제공하는 api를 만들려고 해.

...

dart open api를 사용하여 20개 종목에 해당되는 공시 데이터를 db에 미리 저장해두고,
저장된 db를 가져오는 식으로 구현하자.
그리고 나중에 분기마다 공시가 추가될 때, 스케줄링을 통해 주기적으로 업데이트 하도록 하자.
```

### 2.2 버그 수정 요청 1 - MySQL 예약어 문제

```text
Error creating bean with name 'entityManagerFactory'
Caused by: org.hibernate.tool.schema.spi.SchemaManagementException: 
Schema-validation: missing column [quarter] in table [statement]
```

### 2.3 버그 수정 요청 2 - 트랜잭션 격리 문제

```text
Samsung Electronics를 제외한 나머지 19개 종목의 초기화가 모두 실패한다.
```

### 2.4 버그 수정 요청 3 - 기재정정 중복 문제

```text
Duplicate entry '005930-2024-4' for key 'statement.uk_statement_stock_fiscal'

"기재정정" 때문에 같은 분기인데 공시가 여러 개인 종목이 있는 것 같아.
그러면 동일한 분기에 대해 여러 보고서를 저장하고,
response에서도 하나만 담지 말고 여러 개를 담을 수 있도록 해야겠다.
```

## 3. AI 응답 요약 (AI Output)

### 3.1 구현 전략

기존 stock 도메인의 구조를 분석하여 동일한 패턴으로 statement 도메인 구현:
- **Entity**: `FinancialStatement` - 공시 데이터 저장
- **Repository**: `FinancialStatementRepository` - JPA 쿼리
- **DTO**: `DartApiDto`, `StatementResponseDto` - API 요청/응답 매핑
- **Client**: `DartOpenApiClient` - DART API 호출
- **Service**: `StatementLowService`, `StatementService` - 비즈니스 로직
- **Controller**: `StatementController` - REST 엔드포인트
- **Config**: `DartProperties` - DART API 설정

### 3.2 핵심 코드

#### 분기 판별 로직 (보고서명 파싱)
```java
private static final Pattern REPORT_PATTERN = Pattern.compile("\\((\\d{4})\\.(\\d{2})\\)");

private QuarterInfo parseReportToQuarter(String reportNm) {
    Matcher matcher = REPORT_PATTERN.matcher(reportNm);
    if (!matcher.find()) return null;
    
    int year = Integer.parseInt(matcher.group(1));
    int month = Integer.parseInt(matcher.group(2));
    
    if (reportNm.contains("사업") && month == 12) return new QuarterInfo(year, 4);
    else if (reportNm.contains("분기") && month == 3) return new QuarterInfo(year, 1);
    else if (reportNm.contains("반기") && month == 6) return new QuarterInfo(year, 2);
    else if (reportNm.contains("분기") && month == 9) return new QuarterInfo(year, 3);
    return null;
}
```

#### 트랜잭션 격리 (독립 트랜잭션)
```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void saveAllInNewTransaction(List<FinancialStatement> statements) {
    financialStatementRepository.saveAll(statements);
}
```

### 3.3 버그 수정 내역

| 문제 | 원인 | 해결 |
|------|------|------|
| MySQL 예약어 | `quarter`가 MySQL 예약어 | 컬럼명을 `qtr`로 변경 |
| 트랜잭션 캐스케이드 | 한 종목 실패 시 전체 세션 오염 | `Propagation.REQUIRES_NEW`로 독립 트랜잭션 |
| 중복 엔트리 | 기재정정으로 같은 분기 보고서 다수 존재 | Unique Key를 `rcept_no`로 변경, 리스트 응답 |

## 4. 결과 및 적용 (Result)

### 4.1 생성된 파일

| 파일 | 위치 | 설명 |
|------|------|------|
| `DartProperties.java` | `domain/statement/config/` | DART API URL, API Key 설정 |
| `FinancialStatement.java` | `domain/statement/entity/` | 공시 데이터 Entity |
| `FinancialStatementRepository.java` | `domain/statement/repository/` | JPA Repository |
| `DartApiDto.java` | `domain/statement/dto/` | DART API 응답 DTO |
| `StatementResponseDto.java` | `domain/statement/dto/` | 클라이언트 응답 DTO |
| `DartOpenApiClient.java` | `domain/statement/client/` | DART API 클라이언트 |
| `StatementLowService.java` | `domain/statement/service/` | 저수준 DB 접근 서비스 |
| `StatementService.java` | `domain/statement/service/` | 비즈니스 로직 서비스 |
| `StatementController.java` | `domain/statement/controller/` | REST 컨트롤러 |
| `StatementNotFoundException.java` | `global/exception/` | 404 예외 |

### 4.2 수정된 파일

| 파일 | 변경 내용 |
|------|-----------|
| `stock-codes.yml` | 각 종목에 `corpCode` 추가 |
| `application.yml` | `dart-api.url`, `dart-api.api-key` 추가 |
| `.env.example` | `DART_API_URL`, `DART_API_KEY` 추가 |
| `StockProperties.java` | `StockInfo` 클래스 추가 (code + corpCode) |
| `GlobalExceptionHandler.java` | `StatementNotFoundException` 핸들러 추가 |
| `db_schema.sql` | `statement` 테이블 추가 |

### 4.3 DB 스키마

```sql
CREATE TABLE statement (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stock_code VARCHAR(6) NOT NULL,
    fiscal_year INT NOT NULL,
    qtr INT NOT NULL,
    rcept_no VARCHAR(14) NOT NULL,
    rcept_dt VARCHAR(8) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_statement_rcept_no (rcept_no)
);
```

### 4.4 API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/statement/init` | 전체 종목 초기화 |
| GET | `/api/statement/{stockCode}?year={year}&quarter={quarter}` | 재무제표 조회 |

### 4.5 응답 예시

**요청**: http://localhost:8080/api/statement/035720?year=2024&quarter=4
```json
{
    "totalElements": 2,
    "items": [
        {
            "rcept_link": "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20250324000901",
            "rcept_dt": "20250324"
        },
        {
            "rcept_link": "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20250318001297",
            "rcept_dt": "20250318"
        }
    ]
}
```

### 4.6 배운 점

1. **MySQL 예약어 주의**: `quarter`, `order`, `group` 등 예약어를 컬럼명으로 사용 시 문제 발생
2. **트랜잭션 격리의 중요성**: 배치 작업에서 개별 항목 실패가 전체에 영향을 주지 않도록 `REQUIRES_NEW` 활용
3. **실제 데이터 패턴 파악**: 기재정정 등 예상치 못한 데이터 패턴이 존재하므로 유연한 설계 필요
4. **보고서명 파싱**: 접수일자가 아닌 보고서명의 날짜 정보로 정확한 분기 판별 가능
