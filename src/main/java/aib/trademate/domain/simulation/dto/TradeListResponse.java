package aib.trademate.domain.simulation.dto;

import java.util.List;

/**
 * 거래 데이터 목록 응답 DTO
 */
public record TradeListResponse(
        List<TradeResponse> trades,
        long totalElements
) {
    public static TradeListResponse of(List<TradeResponse> trades) {
        return new TradeListResponse(trades, trades.size());
    }
}
