package aib.trademate.domain.stock.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

public class StockApiDto {

    // 최상위 래퍼 - API 응답의 "response" 필드를 매핑
    @Getter
    @ToString
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Response {
        private ResponseBody response;
    }

    // 실제 response 내부 구조
    @Getter
    @ToString
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ResponseBody {
        private Body body;
    }

    @Getter
    @ToString
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Body {
        private Items items;
        private int totalCount; // 전체 결과 수 
    }

    @Getter
    @ToString
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Items {
        private List<Item> item;
    }

    @Getter
    @ToString
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Item {
        // API 명세서의 필드명(camelCase)과 매핑 
        
        @JsonProperty("basDt")
        private String basDt;       // 기준일자 (예: 20250113)

        @JsonProperty("srtnCd")
        private String srtnCd;      // 종목코드 (예: 005930)

        @JsonProperty("itmsNm")
        private String itmsNm;      // 종목명

        @JsonProperty("mrktCtg")
        private String mrktCtg;     // 시장구분 (KOSPI, KOSDAQ)

        @JsonProperty("mkp")
        private String mkp;         // 시가 (API가 숫자를 문자열로 줄 수 있어 String으로 받음)

        @JsonProperty("hipr")
        private String hipr;        // 고가

        @JsonProperty("lopr")
        private String lopr;        // 저가

        @JsonProperty("clpr")
        private String clpr;        // 종가

        @JsonProperty("trqu")
        private String trqu;        // 거래량

        @JsonProperty("vs")
        private String vs;          // 대비 (전일 대비 등락)

        @JsonProperty("fltRt")
        private String fltRt;       // 등락률
    }
}