package aib.trademate.domain.simulation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 시뮬레이션 분석 보고서 엔티티
 *
 * 하나의 시뮬레이션에 대해 하나의 보고서만 존재합니다 (1:1).
 * 시뮬레이션 삭제 시 CASCADE로 함께 삭제됩니다.
 */
@Entity
@Table(name = "simulation_report")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class SimulationReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "simulation_id", nullable = false, unique = true)
    private Long simulationId;

    @Column(name = "final_avg_price", nullable = false, precision = 20, scale = 8)
    private BigDecimal finalAvgPrice;

    @Column(name = "total_investment", nullable = false, precision = 20, scale = 2)
    private BigDecimal totalInvestment;

    @Column(name = "total_realized_profit", nullable = false, precision = 20, scale = 2)
    private BigDecimal totalRealizedProfit;

    @Column(name = "total_roi", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalRoi;

    @Column(name = "total_score", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalScore;

    @Column(name = "total_sell_volume", nullable = false)
    private Integer totalSellVolume;

    @Column(name = "total_trade_count", nullable = false)
    private Integer totalTradeCount;

    @Setter
    @Column(name = "ai_score")
    private Integer aiScore;

    @Setter
    @Column(name = "ai_comment", columnDefinition = "TEXT")
    private String aiComment;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ReportTradeScore> tradeScores = new ArrayList<>();

    /**
     * 거래 점수 상세 추가
     */
    public void addTradeScore(ReportTradeScore tradeScore) {
        tradeScores.add(tradeScore);
        tradeScore.setReport(this);
    }
}
