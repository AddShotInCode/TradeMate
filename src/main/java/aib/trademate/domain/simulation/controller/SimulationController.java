package aib.trademate.domain.simulation.controller;

import aib.trademate.domain.simulation.dto.*;
import aib.trademate.domain.simulation.service.SimulationService;
import aib.trademate.global.exception.BusinessException;
import aib.trademate.global.exception.ErrorCode;
import aib.trademate.global.exception.ErrorResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

/**
 * 시뮬레이션 API 컨트롤러
 */
@Slf4j
@RestController
@RequestMapping("/api/simulation")
@RequiredArgsConstructor
@Tag(name = "시뮬레이션", description = "주식 거래 시뮬레이션 CRUD, 거래 데이터 관리, 분석 리포트 API")
public class SimulationController {

    private final SimulationService simulationService;

    /**
     * 시뮬레이션 생성
     * POST /api/simulation?code={종목코드}&start={시작시점}
     */
    @Operation(summary = "시뮬레이션 생성", description = "새로운 주식 거래 시뮬레이션을 생성합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "시뮬레이션 생성 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public ResponseEntity<CreateSimulationResponse> createSimulation(
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "종목코드 (6자리)", example = "005930") @RequestParam String code,
            @Parameter(description = "시작일 (yyyy-MM-dd)", example = "2024-01-01") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start) {

        validateAuthenticated(userDetails);
        log.debug("Create simulation request: code={}, start={}", code, start);

        CreateSimulationResponse response = simulationService.createSimulation(
                userDetails.getUsername(), code, start);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 시뮬레이션 종료일 업데이트
     * PATCH /api/simulation/{id}?end={종료시점}
     */
    @Operation(summary = "시뮬레이션 종료일 설정", description = "시뮬레이션의 종료일을 설정합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "종료일 설정 성공"),
            @ApiResponse(responseCode = "404", description = "시뮬레이션 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateEndDate(
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "시뮬레이션 ID", example = "1") @PathVariable Long id,
            @Parameter(description = "종료일 (yyyy-MM-dd)", example = "2024-12-31") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        validateAuthenticated(userDetails);
        log.debug("Update simulation end date: id={}, end={}", id, end);

        simulationService.updateEndDate(userDetails.getUsername(), id, end);

        return ResponseEntity.ok(Map.of("message", "End date updated successfully"));
    }

    /**
     * 내 시뮬레이션 목록 조회
     * GET /api/simulation
     */
    @Operation(summary = "내 시뮬레이션 목록 조회", description = "로그인한 사용자의 시뮬레이션 목록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping
    public ResponseEntity<SimulationListResponse> getMySimulations(
            @AuthenticationPrincipal UserDetails userDetails) {

        validateAuthenticated(userDetails);
        log.debug("Get my simulations request");

        SimulationListResponse response = simulationService.getMySimulations(userDetails.getUsername());

        return ResponseEntity.ok(response);
    }

    /**
     * 시뮬레이션 삭제
     * DELETE /api/simulation/{id}
     */
    @Operation(summary = "시뮬레이션 삭제", description = "시뮬레이션과 관련 거래 데이터를 모두 삭제합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "삭제 성공"),
            @ApiResponse(responseCode = "404", description = "시뮬레이션 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSimulation(
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "시뮬레이션 ID", example = "1") @PathVariable Long id) {

        validateAuthenticated(userDetails);
        log.debug("Delete simulation request: id={}", id);

        simulationService.deleteSimulation(userDetails.getUsername(), id);

        return ResponseEntity.noContent().build();
    }

    /**
     * 거래 데이터 추가
     * POST /api/simulation/{id}/data
     */
    @Operation(summary = "거래 데이터 추가", description = "시뮬레이션에 매수/매도 거래 데이터를 추가합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "거래 데이터 추가 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 유효성 검증 실패",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "시뮬레이션 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/{id}/data")
    public ResponseEntity<Map<String, String>> addTrade(
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "시뮬레이션 ID", example = "1") @PathVariable Long id,
            @Valid @RequestBody AddTradeRequest request) {

        validateAuthenticated(userDetails);
        log.debug("Add trade request: simulationId={}, timestamp={}", id, request.timestamp());

        simulationService.addTrade(userDetails.getUsername(), id, request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Trade added successfully"));
    }

    /**
     * 거래 데이터 목록 조회
     * GET /api/simulation/{id}/data
     */
    @Operation(summary = "거래 데이터 목록 조회", description = "시뮬레이션의 거래 데이터를 날짜순으로 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공"),
            @ApiResponse(responseCode = "404", description = "시뮬레이션 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}/data")
    public ResponseEntity<TradeListResponse> getTrades(
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "시뮬레이션 ID", example = "1") @PathVariable Long id) {

        validateAuthenticated(userDetails);
        log.debug("Get trades request: simulationId={}", id);

        TradeListResponse response = simulationService.getTrades(userDetails.getUsername(), id);

        return ResponseEntity.ok(response);
    }

    /**
     * 시뮬레이션 결과 분석 보고서 조회
     * GET /api/simulation/{id}/report
     */
    @Operation(summary = "분석 보고서 조회", description = "시뮬레이션 결과 분석 보고서를 조회합니다. 시뮬레이션 종료일 설정이 필요합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "보고서 조회 성공"),
            @ApiResponse(responseCode = "400", description = "시뮬레이션 종료일 미설정",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "시뮬레이션 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}/report")
    public ResponseEntity<SimulationReportResponse> getReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "시뮬레이션 ID", example = "1") @PathVariable Long id) {

        validateAuthenticated(userDetails);
        log.debug("Get report request: simulationId={}", id);

        SimulationReportResponse response = simulationService.getReport(userDetails.getUsername(), id);

        return ResponseEntity.ok(response);
    }

    /**
     * 인증 확인
     */
    private void validateAuthenticated(UserDetails userDetails) {
        if (userDetails == null) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Authentication required");
        }
    }
}
