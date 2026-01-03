package com.trademate.backend.order.dto;

import com.trademate.backend.order.domain.OrderType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record OrderRequestDto(
        @NotNull Long sessionId,
        @NotNull OrderType type,
        @NotNull @Min(1) BigDecimal price,
        @NotNull @Min(1) Integer quantity,

        @NotBlank(message = "매매 근거는 필수 입력값입니다.") // ★ 핵심: 빈 값 절대 금지
        String reason,

        BigDecimal targetPrice,
        BigDecimal stopLossPrice
) {}