package aib.trademate.domain.simulation.repository;

import aib.trademate.domain.simulation.entity.Simulation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * 시뮬레이션 Repository
 */
public interface SimulationRepository extends JpaRepository<Simulation, Long> {

    /**
     * 특정 사용자의 시뮬레이션 목록 조회
     */
    List<Simulation> findByMemberId(Long memberId);

    /**
     * 특정 사용자의 시뮬레이션 개수 조회
     */
    long countByMemberId(Long memberId);
}
