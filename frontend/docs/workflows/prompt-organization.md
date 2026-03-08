---
description: 프롬프트 정리 및 주간보고서 업데이트
---

# 프롬프트 정리 및 주간보고서 업데이트 워크플로우

## 📋 목적 및 사용 시나리오

이 워크플로우는 **개발 과정에서 유의미한 AI 프롬프트를 체계적으로 기록**하고, **주간 진행 상황을 효율적으로 관리**하기 위한 자동화 프로세스입니다.

### 언제 사용하나요?

1. **프롬프트 정리**: AI와의 대화에서 코드 변경이 실제로 수락되었거나, 중요한 문제를 해결했을 때
2. **주간보고서 작성**: 주말 또는 주차 종료 시점에 일괄적으로 진행 상황을 정리할 때

### 저장 경로 구조

```
prompts/
├── week1/
│   └── 25_12_24/
│       └── 로그인_API_구현.md
├── week7/
│   └── 26_02_10/
│       ├── SEO_최적화_메타데이터.md
│       ├── canonical_url_수정.md
│       └── ...
└── README.md (프롬프트 저장 컨벤션)
```

---

## ⚡ 빠른 시작 (통합 스크립트)

### 프롬프트 문서 생성 (원 클릭)

아래 스크립트를 PowerShell에서 **한 번에 실행**하면 모든 과정이 자동으로 진행됩니다:

```powershell
# ========================================
# 프롬프트 문서 생성 통합 스크립트
# ========================================

# 1. 현재 주차 자동 계산
$startDate = Get-Date "2024-12-22"
$currentDate = Get-Date
$daysDiff = ($currentDate - $startDate).Days
$weekNumber = [Math]::Ceiling($daysDiff / 7)
$currentWeek = "week$weekNumber"
$dateFolder = $currentDate.ToString("yy_MM_dd")

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📅 현재 주차: $currentWeek" -ForegroundColor Green
Write-Host "📅 날짜 폴더: $dateFolder" -ForegroundColor Green
Write-Host "📂 전체 경로: prompts\$currentWeek\$dateFolder" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# 2. 디렉토리 생성
$promptDir = "prompts\$currentWeek\$dateFolder"
if (-not (Test-Path $promptDir)) {
    New-Item -ItemType Directory -Path $promptDir -Force | Out-Null
    Write-Host "✅ 디렉토리 생성 완료: $promptDir" -ForegroundColor Green
} else {
    Write-Host "ℹ️  디렉토리가 이미 존재합니다: $promptDir" -ForegroundColor Blue
}

# 3. 프롬프트 제목 입력
Write-Host "`n📝 프롬프트 주제/기능 이름을 입력하세요 (예: SEO_최적화, 로그인_버그_수정)" -ForegroundColor Cyan
$promptTitle = Read-Host "입력"
$promptFile = "$promptDir\$promptTitle.md"

# 4. 템플릿 파일 생성
$template = @"
# $promptTitle

## 1. 배경 및 목적

- [여기에 배경 및 목적을 작성하세요]
- 예: "canonical URL이 잘못 설정되어 SEO 점수가 낮아지는 문제가 발생했습니다."

## 2. 프롬프트 (User Input)

``````text
[여기에 실제로 사용한 프롬프트 내용을 붙여넣으세요]
``````

## 3. AI 응답 요약 (AI Output)

- [AI가 제안한 해결책의 핵심 내용을 bullet point로 작성하세요]
- 예: "layout.tsx에서 canonical URL을 동적으로 생성하도록 수정"
- 예: "환경변수에서 trailing slash 제거"

## 4. 결과 및 적용 (Result)

- **적용 내용**: 실제 코드에 어떻게 적용되었는지
- **추가 수정**: AI 제안 외 추가로 수정한 사항
- **배운 점**: 이번 작업에서 배운 인사이트나 특이사항
"@

Set-Content -Path $promptFile -Value $template -Encoding UTF8
Write-Host "`n✅ 프롬프트 파일 생성 완료!" -ForegroundColor Green
Write-Host "📄 파일 경로: $promptFile" -ForegroundColor Yellow

# 5. VS Code로 파일 열기
if (Get-Command code -ErrorAction SilentlyContinue) {
    code $promptFile
    Write-Host "✅ VS Code에서 파일을 열었습니다. 내용을 채워주세요!" -ForegroundColor Green
} else {
    Write-Host "⚠️  VS Code가 설치되어 있지 않습니다. 수동으로 파일을 열어주세요." -ForegroundColor Yellow
    Start-Process explorer.exe -ArgumentList "/select,`"$promptFile`""
}
```

**사용법**: 위 스크립트를 복사하여 PowerShell에 붙여넣고 Enter를 누르세요.

---

### 주간보고서 섹션 생성 (원 클릭)

```powershell
# ========================================
# 주간보고서 섹션 생성 통합 스크립트
# ========================================

# 1. 현재 주차 자동 계산
$startDate = Get-Date "2024-12-22"
$currentDate = Get-Date
$daysDiff = ($currentDate - $startDate).Days
$weekNumber = [Math]::Ceiling($daysDiff / 7)

# 2. 주차 시작일/종료일 자동 계산
$weekStartDate = $currentDate.AddDays(-($currentDate.DayOfWeek.value__ - 1))  # 이번 주 월요일
$weekEndDate = $weekStartDate.AddDays(6)  # 이번 주 일요일
$startDateFormatted = $weekStartDate.ToString("yy.MM.dd")
$endDateFormatted = $weekEndDate.ToString("MM.dd")

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📅 Week $weekNumber ($startDateFormatted - $endDateFormatted)" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# 3. 주간보고서 섹션 템플릿 생성
$weekSection = @"

### Week $weekNumber ($startDateFormatted - $endDateFormatted)

**작업 내역** (필수)

**FE**

- [이번 주 프론트엔드 작업 내용을 작성하세요]

**BE**

- [이번 주 백엔드 작업 내용을 작성하세요]

**AI 활용** (필수)

**FE**

- [AI를 어떻게 활용했는지 구체적으로 작성하세요]

**BE**

- [AI를 어떻게 활용했는지 구체적으로 작성하세요]

**완료 기능**

**FE**

- [완료된 기능 목록]

**BE**

- [완료된 기능 목록]

**커밋 로그**

**FE**

- [주요 커밋 메시지]

**BE**

- [주요 커밋 메시지]

**링크**

**FE**

- [관련 PR 제목](PR 링크)

**BE**

- [관련 PR 제목](PR 링크)

**테스트 결과**

**FE**

- [테스트 결과 또는 스크린샷]

**BE**

- [테스트 결과 또는 API 응답 예시]

**다음 주 계획** (필수)

**FE**

- [다음 주 계획]

**BE**

- [다음 주 계획]
"@

# 4. 클립보드 복사 및 출력
$weekSection | Set-Clipboard
Write-Host "`n✅ 주간보고서 섹션이 클립보드에 복사되었습니다!" -ForegroundColor Green
Write-Host "📄 readme.md의 '주간 진행 상황' 섹션에 붙여넣으세요.`n" -ForegroundColor Yellow
Write-Host $weekSection -ForegroundColor Gray
```

---

## 💡 사용 팁

### 1. 프롬프트 저장 기준

✅ **저장해야 하는 경우**:
- 코드 변경이 실제로 수락되어 PR이 생성된 경우
- 버그 수정, 리팩토링, 성능 개선 등 **구체적인 문제를 해결**한 경우
- 중요한 **기술적 의사결정**에 도움을 준 경우 (예: 아키텍처 설계, 라이브러리 선택)

❌ **저장하지 않아도 되는 경우**:
- 단순 질문 및 답변 (예: "이 에러가 왜 발생하나요?")
- 코드를 변경하지 않은 경우
- 사소한 타이포 수정

### 2. 파일 명명 규칙

- ✅ **좋은 예시**: `SEO_최적화_메타데이터.md`, `canonical_url_수정.md`, `test_environment_setup.md`
- ❌ **나쁜 예시**: `20240214.md`, `프롬프트1.md`, `fix.md`

### 3. 템플릿 작성 요령

각 섹션을 작성할 때:

| 섹션 | 작성 요령 | 예시 |
|------|----------|------|
| **배경 및 목적** | 문제 상황을 간단히 설명 | "SEO 점수가 낮아 canonical URL을 수정해야 했습니다." |
| **프롬프트** | 실제로 입력한 내용을 **그대로** 복사 | (원문 그대로) |
| **AI 응답 요약** | 핵심 제안사항만 3-5개 bullet point로 | "layout.tsx 수정", "robots.ts 수정" |
| **결과 및 적용** | 실제 적용 결과 + 배운 점 | "PR #42 생성, 빌드 성공. Next.js의 메타데이터 시스템을 이해함" |

### 4. 보안 주의사항

⚠️ **민감 정보는 반드시 마스킹 처리**:
- API Key: `OPENAI_API_KEY=sk-***` (뒤 3자리만 표시)
- 비밀번호: `password: ***`
- URL: `https://example.com` (실제 도메인 대신 예시 사용)

### 5. 업데이트 주기

| 작업 | 권장 주기 | 이유 |
|------|----------|------|
| **프롬프트 정리** | 작업 직후 즉시 | 기억이 생생할 때 작성해야 정확함 |
| **주간보고서** | 주말 또는 주차 종료 시점 | 일주일 단위로 정리하면 전체 흐름 파악 용이 |

---

## 🔧 트러블슈팅

### Q1. "PowerShell 스크립트 실행이 차단됩니다"

**증상**: `이 시스템에서 스크립트를 실행할 수 없으므로...` 오류 발생

**해결**:
```powershell
# PowerShell을 관리자 권한으로 열고:
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Q2. "VS Code가 열리지 않습니다"

**증상**: `code` 명령을 찾을 수 없다는 오류

**해결**:
1. VS Code 설치 확인
2. VS Code에서 `Ctrl+Shift+P` → "Shell Command: Install 'code' command in PATH" 실행
3. PowerShell 재시작

**대안**: 스크립트에서 `code $promptFile` 줄을 제거하고 수동으로 파일 열기

### Q3. "주차 계산이 이상합니다"

**증상**: 예상과 다른 주차 번호가 출력됨

**원인**: 프로젝트 시작일이 잘못 설정되었을 수 있음

**해결**: 스크립트의 `$startDate = Get-Date "2024-12-22"` 부분을 실제 프로젝트 시작일로 수정

### Q4. "클립보드 복사가 작동하지 않습니다"

**증상**: `Set-Clipboard` 명령이 실패

**해결**:
```powershell
# Windows 10 이상에서는 기본 지원. 실패 시 아래 명령 실행:
Install-Module PSClipboard -Force
```

### Q5. "한글이 깨져서 보입니다"

**증상**: 생성된 파일에서 한글이 깨짐

**해결**: 스크립트의 `-Encoding UTF8` 부분을 `-Encoding UTF8BOM`으로 변경

---

## 📚 참고 자료

- **프롬프트 저장 컨벤션**: `prompts/README.md`
- **주간보고서 참고**: `readme.md` 파일의 기존 Week 섹션 참조
- **PowerShell 기본 문법**: [Microsoft PowerShell 문서](https://learn.microsoft.com/ko-kr/powershell/)

---

## 📝 워크플로우 체크리스트

프롬프트 정리 시 아래 체크리스트를 확인하세요:

- [ ] 코드 변경이 실제로 수락되었나요?
- [ ] 프롬프트 제목이 명확하고 `snake_case`를 따르나요?
- [ ] 배경 및 목적을 간단히 작성했나요?
- [ ] 실제 사용한 프롬프트를 복사했나요?
- [ ] AI 응답의 핵심 내용을 요약했나요?
- [ ] 실제 적용 결과와 배운 점을 기록했나요?
- [ ] 민감 정보를 마스킹 처리했나요?

---

**🎉 이제 프롬프트 정리와 주간보고서 작성을 자동화할 수 있습니다!**

새로운 세션에서 이 워크플로우를 보더라도, "빠른 시작" 섹션의 통합 스크립트를 복사하여 실행하면 바로 사용할 수 있습니다.
