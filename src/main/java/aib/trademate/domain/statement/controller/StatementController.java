package aib.trademate.domain.statement.controller;

import aib.trademate.domain.statement.dto.StatementResponseDto;
import aib.trademate.domain.statement.service.StatementService;
import aib.trademate.global.exception.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "재무제표", description = "재무제표 뷰어 링크 조회 및 초기화 API")
public class StatementController {

    private final StatementService statementService;

    /**
     * 수동 초기화 API (관리자용)
     * POST http://localhost:8080/api/statement/init
     */
    @Operation(summary = "재무제표 데이터 초기화", description = "DART API에서 재무제표 데이터를 가져와 DB에 저장합니다. (관리자용)")
    @ApiResponse(responseCode = "200", description = "초기화 시작")
    @PostMapping("/init")
    public ResponseEntity<String> initStatementData() {
        statementService.initStatementData();
        return ResponseEntity.ok("Statement initialization started. Check the logs.");
    }

    /**
     * 재무제표 뷰어 링크 목록 조회
     */
    @Operation(summary = "재무제표 뷰어 링크 조회", description = "특정 종목의 연도/분기별 재무제표 뷰어 링크 목록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 파라미터",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "재무제표 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{stockCode}")
    public ResponseEntity<StatementResponseDto.Response> getStatementViewerLinks(
            @Parameter(description = "종목코드 (6자리)", example = "005930") @PathVariable String stockCode,
            @Parameter(description = "사업연도", example = "2024") @RequestParam @Min(value = 2015, message = "Year must be 2015 or later") Integer year,
            @Parameter(description = "분기 (1~4)", example = "4") @RequestParam @Min(value = 1, message = "Quarter must be between 1 and 4") 
                          @Max(value = 4, message = "Quarter must be between 1 and 4") Integer quarter
    ) {
        StatementResponseDto.Response response = statementService.getStatementViewerLinks(
                stockCode, year, quarter);
        
        return ResponseEntity.ok(response);
    }
}
