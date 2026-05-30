package com.fatogeral.backend.service;

import com.fatogeral.backend.dto.AnalysisRequest;
import com.fatogeral.backend.dto.AnalysisResponse;
import com.fatogeral.backend.dto.SourceResponse;
import com.fatogeral.backend.entity.Analysis;
import com.fatogeral.backend.entity.AnalysisStatus;
import com.fatogeral.backend.entity.Role;
import com.fatogeral.backend.entity.User;
import com.fatogeral.backend.integration.AiIntegrationService;
import com.fatogeral.backend.repository.AnalysisRepository;
import com.fatogeral.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class AnalysisService {

    private final AnalysisRepository analysisRepository;
    private final UserRepository userRepository;
    private final AiIntegrationService aiIntegrationService;

    public AnalysisService(AnalysisRepository analysisRepository,
                           UserRepository userRepository,
                           AiIntegrationService aiIntegrationService) {
        this.analysisRepository = analysisRepository;
        this.userRepository = userRepository;
        this.aiIntegrationService = aiIntegrationService;
    }

    public AnalysisResponse createAnalysis(AnalysisRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        Analysis analysis = Analysis.builder()
                .user(user)
                .inputText(request.getInputText())
                .inputUrl(request.getInputUrl())
                .status(AnalysisStatus.PENDING)
                .build();

        analysisRepository.save(analysis);

        try {
            String content = request.getInputText() != null ? request.getInputText() : request.getInputUrl();
            var result = aiIntegrationService.analyze(content);

            analysis.setVerdict(result.getVerdict());
            analysis.setConfidence(BigDecimal.valueOf(result.getConfidence()));
            analysis.setJustification(result.getJustification());
            analysis.setStatus(AnalysisStatus.DONE);

            analysisRepository.save(analysis);

            return AnalysisResponse.from(analysis, result.getSources());

        } catch (Exception e) {
            analysis.setStatus(AnalysisStatus.ERROR);
            analysisRepository.save(analysis);
            throw new RuntimeException("Erro ao processar análise com IA");
        }
    }

    public AnalysisResponse getById(UUID id, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        Analysis analysis = analysisRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Análise não encontrada"));

        boolean isOwner = analysis.getUser() != null &&
                analysis.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new EntityNotFoundException("Análise não encontrada");
        }

        return AnalysisResponse.from(analysis, List.of());
    }

    public List<AnalysisResponse> getHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        return analysisRepository.findByUser(user)
                .stream()
                .map(a -> AnalysisResponse.from(a, List.of()))
                .toList();
    }

    public List<TrendResponse> getTrends() {
        return analysisRepository.findTopVerdicts();
    }
}