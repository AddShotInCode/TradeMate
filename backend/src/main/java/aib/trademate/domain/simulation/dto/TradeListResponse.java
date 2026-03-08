package aib.trademate.domain.simulation.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

/**
 * 거래 데이터 목록 응답 DTO
 */
@Schema(description = "거래 데이터 목록 응답")
public record TradeListResponse(
        @Schema(description = "거래 데이터 목록")
        List<TradeResponse> trades,

        @Schema(description = "총 건수", example = "15")
        long totalElements
) {
    public static TradeListResponse of(List<TradeResponse> trades) {
        return new TradeListResponse(trades, trades.size());
    }
}
