package aib.trademate.domain.simulation.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 매도 건별 점수 상세 DTO
 */
public record TradeScoreDetail(
        int sequence,
        LocalDate tradeDate,
        int sellPrice,
        BigDecimal avgPrice,
        int targetPrice,
        int stopLoss,
        int volume,
        BigDecimal profit,
        BigDecimal roi,
        BigDecimal resultScore,
        BigDecimal complianceScore,
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
