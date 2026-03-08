package aib.trademate.domain.simulation.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 매도 건별 점수 상세 DTO
 */
@Schema(description = "매도 건별 점수 상세")
public record TradeScoreDetail(
        @Schema(description = "순번", example = "1")
        int sequence,

        @Schema(description = "거래일", example = "2024-06-15")
        LocalDate tradeDate,

        @Schema(description = "매도 가격", example = "74000")
        int sellPrice,

        @Schema(description = "평균 단가", example = "71500.00")
        BigDecimal avgPrice,

        @Schema(description = "목표가", example = "80000")
        int targetPrice,

        @Schema(description = "손절가", example = "65000")
        int stopLoss,

        @Schema(description = "거래량", example = "10")
        int volume,

        @Schema(description = "실현 손익", example = "25000")
        BigDecimal profit,

        @Schema(description = "수익률 (%)", example = "3.50")
        BigDecimal roi,

        @Schema(description = "성과 점수", example = "35.00")
        BigDecimal resultScore,

        @Schema(description = "규정 준수 점수", example = "40.00")
        BigDecimal complianceScore,

        @Schema(description = "거래 점수 (총점)", example = "75.00")
        BigDecimal tradeScore
) {
    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private int sequence;
        private LocalDate tradeDate;
        private int sellPrice;
        private BigDecimal avgPrice;
        private int targetPrice;
        private int stopLoss;
        private int volume;
        private BigDecimal profit;
        private BigDecimal roi;
        private BigDecimal resultScore;
        private BigDecimal complianceScore;
        private BigDecimal tradeScore;

        public Builder sequence(int sequence) {
            this.sequence = sequence;
            return this;
        }

        public Builder tradeDate(LocalDate tradeDate) {
            this.tradeDate = tradeDate;
            return this;
        }

        public Builder sellPrice(int sellPrice) {
            this.sellPrice = sellPrice;
            return this;
        }

        public Builder avgPrice(BigDecimal avgPrice) {
            this.avgPrice = avgPrice;
            return this;
        }

        public Builder targetPrice(int targetPrice) {
            this.targetPrice = targetPrice;
            return this;
        }

        public Builder stopLoss(int stopLoss) {
            this.stopLoss = stopLoss;
            return this;
        }

        public Builder volume(int volume) {
            this.volume = volume;
            return this;
        }

        public Builder profit(BigDecimal profit) {
            this.profit = profit;
            return this;
        }

        public Builder roi(BigDecimal roi) {
            this.roi = roi;
            return this;
        }

        public Builder resultScore(BigDecimal resultScore) {
            this.resultScore = resultScore;
            return this;
        }

        public Builder complianceScore(BigDecimal complianceScore) {
            this.complianceScore = complianceScore;
            return this;
        }

        public Builder tradeScore(BigDecimal tradeScore) {
            this.tradeScore = tradeScore;
            return this;
        }

        public TradeScoreDetail build() {
            return new TradeScoreDetail(
                    sequence, tradeDate, sellPrice, avgPrice, targetPrice, stopLoss,
                    volume, profit, roi, resultScore, complianceScore, tradeScore
            );
        }
    }
}
