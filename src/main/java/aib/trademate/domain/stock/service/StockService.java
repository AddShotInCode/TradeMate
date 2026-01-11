package aib.trademate.domain.stock.service;

import aib.trademate.domain.stock.client.StockOpenApiClient;
import aib.trademate.domain.stock.config.StockProperties;
import aib.trademate.domain.stock.dto.StockApiDto;
import aib.trademate.domain.stock.entity.DailyPrice;
import aib.trademate.domain.stock.entity.Stock;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class StockService {

    private final StockOpenApiClient stockOpenApiClient;
    private final StockLowService stockLowService;
    private final StockProperties stockProperties;  // 종목 코드 설정 주입

    /**
     * [초기화] 1년치 데이터 적재
     * 서버 시작 시 또는 관리자 요청 시 실행
     */
    @Transactional
    public void initStockData() {
        List<String> targetCodes = stockProperties.getTargetCodes();
        int totalCount = targetCodes.size();
        int successCount = 0;
        int failCount = 0;
        List<String> failedCodes = new ArrayList<>();

        log.info("========== [INIT START] Total {} stocks ==========", totalCount);

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(365); // 1년 전

        String strStartDate = startDate.format(DateTimeFormatter.BASIC_ISO_DATE); // yyyyMMdd
        String strEndDate = endDate.format(DateTimeFormatter.BASIC_ISO_DATE);

        for (String code : targetCodes) {
            try {
                // 1. API 호출 (먼저 데이터를 가져옴)
                List<StockApiDto.Item> items = stockOpenApiClient.getStockHistory(code, strStartDate, strEndDate);

                if (items.isEmpty()) {
                    log.warn("[INIT] Stock {} - No data (empty API response)", code);
                    failCount++;
                    failedCodes.add(code + "(no data)");
                    continue;
                }

                // 2. API 응답에서 종목 정보 추출 (첫 번째 item에서)
                StockApiDto.Item firstItem = items.get(0);
                String stockName = firstItem.getItmsNm();
                String marketType = firstItem.getMrktCtg();

                // 3. 종목 정보 확인 (없으면 생성, 있으면 정보 업데이트)
                Stock stock = stockLowService.findStockByCode(code)
                        .map(existingStock -> {
                            existingStock.updateInfo(stockName, marketType);
                            return existingStock;
                        })
                        .orElseGet(() -> stockLowService.saveStock(
                                Stock.builder()
                                        .code(code)
                                        .name(stockName)
                                        .marketType(marketType)
                                        .build()));

                // 4. Entity 변환
                List<DailyPrice> dailyPrices = new ArrayList<>();
                for (StockApiDto.Item item : items) {
                    dailyPrices.add(convertToEntity(item, stock));
                }

                // 5. DB 저장 (LowService 위임)
                stockLowService.saveDailyPrices(dailyPrices);
                successCount++;
                log.info("[INIT] Stock {} ({}) - Saved {} price records", code, stockName, dailyPrices.size());

            } catch (Exception e) {
                failCount++;
                failedCodes.add(code + "(" + e.getMessage() + ")");
                log.error("[INIT] Stock {} - Save failed: {}", code, e.getMessage());
            }
        }

        log.info("========== [INIT COMPLETE] ==========");
        log.info("Total {} stocks - Success: {}, Failed: {}", totalCount, successCount, failCount);
        if (!failedCodes.isEmpty()) {
            log.warn("Failed stocks: {}", failedCodes);
        }
    }

    /**
     * [스케줄러] 매일 장 마감 후 당일 데이터 업데이트
     * 평일 오후 4시 30분 실행 (장 마감 및 데이터 집계 시간 고려)
     */
    @Transactional
    @Scheduled(cron = "0 30 16 * * *") // 초 분 시 일 월 요일
    public void updateTodayStockData() {
        List<String> targetCodes = stockProperties.getTargetCodes();
        int totalCount = targetCodes.size();
        int successCount = 0;
        int skipCount = 0;  // 휴장일 등으로 데이터 없는 경우
        int failCount = 0;
        List<String> failedCodes = new ArrayList<>();

        LocalDate today = LocalDate.now();
        String strToday = today.format(DateTimeFormatter.BASIC_ISO_DATE);

        log.info("========== [DAILY UPDATE START] Date: {}, Total {} stocks ==========", today, totalCount);

        for (String code : targetCodes) {
            try {
                // 오늘 날짜 데이터만 요청
                List<StockApiDto.Item> items = stockOpenApiClient.getStockHistory(code, strToday, strToday);

                if (items.isEmpty()) {
                    skipCount++;
                    log.debug("[DAILY] Stock {} - No data (holiday or not yet available)", code);
                    continue; // 휴장일이거나 데이터 아직 안 들어옴
                }

                Optional<Stock> stockOpt = stockLowService.findStockByCode(code);
                if (stockOpt.isEmpty()) {
                    failCount++;
                    failedCodes.add(code + "(not registered)");
                    log.warn("[DAILY] Stock {} - Not found in DB", code);
                    continue;
                }

                Stock stock = stockOpt.get();
                DailyPrice dailyPrice = convertToEntity(items.get(0), stock);
                // 단건 저장이지만 List로 감싸서 기존 메서드 재활용
                stockLowService.saveDailyPrices(List.of(dailyPrice));
                successCount++;
                log.debug("[DAILY] Stock {} ({}) - Saved", code, stock.getName());

            } catch (Exception e) {
                failCount++;
                failedCodes.add(code + "(" + e.getMessage() + ")");
                log.error("[DAILY] Stock {} - Save failed: {}", code, e.getMessage());
            }
        }

        log.info("========== [DAILY UPDATE COMPLETE] ==========");
        log.info("Total {} stocks - Success: {}, Skipped: {}, Failed: {}", 
                totalCount, successCount, skipCount, failCount);
        if (!failedCodes.isEmpty()) {
            log.warn("Failed stocks: {}", failedCodes);
        }
    }

    /**
     * [스케줄러] 오래된 데이터 삭제 (1년 지난 데이터)
     * 매일 자정 실행
     */
    @Transactional
    @Scheduled(cron = "0 0 0 * * *")
    public void deleteExpiredData() {
        LocalDate oneYearAgo = LocalDate.now().minusYears(1);
        log.info("Deleting data older than {}", oneYearAgo);
        
        stockLowService.deleteOldDailyPrices(oneYearAgo);
    }

    // --- Helper Methods ---

    // DTO -> Entity 변환 로직
    private DailyPrice convertToEntity(StockApiDto.Item item, Stock stock) {
        return DailyPrice.builder()
                .stock(stock)
                .date(parseDate(item.getBasDt()))
                .openPrice(parseLong(item.getMkp()))
                .highPrice(parseLong(item.getHipr()))
                .lowPrice(parseLong(item.getLopr()))
                .closePrice(parseLong(item.getClpr()))
                .volume(parseLong(item.getTrqu()))
                .changeAmount(parseLong(item.getVs()))
                .changeRate(parseDouble(item.getFltRt()))
                .build();
    }

    private LocalDate parseDate(String dateStr) {
        return LocalDate.parse(dateStr, DateTimeFormatter.BASIC_ISO_DATE);
    }

    private Long parseLong(String value) {
        if (value == null || value.isBlank()) return 0L;
        // 콤마 제거 후 파싱 (예: "1,000" -> 1000)
        return Long.parseLong(value.replace(",", ""));
    }

    private Double parseDouble(String value) {
        if (value == null || value.isBlank()) return 0.0;
        return Double.parseDouble(value);
    }
}