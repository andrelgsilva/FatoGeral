package com.fatogeral.backend.service;

import com.fatogeral.backend.dto.AnalysisResponse;
import com.fatogeral.backend.dto.ReviewRequest;
import com.fatogeral.backend.entity.Analysis;
import com.fatogeral.backend.entity.User;
import com.fatogeral.backend.repository.AnalysisRepository;
import com.fatogeral.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AdminService {

    private final AnalysisRepository analysisRepository;
    private final UserRepository userRepository;

    public AdminService(AnalysisRepository analysisRepository, UserRepository userRepository) {
        this.analysisRepository = analysisRepository;
        this.userRepository = userRepository;
    }

    public AnalysisResponse reviewAnalysis(UUID id, ReviewRequest request, String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        Analysis analysis = analysisRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Análise não encontrada"));

        analysis.setVerdict(request.getVerdict());
        if (request.getJustification() != null) {
            analysis.setJustification(request.getJustification());
        }
        analysis.setReviewedAt(LocalDateTime.now());
        analysis.setReviewedBy(admin);

        analysisRepository.save(analysis);

        return AnalysisResponse.from(analysis, List.of());
    }
}