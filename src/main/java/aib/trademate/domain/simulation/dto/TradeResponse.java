package aib.trademate.domain.simulation.dto;

import aib.trademate.domain.simulation.entity.SimulationTrade;

import java.time.LocalDate;

/**
 * 거래 데이터 응답 DTO
 */
public record TradeResponse(
        LocalDate timestamp,
        Integer balance,
        Integer price,
        Integer upper,
        Integer lower,
        String type,
        Integer volume,
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
