package com.fatogeral.backend.controller;

import com.fatogeral.backend.dto.AnalysisResponse;
import com.fatogeral.backend.dto.ReviewRequest;
import com.fatogeral.backend.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/analysis")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PutMapping("/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnalysisResponse> reviewAnalysis(
            @PathVariable UUID id,
            @Valid @RequestBody ReviewRequest request,
            @org.springframework.security.core.annotation.AuthenticationPrincipal String adminEmail) {

        AnalysisResponse response = adminService.reviewAnalysis(id, request, adminEmail);
        return ResponseEntity.ok(response);
    }
}