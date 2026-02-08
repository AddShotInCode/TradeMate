package aib.trademate.domain.simulation.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

/**
 * 시뮬레이션 결과 분석 보고서 응답 DTO
 */
@Schema(description = "시뮬레이션 분석 보고서")
public record SimulationReportResponse(
        @Schema(description = "보고서 요약")
        ReportSummary summary,

        @Schema(description = "매도 건별 점수 상세")
        List<TradeScoreDetail> trades,

        @Schema(description = "총 매도 수량", example = "50")
        int totalSellVolume,

        @Schema(description = "총 거래 횟수", example = "3")
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
