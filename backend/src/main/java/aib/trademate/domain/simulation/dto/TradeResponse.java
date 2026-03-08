package aib.trademate.domain.simulation.dto;

import aib.trademate.domain.simulation.entity.SimulationTrade;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;

/**
 * 거래 데이터 응답 DTO
 */
@Schema(description = "거래 데이터")
public record TradeResponse(
        @Schema(description = "거래일", example = "2024-06-15")
        LocalDate timestamp,

        @Schema(description = "보유수", example = "100")
        Integer balance,

        @Schema(description = "가격", example = "72000")
        Integer price,

        @Schema(description = "상한가", example = "75000")
        Integer upper,

        @Schema(description = "하한가", example = "68000")
        Integer lower,

        @Schema(description = "거래종류", example = "BUY")
        String type,

        @Schema(description = "거래량", example = "10")
        Integer volume,

        @Schema(description = "코멘트", example = "분할 매수 1차")
        String comment
) {
    /**
     * Entity → DTO 변환
     */
    public static TradeResponse from(SimulationTrade trade) {
        return new TradeResponse(
                trade.getTradeDate(),
                trade.getBalance(),
                trade.getPrice(),
                trade.getUpperLimit(),
                trade.getLowerLimit(),
                trade.getTradeType().getCode(),
                trade.getVolume(),
                trade.getComment()
        );
    }
}
