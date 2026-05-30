package com.fatogeral.backend.controller;

import com.fatogeral.backend.dto.TrendResponse;
import com.fatogeral.backend.service.AnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trends")
public class TrendsController {

    private final AnalysisService analysisService;

    public TrendsController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @GetMapping
    public ResponseEntity<List<TrendResponse>> getTrends() {
        List<TrendResponse> response = analysisService.getTrends();
        return ResponseEntity.ok(response);
    }
}