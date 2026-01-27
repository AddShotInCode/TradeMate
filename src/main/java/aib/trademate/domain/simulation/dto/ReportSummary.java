package aib.trademate.domain.simulation.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 시뮬레이션 보고서 요약 DTO
 */
public record ReportSummary(
        Long simulationId,
        String stockCode,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal finalAvgPrice,
        BigDecimal totalInvestment,
        BigDecimal totalRealizedProfit,
        BigDecimal totalRoi,
        BigDecimal totalScore
) {
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long simulationId;
        private String stockCode;
        private LocalDate startDate;
        private LocalDate endDate;
        private BigDecimal finalAvgPrice;
        private BigDecimal totalInvestment;
        private BigDecimal totalRealizedProfit;
        private BigDecimal totalRoi;
        private BigDecimal totalScore;

        public Builder simulationId(Long simulationId) {
            this.simulationId = simulationId;
            return this;
        }

        public Builder stockCode(String stockCode) {
            this.stockCode = stockCode;
            return this;
        }

        public Builder startDate(LocalDate startDate) {
            this.startDate = startDate;
            return this;
        }

        public Builder endDate(LocalDate endDate) {
            this.endDate = endDate;
            return this;
        }

        public Builder finalAvgPrice(BigDecimal finalAvgPrice) {
            this.finalAvgPrice = finalAvgPrice;
            return this;
        }

        public Builder totalInvestment(BigDecimal totalInvestment) {
            this.totalInvestment = totalInvestment;
            return this;
        }

        public Builder totalRealizedProfit(BigDecimal totalRealizedProfit) {
            this.totalRealizedProfit = totalRealizedProfit;
            return this;
        }

        public Builder totalRoi(BigDecimal totalRoi) {
            this.totalRoi = totalRoi;
            return this;
        }

        public Builder totalScore(BigDecimal totalScore) {
            this.totalScore = totalScore;
            return this;
        }

        public ReportSummary build() {
            return new ReportSummary(
                    simulationId, stockCode, startDate, endDate,
                    finalAvgPrice, totalInvestment, totalRealizedProfit, totalRoi, totalScore
            );
        }
    }
}
