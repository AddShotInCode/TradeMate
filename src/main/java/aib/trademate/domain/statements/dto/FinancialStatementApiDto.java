package aib.trademate.domain.statements.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancialStatementApiDto {
    private Response response;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Header header;
        private Body body;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Header {
        private String resultCode;
        private String resultMsg;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Body {
        private Integer numOfRows;
        private Integer pageNo;
        private Integer totalCount;
        private Items items;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Items {
        private List<Item> item;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Item {
        private String basDt;           // 기준일자
        private String bizYear;         // 사업연도
        private String crno;            // 법인등록번호
        private String curCd;           // 통화 코드
        private String fnclDcd;         // 재무제표구분코드
        private String fnclDcdNm;       // 재무제표구분코드명
        private String enpSaleAmt;      // 기업매출금액
        private String enpBzopPft;      // 기업영업이익
        private String enpCrtmNpf;      // 기업당기순이익
        private String enpTastAmt;      // 기업총자산금액
        private String enpTdbtAmt;      // 기업총부채금액
        private String enpTcptAmt;      // 기업총자본금액
        private String fnclDebtRto;     // 재무제표부채비율
    }
}
