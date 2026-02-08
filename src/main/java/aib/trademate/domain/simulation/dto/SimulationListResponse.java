package aib.trademate.domain.simulation.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

/**
 * 시뮬레이션 목록 응답 DTO
 */
@Schema(description = "시뮬레이션 목록 응답")
public record SimulationListResponse(
        @Schema(description = "시뮬레이션 목록")
        List<SimulationResponse> simulations,

        @Schema(description = "총 건수", example = "5")
        long totalElements
) {
    public static SimulationListResponse of(List<SimulationResponse> simulations) {
        return new SimulationListResponse(simulations, simulations.size());
    }
}
