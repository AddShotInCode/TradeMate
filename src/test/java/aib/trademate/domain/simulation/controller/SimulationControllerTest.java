package aib.trademate.domain.simulation.controller;

import aib.trademate.domain.simulation.dto.*;
import aib.trademate.domain.simulation.service.SimulationService;
import aib.trademate.global.exception.BusinessException;
import aib.trademate.global.exception.ErrorCode;
import aib.trademate.global.exception.GlobalExceptionHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * SimulationController 단위 테스트
 * 
 * MockMvc standalone 모드로 컨트롤러 로직만 테스트합니다.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("SimulationController 테스트")
@SuppressWarnings("null")
class SimulationControllerTest {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @Mock
    private SimulationService simulationService;

    @InjectMocks
    private SimulationController simulationController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(simulationController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setCustomArgumentResolvers(new TestUserDetailsArgumentResolver())
                .build();

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Nested
    @DisplayName("시뮬레이션 생성 API 테스트")
    class CreateSimulationTest {

        @Test
        @DisplayName("시뮬레이션 생성이 성공한다")
        void createSimulationSuccess() throws Exception {
            // given
            CreateSimulationResponse response = new CreateSimulationResponse(1L, "Simulation created successfully");
            given(simulationService.createSimulation(eq("test@test.com"), eq("005930"), any(LocalDate.class)))
                    .willReturn(response);

            // when & then
            mockMvc.perform(post("/api/simulation")
                            .param("code", "005930")
                            .param("start", "2024-01-01"))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.id").value(1))
                    .andExpect(jsonPath("$.message").value("Simulation created successfully"));

            verify(simulationService).createSimulation(eq("test@test.com"), eq("005930"), any(LocalDate.class));
        }

        @Test
        @DisplayName("종목 코드가 없으면 400 에러가 발생한다")
        void createSimulationFailsWithoutCode() throws Exception {
            // when & then
            mockMvc.perform(post("/api/simulation")
                            .param("start", "2024-01-01"))
                    .andExpect(status().isBadRequest());

            verify(simulationService, never()).createSimulation(anyString(), anyString(), any(LocalDate.class));
        }
    }

    @Nested
    @DisplayName("시뮬레이션 목록 조회 API 테스트")
    class GetMySimulationsTest {

        @Test
        @DisplayName("내 시뮬레이션 목록을 조회한다")
        void getMySimulationsSuccess() throws Exception {
            // given
            List<SimulationResponse> simulations = List.of(
                    new SimulationResponse(1L, "005930", LocalDate.of(2024, 1, 1), null, null),
                    new SimulationResponse(2L, "035720", LocalDate.of(2024, 2, 1), LocalDate.of(2024, 3, 1), null)
            );
            SimulationListResponse response = SimulationListResponse.of(simulations);
            given(simulationService.getMySimulations("test@test.com")).willReturn(response);

            // when & then
            mockMvc.perform(get("/api/simulation"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.simulations").isArray())
                    .andExpect(jsonPath("$.simulations.length()").value(2))
                    .andExpect(jsonPath("$.simulations[0].stockCode").value("005930"));
        }
    }

    @Nested
    @DisplayName("시뮬레이션 삭제 API 테스트")
    class DeleteSimulationTest {

        @Test
        @DisplayName("시뮬레이션 삭제가 성공한다")
        void deleteSimulationSuccess() throws Exception {
            // given
            doNothing().when(simulationService).deleteSimulation("test@test.com", 1L);

            // when & then
            mockMvc.perform(delete("/api/simulation/{id}", 1L))
                    .andExpect(status().isNoContent());

            verify(simulationService).deleteSimulation("test@test.com", 1L);
        }

        @Test
        @DisplayName("존재하지 않는 시뮬레이션 삭제 시 404 에러가 발생한다")
        void deleteSimulationFailsWhenNotFound() throws Exception {
            // given
            doThrow(new BusinessException(ErrorCode.SIMULATION_NOT_FOUND))
                    .when(simulationService).deleteSimulation("test@test.com", 999L);

            // when & then
            mockMvc.perform(delete("/api/simulation/{id}", 999L))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.code").value("SIMULATION-001"));
        }
    }

    @Nested
    @DisplayName("거래 추가 API 테스트")
    class AddTradeTest {

        @Test
        @DisplayName("거래 추가가 성공한다")
        void addTradeSuccess() throws Exception {
            // given
            AddTradeRequest request = new AddTradeRequest(
                    LocalDate.of(2024, 1, 15),
                    1000,
                    70000,
                    75000,
                    65000,
                    "B",
                    10,
                    "첫 매수"
            );

            doNothing().when(simulationService).addTrade(eq("test@test.com"), eq(1L), any(AddTradeRequest.class));

            // when & then
            mockMvc.perform(post("/api/simulation/{id}/data", 1L)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.message").value("Trade added successfully"));

            verify(simulationService).addTrade(eq("test@test.com"), eq(1L), any(AddTradeRequest.class));
        }
    }

    @Nested
    @DisplayName("거래 목록 조회 API 테스트")
    class GetTradesTest {

        @Test
        @DisplayName("거래 목록을 조회한다")
        void getTradesSuccess() throws Exception {
            // given
            List<TradeResponse> trades = List.of(
                    new TradeResponse(LocalDate.of(2024, 1, 15), 1000, 70000, 75000, 65000, "B", 10, "매수")
            );
            TradeListResponse response = TradeListResponse.of(trades);
            given(simulationService.getTrades("test@test.com", 1L)).willReturn(response);

            // when & then
            mockMvc.perform(get("/api/simulation/{id}/data", 1L))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.trades").isArray())
                    .andExpect(jsonPath("$.trades.length()").value(1));
        }
    }

    @Nested
    @DisplayName("보고서 생성 API 테스트")
    class GenerateReportTest {

        @Test
        @DisplayName("보고서 생성이 성공한다")
        void generateReportSuccess() throws Exception {
            // given
            doNothing().when(simulationService).generateReport("test@test.com", 1L);

            // when & then
            mockMvc.perform(post("/api/simulation/{id}/report", 1L))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("Report generated successfully"));

            verify(simulationService).generateReport("test@test.com", 1L);
        }

        @Test
        @DisplayName("종료되지 않은 시뮬레이션의 보고서 생성 시 400 에러가 발생한다")
        void generateReportFailsWhenNotEnded() throws Exception {
            // given
            doThrow(new BusinessException(ErrorCode.SIMULATION_NOT_ENDED))
                    .when(simulationService).generateReport("test@test.com", 1L);

            // when & then
            mockMvc.perform(post("/api/simulation/{id}/report", 1L))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.code").value("SIMULATION-002"));
        }

        @Test
        @DisplayName("이미 보고서가 존재하면 409 에러가 발생한다")
        void generateReportFailsWhenAlreadyExists() throws Exception {
            // given
            doThrow(new BusinessException(ErrorCode.REPORT_ALREADY_EXISTS))
                    .when(simulationService).generateReport("test@test.com", 1L);

            // when & then
            mockMvc.perform(post("/api/simulation/{id}/report", 1L))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.code").value("REPORT-002"));
        }
    }

    @Nested
    @DisplayName("시뮬레이션 보고서 조회 API 테스트")
    class GetReportTest {

        @Test
        @DisplayName("보고서를 조회한다")
        void getReportSuccess() throws Exception {
            // given
            ReportSummary summary = ReportSummary.builder()
                    .simulationId(1L)
                    .stockCode("005930")
                    .startDate(LocalDate.of(2024, 1, 1))
                    .endDate(LocalDate.of(2024, 3, 1))
                    .finalAvgPrice(BigDecimal.valueOf(70000))
                    .totalInvestment(BigDecimal.valueOf(700000))
                    .totalRealizedProfit(BigDecimal.valueOf(50000))
                    .totalRoi(BigDecimal.valueOf(7.14))
                    .totalScore(BigDecimal.valueOf(85))
                    .aiScore(78)
                    .aiComment("AI 분석 코멘트")
                    .build();

            SimulationReportResponse response = new SimulationReportResponse(summary, List.of(), 10, 2);
            given(simulationService.getReport("test@test.com", 1L)).willReturn(response);

            // when & then
            mockMvc.perform(get("/api/simulation/{id}/report", 1L))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.summary.stockCode").value("005930"))
                    .andExpect(jsonPath("$.summary.totalScore").value(85))
                    .andExpect(jsonPath("$.summary.aiScore").value(78))
                    .andExpect(jsonPath("$.summary.aiComment").value("AI 분석 코멘트"));
        }

        @Test
        @DisplayName("보고서가 존재하지 않으면 404 에러가 발생한다")
        void getReportFailsWhenNotFound() throws Exception {
            // given
            given(simulationService.getReport("test@test.com", 1L))
                    .willThrow(new BusinessException(ErrorCode.REPORT_NOT_FOUND));

            // when & then
            mockMvc.perform(get("/api/simulation/{id}/report", 1L))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.code").value("REPORT-001"));
        }
    }
}
