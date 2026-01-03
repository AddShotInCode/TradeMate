package com.trademate.backend.candle.service;
import com.trademate.backend.candle.repository.CandleRepository;

import com.trademate.backend.candle.domain.Candle;
import com.trademate.backend.candle.dto.CandleSaveRequestDto;
import com.trademate.backend.candle.dto.kis.KisDailyPriceResponseDto;
import com.trademate.backend.candle.infrastructure.KisApiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CandleService {
    private final CandleRepository candleRepository;
    private final CandleLowService candleLowService;
    private final KisApiClient kisApiClient; // [추가] 외부 통신 모듈 주입

    /**
     * 기존 단건 저장 메서드 (유지)
     */
    @Transactional
    public Long saveCandle(CandleSaveRequestDto requestDto) {
        if (candleLowService.exists(requestDto.stockCode(), requestDto.dateTime())) {
            log.warn("Duplicate Candle Detected - Stock: {}, Time: {}", requestDto.stockCode(), requestDto.dateTime());
            return null;
        }
        return candleLowService.save(requestDto.toEntity()).getId();
    }

    /**
     * [신규] KIS 외부 API 연동 및 대량 저장
     * 비즈니스 로직: 토큰 발급 -> API 호출 -> 파싱 -> 중복 체크 -> 일괄 저장
     */
    @Transactional
    public int fetchAndSaveDailyCandles(String stockCode, String startDate, String endDate) {
        log.info("Fetching candles for {} from {} to {}", stockCode, startDate, endDate);

        // 1. 접근 토큰 발급
        String token = kisApiClient.getAccessToken();

        // 2. KIS API 호출
        KisDailyPriceResponseDto response = kisApiClient.getDailyPrices(stockCode, startDate, endDate, token);

        if (response == null || response.output2() == null) {
            log.error("Failed to fetch data or empty response for stock: {}", stockCode);
            throw new RuntimeException("KIS API 호출 실패 또는 데이터 없음");
        }

        // 3. 데이터 파싱 및 저장
        List<KisDailyPriceResponseDto.Output2> items = response.output2();
        int saveCount = 0;

        for (KisDailyPriceResponseDto.Output2 item : items) {
            // 날짜 변환 (YYYYMMDD -> LocalDateTime)
            // 일봉 데이터이므로 시간은 00:00:00 으로 설정 (필요 시 15:30:00 등으로 조정 가능)
            LocalDateTime dateTime = LocalDate.parse(item.date(), DateTimeFormatter.BASIC_ISO_DATE).atStartOfDay();

            // 중복 체크 (이미 수집한 날짜면 스킵)
            if (candleLowService.exists(stockCode, dateTime)) {
                continue;
            }

            // Entity 변환
            Candle candle = Candle.builder()
                    .stockCode(stockCode)
                    .dateTime(dateTime)
                    .open(new BigDecimal(item.open()))
                    .high(new BigDecimal(item.high()))
                    .low(new BigDecimal(item.low()))
                    .close(new BigDecimal(item.close()))
                    .volume(Long.parseLong(item.volume()))
                    .build();

            // 저장
            candleLowService.save(candle);
            saveCount++;
        }


        log.info("Successfully saved {} candles for {}", saveCount, stockCode);
        return saveCount;
    }
    @Transactional(readOnly = true)
    public List<Candle> getCandleData(String stockCode, LocalDateTime startDate, LocalDateTime endDate) {
        return candleRepository.getCandles(stockCode, startDate, endDate);
    }
}