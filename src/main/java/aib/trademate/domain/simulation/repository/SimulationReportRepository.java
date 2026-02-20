package aib.trademate.domain.simulation.repository;

import aib.trademate.domain.simulation.entity.SimulationReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * 시뮬레이션 보고서 Repository
 */
public interface SimulationReportRepository extends JpaRepository<SimulationReport, Long> {

    /**
     * 시뮬레이션 ID로 보고서 조회
     */
    Optional<SimulationReport> findBySimulationId(Long simulationId);

    /**
     * 시뮬레이션 ID로 보고서 존재 여부 확인
     */
    boolean existsBySimulationId(Long simulationId);
}
