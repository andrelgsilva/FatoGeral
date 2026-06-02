package com.fatogeral.backend.controller;

import com.fatogeral.backend.dto.AnalysisRequest;
import com.fatogeral.backend.dto.AnalysisResponse;
import com.fatogeral.backend.service.AnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/analysis")
@Tag(name = "Análises", description = "Endpoints de análise de conteúdo")
@SecurityRequirement(name = "Bearer Authentication")
public class AnalysisController {

    private final AnalysisService analysisService;

    public AnalysisController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @Operation(
        summary = "Criar nova análise",
        responses = {
            @ApiResponse(responseCode = "201", description = "Análise criada com sucesso",
                content = @Content(schema = @Schema(implementation = AnalysisResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos", content = @Content),
            @ApiResponse(responseCode = "401", description = "Não autenticado", content = @Content)
        }
    )
    @PostMapping
    public ResponseEntity<AnalysisResponse> createAnalysis(
            @Valid @RequestBody AnalysisRequest request,
            @AuthenticationPrincipal String userEmail) {

        AnalysisResponse response = analysisService.createAnalysis(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(
        summary = "Buscar análise por ID",
        responses = {
            @ApiResponse(responseCode = "200", description = "Análise encontrada",
                content = @Content(schema = @Schema(implementation = AnalysisResponse.class))),
            @ApiResponse(responseCode = "404", description = "Análise não encontrada", content = @Content),
            @ApiResponse(responseCode = "401", description = "Não autenticado", content = @Content)
        }
    )
    @GetMapping("/{id}")
    public ResponseEntity<AnalysisResponse> getById(
            @Parameter(description = "ID da análise") @PathVariable UUID id,
            @AuthenticationPrincipal String userEmail) {

        AnalysisResponse response = analysisService.getById(id, userEmail);
        return ResponseEntity.ok(response);
    }

    @Operation(
        summary = "Histórico de análises do usuário",
        responses = {
            @ApiResponse(responseCode = "200", description = "Histórico retornado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Não autenticado", content = @Content)
        }
    )
    @GetMapping("/history")
    public ResponseEntity<Page<AnalysisResponse>> getHistory(
            @AuthenticationPrincipal String userEmail,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {

        Page<AnalysisResponse> response = analysisService.getHistory(userEmail, pageable);
        return ResponseEntity.ok(response);
    }
}