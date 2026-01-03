package com.trademate.backend.candle.dto;

import java.math.BigDecimal;

public record PriceRangeDto(
        BigDecimal minLow,  // 기간 내 최저가
        BigDecimal maxHigh  // 기간 내 최고가
) {}