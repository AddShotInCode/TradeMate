package aib.trademate.domain.simulation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 보고서 매도 건별 점수 상세 엔티티
 *
 * 보고서 삭제 시 CASCADE로 함께 삭제됩니다.
 */
@Entity
@Table(name = "report_trade_score", indexes = {
        @Index(name = "idx_report_trade_score_report", columnList = "report_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ReportTradeScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false)
    @Setter(AccessLevel.PACKAGE)
    private SimulationReport report;

    @Column(nullable = false)
    private Integer sequence;

    @Column(name = "trade_date", nullable = false)
    private LocalDate tradeDate;

    @Column(name = "sell_price", nullable = false)
    private Integer sellPrice;

    @Column(name = "avg_price", nullable = false, precision = 20, scale = 8)
    private BigDecimal avgPrice;

    @Column(name = "target_price", nullable = false)
    private Integer targetPrice;

    @Column(name = "stop_loss", nullable = false)
    private Integer stopLoss;

    @Column(nullable = false)
    private Integer volume;

    @Column(nullable = false, precision = 20, scale = 2)
    private BigDecimal profit;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal roi;

    @Column(name = "result_score", nullable = false, precision = 10, scale = 2)
    private BigDecimal resultScore;

    @Column(name = "compliance_score", nullable = false, precision = 10, scale = 2)
    private BigDecimal complianceScore;

    @Column(name = "trade_score", nullable = false, precision = 10, scale = 2)
    private BigDecimal tradeScore;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
