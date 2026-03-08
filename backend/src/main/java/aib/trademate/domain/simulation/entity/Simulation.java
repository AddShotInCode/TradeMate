package aib.trademate.domain.simulation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 시뮬레이션 엔티티
 */
@Entity
@Table(name = "simulation", indexes = {
        @Index(name = "idx_simulation_member", columnList = "member_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Simulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "member_id", nullable = false)
    private Long memberId;

    @Column(name = "stock_code", nullable = false, length = 20)
    private String stockCode;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "simulation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SimulationTrade> trades = new ArrayList<>();

    /**
     * 종료일 업데이트
     */
    public void updateEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    /**
     * 거래 데이터 추가
     */
    public void addTrade(SimulationTrade trade) {
        trades.add(trade);
        trade.setSimulation(this);
    }
}
