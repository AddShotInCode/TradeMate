package com.trademate.backend.candle.dto.kis;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record KisDailyPriceResponseDto(
        @JsonProperty("output1") Output1 output1,       // 대표 정보 (현재가 등)
        @JsonProperty("output2") List<Output2> output2, // 일별 데이터 리스트 (핵심)
        @JsonProperty("rt_cd") String returnCode,       // 성공 실패 여부
        @JsonProperty("msg1") String message
) {
    // 내부 클래스 (일별 데이터 상세)
    public record Output2(
            @JsonProperty("stck_bsop_date") String date, // 날짜 (YYYYMMDD)
            @JsonProperty("stck_oprc") String open,      // 시가
            @JsonProperty("stck_clpr") String close,     // 종가
            @JsonProperty("stck_hgpr") String high,      // 고가
            @JsonProperty("stck_lwpr") String low,       // 저가
            @JsonProperty("acml_vol") String volume      // 거래량
    ) {}

    // 필요시 Output1도 정의 가능하나 시뮬레이션엔 Output2만 있어도 충분
    public record Output1(
            @JsonProperty("stck_prpr") String currentPrice
    ) {}
}