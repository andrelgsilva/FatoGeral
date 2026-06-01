package com.fatogeral.backend.controller;

import com.fatogeral.backend.dto.TrendResponse;
import com.fatogeral.backend.service.AnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trends")
@Tag(name = "Tendências", description = "Endpoint público de tendências")
public class TrendsController {

    private final AnalysisService analysisService;

    public TrendsController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @Operation(
        summary = "Top veredictos mais recentes",
        responses = {
            @ApiResponse(responseCode = "200", description = "Tendências retornadas com sucesso")
        }
    )
    @GetMapping
    public ResponseEntity<List<TrendResponse>> getTrends() {
        List<TrendResponse> response = analysisService.getTrends();
        return ResponseEntity.ok(response);
    }
}