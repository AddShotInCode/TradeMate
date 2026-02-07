package aib.trademate.domain.simulation.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * 거래 데이터 추가 요청 DTO
 */
@Schema(description = "거래 데이터 추가 요청")
public record AddTradeRequest(
        @Schema(description = "거래일", example = "2024-06-15")
        @NotNull(message = "거래일은 필수입니다")
        LocalDate timestamp,

        @Schema(description = "보유수", example = "100")
        @NotNull(message = "보유수는 필수입니다")
        Integer balance,

        @Schema(description = "가격", example = "72000")
        @NotNull(message = "가격은 필수입니다")
        Integer price,

        @Schema(description = "상한가", example = "75000")
        @NotNull(message = "상한은 필수입니다")
        Integer upper,

        @Schema(description = "하한가", example = "68000")
        @NotNull(message = "하한은 필수입니다")
        Integer lower,

        @Schema(description = "거래종류 (BUY/SELL)", example = "BUY")
        @NotBlank(message = "거래종류는 필수입니다")
        String type,

        @Schema(description = "거래량", example = "10")
        @NotNull(message = "거래량은 필수입니다")
        Integer volume,

        @Schema(description = "코멘트 (최대 100자)", example = "분할 매수 1차")
        @Size(max = 100, message = "코멘트는 최대 100자입니다")
        String comment
) {
}
