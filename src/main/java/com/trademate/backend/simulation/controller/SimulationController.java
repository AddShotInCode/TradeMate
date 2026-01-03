package com.trademate.backend.simulation.controller;

import com.trademate.backend.candle.dto.CandleResponseDto;
import com.trademate.backend.simulation.dto.SimulationStatusResponseDto;
import com.trademate.backend.simulation.dto.TrainingStartRequestDto;
import com.trademate.backend.simulation.service.SimulationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.trademate.backend.review.service.ScoringService; // 추가

import java.util.List;

@RestController
@RequestMapping("/api/training")
@RequiredArgsConstructor
public class SimulationController {

    private final SimulationService simulationService;
    private final ScoringService scoringService;

    // 1. 훈련 시작
    @PostMapping("/start")
    public ResponseEntity<Long> startSimulation(@RequestBody @Valid TrainingStartRequestDto requestDto) {
        Long sessionId = simulationService.createSession(requestDto);
        return ResponseEntity.ok(sessionId);
    }

    // 2. 다음 캔들 조회 (타임머신)
    @GetMapping("/{sessionId}/next-candles")
    public ResponseEntity<List<CandleResponseDto>> getNextCandles(
            @PathVariable Long sessionId,
            @RequestParam(defaultValue = "1") int count
    ) {
        List<CandleResponseDto> candles = simulationService.nextCandles(sessionId, count);
        return ResponseEntity.ok(candles);
    }

    // 3. [이 부분이 빠져있었을 겁니다!] 실시간 수익률 조회
    @GetMapping("/{sessionId}/status")
    public ResponseEntity<SimulationStatusResponseDto> getSimulationStatus(@PathVariable Long sessionId) {
        SimulationStatusResponseDto status = simulationService.getSessionStatus(sessionId);
        return ResponseEntity.ok(status);
    }
    @PostMapping("/{sessionId}/finish")
    public ResponseEntity<Long> finishSimulation(@PathVariable Long sessionId) {
        Long reviewId = scoringService.finishAndScore(sessionId);
        return ResponseEntity.ok(reviewId);
    }
}