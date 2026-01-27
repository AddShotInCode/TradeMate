package aib.trademate.domain.simulation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * 거래 데이터 추가 요청 DTO
 */
public record AddTradeRequest(
        @NotNull(message = "거래일은 필수입니다")
        LocalDate timestamp,

        @NotNull(message = "보유수는 필수입니다")
        Integer balance,

        @NotNull(message = "가격은 필수입니다")
        Integer price,

        @NotNull(message = "상한은 필수입니다")
        Integer upper,

        @NotNull(message = "하한은 필수입니다")
        Integer lower,

        @NotBlank(message = "거래종류는 필수입니다")
        String type,

        @NotNull(message = "거래량은 필수입니다")
        Integer volume,

        @Size(max = 100, message = "코멘트는 최대 100자입니다")
        String comment
) {
}
