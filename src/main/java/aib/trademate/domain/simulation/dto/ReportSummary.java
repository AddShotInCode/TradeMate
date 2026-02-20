package aib.trademate.domain.simulation.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 시뮬레이션 보고서 요약 DTO
 */
@Schema(description = "보고서 요약 정보")
public record ReportSummary(
        @Schema(description = "시뮬레이션 ID", example = "1")
        Long simulationId,

        @Schema(description = "종목코드", example = "005930")
        String stockCode,

        @Schema(description = "시작일", example = "2024-01-01")
        LocalDate startDate,

        @Schema(description = "종료일", example = "2024-12-31")
        LocalDate endDate,

        @Schema(description = "최종 평균단가", example = "71500.00")
        BigDecimal finalAvgPrice,

        @Schema(description = "총 투자금액", example = "7200000")
        BigDecimal totalInvestment,

        @Schema(description = "총 실현 손익", example = "350000")
        BigDecimal totalRealizedProfit,

        @Schema(description = "총 수익률 (%)", example = "4.86")
        BigDecimal totalRoi,

        @Schema(description = "총점 (100점 만점)", example = "72.50")
        BigDecimal totalScore,

        @Schema(description = "AI 애널리스트 점수 (0~100)", example = "80", nullable = true)
        Integer aiScore,

        @Schema(description = "AI 애널리스트 코멘트", example = "전반적으로 안정적인 거래 전략...", nullable = true)
        String aiComment
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
        private Integer aiScore;
        private String aiComment;

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

        public Builder aiScore(Integer aiScore) {
            this.aiScore = aiScore;
            return this;
        }

        public Builder aiComment(String aiComment) {
            this.aiComment = aiComment;
            return this;
        }

        public ReportSummary build() {
            return new ReportSummary(
                    simulationId, stockCode, startDate, endDate,
                    finalAvgPrice, totalInvestment, totalRealizedProfit, totalRoi, totalScore,
                    aiScore, aiComment
            );
        }
    }
}
