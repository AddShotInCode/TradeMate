package aib.trademate.domain.statement.controller;

import aib.trademate.domain.statement.dto.StatementResponseDto;
import aib.trademate.domain.statement.service.StatementService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/api/statement")
@RequiredArgsConstructor
public class StatementController {

    private final StatementService statementService;

    /**
     * 수동 초기화 API (관리자용)
     * POST http://localhost:8080/api/statement/init
     */
    @PostMapping("/init")
    public ResponseEntity<String> initStatementData() {
        statementService.initStatementData();
        return ResponseEntity.ok("Statement initialization started. Check the logs.");
    }

    /**
     * 재무제표 뷰어 링크 목록 조회
     * GET http://localhost:8080/api/statement/{stockCode}?year=2024&quarter=4
     * 
     * @param stockCode 종목코드 (6자리)
     * @param year      사업연도 (예: 2024)
     * @param quarter   분기 (1, 2, 3, 4)
     * @return 재무제표 뷰어 링크 목록 (기재정정 포함 모든 버전)
     */
    @GetMapping("/{stockCode}")
    public ResponseEntity<StatementResponseDto.Response> getStatementViewerLinks(
            @PathVariable String stockCode,
            @RequestParam @Min(value = 2015, message = "Year must be 2015 or later") Integer year,
            @RequestParam @Min(value = 1, message = "Quarter must be between 1 and 4") 
                          @Max(value = 4, message = "Quarter must be between 1 and 4") Integer quarter
    ) {
        StatementResponseDto.Response response = statementService.getStatementViewerLinks(
                stockCode, year, quarter);
        
        return ResponseEntity.ok(response);
    }
}
