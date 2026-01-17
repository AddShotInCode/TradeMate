package aib.trademate.domain.statements.dto;

import aib.trademate.domain.statements.entity.FinancialStatement;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime; // Import LocalDateTime

@Data
@Builder
public class FinancialStatementResponseDto {
    private Long id;
    private String crno;
    private String bizYear;
    private LocalDate basDt;
    private String curCd;
    private String fnclDcd;
    private String fnclDcdNm;
    private BigDecimal enpSaleAmt;
    private BigDecimal enpBzopPft;
    private BigDecimal enpCrtmNpf;
    private BigDecimal enpTastAmt;
    private BigDecimal enpTdbtAmt;
    private BigDecimal enpTcptAmt;
    private BigDecimal fnclDebtRto;
    private LocalDateTime createdAt; // Change to LocalDateTime
    private LocalDateTime updatedAt; // Change to LocalDateTime

    public static FinancialStatementResponseDto from(FinancialStatement entity) {
        return FinancialStatementResponseDto.builder()
                .id(entity.getId())
                .crno(entity.getCrno())
                .bizYear(entity.getBizYear())
                .basDt(entity.getBasDt())
                .curCd(entity.getCurCd())
                .fnclDcd(entity.getFnclDcd())
                .fnclDcdNm(entity.getFnclDcdNm())
                .enpSaleAmt(entity.getEnpSaleAmt())
                .enpBzopPft(entity.getEnpBzopPft())
                .enpCrtmNpf(entity.getEnpCrtmNpf())
                .enpTastAmt(entity.getEnpTastAmt())
                .enpTdbtAmt(entity.getEnpTdbtAmt())
                .enpTcptAmt(entity.getEnpTcptAmt())
                .fnclDebtRto(entity.getFnclDebtRto())
                .createdAt(entity.getCreatedAt()) // Use LocalDateTime directly
                .updatedAt(entity.getUpdatedAt()) // Use LocalDateTime directly
                .build();
    }
}
