package aib.trademate.domain.simulation.dto;

import aib.trademate.domain.simulation.entity.Simulation;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 시뮬레이션 응답 DTO
 */
@Schema(description = "시뮬레이션 정보")
public record SimulationResponse(
        @Schema(description = "시뮬레이션 ID", example = "1")
        Long id,

        @Schema(description = "종목코드", example = "005930")
        String stockCode,

        @Schema(description = "시작일", example = "2024-01-01")
        LocalDate startDate,

        @Schema(description = "종료일", example = "2024-12-31")
        LocalDate endDate,

        @Schema(description = "생성일시")
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
