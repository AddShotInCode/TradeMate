package aib.trademate.domain.statement.repository;

import aib.trademate.domain.statement.entity.FinancialStatement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FinancialStatementRepository extends JpaRepository<FinancialStatement, Long> {

    /**
     * 종목코드, 사업연도, 분기로 재무제표 목록 조회 (업로드일 내림차순)
     */
    List<FinancialStatement> findByStockCodeAndFiscalYearAndQuarterOrderByRceptDtDesc(
            String stockCode, Integer fiscalYear, Integer quarter);

    /**
     * 보고서코드로 존재 여부 확인
     */
    boolean existsByRceptNo(String rceptNo);

    /**
     * 종목코드로 해당 종목의 모든 재무제표 조회
     */
    List<FinancialStatement> findByStockCode(String stockCode);

    /**
     * 특정 사업연도 이전의 오래된 재무제표 삭제
     */
    @Modifying
    @Query("DELETE FROM FinancialStatement f WHERE f.fiscalYear < :cutoffYear")
    int deleteByFiscalYearBefore(@Param("cutoffYear") Integer cutoffYear);

    /**
     * 종목코드 + 사업연도로 해당 연도 재무제표 조회
     */
    List<FinancialStatement> findByStockCodeAndFiscalYear(String stockCode, Integer fiscalYear);

    /**
     * 특정 종목의 재무제표 존재 여부 확인
     */
    boolean existsByStockCode(String stockCode);
}
