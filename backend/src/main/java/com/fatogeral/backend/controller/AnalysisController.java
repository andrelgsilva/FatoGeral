package com.fatogeral.backend.controller;

import com.fatogeral.backend.dto.AnalysisRequest;
import com.fatogeral.backend.dto.AnalysisResponse;
import com.fatogeral.backend.service.AnalysisService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
            @AuthenticationPrincipal UserDetails userDetails) {

        AnalysisResponse response = analysisService.createAnalysis(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnalysisResponse> getById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {

        AnalysisResponse response = analysisService.getById(id, userDetails.getUsername());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<AnalysisResponse>> getHistory(
            @AuthenticationPrincipal UserDetails userDetails) {

        List<AnalysisResponse> response = analysisService.getHistory(userDetails.getUsername());
        return ResponseEntity.ok(response);
    }
}