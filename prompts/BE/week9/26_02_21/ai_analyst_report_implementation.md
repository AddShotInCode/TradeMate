# AI 애널리스트 리포트 기능 구현

## 1. 배경 및 목적

- 기존 시뮬레이션 보고서 API(`GET /api/simulation/{id}/report`)는 매 요청마다 점수를 재계산하는 구조였음
- 보고서 생성(POST)과 조회(GET)를 분리하여, 한 번 생성된 보고서를 DB에 저장하고 반복 조회 시 재계산 없이 반환하도록 개선
- 이후 Gemini 2.5 Flash LLM을 활용한 AI 애널리스트 점수(aiScore)와 코멘트(aiComment)를 보고서에 추가
- AI 분석 실패 시에도 보고서 자체는 정상 생성되는 graceful degradation 전략 적용

## 2. 프롬프트 (User Input)

### 2-1. Report API 분리

```text
기존에 GET /api/simulation/{id}/report 하나의 API에서 계산, 조회를 모두 진행하고 있습니다.
이를 리포트 생성(POST), 리포트 조회(GET)로 분리합니다.
POST에서 계산과 DB 저장을 진행하고, GET에서 저장된 값을 조회합니다.
```

### 2-2. AI 애널리스트 기능 추가

```text
분석 리포트에 llm을 이용한 AI 애널리스트의 점수와 코멘트를 추가합니다.
모델은 gemini 2.5 flash를 사용합니다.
```

### 2-3. Gemini API 인증 방식 수정

```text
gemini api 호출 부분에서 오류가 발생했습니다.
https://ai.google.dev/api?hl=ko#request-body-structure
api 호출에 관한 공식 문서를 다시 읽고, 문제의 원인에 대해서 분석해주세요.
```

### 2-4. JSON 파싱 오류 수정

```text
[Gemini API] Failed to parse response: Illegal unquoted character ((CTRL-CHAR, code 10)):
has to be escaped using backslash to be included in string value
parsing 과정에서 오류가 발생했습니다. 오류의 원인을 분석하여 해결해주세요.
```

### 2-5. 디버그 로깅 추가

```text
debug 모드에서 ai에게 전달하기 위해 만들어진 최종 프롬프트와,
ai의 응답 원문을 로그로 남기기 위한 계획을 세워주세요.
```

## 3. AI 응답 요약 (AI Output)

### Report API 분리
- `SimulationReport`, `ReportTradeScore` 엔티티 생성 (정규화 테이블)
- `SimulationReportRepository` 추가
- `ErrorCode`에 `REPORT_ALREADY_EXISTS`(409), `REPORT_NOT_FOUND`(404) 추가
- `SimulationService`를 `generateReport()`(POST)과 `getReport()`(GET)으로 분리
- `SimulationController`에 `POST /{id}/report`, `GET /{id}/report` 매핑

### AI 애널리스트 기능
- DB: `simulation_report` 테이블에 `ai_score INT`, `ai_comment TEXT` 컬럼 추가
- `GeminiProperties`: `@ConfigurationProperties(prefix = "gemini-api")`로 url, apiKey, model 관리
- `GeminiRestTemplateConfig`: Gemini 전용 RestTemplate (connect 5s, read 60s)
- `GeminiApiClient`: Gemini REST API 호출, 응답 JSON 파싱, 실패 시 null 반환
- `GeminiPromptBuilder`: 차트 데이터(StockService, pageSize=10000) + 거래 내역 + 시스템 프롬프트를 조합
- `analyst-prompt.txt`: AI 애널리스트 역할/분석기준/JSON 출력 형식 정의
- `SimulationService.generateReport()`에서 AI 분석 후 `aiScore`, `aiComment` 설정

### Gemini API 인증 방식 수정
- 공식 문서 확인 결과, API 키는 `?key=` 쿼리 파라미터가 아닌 `x-goog-api-key` 헤더로 전달해야 함
- URL에 API 키가 노출되는 보안 문제도 함께 해결

### JSON 파싱 오류 수정
- Gemini 응답의 `comment` 필드에 줄바꿈(`\n`, code 10)이 이스케이프 없이 포함됨
- `JsonReadFeature.ALLOW_UNESCAPED_CONTROL_CHARS`를 적용한 lenient reader로 해결

### 디버그 로깅
- `GeminiApiClient.analyze()`에 프롬프트 전문과 응답 원문을 DEBUG 레벨로 기록

## 4. 결과 및 적용 (Result)

### 생성된 파일
| 파일 | 설명 |
|------|------|
| `domain/simulation/config/GeminiProperties.java` | Gemini API 설정 프로퍼티 |
| `domain/simulation/config/GeminiRestTemplateConfig.java` | 전용 RestTemplate (60s timeout) |
| `domain/simulation/client/GeminiApiClient.java` | Gemini REST API 클라이언트 |
| `domain/simulation/service/GeminiPromptBuilder.java` | 프롬프트 조합기 |
| `resources/prompts/analyst-prompt.txt` | AI 애널리스트 시스템 프롬프트 |

### 수정된 파일
| 파일 | 변경 내용 |
|------|-----------|
| `db_schema.sql` | `simulation_report` 테이블에 `ai_score`, `ai_comment` 컬럼 추가 |
| `SimulationReport.java` | `aiScore`, `aiComment` 필드 추가 (`@Setter`) |
| `ReportSummary.java` | record에 `aiScore`, `aiComment` 필드 + Builder 반영 |
| `application.yml` (main/test) | `gemini-api` 설정 섹션 추가 |
| `SimulationService.java` | AI 분석 호출 통합, `getReport()`에 AI 필드 매핑 |
| `SimulationServiceTest.java` | `GeminiPromptBuilder`, `GeminiApiClient` mock 추가 |
| `SimulationControllerTest.java` | `aiScore`, `aiComment` 응답 검증 추가 |

### 배운 점 및 특이사항
- **Gemini API 인증**: 공식 문서 기준 `x-goog-api-key` 헤더 방식이 정석. 쿼리 파라미터 방식은 로그에 키가 노출되는 보안 문제 존재
- **LLM 응답 파싱**: LLM이 생성하는 JSON에는 제어 문자(줄바꿈 등)가 이스케이프 없이 포함될 수 있으므로 `ALLOW_UNESCAPED_CONTROL_CHARS` 설정 필수
- **Graceful degradation**: AI 분석 실패 시 `aiScore=null`, `aiComment=null`로 보고서 정상 저장. 핵심 기능(점수 계산)에 영향 없음
- **Timeout 설정**: Gemini 2.5 Flash는 thinking 모델이라 응답 생성에 30초 이상 소요될 수 있어 read timeout 60초 적용
