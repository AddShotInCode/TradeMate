package aib.trademate.domain.simulation.service;

import aib.trademate.domain.member.entity.Member;
import aib.trademate.domain.member.repository.MemberRepository;
import aib.trademate.domain.simulation.dto.*;
import aib.trademate.domain.simulation.entity.Simulation;
import aib.trademate.domain.simulation.entity.SimulationTrade;
import aib.trademate.domain.simulation.entity.TradeType;
import aib.trademate.domain.simulation.repository.SimulationRepository;
import aib.trademate.domain.simulation.repository.SimulationTradeRepository;
import aib.trademate.global.exception.BusinessException;
import aib.trademate.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * 시뮬레이션 비즈니스 로직 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@SuppressWarnings("null") // JPA save() 반환값 및 Builder 객체는 null이 아님
public class SimulationService {

    private final SimulationRepository simulationRepository;
    private final SimulationTradeRepository tradeRepository;
    private final MemberRepository memberRepository;
    private final SimulationScoreCalculator scoreCalculator;

    /**
     * 시뮬레이션 생성
     */
    @Transactional
    public CreateSimulationResponse createSimulation(String email, String stockCode, LocalDate startDate) {
        Member member = findMemberByEmail(email);

        Simulation simulation = Simulation.builder()
                .memberId(member.getId())
                .stockCode(stockCode)
                .startDate(startDate)
                .build();

        Simulation saved = simulationRepository.save(simulation);
        log.info("Simulation created: id={}, member={}, stockCode={}", saved.getId(), email, stockCode);

        return CreateSimulationResponse.of(saved.getId());
    }

    /**
     * 시뮬레이션 종료일 업데이트
     */
    @Transactional
    public void updateEndDate(String email, Long simulationId, LocalDate endDate) {
        Simulation simulation = findSimulationWithOwnerCheck(email, simulationId);
        simulation.updateEndDate(endDate);
        log.info("Simulation end date updated: id={}, endDate={}", simulationId, endDate);
    }

    /**
     * 내 시뮬레이션 목록 조회
     */
    public SimulationListResponse getMySimulations(String email) {
        Member member = findMemberByEmail(email);

        List<SimulationResponse> simulations = simulationRepository.findByMemberId(member.getId())
                .stream()
                .map(SimulationResponse::from)
                .toList();

        log.debug("Retrieved {} simulations for member: {}", simulations.size(), email);
        return SimulationListResponse.of(simulations);
    }

    /**
     * 시뮬레이션 삭제
     */
    @Transactional
    public void deleteSimulation(String email, Long simulationId) {
        Simulation simulation = findSimulationWithOwnerCheck(email, simulationId);
        simulationRepository.delete(simulation);
        log.info("Simulation deleted: id={}, member={}", simulationId, email);
    }

    /**
     * 거래 데이터 추가
     */
    @Transactional
    public void addTrade(String email, Long simulationId, AddTradeRequest request) {
        Simulation simulation = findSimulationWithOwnerCheck(email, simulationId);

        TradeType tradeType;
        try {
            tradeType = TradeType.fromCode(request.type());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE, "Invalid trade type: " + request.type());
        }

        SimulationTrade trade = SimulationTrade.builder()
                .simulation(simulation)
                .tradeDate(request.timestamp())
                .balance(request.balance())
                .price(request.price())
                .upperLimit(request.upper())
                .lowerLimit(request.lower())
                .tradeType(tradeType)
                .volume(request.volume())
                .comment(request.comment())
                .build();

        tradeRepository.save(trade);
        log.info("Trade added to simulation: simulationId={}, tradeDate={}", simulationId, request.timestamp());
    }

    /**
     * 거래 데이터 목록 조회
     */
    public TradeListResponse getTrades(String email, Long simulationId) {
        // 소유권 확인
        findSimulationWithOwnerCheck(email, simulationId);

        List<TradeResponse> trades = tradeRepository.findBySimulationIdOrderByTradeDateAsc(simulationId)
                .stream()
                .map(TradeResponse::from)
                .toList();

        log.debug("Retrieved {} trades for simulation: {}", trades.size(), simulationId);
        return TradeListResponse.of(trades);
    }

    /**
     * 시뮬레이션 결과 분석 보고서 조회
     */
    public SimulationReportResponse getReport(String email, Long simulationId) {
        Simulation simulation = findSimulationWithOwnerCheck(email, simulationId);

        // 종료된 시뮬레이션만 분석 가능
        if (simulation.getEndDate() == null) {
            throw new BusinessException(ErrorCode.SIMULATION_NOT_ENDED,
                    "Simulation must be ended before generating report");
        }

        // 거래 데이터 조회 (시간순)
        List<SimulationTrade> trades = tradeRepository.findBySimulationIdOrderByTradeDateAsc(simulationId);

        // 점수 계산 및 보고서 생성
        SimulationReportResponse report = scoreCalculator.calculateReport(simulation, trades);
        
        log.info("Report generated for simulation: id={}, totalScore={}", 
                simulationId, report.summary().totalScore());
        
        return report;
    }

    /**
     * 이메일로 회원 조회
     */
    private Member findMemberByEmail(String email) {
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Member not found"));
    }

    /**
     * 시뮬레이션 조회 + 소유권 확인
     */
    private Simulation findSimulationWithOwnerCheck(String email, Long simulationId) {
        Member member = findMemberByEmail(email);

        Simulation simulation = simulationRepository.findById(simulationId)
                .orElseThrow(() -> new BusinessException(ErrorCode.SIMULATION_NOT_FOUND,
                        "Simulation not found: " + simulationId));

        if (!simulation.getMemberId().equals(member.getId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED,
                    "You don't have permission to access this simulation");
        }

        return simulation;
    }
}
