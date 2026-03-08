package aib.trademate.domain.simulation.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 시뮬레이션 생성 응답 DTO
 */
@Schema(description = "시뮬레이션 생성 응답")
public record CreateSimulationResponse(
        @Schema(description = "생성된 시뮬레이션 ID", example = "1")
        Long id,

        @Schema(description = "결과 메시지", example = "Simulation created successfully")
        String message
) {
    public static CreateSimulationResponse of(Long id) {
        return new CreateSimulationResponse(id, "Simulation created successfully");
    }
}
