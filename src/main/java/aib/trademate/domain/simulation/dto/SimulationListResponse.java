package aib.trademate.domain.simulation.dto;

import java.util.List;

/**
 * 시뮬레이션 목록 응답 DTO
 */
public record SimulationListResponse(
        List<SimulationResponse> simulations,
        long totalElements
) {
    public static SimulationListResponse of(List<SimulationResponse> simulations) {
        return new SimulationListResponse(simulations, simulations.size());
    }
}
