package com.trademate.backend.report.controller;

import com.trademate.backend.report.dto.ReportResponseDto;
import com.trademate.backend.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    // 상세 리포트 조회
    // GET /api/reports/{sessionId}
    @GetMapping("/{sessionId}")
    public ResponseEntity<ReportResponseDto> getReport(@PathVariable Long sessionId) {
        ReportResponseDto report = reportService.getReport(sessionId);
        return ResponseEntity.ok(report);
    }
}