package com.trademate.backend.candle.service;

import com.trademate.backend.candle.domain.Candle;
import com.trademate.backend.candle.repository.CandleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CandleLowService {

    private final CandleRepository candleRepository;

    @Transactional
    public Candle save(Candle candle) {
        return candleRepository.save(candle);
    }

    public boolean exists(String stockCode, LocalDateTime dateTime) {
        return candleRepository.existsByStockCodeAndDateTime(stockCode, dateTime);
    }

    // [추가] 타임머신 조회 메서드 연결
    public List<Candle> findNextCandles(String stockCode, LocalDateTime startTime, int count) {
        return candleRepository.findNextCandles(stockCode, startTime, count);
    }

    public com.trademate.backend.candle.dto.PriceRangeDto findMinMaxPrice(String stockCode, LocalDateTime startTime, LocalDateTime endTime) {
        return candleRepository.findMinMaxPrice(stockCode, startTime, endTime);
    }
}