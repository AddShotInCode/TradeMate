package aib.trademate.domain.simulation.service;

import aib.trademate.domain.simulation.dto.TradeListResponse;
import aib.trademate.domain.simulation.dto.TradeResponse;
import aib.trademate.domain.simulation.entity.Simulation;
import aib.trademate.domain.simulation.repository.SimulationTradeRepository;
import aib.trademate.domain.stock.dto.StockPriceResponseDto;
import aib.trademate.domain.stock.service.StockService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;

/**
 * Gemini AI 분석용 프롬프트 구성기
 *
 * 차트 데이터, 거래 데이터, 시스템 프롬프트를 조합하여
 * Gemini에게 전달할 단일 프롬프트 문자열을 생성합니다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class GeminiPromptBuilder {

    private static final int CHART_DATA_PAGE_SIZE = 10000;

    private final StockService stockService;
    private final SimulationTradeRepository tradeRepository;
    private final ObjectMapper objectMapper;

    @Value("classpath:prompts/analyst-prompt.txt")
    private Resource promptResource;

    /**
     * AI 분석용 프롬프트를 구성합니다.
     *
     * @param simulation 시뮬레이션 엔티티
     * @return 완성된 프롬프트 문자열
     */
    public String buildPrompt(Simulation simulation) {
        try {
            String systemPrompt = loadSystemPrompt();
            String chartData = buildChartDataSection(simulation);
            String tradeData = buildTradeDataSection(simulation);

            StringBuilder prompt = new StringBuilder();
            prompt.append(systemPrompt).append("\n\n");
            prompt.append("=== 차트 데이터 (주가 일봉) ===\n");
            prompt.append(chartData).append("\n\n");
            prompt.append("=== 사용자 거래 내역 ===\n");
            prompt.append(tradeData);

            log.debug("Prompt built for simulation: id={}, length={}", 
                    simulation.getId(), prompt.length());
            return prompt.toString();

        } catch (Exception e) {
            log.error("Failed to build prompt for simulation: id={}, error={}", 
                    simulation.getId(), e.getMessage());
            throw new RuntimeException("Failed to build AI analysis prompt", e);
        }
    }

    /**
     * 시스템 프롬프트 파일을 로드합니다.
     */
    private String loadSystemPrompt() {
        try {
            return promptResource.getContentAsString(Objects.requireNonNull(StandardCharsets.UTF_8));
        } catch (Exception e) {
            log.error("Failed to load system prompt: {}", e.getMessage());
            throw new RuntimeException("Failed to load analyst prompt template", e);
        }
    }

    /**
     * 차트 데이터(주가) 섹션을 JSON 문자열로 구성합니다.
     * StockService를 내부 호출하여 시뮬레이션 기간의 전체 주가 데이터를 조회합니다.
     */
    private String buildChartDataSection(Simulation simulation) {
        try {
            StockPriceResponseDto.Response stockPrices = stockService.getStockPrices(
                    simulation.getStockCode(),
                    simulation.getStartDate(),
                    simulation.getEndDate(),
                    1,
                    CHART_DATA_PAGE_SIZE
            );
            return objectMapper.writeValueAsString(stockPrices);
        } catch (Exception e) {
            log.warn("Failed to get chart data for simulation: id={}, stock={}, error={}",
                    simulation.getId(), simulation.getStockCode(), e.getMessage());
            return "{\"error\": \"Chart data unavailable\"}";
        }
    }

    /**
     * 거래 데이터 섹션을 JSON 문자열로 구성합니다.
     */
    private String buildTradeDataSection(Simulation simulation) {
        try {
            List<TradeResponse> trades = tradeRepository
                    .findBySimulationIdOrderByTradeDateAsc(simulation.getId())
                    .stream()
                    .map(TradeResponse::from)
                    .toList();

            TradeListResponse tradeListResponse = TradeListResponse.of(trades);
            return objectMapper.writeValueAsString(tradeListResponse);
        } catch (Exception e) {
            log.warn("Failed to get trade data for simulation: id={}, error={}",
                    simulation.getId(), e.getMessage());
            return "{\"error\": \"Trade data unavailable\"}";
        }
    }
}
