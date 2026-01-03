package com.trademate.backend.review.repository;

import com.trademate.backend.review.domain.TradeReview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // Import 확인

public interface TradeReviewRepository extends JpaRepository<TradeReview, Long> {
    // [추가] 세션 ID로 리뷰 조회
    Optional<TradeReview> findByTrainingSessionId(Long sessionId);
}