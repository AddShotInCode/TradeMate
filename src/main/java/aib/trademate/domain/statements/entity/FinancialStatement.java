package aib.trademate.domain.statements.entity;

import aib.trademate.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "financial_statement")
public class FinancialStatement extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 13)
    private String crno;

    @Column(nullable = false, length = 4)
    private String bizYear;

    @Column(nullable = false)
    private LocalDate basDt;

    @Column(length = 3)
    private String curCd;

    @Column(length = 50)
    private String fnclDcd;

    @Column(length = 100)
    private String fnclDcdNm;

    @Column(precision = 20, scale = 2)
    private BigDecimal enpSaleAmt;

    @Column(precision = 20, scale = 2)
    private BigDecimal enpBzopPft;

    @Column(precision = 20, scale = 2)
    private BigDecimal enpCrtmNpf;

    @Column(precision = 20, scale = 2)
    private BigDecimal enpTastAmt;

    @Column(precision = 20, scale = 2)
    private BigDecimal enpTdbtAmt;

    @Column(precision = 20, scale = 2)
    private BigDecimal enpTcptAmt;

    @Column(precision = 10, scale = 5)
    private BigDecimal fnclDebtRto;

    @Builder
    public FinancialStatement(String crno, String bizYear, String basDt, String curCd, String fnclDcd,
                              String fnclDcdNm, String enpSaleAmt, String enpBzopPft, String enpCrtmNpf,
                              String enpTastAmt, String enpTdbtAmt, String enpTcptAmt, String fnclDebtRto) {
        this.crno = crno;
        this.bizYear = bizYear;
        this.basDt = LocalDate.parse(basDt, java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        this.curCd = curCd;
        this.fnclDcd = fnclDcd;
        this.fnclDcdNm = fnclDcdNm;
        this.enpSaleAmt = (enpSaleAmt != null && !enpSaleAmt.isEmpty()) ? new BigDecimal(enpSaleAmt) : null;
        this.enpBzopPft = (enpBzopPft != null && !enpBzopPft.isEmpty()) ? new BigDecimal(enpBzopPft) : null;
        this.enpCrtmNpf = (enpCrtmNpf != null && !enpCrtmNpf.isEmpty()) ? new BigDecimal(enpCrtmNpf) : null;
        this.enpTastAmt = (enpTastAmt != null && !enpTastAmt.isEmpty()) ? new BigDecimal(enpTastAmt) : null;
        this.enpTdbtAmt = (enpTdbtAmt != null && !enpTdbtAmt.isEmpty()) ? new BigDecimal(enpTdbtAmt) : null;
        this.enpTcptAmt = (enpTcptAmt != null && !enpTcptAmt.isEmpty()) ? new BigDecimal(enpTcptAmt) : null;
        this.fnclDebtRto = (fnclDebtRto != null && !fnclDebtRto.isEmpty()) ? new BigDecimal(fnclDebtRto) : null;
    }
}
