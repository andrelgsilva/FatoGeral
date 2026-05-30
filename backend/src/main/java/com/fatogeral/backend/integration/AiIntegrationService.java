package com.fatogeral.backend.integration;

import com.fatogeral.backend.dto.AiAnalysisResult;
import org.springframework.stereotype.Service;

@Service
public class AiIntegrationService {

    public AiAnalysisResult analyze(String content) {
        // Mock temporário — será substituído pela integração real com Groq/Azure AI
        return new AiAnalysisResult(
                "Alta probabilidade de Fake News",
                0.87,
                "O conteúdo apresenta características comuns de desinformação: " +
                "ausência de fontes confiáveis, linguagem sensacionalista e informações não verificáveis.",
                java.util.List.of()
        );
    }
}