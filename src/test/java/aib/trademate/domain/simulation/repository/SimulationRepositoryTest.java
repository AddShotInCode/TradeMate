package aib.trademate.domain.simulation.repository;

import aib.trademate.domain.member.entity.Member;
import aib.trademate.domain.simulation.entity.Simulation;
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
 * SimulationRepository 통합 테스트
 * 
 * H2 인메모리 DB를 사용하여 쿼리 동작을 검증합니다.
 */
@DataJpaTest
@DisplayName("SimulationRepository 테스트")
@SuppressWarnings("null")
class SimulationRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private SimulationRepository simulationRepository;

    private Member testMember;
    private Member otherMember;

    @BeforeEach
    void setUp() {
        // 테스트 회원 생성
        testMember = Member.builder()
                .email("test@test.com")
                .password("password")
                .name("테스터")
                .birthdate(LocalDate.of(1990, 1, 1))
                .phone("010-1234-5678")
                .build();
        entityManager.persistAndFlush(testMember);

        otherMember = Member.builder()
                .email("other@test.com")
                .password("password")
                .name("다른사용자")
                .birthdate(LocalDate.of(1995, 5, 5))
                .phone("010-9999-8888")
                .build();
        entityManager.persistAndFlush(otherMember);
        entityManager.clear();
    }

    @Nested
    @DisplayName("findByMemberId 테스트")
    class FindByMemberIdTest {

        @Test
        @DisplayName("특정 회원의 시뮬레이션 목록을 조회한다")
        void findByMemberIdSuccess() {
            // given
            Simulation sim1 = createSimulation(testMember.getId(), "005930", LocalDate.of(2024, 1, 1));
            Simulation sim2 = createSimulation(testMember.getId(), "035720", LocalDate.of(2024, 2, 1));
            Simulation otherSim = createSimulation(otherMember.getId(), "000660", LocalDate.of(2024, 3, 1));

            entityManager.persist(sim1);
            entityManager.persist(sim2);
            entityManager.persist(otherSim);
            entityManager.flush();
            entityManager.clear();

            // when
            List<Simulation> result = simulationRepository.findByMemberId(testMember.getId());

            // then
            assertThat(result).hasSize(2);
            assertThat(result).extracting(Simulation::getStockCode)
                    .containsExactlyInAnyOrder("005930", "035720");
        }

        @Test
        @DisplayName("시뮬레이션이 없으면 빈 리스트를 반환한다")
        void findByMemberIdReturnsEmpty() {
            // when
            List<Simulation> result = simulationRepository.findByMemberId(testMember.getId());

            // then
            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("countByMemberId 테스트")
    class CountByMemberIdTest {

        @Test
        @DisplayName("특정 회원의 시뮬레이션 개수를 반환한다")
        void countByMemberIdSuccess() {
            // given
            entityManager.persist(createSimulation(testMember.getId(), "005930", LocalDate.of(2024, 1, 1)));
            entityManager.persist(createSimulation(testMember.getId(), "035720", LocalDate.of(2024, 2, 1)));
            entityManager.persist(createSimulation(testMember.getId(), "000660", LocalDate.of(2024, 3, 1)));
            entityManager.flush();
            entityManager.clear();

            // when
            long count = simulationRepository.countByMemberId(testMember.getId());

            // then
            assertThat(count).isEqualTo(3);
        }

        @Test
        @DisplayName("시뮬레이션이 없으면 0을 반환한다")
        void countByMemberIdReturnsZero() {
            // when
            long count = simulationRepository.countByMemberId(testMember.getId());

            // then
            assertThat(count).isZero();
        }
    }

    @Nested
    @DisplayName("CRUD 테스트")
    class CrudTest {

        @Test
        @DisplayName("시뮬레이션을 저장하고 조회한다")
        void saveAndFind() {
            // given
            Simulation simulation = createSimulation(testMember.getId(), "005930", LocalDate.of(2024, 1, 1));

            // when
            Simulation saved = simulationRepository.save(simulation);
            entityManager.flush();
            entityManager.clear();

            // then
            assertThat(simulationRepository.findById(saved.getId())).isPresent();
        }

        @Test
        @DisplayName("시뮬레이션 종료일을 업데이트한다")
        void updateEndDate() {
            // given
            Simulation simulation = createSimulation(testMember.getId(), "005930", LocalDate.of(2024, 1, 1));
            entityManager.persistAndFlush(simulation);
            entityManager.clear();

            // when
            Simulation found = simulationRepository.findById(simulation.getId()).orElseThrow();
            found.updateEndDate(LocalDate.of(2024, 3, 1));
            entityManager.flush();
            entityManager.clear();

            // then
            Simulation updated = simulationRepository.findById(simulation.getId()).orElseThrow();
            assertThat(updated.getEndDate()).isEqualTo(LocalDate.of(2024, 3, 1));
        }

        @Test
        @DisplayName("시뮬레이션을 삭제한다")
        void delete() {
            // given
            Simulation simulation = createSimulation(testMember.getId(), "005930", LocalDate.of(2024, 1, 1));
            entityManager.persistAndFlush(simulation);
            Long simId = simulation.getId();
            entityManager.clear();

            // when
            simulationRepository.deleteById(simId);
            entityManager.flush();
            entityManager.clear();

            // then
            assertThat(simulationRepository.findById(simId)).isEmpty();
        }
    }

    // ========== Helper Methods ==========

    private Simulation createSimulation(Long memberId, String stockCode, LocalDate startDate) {
        return Simulation.builder()
                .memberId(memberId)
                .stockCode(stockCode)
                .startDate(startDate)
                .build();
    }
}
