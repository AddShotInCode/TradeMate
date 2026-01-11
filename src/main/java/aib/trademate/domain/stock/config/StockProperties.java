package aib.trademate.domain.stock.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "stock")
public class StockProperties {

    /**
     * 관리 대상 종목 코드 리스트
     * application.yml의 stock.target-codes에서 읽어옴
     */
    private List<String> targetCodes = new ArrayList<>();
}
