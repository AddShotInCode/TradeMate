# 계정 페이지 프로필 사진 섹션 삭제

## 1. 배경 및 목적

- 계정(회원정보) 화면에서 현재 사용하지 않는 **프로필 사진(아바타) UI 섹션**을 제거하여 화면을 단순화하고 유지보수 비용을 줄이기 위함.

## 2. 프롬프트 (User Input)

```text
프로필사진과 관련된 부분 삭제해줘.
```

## 3. AI 응답 요약 (AI Output)

- 계정 페이지의 "프로필 사진" 섹션 JSX를 완전히 제거.
- 함께 사용되던 `lucide-react` 아이콘 import(`Upload`, `UserRound`)도 정리하여 린트/빌드 경고를 예방.

## 4. 결과 및 적용 (Result)

- 적용 파일: `src/app/account/page.tsx`
- 변경 내용:
  - "프로필 사진" 섹션(`<section>...</section>`) 삭제
  - `lucide-react` import에서 `Upload`, `UserRound` 제거
- 동작 확인:
  - 페이지 렌더링/컴파일 관점에서 타입/린트 오류 없음(IDE 기준)
