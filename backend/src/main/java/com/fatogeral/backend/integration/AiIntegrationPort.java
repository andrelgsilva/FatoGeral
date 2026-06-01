package com.fatogeral.backend.integration;

import com.fatogeral.backend.dto.AiAnalysisResult;

public interface AiIntegrationPort {
    AiAnalysisResult analyze(String content);
}