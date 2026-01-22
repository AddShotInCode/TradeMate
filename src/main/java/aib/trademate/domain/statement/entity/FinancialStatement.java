package aib.trademate.domain.statement.entity;

import aib.trademate.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "statement",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_statement_rcept_no",
                columnNames = {"rcept_no"}
        ))
public class FinancialStatement extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stock_code", nullable = false, length = 6)
    private String stockCode;  // 종목코드 (예: 005930)

    @Column(name = "fiscal_year", nullable = false)
    private Integer fiscalYear;  // 사업연도 (예: 2024, 2025)

    @Column(name = "qtr", nullable = false)
    private Integer quarter;  // 분기 (1, 2, 3, 4)

    @Column(name = "rcept_no", nullable = false, length = 14)
    private String rceptNo;  // 보고서코드 (14자리)

    @Column(name = "rcept_dt", nullable = false, length = 8)
    private String rceptDt;  // 보고서업로드일 (yyyyMMdd)

    @Builder
    public FinancialStatement(String stockCode, Integer fiscalYear, Integer quarter,
                               String rceptNo, String rceptDt) {
        this.stockCode = stockCode;
        this.fiscalYear = fiscalYear;
        this.quarter = quarter;
        this.rceptNo = rceptNo;
        this.rceptDt = rceptDt;
    }

    /**
     * 보고서 정보 업데이트 (같은 종목/연도/분기에 새 보고서가 있을 경우)
     */
    public void updateReport(String rceptNo, String rceptDt) {
        this.rceptNo = rceptNo;
        this.rceptDt = rceptDt;
    }
}
