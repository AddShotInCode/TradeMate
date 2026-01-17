package aib.trademate.domain.stock.controller;

import aib.trademate.domain.stock.dto.StockPriceResponseDto;
import aib.trademate.domain.stock.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    // 수동 초기화 API (관리자용)
    // POST http://localhost:8080/api/stock/init
    @PostMapping("/init")
    public ResponseEntity<String> initStockData() {
        stockService.initStockData();
        return ResponseEntity.ok("Initialization Started. Check the logs.");
    }

    // 특정 종목의 기간별 가격 데이터 조회
    // GET http://localhost:8080/api/stock/{stockCode}?start=20250112&end=20260112&pageSize=20&page=1
    @GetMapping("/{stockCode}")
    public ResponseEntity<StockPriceResponseDto.Response> getStockPrices(
            @PathVariable String stockCode,
            @RequestParam String start,
            @RequestParam String end,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "1") int page
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