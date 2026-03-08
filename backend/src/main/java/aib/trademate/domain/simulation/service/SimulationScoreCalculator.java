package aib.trademate.domain.simulation.service;

import aib.trademate.domain.simulation.dto.ReportSummary;
import aib.trademate.domain.simulation.dto.SimulationReportResponse;
import aib.trademate.domain.simulation.dto.TradeScoreDetail;
import aib.trademate.domain.simulation.entity.Simulation;
import aib.trademate.domain.simulation.entity.SimulationTrade;
import aib.trademate.domain.simulation.entity.TradeType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

/**
 * 시뮬레이션 점수 계산기
 * 
 * 원칙 준수 채점 알고리즘 및 이동평균 기반 평단가 관리 로직을 담당합니다.
 * 모든 금융 연산은 BigDecimal을 사용하여 부동소수점 오차를 방지합니다.
 */
@Slf4j
@Component
public class SimulationScoreCalculator {

    private static final int SCALE = 8; // 소수점 8자리 유지
    private static final RoundingMode ROUNDING_MODE = RoundingMode.HALF_UP;
    private static final BigDecimal HUNDRED = new BigDecimal("100");
    private static final BigDecimal ZERO = BigDecimal.ZERO;
    private static final BigDecimal ONE = BigDecimal.ONE;
    private static final BigDecimal TWO = new BigDecimal("2");
    private static final BigDecimal HALF = new BigDecimal("0.5");

    /**
     * 시뮬레이션 결과 보고서 생성
     */
    public SimulationReportResponse calculateReport(Simulation simulation, List<SimulationTrade> trades) {
        if (trades.isEmpty()) {
            return createEmptyReport(simulation);
        }

        // 계산용 상태 변수
        BigDecimal avgPrice = ZERO;           // 현재 평단가
        BigDecimal lastSellAvgPrice = ZERO;   // 마지막 매도 시점의 평단가
        int currentBalance = 0;               // 현재 보유 수량
        BigDecimal totalInvestment = ZERO;    // 총 투자금액
        BigDecimal totalRealizedProfit = ZERO;// 실현 손익 합계
        int totalSellVolume = 0;              // 총 매도 수량
        int sellSequence = 0;                 // 매도 순번

        List<TradeScoreDetail> tradeDetails = new ArrayList<>();
        BigDecimal weightedScoreSum = ZERO;   // 가중 점수 합계

        for (SimulationTrade trade : trades) {
            if (trade.getTradeType() == TradeType.BUY) {
                // 매수: 평단가 갱신 (이동평균법)
                BigDecimal buyPrice = new BigDecimal(trade.getPrice());
                int buyVolume = trade.getVolume();

                BigDecimal oldTotal = avgPrice.multiply(new BigDecimal(currentBalance));
                BigDecimal newPurchase = buyPrice.multiply(new BigDecimal(buyVolume));
                totalInvestment = totalInvestment.add(newPurchase);

                currentBalance += buyVolume;
                if (currentBalance > 0) {
                    avgPrice = oldTotal.add(newPurchase)
                            .divide(new BigDecimal(currentBalance), SCALE, ROUNDING_MODE);
                }

                log.debug("BUY: price={}, volume={}, newAvgPrice={}, balance={}",
                        buyPrice, buyVolume, avgPrice, currentBalance);

            } else {
                // 매도: 점수 계산
                sellSequence++;
                BigDecimal sellPrice = new BigDecimal(trade.getPrice());
                int sellVolume = trade.getVolume();
                BigDecimal target = new BigDecimal(trade.getUpperLimit());  // 상한 = 목표가 (T)
                BigDecimal stopLoss = new BigDecimal(trade.getLowerLimit()); // 하한 = 손절가 (S)

                // 마지막 매도 시점의 평단가 저장 (전량 매도 전에 저장)
                lastSellAvgPrice = avgPrice;

                // 개별 수익 계산
                BigDecimal profit = sellPrice.subtract(avgPrice).multiply(new BigDecimal(sellVolume));
                totalRealizedProfit = totalRealizedProfit.add(profit);

                // 개별 수익률 (ROI)
                BigDecimal roi = ZERO;
                if (avgPrice.compareTo(ZERO) > 0) {
                    roi = sellPrice.subtract(avgPrice)
                            .divide(avgPrice, SCALE, ROUNDING_MODE)
                            .multiply(HUNDRED);
                }

                // 점수 계산
                ScoreResult scores = calculateTradeScore(sellPrice, avgPrice, target, stopLoss);

                TradeScoreDetail detail = TradeScoreDetail.builder()
                        .sequence(sellSequence)
                        .tradeDate(trade.getTradeDate())
                        .sellPrice(trade.getPrice())
                        .avgPrice(avgPrice.setScale(2, ROUNDING_MODE))
                        .targetPrice(trade.getUpperLimit())
                        .stopLoss(trade.getLowerLimit())
                        .volume(sellVolume)
                        .profit(profit.setScale(0, ROUNDING_MODE))
                        .roi(roi.setScale(2, ROUNDING_MODE))
                        .resultScore(scores.resultScore().setScale(2, ROUNDING_MODE))
                        .complianceScore(scores.complianceScore().setScale(2, ROUNDING_MODE))
                        .tradeScore(scores.tradeScore().setScale(2, ROUNDING_MODE))
                        .build();

                tradeDetails.add(detail);

                // 가중 점수 합계 (수량 비중)
                weightedScoreSum = weightedScoreSum.add(
                        scores.tradeScore().multiply(new BigDecimal(sellVolume)));
                totalSellVolume += sellVolume;

                // 보유 수량 감소
                currentBalance -= sellVolume;
                if (currentBalance <= 0) {
                    avgPrice = ZERO; // 전량 매도 시 평단가 초기화
                    currentBalance = 0;
                }

                log.debug("SELL: price={}, volume={}, profit={}, score={}",
                        sellPrice, sellVolume, profit, scores.tradeScore());
            }
        }

        // 최종 종합 점수 계산 (가중 평균)
        BigDecimal totalScore = ZERO;
        if (totalSellVolume > 0) {
            totalScore = weightedScoreSum.divide(new BigDecimal(totalSellVolume), SCALE, ROUNDING_MODE);
        }

        // 세션 누적 수익률
        BigDecimal totalRoi = ZERO;
        if (totalInvestment.compareTo(ZERO) > 0) {
            totalRoi = totalRealizedProfit
                    .divide(totalInvestment, SCALE, ROUNDING_MODE)
                    .multiply(HUNDRED);
        }

        ReportSummary summary = ReportSummary.builder()
                .simulationId(simulation.getId())
                .stockCode(simulation.getStockCode())
                .startDate(simulation.getStartDate())
                .endDate(simulation.getEndDate())
                .finalAvgPrice(lastSellAvgPrice.setScale(2, ROUNDING_MODE))
                .totalInvestment(totalInvestment.setScale(0, ROUNDING_MODE))
                .totalRealizedProfit(totalRealizedProfit.setScale(0, ROUNDING_MODE))
                .totalRoi(totalRoi.setScale(2, ROUNDING_MODE))
                .totalScore(totalScore.setScale(2, ROUNDING_MODE))
                .build();

        return SimulationReportResponse.of(summary, tradeDetails, totalSellVolume);
    }

    /**
     * 개별 매도 건 점수 계산
     * 
     * s_i = max(0, (R + C) / 2 * 100)
     */
    private ScoreResult calculateTradeScore(BigDecimal sellPrice, BigDecimal avgPrice,
                                            BigDecimal target, BigDecimal stopLoss) {
        BigDecimal resultScore;
        BigDecimal complianceScore;

        // 익절 (P_sell >= P_avg)
        if (sellPrice.compareTo(avgPrice) >= 0) {
            // 결과 점수: 1.0 (고정)
            resultScore = HUNDRED;

            // 과정 점수 계산
            complianceScore = calculateProfitComplianceScore(sellPrice, avgPrice, target);

        } else {
            // 손절 (P_sell < P_avg)
            // 결과 점수: P_sell / P_avg * 100
            if (avgPrice.compareTo(ZERO) > 0) {
                resultScore = sellPrice.divide(avgPrice, SCALE, ROUNDING_MODE).multiply(HUNDRED);
            } else {
                resultScore = HUNDRED;
            }

            // 과정 점수 계산
            complianceScore = calculateLossComplianceScore(sellPrice, avgPrice, stopLoss);
        }

        // 건별 점수: (R + C) / 2
        BigDecimal tradeScore = resultScore.add(complianceScore)
                .divide(TWO, SCALE, ROUNDING_MODE);

        return new ScoreResult(resultScore, complianceScore, tradeScore);
    }

    /**
     * 익절 시 과정 점수 (C) 계산
     */
    private BigDecimal calculateProfitComplianceScore(BigDecimal sellPrice, BigDecimal avgPrice,
                                                       BigDecimal target) {
        BigDecimal denominator = target.subtract(avgPrice).abs();

        // Divide by zero 방지
        if (denominator.compareTo(ZERO) == 0) {
            return HUNDRED;
        }

        BigDecimal compliance;

        if (sellPrice.compareTo(target) <= 0) {
            // 목표가 미달 또는 도달: 1.0 - |T - P_sell| / |T - P_avg|
            BigDecimal numerator = target.subtract(sellPrice).abs();
            compliance = ONE.subtract(numerator.divide(denominator, SCALE, ROUNDING_MODE));
        } else {
            // 목표가 초과: 1.0 - 0.5 * (P_sell - T) / |T - P_avg|
            BigDecimal excess = sellPrice.subtract(target);
            BigDecimal penalty = HALF.multiply(excess).divide(denominator, SCALE, ROUNDING_MODE);
            compliance = ONE.subtract(penalty);
        }

        // max(0, compliance) * 100
        return compliance.max(ZERO).multiply(HUNDRED);
    }

    /**
     * 손절 시 과정 점수 (C) 계산
     */
    private BigDecimal calculateLossComplianceScore(BigDecimal sellPrice, BigDecimal avgPrice,
                                                     BigDecimal stopLoss) {
        // 손절가 위에서 대응 (P_sell >= S): 1.0
        if (sellPrice.compareTo(stopLoss) >= 0) {
            return HUNDRED;
        }

        // 손절가 아래에서 대응 (P_sell < S)
        BigDecimal denominator = stopLoss.subtract(avgPrice).abs();

        // Divide by zero 방지
        if (denominator.compareTo(ZERO) == 0) {
            return HUNDRED;
        }

        // 1.0 - (S - P_sell) / |S - P_avg|
        BigDecimal numerator = stopLoss.subtract(sellPrice);
        BigDecimal compliance = ONE.subtract(numerator.divide(denominator, SCALE, ROUNDING_MODE));

        // max(0, compliance) * 100
        return compliance.max(ZERO).multiply(HUNDRED);
    }

    /**
     * 빈 보고서 생성 (거래 데이터 없음)
     */
    private SimulationReportResponse createEmptyReport(Simulation simulation) {
        ReportSummary summary = ReportSummary.builder()
                .simulationId(simulation.getId())
                .stockCode(simulation.getStockCode())
                .startDate(simulation.getStartDate())
                .endDate(simulation.getEndDate())
                .finalAvgPrice(ZERO)
                .totalInvestment(ZERO)
                .totalRealizedProfit(ZERO)
                .totalRoi(ZERO)
                .totalScore(ZERO)
                .build();

        return SimulationReportResponse.of(summary, List.of(), 0);
    }

    /**
     * 점수 계산 결과 레코드
     */
    private record ScoreResult(
            BigDecimal resultScore,
            BigDecimal complianceScore,
            BigDecimal tradeScore
    ) {}
}
