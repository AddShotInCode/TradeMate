package aib.trademate.domain.simulation.controller;

import aib.trademate.domain.simulation.dto.*;
import aib.trademate.domain.simulation.service.SimulationService;
import aib.trademate.global.exception.BusinessException;
import aib.trademate.global.exception.ErrorCode;
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
public class SimulationController {

    private final SimulationService simulationService;

    /**
     * 시뮬레이션 생성
     * POST /api/simulation?code={종목코드}&start={시작시점}
     */
    @PostMapping
    public ResponseEntity<CreateSimulationResponse> createSimulation(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String code,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start) {

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
    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, String>> updateEndDate(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {

        validateAuthenticated(userDetails);
        log.debug("Update simulation end date: id={}, end={}", id, end);

        simulationService.updateEndDate(userDetails.getUsername(), id, end);

        return ResponseEntity.ok(Map.of("message", "End date updated successfully"));
    }

    /**
     * 내 시뮬레이션 목록 조회
     * GET /api/simulation
     */
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
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSimulation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        validateAuthenticated(userDetails);
        log.debug("Delete simulation request: id={}", id);

        simulationService.deleteSimulation(userDetails.getUsername(), id);

        return ResponseEntity.noContent().build();
    }

    /**
     * 거래 데이터 추가
     * POST /api/simulation/{id}/data
     */
    @PostMapping("/{id}/data")
    public ResponseEntity<Map<String, String>> addTrade(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
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
    @GetMapping("/{id}/data")
    public ResponseEntity<TradeListResponse> getTrades(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

        validateAuthenticated(userDetails);
        log.debug("Get trades request: simulationId={}", id);

        TradeListResponse response = simulationService.getTrades(userDetails.getUsername(), id);

        return ResponseEntity.ok(response);
    }

    /**
     * 시뮬레이션 결과 분석 보고서 조회
     * GET /api/simulation/{id}/report
     */
    @GetMapping("/{id}/report")
    public ResponseEntity<SimulationReportResponse> getReport(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {

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
