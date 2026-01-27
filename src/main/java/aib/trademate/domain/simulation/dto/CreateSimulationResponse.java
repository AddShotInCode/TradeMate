package aib.trademate.domain.simulation.dto;

/**
 * 시뮬레이션 생성 응답 DTO
 */
public record CreateSimulationResponse(
        Long id,
        String message
) {
    public static CreateSimulationResponse of(Long id) {
        return new CreateSimulationResponse(id, "Simulation created successfully");
    }
}
