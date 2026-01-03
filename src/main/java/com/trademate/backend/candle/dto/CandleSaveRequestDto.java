package com.trademate.backend.candle.dto;

import com.trademate.backend.candle.domain.Candle;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

// 명세 1. 네이밍 규칙 준수 (RequestDto 접미사)
public record CandleSaveRequestDto(
        @NotNull String stockCode,
        @NotNull LocalDateTime dateTime,
        @NotNull BigDecimal open,
        @NotNull BigDecimal high,
        @NotNull BigDecimal low,
        @NotNull BigDecimal close,
        @NotNull Long volume
) {
    // DTO -> Entity 변환 메서드
    public Candle toEntity() {
        return Candle.builder()
                .stockCode(stockCode)
                .dateTime(dateTime)
                .open(open)
                .high(high)
                .low(low)
                .close(close)
                .volume(volume)
                .build();
    }
}