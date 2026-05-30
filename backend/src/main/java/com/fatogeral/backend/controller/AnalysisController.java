package com.fatogeral.backend.controller;

import com.fatogeral.backend.dto.AnalysisRequest;
import com.fatogeral.backend.dto.AnalysisResponse;
import com.fatogeral.backend.service.AnalysisService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/analysis")
public class AnalysisController {

    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping
    public ResponseEntity<AnalysisResponse> createAnalysis(
            @Valid @RequestBody AnalysisRequest request,
            @AuthenticationPrincipal String userEmail) {

        AnalysisResponse response = analysisService.createAnalysis(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnalysisResponse> getById(
            @PathVariable UUID id,
            @AuthenticationPrincipal String userEmail) {

        AnalysisResponse response = analysisService.getById(id, userEmail);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<AnalysisResponse>> getHistory(
            @AuthenticationPrincipal String userEmail) {

        List<AnalysisResponse> response = analysisService.getHistory(userEmail);
        return ResponseEntity.ok(response);
    }
}