# BE

## 1) 네이밍(Naming)

- **패키지**: 전부 소문자, 단수형. `aib.trademate.user.service`
- **클래스/인터페이스/Enum**: `PascalCase`. `UserService`, `TradeType`
- **메서드/필드/변수**: `camelCase`. `findByEmail`, `createdAt`
- **상수**: `UPPER_SNAKE_CASE`. `MAX_RETRY`
- **JPA 엔티티**: 단수 명사. `User`, `Trade`
- **DTO**: `XxxRequestDto`, `XxxResponseDto` , `XxxDto`
  - API 입출력엔 Request/Response 접미사 권장.
- **Repository 메서드**: 의미가 드러나게. `findByEmail`, `existsById`, `findAllByStatusOrderByCreatedAtDesc`

## 2) 객체지향/설계 규칙

- `SRP`: 클래스/메서드는 한 가지 책임
- `LowService`, `HighService`
  단순히 쿼리만 날리는 메소드는 `XxxLowService`로 관리
  두 개 이상의 쿼리를 날리는 메소드는 비즈니스 로직으로 간주하고 `XxxService`로 관리

## 3) Null/Optional 처리

- null이 반환될 가능성이 있는 반환값은 모두 `Optional`로 래핑

## 4) 예외(Exceptions)

- 너무 상세한 예외 사용 자제, 포괄적인 예외 사용 권고
  잘못된 예: `NotFoundTradeException`
  좋은 예 : `NotFoundEntityException`

## 5) 로깅(Logging)

- `Slfj`를 통한 로깅
- 상황에 맞춰 적절한 레벨의 `Log`를 출력하기
    <aside>
    💡
    
    로깅 기준
    `TRACE` : 가장 세부적인 수준의 로그로, 코드의 세부적인 실행 경로를 추적할 때 사용
    
    `DEBUG` : 디버깅 목적의 로그로, 개발 중 코드의 상태나 흐름을 이해하기 위해 사용
    
    `INFO` : 시스템의 정상적인 운영 상태를 나타내는 정보성 로그로, 오류 상황은 아니면서 중요한 이벤트나 상태 변화를 기록
    
    `WARN` : 잠재적으로 문제가 될 수 있는 상황을 나타내지만, 시스템 운영에는 즉각적인 영향을 주지 않는 경우 사용
    
    `ERROR` - 치명적이지 않지만, 중요한 문제가 발생했음을 나타냅니다. 복구가 필요하거나 실패한 작업을 추적해야 할 때 사용
    
    `FATAL` - 시스템 운영을 계속할 수 없을 정도로 심각한 오류가 발생했을 때 사용
    
    </aside>

## 6) REST API

- 리소스는 **복수 명사**: `/api/trades`, `/api/trades/{id}/wishes`
- 가급적이면 엔드포인트에 동사 사용 금지
- 행위는 **HTTP 메서드로 표현**:
  - POST `/api/trades` (생성)
  - GET `/api/trades/{id}` (조회)
  - PUT `/api/trades/{id}` (전체 수정)
  - PATCH `/api/trades/{id}` (부분 수정)
  - DELETE `/api/trades/{id}` (삭제)

## 7) JPA/Hibernate

- **LAZY 기본**, 필요 시 fetch join
- 단방향 매핑이 기본, 꼭 필요한 경우에만 양방향 매핑 사용
- 너무 간단한 쿼리가 아닌 이상 `@Query`로 쿼리 작성하기
- 페치조인을 하는 경우 메서드 명에 `WithXxx` 를 넣어페치조인함을 명시

# FE

## **1) 네이밍(Naming)**

- **페이지 컴포넌트**: PascalCase 파일명. `TradesPage.tsx`
- **컴포넌트:** PascalCase(컴포넌트)
- **훅/유틸 함수**:  camelCase(함수·변수) `useChatRoom`, `formatTradeDate`
- **타입/인터페이스**: PascalCase. `Trade`, `PostTradesPickBody`
- **상수**: UPPER_SNAKE_CASE. `MAP_PINS, ROUTE_PATH`
- **React Query 키**: 배열로 정의하며 의미 있는 요소를 포함. `['trades', areaId, showCurrent]`, `['aiPick', requestData.areaCode]`
- **불리언/상태 변수**: 서술형 is, has, show 접두어. `isPending, hasNextPage, showCurrent`

## **2) 컴포넌트/폴더 구조**

- **페이지 루트**: `src/pages/<Module>/<Module>Page.tsx`
- **페이지 전용 컴포넌트**: `src/pages/<Module>/components/`에 분리 (AI 섹션, 카드 등)
- **공통 UI**: `src/components/common/`, 아이콘·폼 등은 도메인별 하위 폴더
- **데이터/로직 분리**: 데이터 패칭/공유 로직은 `src/hooks/`, 컨텍스트는 `src/context/`
- **Error/Loading 처리**: Suspense + ErrorBoundary + 스켈레톤 컴포넌트 조합

## **3) 상태 관리 & React Query**

- **쿼리 키**: 의존성을 모두 포함한 배열로 구성해 캐시 충돌 방지
- **Mutation 후 처리**: queryClient.invalidateQueries, setQueryData로 캐시 싱크 유지

## **4) 컴포넌트 작성 규칙**

- **함수형 컴포넌트** + 명시적 props 인터페이스 정의
- **조건부 렌더링/가드**: if (!requestData) return null; Early return 처리
- **Tailwind 스타일**: mobile-first, 기능 별 클래스 순서(레이아웃 → 타이포 → 컬러 → 상태) 유지
- **접근성**: 역할/ARIA 속성 명시 (role="switch", aria-checked)
- **필터/토글**: 상태와 쿼리 파라미터를 함께 업데이트해 URL 공유 가능

## 5) API·에러 처리

- API 모듈: `src/apis/<domain>/`에 분리, Axios 인스턴스 사용
- 에러 대응: `EmptyComponent`, `ErrorBoundary`로 fallback 또는 toast 메시지 표시
- 캐시 키 오류 방지: Mutation 성공 시 캐시 키 사용 (`['aiPick', variables.areaCode]`)

## 6) 라우팅 & URL

- `react-router-dom` v7 사용, 동적 경로는 `:param` 형식
- 라우터 상태 초기화 필요 시 `navigate(..., { replace: true })`로 state 제거
- 쿼리 파라미터는 `useSearchParams`로 읽고 쓰며, `setSearchParams` 시 기존 값을 복사해 업데이트

## **7) 문서화·주석**

- 복잡한 로직에는 간결한 한국어 주석으로 의도 설명
- URL 파라미터/캐시 의존성 등은 주석으로 흐름 명시 (// areaCode별 캐시 우선 사용)
- 변수/함수 이름 자체가 역할을 드러내도록 작성해 주석에 의존하지 않도록 한다
