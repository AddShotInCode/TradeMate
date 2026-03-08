package aib.trademate.domain.simulation.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * TradeType Enum ↔ DB 코드 변환기
 */
@Converter(autoApply = true)
public class TradeTypeConverter implements AttributeConverter<TradeType, String> {

    @Override
    public String convertToDatabaseColumn(TradeType tradeType) {
        if (tradeType == null) {
            return null;
        }
        return tradeType.getCode();
    }

    @Override
    public TradeType convertToEntityAttribute(String code) {
        if (code == null) {
            return null;
        }
        return TradeType.fromCode(code);
    }
}
