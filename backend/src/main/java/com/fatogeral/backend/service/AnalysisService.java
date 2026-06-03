package com.fatogeral.backend.service;

import com.fatogeral.backend.dto.AnalysisRequest;
import com.fatogeral.backend.dto.AnalysisResponse;
import com.fatogeral.backend.dto.TrendResponse;
import com.fatogeral.backend.entity.Analysis;
import com.fatogeral.backend.entity.AnalysisStatus;
import com.fatogeral.backend.entity.Role;
import com.fatogeral.backend.entity.User;
import com.fatogeral.backend.integration.AiIntegrationPort;
import com.fatogeral.backend.repository.AnalysisRepository;
import com.fatogeral.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class AnalysisService {

    private static final Logger log = LoggerFactory.getLogger(AnalysisService.class);

    private final AnalysisRepository analysisRepository;
    private final UserRepository userRepository;
    private final AiIntegrationPort aiIntegrationService;

    public AnalysisService(AnalysisRepository analysisRepository,
                           UserRepository userRepository,
                           AiIntegrationPort aiIntegrationService) {
        this.analysisRepository = analysisRepository;
        this.userRepository = userRepository;
        this.aiIntegrationService = aiIntegrationService;
    }

    public AnalysisResponse createAnalysis(AnalysisRequest request, String userEmail) {
        log.info("Iniciando criação de análise para usuário: {}", userEmail);
        log.info("Payload recebido - inputText preenchido: {}, inputUrl preenchida: {}",
                request.getInputText() != null && !request.getInputText().isBlank(),
                request.getInputUrl() != null && !request.getInputUrl().isBlank());

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> {
                    log.error("Usuário não encontrado para email: {}", userEmail);
                    return new EntityNotFoundException("Usuário não encontrado");
                });

        Analysis analysis = Analysis.builder()
                .user(user)
                .inputText(request.getInputText())
                .inputUrl(request.getInputUrl())
                .status(AnalysisStatus.PENDING)
                .build();

        try {
            analysisRepository.save(analysis);
            log.info("Análise salva inicialmente com status PENDING. ID: {}", analysis.getId());
        } catch (Exception e) {
            log.error("Erro ao salvar análise inicial no banco", e);
            throw e;
        }

        try {
            String content = request.getInputText() != null && !request.getInputText().isBlank()
                    ? request.getInputText()
                    : request.getInputUrl();

            log.info("Chamando integração de IA para análise ID: {}", analysis.getId());

            var result = aiIntegrationService.analyze(content);

            log.info("Resultado da IA recebido para análise ID: {}. Verdict: {}, Confidence: {}",
                    analysis.getId(), result.getVerdict(), result.getConfidence());

            analysis.setVerdict(result.getVerdict());
            analysis.setConfidence(BigDecimal.valueOf(result.getConfidence()));
            analysis.setJustification(result.getJustification());
            analysis.setStatus(AnalysisStatus.DONE);

            analysisRepository.save(analysis);

            log.info("Análise concluída com sucesso. ID: {}", analysis.getId());

            return AnalysisResponse.from(analysis, result.getSources());

        } catch (Exception e) {
            log.error("Erro ao processar análise com IA. ID: {}", analysis.getId(), e);

            try {
                analysis.setVerdict("INCONCLUSIVO");
                analysis.setConfidence(BigDecimal.valueOf(0.0));

                analysis.setJustification(
                    "Erro real: " + e.getClass().getSimpleName() + " - " + e.getMessage()
                );

                analysis.setStatus(AnalysisStatus.ERROR);
                
                analysis.setStatus(AnalysisStatus.ERROR);

                analysisRepository.save(analysis);

                log.info("Análise marcada como ERROR após falha. ID: {}", analysis.getId());

                return AnalysisResponse.from(analysis, List.of());

            } catch (Exception saveError) {
                log.error("Erro ao salvar análise com status ERROR. ID: {}", analysis.getId(), saveError);
                throw saveError;
            }
        }
    }

    public AnalysisResponse getById(UUID id, String userEmail) {
        log.info("Buscando análise por ID: {} para usuário: {}", id, userEmail);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        Analysis analysis = analysisRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Análise não encontrada"));

        boolean isOwner = analysis.getUser() != null &&
                analysis.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            log.warn("Acesso negado à análise {} pelo usuário {}", id, userEmail);
            throw new EntityNotFoundException("Análise não encontrada");
        }

        return AnalysisResponse.from(analysis, List.of());
    }

    public Page<AnalysisResponse> getHistory(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        return analysisRepository.findByUser(user, pageable)
                .map(a -> AnalysisResponse.from(a, List.of()));
    }

    public List<TrendResponse> getTrends() {
        log.info("Buscando tendências de análises");
        return analysisRepository.findTopVerdicts();
    }
}