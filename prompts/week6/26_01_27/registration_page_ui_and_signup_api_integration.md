# 회원가입 페이지 UI 개선 및 Signup API 연동

## 1. 배경 및 목적

- 회원가입 페이지 중앙 카드 상단 디자인이 “반 파랑 / 반 회색”으로 보이던 요소를 파랑으로 꽉 채우도록 UI를 개선했습니다.
- 회원가입을 실제 백엔드와 연결하기 위해, 명세서 기준 `POST /api/auth/signup`로 가입 요청을 보내도록 프론트 로직을 구현했습니다.
- 전화번호는 선택 입력이므로, 미입력 시 가입이 실패하지 않도록 `phone: null`로 전송하도록 수정했습니다.
- 로그인 페이지에서 “게스트로 계속하기” 버튼을 제거하여 로그인 플로우를 단순화했습니다.

## 2. 프롬프트 (User Input)

```text
회원가입 페이지에서 중앙 카드 윗면에 파랑 반 회색 반으로 디자인 돼있는거 파랑으로 다 채워줘.

로그인 창에서 게스트로 로그인 제거해줘

회원가입, 로그인 기능을 백과 연결할거야. inquiry나 simulation페이지에서 연결한 방식으로 연결할 플랜을 짜봐.

이 명세서 토대로 회원가입 기능을 백과 연결할거야. 이대로 진행할 플랜을 짜줘.

플랜대로 진행해줘

지금은 전화번호 입력안하면 Invalid input value 뜨면서 회원가입 안되는데 전화번호 입력안하면 phone에는 그냥 null 넘기게 해줘.
```

## 3. AI 응답 요약 (AI Output)

- **UI 개선**
  - 회원가입 카드 상단의 “반 파랑/반 회색” 바를 단색 파랑으로 변경.

- **백엔드 연동 설계(기존 패턴 준수)**
  - inquiry/simulation과 동일하게 `src/services`의 axios 서비스 패턴을 따라 `authService`를 추가.
  - Next.js에서 `/api/*`를 백엔드로 프록시하는 rewrite 규칙을 전제로, 프론트는 `/api/auth/signup`만 호출.

- **로그인 UI 정리**
  - 로그인 페이지에서 “게스트로 계속하기” 버튼 제거.
  - 게스트 버튼 전용 “또는” 구분선 제거.
  - 사용되지 않게 된 아이콘 import 정리.

- **회원가입 연동 구현**
  - `birthYear/birthMonth/birthDay` → `birthdate: YYYY-MM-DD`로 변환.
  - `phone`은 선택 입력이므로:
    - 입력값 존재 + 11자리면 `010-1234-5678` 포맷으로 전송
    - 입력값 없으면 `phone: null`로 전송
  - 제출 중 로딩/버튼 비활성화 + 서버 에러 메시지(409 이메일 중복 등) 노출.
  - 성공 시 `tm_userName`을 localStorage에 저장 후 `/login`으로 이동.

## 4. 결과 및 적용 (Result)

- 실제 반영된 변경 사항
  - UI: 회원가입 카드 상단 바를 단색 파랑으로 변경
    - 적용 파일: `src/app/register/page.tsx`
  - Signup API 연동: `POST /api/auth/signup` 호출을 위한 서비스/로직 추가
    - 신규 파일: `src/services/authService.ts`
    - 적용 파일: `src/app/register/page.tsx`
  - 전화번호 미입력 시 `phone: null` 전송
    - 적용 파일: `src/services/authService.ts`, `src/app/register/page.tsx`
  - 로그인 페이지에서 게스트 버튼 제거
    - 적용 파일: `src/app/login/page.tsx`

- 비고
  - 프로젝트 `npm run lint`는 기존 코드의 lint 에러가 있어 전체적으로는 실패할 수 있으나, 본 작업에서 수정/추가한 파일은 타입/문법 에러 없이 적용되었습니다.

- 배운 점/특이사항
  - 기존 페이지(조회/시뮬레이션)의 통신 패턴(서비스 모듈 + `/api` rewrite)을 그대로 확장하면 인증 도메인도 일관되게 구현할 수 있습니다.
  - 선택 입력 필드는 “생략” vs “null 전송” 중 백엔드 요구사항에 맞추는 것이 중요합니다(본 케이스는 `null` 전송 요구).
