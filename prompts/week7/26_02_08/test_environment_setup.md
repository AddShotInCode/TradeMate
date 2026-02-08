# 테스트 환경 설정 및 테스트 코드 작성

## 1. 배경 및 목적

- 프로젝트에 테스트 환경을 구축하고 코드 신뢰성 확보
- 주요 기능과 공통 UI 컴포넌트에 대한 단위 테스트 작성
- CI 파이프라인 구축을 위한 기반 마련

## 2. 프롬프트 (User Input)

```text
프로젝트에 테스트 환경을 넣고 싶어, 간단한 테스트 케이스도 만들어줘
```

추가 요청:
```text
테스트 coverage 에서 simulationStore.ts 41.5%로 부족해
```

## 3. AI 응답 요약 (AI Output)

### 테스트 환경 설정
- Jest + React Testing Library 기반 테스트 환경 구축
- `jest.config.ts`, `jest.setup.ts` 설정 파일 생성
- `package.json`에 테스트 스크립트 추가 (`test`, `test:watch`, `test:coverage`)

### 작성된 테스트 파일
| 구분 | 파일 | 테스트 수 |
|------|------|-----------|
| UI | `Button.test.tsx` | 23 |
| UI | `Input.test.tsx` | 18 |
| UI | `Card.test.tsx` | 21 |
| Store | `authStore.test.ts` | 9 |
| Store | `simulationStore.test.ts` | 27 |
| Service | `authService.test.ts` | 6 |
| Service | `simulationService.test.ts` | 7 |

### CI 설정
- `.github/workflows/test.yml` GitHub Actions 워크플로우 생성
- main/develop 브랜치 push/PR 시 자동 테스트 실행

## 4. 결과 및 적용 (Result)

### 테스트 결과
```
Test Suites: 8 passed, 8 total
Tests:       110 passed, 1 skipped, 111 total
```

### 커버리지 (simulationStore.ts)
| 항목 | 개선 전 | 개선 후 |
|------|---------|---------|
| Statements | 41.5% | 81.02% |
| Branches | 79.16% | 86.66% |
| Functions | 46.15% | 92.85% |

### 배운 점
- JSDOM에서 `window.location`을 재정의하기 어려워 리다이렉트 테스트에 한계가 있음
- Zustand 스토어 테스트 시 `setState`로 초기화 후 테스트 진행하는 패턴 적용
- axios mock 시 실제 응답 구조와 일치하게 mock 데이터 구성 필요

### 향후 개선 가능 사항
- 거래 내역 복원 로직 테스트 보완 (미커버 라인: 210-275, 291-313)
- E2E 테스트 추가 (Playwright 또는 Cypress)
