package aib.trademate.domain.statements.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinancialStatementRequestDto {
    private String crno; // 법인등록번호
    private String bizYear; // 사업연도
}
