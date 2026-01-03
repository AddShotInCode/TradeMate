package com.trademate.backend.review.domain;

import com.trademate.backend.global.common.BaseTimeEntity;
import com.trademate.backend.simulation.domain.TrainingSession;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "trade_reviews")
public class TradeReview extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private TrainingSession trainingSession;

    @Column(name = "final_score")
    private int finalScore; // 종합 점수 (0~100)

    @Column(name = "profit_rate")
    private double profitRate; // 최종 수익률 (%)

    @Column(name = "compliance_rate")
    private int complianceRate; // 원칙 준수율 (%)

    @Column(name = "feedback_message", columnDefinition = "TEXT")
    private String feedbackMessage; // 한줄 평

    @Builder
    public TradeReview(TrainingSession trainingSession, int finalScore, double profitRate, int complianceRate, String feedbackMessage) {
        this.trainingSession = trainingSession;
        this.finalScore = finalScore;
        this.profitRate = profitRate;
        this.complianceRate = complianceRate;
        this.feedbackMessage = feedbackMessage;
    }
}