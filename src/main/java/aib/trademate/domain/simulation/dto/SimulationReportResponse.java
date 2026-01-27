package aib.trademate.domain.simulation.dto;

import java.util.List;

/**
 * 시뮬레이션 결과 분석 보고서 응답 DTO
 */
public record SimulationReportResponse(
        ReportSummary summary,
        List<TradeScoreDetail> trades,
        int totalSellVolume,
        int totalTradeCount
) {
    public static SimulationReportResponse of(
            ReportSummary summary,
            List<TradeScoreDetail> trades,
            int totalSellVolume
    ) {
        return new SimulationReportResponse(summary, trades, totalSellVolume, trades.size());
    }
}
