package aib.trademate.domain.statement.service;

import aib.trademate.domain.statement.client.DartOpenApiClient;
import aib.trademate.domain.statement.dto.DartApiDto;
import aib.trademate.domain.statement.dto.StatementResponseDto;
import aib.trademate.domain.statement.entity.FinancialStatement;
import aib.trademate.domain.stock.config.StockProperties;
import aib.trademate.global.exception.StatementNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
@RequiredArgsConstructor
public class StatementService {

    private final DartOpenApiClient dartOpenApiClient;
    private final StatementLowService statementLowService;
    private final StockProperties stockProperties;

    private static final String DART_VIEWER_BASE_URL = "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=";
    private static final int YEARS_TO_KEEP = 5;
    
    // 보고서명에서 연도/월 추출용 정규식 (예: "사업보고서 (2024.12)", "분기보고서 (2025.03)")
    private static final Pattern REPORT_PATTERN = Pattern.compile("\\((\\d{4})\\.(\\d{2})\\)");

    /**
     * [초기화] 최근 5년치 재무제표 정보 적재
     * 각 종목별로 독립적인 트랜잭션으로 처리하여 한 종목 실패 시 다른 종목에 영향 없음
     */
    public void initStatementData() {
        List<StockProperties.StockInfo> targetStocks = stockProperties.getTargetStocks();
        int totalCount = targetStocks.size();
        int successCount = 0;
        int failCount = 0;

        log.info("========== [STATEMENT INIT START] Total {} stocks ==========", totalCount);

        LocalDate now = LocalDate.now();
        String endDate = now.format(DateTimeFormatter.BASIC_ISO_DATE);
        String startDate = now.minusYears(YEARS_TO_KEEP).format(DateTimeFormatter.BASIC_ISO_DATE);

        for (StockProperties.StockInfo stockInfo : targetStocks) {
            try {
                String stockCode = stockInfo.getCode();
                String corpCode = stockInfo.getCorpCode();

                if (corpCode == null || corpCode.isBlank()) {
                    log.warn("[STATEMENT INIT] Stock {} - No corpCode configured", stockCode);
                    failCount++;
                    continue;
                }

                // DART API 호출
                List<DartApiDto.DisclosureItem> items = dartOpenApiClient.getDisclosureList(
                        corpCode, startDate, endDate);

                if (items.isEmpty()) {
                    log.warn("[STATEMENT INIT] Stock {} - No disclosure data", stockCode);
                    failCount++;
                    continue;
                }

                // 보고서 파싱 및 저장
                int savedCount = processAndSaveStatements(stockCode, items);
                successCount++;
                log.info("[STATEMENT INIT] Stock {} - Saved {} statements", stockCode, savedCount);

            } catch (Exception e) {
                failCount++;
                log.error("[STATEMENT INIT] Stock {} - Failed: {}", 
                        stockInfo.getCode(), e.getMessage());
            }
        }

        log.info("========== [STATEMENT INIT COMPLETE] Success: {}, Failed: {} ==========", 
                successCount, failCount);
    }

    /**
     * [스케줄링] 월별 새 보고서 업데이트
     * 4월(4분기), 6월(1분기), 9월(2분기), 12월(3분기) 1일 09:00 실행
     * 각 종목별로 독립적인 트랜잭션으로 처리
     * 
     * 조회 범위:
     * - 4월 1일 -> 전해 12월 ~ 당해 3월
     * - 6월 1일 -> 당해 4월 ~ 5월
     * - 9월 1일 -> 당해 6월 ~ 8월
     * - 12월 1일 -> 당해 9월 ~ 11월
     */
    @Scheduled(cron = "0 0 9 1 4,6,9,12 *")
    public void updateStatementData() {
        log.info("========== [STATEMENT UPDATE START] ==========");

        LocalDate now = LocalDate.now();
        int currentYear = now.getYear();
        int currentMonth = now.getMonthValue();

        // 월별 조회 범위 결정
        String startDate;
        String endDate;
        
        switch (currentMonth) {
            case 4 -> {
                // 전해 12월 ~ 당해 3월
                startDate = String.format("%04d1201", currentYear - 1);
                endDate = String.format("%04d0331", currentYear);
            }
            case 6 -> {
                // 당해 4월 ~ 5월
                startDate = String.format("%04d0401", currentYear);
                endDate = String.format("%04d0531", currentYear);
            }
            case 9 -> {
                // 당해 6월 ~ 8월
                startDate = String.format("%04d0601", currentYear);
                endDate = String.format("%04d0831", currentYear);
            }
            case 12 -> {
                // 당해 9월 ~ 11월
                startDate = String.format("%04d0901", currentYear);
                endDate = String.format("%04d1130", currentYear);
            }
            default -> {
                log.warn("[STATEMENT UPDATE] Unexpected month: {}", currentMonth);
                return;
            }
        }

        log.info("[STATEMENT UPDATE] Query period: {} ~ {}", startDate, endDate);

        List<StockProperties.StockInfo> targetStocks = stockProperties.getTargetStocks();
        int updatedCount = 0;

        for (StockProperties.StockInfo stockInfo : targetStocks) {
            try {
                String stockCode = stockInfo.getCode();
                String corpCode = stockInfo.getCorpCode();

                if (corpCode == null || corpCode.isBlank()) {
                    continue;
                }

                // 해당 기간의 보고서 조회
                List<DartApiDto.DisclosureItem> items = dartOpenApiClient.getDisclosureList(
                        corpCode, startDate, endDate);

                if (!items.isEmpty()) {
                    int saved = processAndSaveStatements(stockCode, items);
                    if (saved > 0) {
                        updatedCount++;
                        log.info("[STATEMENT UPDATE] Stock {} - Updated {} statements", 
                                stockCode, saved);
                    }
                }

            } catch (Exception e) {
                log.error("[STATEMENT UPDATE] Stock {} - Failed: {}", 
                        stockInfo.getCode(), e.getMessage());
            }
        }

        // 5년 지난 데이터 삭제
        int cutoffYear = currentYear - YEARS_TO_KEEP;
        statementLowService.deleteOldStatements(cutoffYear);

        log.info("========== [STATEMENT UPDATE COMPLETE] Updated: {} stocks ==========", updatedCount);
    }

    /**
     * 재무제표 뷰어 링크 목록 조회
     * 같은 분기의 모든 버전(기재정정 포함) 반환
     */
    @Transactional(readOnly = true)
    public StatementResponseDto.Response getStatementViewerLinks(
            String stockCode, Integer year, Integer quarter) {
        
        // 분기 유효성 검사
        if (quarter < 1 || quarter > 4) {
            throw new IllegalArgumentException("Invalid quarter: " + quarter + ". Must be 1, 2, 3, or 4.");
        }

        List<FinancialStatement> statements = statementLowService
                .findByStockCodeAndYearAndQuarter(stockCode, year, quarter);

        if (statements.isEmpty()) {
            throw new StatementNotFoundException(
                    String.format("Statement not found: stockCode=%s, year=%d, quarter=%d", 
                            stockCode, year, quarter));
        }

        List<StatementResponseDto.ViewerLink> items = statements.stream()
                .map(s -> StatementResponseDto.ViewerLink.builder()
                        .rceptLink(DART_VIEWER_BASE_URL + s.getRceptNo())
                        .rceptDt(s.getRceptDt())
                        .build())
                .toList();

        return StatementResponseDto.Response.builder()
                .totalElements(items.size())
                .items(items)
                .build();
    }

    /**
     * 공시 목록을 파싱하여 재무제표로 변환 및 저장
     * 이미 존재하는 보고서(rcept_no 기준)는 스킵
     */
    private int processAndSaveStatements(String stockCode, List<DartApiDto.DisclosureItem> items) {
        List<FinancialStatement> statements = new ArrayList<>();

        for (DartApiDto.DisclosureItem item : items) {
            // 이미 저장된 보고서인지 확인 (rcept_no 기준)
            if (statementLowService.existsByRceptNo(item.getRceptNo())) {
                continue;
            }

            QuarterInfo quarterInfo = parseReportToQuarter(item.getReportNm());
            
            if (quarterInfo == null) {
                log.trace("[STATEMENT] Skipping non-quarterly report: {}", item.getReportNm());
                continue;
            }

            // 새로운 데이터 생성
            statements.add(FinancialStatement.builder()
                    .stockCode(stockCode)
                    .fiscalYear(quarterInfo.year)
                    .quarter(quarterInfo.quarter)
                    .rceptNo(item.getRceptNo())
                    .rceptDt(item.getRceptDt())
                    .build());
        }

        if (!statements.isEmpty()) {
            statementLowService.saveAllInNewTransaction(statements);
        }

        return statements.size();
    }

    /**
     * 보고서명에서 사업연도와 분기 판별
     * 
     * 보고서명 형식:
     * - "사업보고서 (2024.12)" -> 2024년 4분기
     * - "분기보고서 (2025.03)" -> 2025년 1분기
     * - "반기보고서 (2025.06)" -> 2025년 2분기
     * - "분기보고서 (2025.09)" -> 2025년 3분기
     * - "[기재정정]사업보고서 (2024.12)" -> 2024년 4분기
     */
    private QuarterInfo parseReportToQuarter(String reportNm) {
        if (reportNm == null) {
            return null;
        }

        // 보고서명에서 연도/월 추출
        Matcher matcher = REPORT_PATTERN.matcher(reportNm);
        if (!matcher.find()) {
            return null;
        }

        int year = Integer.parseInt(matcher.group(1));
        int month = Integer.parseInt(matcher.group(2));

        // 월에 따라 분기 결정
        // 12월 -> 4분기 (사업보고서)
        // 03월 -> 1분기 (분기보고서)
        // 06월 -> 2분기 (반기보고서)
        // 09월 -> 3분기 (분기보고서)
        
        if (reportNm.contains("사업") && month == 12) {
            return new QuarterInfo(year, 4);
        } else if (reportNm.contains("분기") && month == 3 && !reportNm.contains("반기")) {
            return new QuarterInfo(year, 1);
        } else if (reportNm.contains("반기") && month == 6) {
            return new QuarterInfo(year, 2);
        } else if (reportNm.contains("분기") && month == 9 && !reportNm.contains("반기")) {
            return new QuarterInfo(year, 3);
        }

        return null;
    }

    /**
     * 사업연도와 분기 정보를 담는 내부 클래스
     */
    private static class QuarterInfo {
        final int year;
        final int quarter;

        QuarterInfo(int year, int quarter) {
            this.year = year;
            this.quarter = quarter;
        }
    }
}
