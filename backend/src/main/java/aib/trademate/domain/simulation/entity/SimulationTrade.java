package aib.trademate.domain.simulation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 시뮬레이션 거래 데이터 엔티티
 */
@Entity
@Table(name = "simulation_trade", indexes = {
        @Index(name = "idx_trade_simulation", columnList = "simulation_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class SimulationTrade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "simulation_id", nullable = false)
    @Setter(AccessLevel.PACKAGE)
    private Simulation simulation;

    @Column(name = "trade_date", nullable = false)
    private LocalDate tradeDate;

    @Column(nullable = false)
    private Integer balance;

    @Column(nullable = false)
    private Integer price;

    @Column(name = "upper_limit", nullable = false)
    private Integer upperLimit;

    @Column(name = "lower_limit", nullable = false)
    private Integer lowerLimit;

    @Column(name = "trade_type", nullable = false, length = 1)
    @Convert(converter = TradeTypeConverter.class)
    private TradeType tradeType;

    @Column(nullable = false)
    private Integer volume;

    @Column(length = 100)
    private String comment;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
