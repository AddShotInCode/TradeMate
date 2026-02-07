package aib.trademate.domain.stock.controller;

import aib.trademate.domain.stock.dto.StockPriceResponseDto;
import aib.trademate.domain.stock.service.StockService;
import aib.trademate.global.exception.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Validated
@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
@Tag(name = "주가 조회", description = "종목별 기간별 주가 데이터 조회 및 초기화 API")
public class StockController {

    private final StockService stockService;

    @Operation(summary = "주가 데이터 초기화", description = "등록된 종목들의 주가 데이터를 외부 API에서 가져와 DB에 저장합니다. (관리자용)")
    @ApiResponse(responseCode = "200", description = "초기화 시작")
    @PostMapping("/init")
    public ResponseEntity<String> initStockData() {
        stockService.initStockData();
        return ResponseEntity.ok("Initialization Started. Check the logs.");
    }

    @Operation(summary = "종목별 기간별 주가 조회", description = "특정 종목의 기간별 주가 데이터를 페이지네이션으로 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "400", description = "잘못된 요청 파라미터",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "종목 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{stockCode}")
    public ResponseEntity<StockPriceResponseDto.Response> getStockPrices(
            @Parameter(description = "종목코드 (6자리)", example = "005930") @PathVariable String stockCode,
            @Parameter(description = "시작일 (yyyyMMdd)", example = "20240101") @RequestParam String start,
            @Parameter(description = "종료일 (yyyyMMdd)", example = "20241231") @RequestParam String end,
            @Parameter(description = "페이지 크기", example = "10") @RequestParam(defaultValue = "10") @Min(value = 1, message = "Page size must be at least 1") int pageSize,
            @Parameter(description = "페이지 번호", example = "1") @RequestParam(defaultValue = "1") @Min(value = 1, message = "Page must be at least 1") int page
    ) {
        // 날짜 파싱 (yyyyMMdd -> LocalDate)
        DateTimeFormatter formatter = DateTimeFormatter.BASIC_ISO_DATE;
        LocalDate startDate = LocalDate.parse(start, formatter);
        LocalDate endDate = LocalDate.parse(end, formatter);

        StockPriceResponseDto.Response response = stockService.getStockPrices(
                stockCode, startDate, endDate, page, pageSize
        );

        return ResponseEntity.ok(response);
    }
}