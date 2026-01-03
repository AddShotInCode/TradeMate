package com.trademate.backend.candle.dto;

import com.trademate.backend.candle.domain.Candle;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CandleResponseDto(
        String stockCode,
        LocalDateTime dateTime,
        BigDecimal open,
        BigDecimal high,
        BigDecimal low,
        BigDecimal close,
        Long volume
) {
    public static CandleResponseDto from(Candle candle) {
        return new CandleResponseDto(
                candle.getStockCode(),
                candle.getDateTime(),
                candle.getOpen(),
                candle.getHigh(),
                candle.getLow(),
                candle.getClose(),
                candle.getVolume()
        );
    }
}