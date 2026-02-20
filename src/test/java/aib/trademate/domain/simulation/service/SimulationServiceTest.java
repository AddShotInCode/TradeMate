package aib.trademate.domain.simulation.service;

import aib.trademate.domain.member.entity.Member;
import aib.trademate.domain.member.repository.MemberRepository;
import aib.trademate.domain.simulation.dto.*;
import aib.trademate.domain.simulation.entity.Simulation;
import aib.trademate.domain.simulation.entity.SimulationTrade;
import aib.trademate.domain.simulation.entity.TradeType;
import aib.trademate.domain.simulation.repository.SimulationReportRepository;
import aib.trademate.domain.simulation.repository.SimulationRepository;
import aib.trademate.domain.simulation.repository.SimulationTradeRepository;
import aib.trademate.global.exception.BusinessException;
import aib.trademate.global.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

/**
 * SimulationService 단위 테스트
 * 
 * 시뮬레이션 CRUD 및 거래 관리 로직을 검증합니다.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("SimulationService 테스트")
@SuppressWarnings("null")
class SimulationServiceTest {

    @Mock
    private SimulationRepository simulationRepository;

    @Mock
    private SimulationTradeRepository tradeRepository;

    @Mock
    private SimulationReportRepository reportRepository;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private SimulationScoreCalculator scoreCalculator;

    @InjectMocks
    private SimulationService simulationService;

    private Member testMember;
    private Simulation testSimulation;

    @BeforeEach
    void setUp() {
        testMember = createMember(1L, "test@test.com");
        testSimulation = createSimulation(1L, testMember.getId(), "005930", LocalDate.of(2024, 1, 1));
    }

    @Nested
    @DisplayName("시뮬레이션 생성 테스트")
    class CreateSimulationTest {

        @Test
        @DisplayName("시뮬레이션 생성이 성공한다")
        void createSimulationSuccess() {
            // given
            String email = "test@test.com";
            String stockCode = "005930";
            LocalDate startDate = LocalDate.of(2024, 1, 1);

            given(memberRepository.findByEmail(email)).willReturn(Optional.of(testMember));
            given(simulationRepository.save(any(Simulation.class))).willAnswer(invocation -> {
                Simulation saved = invocation.getArgument(0);
                ReflectionTestUtils.setField(saved, "id", 1L);
                return saved;
            });

            // when
            CreateSimulationResponse response = simulationService.createSimulation(email, stockCode, startDate);

            // then
            assertThat(response.id()).isEqualTo(1L);
            verify(simulationRepository).save(any(Simulation.class));
        }

        @Test
        @DisplayName("존재하지 않는 회원으로 시뮬레이션 생성 시 예외가 발생한다")
        void createSimulationFailsWhenMemberNotFound() {
            // given
            String email = "notfound@test.com";
            given(memberRepository.findByEmail(email)).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> 
                    simulationService.createSimulation(email, "005930", LocalDate.now()))
                    .isInstanceOf(BusinessException.class)
                    .satisfies(ex -> {
                        BusinessException be = (BusinessException) ex;
                        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND);
                    });
        }
    }

    @Nested
    @DisplayName("시뮬레이션 종료일 업데이트 테스트")
    class UpdateEndDateTest {

        @Test
        @DisplayName("종료일 업데이트가 성공한다")
        void updateEndDateSuccess() {
            // given
            String email = "test@test.com";
            LocalDate endDate = LocalDate.of(2024, 3, 1);

            given(memberRepository.findByEmail(email)).willReturn(Optional.of(testMember));
            given(simulationRepository.findById(testSimulation.getId())).willReturn(Optional.of(testSimulation));

            // when
            simulationService.updateEndDate(email, testSimulation.getId(), endDate);

            // then
            assertThat(testSimulation.getEndDate()).isEqualTo(endDate);
        }

        @Test
        @DisplayName("다른 사용자의 시뮬레이션 종료일 업데이트 시 예외가 발생한다")
        void updateEndDateFailsWhenNotOwner() {
            // given
            Member otherMember = createMember(2L, "other@test.com");
            String email = "other@test.com";

            given(memberRepository.findByEmail(email)).willReturn(Optional.of(otherMember));
            given(simulationRepository.findById(testSimulation.getId())).willReturn(Optional.of(testSimulation));

            // when & then
            assertThatThrownBy(() -> 
                    simulationService.updateEndDate(email, testSimulation.getId(), LocalDate.now()))
                    .isInstanceOf(BusinessException.class)
                    .satisfies(ex -> {
                        BusinessException be = (BusinessException) ex;
                        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.ACCESS_DENIED);
                    });
        }
    }

    @Nested
    @DisplayName("시뮬레이션 목록 조회 테스트")
    class GetMySimulationsTest {

        @Test
        @DisplayName("내 시뮬레이션 목록을 조회한다")
        void getMySimulationsSuccess() {
            // given
            String email = "test@test.com";
            List<Simulation> simulations = List.of(
                    testSimulation,
                    createSimulation(2L, testMember.getId(), "035720", LocalDate.of(2024, 2, 1))
            );

            given(memberRepository.findByEmail(email)).willReturn(Optional.of(testMember));
            given(simulationRepository.findByMemberId(testMember.getId())).willReturn(simulations);

            // when
            SimulationListResponse response = simulationService.getMySimulations(email);

            // then
            assertThat(response.simulations()).hasSize(2);
            assertThat(response.simulations().get(0).stockCode()).isEqualTo("005930");
            assertThat(response.simulations().get(1).stockCode()).isEqualTo("035720");
        }

        @Test
        @DisplayName("시뮬레이션이 없으면 빈 목록을 반환한다")
        void getMySimulationsReturnsEmptyList() {
            // given
            String email = "test@test.com";
            given(memberRepository.findByEmail(email)).willReturn(Optional.of(testMember));
            given(simulationRepository.findByMemberId(testMember.getId())).willReturn(List.of());

            // when
            SimulationListResponse response = simulationService.getMySimulations(email);

            // then
            assertThat(response.simulations()).isEmpty();
        }
    }

    @Nested
    @DisplayName("시뮬레이션 삭제 테스트")
    class DeleteSimulationTest {

        @Test
        @DisplayName("시뮬레이션 삭제가 성공한다")
        void deleteSimulationSuccess() {
            // given
            String email = "test@test.com";

            given(memberRepository.findByEmail(email)).willReturn(Optional.of(testMember));
            given(simulationRepository.findById(testSimulation.getId())).willReturn(Optional.of(testSimulation));

            // when
            simulationService.deleteSimulation(email, testSimulation.getId());

            // then
            verify(simulationRepository).delete(testSimulation);
        }

        @Test
        @DisplayName("존재하지 않는 시뮬레이션 삭제 시 예외가 발생한다")
        void deleteSimulationFailsWhenNotFound() {
            // given
            String email = "test@test.com";
            Long nonExistentId = 999L;

            given(memberRepository.findByEmail(email)).willReturn(Optional.of(testMember));
            given(simulationRepository.findById(nonExistentId)).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> 
                    simulationService.deleteSimulation(email, nonExistentId))
                    .isInstanceOf(BusinessException.class)
                    .satisfies(ex -> {
                        BusinessException be = (BusinessException) ex;
                        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.SIMULATION_NOT_FOUND);
                    });
        }
    }

    @Nested
    @DisplayName("거래 추가 테스트")
    class AddTradeTest {

        @Test
        @DisplayName("거래 추가가 성공한다")
        void addTradeSuccess() {
            // given
            String email = "test@test.com";
            AddTradeRequest request = new AddTradeRequest(
                    LocalDate.of(2024, 1, 15),
                    1000,     // balance (Integer)
                    70000,    // price (Integer)
                    75000,    // upper (Integer)
                    65000,    // lower (Integer)
                    "B",      // 매수
                    10,       // volume
                    "첫 매수"
            );

            given(memberRepository.findByEmail(email)).willReturn(Optional.of(testMember));
            given(simulationRepository.findById(testSimulation.getId())).willReturn(Optional.of(testSimulation));

            // when
            simulationService.addTrade(email, testSimulation.getId(), request);

            // then
            verify(tradeRepository).save(any(SimulationTrade.class));
        }

        @Test
        @DisplayName("잘못된 거래 타입으로 거래 추가 시 예외가 발생한다")
        void addTradeFailsWithInvalidTradeType() {
            // given
            String email = "test@test.com";
            AddTradeRequest request = new AddTradeRequest(
                    LocalDate.of(2024, 1, 15),
                    1000,
                    70000,
                    75000,
                    65000,
                    "X",  // Invalid type
                    10,
                    "잘못된 타입"
            );

            given(memberRepository.findByEmail(email)).willReturn(Optional.of(testMember));
            given(simulationRepository.findById(testSimulation.getId())).willReturn(Optional.of(testSimulation));

            // when & then
            assertThatThrownBy(() -> 
                    simulationService.addTrade(email, testSimulation.getId(), request))
                    .isInstanceOf(BusinessException.class)
                    .satisfies(ex -> {
                        BusinessException be = (BusinessException) ex;
                        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.INVALID_INPUT_VALUE);
                    });
        }
    }

    @Nested
    @DisplayName("거래 목록 조회 테스트")
    class GetTradesTest {

        @Test
        @DisplayName("거래 목록 조회가 성공한다")
        void getTradesSuccess() {
            // given
            String email = "test@test.com";
            List<SimulationTrade> trades = List.of(
                    createTrade(1L, testSimulation, TradeType.BUY, 10),
                    createTrade(2L, testSimulation, TradeType.SELL, 5)
            );

            given(memberRepository.findByEmail(email)).willReturn(Optional.of(testMember));
            given(simulationRepository.findById(testSimulation.getId())).willReturn(Optional.of(testSimulation));
            given(tradeRepository.findBySimulationIdOrderByTradeDateAsc(testSimulation.getId())).willReturn(trades);

            // when
            TradeListResponse response = simulationService.getTrades(email, testSimulation.getId());

            // then
            assertThat(response.trades()).hasSize(2);
        }
    }

    @Nested
    @DisplayName("보고서 생성 테스트")
    class GenerateReportTest {

        @Test
        @DisplayName("종료된 시뮬레이션의 보고서를 생성한다")
        void generateReportSuccess() {
            // given
            String email = "test@test.com";
            testSimulation.updateEndDate(LocalDate.of(2024, 3, 1));

            List<SimulationTrade> trades = List.of(
                    createTrade(1L, testSimulation, TradeType.BUY, 10),
                    createTrade(2L, testSimulation, TradeType.SELL, 10)
            );

            SimulationReportResponse expectedReport = new SimulationReportResponse(
                    ReportSummary.builder()
                            .simulationId(testSimulation.getId())
                            .stockCode("005930")
                            .startDate(LocalDate.of(2024, 1, 1))
                            .endDate(LocalDate.of(2024, 3, 1))
                            .finalAvgPrice(BigDecimal.valueOf(70000))
                            .totalInvestment(BigDecimal.valueOf(700000))
                            .totalRealizedProfit(BigDecimal.valueOf(50000))
                            .totalRoi(BigDecimal.valueOf(7.14))
                            .totalScore(BigDecimal.valueOf(85))
                            .build(),
                    List.of(),
                    10,
                    2
            );

            given(memberRepository.findByEmail(email)).willReturn(Optional.of(testMember));
            given(simulationRepository.findById(testSimulation.getId())).willReturn(Optional.of(testSimulation));
            given(reportRepository.existsBySimulationId(testSimulation.getId())).willReturn(false);
            given(tradeRepository.findBySimulationIdOrderByTradeDateAsc(testSimulation.getId())).willReturn(trades);
            given(scoreCalculator.calculateReport(testSimulation, trades)).willReturn(expectedReport);

            // when
            simulationService.generateReport(email, testSimulation.getId());

            // then
            verify(scoreCalculator).calculateReport(testSimulation, trades);
            verify(reportRepository).save(any());
        }

        @Test
        @DisplayName("종료되지 않은 시뮬레이션의 보고서 생성 시 예외가 발생한다")
        void generateReportFailsWhenNotEnded() {
            // given
            String email = "test@test.com";
            // endDate is null (not ended)

            given(memberRepository.findByEmail(email)).willReturn(Optional.of(testMember));
            given(simulationRepository.findById(testSimulation.getId())).willReturn(Optional.of(testSimulation));

            // when & then
            assertThatThrownBy(() ->
                    simulationService.generateReport(email, testSimulation.getId()))
                    .isInstanceOf(BusinessException.class)
                    .satisfies(ex -> {
                        BusinessException be = (BusinessException) ex;
                        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.SIMULATION_NOT_ENDED);
                    });

            verify(scoreCalculator, never()).calculateReport(any(), any());
        }

        @Test
        @DisplayName("이미 보고서가 존재하는 시뮬레이션에 보고서 생성 시 409 예외가 발생한다")
        void generateReportFailsWhenAlreadyExists() {
            // given
            String email = "test@test.com";
            testSimulation.updateEndDate(LocalDate.of(2024, 3, 1));

            given(memberRepository.findByEmail(email)).willReturn(Optional.of(testMember));
            given(simulationRepository.findById(testSimulation.getId())).willReturn(Optional.of(testSimulation));
            given(reportRepository.existsBySimulationId(testSimulation.getId())).willReturn(true);

            // when & then
            assertThatThrownBy(() ->
                    simulationService.generateReport(email, testSimulation.getId()))
                    .isInstanceOf(BusinessException.class)
                    .satisfies(ex -> {
                        BusinessException be = (BusinessException) ex;
                        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.REPORT_ALREADY_EXISTS);
                    });

            verify(scoreCalculator, never()).calculateReport(any(), any());
        }
    }

    @Nested
    @DisplayName("시뮬레이션 보고서 조회 테스트")
    class GetReportTest {

        @Test
        @DisplayName("저장된 보고서를 조회한다")
        void getReportSuccess() {
            // given
            String email = "test@test.com";
            testSimulation.updateEndDate(LocalDate.of(2024, 3, 1));

            aib.trademate.domain.simulation.entity.SimulationReport savedReport =
                    aib.trademate.domain.simulation.entity.SimulationReport.builder()
                            .simulationId(testSimulation.getId())
                            .finalAvgPrice(BigDecimal.valueOf(70000))
                            .totalInvestment(BigDecimal.valueOf(700000))
                            .totalRealizedProfit(BigDecimal.valueOf(50000))
                            .totalRoi(BigDecimal.valueOf(7.14))
                            .totalScore(BigDecimal.valueOf(85))
                            .totalSellVolume(10)
                            .totalTradeCount(2)
                            .build();

            given(memberRepository.findByEmail(email)).willReturn(Optional.of(testMember));
            given(simulationRepository.findById(testSimulation.getId())).willReturn(Optional.of(testSimulation));
            given(reportRepository.findBySimulationId(testSimulation.getId())).willReturn(Optional.of(savedReport));

            // when
            SimulationReportResponse response = simulationService.getReport(email, testSimulation.getId());

            // then
            assertThat(response.summary().totalScore()).isEqualTo(BigDecimal.valueOf(85));
            assertThat(response.summary().stockCode()).isEqualTo("005930");
            verify(reportRepository).findBySimulationId(testSimulation.getId());
            verify(scoreCalculator, never()).calculateReport(any(), any());
        }

        @Test
        @DisplayName("보고서가 존재하지 않으면 404 예외가 발생한다")
        void getReportFailsWhenNotFound() {
            // given
            String email = "test@test.com";

            given(memberRepository.findByEmail(email)).willReturn(Optional.of(testMember));
            given(simulationRepository.findById(testSimulation.getId())).willReturn(Optional.of(testSimulation));
            given(reportRepository.findBySimulationId(testSimulation.getId())).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() ->
                    simulationService.getReport(email, testSimulation.getId()))
                    .isInstanceOf(BusinessException.class)
                    .satisfies(ex -> {
                        BusinessException be = (BusinessException) ex;
                        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.REPORT_NOT_FOUND);
                    });
        }
    }

    // ========== Helper Methods ==========

    private Member createMember(Long id, String email) {
        Member member = Member.builder()
                .email(email)
                .password("encodedPassword")
                .name("테스터")
                .birthdate(LocalDate.of(1990, 1, 1))
                .phone("010-1234-5678")
                .build();
        ReflectionTestUtils.setField(member, "id", id);
        return member;
    }

    private Simulation createSimulation(Long id, Long memberId, String stockCode, LocalDate startDate) {
        Simulation simulation = Simulation.builder()
                .memberId(memberId)
                .stockCode(stockCode)
                .startDate(startDate)
                .build();
        ReflectionTestUtils.setField(simulation, "id", id);
        return simulation;
    }

    private SimulationTrade createTrade(Long id, Simulation simulation, TradeType type, int volume) {
        SimulationTrade trade = SimulationTrade.builder()
                .simulation(simulation)
                .tradeDate(LocalDate.of(2024, 1, 15))
                .balance(1000)
                .price(70000)
                .upperLimit(75000)
                .lowerLimit(65000)
                .tradeType(type)
                .volume(volume)
                .comment("테스트 거래")
                .build();
        ReflectionTestUtils.setField(trade, "id", id);
        return trade;
    }
}
