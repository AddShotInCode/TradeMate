package aib.trademate.domain.simulation.repository;

import aib.trademate.domain.member.entity.Member;
import aib.trademate.domain.simulation.entity.Simulation;
import aib.trademate.domain.simulation.entity.SimulationTrade;
import aib.trademate.domain.simulation.entity.TradeType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * SimulationTradeRepository 통합 테스트
 * 
 * H2 인메모리 DB를 사용하여 쿼리 동작을 검증합니다.
 */
@DataJpaTest
@DisplayName("SimulationTradeRepository 테스트")
@SuppressWarnings("null")
class SimulationTradeRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private SimulationTradeRepository tradeRepository;

    private Simulation testSimulation;
    private Simulation otherSimulation;

    @BeforeEach
    void setUp() {
        // 테스트 회원 생성
        Member member = Member.builder()
                .email("test@test.com")
                .password("password")
                .name("테스터")
                .birthdate(LocalDate.of(1990, 1, 1))
                .phone("010-1234-5678")
                .build();
        entityManager.persistAndFlush(member);

        // 테스트 시뮬레이션 생성
        testSimulation = Simulation.builder()
                .memberId(member.getId())
                .stockCode("005930")
                .startDate(LocalDate.of(2024, 1, 1))
                .build();
        entityManager.persistAndFlush(testSimulation);

        otherSimulation = Simulation.builder()
                .memberId(member.getId())
                .stockCode("035720")
                .startDate(LocalDate.of(2024, 2, 1))
                .build();
        entityManager.persistAndFlush(otherSimulation);
        entityManager.clear();
    }

    @Nested
    @DisplayName("findBySimulationIdOrderByTradeDateAsc 테스트")
    class FindBySimulationIdOrderByTradeDateAscTest {

        @Test
        @DisplayName("특정 시뮬레이션의 거래 목록을 날짜순으로 조회한다")
        void findBySimulationIdOrderByTradeDateAscSuccess() {
            // given - 순서 섞어서 저장
            SimulationTrade trade3 = createTrade(testSimulation, LocalDate.of(2024, 1, 30), TradeType.SELL, 10);
            SimulationTrade trade1 = createTrade(testSimulation, LocalDate.of(2024, 1, 10), TradeType.BUY, 10);
            SimulationTrade trade2 = createTrade(testSimulation, LocalDate.of(2024, 1, 20), TradeType.BUY, 5);
            SimulationTrade otherTrade = createTrade(otherSimulation, LocalDate.of(2024, 2, 15), TradeType.BUY, 20);

            entityManager.persist(trade3);
            entityManager.persist(trade1);
            entityManager.persist(trade2);
            entityManager.persist(otherTrade);
            entityManager.flush();
            entityManager.clear();

            // when
            List<SimulationTrade> result = tradeRepository.findBySimulationIdOrderByTradeDateAsc(testSimulation.getId());

            // then
            assertThat(result).hasSize(3);
            assertThat(result.get(0).getTradeDate()).isEqualTo(LocalDate.of(2024, 1, 10));
            assertThat(result.get(1).getTradeDate()).isEqualTo(LocalDate.of(2024, 1, 20));
            assertThat(result.get(2).getTradeDate()).isEqualTo(LocalDate.of(2024, 1, 30));
        }

        @Test
        @DisplayName("거래가 없으면 빈 리스트를 반환한다")
        void findBySimulationIdReturnsEmpty() {
            // when
            List<SimulationTrade> result = tradeRepository.findBySimulationIdOrderByTradeDateAsc(testSimulation.getId());

            // then
            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("countBySimulationId 테스트")
    class CountBySimulationIdTest {

        @Test
        @DisplayName("특정 시뮬레이션의 거래 개수를 반환한다")
        void countBySimulationIdSuccess() {
            // given
            entityManager.persist(createTrade(testSimulation, LocalDate.of(2024, 1, 10), TradeType.BUY, 10));
            entityManager.persist(createTrade(testSimulation, LocalDate.of(2024, 1, 20), TradeType.BUY, 5));
            entityManager.persist(createTrade(testSimulation, LocalDate.of(2024, 1, 30), TradeType.SELL, 15));
            entityManager.flush();
            entityManager.clear();

            // when
            long count = tradeRepository.countBySimulationId(testSimulation.getId());

            // then
            assertThat(count).isEqualTo(3);
        }

        @Test
        @DisplayName("거래가 없으면 0을 반환한다")
        void countBySimulationIdReturnsZero() {
            // when
            long count = tradeRepository.countBySimulationId(testSimulation.getId());

            // then
            assertThat(count).isZero();
        }
    }

    @Nested
    @DisplayName("CRUD 테스트")
    class CrudTest {

        @Test
        @DisplayName("거래를 저장하고 조회한다")
        void saveAndFind() {
            // given
            SimulationTrade trade = createTrade(testSimulation, LocalDate.of(2024, 1, 15), TradeType.BUY, 10);

            // when
            SimulationTrade saved = tradeRepository.save(trade);
            entityManager.flush();
            entityManager.clear();

            // then
            assertThat(tradeRepository.findById(saved.getId())).isPresent();
            assertThat(tradeRepository.findById(saved.getId()).get().getVolume()).isEqualTo(10);
        }

        @Test
        @DisplayName("거래를 삭제한다")
        void delete() {
            // given
            SimulationTrade trade = createTrade(testSimulation, LocalDate.of(2024, 1, 15), TradeType.BUY, 10);
            entityManager.persistAndFlush(trade);
            Long tradeId = trade.getId();
            entityManager.clear();

            // when
            tradeRepository.deleteById(tradeId);
            entityManager.flush();
            entityManager.clear();

            // then
            assertThat(tradeRepository.findById(tradeId)).isEmpty();
        }
    }

    // ========== Helper Methods ==========

    private SimulationTrade createTrade(Simulation simulation, LocalDate tradeDate, TradeType type, int volume) {
        return SimulationTrade.builder()
                .simulation(simulation)
                .tradeDate(tradeDate)
                .balance(1000)
                .price(70000)
                .upperLimit(75000)
                .lowerLimit(65000)
                .tradeType(type)
                .volume(volume)
                .comment("테스트 거래")
                .build();
    }
}
