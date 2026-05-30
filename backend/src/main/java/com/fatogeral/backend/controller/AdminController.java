package com.fatogeral.backend.controller;

import com.fatogeral.backend.dto.AnalysisResponse;
import com.fatogeral.backend.dto.ReviewRequest;
import com.fatogeral.backend.entity.AnalysisStatus;
import com.fatogeral.backend.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PutMapping("/analysis/{id}/review")
    public ResponseEntity<AnalysisResponse> reviewAnalysis(
            @PathVariable UUID id,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal String adminEmail) {

        AnalysisResponse response = adminService.reviewAnalysis(id, request, adminEmail);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/analyses")
    public ResponseEntity<List<AnalysisResponse>> getAllAnalyses(
            @RequestParam(required = false) AnalysisStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Boolean reviewed,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<AnalysisResponse> response = adminService.getAllAnalyses(status, date, reviewed, page, size);
        return ResponseEntity.ok(response);
    }
}