package aib.trademate.domain.simulation.service;

import aib.trademate.domain.simulation.dto.SimulationReportResponse;
import aib.trademate.domain.simulation.dto.TradeScoreDetail;
import aib.trademate.domain.simulation.entity.Simulation;
import aib.trademate.domain.simulation.entity.SimulationTrade;
import aib.trademate.domain.simulation.entity.TradeType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * SimulationScoreCalculator 단위 테스트
 * 
 * 핵심 비즈니스 로직인 점수 계산 알고리즘을 검증합니다.
 * 외부 의존성 없이 순수 로직만 테스트합니다.
 */
@DisplayName("SimulationScoreCalculator 테스트")
class SimulationScoreCalculatorTest {

    private SimulationScoreCalculator calculator;
    private Simulation simulation;

    @BeforeEach
    void setUp() {
        calculator = new SimulationScoreCalculator();
        simulation = createSimulation();
    }

    @Nested
    @DisplayName("빈 거래 목록 테스트")
    class EmptyTradesTest {

        @Test
        @DisplayName("거래가 없으면 빈 보고서를 반환한다")
        void shouldReturnEmptyReportWhenNoTrades() {
            // given
            List<SimulationTrade> trades = new ArrayList<>();

            // when
            SimulationReportResponse report = calculator.calculateReport(simulation, trades);

            // then
            assertThat(report.summary().totalScore()).isEqualByComparingTo(BigDecimal.ZERO);
            assertThat(report.summary().totalInvestment()).isEqualByComparingTo(BigDecimal.ZERO);
            assertThat(report.summary().totalRealizedProfit()).isEqualByComparingTo(BigDecimal.ZERO);
            assertThat(report.trades()).isEmpty();
            assertThat(report.totalTradeCount()).isZero();
        }
    }

    @Nested
    @DisplayName("평단가 계산 테스트")
    class AvgPriceCalculationTest {

        @Test
        @DisplayName("단일 매수 후 평단가가 매수가와 동일하다")
        void avgPriceShouldEqualBuyPriceOnSingleBuy() {
            // given
            List<SimulationTrade> trades = List.of(
                    createBuyTrade(10000, 100),  // 10,000원에 100주 매수
                    createSellTrade(11000, 100, 12000, 9000)  // 11,000원에 100주 매도
            );

            // when
            SimulationReportResponse report = calculator.calculateReport(simulation, trades);

            // then
            TradeScoreDetail detail = report.trades().get(0);
            assertThat(detail.avgPrice()).isEqualByComparingTo(new BigDecimal("10000.00"));
        }

        @Test
        @DisplayName("여러 번 매수 시 이동평균으로 평단가를 계산한다")
        void shouldCalculateMovingAverageOnMultipleBuys() {
            // given: 10,000원에 100주 + 12,000원에 100주 = 평단가 11,000원
            List<SimulationTrade> trades = List.of(
                    createBuyTrade(10000, 100),
                    createBuyTrade(12000, 100),
                    createSellTrade(11500, 200, 13000, 10000)
            );

            // when
            SimulationReportResponse report = calculator.calculateReport(simulation, trades);

            // then
            TradeScoreDetail detail = report.trades().get(0);
            assertThat(detail.avgPrice()).isEqualByComparingTo(new BigDecimal("11000.00"));
        }
    }

    @Nested
    @DisplayName("익절 시나리오 테스트")
    class ProfitScenarioTest {

        @Test
        @DisplayName("목표가 도달 시 만점(100점)을 받는다")
        void shouldGetPerfectScoreWhenTargetReached() {
            // given: 평단가 10,000원, 목표가 12,000원, 매도가 12,000원 (목표가 도달)
            List<SimulationTrade> trades = List.of(
                    createBuyTrade(10000, 100),
                    createSellTrade(12000, 100, 12000, 9000)
            );

            // when
            SimulationReportResponse report = calculator.calculateReport(simulation, trades);

            // then
            TradeScoreDetail detail = report.trades().get(0);
            assertThat(detail.resultScore()).isEqualByComparingTo(new BigDecimal("100.00"));  // 익절 = 100점
            assertThat(detail.complianceScore()).isEqualByComparingTo(new BigDecimal("100.00"));  // 목표가 도달 = 100점
            assertThat(detail.tradeScore()).isEqualByComparingTo(new BigDecimal("100.00"));  // (100+100)/2 = 100점
        }

        @Test
        @DisplayName("목표가 미달 시 과정 점수가 감점된다")
        void shouldPenalizeComplianceWhenBelowTarget() {
            // given: 평단가 10,000원, 목표가 12,000원, 매도가 11,000원 (목표가 미달)
            // Compliance = (1 - |12000-11000| / |12000-10000|) * 100 = (1 - 0.5) * 100 = 50
            List<SimulationTrade> trades = List.of(
                    createBuyTrade(10000, 100),
                    createSellTrade(11000, 100, 12000, 9000)
            );

            // when
            SimulationReportResponse report = calculator.calculateReport(simulation, trades);

            // then
            TradeScoreDetail detail = report.trades().get(0);
            assertThat(detail.resultScore()).isEqualByComparingTo(new BigDecimal("100.00"));  // 익절 = 100점
            assertThat(detail.complianceScore()).isEqualByComparingTo(new BigDecimal("50.00"));  // 목표가 절반 = 50점
            assertThat(detail.tradeScore()).isEqualByComparingTo(new BigDecimal("75.00"));  // (100+50)/2 = 75점
        }

        @Test
        @DisplayName("목표가 초과 시 소폭 감점된다")
        void shouldSlightlyPenalizeWhenExceedingTarget() {
            // given: 평단가 10,000원, 목표가 12,000원, 매도가 14,000원 (목표가 초과)
            // Compliance = (1 - 0.5 * (14000-12000) / |12000-10000|) * 100 = (1 - 0.5) * 100 = 50
            List<SimulationTrade> trades = List.of(
                    createBuyTrade(10000, 100),
                    createSellTrade(14000, 100, 12000, 9000)
            );

            // when
            SimulationReportResponse report = calculator.calculateReport(simulation, trades);

            // then
            TradeScoreDetail detail = report.trades().get(0);
            assertThat(detail.resultScore()).isEqualByComparingTo(new BigDecimal("100.00"));
            assertThat(detail.complianceScore()).isEqualByComparingTo(new BigDecimal("50.00"));
        }

        @Test
        @DisplayName("수익 실현 시 양수 ROI를 계산한다")
        void shouldCalculatePositiveRoi() {
            // given: 평단가 10,000원, 매도가 11,000원 → ROI = 10%
            List<SimulationTrade> trades = List.of(
                    createBuyTrade(10000, 100),
                    createSellTrade(11000, 100, 12000, 9000)
            );

            // when
            SimulationReportResponse report = calculator.calculateReport(simulation, trades);

            // then
            TradeScoreDetail detail = report.trades().get(0);
            assertThat(detail.roi()).isEqualByComparingTo(new BigDecimal("10.00"));
            assertThat(detail.profit()).isEqualByComparingTo(new BigDecimal("100000"));  // 1,000원 × 100주
        }
    }

    @Nested
    @DisplayName("손절 시나리오 테스트")
    class LossScenarioTest {

        @Test
        @DisplayName("손절가 이상에서 매도 시 과정 점수 만점")
        void shouldGetFullComplianceWhenSellAboveStopLoss() {
            // given: 평단가 10,000원, 손절가 9,000원, 매도가 9,500원 (손절가 이상)
            List<SimulationTrade> trades = List.of(
                    createBuyTrade(10000, 100),
                    createSellTrade(9500, 100, 12000, 9000)
            );

            // when
            SimulationReportResponse report = calculator.calculateReport(simulation, trades);

            // then
            TradeScoreDetail detail = report.trades().get(0);
            // Result = 9500 / 10000 * 100 = 95
            assertThat(detail.resultScore()).isEqualByComparingTo(new BigDecimal("95.00"));
            // Compliance = 100 (손절가 이상에서 대응)
            assertThat(detail.complianceScore()).isEqualByComparingTo(new BigDecimal("100.00"));
            // TradeScore = (95 + 100) / 2 = 97.5
            assertThat(detail.tradeScore()).isEqualByComparingTo(new BigDecimal("97.50"));
        }

        @Test
        @DisplayName("손절가 미달 시 과정 점수가 감점된다")
        void shouldPenalizeWhenBelowStopLoss() {
            // given: 평단가 10,000원, 손절가 9,000원, 매도가 8,000원 (손절가 미달)
            // Compliance = (1 - (9000-8000) / |9000-10000|) * 100 = (1 - 1) * 100 = 0
            List<SimulationTrade> trades = List.of(
                    createBuyTrade(10000, 100),
                    createSellTrade(8000, 100, 12000, 9000)
            );

            // when
            SimulationReportResponse report = calculator.calculateReport(simulation, trades);

            // then
            TradeScoreDetail detail = report.trades().get(0);
            // Result = 8000 / 10000 * 100 = 80
            assertThat(detail.resultScore()).isEqualByComparingTo(new BigDecimal("80.00"));
            // Compliance = 0 (손절가 완전히 이탈)
            assertThat(detail.complianceScore()).isEqualByComparingTo(new BigDecimal("0.00"));
            // TradeScore = (80 + 0) / 2 = 40
            assertThat(detail.tradeScore()).isEqualByComparingTo(new BigDecimal("40.00"));
        }

        @Test
        @DisplayName("손실 실현 시 음수 ROI를 계산한다")
        void shouldCalculateNegativeRoi() {
            // given: 평단가 10,000원, 매도가 9,000원 → ROI = -10%
            List<SimulationTrade> trades = List.of(
                    createBuyTrade(10000, 100),
                    createSellTrade(9000, 100, 12000, 8000)
            );

            // when
            SimulationReportResponse report = calculator.calculateReport(simulation, trades);

            // then
            TradeScoreDetail detail = report.trades().get(0);
            assertThat(detail.roi()).isEqualByComparingTo(new BigDecimal("-10.00"));
            assertThat(detail.profit()).isEqualByComparingTo(new BigDecimal("-100000"));
        }
    }

    @Nested
    @DisplayName("가중 평균 점수 테스트")
    class WeightedAverageTest {

        @Test
        @DisplayName("거래량에 따라 가중 평균 점수를 계산한다")
        void shouldCalculateWeightedAverageByVolume() {
            // given: 매도 1: 100주에 100점, 매도 2: 200주에 50점
            // 가중평균 = (100*100 + 50*200) / (100+200) = 20000/300 = 66.67
            List<SimulationTrade> trades = List.of(
                    createBuyTrade(10000, 300),
                    createSellTrade(12000, 100, 12000, 9000),  // 목표가 도달 = 100점
                    createSellTrade(10500, 200, 12000, 9000)   // 목표가 미달 (25% 달성)
            );

            // when
            SimulationReportResponse report = calculator.calculateReport(simulation, trades);

            // then
            assertThat(report.trades()).hasSize(2);
            // 가중 평균 계산 검증
            BigDecimal totalScore = report.summary().totalScore();
            assertThat(totalScore.doubleValue()).isGreaterThan(50.0);
            assertThat(totalScore.doubleValue()).isLessThan(100.0);
        }
    }

    @Nested
    @DisplayName("전량 매도 후 재매수 테스트")
    class FullSellAndRebuyTest {

        @Test
        @DisplayName("전량 매도 후 재매수 시 평단가가 새로 계산된다")
        void shouldResetAvgPriceAfterFullSell() {
            // given: 첫 매수 10,000원 → 전량 매도 → 두 번째 매수 15,000원
            List<SimulationTrade> trades = List.of(
                    createBuyTrade(10000, 100),
                    createSellTrade(11000, 100, 12000, 9000),  // 전량 매도
                    createBuyTrade(15000, 100),               // 재매수
                    createSellTrade(16000, 100, 17000, 14000) // 재매도
            );

            // when
            SimulationReportResponse report = calculator.calculateReport(simulation, trades);

            // then
            assertThat(report.trades()).hasSize(2);
            TradeScoreDetail secondSell = report.trades().get(1);
            // 두 번째 매도의 평단가는 15,000원이어야 함
            assertThat(secondSell.avgPrice()).isEqualByComparingTo(new BigDecimal("15000.00"));
        }

        @Test
        @DisplayName("전량 매도 후 finalAvgPrice는 마지막 매도 시점의 평단가를 유지한다")
        void shouldKeepLastSellAvgPriceAsFinalAvgPrice() {
            // given
            List<SimulationTrade> trades = List.of(
                    createBuyTrade(10000, 100),
                    createSellTrade(11000, 100, 12000, 9000)  // 전량 매도
            );

            // when
            SimulationReportResponse report = calculator.calculateReport(simulation, trades);

            // then: finalAvgPrice는 0이 아닌 10,000원이어야 함
            assertThat(report.summary().finalAvgPrice())
                    .isEqualByComparingTo(new BigDecimal("10000.00"));
        }
    }

    @Nested
    @DisplayName("점수 범위 테스트")
    class ScoreRangeTest {

        @Test
        @DisplayName("목표가 완벽 달성 시 90점 이상")
        void shouldScoreAbove90WhenPerfectTrade() {
            // given: 목표가 완벽 달성 = 100점
            List<SimulationTrade> trades = List.of(
                    createBuyTrade(10000, 100),
                    createSellTrade(12000, 100, 12000, 9000)
            );

            // when
            SimulationReportResponse report = calculator.calculateReport(simulation, trades);

            // then
            assertThat(report.summary().totalScore().doubleValue()).isGreaterThanOrEqualTo(90.0);
        }

        @Test
        @DisplayName("손절가 크게 이탈 시 60점 미만")
        void shouldScoreBelow60WhenBadTrade() {
            // given: 손절가 크게 이탈 = 낮은 점수
            List<SimulationTrade> trades = List.of(
                    createBuyTrade(10000, 100),
                    createSellTrade(7000, 100, 12000, 9000)  // 결과 70점, 과정 0점 → 35점
            );

            // when
            SimulationReportResponse report = calculator.calculateReport(simulation, trades);

            // then
            assertThat(report.summary().totalScore().doubleValue()).isLessThan(60.0);
        }
    }

    @Nested
    @DisplayName("총 투자금액 및 수익률 테스트")
    class InvestmentAndRoiTest {

        @Test
        @DisplayName("총 투자금액과 실현 손익을 정확히 계산한다")
        void shouldCalculateTotalInvestmentAndProfit() {
            // given: 10,000원 × 100주 = 1,000,000원 투자 → 11,000원에 매도 = 100,000원 수익
            List<SimulationTrade> trades = List.of(
                    createBuyTrade(10000, 100),
                    createSellTrade(11000, 100, 12000, 9000)
            );

            // when
            SimulationReportResponse report = calculator.calculateReport(simulation, trades);

            // then
            assertThat(report.summary().totalInvestment())
                    .isEqualByComparingTo(new BigDecimal("1000000"));
            assertThat(report.summary().totalRealizedProfit())
                    .isEqualByComparingTo(new BigDecimal("100000"));
            assertThat(report.summary().totalRoi())
                    .isEqualByComparingTo(new BigDecimal("10.00"));
        }
    }

    // ========== Helper Methods ==========

    private Simulation createSimulation() {
        return Simulation.builder()
                .id(1L)
                .memberId(1L)
                .stockCode("005930")
                .startDate(LocalDate.of(2025, 1, 1))
                .endDate(LocalDate.of(2025, 12, 31))
                .build();
    }

    private SimulationTrade createBuyTrade(int price, int volume) {
        return SimulationTrade.builder()
                .tradeDate(LocalDate.now())
                .balance(0)  // 테스트에서는 사용하지 않음
                .price(price)
                .upperLimit(price + 2000)  // 기본값
                .lowerLimit(price - 1000)  // 기본값
                .tradeType(TradeType.BUY)
                .volume(volume)
                .build();
    }

    private SimulationTrade createSellTrade(int price, int volume, int target, int stopLoss) {
        return SimulationTrade.builder()
                .tradeDate(LocalDate.now())
                .balance(volume)  // 매도 전 보유량
                .price(price)
                .upperLimit(target)
                .lowerLimit(stopLoss)
                .tradeType(TradeType.SELL)
                .volume(volume)
                .build();
    }
}
