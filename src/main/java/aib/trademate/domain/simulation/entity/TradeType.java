package aib.trademate.domain.simulation.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * 거래 종류 Enum
 */
@Getter
@RequiredArgsConstructor
public enum TradeType {
    
    BUY("B", "매수"),
    SELL("S", "매도");

    private final String code;
    private final String description;

    /**
     * 코드로 TradeType 찾기
     */
    public static TradeType fromCode(String code) {
        for (TradeType type : values()) {
            if (type.code.equalsIgnoreCase(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown trade type code: " + code);
    }
}
