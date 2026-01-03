package com.trademate.backend.simulation.repository;

import com.trademate.backend.simulation.domain.TrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainingSessionRepository extends JpaRepository<TrainingSession, Long> {
    // 추후 '사용자의 진행 중인 세션 조회' 등이 필요하면 여기에 추가
}