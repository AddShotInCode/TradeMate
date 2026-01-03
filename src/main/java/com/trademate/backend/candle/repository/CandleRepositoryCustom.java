package com.trademate.backend.candle.repository;

import com.trademate.backend.candle.domain.Candle;
import com.trademate.backend.candle.dto.PriceRangeDto; // Import
import java.time.LocalDateTime;
import java.util.List;

public interface CandleRepositoryCustom {
    List<Candle> getCandles(String stockCode, LocalDateTime startDate, LocalDateTime endDate);
    List<Candle> findNextCandles(String stockCode, LocalDateTime startTime, int count);

    // [추가] 기간 내 최저/최고가 조회
    PriceRangeDto findMinMaxPrice(String stockCode, LocalDateTime startTime, LocalDateTime endTime);
}