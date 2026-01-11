package aib.trademate.domain.stock.controller;

import aib.trademate.domain.stock.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    // 수동 초기화 API (관리자용)
    // POST http://localhost:8080/api/stocks/init
    @PostMapping("/init")
    public ResponseEntity<String> initStockData() {
        stockService.initStockData();
        return ResponseEntity.ok("Initialization Started. Check the logs.");
    }
}