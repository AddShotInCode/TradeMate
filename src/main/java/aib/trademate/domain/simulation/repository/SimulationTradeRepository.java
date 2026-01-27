package aib.trademate.domain.simulation.repository;

import aib.trademate.domain.simulation.entity.SimulationTrade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * 시뮬레이션 거래 데이터 Repository
 */
public interface SimulationTradeRepository extends JpaRepository<SimulationTrade, Long> {

    /**
     * 특정 시뮬레이션의 거래 데이터 목록 조회 (거래일 순 정렬)
     */
    List<SimulationTrade> findBySimulationIdOrderByTradeDateAsc(Long simulationId);

    /**
     * 특정 시뮬레이션의 거래 데이터 개수 조회
     */
    long countBySimulationId(Long simulationId);
}
