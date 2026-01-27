package aib.trademate.domain.simulation.dto;

import aib.trademate.domain.simulation.entity.Simulation;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 시뮬레이션 응답 DTO
 */
public record SimulationResponse(
        Long id,
        String stockCode,
        LocalDate startDate,
        LocalDate endDate,
        LocalDateTime createdAt
) {
    /**
     * Entity → DTO 변환
     */
    public static SimulationResponse from(Simulation simulation) {
        return new SimulationResponse(
                simulation.getId(),
                simulation.getStockCode(),
                simulation.getStartDate(),
                simulation.getEndDate(),
                simulation.getCreatedAt()
        );
    }
}
