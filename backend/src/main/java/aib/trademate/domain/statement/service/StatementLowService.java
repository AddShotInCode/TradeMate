package aib.trademate.domain.statement.service;

import aib.trademate.domain.statement.entity.FinancialStatement;
import aib.trademate.domain.statement.repository.FinancialStatementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

/**
 * 재무제표 DB 접근 서비스 (Low-level)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StatementLowService {

    private final FinancialStatementRepository statementRepository;

    /**
     * 재무제표 저장
     */
    @Transactional
    public FinancialStatement save(FinancialStatement statement) {
        return statementRepository.save(Objects.requireNonNull(statement));
    }

    /**
     * 재무제표 일괄 저장
     */
    @Transactional
    public List<FinancialStatement> saveAll(List<FinancialStatement> statements) {
        return statementRepository.saveAll(Objects.requireNonNull(statements));
    }

    /**
     * 재무제표 일괄 저장 (새로운 트랜잭션으로 분리)
     * 각 종목별로 독립적인 트랜잭션으로 처리하여 한 종목 실패 시 다른 종목에 영향 없음
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<FinancialStatement> saveAllInNewTransaction(List<FinancialStatement> statements) {
        return statementRepository.saveAll(Objects.requireNonNull(statements));
    }

    /**
     * 재무제표 저장 (새로운 트랜잭션으로 분리)
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public FinancialStatement saveInNewTransaction(FinancialStatement statement) {
        return statementRepository.save(Objects.requireNonNull(statement));
    }

    /**
     * 종목코드, 사업연도, 분기로 재무제표 목록 조회 (업로드일 내림차순)
     */
    @Transactional(readOnly = true)
    public List<FinancialStatement> findByStockCodeAndYearAndQuarter(
            String stockCode, Integer fiscalYear, Integer quarter) {
        return statementRepository.findByStockCodeAndFiscalYearAndQuarterOrderByRceptDtDesc(
                stockCode, fiscalYear, quarter);
    }

    /**
     * 보고서코드로 존재 여부 확인
     */
    @Transactional(readOnly = true)
    public boolean existsByRceptNo(String rceptNo) {
        return statementRepository.existsByRceptNo(rceptNo);
    }

    /**
     * 종목코드로 해당 종목의 모든 재무제표 조회
     */
    @Transactional(readOnly = true)
    public List<FinancialStatement> findByStockCode(String stockCode) {
        return statementRepository.findByStockCode(stockCode);
    }

    /**
     * 특정 연도 이전의 오래된 재무제표 삭제
     */
    @Transactional
    public int deleteOldStatements(Integer cutoffYear) {
        int deleted = statementRepository.deleteByFiscalYearBefore(cutoffYear);
        log.info("[Statement] Deleted {} old statements before year {}", deleted, cutoffYear);
        return deleted;
    }

    /**
     * 재무제표 존재 여부 확인
     */
    @Transactional(readOnly = true)
    public boolean existsByStockCode(String stockCode) {
        return statementRepository.existsByStockCode(stockCode);
    }
}
