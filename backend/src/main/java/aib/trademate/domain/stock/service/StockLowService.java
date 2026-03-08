package aib.trademate.domain.stock.service;

import aib.trademate.domain.stock.entity.DailyPrice;
import aib.trademate.domain.stock.entity.Stock;
import aib.trademate.domain.stock.repository.DailyPriceRepository;
import aib.trademate.domain.stock.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StockLowService {

    private final StockRepository stockRepository;
    private final DailyPriceRepository dailyPriceRepository;

    // 종목 저장
    @Transactional
    public Stock saveStock(Stock stock) {
        return stockRepository.save(Objects.requireNonNull(stock));
    }

    // 종목 코드로 조회 (Optional 반환)
    @Transactional(readOnly = true)
    public Optional<Stock> findStockByCode(String code) {
        return stockRepository.findByCode(code);
    }

    // 모든 종목 조회
    @Transactional(readOnly = true)
    public List<Stock> findAllStocks() {
        return stockRepository.findAll();
    }

    // 시세 데이터 대량 저장 (1년치 데이터 저장용)
    @Transactional
    public void saveDailyPrices(List<DailyPrice> dailyPrices) {
        dailyPriceRepository.saveAll(Objects.requireNonNull(dailyPrices));
    }

    // 오래된 데이터 삭제 (1년 지난 데이터)
    @Transactional
    public void deleteOldDailyPrices(LocalDate standardDate) {
        dailyPriceRepository.deleteByDateBefore(standardDate);
    }

    // 특정 종목의 기간별 가격 데이터 조회 (페이징)
    @Transactional(readOnly = true)
    public Page<DailyPrice> findDailyPricesByStockCodeAndDateRange(
            String stockCode,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    ) {
        return dailyPriceRepository.findByStockCodeAndDateBetweenOrderByDateAsc(
                stockCode, startDate, endDate, pageable
        );
    }
}