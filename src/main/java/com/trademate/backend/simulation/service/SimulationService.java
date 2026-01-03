package com.trademate.backend.simulation.service;

import com.trademate.backend.candle.domain.Candle;
import com.trademate.backend.candle.dto.CandleResponseDto;
import com.trademate.backend.candle.repository.CandleRepository;
import com.trademate.backend.candle.service.CandleLowService;
import com.trademate.backend.global.error.NotFoundEntityException;
import com.trademate.backend.simulation.domain.TrainingSession;
import com.trademate.backend.simulation.dto.SimulationStatusResponseDto;
import com.trademate.backend.simulation.dto.TrainingStartRequestDto;
import com.trademate.backend.simulation.repository.TrainingSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SimulationService {

    private final TrainingSessionRepository trainingSessionRepository;
    private final CandleLowService candleLowService;
    private final CandleRepository candleRepository; // [Step 9] 현재가 조회를 위해 추가됨

    /**
     * [Step 6] 시뮬레이션 세션 생성 (게임 시작)
     */
    @Transactional
    public Long createSession(TrainingStartRequestDto requestDto) {
        // 유효성 검증
        if (requestDto.endDate().isBefore(requestDto.startDate())) {
            throw new IllegalArgumentException("종료일은 시작일 이후여야 합니다.");
        }

        TrainingSession session = requestDto.toEntity();
        TrainingSession savedSession = trainingSessionRepository.save(session);

        return savedSession.getId();
    }

    /**
     * [Step 7] 타임머신: 다음 캔들 조회 및 시간 전진
     */
    @Transactional
    public List<CandleResponseDto> nextCandles(Long sessionId, int count) {
        // 1. 세션 조회
        TrainingSession session = trainingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new NotFoundEntityException("존재하지 않는 세션입니다. ID: " + sessionId));

        // 2. 이미 종료된 세션이면 빈 리스트 반환
        if (session.isFinished()) {
            return Collections.emptyList();
        }

        // 3. 다음 캔들 데이터 조회 (현재 가상 시간 이후 데이터)
        List<Candle> nextCandles = candleLowService.findNextCandles(
                session.getStockCode(),
                session.getCurrentVirtualTime(),
                count
        );

        // 4. 데이터가 없으면(마지막 날짜 도달) -> 훈련 종료 처리
        if (nextCandles.isEmpty()) {
            session.finishSimulation();
            return Collections.emptyList();
        }

        // 5. 타임머신 작동: 세션의 시간을 조회된 마지막 캔들의 시간으로 업데이트
        Candle lastCandle = nextCandles.get(nextCandles.size() - 1);
        session.advanceTime(lastCandle.getDateTime());

        // 6. DTO 변환 및 반환
        return nextCandles.stream()
                .map(CandleResponseDto::from)
                .toList();
    }

    /**
     * [Step 9] 시뮬레이션 현황 조회 (대시보드: 수익률, 평가금 등 계산)
     */
    @Transactional(readOnly = true)
    public SimulationStatusResponseDto getSessionStatus(Long sessionId) {
        // 1. 세션 조회
        TrainingSession session = trainingSessionRepository.findById(sessionId)
                .orElseThrow(() -> new NotFoundEntityException("존재하지 않는 세션입니다. ID: " + sessionId));

        // 2. 현재가 조회 (세션의 현재 가상 시간 기준)
        Candle currentCandle = candleRepository.findByStockCodeAndDateTime(
                session.getStockCode(),
                session.getCurrentVirtualTime()
        ).orElseThrow(() -> new NotFoundEntityException("현재 시점의 캔들 데이터를 찾을 수 없습니다."));

        BigDecimal currentPrice = currentCandle.getClose(); // 현재가 = 해당 시점의 종가

        // 3. 자산 계산
        // 평가금 = 보유수량 * 현재가
        BigDecimal valuationAmount = currentPrice.multiply(BigDecimal.valueOf(session.getHoldingQuantity()));

        // 총 자산 = 예수금(잔고) + 평가금
        BigDecimal totalAsset = session.getCurrentBalance().add(valuationAmount);

        // 총 손익 = 총 자산 - 초기 자본금
        BigDecimal totalProfit = totalAsset.subtract(session.getInitialBalance());

        // 수익률 = (총 손익 / 초기 자본금) * 100
        BigDecimal returnRate = BigDecimal.ZERO;
        if (session.getInitialBalance().compareTo(BigDecimal.ZERO) > 0) {
            returnRate = totalProfit.divide(session.getInitialBalance(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }

        // 4. DTO 반환
        return new SimulationStatusResponseDto(
                session.getId(),
                session.getInitialBalance(),
                session.getCurrentBalance(),
                session.getHoldingQuantity(),
                session.getAveragePrice(),
                currentPrice,
                valuationAmount,
                totalAsset,
                totalProfit,
                returnRate
        );
    }
}