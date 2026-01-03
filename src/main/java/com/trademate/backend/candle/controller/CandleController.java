package com.trademate.backend.candle.controller;

import com.trademate.backend.candle.domain.Candle;
import com.trademate.backend.candle.dto.CandleSaveRequestDto;
import com.trademate.backend.candle.service.CandleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/candles")
@RequiredArgsConstructor
public class CandleController {

    private final CandleService candleService;

    // 1. 단건 저장 (기존 유지)
    @PostMapping
    public ResponseEntity<Long> saveCandle(@RequestBody @Valid CandleSaveRequestDto requestDto) {
        Long candleId = candleService.saveCandle(requestDto);
        if (candleId == null) return ResponseEntity.ok().build();
        return ResponseEntity.status(HttpStatus.CREATED).body(candleId);
    }

    // 2. 외부 데이터 수집 (기존 유지)
    @PostMapping("/fetch")
    public ResponseEntity<String> fetchCandles(
            @RequestParam String stockCode,
            @RequestParam String startDate,
            @RequestParam String endDate
    ) {
        try {
            int count = candleService.fetchAndSaveDailyCandles(stockCode, startDate, endDate);
            return ResponseEntity.ok("성공적으로 " + count + "건의 데이터를 저장했습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("데이터 수집 실패: " + e.getMessage());
        }
    }

    // 3. [신규] 조회 API (QueryDSL 연동)
    // GET /api/candles?stockCode=005930&startDate=2024-01-01&endDate=2024-01-31
    @GetMapping
    public ResponseEntity<List<Candle>> getCandles(
            @RequestParam String stockCode,
            @RequestParam String startDate, // YYYY-MM-DD
            @RequestParam String endDate    // YYYY-MM-DD
    ) {
        // 문자열 날짜를 LocalDateTime으로 변환
        LocalDateTime start = LocalDate.parse(startDate).atStartOfDay(); // 00:00:00
        LocalDateTime end = LocalDate.parse(endDate).atTime(23, 59, 59); // 23:59:59

        List<Candle> candles = candleService.getCandleData(stockCode, start, end);
        return ResponseEntity.ok(candles);
    }
}