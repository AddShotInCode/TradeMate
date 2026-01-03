package com.trademate.backend.simulation.dto;

import com.trademate.backend.simulation.domain.TrainingSession;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TrainingStartRequestDto(
        @NotNull Long userId,
        @NotNull String stockCode,
        @NotNull LocalDateTime startDate,
        @NotNull LocalDateTime endDate,
        @NotNull @Min(100000) BigDecimal initialBalance, // 최소 10만원 시작
        String rulesConfig
) {
    public TrainingSession toEntity() {
        return TrainingSession.builder()
                .userId(userId)
                .stockCode(stockCode)
                .startDate(startDate)
                .endDate(endDate)
                .initialBalance(initialBalance)
                .rulesConfig(rulesConfig)
                .build();
    }
}