package aib.trademate.domain.stock.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "stock")
public class StockProperties {

    /**
     * 관리 대상 종목 리스트
     * application.yml의 stock.target-stocks에서 읽어옴
     */
    private List<StockInfo> targetStocks = new ArrayList<>();

    /**
     * 종목 정보 (종목코드 + DART 고유번호)
     */
    @Getter
    @Setter
    public static class StockInfo {
        private String code;      // 종목코드 (6자리)
        private String corpCode;  // DART 고유번호 (8자리)
    }

    /**
     * 종목코드 리스트만 반환 (기존 호환성 유지)
     */
    public List<String> getTargetCodes() {
        return targetStocks.stream()
                .map(StockInfo::getCode)
                .collect(Collectors.toList());
    }

    /**
     * 종목코드로 고유번호 찾기
     */
    public String getCorpCodeByStockCode(String stockCode) {
        return targetStocks.stream()
                .filter(s -> s.getCode().equals(stockCode))
                .map(StockInfo::getCorpCode)
                .findFirst()
                .orElse(null);
    }
}
